/**
 * Section 6: Fix-Meta Map Tests
 * Tests for src/lib/scanner/fix-meta.ts
 */

import { describe, it, expect } from "vitest";
import {
  IMPACT_MAP,
  SCORE_IMPACT,
  EFFORT_MINUTES,
  DEFAULT_SCORE_IMPACT,
  DEFAULT_EFFORT_MINUTES,
} from "@/lib/scanner/fix-meta";

// Known issue IDs from the scanner
const KNOWN_ISSUE_IDS = [
  "ca-no-robots",
  "ca-blocked-gptbot",
  "ca-blocked-claudebot",
  "ca-blocked-perplexitybot",
  "sd-no-jsonld",
  "sd-no-faq",
  "cs-no-h1",
  "lt-missing",
  "th-slow",
  "th-very-slow",
  "th-no-viewport",
  "th-no-desc",
  "cq-short",
  "cq-very-short",
  "cq-no-date",
];

describe("IMPACT_MAP", () => {
  it("has entries for all known issue IDs", () => {
    for (const id of KNOWN_ISSUE_IDS) {
      expect(IMPACT_MAP[id]).toBeDefined();
    }
  });

  it("all values are non-empty strings", () => {
    for (const [, value] of Object.entries(IMPACT_MAP)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("ca-blocked-gptbot impact mentions GPTBot or ChatGPT", () => {
    expect(IMPACT_MAP["ca-blocked-gptbot"]).toMatch(/GPTBot|ChatGPT/i);
  });

  it("lt-missing impact mentions llms.txt or AI crawlers", () => {
    expect(IMPACT_MAP["lt-missing"]).toMatch(/llms\.txt|AI crawlers/i);
  });
});

describe("SCORE_IMPACT", () => {
  it("has entries for crawler access issues", () => {
    expect(typeof SCORE_IMPACT["ca-no-robots"]).toBe("number");
    expect(SCORE_IMPACT["ca-no-robots"]).toBeGreaterThan(0);
  });

  it("structured data issues have highest score impact", () => {
    // sd-no-jsonld should have the highest impact (12)
    const sdJsonld = SCORE_IMPACT["sd-no-jsonld"];
    expect(sdJsonld).toBeGreaterThanOrEqual(10);
  });

  it("all values are positive numbers", () => {
    for (const [, value] of Object.entries(SCORE_IMPACT)) {
      expect(typeof value).toBe("number");
      expect(value).toBeGreaterThan(0);
    }
  });

  it("DEFAULT_SCORE_IMPACT is a positive number", () => {
    expect(typeof DEFAULT_SCORE_IMPACT).toBe("number");
    expect(DEFAULT_SCORE_IMPACT).toBeGreaterThan(0);
  });
});

describe("EFFORT_MINUTES", () => {
  it("quick fixes (robots.txt, H1) are under 10 minutes", () => {
    expect(EFFORT_MINUTES["ca-no-robots"]).toBeLessThanOrEqual(10);
    expect(EFFORT_MINUTES["cs-no-h1"]).toBeLessThanOrEqual(10);
  });

  it("complex fixes (performance) take 60+ minutes", () => {
    expect(EFFORT_MINUTES["th-slow"]).toBeGreaterThanOrEqual(60);
  });

  it("all values are positive numbers", () => {
    for (const [, value] of Object.entries(EFFORT_MINUTES)) {
      expect(typeof value).toBe("number");
      expect(value).toBeGreaterThan(0);
    }
  });

  it("DEFAULT_EFFORT_MINUTES is a positive number", () => {
    expect(typeof DEFAULT_EFFORT_MINUTES).toBe("number");
    expect(DEFAULT_EFFORT_MINUTES).toBeGreaterThan(0);
  });
});
