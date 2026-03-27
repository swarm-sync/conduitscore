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

function lockAllFixes(fixes: Fix[]): Fix[] {
  return fixes.map((fix) => ({
    ...fix,
    code: "",
    description: "",
    locked: true,
    charCount: fix.code.length,
  }));
}

/**
 * GET /api/scans/[id]/report
 *
 * Public shareable report — no auth required.
 * Fixes stay locked here; the free sample fix is only granted to a verified
 * signed-in free user after the abuse checks pass.
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
    const gatedFixes = lockAllFixes(enrichedFixes);

    return NextResponse.json({
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
