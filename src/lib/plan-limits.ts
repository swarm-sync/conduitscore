export const PLAN_LIMITS: Record<string, { scansPerMonth: number; pagesPerScan: number }> = {
  free: { scansPerMonth: 3, pagesPerScan: 1 },
  starter: { scansPerMonth: 50, pagesPerScan: 5 },
  pro: { scansPerMonth: 500, pagesPerScan: 50 },
  agency: { scansPerMonth: -1, pagesPerScan: -1 },
};

export function canScan(tier: string, currentMonthlyScans: number): boolean {
  const limits = PLAN_LIMITS[tier] || PLAN_LIMITS.free;
  if (limits.scansPerMonth === -1) return true;
  return currentMonthlyScans < limits.scansPerMonth;
}
