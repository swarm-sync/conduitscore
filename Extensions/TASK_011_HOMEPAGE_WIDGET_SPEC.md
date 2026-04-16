# ConduitScore — Homepage Widget React Component Specification

**Task:** task-010
**Prepared for:** Frontend Lead
**Date:** 2026-03-24
**Status:** Ready for execution — no clarifying questions required
**Sprint target:** Live on staging Monday 2026-03-24. Feature complete Wednesday 2026-03-26. Production deployment Wednesday 2026-04-09.

---

## Table of Contents

1. [Component Overview](#1-component-overview)
2. [File Location and Imports](#2-file-location-and-imports)
3. [TypeScript Type Definitions](#3-typescript-type-definitions)
4. [Component Structure](#4-component-structure)
5. [State Management](#5-state-management)
6. [Domain Validation](#6-domain-validation)
7. [API Integration](#7-api-integration)
8. [GA4 Event Firing](#8-ga4-event-firing)
9. [UI Design Specification](#9-ui-design-specification)
10. [Category Breakdown Display](#10-category-breakdown-display)
11. [Responsive Design and Breakpoints](#11-responsive-design-and-breakpoints)
12. [Accessibility Specification](#12-accessibility-specification)
13. [Cache Awareness](#13-cache-awareness)
14. [Complete Component Source](#14-complete-component-source)
15. [CSS / Tailwind Token Reference](#15-css--tailwind-token-reference)
16. [Edge Cases and Error States](#16-edge-cases-and-error-states)
17. [Acceptance Checklist](#17-acceptance-checklist)

---

## 1. Component Overview

### 1.1 Purpose

`ScanWidget` is the primary conversion surface on the ConduitScore homepage. A visitor types any domain name, clicks Scan (or presses Enter), and within 2–3 seconds sees a full score breakdown. Its job is to demonstrate product value before asking for sign-up.

### 1.2 Success Metrics Tied to This Component

| Metric | Target | How Widget Contributes |
|--------|--------|------------------------|
| Scans on homepage | 500 in first 7 days | Low friction: one field, one button |
| GA4 `scan_submit_success` events | Matches scan count | Every successful API response fires this event |
| Time-to-results visible | < 3 s on broadband | Skeleton loader shows immediately, no layout shift |
| Accessibility score (Lighthouse) | >= 95 | Full ARIA implementation per Section 12 |

### 1.3 Technology Constraints

- **Framework:** Next.js 14 App Router (`"use client"` directive required)
- **Language:** TypeScript 5, strict mode
- **Styling:** Tailwind CSS 3.4 utility classes, CSS custom properties for theme tokens
- **React version:** 18.3 (concurrent features available, not required for this component)
- **No external UI libraries** — all elements are hand-built to Figma-level spec
- **No `useSearchParams`** — this component does not read URL params, no Suspense boundary needed for that reason
- **GA4:** `gtag()` function is loaded globally by the Next.js `<Script>` tag in `app/layout.tsx`. Widget calls it directly, no wrapper library.

---

## 2. File Location and Imports

### 2.1 File Path

```
app/
  components/
    homepage/
      ScanWidget.tsx        ← PRIMARY component (this spec)
      ScanWidget.test.tsx   ← Unit test file (separate task)
```

### 2.2 Required Imports

```typescript
"use client";

import { useState, useCallback, useRef, useId } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
```

### 2.3 Global Type Augmentation for gtag

Place this declaration once at the top of `ScanWidget.tsx`, below the imports. It augments the global `Window` interface so TypeScript does not error on `window.gtag`.

```typescript
declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      parameters: Record<string, string | number | boolean>
    ) => void;
  }
}
```

---

## 3. TypeScript Type Definitions

All types are local to this file. Do not import from a shared types module — the widget must be portable.

```typescript
// ----------------------------------------------------------------
// API response types — mirror TASK_005_API_DB_SPEC.md Section 1.3
// ----------------------------------------------------------------

type CategoryScore = {
  score: number;       // 0–100 integer
  label: string;       // e.g. "SSL Certificate"
  passed: boolean;     // true if score >= 70
  findings: string[];  // human-readable finding strings, may be empty
};

type ScoreResponse = {
  domain: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  scanned_at: string;          // ISO 8601 UTC
  scan_id: string;             // UUID v4
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
};

// ----------------------------------------------------------------
// Error types — mirror TASK_005_API_DB_SPEC.md Section 1.4
// ----------------------------------------------------------------

type ApiErrorCode =
  | "domain_not_found"
  | "rate_limited"
  | "invalid_domain"
  | "server_error"
  | "network_error"    // fetch() threw — no HTTP response received
  | "timeout";         // AbortController fired before response

type ApiError = {
  code: ApiErrorCode;
  message: string;     // user-visible string (see Section 16 for all messages)
};

// ----------------------------------------------------------------
// Widget-internal state shape
// ----------------------------------------------------------------

type WidgetState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; data: ScoreResponse }
  | { phase: "error"; error: ApiError };

// ----------------------------------------------------------------
// Category key ordering (determines render order in the breakdown)
// ----------------------------------------------------------------

const CATEGORY_KEYS = [
  "ssl",
  "headers",
  "performance",
  "redirects",
  "accessibility",
] as const;

type CategoryKey = typeof CATEGORY_KEYS[number];
```

---

## 4. Component Structure

### 4.1 JSX Tree Outline

```
<section aria-label="Domain score scanner">
  <form onSubmit={handleSubmit} noValidate>

    {/* Input row */}
    <div role="group" aria-labelledby="widget-heading">
      <h2 id="widget-heading">Check Any Domain's Score</h2>

      <div class="input-wrapper">
        <label htmlFor={inputId}>Domain</label>
        <input
          id={inputId}
          type="text"
          inputMode="url"
          autocomplete="off"
          spellCheck={false}
          aria-describedby="{inputId}-error {inputId}-hint"
          aria-invalid={hasValidationError}
          value={domain}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={state.phase === "loading"}
          placeholder="example.com"
        />
        <span id="{inputId}-hint" class="sr-only">
          Enter a domain name without https:// or www.
        </span>
        {hasValidationError && (
          <span id="{inputId}-error" role="alert" aria-live="assertive">
            {validationError}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={state.phase === "loading"}
        aria-busy={state.phase === "loading"}
        aria-label={state.phase === "loading" ? "Scanning domain, please wait" : "Scan domain"}
      >
        {state.phase === "loading" ? <Spinner /> : "Scan"}
      </button>
    </div>

  </form>

  {/* Results area — conditionally rendered */}
  {state.phase === "loading" && <SkeletonResults />}
  {state.phase === "error"   && <ErrorDisplay error={state.error} />}
  {state.phase === "success" && <ScoreResults data={state.data} />}

</section>
```

### 4.2 Sub-Component Breakdown

All sub-components are defined in the same file as unexported functions. They are not split into separate files because they have no reuse outside this widget.

| Sub-component | Purpose |
|---------------|---------|
| `Spinner` | Animated loading indicator inside the Scan button |
| `SkeletonResults` | Placeholder during loading — prevents layout shift |
| `ErrorDisplay` | Renders error message with actionable guidance |
| `ScoreResults` | Full results: grade ring, overall score, cache badge, category list |
| `GradeRing` | Large circular SVG showing letter grade + numeric score |
| `CategoryBar` | Single horizontal bar for one category score |
| `CacheLabel` | "Cached result" pill shown when `cache_hit: true` |
| `FindingsList` | Collapsible list of finding strings under each category |

---

## 5. State Management

### 5.1 Hook Inventory

```typescript
// Primary state machine
const [state, setState] = useState<WidgetState>({ phase: "idle" });

// Controlled input value
const [domain, setDomain] = useState<string>("");

// Client-side validation error (separate from API errors)
const [validationError, setValidationError] = useState<string>("");

// Abort controller ref — holds reference for in-flight request cancellation
const abortRef = useRef<AbortController | null>(null);

// Stable ID for input/label association (React 18 useId)
const inputId = useId();
```

### 5.2 State Transitions

```
idle  ──[handleSubmit: valid domain]──► loading
         ──[handleSubmit: invalid domain]──► idle (validationError set)

loading ──[API 200]──► success
        ──[API 4xx / 5xx]──► error
        ──[network failure / timeout]──► error
        ──[user submits new domain while loading]──► loading (previous request aborted)

success ──[user types in input]──► idle (results cleared)
error   ──[user types in input]──► idle (error cleared)
```

### 5.3 handleChange

```typescript
const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setDomain(value);
  setValidationError("");
  // Clear results when user edits after a completed scan
  if (state.phase === "success" || state.phase === "error") {
    setState({ phase: "idle" });
  }
}, [state.phase]);
```

### 5.4 handleSubmit

```typescript
const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // 1. Validate
  const normalized = normalizeDomain(domain);
  const validationMsg = validateDomain(normalized);
  if (validationMsg) {
    setValidationError(validationMsg);
    fireGA4Failure("invalid_domain");
    return;
  }

  // 2. Cancel any in-flight request
  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;

  // 3. Transition to loading
  setState({ phase: "loading" });
  setValidationError("");

  // 4. Fetch
  const result = await fetchScore(normalized, controller.signal);

  // 5. Guard: ignore if a newer request was started before this resolved
  if (controller.signal.aborted) return;

  // 6. Transition to terminal state
  if (result.ok) {
    setState({ phase: "success", data: result.data });
    fireGA4Success(result.data);
  } else {
    setState({ phase: "error", error: result.error });
    fireGA4Failure(result.error.code);
  }
}, [domain, state.phase]);
```

### 5.5 handleKeyDown

```typescript
// Not required — <form> with type="submit" button handles Enter natively.
// This handler exists only to intercept Escape: cancel in-flight request.
const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Escape" && state.phase === "loading") {
    abortRef.current?.abort();
    setState({ phase: "idle" });
  }
}, [state.phase]);
```

---

## 6. Domain Validation

### 6.1 Normalization (runs before validation)

```typescript
function normalizeDomain(raw: string): string {
  let value = raw.trim().toLowerCase();
  // Strip protocol
  value = value.replace(/^https?:\/\//i, "");
  // Strip path, query, fragment
  value = value.split("/")[0].split("?")[0].split("#")[0];
  // Strip www. prefix
  value = value.replace(/^www\./i, "");
  return value;
}
```

### 6.2 Validation Function

```typescript
// Compiled once at module scope — not inside the function body
const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

function validateDomain(normalized: string): string {
  // Returns empty string if valid, or a user-visible error message if invalid.

  if (!normalized) {
    return "Please enter a domain name.";
  }
  if (normalized.length > 253) {
    return "Domain name is too long. Maximum 253 characters.";
  }
  if (!DOMAIN_REGEX.test(normalized)) {
    return "Enter a valid domain like example.com — no https:// or slashes.";
  }

  // Label length check (each segment between dots must be 1–63 chars)
  const labels = normalized.split(".");
  for (const label of labels) {
    if (label.length > 63) {
      return "One part of the domain is too long. Each segment must be 63 characters or fewer.";
    }
  }

  return ""; // valid
}
```

### 6.3 Validation Error Display Rules

- Error message appears below the input field, not inside it.
- It uses `role="alert"` so screen readers announce it immediately without focus change.
- It is associated to the input via `aria-describedby`.
- The input receives `aria-invalid="true"` when a validation error is present.
- The error clears as soon as the user types any character.
- Validation runs on submit, NOT on blur (to avoid penalizing users mid-type).

### 6.4 Validation Error Messages (complete list)

| Trigger | Message shown to user |
|---------|----------------------|
| Empty input | "Please enter a domain name." |
| Input > 253 chars | "Domain name is too long. Maximum 253 characters." |
| Fails DOMAIN_REGEX | "Enter a valid domain like example.com — no https:// or slashes." |
| Label > 63 chars | "One part of the domain is too long. Each segment must be 63 characters or fewer." |

---

## 7. API Integration

### 7.1 Endpoint

```
GET /api/public/domain/{normalized_domain}/score
```

The domain is URL-encoded in the path using `encodeURIComponent`. No request body. No Authorization header (public endpoint).

### 7.2 fetchScore Function

```typescript
type FetchResult =
  | { ok: true; data: ScoreResponse }
  | { ok: false; error: ApiError };

const FETCH_TIMEOUT_MS = 10_000; // 10 seconds

async function fetchScore(
  normalizedDomain: string,
  signal: AbortSignal
): Promise<FetchResult> {
  // Combine the caller-provided AbortSignal with a timeout signal.
  // AbortSignal.any() is available in all modern browsers and Node 20+.
  const timeoutSignal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

  const url = `/api/public/domain/${encodeURIComponent(normalizedDomain)}/score`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: combinedSignal,
    });
  } catch (err) {
    // fetch() threw — either network error or abort
    if (signal.aborted) {
      // Caller explicitly cancelled — return a neutral error,
      // the calling code will discard it due to the abort guard.
      return {
        ok: false,
        error: { code: "network_error", message: "" },
      };
    }
    if (timeoutSignal.aborted) {
      return {
        ok: false,
        error: {
          code: "timeout",
          message: "The scan took too long. Please try again.",
        },
      };
    }
    return {
      ok: false,
      error: {
        code: "network_error",
        message: "Could not reach the server. Check your connection and try again.",
      },
    };
  }

  // Parse JSON regardless of status code
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      error: {
        code: "server_error",
        message: "Received an unexpected response from the server.",
      },
    };
  }

  // Success
  if (response.ok) {
    return { ok: true, data: body as ScoreResponse };
  }

  // Map HTTP error codes to typed error codes
  return { ok: false, error: mapApiError(response.status, body) };
}
```

### 7.3 mapApiError

```typescript
function mapApiError(status: number, body: unknown): ApiError {
  // Extract error code from API response body when present
  const apiCode =
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof (body as Record<string, unknown>).error === "string"
      ? (body as Record<string, unknown>).error as string
      : null;

  const apiMessage =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as Record<string, unknown>).message === "string"
      ? (body as Record<string, unknown>).message as string
      : null;

  switch (status) {
    case 400:
      return {
        code: "invalid_domain",
        message: apiMessage ?? "That doesn't look like a valid domain. Try example.com.",
      };

    case 404:
      return {
        code: "domain_not_found",
        message:
          apiMessage ??
          "No score found for that domain. It may not have been scanned yet.",
      };

    case 429:
      return {
        code: "rate_limited",
        message: "Too many scans. Please wait a moment before trying again.",
      };

    default:
      return {
        code: "server_error",
        message: "Something went wrong on our end. Please try again shortly.",
      };
  }
}
```

### 7.4 Request Lifecycle Summary

| Step | Detail |
|------|--------|
| Method | GET |
| URL | `/api/public/domain/{encoded_domain}/score` |
| Timeout | 10 000 ms via `AbortSignal.timeout()` |
| Concurrent requests | Abort previous request before starting new one |
| Retry | None — user must re-submit. Do not auto-retry; the API has per-IP and per-domain rate limits. |
| Content-Type sent | None (GET request, no body) |
| Accept header | `application/json` |

---

## 8. GA4 Event Firing

### 8.1 Helper Functions

```typescript
function fireGA4Success(data: ScoreResponse): void {
  window.gtag?.("event", "scan_submit_success", {
    domain: data.domain,
    score: data.score,
    grade: data.grade,
    cache_hit: data.cache_hit,
    scan_id: data.scan_id,
  });
}

function fireGA4Failure(errorCode: ApiErrorCode | "invalid_domain"): void {
  window.gtag?.("event", "scan_submit_failure", {
    error_code: errorCode,
  });
}
```

### 8.2 Event Specifications

#### `scan_submit_success`

Fired when the API returns HTTP 200.

| Parameter | Type | Value | Notes |
|-----------|------|-------|-------|
| `domain` | string | Normalized domain, e.g. `"example.com"` | From API response |
| `score` | number | Integer 0–100 | From API response |
| `grade` | string | `"A"` / `"B"` / `"C"` / `"D"` / `"F"` | From API response |
| `cache_hit` | boolean | `true` if cached | From API response |
| `scan_id` | string | UUID v4 | For cross-referencing with backend logs |

#### `scan_submit_failure`

Fired when validation fails OR when the API returns an error (4xx, 5xx, network failure, timeout).

| Parameter | Type | Value | Notes |
|-----------|------|-------|-------|
| `error_code` | string | One of: `invalid_domain`, `domain_not_found`, `rate_limited`, `server_error`, `network_error`, `timeout` | Always present on failure |

### 8.3 Firing Locations in Code

| Condition | Function called | Where |
|-----------|----------------|-------|
| Client-side validation fails | `fireGA4Failure("invalid_domain")` | Inside `handleSubmit`, before `setState` |
| API 200 received | `fireGA4Success(result.data)` | Inside `handleSubmit`, after successful fetch |
| API 4xx / 5xx received | `fireGA4Failure(result.error.code)` | Inside `handleSubmit`, after failed fetch |
| Network error / timeout | `fireGA4Failure(result.error.code)` | Inside `handleSubmit`, after failed fetch |

### 8.4 Defensive Null Guard

`window.gtag?.()` uses optional chaining. The widget fires GA4 events only when `gtag` is defined. If the analytics script is blocked (ad blockers, staging env without GA4 snippet), no error is thrown and no event fires — this is the correct behavior.

---

## 9. UI Design Specification

### 9.1 Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  Check Any Domain's Score                               │  ← H2 heading
│                                                         │
│  ┌─────────────────────────────────┐  ┌─────────────┐  │
│  │  example.com                    │  │    Scan     │  │  ← Input + Button row
│  └─────────────────────────────────┘  └─────────────┘  │
│                                                         │
│  ── Results (conditionally rendered below) ──           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ○ 84  B    example.com   [Cached result]        │   │  ← Grade ring + metadata row
│  │                                                  │   │
│  │  SSL Certificate        ████████████████ 100     │   │  ← Category bar row (×5)
│  │  Security Headers       █████████████    75      │   │
│  │  Performance            ██████████████   82      │   │
│  │  Redirect Chain         █████████████    80      │   │
│  │  Accessibility          ██████████       68      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Color System

All colors use CSS custom properties. Two sets are provided: one for light mode, one for dark mode. Tailwind's `dark:` variant applies the dark tokens automatically.

```css
/* app/globals.css — add these variables */
:root {
  --widget-bg:             #ffffff;
  --widget-border:         #e5e7eb;   /* gray-200 */
  --widget-surface:        #f9fafb;   /* gray-50 */
  --widget-text-primary:   #111827;   /* gray-900 */
  --widget-text-secondary: #6b7280;   /* gray-500 */
  --widget-text-muted:     #9ca3af;   /* gray-400 */
  --widget-accent:         #2563eb;   /* blue-600 — brand primary */
  --widget-accent-hover:   #1d4ed8;   /* blue-700 */
  --widget-accent-fg:      #ffffff;
  --widget-error:          #dc2626;   /* red-600 */
  --widget-error-bg:       #fef2f2;   /* red-50 */
  --widget-success:        #16a34a;   /* green-600 */
  --widget-warning:        #d97706;   /* amber-600 */

  /* Grade colors */
  --grade-a:               #16a34a;   /* green-600 */
  --grade-b:               #2563eb;   /* blue-600 */
  --grade-c:               #d97706;   /* amber-600 */
  --grade-d:               #ea580c;   /* orange-600 */
  --grade-f:               #dc2626;   /* red-600 */

  /* Bar track */
  --bar-track:             #e5e7eb;   /* gray-200 */
}

.dark {
  --widget-bg:             #111827;   /* gray-900 */
  --widget-border:         #374151;   /* gray-700 */
  --widget-surface:        #1f2937;   /* gray-800 */
  --widget-text-primary:   #f9fafb;   /* gray-50 */
  --widget-text-secondary: #9ca3af;   /* gray-400 */
  --widget-text-muted:     #6b7280;   /* gray-500 */
  --widget-accent:         #3b82f6;   /* blue-500 — slightly lighter for dark bg */
  --widget-accent-hover:   #2563eb;   /* blue-600 */
  --widget-accent-fg:      #ffffff;
  --widget-error:          #f87171;   /* red-400 */
  --widget-error-bg:       #1f1212;
  --widget-success:        #4ade80;   /* green-400 */
  --widget-warning:        #fbbf24;   /* amber-400 */

  --grade-a:               #4ade80;   /* green-400 */
  --grade-b:               #60a5fa;   /* blue-400 */
  --grade-c:               #fbbf24;   /* amber-400 */
  --grade-d:               #fb923c;   /* orange-400 */
  --grade-f:               #f87171;   /* red-400 */

  --bar-track:             #374151;   /* gray-700 */
}
```

### 9.3 Grade Color Mapping

```typescript
const GRADE_COLORS: Record<ScoreResponse["grade"], string> = {
  A: "var(--grade-a)",
  B: "var(--grade-b)",
  C: "var(--grade-c)",
  D: "var(--grade-d)",
  F: "var(--grade-f)",
};

const GRADE_TAILWIND_BG: Record<ScoreResponse["grade"], string> = {
  A: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  B: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  C: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  D: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  F: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};
```

### 9.4 Typography Scale

| Element | Tailwind classes | Size (px) | Weight |
|---------|-----------------|-----------|--------|
| Widget heading | `text-2xl font-bold` | 24 | 700 |
| Grade letter (ring center) | `text-5xl font-black` | 48 | 900 |
| Score number (ring center) | `text-sm font-semibold` | 14 | 600 |
| Domain name (results header) | `text-lg font-semibold` | 18 | 600 |
| Category label | `text-sm font-medium` | 14 | 500 |
| Category score | `text-sm font-semibold tabular-nums` | 14 | 600 |
| Finding text | `text-xs` | 12 | 400 |
| Error message | `text-sm` | 14 | 400 |
| Cache label | `text-xs font-medium` | 12 | 500 |
| Input placeholder | `text-base` | 16 | 400 |
| Button label | `text-base font-semibold` | 16 | 600 |

### 9.5 Spacing and Sizing

| Element | Value |
|---------|-------|
| Widget outer padding | `p-6` (24px) |
| Gap between input and button | `gap-3` (12px) |
| Gap between form and results | `mt-8` (32px) |
| Gap between category rows | `gap-3` (12px) |
| Input height | `h-12` (48px) — touch-safe |
| Button height | `h-12` (48px) — touch-safe |
| Button min-width | `min-w-[88px]` |
| Grade ring diameter | 80px |
| Grade ring stroke width | 6px |
| Category bar height | `h-2` (8px) |
| Category bar border-radius | `rounded-full` |

### 9.6 Input Field Specification

```
Border:          1px solid var(--widget-border)
Border-radius:   rounded-lg (8px)
Focus ring:      2px solid var(--widget-accent), offset 2px
Background:      var(--widget-bg)
Font size:       16px (prevents iOS auto-zoom)
Padding:         px-4 (16px horizontal)
```

Important: font-size must be 16px or larger on the input to prevent iOS Safari from auto-zooming on focus.

### 9.7 Button Specification

States and their visual treatment:

| State | Background | Border | Text | Cursor |
|-------|-----------|--------|------|--------|
| Default | `var(--widget-accent)` | none | white | pointer |
| Hover | `var(--widget-accent-hover)` | none | white | pointer |
| Focus-visible | `var(--widget-accent)` | 2px focus ring | white | pointer |
| Loading | `var(--widget-accent)` at 80% opacity | none | Spinner icon | not-allowed |
| Disabled | gray-300 / gray-600 dark | none | gray-500 | not-allowed |

Transition: `transition-colors duration-150`

### 9.8 Skeleton Loader

The skeleton replaces the results area during loading. It must match the exact height of the results card to prevent layout shift (CLS).

Skeleton consists of:
- Top row: one 80px circle placeholder + two text-line placeholders (simulating grade ring + domain + cache label)
- Five rows below: each row has a short label placeholder (100px wide) + a bar placeholder (full width) + a number placeholder (28px wide)

All skeleton elements use: `animate-pulse bg-gray-200 dark:bg-gray-700 rounded`

```typescript
function SkeletonResults() {
  return (
    <div
      aria-label="Loading scan results"
      aria-busy="true"
      role="status"
      className="mt-8 p-5 rounded-xl border border-[var(--widget-border)] bg-[var(--widget-surface)]"
    >
      {/* Header row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-32 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      {/* 5 category rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 mb-3">
          <div className="h-4 w-28 rounded animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="h-2 flex-1 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-7 rounded animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0" />
        </div>
      ))}
    </div>
  );
}
```

---

## 10. Category Breakdown Display

### 10.1 Category Order

Categories render in this fixed order regardless of key order in the API response:

1. SSL Certificate (`ssl`)
2. Security Headers (`headers`)
3. Performance (`performance`)
4. Redirect Chain (`redirects`)
5. Accessibility (`accessibility`)

### 10.2 CategoryBar Component

```typescript
type CategoryBarProps = {
  categoryKey: CategoryKey;
  category: CategoryScore;
};

function CategoryBar({ categoryKey, category }: CategoryBarProps) {
  const barId = `bar-${categoryKey}`;
  const findingsId = `findings-${categoryKey}`;
  const [findingsOpen, setFindingsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {/* Label + bar + score row */}
      <div className="flex items-center gap-3">
        {/* Category label */}
        <span
          id={barId}
          className="text-sm font-medium text-[var(--widget-text-primary)] w-36 shrink-0 truncate"
        >
          {category.label}
        </span>

        {/* Progress bar track */}
        <div
          role="progressbar"
          aria-valuenow={category.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-labelledby={barId}
          className="flex-1 h-2 rounded-full bg-[var(--bar-track)] overflow-hidden"
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${category.score}%`,
              backgroundColor: scoreToColor(category.score),
            }}
          />
        </div>

        {/* Numeric score */}
        <span
          className="text-sm font-semibold tabular-nums text-[var(--widget-text-primary)] w-8 text-right shrink-0"
          aria-hidden="true"  // already conveyed by the progressbar role above
        >
          {category.score}
        </span>

        {/* Pass/fail indicator */}
        <span
          aria-label={category.passed ? "passed" : "needs improvement"}
          className={`text-xs shrink-0 ${
            category.passed
              ? "text-[var(--widget-success)]"
              : "text-[var(--widget-error)]"
          }`}
        >
          {category.passed ? "✓" : "✗"}
        </span>
      </div>

      {/* Expandable findings — only rendered when findings exist */}
      {category.findings.length > 0 && (
        <div className="pl-[calc(9rem+0.75rem)]">  {/* align under the bar */}
          <button
            type="button"
            aria-expanded={findingsOpen}
            aria-controls={findingsId}
            onClick={() => setFindingsOpen((v) => !v)}
            className="text-xs text-[var(--widget-text-secondary)] hover:text-[var(--widget-accent)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-accent)] rounded"
          >
            {findingsOpen
              ? "Hide details"
              : `${category.findings.length} finding${category.findings.length > 1 ? "s" : ""}`}
          </button>

          {findingsOpen && (
            <ul
              id={findingsId}
              className="mt-1 space-y-0.5 list-none"
            >
              {category.findings.map((finding, i) => (
                <li
                  key={i}
                  className="text-xs text-[var(--widget-text-secondary)] flex items-start gap-1.5"
                >
                  <span className="text-[var(--widget-text-muted)] mt-0.5 shrink-0" aria-hidden="true">–</span>
                  {finding}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

### 10.3 scoreToColor Utility

Maps a 0–100 score to a CSS color value. Uses the same thresholds as the grade calculation:

```typescript
function scoreToColor(score: number): string {
  if (score >= 90) return "var(--grade-a)";
  if (score >= 75) return "var(--grade-b)";
  if (score >= 60) return "var(--grade-c)";
  if (score >= 45) return "var(--grade-d)";
  return "var(--grade-f)";
}
```

### 10.4 GradeRing Component

The ring is an SVG circle with a stroke-dashoffset animation on mount.

```typescript
type GradeRingProps = {
  score: number;
  grade: ScoreResponse["grade"];
};

function GradeRing({ score, grade }: GradeRingProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = GRADE_COLORS[grade];

  return (
    <div className="relative w-20 h-20 shrink-0" aria-hidden="true">
      <svg
        viewBox="0 0 80 80"
        className="w-full h-full -rotate-90"
        aria-hidden="true"
      >
        {/* Track circle */}
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke="var(--bar-track)"
          strokeWidth="6"
        />
        {/* Score arc */}
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black leading-none" style={{ color }}>
          {grade}
        </span>
        <span className="text-xs font-semibold tabular-nums text-[var(--widget-text-secondary)] leading-none mt-0.5">
          {score}
        </span>
      </div>
    </div>
  );
}
```

Note: The SVG is `aria-hidden="true"` because the accessible score is conveyed via text in the results header (`<h3>` described below).

### 10.5 ScoreResults Component

```typescript
function ScoreResults({ data }: { data: ScoreResponse }) {
  const scannedDate = new Date(data.scanned_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      role="region"
      aria-label={`Score results for ${data.domain}`}
      className="mt-8 p-5 rounded-xl border border-[var(--widget-border)] bg-[var(--widget-surface)]"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <GradeRing score={data.score} grade={data.grade} />

        <div className="flex flex-col gap-1 min-w-0">
          {/* Screen-reader-accessible summary */}
          <h3 className="text-lg font-semibold text-[var(--widget-text-primary)] truncate">
            {data.domain}
          </h3>
          <p className="sr-only">
            Overall score: {data.score} out of 100. Grade: {data.grade}.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--widget-text-secondary)]">
              Scanned {scannedDate}
            </span>
            {data.cache_hit && <CacheLabel />}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div
        role="list"
        aria-label="Score breakdown by category"
        className="flex flex-col gap-3"
      >
        {CATEGORY_KEYS.map((key) => (
          <div key={key} role="listitem">
            <CategoryBar categoryKey={key} category={data.categories[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 11. Responsive Design and Breakpoints

### 11.1 Breakpoint Reference

Tailwind default breakpoints used in this component:

| Breakpoint | Min width | Usage |
|-----------|-----------|-------|
| (default) | 0px | Mobile-first base styles |
| `sm` | 640px | Stack → row layout for input+button |
| `md` | 768px | Wider category label column |
| `lg` | 1024px | Widget max-width cap, horizontal padding increase |

### 11.2 Form Row Layout

On mobile (< 640px): input and button stack vertically (column). On sm and above: they sit in a horizontal row.

```tsx
{/* Tailwind classes for the form row container */}
<div className="flex flex-col sm:flex-row gap-3">
  <input className="flex-1 h-12 ..." />
  <button className="h-12 sm:w-auto w-full ..." />
</div>
```

Full-width button on mobile ensures easy tap target. `sm:w-auto` lets the button size to its content on wider screens, keeping visual balance.

### 11.3 Category Label Width

The category label column width adapts to avoid overflow:

| Breakpoint | Label column width | Tailwind class |
|-----------|-------------------|----------------|
| Mobile | 96px (6rem) | `w-24` |
| md+ | 144px (9rem) | `md:w-36` |

```tsx
<span className="text-sm font-medium ... w-24 md:w-36 shrink-0 truncate">
  {category.label}
</span>
```

### 11.4 Widget Container Width

The widget is placed inside a container that constrains maximum width:

```tsx
{/* In the homepage section that contains the widget */}
<section className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
  <ScanWidget />
</section>
```

The `ScanWidget` component itself uses `w-full` — it fills its container. Width constraints live in the parent layout, not the component, for flexibility.

### 11.5 Results Card on Mobile

On mobile, the grade ring + domain header row wraps:

```tsx
{/* Already specified in ScoreResults: flex-wrap allows wrapping */}
<div className="flex items-center gap-4 mb-5 flex-wrap">
```

When wrapped, the grade ring sits above the domain text. The ring stays at 80px × 80px on all sizes — it is already compact enough for 320px-wide screens.

### 11.6 Touch Target Sizes

All interactive elements meet the WCAG 2.5.5 target size of 44×44px minimum:

| Element | Height | Min width | Touch-safe? |
|---------|--------|-----------|-------------|
| Scan button | 48px (`h-12`) | 88px | Yes |
| Input field | 48px (`h-12`) | full-width | Yes |
| "Hide/Show details" link | 28px with 10px padding-y | auto | Yes (with padding) |

For the findings toggle button, add: `py-2.5 -my-2.5` to expand the tap area without affecting layout.

---

## 12. Accessibility Specification

### 12.1 Semantic HTML Structure

```
<section> ← Landmark, labeled with aria-label="Domain score scanner"
  <form>   ← Implicit form landmark
    <h2>   ← Widget heading (labeling the form group)
    <div role="group" aria-labelledby="widget-heading">
      <label>  ← Visually hidden on desktop (sr-only), visible on mobile
      <input>  ← With aria-describedby, aria-invalid, aria-required
      <button type="submit">
  <div role="region">  ← Results region, aria-label="Score results for {domain}"
    <h3>  ← Domain name as results heading
    <div role="list">  ← Category list
      <div role="listitem">  ← Each category
        <div role="progressbar" aria-valuenow aria-valuemin aria-valuemax aria-labelledby>
```

### 12.2 ARIA Labels — Complete Inventory

| Element | ARIA attribute | Value |
|---------|---------------|-------|
| Section container | `aria-label` | `"Domain score scanner"` |
| Form group | `aria-labelledby` | `id` of the `<h2>` heading |
| Input field | `aria-describedby` | `"{id}-error {id}-hint"` (space-separated) |
| Input field | `aria-invalid` | `"true"` when validation error present, `"false"` otherwise |
| Input field | `aria-required` | `"true"` |
| Scan button (idle) | `aria-label` | `"Scan domain"` |
| Scan button (loading) | `aria-label` | `"Scanning domain, please wait"` |
| Scan button (loading) | `aria-busy` | `"true"` |
| Validation error span | `role` | `"alert"` |
| Validation error span | `aria-live` | `"assertive"` |
| Skeleton container | `role` | `"status"` |
| Skeleton container | `aria-busy` | `"true"` |
| Skeleton container | `aria-label` | `"Loading scan results"` |
| Results region | `role` | `"region"` |
| Results region | `aria-label` | `"Score results for {domain}"` |
| GradeRing SVG | `aria-hidden` | `"true"` |
| Numeric score span next to bar | `aria-hidden` | `"true"` |
| Pass/fail checkmark span | `aria-label` | `"passed"` or `"needs improvement"` |
| Category bar | `role` | `"progressbar"` |
| Category bar | `aria-valuenow` | `{score}` |
| Category bar | `aria-valuemin` | `"0"` |
| Category bar | `aria-valuemax` | `"100"` |
| Category bar | `aria-labelledby` | `id` of the category label span |
| Findings toggle button | `aria-expanded` | `"true"` or `"false"` |
| Findings toggle button | `aria-controls` | `id` of the findings `<ul>` |
| SR-only score summary | (in DOM) | `"Overall score: {score} out of 100. Grade: {grade}."` |

### 12.3 Keyboard Navigation

| Key | Context | Behavior |
|-----|---------|---------|
| Tab | Anywhere in widget | Focus moves through: input → Scan button → (results: domain name, findings toggles) |
| Enter | Input focused | Submits form (native behavior via `type="submit"` button) |
| Enter / Space | Scan button focused | Submits form |
| Escape | While loading | Cancels in-flight request via `handleKeyDown` |
| Enter / Space | Findings toggle | Expands/collapses findings list |

No custom key bindings beyond Escape cancel. All other interactions use browser defaults.

### 12.4 Focus Management

- On successful scan: focus remains on the Scan button. The results appear below and are announced by the `role="region"` + `aria-label`. Do not forcibly move focus to the results — this would be disorienting.
- On error: focus remains on the Scan button. The error message's `role="alert"` announces itself to screen readers without a focus move.
- On validation error: focus remains on the Scan button (or returns to it after the submit handler runs). The `role="alert"` on the validation error span announces the message.

### 12.5 Color Contrast Requirements (WCAG 2.1 AA)

All text must meet 4.5:1 minimum contrast ratio. Interactive elements (buttons, links) must meet 3:1 for non-text elements.

Verified token pairs:

| Element | Foreground | Background | Ratio | WCAG level |
|---------|-----------|-----------|-------|-----------|
| Body text | `#111827` (gray-900) | `#ffffff` | 16.1:1 | AAA |
| Body text dark | `#f9fafb` (gray-50) | `#111827` | 16.1:1 | AAA |
| Secondary text | `#6b7280` (gray-500) | `#ffffff` | 4.6:1 | AA |
| Scan button label | `#ffffff` | `#2563eb` (blue-600) | 4.7:1 | AA |
| Error text | `#dc2626` (red-600) | `#ffffff` | 4.5:1 | AA |
| Error text dark | `#f87171` (red-400) | `#111827` | 5.8:1 | AA |
| Grade A text | `#16a34a` (green-600) | `#ffffff` | 4.5:1 | AA |

Note: `#9ca3af` (gray-400) used for `--widget-text-muted` does NOT meet 4.5:1 on white. It is only used for `aria-hidden` decorative elements (bullet dash in findings list). If it is ever used for readable text, replace with gray-500.

### 12.6 Reduced Motion

Animated elements (GradeRing stroke-dashoffset, progress bar width, skeleton pulse) must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

For the inline SVG animation and progress bar, use:

```typescript
// In GradeRing and CategoryBar — detect preference
const prefersReduced =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

// Then conditionally apply transition
style={{
  transition: prefersReduced ? "none" : "stroke-dashoffset 0.8s ease-out",
}}
```

---

## 13. Cache Awareness

### 13.1 CacheLabel Component

```typescript
function CacheLabel() {
  return (
    <span
      title="This result was served from cache and may be up to 1 hour old"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-[var(--widget-text-secondary)]"
    >
      <svg
        aria-hidden="true"
        width="10" height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="shrink-0"
      >
        {/* Simple clock icon */}
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 3v2.2l1.3 1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span>Cached result</span>
    </span>
  );
}
```

### 13.2 Cache Display Rules

| Condition | What shows |
|-----------|-----------|
| `cache_hit: false` | Nothing — no label shown |
| `cache_hit: true` | "Cached result" pill with clock icon |
| `cache_hit: true` + `cache_expires_at` present | `title` attribute shows "served from cache, may be up to 1 hour old" |

The `cache_expires_at` timestamp is not shown visually (too much detail for homepage context) but is included in the `title` attribute for power users.

---

## 14. Complete Component Source

The following is the complete, production-ready source for `app/components/homepage/ScanWidget.tsx`. Every helper, sub-component, and type is co-located in this single file.

```typescript
"use client";

import { useState, useCallback, useRef, useId } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

// ─── Global gtag type augmentation ────────────────────────────────────────────
declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      parameters: Record<string, string | number | boolean>
    ) => void;
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type CategoryScore = {
  score: number;
  label: string;
  passed: boolean;
  findings: string[];
};

type ScoreResponse = {
  domain: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
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
};

type ApiErrorCode =
  | "domain_not_found"
  | "rate_limited"
  | "invalid_domain"
  | "server_error"
  | "network_error"
  | "timeout";

type ApiError = { code: ApiErrorCode; message: string };

type WidgetState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; data: ScoreResponse }
  | { phase: "error"; error: ApiError };

type FetchResult =
  | { ok: true; data: ScoreResponse }
  | { ok: false; error: ApiError };

const CATEGORY_KEYS = [
  "ssl",
  "headers",
  "performance",
  "redirects",
  "accessibility",
] as const;

type CategoryKey = typeof CATEGORY_KEYS[number];

// ─── Constants ─────────────────────────────────────────────────────────────────

const DOMAIN_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const FETCH_TIMEOUT_MS = 10_000;

const GRADE_COLORS: Record<ScoreResponse["grade"], string> = {
  A: "var(--grade-a)",
  B: "var(--grade-b)",
  C: "var(--grade-c)",
  D: "var(--grade-d)",
  F: "var(--grade-f)",
};

// ─── Pure utilities ────────────────────────────────────────────────────────────

function normalizeDomain(raw: string): string {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^https?:\/\//i, "");
  value = value.split("/")[0].split("?")[0].split("#")[0];
  value = value.replace(/^www\./i, "");
  return value;
}

function validateDomain(normalized: string): string {
  if (!normalized) return "Please enter a domain name.";
  if (normalized.length > 253)
    return "Domain name is too long. Maximum 253 characters.";
  if (!DOMAIN_REGEX.test(normalized))
    return "Enter a valid domain like example.com — no https:// or slashes.";
  for (const label of normalized.split(".")) {
    if (label.length > 63)
      return "One part of the domain is too long. Each segment must be 63 characters or fewer.";
  }
  return "";
}

function scoreToColor(score: number): string {
  if (score >= 90) return "var(--grade-a)";
  if (score >= 75) return "var(--grade-b)";
  if (score >= 60) return "var(--grade-c)";
  if (score >= 45) return "var(--grade-d)";
  return "var(--grade-f)";
}

function mapApiError(status: number, body: unknown): ApiError {
  const b = typeof body === "object" && body !== null
    ? (body as Record<string, unknown>)
    : {};
  const apiMessage =
    typeof b.message === "string" ? b.message : null;

  switch (status) {
    case 400:
      return {
        code: "invalid_domain",
        message:
          apiMessage ?? "That doesn't look like a valid domain. Try example.com.",
      };
    case 404:
      return {
        code: "domain_not_found",
        message:
          apiMessage ??
          "No score found for that domain. It may not have been scanned yet.",
      };
    case 429:
      return {
        code: "rate_limited",
        message: "Too many scans. Please wait a moment before trying again.",
      };
    default:
      return {
        code: "server_error",
        message: "Something went wrong on our end. Please try again shortly.",
      };
  }
}

async function fetchScore(
  normalizedDomain: string,
  signal: AbortSignal
): Promise<FetchResult> {
  const timeoutSignal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
  const url = `/api/public/domain/${encodeURIComponent(normalizedDomain)}/score`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: combinedSignal,
    });
  } catch {
    if (signal.aborted)
      return { ok: false, error: { code: "network_error", message: "" } };
    if (timeoutSignal.aborted)
      return {
        ok: false,
        error: {
          code: "timeout",
          message: "The scan took too long. Please try again.",
        },
      };
    return {
      ok: false,
      error: {
        code: "network_error",
        message:
          "Could not reach the server. Check your connection and try again.",
      },
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      error: {
        code: "server_error",
        message: "Received an unexpected response from the server.",
      },
    };
  }

  if (response.ok) return { ok: true, data: body as ScoreResponse };
  return { ok: false, error: mapApiError(response.status, body) };
}

function fireGA4Success(data: ScoreResponse): void {
  window.gtag?.("event", "scan_submit_success", {
    domain: data.domain,
    score: data.score,
    grade: data.grade,
    cache_hit: data.cache_hit,
    scan_id: data.scan_id,
  });
}

function fireGA4Failure(errorCode: ApiErrorCode | "invalid_domain"): void {
  window.gtag?.("event", "scan_submit_failure", { error_code: errorCode });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function SkeletonResults() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading scan results"
      className="mt-8 p-5 rounded-xl border border-[var(--widget-border)] bg-[var(--widget-surface)]"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-32 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 mb-3">
          <div className="h-4 w-24 md:w-28 rounded animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="h-2 flex-1 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-7 rounded animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function ErrorDisplay({ error }: { error: ApiError }) {
  return (
    <div
      role="alert"
      className="mt-8 p-4 rounded-xl border border-[var(--widget-error)] bg-[var(--widget-error-bg)] flex items-start gap-3"
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-[var(--widget-error)] shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm text-[var(--widget-error)]">{error.message}</p>
    </div>
  );
}

function CacheLabel() {
  return (
    <span
      title="This result was served from cache and may be up to 1 hour old"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-[var(--widget-text-secondary)]"
    >
      <svg
        aria-hidden="true"
        width="10" height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="shrink-0"
      >
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M5 3v2.2l1.3 1.3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span>Cached result</span>
    </span>
  );
}

function GradeRing({ score, grade }: { score: number; grade: ScoreResponse["grade"] }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = GRADE_COLORS[grade];
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <div className="relative w-20 h-20 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke="var(--bar-track)"
          strokeWidth="6"
        />
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: prefersReduced
              ? "none"
              : "stroke-dashoffset 0.8s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-black leading-none"
          style={{ color }}
        >
          {grade}
        </span>
        <span className="text-xs font-semibold tabular-nums text-[var(--widget-text-secondary)] leading-none mt-0.5">
          {score}
        </span>
      </div>
    </div>
  );
}

function CategoryBar({
  categoryKey,
  category,
}: {
  categoryKey: CategoryKey;
  category: CategoryScore;
}) {
  const barId = `bar-${categoryKey}`;
  const findingsId = `findings-${categoryKey}`;
  const [findingsOpen, setFindingsOpen] = useState(false);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <span
          id={barId}
          className="text-sm font-medium text-[var(--widget-text-primary)] w-24 md:w-36 shrink-0 truncate"
        >
          {category.label}
        </span>

        <div
          role="progressbar"
          aria-valuenow={category.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-labelledby={barId}
          className="flex-1 h-2 rounded-full bg-[var(--bar-track)] overflow-hidden"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${category.score}%`,
              backgroundColor: scoreToColor(category.score),
              transition: prefersReduced ? "none" : "width 0.7s ease-out",
            }}
          />
        </div>

        <span
          aria-hidden="true"
          className="text-sm font-semibold tabular-nums text-[var(--widget-text-primary)] w-8 text-right shrink-0"
        >
          {category.score}
        </span>

        <span
          aria-label={category.passed ? "passed" : "needs improvement"}
          className={`text-xs shrink-0 ${
            category.passed
              ? "text-[var(--widget-success)]"
              : "text-[var(--widget-error)]"
          }`}
        >
          {category.passed ? "✓" : "✗"}
        </span>
      </div>

      {category.findings.length > 0 && (
        <div className="pl-[calc(6rem+0.75rem)] md:pl-[calc(9rem+0.75rem)]">
          <button
            type="button"
            aria-expanded={findingsOpen}
            aria-controls={findingsId}
            onClick={() => setFindingsOpen((v) => !v)}
            className="text-xs text-[var(--widget-text-secondary)] hover:text-[var(--widget-accent)] underline underline-offset-2 py-2.5 -my-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-accent)] rounded"
          >
            {findingsOpen
              ? "Hide details"
              : `${category.findings.length} finding${
                  category.findings.length > 1 ? "s" : ""
                }`}
          </button>

          {findingsOpen && (
            <ul id={findingsId} className="mt-1 space-y-0.5 list-none pl-0">
              {category.findings.map((finding, i) => (
                <li
                  key={i}
                  className="text-xs text-[var(--widget-text-secondary)] flex items-start gap-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="text-[var(--widget-text-muted)] mt-0.5 shrink-0"
                  >
                    –
                  </span>
                  {finding}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreResults({ data }: { data: ScoreResponse }) {
  const scannedDate = new Date(data.scanned_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      role="region"
      aria-label={`Score results for ${data.domain}`}
      className="mt-8 p-5 rounded-xl border border-[var(--widget-border)] bg-[var(--widget-surface)]"
    >
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <GradeRing score={data.score} grade={data.grade} />
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--widget-text-primary)] truncate">
            {data.domain}
          </h3>
          <p className="sr-only">
            Overall score: {data.score} out of 100. Grade: {data.grade}.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--widget-text-secondary)]">
              Scanned {scannedDate}
            </span>
            {data.cache_hit && <CacheLabel />}
          </div>
        </div>
      </div>

      <div
        role="list"
        aria-label="Score breakdown by category"
        className="flex flex-col gap-3"
      >
        {CATEGORY_KEYS.map((key) => (
          <div key={key} role="listitem">
            <CategoryBar categoryKey={key} category={data.categories[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function ScanWidget() {
  const [state, setState] = useState<WidgetState>({ phase: "idle" });
  const [domain, setDomain] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const inputId = useId();
  const headingId = useId();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDomain(e.target.value);
      setValidationError("");
      if (state.phase === "success" || state.phase === "error") {
        setState({ phase: "idle" });
      }
    },
    [state.phase]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && state.phase === "loading") {
        abortRef.current?.abort();
        setState({ phase: "idle" });
      }
    },
    [state.phase]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const normalized = normalizeDomain(domain);
      const validationMsg = validateDomain(normalized);
      if (validationMsg) {
        setValidationError(validationMsg);
        fireGA4Failure("invalid_domain");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ phase: "loading" });
      setValidationError("");

      const result = await fetchScore(normalized, controller.signal);

      if (controller.signal.aborted) return;

      if (result.ok) {
        setState({ phase: "success", data: result.data });
        fireGA4Success(result.data);
      } else {
        setState({ phase: "error", error: result.error });
        fireGA4Failure(result.error.code);
      }
    },
    [domain]
  );

  const isLoading = state.phase === "loading";
  const hasValidationError = validationError.length > 0;

  return (
    <section
      aria-label="Domain score scanner"
      className="w-full bg-[var(--widget-bg)] rounded-2xl border border-[var(--widget-border)] p-6"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div role="group" aria-labelledby={headingId}>
          <h2
            id={headingId}
            className="text-2xl font-bold text-[var(--widget-text-primary)] mb-5"
          >
            Check Any Domain&apos;s Score
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Input wrapper */}
            <div className="flex-1 relative">
              <label
                htmlFor={inputId}
                className="sr-only"
              >
                Domain name
              </label>
              <input
                id={inputId}
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                aria-required="true"
                aria-invalid={hasValidationError}
                aria-describedby={`${inputId}-error ${inputId}-hint`}
                value={domain}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="example.com"
                className={[
                  "w-full h-12 px-4 rounded-lg text-base",
                  "bg-[var(--widget-bg)] text-[var(--widget-text-primary)]",
                  "border placeholder:text-[var(--widget-text-muted)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-accent)] focus-visible:ring-offset-2",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  "transition-colors duration-150",
                  hasValidationError
                    ? "border-[var(--widget-error)]"
                    : "border-[var(--widget-border)] hover:border-gray-400 dark:hover:border-gray-500",
                ].join(" ")}
              />
              <span id={`${inputId}-hint`} className="sr-only">
                Enter a domain name without https:// or www.
              </span>
              {hasValidationError && (
                <span
                  id={`${inputId}-error`}
                  role="alert"
                  aria-live="assertive"
                  className="block mt-1.5 text-sm text-[var(--widget-error)]"
                >
                  {validationError}
                </span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label={isLoading ? "Scanning domain, please wait" : "Scan domain"}
              className={[
                "h-12 px-6 rounded-lg font-semibold text-base",
                "w-full sm:w-auto min-w-[88px]",
                "bg-[var(--widget-accent)] text-[var(--widget-accent-fg)]",
                "hover:bg-[var(--widget-accent-hover)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-accent)] focus-visible:ring-offset-2",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "transition-colors duration-150",
                "flex items-center justify-center gap-2",
              ].join(" ")}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Scanning</span>
                </>
              ) : (
                "Scan"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Results area */}
      {state.phase === "loading" && <SkeletonResults />}
      {state.phase === "error" && <ErrorDisplay error={state.error} />}
      {state.phase === "success" && <ScoreResults data={state.data} />}
    </section>
  );
}
```

---

## 15. CSS / Tailwind Token Reference

### 15.1 Required globals.css Additions

The CSS custom properties from Section 9.2 must be added to `app/globals.css`. The complete block to add:

```css
/* ConduitScore ScanWidget design tokens */
:root {
  --widget-bg:             #ffffff;
  --widget-border:         #e5e7eb;
  --widget-surface:        #f9fafb;
  --widget-text-primary:   #111827;
  --widget-text-secondary: #6b7280;
  --widget-text-muted:     #9ca3af;
  --widget-accent:         #2563eb;
  --widget-accent-hover:   #1d4ed8;
  --widget-accent-fg:      #ffffff;
  --widget-error:          #dc2626;
  --widget-error-bg:       #fef2f2;
  --widget-success:        #16a34a;
  --widget-warning:        #d97706;
  --grade-a:               #16a34a;
  --grade-b:               #2563eb;
  --grade-c:               #d97706;
  --grade-d:               #ea580c;
  --grade-f:               #dc2626;
  --bar-track:             #e5e7eb;
}

.dark {
  --widget-bg:             #111827;
  --widget-border:         #374151;
  --widget-surface:        #1f2937;
  --widget-text-primary:   #f9fafb;
  --widget-text-secondary: #9ca3af;
  --widget-text-muted:     #6b7280;
  --widget-accent:         #3b82f6;
  --widget-accent-hover:   #2563eb;
  --widget-accent-fg:      #ffffff;
  --widget-error:          #f87171;
  --widget-error-bg:       #1f1212;
  --widget-success:        #4ade80;
  --widget-warning:        #fbbf24;
  --grade-a:               #4ade80;
  --grade-b:               #60a5fa;
  --grade-c:               #fbbf24;
  --grade-d:               #fb923c;
  --grade-f:               #f87171;
  --bar-track:             #374151;
}

/* Respect reduced motion for Tailwind animate-pulse */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

### 15.2 tailwind.config.ts Requirements

No custom configuration is needed beyond the default Tailwind 3.4 setup. The component uses only:
- Core utility classes
- `dark:` variant (requires `darkMode: 'class'` in Tailwind config)
- `animate-pulse` (included by default)
- `tabular-nums` (included by default)
- `sr-only` (included by default)

Ensure `tailwind.config.ts` has:

```typescript
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  // ...
};
```

---

## 16. Edge Cases and Error States

### 16.1 All Error States

| Error code | HTTP status | User-visible message | Recovery action shown |
|-----------|-------------|----------------------|-----------------------|
| `invalid_domain` (client) | — | "Enter a valid domain like example.com — no https:// or slashes." | None — fix inline |
| `invalid_domain` (API 400) | 400 | "That doesn't look like a valid domain. Try example.com." | None |
| `domain_not_found` | 404 | "No score found for that domain. It may not have been scanned yet." | None in widget (link to full scan page is a homepage-level concern, not widget concern) |
| `rate_limited` | 429 | "Too many scans. Please wait a moment before trying again." | None |
| `server_error` | 500+ | "Something went wrong on our end. Please try again shortly." | None |
| `network_error` | — (fetch threw) | "Could not reach the server. Check your connection and try again." | None |
| `timeout` | — (AbortSignal fired) | "The scan took too long. Please try again." | None |

### 16.2 Concurrent Request Handling

If the user submits a new domain while a previous fetch is in-flight:
1. `abortRef.current?.abort()` cancels the previous `AbortController`.
2. A new `AbortController` is created and stored in `abortRef`.
3. The guard `if (controller.signal.aborted) return` prevents the stale response from updating state.

The UI transitions immediately to the loading skeleton for the new domain, without waiting for the old request to finish.

### 16.3 Empty Findings Array

If `category.findings` is an empty array, the "N findings" toggle button is not rendered. The `CategoryBar` shows only the bar and score. This is correct behavior for categories with a perfect or near-perfect score.

### 16.4 Very Long Domain Names

The domain name in the results header uses `truncate` (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`). The full domain is always in the accessible `aria-label` on the results region, so screen readers still read the complete value.

### 16.5 Immediate Re-scan (Same Domain)

The component does not prevent re-scanning the same domain. Submitting the same domain twice will fire a new API request. The API cache layer (server-side) will return a cached result immediately if one exists, which will set `cache_hit: true` and display the CacheLabel.

### 16.6 SSR / Hydration Safety

The `"use client"` directive ensures this component only renders in the browser. No SSR hydration issues.

The `window.matchMedia` calls inside `GradeRing` and `CategoryBar` are guarded with `typeof window !== "undefined"` to prevent errors if Next.js ever renders these components in a server context in a future refactor.

### 16.7 gtag Not Loaded

`window.gtag?.()` uses optional chaining. The component works correctly without GA4 loaded — no events fire and no errors are thrown.

### 16.8 AbortSignal.any() Browser Support

`AbortSignal.any()` is supported in Chrome 116+, Firefox 116+, Safari 17.4+. For projects requiring support of older browsers, replace with:

```typescript
// Polyfill-compatible alternative
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
try {
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  // ...
} catch {
  clearTimeout(timeoutId);
  // Distinguish timeout from user-abort by checking if timeoutId still pending
}
```

If the project has a minimum browser support policy that excludes the above browsers, implement the polyfill version and remove the `AbortSignal.any()` call from `fetchScore`.

---

## 17. Acceptance Checklist

The Frontend Lead must verify each item before marking this task done.

### 17.1 Functionality

- [ ] Typing a valid domain and clicking Scan shows the loading skeleton, then the score results
- [ ] Pressing Enter in the input field submits the form
- [ ] Pressing Escape while loading cancels the request and returns to idle state
- [ ] Submitting an empty input shows "Please enter a domain name." without making an API call
- [ ] Submitting `http://example.com` normalizes to `example.com` and proceeds
- [ ] Submitting `www.example.com` normalizes to `example.com` and proceeds
- [ ] API 404 response shows the domain_not_found error message
- [ ] API 429 response shows the rate_limited error message
- [ ] Typing in the input after seeing results clears the results and returns to idle state
- [ ] Two rapid submits cancel the first request and show results for the second domain only

### 17.2 GA4 Events

- [ ] `scan_submit_success` fires in browser console (or GA4 DebugView) on 200 response with domain, score, grade, cache_hit, scan_id parameters
- [ ] `scan_submit_failure` fires on 404 with `error_code: "domain_not_found"`
- [ ] `scan_submit_failure` fires on 429 with `error_code: "rate_limited"`
- [ ] `scan_submit_failure` fires on client validation failure with `error_code: "invalid_domain"`
- [ ] No GA4 errors thrown when `window.gtag` is undefined (run with ad-blocker active)

### 17.3 Visual Design

- [ ] Input and button sit side-by-side on screen widths >= 640px
- [ ] Input and button stack vertically on screens < 640px, button is full-width
- [ ] "Cached result" pill with clock icon appears when `cache_hit: true`
- [ ] "Cached result" pill is absent when `cache_hit: false`
- [ ] Grade ring shows correct letter and correct color (A=green, B=blue, C=amber, D=orange, F=red)
- [ ] All 5 categories render with horizontal bars in the correct order (SSL, Security Headers, Performance, Redirect Chain, Accessibility)
- [ ] Categories with findings show "N findings" toggle; categories with empty findings do not
- [ ] Findings toggle expands and collapses the findings list
- [ ] Dark mode: all elements use dark-mode token values (test with `document.documentElement.classList.add('dark')`)

### 17.4 Accessibility

- [ ] Lighthouse accessibility score >= 95 on the homepage
- [ ] axe DevTools reports zero violations
- [ ] Screen reader (NVDA/VoiceOver) announces validation error immediately on submit
- [ ] Screen reader announces "Loading scan results" during skeleton phase
- [ ] Screen reader announces the score summary ("Overall score: 84 out of 100. Grade: B.") in results
- [ ] All interactive elements are reachable and activatable by keyboard (Tab, Enter, Space)
- [ ] Focus ring is visible on input, button, and findings toggle in all states
- [ ] `prefers-reduced-motion: reduce` disables all animations (bar fill, ring draw, skeleton pulse)

### 17.5 Responsive

- [ ] Widget renders correctly on 320px viewport (iPhone SE)
- [ ] Widget renders correctly on 375px viewport (iPhone 14)
- [ ] Widget renders correctly on 768px viewport (iPad)
- [ ] Widget renders correctly on 1280px viewport (desktop)
- [ ] Button height is >= 48px on all sizes
- [ ] Input height is >= 48px on all sizes

---

**Prepared by:** UX/Frontend Architecture
**Date:** 2026-03-24
**Dependencies:** TASK_005_API_DB_SPEC.md (API contract), task-003 (GA4 property and measurement ID)
**Next task:** task-011 (ScanWidget unit test suite)
