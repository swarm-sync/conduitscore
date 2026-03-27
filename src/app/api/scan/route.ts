import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeUrl } from "@/lib/scanner/url-normalizer";
import { getRequestUser } from "@/lib/api-auth";
import type { Fix, Issue } from "@/lib/scanner/types";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import {
  IMPACT_MAP,
  SCORE_IMPACT,
  EFFORT_MINUTES,
  DEFAULT_SCORE_IMPACT,
  DEFAULT_EFFORT_MINUTES,
} from "@/lib/scanner/fix-meta";
import { PLAN_FEATURES } from "@/lib/plan-limits";
import {
  checkFreeScanAccess,
  getClientIp,
  hashSignal,
  readFingerprint,
  resolveFreeFixStatus,
} from "@/lib/free-tier-abuse";

const SEVERITY_ORDER: Record<string, number> = { info: 0, warning: 1, critical: 2 };

function enrichIssues(issues: Issue[]): Issue[] {
  return issues.map((issue) => ({
    ...issue,
    impact: IMPACT_MAP[issue.id] ?? "Resolving this issue will improve your AI visibility score.",
  }));
}

function enrichFixes(fixes: Fix[]): Fix[] {
  return fixes.map((fix) => ({
    ...fix,
    scoreImpact: SCORE_IMPACT[fix.issueId] ?? DEFAULT_SCORE_IMPACT,
    effortMinutes: EFFORT_MINUTES[fix.issueId] ?? DEFAULT_EFFORT_MINUTES,
    locked: false,
  }));
}

function sampleFixIndex(fixes: Fix[], issues: Issue[]): number {
  if (fixes.length === 0) return 0;
  const sevByIssueId = new Map<string, string>(issues.map((i) => [i.id, i.severity]));
  let bestIdx = 0;
  let bestRank = Infinity;
  for (let i = 0; i < fixes.length; i++) {
    const rank = SEVERITY_ORDER[sevByIssueId.get(fixes[i].issueId) ?? "critical"] ?? 2;
    if (rank < bestRank) { bestRank = rank; bestIdx = i; }
  }
  return bestIdx;
}

function applyFixGate(fixes: Fix[], issues: Issue[]): Fix[] {
  if (fixes.length === 0) return fixes;
  const sampleIdx = sampleFixIndex(fixes, issues);
  return fixes.map((fix, i) => {
    if (i === sampleIdx) return { ...fix, locked: false, sampleLabel: "Free sample" };
    return { ...fix, code: "", description: "", locked: true, charCount: fix.code.length };
  });
}

function lockAllFixes(fixes: Fix[]): Fix[] {
  return fixes.map((fix) => ({
    ...fix,
    code: "",
    description: "",
    locked: true,
    charCount: fix.code.length,
  }));
}

function applyIssueGate(issues: Issue[]): Issue[] {
  return issues.map((issue) => ({ ...issue, description: "" }));
}

// Monthly scan limits per tier
const TIER_LIMITS: Record<string, number> = {
  free:    3,
  starter: 50,
  pro:     100,
  growth:  500,
  agency:  Infinity,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize first (prepends https:// if missing), then validate
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeUrl(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
    }
    const fingerprintHash = hashSignal(readFingerprint(request));
    const ipHash = hashSignal(getClientIp(request));

    if (!process.env.DATABASE_URL) {
      const result = await runScan(normalizedUrl, `ephemeral_${Date.now()}`);
      const enrichedIssues = applyIssueGate(enrichIssues(result.issues));
      const gatedFixes = lockAllFixes(enrichFixes(result.fixes));
      return NextResponse.json({
        status: "completed",
        ...result,
        issues: enrichedIssues,
        fixes: gatedFixes,
        metadata: {
          ...(result.metadata ?? {}),
          freeFixStatus: {
            state: "sign_in_required",
            message: "Sign in with a verified email to claim your free sample fix.",
          },
        },
      });
    }

    const auth = await getRequestUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    let userId: string | undefined;
    if (auth.user) {
      userId = auth.user.id;

      // Reset monthly count if new billing period has started
      const now = new Date();
      const resetAt = new Date(auth.user.scanResetAt);
      const monthsElapsed =
        (now.getFullYear() - resetAt.getFullYear()) * 12 +
        (now.getMonth() - resetAt.getMonth());

      let scanCount = auth.user.scanCountMonth;
      if (monthsElapsed >= 1) {
        await prisma.user.update({
          where: { id: auth.user.id },
          data: { scanCountMonth: 0, scanResetAt: now },
        });
        scanCount = 0;
      }

      const tier = auth.user.subscriptionTier ?? "free";
      const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free;

      if (scanCount >= limit) {
        return NextResponse.json(
          {
            error: `You've used all ${limit} scans for this month on the ${tier} plan.`,
            upgradeRequired: true,
            tier,
            limit,
            used: scanCount,
          },
          { status: 402 }
        );
      }

      if (tier === "free") {
        const scanAccess = await checkFreeScanAccess(fingerprintHash, ipHash);
        if (!scanAccess.allowed) {
          return NextResponse.json(
            {
              error: `You've used all ${scanAccess.limit} free scans for this month on this device/browser.`,
              upgradeRequired: true,
              tier,
              limit: scanAccess.limit,
              used: scanAccess.used,
            },
            { status: 402 }
          );
        }
      }

      await prisma.user.update({
        where: { id: auth.user.id },
        data: { scanCountMonth: { increment: 1 } },
      });
    } else {
      const scanAccess = await checkFreeScanAccess(fingerprintHash, ipHash);
      if (!scanAccess.allowed) {
        return NextResponse.json(
          {
            error: `You've used all ${scanAccess.limit} free scans for this month on this device/browser.`,
            upgradeRequired: true,
            tier: "free",
            limit: scanAccess.limit,
            used: scanAccess.used,
          },
          { status: 402 }
        );
      }
    }

    const scan = await prisma.scan.create({
      data: {
        url: normalizedUrl,
        status: "running",
        userId,
        fingerprintHash,
        ipHash,
      },
      select: { id: true },
    });

    try {
      const result = await runScan(normalizedUrl, scan.id);

      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: "completed",
          overallScore: result.overallScore,
          categoryScores: result.categories as unknown as InputJsonValue,
          issues: result.issues as unknown as InputJsonValue,
          fixes: result.fixes as unknown as InputJsonValue,
          metadata: {
            ...(result.metadata ?? {}),
            proof: result.proof ?? null,
          } as unknown as InputJsonValue,
          completedAt: new Date(result.scannedAt),
        },
      });

      // Apply free-tier gate before returning — the saved raw data is in DB,
      // but the client response must match what the gated GET endpoint returns.
      const tier = auth.user?.subscriptionTier ?? "free";
      const isPaid = ["starter", "pro", "growth", "agency"].includes(tier);
      const enrichedIssues = enrichIssues(result.issues);
      const finalIssues = PLAN_FEATURES.issueDescriptions(tier)
        ? enrichedIssues
        : applyIssueGate(enrichedIssues);
      const enrichedFixes = enrichFixes(result.fixes);
      const freeFixStatus = isPaid
        ? { state: "paid", message: "Paid plans include all fixes." }
        : await resolveFreeFixStatus({
            scanId: scan.id,
            scanUrl: normalizedUrl,
            userId: auth.user?.id ?? null,
            userTier: tier,
            email: auth.user?.email ?? null,
            emailVerified: auth.user?.emailVerified ?? null,
            fingerprintHash,
            ipHash,
          });
      const finalFixes = isPaid
        ? enrichedFixes
        : freeFixStatus.state === "granted"
        ? applyFixGate(enrichedFixes, finalIssues)
        : lockAllFixes(enrichedFixes);

      return NextResponse.json({
        id: scan.id,
        status: "completed",
        ...result,
        issues: finalIssues,
        fixes: finalFixes,
        metadata: {
          ...(result.metadata ?? {}),
          freeFixStatus,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Scan failed";
      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: "failed",
          metadata: { error: message } as unknown as InputJsonValue,
        },
      });
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
