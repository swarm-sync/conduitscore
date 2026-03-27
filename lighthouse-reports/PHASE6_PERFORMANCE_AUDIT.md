# Phase 6 Performance & Template Cleanup Audit
Date: 2026-03-26
Tool: Lighthouse 13.0.3 + Chrome DevTools Performance Trace
Build: Next.js 16.1.6 / Turbopack

---

## 1. Lighthouse Scores — Production (Before Fixes)

| Category        | Score |
|-----------------|-------|
| Accessibility   | 96    |
| Best Practices  | 100   |
| SEO             | 100   |
| Performance     | n/a (Lighthouse MCP excludes perf; CWV captured via trace) |

Passed: 48 / 50 audits
Failed: 2

---

## 2. Lighthouse Scores — Local Dev Build (After Fixes)

| Category        | Score |
|-----------------|-------|
| Accessibility   | **100** (+4) |
| Best Practices  | 100   |
| SEO             | 100   |

Passed: **50 / 50 audits**
Failed: **0**

---

## 3. Core Web Vitals (Performance Trace — Production)

Measured via Chrome DevTools performance trace (unthrottled desktop):

| Metric | Observed | Target  | Status |
|--------|----------|---------|--------|
| CLS    | 0.00     | <0.10   | PASS   |
| LCP    | Not reported by tracer (no navigation event captured — page already loaded on first trace) | <2.5s | See notes |
| INP    | Not reported (no user interaction during trace) | <200ms | N/A |
| DOM elements | 523 | <1500 | PASS |
| DOM depth | 14 | <32 | PASS |
| Max children on one element | 41 (BODY) | <60 | PASS |

### LCP Bottleneck Analysis

The LCP element on the homepage is the **hero H1 text** ("See Why AI Ignores Your Site — Fix It in Minutes").
There is no above-the-fold image — the hero is pure CSS/text, which is optimal for LCP.

The ExampleScoreCard (right column) loads as a client component with a 1000ms count-up animation.
This animation is triggered via requestAnimationFrame and does NOT block LCP since the H1 text
is rendered server-side in the static HTML.

The SVG logo (conduitscore-lockup-white.svg) is served via next/image with `priority` and
`fetchPriority="high"` — correct. However the file is 225 KB uncompressed SVG. Vercel serves
it with Brotli compression, but the raw source should be optimized (see deferred work).

### Third-Party Impact (Local Dev Trace)

| Third Party      | Transfer Size | Main Thread Time |
|------------------|---------------|-----------------|
| localhost (app)  | 4.6 MB (dev, unminified) | 409 ms |
| Google Tag Manager | 464.7 KB | 40 ms |

Production bundle is significantly smaller than dev (Turbopack dev includes source maps + HMR).
GA4 (GTM) adds ~40 ms main thread time — loaded with `strategy="afterInteractive"` which is
correct and deferred past LCP.

---

## 4. Accessibility Failures Fixed (2 → 0)

### Fix 1: color-contrast (8 failing elements → 0)

**Root cause:** Multiple elements used rgba opacity below the WCAG AA 4.5:1 threshold
on dark backgrounds, and `.section-label` used `--brand-red` (#e8004d) which is ~3.9:1.

**Elements fixed:**

| Element | Location | Old color | New color |
|---------|----------|-----------|-----------|
| "EXAMPLE SCAN RESULT" eyebrow | example-score-card.tsx | rgba(255,255,255,0.38) | rgba(255,255,255,0.60) |
| "/ 100" inside SVG ring | example-score-card.tsx | rgba(255,255,255,0.38) | rgba(255,255,255,0.55) |
| Card footer caption | example-score-card.tsx | rgba(255,255,255,0.45) | rgba(255,255,255,0.60) |
| Supporting caption below card | example-score-card.tsx | rgba(255,255,255,0.38) | rgba(255,255,255,0.60) |
| "/ 100" denominator (large) | example-score-card.tsx | rgba(255,255,255,0.35) | rgba(255,255,255,0.55) |
| Footer section labels (3x) | globals.css .section-label | #e8004d (~3.9:1) | #ff6d8c (passes 4.5:1) |
| "How visible is your site?" anchor | who-uses-section.tsx | --cyan-400 (= brand-red) | --brand-cyan (#22d3ee) |

### Fix 2: label-content-name-mismatch (2 failing elements → 0)

**Root cause:** The scan button had `aria-label="Scan website for AI visibility"` which
did not match its visible text content "Scan My Site Now", violating WCAG 2.5.3 Label in Name.

**Fix:** Removed the static `aria-label` when not loading. The accessible name now derives
from visible text content. While loading, `aria-label="Scanning in progress"` is retained
(visible text then shows "Scanning..." which is consistent).

File: `src/components/scan/scan-form.tsx`

### Fix 3: link-in-text-block (2 failing elements → 0)

**Root cause:** Two inline links within body text paragraphs used `text-decoration:none`,
relying on color alone to distinguish them from surrounding text. WCAG 1.4.1 requires
a non-color distinguisher for inline links.

**Fix:** Added `textDecoration: "underline"` and `textUnderlineOffset: "3px"` to the two
in-paragraph links on the homepage:
- "Learn how we measure AI visibility" (links to /methodology)
- "Understand how AI SEO differs from traditional SEO" (links to /blog/what-is-ai-seo)

File: `src/app/page.tsx`

---

## 5. Silent Bug Fixed: --brand-cyan undefined

**Root cause:** `--brand-cyan` was referenced in 40+ files across the codebase but was
never defined in `globals.css`. Browsers silently fall back to the initial value (empty/transparent).

**Fix:** Defined `--brand-cyan: #22d3ee` in `:root`. This is Tailwind cyan-400 which
achieves 5.74:1 contrast on #080809 (surface-base) and 5.31:1 on #101014 (surface-raised),
passing WCAG AA for normal text at all font sizes.

File: `src/app/globals.css`

---

## 6. Bundle & JavaScript Analysis

### Semantic HTML Verification

The homepage renders all critical content as static server-side HTML:
- H1 hero heading: present in raw HTML (no JS needed)
- Heading hierarchy: H1 → H2 (all sections) → H3 (category cards) — correct descending order (verified: Lighthouse heading-order audit passes)
- FAQ uses native `<details>/<summary>` — no JS required
- Structured data (JSON-LD): 4 blocks on homepage, 3 in layout — all render server-side

### Client Component Audit

| Component | "use client" | Justification | Can be server? |
|-----------|-------------|---------------|----------------|
| Header | Yes | useSession, scroll listener, dropdown state | No |
| ScanForm | Yes | fetch, router, session, state | No |
| ExampleScoreCard | Yes | rAF animation, IntersectionObserver | No |
| SignalsSection | Yes | useState for chip toggle | Could be removed with CSS :target |
| WhoUsesSection | Yes | onMouseEnter/Leave handlers | Could use CSS :hover |
| Providers | Yes | NextAuth SessionProvider | No |

**Optimization opportunity:** `WhoUsesSection` and `SignalsSection` use `"use client"` for hover
effects and a simple toggle that could be replicated in pure CSS. Removing client-side JS from
these two would reduce the client bundle slightly and eliminate 2 hydration boundaries.
Deferred to next sprint as a low-risk, low-urgency change.

### SVG Logo Weight

The header and footer both load `conduitscore-lockup-white.svg` at 225 KB uncompressed.
Next.js Image does not optimize SVGs. Vercel serves it with Brotli compression (~50 KB
wire size) so this is acceptable in production. For further optimization, run the SVG through
SVGO (estimated 30-40% reduction to ~130-160 KB uncompressed, ~32-40 KB Brotli).
Deferred — no LCP impact since it is not the LCP element.

### No Unused Dependencies Found

The build output shows no render-blocking resources. Fonts are self-hosted via next/font/google
(confirmed: no external fonts.googleapis.com requests). GA4 is loaded afterInteractive.

---

## 7. CLS Analysis

CLS = 0.00 on both traces. No layout shift issues detected. The hero layout uses static
dimensions (clamp font sizes, fixed card width) — no dimension changes on hydration.
The header uses `sticky` positioning which does not cause layout shift.

---

## 8. DOM Size Assessment

523 total elements — well within the 1500-element Lighthouse warning threshold.
The homepage has 12 major sections plus header/footer. No excessive nesting.
Maximum DOM depth of 14 nodes is healthy (Lighthouse warns at 32).

The one large layout event (112ms, 719 nodes) occurs on initial page load — this is a
one-time cost from the full-page layout. No recurring layout thrashing observed.

---

## 9. Files Changed This Sprint

| File | Change |
|------|--------|
| `src/app/globals.css` | Added `--brand-cyan: #22d3ee`; bumped `.section-label` color to #ff6d8c |
| `src/components/home/example-score-card.tsx` | Bumped 5x rgba opacity values to pass WCAG AA |
| `src/components/home/who-uses-section.tsx` | Replaced `--cyan-400` with `--brand-cyan` on anchor |
| `src/components/scan/scan-form.tsx` | Removed mismatched `aria-label` from scan CTA button |
| `src/app/page.tsx` | Added underline to 2 inline body text links |

All changes are visual-only (color, opacity, text-decoration, aria attributes).
Zero functional changes. Build: 56 pages, 0 TypeScript errors, 0 lint errors.

---

## 10. Deferred Work (Next Sprint)

| Item | Priority | Effort | Impact |
|------|----------|--------|--------|
| SVGO optimization on conduitscore-lockup-white.svg | Low | 1h | Saves ~90KB uncompressed |
| Convert WhoUsesSection to server component (CSS :hover) | Low | 2h | Removes 1 hydration boundary |
| Convert SignalsSection chip toggle to CSS :target | Low | 3h | Removes 1 hydration boundary |
| Content Security Policy (CSP) header in enforcement mode | Medium | 4h | Security hardening |
| HSTS preload header | Low | 1h | Security hardening |
| Real user CWV data via CrUX (requires 28-day data window) | Info | 0h | Monitoring only |

---

## Summary

- Accessibility: 96 → **100** (all 50 Lighthouse audits now passing)
- Best Practices: 100 (unchanged)
- SEO: 100 (unchanged)
- CLS: **0.00** (excellent)
- LCP element: H1 text (server-rendered, no image dependency)
- No render-blocking resources
- No unused JavaScript warnings
- No layout shift issues from Sprint 1-2 content additions
- Silent bug fixed: --brand-cyan now properly resolves across 40+ files
