export const PLAN_LIMITS: Record<string, { scansPerMonth: number }> = {
  free:    { scansPerMonth: 3 },
  starter: { scansPerMonth: 50 },
  pro:     { scansPerMonth: 100 },
  growth:  { scansPerMonth: 500 },
  agency:  { scansPerMonth: Infinity },
};

/** Human-readable display names for each tier (DB value → marketing name). */
export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free:    "Diagnose",
  starter: "Fix",
  pro:     "Monitor",
  growth:  "Alert",
  agency:  "Scale",
};

const TIER_ORDER = ["free", "starter", "pro", "growth", "agency"] as const;

export type SubscriptionTier = typeof TIER_ORDER[number];

function normalizeTier(tier: string): SubscriptionTier {
  return (TIER_ORDER.includes(tier as SubscriptionTier)
    ? tier
    : "free") as SubscriptionTier;
}

export function isTierAtLeast(tier: string, minimumTier: SubscriptionTier): boolean {
  return (
    TIER_ORDER.indexOf(normalizeTier(tier)) >= TIER_ORDER.indexOf(minimumTier)
  );
}

export const PLAN_FEATURES = {
  dashboardHistory: (tier: string) => {
    void tier;
    return true;
  },
  unlockedFixes: (tier: string) => isTierAtLeast(tier, "starter"),
  issueDescriptions: (tier: string) => isTierAtLeast(tier, "starter"),
  scheduledRescans: (tier: string) => isTierAtLeast(tier, "pro"),
  scoreTrendChart: (tier: string) => isTierAtLeast(tier, "pro"),
  emailAlerts: (tier: string) => isTierAtLeast(tier, "growth"),
  bulkScan: (tier: string) => isTierAtLeast(tier, "agency"),
  restApi: (tier: string) => isTierAtLeast(tier, "agency"),
};

export function canScan(tier: string, currentMonthlyScans: number): boolean {
  const limits = PLAN_LIMITS[tier] ?? PLAN_LIMITS.free;
  if (!isFinite(limits.scansPerMonth)) return true;
  return currentMonthlyScans < limits.scansPerMonth;
}
