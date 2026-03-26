/**
 * Section 5: Plan Limits Tests
 * Tests for src/lib/plan-limits.ts
 */

import { describe, it, expect } from "vitest";
import { PLAN_LIMITS, PLAN_FEATURES, canScan } from "@/lib/plan-limits";

describe("PLAN_LIMITS shape", () => {
  const EXPECTED_TIERS = ["free", "starter", "pro", "growth", "agency"];

  it("has all 5 tiers defined", () => {
    for (const tier of EXPECTED_TIERS) {
      expect(PLAN_LIMITS[tier]).toBeDefined();
    }
  });

  it("each tier has scansPerMonth and pagesPerScan", () => {
    for (const tier of EXPECTED_TIERS) {
      const limits = PLAN_LIMITS[tier];
      expect(typeof limits.scansPerMonth).toBe("number");
      expect(typeof limits.pagesPerScan).toBe("number");
    }
  });

  it("free tier: 3 scans/month, 1 page/scan", () => {
    expect(PLAN_LIMITS.free.scansPerMonth).toBe(3);
    expect(PLAN_LIMITS.free.pagesPerScan).toBe(1);
  });

  it("starter tier: 50 scans/month", () => {
    expect(PLAN_LIMITS.starter.scansPerMonth).toBe(50);
  });

  it("pro tier: 100 scans/month", () => {
    expect(PLAN_LIMITS.pro.scansPerMonth).toBe(100);
  });

  it("growth tier: 500 scans/month", () => {
    expect(PLAN_LIMITS.growth.scansPerMonth).toBe(500);
  });

  it("agency tier: unlimited (Infinity)", () => {
    expect(PLAN_LIMITS.agency.scansPerMonth).toBe(Infinity);
  });

  it("tiers are in ascending order: free < starter < pro < growth < agency", () => {
    const { free, starter, pro, growth } = PLAN_LIMITS;
    expect(free.scansPerMonth).toBeLessThan(starter.scansPerMonth);
    expect(starter.scansPerMonth).toBeLessThan(pro.scansPerMonth);
    expect(pro.scansPerMonth).toBeLessThan(growth.scansPerMonth);
    expect(growth.scansPerMonth).toBeLessThan(Infinity);
  });
});

describe("canScan()", () => {
  it("free user at 0 scans → can scan", () => {
    expect(canScan("free", 0)).toBe(true);
  });

  it("free user at 2 scans → can scan (under limit of 3)", () => {
    expect(canScan("free", 2)).toBe(true);
  });

  it("free user at 3 scans → cannot scan (at limit)", () => {
    expect(canScan("free", 3)).toBe(false);
  });

  it("free user at 5 scans → cannot scan (over limit)", () => {
    expect(canScan("free", 5)).toBe(false);
  });

  it("starter user at 49 scans → can scan", () => {
    expect(canScan("starter", 49)).toBe(true);
  });

  it("starter user at 50 scans → cannot scan", () => {
    expect(canScan("starter", 50)).toBe(false);
  });

  it("pro user at 99 scans → can scan", () => {
    expect(canScan("pro", 99)).toBe(true);
  });

  it("pro user at 100 scans → cannot scan", () => {
    expect(canScan("pro", 100)).toBe(false);
  });

  it("growth user at 499 scans → can scan", () => {
    expect(canScan("growth", 499)).toBe(true);
  });

  it("growth user at 500 scans → cannot scan", () => {
    expect(canScan("growth", 500)).toBe(false);
  });

  it("agency user always can scan regardless of count", () => {
    expect(canScan("agency", 0)).toBe(true);
    expect(canScan("agency", 1000)).toBe(true);
    expect(canScan("agency", 999999)).toBe(true);
  });

  it("unknown tier falls back to free limits", () => {
    // Unknown tier → falls back to PLAN_LIMITS.free (3 scans)
    expect(canScan("enterprise", 2)).toBe(true);
    expect(canScan("enterprise", 3)).toBe(false);
  });
});

describe("PLAN_FEATURES", () => {
  it("dashboard history is included on the free tier", () => {
    expect(PLAN_FEATURES.dashboardHistory("free")).toBe(true);
  });

  it("score trend chart unlocks on Monitor and above", () => {
    expect(PLAN_FEATURES.scoreTrendChart("starter")).toBe(false);
    expect(PLAN_FEATURES.scoreTrendChart("pro")).toBe(true);
    expect(PLAN_FEATURES.scoreTrendChart("growth")).toBe(true);
    expect(PLAN_FEATURES.scoreTrendChart("agency")).toBe(true);
  });
});
