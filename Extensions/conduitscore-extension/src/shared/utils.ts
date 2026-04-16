const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/**
 * Normalize a raw hostname: strip www. prefix, lowercase.
 * Returns null if the result does not pass format validation.
 */
export function normalizeDomain(raw: string): string | null {
  let domain = raw.trim().toLowerCase();
  if (domain.startsWith('www.')) {
    domain = domain.slice(4);
  }
  if (!DOMAIN_REGEX.test(domain)) return null;
  if (domain.length > 253) return null;
  return domain;
}

/**
 * Compute grade letter from score integer (mirrors server-side logic).
 * Used to avoid depending on the API field in edge cases.
 */
export function gradeFromScore(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}

/**
 * Format an ISO 8601 UTC string for display in the popup.
 * Example: "2026-03-24T14:30:00Z" → "Mar 24, 2026 at 2:30 PM"
 */
export function formatScanDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
