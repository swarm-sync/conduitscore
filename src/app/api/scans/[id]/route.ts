import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { scanRecordToResult } from "@/lib/scanner/scan-record";
import type { Fix, Issue } from "@/lib/scanner/types";
import { getRequestUser } from "@/lib/api-auth";
import { PLAN_FEATURES } from "@/lib/plan-limits";
import { getSession } from "@/lib/session";
import {
  IMPACT_MAP,
  SCORE_IMPACT,
  EFFORT_MINUTES,
  DEFAULT_SCORE_IMPACT,
  DEFAULT_EFFORT_MINUTES,
} from "@/lib/scanner/fix-meta";
import {
  getClientIp,
  hashSignal,
  readFingerprint,
  resolveFreeFixStatus,
} from "@/lib/free-tier-abuse";

/** Tiers that receive full (unlocked) fix content. */
const PAID_TIERS = new Set(["starter", "pro", "growth", "agency"]);

/**
 * Severity ordering used to choose the sample fix for free-tier users.
 * Lower rank = lower severity = preferred as the free sample.
 */
const SEVERITY_ORDER: Record<string, number> = { info: 0, warning: 1, critical: 2 };

/** Enrich issues with plain-English impact statements (returned for all tiers). */
function enrichIssues(issues: Issue[]): Issue[] {
  return issues.map((issue) => ({
    ...issue,
    impact:
      IMPACT_MAP[issue.id] ??
      "Resolving this issue will improve your AI visibility score.",
  }));
}

function applyIssueGate(issues: Issue[]): Issue[] {
  return issues.map((issue) => ({
    ...issue,
    description: "",
  }));
}

/** Enrich fixes with scoreImpact + effortMinutes (returned for all tiers). */
function enrichFixes(fixes: Fix[]): Fix[] {
  return fixes.map((fix) => ({
    ...fix,
    scoreImpact: SCORE_IMPACT[fix.issueId] ?? DEFAULT_SCORE_IMPACT,
    effortMinutes: EFFORT_MINUTES[fix.issueId] ?? DEFAULT_EFFORT_MINUTES,
    locked: false,
  }));
}

/**
 * Return the index of the sample fix for free-tier users.
 * Selects the fix whose linked issue has the lowest severity
 * (info < warning < critical), falling back to index 0.
 */
function sampleFixIndex(fixes: Fix[], issues: Issue[]): number {
  if (fixes.length === 0) return 0;

  const sevByIssueId = new Map<string, string>(
    issues.map((iss) => [iss.id, iss.severity])
  );

  let bestIdx = 0;
  let bestRank = Infinity;

  for (let i = 0; i < fixes.length; i++) {
    const sev = sevByIssueId.get(fixes[i].issueId) ?? "critical";
    const rank = SEVERITY_ORDER[sev] ?? 2;
    if (rank < bestRank) {
      bestRank = rank;
      bestIdx = i;
    }
  }

  return bestIdx;
}

/**
 * Gate the fixes array for free-tier / unauthenticated users.
 *
 * One fix (the sample) is returned fully unlocked with sampleLabel set.
 * All other fixes have code and description replaced with empty strings,
 * locked set to true, and charCount set to the original code length so
 * the UI can display a "locked — N chars" indicator.
 */
function applyFixGate(fixes: Fix[], issues: Issue[]): Fix[] {
  if (fixes.length === 0) return fixes;

  const sampleIdx = sampleFixIndex(fixes, issues);

  return fixes.map((fix, i) => {
    if (i === sampleIdx) {
      return { ...fix, locked: false, sampleLabel: "Free sample" };
    }

    const charCount = fix.code.length;

    return {
      ...fix,
      // Strip content — empty string keeps the type as `string` for UI safety.
      code: "",
      description: "",
      locked: true,
      charCount,
    };
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getRequestUser(_request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    // Public/anonymous scans (userId == null) are always accessible without auth.
    // Scans owned by a user require that the requesting session matches.
    // If the scan has an owner but no session is present, return 403 immediately
    // rather than silently serving the scan to an unauthenticated caller.
    if (scan.userId) {
      if (!auth.user) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (auth.user.id !== scan.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Determine subscription tier for gating decisions.
    let userTier = "free";
    if (auth.user) {
      userTier = auth.user.subscriptionTier ?? "free";
    }
    const isPaid = PAID_TIERS.has(userTier);
    const fingerprintHash = hashSignal(readFingerprint(_request));
    const ipHash = hashSignal(getClientIp(_request));

    const result = scanRecordToResult(scan);

    const enrichedIssues = enrichIssues(result.issues);
    const finalIssues = PLAN_FEATURES.issueDescriptions(userTier)
      ? enrichedIssues
      : applyIssueGate(enrichedIssues);
    const enrichedFixes = enrichFixes(result.fixes);
    const freeFixStatus = isPaid
      ? { state: "paid", message: "Paid plans include all fixes." }
      : await resolveFreeFixStatus({
          scanId: scan.id,
          scanUrl: scan.url,
          userId: auth.user?.id ?? null,
          userTier,
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
      ...result,
      issues: finalIssues,
      fixes: finalFixes,
      metadata: {
        ...(result.metadata ?? {}),
        freeFixStatus,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const scan = await prisma.scan.findUnique({ where: { id } });
    if (!scan || scan.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.scan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
