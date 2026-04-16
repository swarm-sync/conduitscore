# ConduitScore — Implementation Specification
## API Endpoint + DB Migration + @vercel/og Certificate

**Task:** task-005
**Prepared for:** Backend Lead
**Date:** 2026-03-24
**Status:** Ready for execution — no clarifying questions required

---

## Table of Contents

1. [API Endpoint: `/api/public/domain/[domain]/score`](#1-api-endpoint)
2. [Database Migration: `verified_scans` table](#2-database-migration)
3. [@vercel/og Certificate and OG Image Endpoint](#3-vercelOG-certificate-setup)
4. [Neon Cold-Start Mitigation](#4-neon-cold-start-mitigation)
5. [GA4 Integration Hooks](#5-ga4-integration-hooks)
6. [Acceptance Verification Checklist](#6-acceptance-verification-checklist)

---

## 1. API Endpoint

### 1.1 Route Handler Location

```
app/
  api/
    public/
      domain/
        [domain]/
          score/
            route.ts       ← PRIMARY handler (this spec)
          og/
            route.tsx      ← OG image handler (Section 3)
```

File path: `app/api/public/domain/[domain]/score/route.ts`

Next.js 14 App Router export convention: named `GET` export. No `POST`, `PUT`, or `DELETE` on this route. The handler must be declared with `export const dynamic = 'force-dynamic'` to prevent static caching at the framework level (caching is handled explicitly at the application layer, described in Section 1.6).

### 1.2 Request Validation

#### 1.2.1 Domain Parameter Format

The `[domain]` path segment arrives URL-decoded by Next.js. The handler must re-validate it before any database or external lookup.

Validation rules (apply in this order):

| Rule | Requirement | Error response if violated |
|------|-------------|--------------------------|
| Length | 1–253 characters after stripping leading/trailing whitespace | `invalid_domain` (400) |
| Characters | Only alphanumeric, hyphens, dots. No underscores, no spaces, no protocol (`http://`), no path (`/`) | `invalid_domain` (400) |
| Label structure | Each dot-separated label must be 1–63 characters. No label may start or end with a hyphen | `invalid_domain` (400) |
| TLD presence | Must contain at least one dot and the TLD must be at minimum 2 characters | `invalid_domain` (400) |
| Punycode | IDN domains must arrive already punycode-encoded (`xn--...`). The handler does NOT perform punycode conversion — that is the caller's responsibility | `invalid_domain` (400) |

Regex for initial structural check (TypeScript, applied after trimming):

```
/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
```

This regex must be compiled once at module scope (outside the handler function) to avoid re-compilation on every cold start.

Strip `www.` prefix before validation and storage: if the raw input is `www.example.com`, normalize to `example.com` for lookup and cache keying. The normalization step runs BEFORE the regex check.

#### 1.2.2 Rate Limiting Strategy

Two independent rate limit layers, both enforced before any DB query:

**Layer 1 — Per-IP limit**

- Limit: 30 requests per IP per 60-second rolling window
- Storage: Vercel KV (Redis-compatible) using key pattern `rl:ip:{ip_address}`
- TTL on each key: 60 seconds (sliding window via `INCR` + `EXPIRE` or atomic Lua script)
- Source of IP: `request.headers.get('x-forwarded-for')` — take the first IP in the comma-separated list, strip whitespace. If header is absent, fall back to `request.ip` (Vercel Edge provides this). If neither is available, treat as `unknown` and apply the IP limit to the `unknown` bucket (this prevents header-stripping bypass from becoming an anonymous free pass)
- When exceeded: return `rate_limited` (429) immediately, before querying Vercel KV for domain limits

**Layer 2 — Per-domain limit**

- Limit: 5 requests per domain per 60-second rolling window
- Storage: Vercel KV using key pattern `rl:domain:{normalized_domain}`
- TTL: 60 seconds
- Purpose: Prevents a single client from hammering one domain repeatedly using rotating IPs (e.g., bulk scraping competitor domains)
- When exceeded: return `rate_limited` (429)

**Implementation order within the handler:**

```
1. Normalize domain (strip www., lowercase)
2. Validate domain format → 400 if invalid
3. Check IP rate limit → 429 if exceeded
4. Check domain rate limit → 429 if exceeded
5. Check application-layer cache → 200 from cache if hit
6. Query verified_scans table
7. If no row found → return domain_not_found (404)
8. Build response, write to cache, return 200
```

**Rate limit headers to include on every response (including 429s):**

```
X-RateLimit-Limit-IP: 30
X-RateLimit-Remaining-IP: {remaining_ip_requests}
X-RateLimit-Reset-IP: {unix_epoch_when_ip_window_resets}
X-RateLimit-Limit-Domain: 5
X-RateLimit-Remaining-Domain: {remaining_domain_requests}
X-RateLimit-Reset-Domain: {unix_epoch_when_domain_window_resets}
```

### 1.3 Response Schema

#### 1.3.1 Success Response (HTTP 200)

```typescript
type ScoreResponse = {
  domain: string;               // normalized domain, e.g. "example.com"
  score: number;                // integer 0–100
  grade: string;                // "A" | "B" | "C" | "D" | "F"
  scanned_at: string;           // ISO 8601 UTC, e.g. "2026-03-24T14:30:00Z"
  scan_id: string;              // UUID v4, matches verified_scans.id
  categories: {
    ssl: CategoryScore;
    redirects: CategoryScore;
    headers: CategoryScore;
    performance: CategoryScore;
    accessibility: CategoryScore;
  };
  badge_url: string;            // absolute URL to SVG badge, e.g. "https://staging.conduitscore.com/api/badge/example.com"
  og_image_url: string;         // absolute URL to OG image, e.g. "https://staging.conduitscore.com/api/public/domain/example.com/og"
  cache_hit: boolean;           // true if served from application cache, false if live DB read
  cache_expires_at: string | null;  // ISO 8601 UTC when cache entry expires, null if cache_hit=false
};

type CategoryScore = {
  score: number;                // integer 0–100
  label: string;                // human-readable label, e.g. "SSL Certificate"
  passed: boolean;              // true if score >= 70
  findings: string[];           // array of human-readable finding strings, may be empty
};
```

#### 1.3.2 Example Success JSON

```json
{
  "domain": "example.com",
  "score": 84,
  "grade": "B",
  "scanned_at": "2026-03-24T14:30:00Z",
  "scan_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "categories": {
    "ssl": {
      "score": 100,
      "label": "SSL Certificate",
      "passed": true,
      "findings": []
    },
    "redirects": {
      "score": 80,
      "label": "Redirect Chain",
      "passed": true,
      "findings": ["One intermediate redirect detected (www to non-www)"]
    },
    "headers": {
      "score": 75,
      "label": "Security Headers",
      "passed": true,
      "findings": ["Content-Security-Policy header missing", "X-Frame-Options present"]
    },
    "performance": {
      "score": 82,
      "label": "Performance",
      "passed": true,
      "findings": ["Time to first byte: 180ms"]
    },
    "accessibility": {
      "score": 68,
      "label": "Accessibility",
      "passed": false,
      "findings": ["Missing lang attribute on html element", "3 images without alt text"]
    }
  },
  "badge_url": "https://staging.conduitscore.com/api/badge/example.com",
  "og_image_url": "https://staging.conduitscore.com/api/public/domain/example.com/og",
  "cache_hit": true,
  "cache_expires_at": "2026-03-24T15:30:00Z"
}
```

#### 1.3.3 Grade Calculation

| Score range | Grade |
|-------------|-------|
| 90–100 | A |
| 75–89 | B |
| 60–74 | C |
| 45–59 | D |
| 0–44 | F |

Grade is computed server-side from the `score` integer. It is NOT stored in the DB — derive it on every response from `score`.

### 1.4 Error Response Schema

All error responses share a common envelope:

```typescript
type ErrorResponse = {
  error: ErrorCode;
  message: string;        // human-readable, safe to display in UI
  domain?: string;        // present when domain was successfully parsed before error
  request_id: string;     // UUID v4, generated per request, useful for log correlation
};

type ErrorCode =
  | "domain_not_found"
  | "rate_limited"
  | "invalid_domain"
  | "server_error";
```

#### Per-error-code details:

**`invalid_domain` — HTTP 400**

Triggered when the domain parameter fails format validation (Section 1.2.1).

```json
{
  "error": "invalid_domain",
  "message": "The domain parameter is not a valid hostname. Provide a domain like example.com without protocol or path.",
  "request_id": "f1e2d3c4-b5a6-7890-1234-567890abcdef"
}
```

Note: `domain` field is omitted because the value was never valid enough to normalize.

**`domain_not_found` — HTTP 404**

Triggered when the domain passes validation but has no matching row in `verified_scans`.

```json
{
  "error": "domain_not_found",
  "message": "No scan results found for example.com. Run a scan at conduitscore.com to generate a score.",
  "domain": "example.com",
  "request_id": "f1e2d3c4-b5a6-7890-1234-567890abcdef"
}
```

**`rate_limited` — HTTP 429**

Triggered when either IP or domain rate limit is exceeded.

```json
{
  "error": "rate_limited",
  "message": "Too many requests. Please wait before retrying.",
  "domain": "example.com",
  "request_id": "f1e2d3c4-b5a6-7890-1234-567890abcdef"
}
```

Response must also include `Retry-After` header set to the number of seconds until the earliest rate limit window resets.

**`server_error` — HTTP 500**

Triggered on any unhandled exception, DB connection failure, or unexpected state.

```json
{
  "error": "server_error",
  "message": "An internal error occurred. Please try again in a moment.",
  "request_id": "f1e2d3c4-b5a6-7890-1234-567890abcdef"
}
```

The `domain` field is included only if domain normalization completed before the error. The full error details (stack trace, original message, DB error code) must be logged server-side but NEVER included in the response body.

### 1.5 Response Headers (all successful responses)

```
Content-Type: application/json
Cache-Control: public, max-age=3600, stale-while-revalidate=300
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
X-Request-ID: {request_id}
X-Cache: HIT | MISS
X-RateLimit-Limit-IP: 30
X-RateLimit-Remaining-IP: {n}
X-RateLimit-Reset-IP: {epoch}
X-RateLimit-Limit-Domain: 5
X-RateLimit-Remaining-Domain: {n}
X-RateLimit-Reset-Domain: {epoch}
```

### 1.6 Caching Strategy

Two cache layers are required. They are independent and stack:

**Layer 1 — Vercel Edge Cache (CDN-level)**

Set by the `Cache-Control` response header:

```
Cache-Control: public, max-age=3600, stale-while-revalidate=300
```

- CDN serves cached responses for 60 minutes without hitting the handler
- `stale-while-revalidate=300` allows the CDN to serve the stale cached response for an extra 5 minutes while it re-fetches in the background
- Cache key at Vercel CDN is the full request URL path: `/api/public/domain/example.com/score`
- This layer is transparent to the handler — no code required beyond setting the header

**Layer 2 — Application-level cache in Vercel KV**

Used by the handler itself to skip DB queries when a hot result exists:

- Key pattern: `cache:score:{normalized_domain}`
- TTL: 3600 seconds (matches CDN max-age)
- Value: the serialized `ScoreResponse` JSON string (full response body)
- On cache HIT: deserialize, set `cache_hit: true`, set `cache_expires_at` to the KV key's expiration timestamp, return immediately — skip DB query entirely
- On cache MISS: query DB (Section 1.7), build response, write to KV with 3600s TTL, set `cache_hit: false`, `cache_expires_at: null`
- Cache invalidation: when a new scan is completed for a domain, the pipeline must call `DEL cache:score:{normalized_domain}` via the same KV connection. This is outside the scope of this route handler but the Backend Lead must coordinate with the scan pipeline owner to ensure this hook exists.
- The cache write must use `SET ... EX 3600` (atomic) to prevent race conditions on parallel requests

**Repeat requests for the same domain:** With both layers active, the first request after a new scan writes to KV and sets the CDN cache. Subsequent requests within 60 minutes are served from CDN without touching the handler. After 60 minutes (or after a new scan invalidates KV), the next request re-queries the DB.

### 1.7 Database Query

The handler executes one parameterized query against the `verified_scans` table (see Section 2 for schema):

```sql
SELECT
  id,
  domain,
  score,
  categories,
  scanned_at
FROM verified_scans
WHERE domain = $1
ORDER BY scanned_at DESC
LIMIT 1;
```

The `$1` parameter receives the normalized domain string. This query uses the `idx_verified_scans_domain` index defined in Section 2.4.

If no row is returned, the handler emits `domain_not_found`. If a row is returned, the handler constructs the full `ScoreResponse` from the row data.

The Neon connection must use the pooled connection string (not the direct connection string) to avoid exhausting connection limits under concurrent load. See Section 4 for cold-start mitigation details.

### 1.8 @vercel/og Integration Hook

The `og_image_url` field in the success response points to the OG image endpoint at `app/api/public/domain/[domain]/og/route.tsx`. No OG generation happens inside the score route. The score route only constructs the URL and includes it in the response.

URL construction: `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/domain/${normalizedDomain}/og`

`NEXT_PUBLIC_BASE_URL` must be set in the environment (e.g., `https://staging.conduitscore.com` on staging, `https://conduitscore.com` on production). The handler must not hardcode this value.

---

## 2. Database Migration

### 2.1 Migration File Format

Neon uses standard PostgreSQL DDL. Migrations must be plain `.sql` files managed by your migration tool of choice (Drizzle, Flyway, or raw SQL files applied via `psql`). If the project uses Drizzle ORM, the migration file goes in `drizzle/migrations/`. If using raw SQL, it goes in `db/migrations/`.

File naming convention: `{timestamp}_{description}.sql`
Example: `20260324143000_create_verified_scans.sql`

Each migration file must be idempotent where possible (use `IF NOT EXISTS`). The full migration is provided in Section 2.3.

### 2.2 Complete Table Schema

```sql
CREATE TABLE verified_scans (
  -- Primary key
  id                UUID           DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Core domain and score data
  domain            TEXT           NOT NULL,
  score             SMALLINT       NOT NULL CHECK (score >= 0 AND score <= 100),

  -- Category scores stored as JSONB for schema flexibility
  -- Shape matches CategoryScore[] from Section 1.3.1
  categories        JSONB          NOT NULL,

  -- Scan metadata
  scanned_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  scan_duration_ms  INTEGER        NULL,      -- how long the scan took, for monitoring
  scanner_version   TEXT           NULL,      -- scanner build version, for debugging regressions

  -- Source tracking
  scan_source       TEXT           NOT NULL DEFAULT 'api'
                    CHECK (scan_source IN ('api', 'extension', 'widget', 'manual')),

  -- Soft-delete support (do not hard-delete scan rows; flag them instead)
  is_deleted        BOOLEAN        NOT NULL DEFAULT FALSE,
  deleted_at        TIMESTAMPTZ    NULL,

  -- Audit fields
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
```

### 2.3 Full Migration File

```sql
-- Migration: 20260324143000_create_verified_scans.sql
-- Description: Create verified_scans table with full indexing strategy
-- Compatible with: PostgreSQL 15+ (Neon)

-- ============================================================
-- 1. Extension prerequisites
-- ============================================================

-- gen_random_uuid() is available without pgcrypto in Postgres 13+.
-- Neon runs Postgres 15+, so no extension install needed.

-- ============================================================
-- 2. Main table
-- ============================================================

CREATE TABLE IF NOT EXISTS verified_scans (
  id                UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
  domain            TEXT           NOT NULL,
  score             SMALLINT       NOT NULL CHECK (score >= 0 AND score <= 100),
  categories        JSONB          NOT NULL,
  scanned_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  scan_duration_ms  INTEGER        NULL,
  scanner_version   TEXT           NULL,
  scan_source       TEXT           NOT NULL DEFAULT 'api'
                    CHECK (scan_source IN ('api', 'extension', 'widget', 'manual')),
  is_deleted        BOOLEAN        NOT NULL DEFAULT FALSE,
  deleted_at        TIMESTAMPTZ    NULL,
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. Indexes (see Section 2.4 for rationale on each)
-- ============================================================

-- Primary lookup: domain + recency (supports the route handler query)
CREATE INDEX IF NOT EXISTS idx_verified_scans_domain
  ON verified_scans (domain, scanned_at DESC)
  WHERE is_deleted = FALSE;

-- Score distribution queries (analytics, leaderboards)
CREATE INDEX IF NOT EXISTS idx_verified_scans_score
  ON verified_scans (score DESC)
  WHERE is_deleted = FALSE;

-- Recency queries (latest scans feed, admin dashboard)
CREATE INDEX IF NOT EXISTS idx_verified_scans_scanned_at
  ON verified_scans (scanned_at DESC)
  WHERE is_deleted = FALSE;

-- Source-based filtering (extension analytics, widget analytics)
CREATE INDEX IF NOT EXISTS idx_verified_scans_scan_source
  ON verified_scans (scan_source, scanned_at DESC)
  WHERE is_deleted = FALSE;

-- JSONB index for category-level queries
-- Supports: WHERE categories @> '[{"label":"SSL Certificate","passed":false}]'
CREATE INDEX IF NOT EXISTS idx_verified_scans_categories_gin
  ON verified_scans USING GIN (categories);

-- ============================================================
-- 4. Trigger: auto-update updated_at on row modification
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_verified_scans_updated_at
  BEFORE UPDATE ON verified_scans
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 5. Comments for documentation
-- ============================================================

COMMENT ON TABLE verified_scans IS
  'Stores the result of each domain score scan. One row per scan event. Multiple scans per domain are allowed; the API reads the most recent non-deleted row.';

COMMENT ON COLUMN verified_scans.domain IS
  'Normalized domain name (www. stripped, lowercase). Example: example.com';

COMMENT ON COLUMN verified_scans.score IS
  'Composite score 0-100. Derived from weighted category scores. Grade (A-F) is computed from this at read time, not stored.';

COMMENT ON COLUMN verified_scans.categories IS
  'JSONB array of CategoryScore objects. Keys: score (int), label (text), passed (bool), findings (text[]).';

COMMENT ON COLUMN verified_scans.scan_source IS
  'Origin of the scan request. api=public API, extension=Chrome extension, widget=homepage widget, manual=internal admin scan.';

COMMENT ON COLUMN verified_scans.is_deleted IS
  'Soft delete flag. API queries filter WHERE is_deleted = FALSE. Never hard-delete scan rows.';
```

### 2.4 Index Rationale

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_verified_scans_domain` | `(domain, scanned_at DESC)` partial on `is_deleted=FALSE` | B-tree | Primary read path for the API handler. Covers `WHERE domain = $1 ORDER BY scanned_at DESC LIMIT 1` as an index-only scan. The partial condition eliminates deleted rows without a table scan. |
| `idx_verified_scans_score` | `(score DESC)` partial on `is_deleted=FALSE` | B-tree | Supports score distribution analytics, future leaderboard endpoint, and badge tier queries. |
| `idx_verified_scans_scanned_at` | `(scanned_at DESC)` partial on `is_deleted=FALSE` | B-tree | Admin dashboard "latest scans" feed, recent activity feeds. |
| `idx_verified_scans_scan_source` | `(scan_source, scanned_at DESC)` partial on `is_deleted=FALSE` | B-tree | Extension and widget analytics: count scans by source per time period. |
| `idx_verified_scans_categories_gin` | `categories` | GIN | Category-level analysis: "how many domains are failing the SSL check?". Required for JSONB containment queries. |

### 2.5 Query Patterns the Table Must Support Efficiently

Listed in order of expected frequency:

**Q1 — Get latest scan for a domain (hot path, route handler)**
```sql
SELECT id, domain, score, categories, scanned_at
FROM verified_scans
WHERE domain = 'example.com' AND is_deleted = FALSE
ORDER BY scanned_at DESC
LIMIT 1;
-- Uses: idx_verified_scans_domain
-- Expected latency (Neon warm): < 5ms
```

**Q2 — Insert new scan (scan pipeline writes)**
```sql
INSERT INTO verified_scans (domain, score, categories, scanned_at, scan_duration_ms, scanner_version, scan_source)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, scanned_at;
-- No index used on write; indexes update automatically
```

**Q3 — Scan history for a domain (admin/dashboard)**
```sql
SELECT id, score, scanned_at, scan_source
FROM verified_scans
WHERE domain = 'example.com' AND is_deleted = FALSE
ORDER BY scanned_at DESC
LIMIT 50;
-- Uses: idx_verified_scans_domain
```

**Q4 — Score distribution analytics**
```sql
SELECT score, COUNT(*) AS count
FROM verified_scans
WHERE is_deleted = FALSE
GROUP BY score
ORDER BY score;
-- Uses: idx_verified_scans_score (partial index eliminates deleted rows cheaply)
```

**Q5 — Domains failing a specific category check**
```sql
SELECT domain, score, scanned_at
FROM verified_scans v1
WHERE is_deleted = FALSE
  AND categories @> '[{"label": "SSL Certificate", "passed": false}]'
  AND scanned_at = (
    SELECT MAX(scanned_at)
    FROM verified_scans v2
    WHERE v2.domain = v1.domain AND v2.is_deleted = FALSE
  )
ORDER BY scanned_at DESC
LIMIT 100;
-- Uses: idx_verified_scans_categories_gin for the JSONB containment filter
```

**Q6 — Recent scan count by source (extension analytics)**
```sql
SELECT scan_source, COUNT(*) AS scans
FROM verified_scans
WHERE scanned_at >= NOW() - INTERVAL '7 days'
  AND is_deleted = FALSE
GROUP BY scan_source;
-- Uses: idx_verified_scans_scan_source
```

---

## 3. @vercel/og Certificate Setup

### 3.1 Route Location

```
app/
  api/
    public/
      domain/
        [domain]/
          og/
            route.tsx      ← OG image handler
```

File path: `app/api/public/domain/[domain]/og/route.tsx`

This is a separate Next.js route from the score endpoint. It uses `@vercel/og` (the `ImageResponse` class) and has its own runtime directive:

```typescript
export const runtime = 'edge';
```

The OG route runs on the Vercel Edge Runtime, not Node.js. This means it cannot use `pg` (the Node.js Postgres client). If the OG route needs scan data, it must call the score API internally via `fetch`, or accept score data as query parameters.

### 3.2 URL Structure

The OG image URL is constructed by the score route handler and follows this pattern:

```
https://{BASE_URL}/api/public/domain/{domain}/og
```

Example: `https://staging.conduitscore.com/api/public/domain/example.com/og`

Optional query parameters (for pre-populated rendering without a DB round-trip):

```
?score=84&grade=B&scanned_at=2026-03-24T14:30:00Z
```

When query parameters are present and valid, the OG handler renders without calling the score API. When absent, the handler fetches from the score endpoint. The `og_image_url` returned by the score route must always include the query parameters to enable this fast path.

URL construction in the score route handler:

```
${process.env.NEXT_PUBLIC_BASE_URL}/api/public/domain/${normalizedDomain}/og?score=${score}&grade=${grade}&scanned_at=${encodeURIComponent(scanned_at)}
```

### 3.3 Canvas Dimensions and Template Spec

**Dimensions:** 1200 × 630 pixels (Open Graph standard, Twitter card compatible)

**Background:** Dark gradient, `#0f172a` (slate-900) to `#1e293b` (slate-800), linear, 135 degrees.

**Layout grid (from top-left, pixel coordinates):**

| Region | X | Y | Width | Height | Content |
|--------|---|---|-------|--------|---------|
| Logo area | 60 | 50 | 200 | 60 | ConduitScore wordmark (SVG or base64 PNG) |
| Domain text | 60 | 160 | 780 | 80 | Domain name, bold, white, 52px |
| Score circle | 900 | 120 | 240 | 240 | Circular score badge (see 3.3.1) |
| Grade label | 900 | 370 | 240 | 60 | Grade letter, centered, 42px |
| Category bars | 60 | 300 | 780 | 240 | 5 category score bars (see 3.3.2) |
| Tagline | 60 | 560 | 780 | 40 | "conduitscore.com — Domain Health Score" |
| Scan date | 900 | 560 | 240 | 40 | "Scanned {date}" right-aligned |

**Required fields from scan result (all must be present to render; if any are missing, return HTTP 400 from the OG route):**

| Field | Source | Usage in template |
|-------|--------|-------------------|
| `domain` | URL param or query param | Domain text region |
| `score` | Query param `?score=` or fetched | Score circle |
| `grade` | Query param `?grade=` or derived from score | Grade label |
| `scanned_at` | Query param `?scanned_at=` or fetched | Scan date |
| `categories` | Fetched only (too large for URL) | Category bars |

When query parameters are used (no category data available), render the 5 category bars as 5 unlabeled grey bars at 100% width with label "Score details at conduitscore.com" overlaid. This is the expected fast-path behavior for social sharing.

#### 3.3.1 Score Circle Spec

- Outer circle: 220px diameter, stroke `#334155` (slate-700), 8px stroke width, fill transparent
- Inner fill arc: same 220px circle, arc length proportional to score (score/100 × 2π radians), stroke color based on grade:
  - A: `#22c55e` (green-500)
  - B: `#84cc16` (lime-500)
  - C: `#eab308` (yellow-500)
  - D: `#f97316` (orange-500)
  - F: `#ef4444` (red-500)
- Score number: centered in circle, 72px, bold, white
- Grade letter: below score number, inside circle, 32px, semi-bold, same color as arc

Note: `@vercel/og` uses Satori for SVG rendering, which does not support CSS `conic-gradient` or `clip-path: path()`. The arc must be rendered as an SVG `<path>` element with computed start/end points. The Backend Lead must implement the arc path calculation using standard polar-to-cartesian math.

#### 3.3.2 Category Bars Spec

Five horizontal progress bars, stacked vertically, 40px height each, 16px gap between them.

Each bar:
- Label text: left-aligned, 18px, `#94a3b8` (slate-400), matches `categories[n].label`
- Bar track: full width (780px), height 12px, background `#1e293b`, border-radius 6px
- Bar fill: width `${category.score}%`, height 12px, background `#3b82f6` (blue-500) if passed, `#ef4444` (red-500) if not passed, border-radius 6px
- Score number: right-aligned, 18px, white

#### 3.3.3 Caching for OG Images

The OG route must set:
```
Cache-Control: public, max-age=86400, stale-while-revalidate=3600
```

OG images change only when a new scan is completed. 24-hour CDN cache is appropriate. The cache key is the full URL including query parameters.

### 3.4 Badge Infrastructure Hook

The badge endpoint lives at a separate route: `app/api/badge/[domain]/route.ts`

This is outside the scope of task-005 but the Backend Lead must be aware that the `badge_url` field in the score response points to this route, and it must be implemented in the same sprint (Week 1).

The badge route is SVG-based (not `@vercel/og`), returns `Content-Type: image/svg+xml`, and accepts the same `?score=&grade=` query parameters as the OG route for cache-friendly static rendering.

Connection to task-005: the score route handler must correctly populate both `badge_url` and `og_image_url` with valid absolute URLs and pre-populated query parameters. The Backend Lead owns both URL constructions in `route.ts`.

---

## 4. Neon Cold-Start Mitigation

Neon cold-start latency (Risk #1 from task-001) occurs when Neon's serverless compute needs to spin up from a suspended state, adding 500ms–2000ms to the first connection. This violates the p99 <200ms requirement.

### 4.1 Root Cause

Neon's serverless branches auto-suspend after a configurable idle period (default 5 minutes). The first query after a suspension requires compute to wake up, creating the cold-start spike.

### 4.2 Mitigation Strategy: Pooled Connection + Keep-Alive Pings

**Step 1 — Use the Neon HTTP driver (not `pg`):**

The `@neondatabase/serverless` package provides an HTTP-based query driver that avoids TCP connection setup entirely. Each query is an HTTP POST to Neon's edge proxy. This does NOT solve cold-start (the compute still needs to wake), but it reduces the fixed overhead of TCP handshake + TLS for warm connections.

```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
```

**Step 2 — Extend Neon auto-suspend threshold:**

In the Neon dashboard (or via Neon API), set the compute auto-suspend delay to the maximum allowed value for the project's tier. For the Neon Free tier this is limited; for paid tiers it can be set to 0 (never suspend) or to a longer idle period. DevOps must configure this as part of the deployment pipeline (task-004 handoff item).

Setting to "never suspend" keeps compute warm permanently but increases cost. The recommended approach for staging: set to 300 seconds (5 minutes). For production: set to 0 (never suspend) during the blitz period.

**Step 3 — Scheduled keep-alive ping:**

Deploy a Vercel Cron Job that runs every 3 minutes and executes a lightweight query against the Neon compute to prevent suspension:

```
// app/api/internal/db-keepalive/route.ts
// Vercel cron: every 3 minutes
// vercel.json: { "crons": [{ "path": "/api/internal/db-keepalive", "schedule": "*/3 * * * *" }] }

// Query:
SELECT 1;
```

This route must be protected by a secret header (`Authorization: Bearer {CRON_SECRET}`) and must not be publicly accessible. Vercel Cron passes the secret automatically.

**Step 4 — Application-layer cache as the primary cold-start defense:**

The Vercel KV cache (Section 1.6) is the most important mitigation: if the domain has been queried recently, the response is served from KV without touching Neon at all. Cold-start latency only affects the first uncached request after a Neon suspension.

With a 3-minute keep-alive interval and a 5-minute suspend threshold, the compute window stays open as long as the keep-alive is running. The KV cache handles request bursts before the compute wakes.

### 4.3 p99 Latency Budget

| Component | Expected latency (warm) | Budget |
|-----------|------------------------|--------|
| Vercel Edge routing | 2–5ms | 5ms |
| Rate limit check (KV) | 3–8ms | 10ms |
| KV cache lookup (hit) | 3–8ms | 10ms |
| Neon query (warm, via HTTP driver) | 5–20ms | 30ms |
| Response serialization | <1ms | 5ms |
| Network to client | variable | 140ms |
| **Total (cache miss, Neon warm)** | **~40–50ms** | **<200ms p99** |

Cold-start scenario (Neon suspended, cache miss): 500ms–2000ms. This is mitigated by the keep-alive ping making cold-starts rare in production. DevOps must alert if p99 exceeds 200ms (task-004 handoff).

### 4.4 Connection String Requirements

Two environment variables required:

```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
# This is the Neon HTTP driver connection string (also used by the pooler)
# Do NOT use the direct connection string for the route handler

DATABASE_URL_UNPOOLED=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pool_mode=session
# Used only for migration runs (Drizzle push / psql apply)
# Never use the unpooled URL in the Next.js handler
```

DevOps must set both variables in the Vercel project environment (staging + production separately).

---

## 5. GA4 Integration Hooks

From task-003: the `trackEvent` utility in `lib/analytics.ts` must be called for two events relevant to this endpoint.

The API route handler itself is server-side and does NOT call `trackEvent` directly (GA4 measurement protocol is possible but not required here). The GA4 events fire on the client side when the results page renders. The Backend Lead must ensure the API response includes sufficient data for the client to determine which event to fire.

**`scan_submit_success`:** Fires on the client results page when the API returns HTTP 200.

The API response body (Section 1.3.2) provides all required fields: `domain`, `score`, `grade`, `scan_id`. The frontend reads these from the response and passes them to `trackEvent`.

**`scan_submit_failure`:** Fires on the client results page when the API returns a non-200 status. The `error` field in the error response body (Section 1.4) maps directly to the `error_code` parameter expected by GA4:

| API error code | GA4 `error_code` value |
|----------------|------------------------|
| `domain_not_found` | `domain_not_found` |
| `rate_limited` | `rate_limited` |
| `invalid_domain` | `domain_not_found` (treat as not found for GA4 purposes) |
| `server_error` | `server_error` (new value — confirm with Analytics Owner) |

The `request_id` field in every response (success and error) should be logged by the client as a custom GA4 parameter for correlation with server-side logs. The Analytics Owner must add `request_id` to the GA4 event schema.

---

## 6. Acceptance Verification Checklist

The Backend Lead must verify each item before marking task-005 complete. DevOps runs independent verification using the curl test from task-001.

### 6.1 API Endpoint

- [ ] `curl https://staging.conduitscore.com/api/public/domain/example.com/score` returns HTTP 200
- [ ] Response body matches the schema in Section 1.3.2 (all required fields present, correct types)
- [ ] Response time p99 < 200ms under repeated requests (cache warm)
- [ ] `curl https://staging.conduitscore.com/api/public/domain/notareal.domain/score` returns HTTP 404 with `domain_not_found`
- [ ] `curl https://staging.conduitscore.com/api/public/domain/not-valid-domain/score` returns HTTP 400 with `invalid_domain`
- [ ] Sending 31 requests from the same IP within 60 seconds returns HTTP 429 with `rate_limited` on request 31
- [ ] Response headers include all rate limit headers and `X-Request-ID`
- [ ] `Cache-Control: public, max-age=3600` is set on 200 responses
- [ ] `Retry-After` header is set on 429 responses

### 6.2 Database Migration

- [ ] Migration file applies cleanly via `psql $DATABASE_URL_UNPOOLED < migration.sql` with no errors
- [ ] `\d verified_scans` in psql shows all columns with correct types and constraints
- [ ] `\di verified_scans*` shows all 5 indexes listed in Section 2.4
- [ ] INSERT of a test row succeeds
- [ ] SELECT with `WHERE domain = 'example.com' ORDER BY scanned_at DESC LIMIT 1` uses `idx_verified_scans_domain` (confirmed via EXPLAIN ANALYZE)
- [ ] Trigger fires on UPDATE and sets `updated_at` correctly

### 6.3 @vercel/og OG Image

- [ ] `curl -I https://staging.conduitscore.com/api/public/domain/example.com/og` returns HTTP 200 with `Content-Type: image/png`
- [ ] Image is 1200 × 630 pixels
- [ ] Domain name, score, and grade are visible in the rendered image
- [ ] `Cache-Control: public, max-age=86400` is set on the OG response
- [ ] `og_image_url` in the score response includes pre-populated query parameters

### 6.4 Neon Cold-Start

- [ ] Vercel Cron is deployed and running at `*/3 * * * *`
- [ ] `DATABASE_URL` and `DATABASE_URL_UNPOOLED` are set in both staging and production Vercel environments
- [ ] Neon auto-suspend threshold is configured to 300s (staging) and 0 (production, never suspend) via Neon dashboard — confirm with DevOps

---

## Environment Variables Summary

All of the following must be present in the Vercel project settings before deployment:

| Variable | Scope | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Server | Neon HTTP driver connection string (pooled) |
| `DATABASE_URL_UNPOOLED` | Server | Neon direct connection string (migrations only) |
| `KV_URL` | Server | Vercel KV connection URL (rate limiting + app cache) |
| `KV_REST_API_URL` | Server | Vercel KV REST URL |
| `KV_REST_API_TOKEN` | Server | Vercel KV REST token |
| `KV_REST_API_READ_ONLY_TOKEN` | Server | Vercel KV read-only token |
| `NEXT_PUBLIC_BASE_URL` | Public | Base URL for badge and OG image URL construction |
| `CRON_SECRET` | Server | Secret for protecting the DB keep-alive cron route |

---

*Document: TASK_005_API_DB_SPEC.md*
*Prepared for: ConduitScore Backend Lead*
*Task: task-005 — API Endpoint + DB Migration Implementation Specification*
*Date: 2026-03-24*
*Status: Complete — executable without clarifying questions*
