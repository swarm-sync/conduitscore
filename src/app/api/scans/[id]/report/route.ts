import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { scanRecordToResult } from "@/lib/scanner/scan-record";
import type { Fix, Issue } from "@/lib/scanner/types";
import {
  IMPACT_MAP,
  SCORE_IMPACT,
  EFFORT_MINUTES,
  DEFAULT_SCORE_IMPACT,
  DEFAULT_EFFORT_MINUTES,
} from "@/lib/scanner/fix-meta";

/** Severity ordering: lower rank = lower severity = preferred as free sample. */
const SEVERITY_ORDER: Record<string, number> = { info: 0, warning: 1, critical: 2 };

/** Enrich issues with plain-English impact statements (all tiers). */
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

/** Enrich fixes with scoreImpact + effortMinutes (all tiers). */
function enrichFixes(fixes: Fix[]): Fix[] {
  return fixes.map((fix) => ({
    ...fix,
    scoreImpact: SCORE_IMPACT[fix.issueId] ?? DEFAULT_SCORE_IMPACT,
    effortMinutes: EFFORT_MINUTES[fix.issueId] ?? DEFAULT_EFFORT_MINUTES,
    locked: false,
  }));
}

/** Select the index of the lowest-severity fix to use as the free sample. */
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
 * Apply free-tier fix gate.
 * One fix (the sample) is fully unlocked; all others have code/description
 * stripped and locked: true set, with charCount preserving the original length.
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
      code: "",
      description: "",
      locked: true,
      charCount,
    };
  });
}

/**
 * GET /api/scans/[id]/report
 *
 * Public shareable report — no auth required.
 * Free-tier gate is ALWAYS applied (unauthenticated = free access level).
 * One fix is returned as a full sample; all others are locked.
 * Issues include impact statements for all callers.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    const result = scanRecordToResult(scan);

    const enrichedIssues = applyIssueGate(enrichIssues(result.issues));
    const enrichedFixes = enrichFixes(result.fixes);
    const gatedFixes = applyFixGate(enrichedFixes, enrichedIssues);

    return NextResponse.json({
      ...result,
      issues: enrichedIssues,
      fixes: gatedFixes,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
