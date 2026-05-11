import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeUrl } from "@/lib/scanner/url-normalizer";

import { FINGERPRINT_HEADER } from "@/lib/client-fingerprint";
// Re-export so client components can import FINGERPRINT_HEADER from client-fingerprint
// without pulling this server-only module (crypto/prisma) into the browser bundle.
export { FINGERPRINT_HEADER };
const FREE_SCAN_LIMIT = 3;
const FREE_FIX_ABUSE_THRESHOLD = 60;
const COMMON_DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "dispostable.com",
  "fakeinbox.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "sharklasers.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
]);

export type FreeFixState =
  | "sign_in_required"
  | "verified_email_required"
  | "disposable_email"
  | "monthly_limit"
  | "domain_cooldown"
  | "abuse_hold"
  | "granted"
  | "paid";

export type FreeFixStatus = {
  state: FreeFixState;
  message: string;
  rootDomain?: string;
  claimedAt?: string;
};

export type FreeScanAccess = {
  allowed: boolean;
  used: number;
  limit: number;
  reason?: "fingerprint_limit" | "ip_limit";
};

type FreeFixDecisionInput = {
  scanId?: string;
  scanUrl: string;
  userId: string | null;
  userTier: string;
  email: string | null;
  emailVerified: Date | null;
  fingerprintHash: string | null;
  ipHash: string | null;
};

export function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || null;
}

export function readFingerprint(request: NextRequest): string | null {
  const raw = request.headers.get(FINGERPRINT_HEADER)?.trim();
  if (!raw) return null;
  const normalized = raw.toLowerCase().replace(/[^a-f0-9]/g, "").slice(0, 128);
  return normalized || null;
}

export function hashSignal(value: string | null): string | null {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmailIdentity(email: string): string {
  const normalized = email.trim().toLowerCase();
  const [localPartRaw, domainRaw = ""] = normalized.split("@");
  const domain = domainRaw === "googlemail.com" ? "gmail.com" : domainRaw;
  let localPart = localPartRaw;

  if (domain === "gmail.com") {
    localPart = localPart.replace(/\./g, "");
  }

  const plusIndex = localPart.indexOf("+");
  if (plusIndex >= 0) {
    localPart = localPart.slice(0, plusIndex);
  }

  return `${localPart}@${domain}`;
}

export function getEmailDomain(email: string): string {
  return normalizeEmailIdentity(email).split("@")[1] ?? "";
}

export function isDisposableEmailDomain(domain: string): boolean {
  return COMMON_DISPOSABLE_EMAIL_DOMAINS.has(domain.trim().toLowerCase());
}

export function extractRootDomain(rawUrl: string): string {
  const hostname = new URL(normalizeUrl(rawUrl)).hostname.toLowerCase().replace(/^www\./, "");
  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;

  const compoundTlds = new Set([
    "co.uk",
    "org.uk",
    "ac.uk",
    "co.jp",
    "com.au",
    "net.au",
    "org.au",
    "com.br",
    "com.mx",
    "co.nz",
  ]);
  const tail = parts.slice(-2).join(".");
  if (compoundTlds.has(tail) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

const abuseScoreCache = new Map<string, { score: number; expiresAt: number }>();
const ABUSE_CACHE_TTL_MS = 60_000; // 1 minute

function monthWindowStart(now = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function rollingDaysAgo(days: number, now = new Date()): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function buildFreeFixStatus(state: FreeFixState, rootDomain?: string, claimedAt?: Date): FreeFixStatus {
  const messages: Record<FreeFixState, string> = {
    sign_in_required: "Sign in with a verified email to claim your free sample fix.",
    verified_email_required: "Verify a real email address before ConduitScore unlocks your free sample fix.",
    disposable_email: "Disposable inboxes cannot be used to claim the free sample fix.",
    monthly_limit: "Your one free sample fix for this month has already been claimed.",
    domain_cooldown: "A free sample fix was already claimed for this domain in the last 30 days.",
    abuse_hold: "We paused the free sample fix on this device because the request pattern looks abusive.",
    granted: "Your free sample fix is unlocked for this domain.",
    paid: "Paid plans include all fixes.",
  };

  return {
    state,
    message: messages[state],
    rootDomain,
    claimedAt: claimedAt?.toISOString(),
  };
}

export async function checkFreeScanAccess(
  fingerprintHash: string | null,
  ipHash: string | null
): Promise<FreeScanAccess> {
  const since = monthWindowStart();

  if (fingerprintHash) {
    const used = await prisma.scan.count({
      where: {
        createdAt: { gte: since },
        fingerprintHash,
      },
    });

    return {
      allowed: used < FREE_SCAN_LIMIT,
      used,
      limit: FREE_SCAN_LIMIT,
      reason: used < FREE_SCAN_LIMIT ? undefined : "fingerprint_limit",
    };
  }

  if (ipHash) {
    const used = await prisma.scan.count({
      where: {
        createdAt: { gte: since },
        ipHash,
      },
    });

    return {
      allowed: used < FREE_SCAN_LIMIT,
      used,
      limit: FREE_SCAN_LIMIT,
      reason: used < FREE_SCAN_LIMIT ? undefined : "ip_limit",
    };
  }

  // Both signals are absent (proxy, curl, or CDN masking) — deny rather than
  // allow unconditionally, which would bypass the scan limit entirely.
  return { allowed: false, used: FREE_SCAN_LIMIT, limit: FREE_SCAN_LIMIT, reason: "fingerprint_limit" };
}

async function calculateAbuseScore(
  normalizedEmail: string,
  fingerprintHash: string | null,
  ipHash: string | null
): Promise<number> {
  const cacheKey = `${normalizedEmail}:${fingerprintHash ?? ""}:${ipHash ?? ""}`;
  const cached = abuseScoreCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.score;

  const since = rollingDaysAgo(30);
  let score = 0;

  if (fingerprintHash) {
    const [recentScans, recentClaims, distinctEmails] = await Promise.all([
      prisma.scan.count({
        where: {
          createdAt: { gte: since },
          fingerprintHash,
        },
      }),
      prisma.freeFixClaim.count({
        where: {
          createdAt: { gte: since },
          fingerprintHash,
        },
      }),
      prisma.freeFixClaim.findMany({
        where: {
          createdAt: { gte: since },
          fingerprintHash,
        },
        distinct: ["normalizedEmail"],
        select: { normalizedEmail: true },
      }),
    ]);

    if (recentScans > FREE_SCAN_LIMIT) score += 20;
    if (recentClaims >= 1) score += 25;
    if (distinctEmails.length >= 2) score += 35;
  }

  if (ipHash) {
    const [recentClaims, distinctEmails] = await Promise.all([
      prisma.freeFixClaim.count({
        where: {
          createdAt: { gte: since },
          ipHash,
        },
      }),
      prisma.freeFixClaim.findMany({
        where: {
          createdAt: { gte: since },
          ipHash,
        },
        distinct: ["normalizedEmail"],
        select: { normalizedEmail: true },
      }),
    ]);

    if (recentClaims >= 2) score += 20;
    if (distinctEmails.length >= 3) score += 20;
  }

  const claimsForEmail = await prisma.freeFixClaim.count({
    where: {
      createdAt: { gte: since },
      normalizedEmail,
    },
  });
  if (claimsForEmail >= 1) score += 15;

  // Evict stale entries to prevent unbounded growth
  const now = Date.now();
  for (const [k, v] of abuseScoreCache) {
    if (v.expiresAt <= now) abuseScoreCache.delete(k);
  }
  abuseScoreCache.set(cacheKey, { score, expiresAt: now + ABUSE_CACHE_TTL_MS });

  return score;
}

export async function resolveFreeFixStatus(input: FreeFixDecisionInput): Promise<FreeFixStatus> {
  const { scanId, scanUrl, userId, userTier, email, emailVerified, fingerprintHash, ipHash } = input;

  if (["starter", "pro", "growth", "agency"].includes(userTier)) {
    return buildFreeFixStatus("paid");
  }

  const rootDomain = extractRootDomain(scanUrl);

  if (!userId || !email) {
    return buildFreeFixStatus("sign_in_required", rootDomain);
  }

  if (!emailVerified) {
    return buildFreeFixStatus("verified_email_required", rootDomain);
  }

  const normalizedEmail = normalizeEmailIdentity(email);
  const emailDomain = getEmailDomain(email);

  if (isDisposableEmailDomain(emailDomain)) {
    return buildFreeFixStatus("disposable_email", rootDomain);
  }

  const now = new Date();
  const monthStart = monthWindowStart(now);
  const domainCooldownStart = rollingDaysAgo(30, now);

  const existingClaim = await prisma.freeFixClaim.findFirst({
    where: {
      normalizedEmail,
      rootDomain,
      createdAt: { gte: domainCooldownStart },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingClaim) {
    return buildFreeFixStatus("granted", rootDomain, existingClaim.createdAt);
  }

  const [monthlyClaim, domainClaimByOther] = await Promise.all([
    prisma.freeFixClaim.findFirst({
      where: {
        normalizedEmail,
        createdAt: { gte: monthStart },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.freeFixClaim.findFirst({
      where: {
        rootDomain,
        createdAt: { gte: domainCooldownStart },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (monthlyClaim) {
    return buildFreeFixStatus("monthly_limit", rootDomain, monthlyClaim.createdAt);
  }

  if (domainClaimByOther) {
    return buildFreeFixStatus("domain_cooldown", rootDomain, domainClaimByOther.createdAt);
  }

  const abuseScore = await calculateAbuseScore(normalizedEmail, fingerprintHash, ipHash);
  if (abuseScore >= FREE_FIX_ABUSE_THRESHOLD) {
    return buildFreeFixStatus("abuse_hold", rootDomain);
  }

  const claim = await prisma.freeFixClaim.create({
    data: {
      userId,
      scanId: scanId ?? null,
      normalizedEmail,
      emailDomain,
      rootDomain,
      fingerprintHash,
      ipHash,
      abuseScore,
    },
  });

  return buildFreeFixStatus("granted", rootDomain, claim.createdAt);
}
