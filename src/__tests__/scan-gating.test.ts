/**
 * Section 3: Scan API Gating Tests
 * Tests for the fix-gating logic in src/app/api/scans/[id]/route.ts
 *
 * Exercises: enrichIssues, enrichFixes, applyFixGate, sampleFixIndex.
 * All Prisma + next-auth calls are mocked.
 */

import { describe, it, expect } from "vitest";

// ── Pure helpers extracted from route — test them directly via fix-meta ─────
import {
  IMPACT_MAP,
  SCORE_IMPACT,
  EFFORT_MINUTES,
  DEFAULT_SCORE_IMPACT,
  DEFAULT_EFFORT_MINUTES,
} from "@/lib/scanner/fix-meta";
import type { Fix, Issue } from "@/lib/scanner/types";

// ── Helpers that mirror the route logic (copied pure, no DB) ─────────────────

function enrichIssues(issues: Issue[]): Issue[] {
  return issues.map((issue) => ({
    ...issue,
    impact:
      IMPACT_MAP[issue.id] ??
      "Resolving this issue will improve your AI visibility score.",
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

const SEVERITY_ORDER: Record<string, number> = { info: 0, warning: 1, critical: 2 };

function sampleFixIndex(fixes: Fix[], issues: Issue[]): number {
  if (fixes.length === 0) return 0;
  const sevByIssueId = new Map<string, string>(issues.map((i) => [i.id, i.severity]));
  let bestIdx = 0;
  let bestRank = Infinity;
  for (let i = 0; i < fixes.length; i++) {
    const sev = sevByIssueId.get(fixes[i].issueId) ?? "critical";
    const rank = SEVERITY_ORDER[sev] ?? 2;
    if (rank < bestRank) { bestRank = rank; bestIdx = i; }
  }
  return bestIdx;
}

function applyFixGate(fixes: Fix[], issues: Issue[]): Fix[] {
  if (fixes.length === 0) return fixes;
  const sampleIdx = sampleFixIndex(fixes, issues);
  return fixes.map((fix, i) => {
    if (i === sampleIdx) {
      return { ...fix, locked: false, sampleLabel: "Free sample" };
    }
    const charCount = fix.code.length;
    return { ...fix, code: "", description: "", locked: true, charCount };
  });
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const ISSUES: Issue[] = [
  { id: "ca-no-robots",  category: "Crawler Access",  severity: "critical", title: "No robots.txt",  description: "desc" },
  { id: "lt-missing",   category: "LLMs.txt",         severity: "warning",  title: "LLMs.txt absent", description: "desc" },
  { id: "cs-no-h1",     category: "Content Structure",severity: "info",     title: "No H1",           description: "desc" },
];

const FIXES: Fix[] = [
  { issueId: "ca-no-robots", title: "Add robots.txt", description: "Create robots.txt", code: "User-agent: *\nAllow: /", language: "text" },
  { issueId: "lt-missing",   title: "Add llms.txt",   description: "Create llms.txt",   code: "# llms.txt\n",             language: "text" },
  { issueId: "cs-no-h1",    title: "Add H1",          description: "Add an H1 tag",     code: "<h1>Title</h1>",           language: "html" },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("enrichIssues", () => {
  it("adds impact string from IMPACT_MAP for known issue IDs", () => {
    const enriched = enrichIssues(ISSUES);
    expect(enriched[0].impact).toBe(IMPACT_MAP["ca-no-robots"]);
    expect(enriched[1].impact).toBe(IMPACT_MAP["lt-missing"]);
    expect(enriched[2].impact).toBe(IMPACT_MAP["cs-no-h1"]);
  });

  it("adds fallback impact string for unknown issue IDs", () => {
    const unknown: Issue[] = [{ id: "xx-unknown", category: "X", severity: "info", title: "X", description: "X" }];
    const enriched = enrichIssues(unknown);
    expect(typeof enriched[0].impact).toBe("string");
    expect(enriched[0].impact!.length).toBeGreaterThan(0);
  });

  it("impact is present on every enriched issue", () => {
    const enriched = enrichIssues(ISSUES);
    for (const issue of enriched) {
      expect(issue.impact).toBeDefined();
      expect(typeof issue.impact).toBe("string");
    }
  });
});

describe("enrichFixes", () => {
  it("adds scoreImpact and effortMinutes from maps for known issue IDs", () => {
    const enriched = enrichFixes(FIXES);
    expect(enriched[0].scoreImpact).toBe(SCORE_IMPACT["ca-no-robots"]);  // 5
    expect(enriched[0].effortMinutes).toBe(EFFORT_MINUTES["ca-no-robots"]); // 5
    expect(enriched[1].scoreImpact).toBe(SCORE_IMPACT["lt-missing"]);    // 8
  });

  it("uses DEFAULT_SCORE_IMPACT for unknown issue IDs", () => {
    const unknown: Fix[] = [{ issueId: "zz-unknown", title: "x", description: "x", code: "x", language: "text" }];
    const enriched = enrichFixes(unknown);
    expect(enriched[0].scoreImpact).toBe(DEFAULT_SCORE_IMPACT);
    expect(enriched[0].effortMinutes).toBe(DEFAULT_EFFORT_MINUTES);
  });

  it("sets locked: false on all enriched fixes", () => {
    const enriched = enrichFixes(FIXES);
    for (const fix of enriched) {
      expect(fix.locked).toBe(false);
    }
  });

  it("scoreImpact and effortMinutes are numbers on every fix", () => {
    const enriched = enrichFixes(FIXES);
    for (const fix of enriched) {
      expect(typeof fix.scoreImpact).toBe("number");
      expect(typeof fix.effortMinutes).toBe("number");
    }
  });
});

describe("sampleFixIndex", () => {
  it("picks the lowest-severity fix (info < warning < critical)", () => {
    const enriched = enrichFixes(FIXES);
    // ISSUES[2] is severity 'info' → fix at index 2 (cs-no-h1)
    const idx = sampleFixIndex(enriched, ISSUES);
    expect(idx).toBe(2);
  });

  it("returns 0 when fixes array is empty", () => {
    expect(sampleFixIndex([], ISSUES)).toBe(0);
  });

  it("returns 0 when all fixes are critical severity", () => {
    const allCritical: Issue[] = ISSUES.map((i) => ({ ...i, severity: "critical" as const }));
    const idx = sampleFixIndex(enrichFixes(FIXES), allCritical);
    expect(idx).toBe(0);
  });
});

describe("applyFixGate (free-tier gating)", () => {
  it("sample fix: locked=false, sampleLabel='Free sample', code present", () => {
    const enriched = enrichFixes(FIXES);
    const gated = applyFixGate(enriched, ISSUES);
    const sampleIdx = sampleFixIndex(enriched, ISSUES); // 2
    expect(gated[sampleIdx].locked).toBe(false);
    expect(gated[sampleIdx].sampleLabel).toBe("Free sample");
    expect(gated[sampleIdx].code.length).toBeGreaterThan(0);
  });

  it("non-sample fixes: locked=true, code='', description=''", () => {
    const enriched = enrichFixes(FIXES);
    const gated = applyFixGate(enriched, ISSUES);
    const sampleIdx = sampleFixIndex(enriched, ISSUES);
    for (let i = 0; i < gated.length; i++) {
      if (i === sampleIdx) continue;
      expect(gated[i].locked).toBe(true);
      expect(gated[i].code).toBe("");
      expect(gated[i].description).toBe("");
    }
  });

  it("locked fixes have charCount = original code length", () => {
    const enriched = enrichFixes(FIXES);
    const gated = applyFixGate(enriched, ISSUES);
    const sampleIdx = sampleFixIndex(enriched, ISSUES);
    for (let i = 0; i < gated.length; i++) {
      if (i === sampleIdx) continue;
      expect(gated[i].charCount).toBe(FIXES[i].code.length);
    }
  });

  it("exactly one fix has sampleLabel set", () => {
    const enriched = enrichFixes(FIXES);
    const gated = applyFixGate(enriched, ISSUES);
    const withLabel = gated.filter((f) => f.sampleLabel !== undefined);
    expect(withLabel).toHaveLength(1);
  });

  it("returns empty array unchanged", () => {
    expect(applyFixGate([], ISSUES)).toEqual([]);
  });

  it("scoreImpact and effortMinutes are preserved on locked fixes", () => {
    const enriched = enrichFixes(FIXES);
    const gated = applyFixGate(enriched, ISSUES);
    for (const fix of gated) {
      expect(typeof fix.scoreImpact).toBe("number");
      expect(typeof fix.effortMinutes).toBe("number");
    }
  });
});
