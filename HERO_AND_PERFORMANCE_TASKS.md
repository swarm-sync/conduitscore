# ConduitScore — Hero Section & Performance Fix Tasks
## Created: 2026-03-17

---

## TRACK A: Casey — UI / Hero Section Fixes ✅ COMPLETE

### Fix Teaser (Critical)
- [x] **A1. Split code fix teaser into one visible fix + blurred rest**
  - Show ONE unblurred fix (e.g., `User-agent: GPTBot / Allow: /`) so visitor sees real value
  - Blur remaining 2-3 fix previews with overlay CTA: "Upgrade to unlock all fixes"
  - Free tier behavior: each scan reveals only 1 fix unblurred; rest stay blurred
  - This is a product decision: we do NOT give away all fixes for free

### Hero Spacing (Mobile + Desktop)
- [x] **A2. Reduce mobile hero top spacing**
  - Reduced inner paddingTop from 80px → 40px on mobile (<768px)
  - Used inline `<style>` tag (Tailwind v4 strips custom CSS vars/classes)
- [x] **A3. Reduce desktop hero top spacing slightly**
  - Reduced inner paddingTop from 80px → 56px
- [x] **A4. Reduce hero bottom padding on mobile**
  - Reduced paddingBottom from 112px → 56px on mobile

### Left Column Prose
- [x] **A5. Expand left column prose to ~35 words**
  - Expanded to ~32 words covering all 7 signals and AI model names

### Accessibility (from Lighthouse)
- [x] **A6. Fix duplicate ARIA IDs** — used React 19 `useId()` for unique IDs per ScanForm instance
- [x] **A7. Fix multiple labels on hero form field** — resolved via useId() approach
- [x] **A8. Fix `role="img"` on `<article>` element** — changed `<article>` to `<div>` with proper role
- [x] **A9. Fix contrast issues** — bumped `--text-tertiary` from `#71717a` to `#8a8a96`

---

## TRACK B: Rowan — Page Speed / Performance Fixes ✅ COMPLETE

### Render-Blocking Resources (High Impact)
- [x] **B1. Self-host Google Fonts via `next/font/google`**
  - Eliminated render-blocking Google Fonts requests
  - Self-hosted Inter, JetBrains Mono, Syne with `display: "swap"`
  - Mobile savings: ~1,660ms; Desktop savings: ~550ms

### LCP Optimization
- [x] **B2. Add `fetchpriority="high"` to LCP image (ConduitScore logo)**
  - Added `priority` prop + explicit `fetchPriority="high"` to header logo
- [x] **B3. Optimize LCP image delivery** — converted logo from PNG (748KB) to WebP (76KB), 90% reduction

### JavaScript Optimization
- [x] **B4. Remove legacy JavaScript polyfills** — added browserslist targeting modern browsers only
- [x] **B5. Reduce unused JavaScript** — tree-shaking and code-split improvements
- [x] **B6. Remove duplicated JavaScript modules** — bundle optimization

### CSS Optimization
- [x] **B7. Reduce unused CSS** — deferred non-critical CSS rules
- [x] **B8. Minify CSS files** — enabled via Next.js config

### Animation Performance
- [x] **B9. Fix non-composited animations** — 7 progress bars now use `transform: scaleX()` + `will-change: transform`

### Caching & Delivery
- [x] **B10. Set efficient cache lifetimes** — configured in `next.config.ts` with `minimumCacheTTL` and cache headers
- [x] **B11. Ensure proper compression** — `compress: true` in Next.js config (gzip/brotli)

---

## VERIFICATION ✅ COMPLETE

- [x] **V1. Hudson-Kraken audit on Casey's Track A changes** — PASS (6 issues found, 6 fixed, all verified real)
- [x] **V2. Hudson-Kraken audit on Rowan's Track B changes** — PASS (all perf fixes verified)
- [x] **V3. `npm run build` — 0 errors, 0 warnings** ✅
- [x] **V4. Tests — 86/86 passing (100%)** ✅
- [x] **V5. ESLint — 0 errors** ✅

---

## AUDIT RESULTS

| Metric | Result |
|--------|--------|
| Hudson issues found | 6 (2 High, 4 Medium) |
| Hudson fixes applied | 6/6 |
| Kraken fix authenticity | 100% (all verified REAL) |
| Build | Clean |
| Tests | 86/86 (100%) |
| Lint | 0 errors |
| **Final Verdict** | **GO** ✅ |
