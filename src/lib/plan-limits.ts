export const PLAN_LIMITS: Record<string, { scansPerMonth: number; pagesPerScan: number }> = {
  free:    { scansPerMonth: 3,        pagesPerScan: 1 },
  starter: { scansPerMonth: 50,       pagesPerScan: 5 },
  pro:     { scansPerMonth: 100,      pagesPerScan: 50 },
  growth:  { scansPerMonth: 500,      pagesPerScan: 100 },
  agency:  { scansPerMonth: Infinity, pagesPerScan: -1 },
};

export function canScan(tier: string, currentMonthlyScans: number): boolean {
  const limits = PLAN_LIMITS[tier] ?? PLAN_LIMITS.free;
  if (!isFinite(limits.scansPerMonth)) return true;
  return currentMonthlyScans < limits.scansPerMonth;
}
