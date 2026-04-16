export const CONDUITSCORE_API_BASE = 'https://conduitscore.com';

// For staging/development:
// export const CONDUITSCORE_API_BASE = 'https://staging.conduitscore.com';

export const CACHE_TTL_MS = 60 * 60 * 1000;         // 1 hour
export const CACHE_KEY_PREFIX = 'cs_cache_';
export const BADGE_KEY_PREFIX = 'cs_badge_';
export const RATE_LIMIT_KEY_PREFIX = 'cs_rl_';
export const BADGE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
export const PENDING_CONTEXT_SCAN_KEY = 'pending_context_scan';
export const PENDING_CONTEXT_SCAN_MAX_AGE_MS = 30_000; // 30 seconds
