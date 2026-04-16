// ─── API Response (mirrors task-005 spec) ────────────────────────────────────

export interface CategoryScore {
  score: number;
  label: string;
  passed: boolean;
  findings: string[];
}

export interface ScoreApiResponse {
  domain: string;
  score: number;
  grade: string;
  scanned_at: string;
  scan_id: string;
  categories: {
    ssl: CategoryScore;
    redirects: CategoryScore;
    headers: CategoryScore;
    performance: CategoryScore;
    accessibility: CategoryScore;
  };
  badge_url: string;
  og_image_url: string;
  cache_hit: boolean;
  cache_expires_at: string | null;
}

// Alias used in components
export type ScoreData = ScoreApiResponse;

// ─── Storage ─────────────────────────────────────────────────────────────────

export interface CacheEntry {
  domain: string;
  data: ScoreApiResponse;
  cached_at: number;
  expires_at: number;
}

export interface BadgeState {
  domain: string;
  text: string;
  color: string;
  updated_at: number;
}

export interface RateLimitState {
  blocked_until: number;
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export type ScanRequest =
  | {
      type: 'SCAN_DOMAIN';
      domain: string;
      tabId?: number;
      force_refresh?: boolean;
    }
  | { type: 'GET_ACTIVE_TAB_DOMAIN' }
  | { type: 'CANCEL_SCAN' };

export type MessageResponse =
  | {
      success: true;
      data: ScoreApiResponse;
      domain: string;
      cache_hit: boolean;
    }
  | {
      success: false;
      error: ErrorCode;
      message: string;
      domain?: string;
      retry_after_seconds?: number;
    }
  | {
      success: boolean;
      domain: string | null;
    };

export type ErrorCode =
  | 'invalid_domain'
  | 'domain_not_found'
  | 'rate_limited'
  | 'network_error'
  | 'server_error'
  | 'extension_error';

// ─── Internal ────────────────────────────────────────────────────────────────

export interface ScanResult {
  data: ScoreApiResponse | null;
  cache_hit: boolean;
  error: ErrorCode | null;
  message?: string;
  retry_after_seconds?: number;
}

export interface PopupState {
  viewState: 'idle' | 'loading' | 'results' | 'error';
  domain: string;
  scoreData: ScoreData | null;
  error: { code: ErrorCode; message: string } | null;
  cacheHit: boolean;
}
