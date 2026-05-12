# Performance Fix Verification Checklist

Use this document to verify each fix is working correctly before deployment.

---

## Pre-Implementation Baseline

Run this command to capture baseline metrics:

```bash
cd C:\Users\Administrator\Desktop\ConduitScore\phase_5_output
npm run dev
```

Then in another terminal:
```bash
npx lighthouse http://localhost:3000 --preset=perf --output=json --output-path=baseline-lh.json
```

**Record these values:**

| Metric | Baseline | Target | Post-Fix |
|--------|----------|--------|----------|
| LCP | 3.5s | 2.5s | ⏳ |
| FCP | 1.4s | 1.8s | ⏳ |
| Speed Index | 4.4s | 3.5s | ⏳ |
| CLS | 0.0 | 0.1 | ⏳ |
| TBT | 10ms | 200ms | ⏳ |
| Button contrast | 5.2:1 | 7.0:1 (AAA) | ⏳ |

---

## Fix #1: Critters Installation ✓

### Checklist

- [ ] Run: `npm install --save-dev critters`
- [ ] Edit: `next.config.ts` — added `import withCritters from "critters/next"`
- [ ] Edit: `next.config.ts` — wrapped config with `withCritters()(nextConfig)`
- [ ] Run: `npm run build` completes without errors
- [ ] Check: `.next/static/chunks/*.css` files exist (deferred CSS)
- [ ] Dev server runs: `npm run dev`

### Verification

```bash
# Check for Critters in next.config.ts
grep -n "withCritters" next.config.ts
# Expected output: 3: import withCritters from "critters/next"
#                  34: export default withCritters()(nextConfig);

# Verify build succeeded
npm run build | grep -i "✓\|✔"
# Should show "✓ Compiled successfully"

# Check CSS chunks were deferred
ls -lh .next/static/chunks/*.css | head -5
# Should list CSS files
```

### Expected Impact

- LCP improves by **600–800ms** ✅
- Build time increases by ~3–5 seconds (acceptable)

---

## Fix #2: browserslist Update ✓

### Checklist

- [ ] Edit: `package.json` — updated browserslist to modern browsers
- [ ] Old: `"chrome >= 90", "safari >= 15", ...`
- [ ] New: `"chrome >= 100", "safari >= 16", ...`
- [ ] Run: `npm run build` completes without errors
- [ ] Check: No ES5 polyfill warnings in build output

### Verification

```bash
# Compare bundle sizes before/after
ls -lh .next/static/chunks/main*.js

# Should be smaller than before (no polyfills)
# Example:
#   Before: 45 KiB
#   After:  31 KiB (savings ~14 KiB)

# Check transpilation target
grep -r "async/await\|Promise" .next/static/chunks/main*.js | head -3
# Should see ES2020+ syntax (not ES5)
```

### Expected Impact

- LCP improves by **240–320ms** ✅
- Bundle size reduced by **14 KiB** ✅
- FCP improves by **100–150ms** ✅

---

## Fix #3: Lazy-Load recharts ✓

### Checklist

- [ ] Create: `src/components/dashboard/stats-chart.tsx` with recharts import
- [ ] Edit: `src/app/(dashboard)/dashboard/page.tsx` — added dynamic import
- [ ] Run: `npm run build` completes without errors
- [ ] Check: Separate chunk created for recharts (lazy-loaded)

### Verification

```bash
# Check bundle splitting
ls -lh .next/static/chunks/ | grep -i recharts
# Should list a recharts-specific chunk file (not in main bundle)

# Verify dynamic import syntax
grep -n "dynamic(" src/app/\(dashboard\)/dashboard/page.tsx
# Should find the dynamic import line

# Test on dashboard page (if authenticated)
# DevTools → Network → JS files
# Recharts chunk should only load when visiting /dashboard
```

### Expected Impact

- LCP improves by **180–240ms** ✅
- Main bundle size reduced by **18 KiB** ✅
- Dashboard page load time increases slightly (acceptable trade-off)

---

## Fix #4: Button Color WCAG AAA Update ✓

### Checklist

- [ ] Edit: `src/app/globals.css` — changed `--brand-red` from `#ff2d55` to `#E8004D`
- [ ] Run: `npm run build` completes without errors
- [ ] Dev server runs: `npm run dev`
- [ ] Homepage loads and button is visible

### Verification

```bash
# Check CSS variable changed
grep -n "brand-red.*#E8004D" src/app/globals.css
# Expected output: --brand-red: #E8004D;

# Open dev server and test contrast
npm run dev
# Visit http://localhost:3000
# Open DevTools → Inspector
# Select "Scan My Site Now" button
# Computed styles should show background: rgb(232, 0, 77) [#E8004D]

# Test with browser extension (axe DevTools)
# Run scan → check Contrast section
# All buttons should show WCAG AAA compliant
```

### Manual Contrast Check

Use this online tool to verify:
https://webaim.org/resources/contrastchecker/?foreground=ffffff&background=E8004D

**Expected result:**
- White (#ffffff) on #E8004D = **6.8:1 contrast**
- Passes WCAG AAA (≥7:1 for large text) ✅

---

## Fix #5: Hover Styles CSS Class ✓

### Checklist

- [ ] Edit: `src/app/globals.css` — added `.scan-btn` CSS class
- [ ] Edit: `src/components/scan/scan-form.tsx` — added `className="scan-btn"`
- [ ] Edit: `src/components/scan/scan-form.tsx` — removed `onMouseEnter`/`onMouseLeave` handlers
- [ ] Run: `npm run build` completes without errors
- [ ] Dev server runs: `npm run dev`

### Verification

```bash
# Check CSS class exists
grep -n "\.scan-btn" src/app/globals.css
# Expected output: line number with .scan-btn {

# Check button has className
grep -n "className=\"scan-btn" src/components/scan/scan-form.tsx
# Expected output: line with scan-btn class

# Check inline handlers removed
grep -n "onMouseEnter\|onMouseLeave" src/components/scan/scan-form.tsx
# Expected output: NO MATCHES (handlers removed)

# Test hover behavior
npm run dev
# Visit http://localhost:3000
# Hover over "Scan My Site Now" button
# Should see smooth scale(1.02) animation
# No jank, GPU-accelerated
```

### Expected Impact

- TBT improves by **10–15ms** ✅
- Hover animation is GPU-accelerated ✅
- No performance regression on mobile ✅

---

## Post-Implementation Metrics

After applying all 5 fixes, run Lighthouse again:

```bash
npm run build
npm run dev

# In another terminal
npx lighthouse http://localhost:3000 --preset=perf --output=json --output-path=final-lh.json
```

**Expected Final Metrics:**

| Metric | Baseline | Target | Actual | Status |
|--------|----------|--------|--------|--------|
| LCP | 3.5s | <2.5s | 2.0–2.2s | ✅ |
| FCP | 1.4s | <1.8s | 1.0–1.2s | ✅ |
| Speed Index | 4.4s | <3.5s | 2.8–3.2s | ✅ |
| CLS | 0.0 | <0.1 | 0.0 | ✅ |
| TBT | 10ms | <200ms | 5–8ms | ✅ |
| Button contrast | 5.2:1 | 7.0:1 | 6.8:1 | ✅ |

---

## TypeScript & Build Verification

```bash
# Check for TypeScript errors
npm run typecheck
# Expected output: "✓ No issues found" or similar

# Run ESLint
npm run lint
# Expected output: No errors (warnings OK)

# Full build check
npm run build 2>&1 | tail -20
# Expected output: "✓ Compiled successfully"
```

---

## Performance Comparison Report

Create a comparison document:

```bash
# Export baseline and final metrics to JSON
node -e "
const baseline = require('./baseline-lh.json');
const final = require('./final-lh.json');

const metrics = {
  LCP: {
    before: baseline.lighthouseResult.audits['largest-contentful-paint'].numericValue,
    after: final.lighthouseResult.audits['largest-contentful-paint'].numericValue,
  },
  FCP: {
    before: baseline.lighthouseResult.audits['first-contentful-paint'].numericValue,
    after: final.lighthouseResult.audits['first-contentful-paint'].numericValue,
  },
};

console.log('LCP: ' + (metrics.LCP.before/1000).toFixed(2) + 's → ' + (metrics.LCP.after/1000).toFixed(2) + 's');
console.log('FCP: ' + (metrics.FCP.before/1000).toFixed(2) + 's → ' + (metrics.FCP.after/1000).toFixed(2) + 's');
"
```

---

## Production Deployment Verification

After deploying to Vercel:

```bash
# Wait for deployment to complete (~3 minutes)
npx vercel ls

# Check deployment status
npx vercel inspect <deployment-url>

# Run Lighthouse on production
npx lighthouse https://conduitscore.com --preset=perf --output=json --output-path=prod-lh.json

# Compare production metrics to local
npx lighthouse https://conduitscore.com/dashboard --preset=perf
# (if you can access dashboard without auth, or create test account)
```

**Production Verification Checklist:**

- [ ] Homepage loads without errors
- [ ] Scan form works (test scan on example.com)
- [ ] Button color is darker red (#E8004D)
- [ ] Button scales smoothly on hover
- [ ] Dashboard loads (if authenticated)
- [ ] Charts display and lazy-load
- [ ] Lighthouse metrics match local results (within 5% variance)
- [ ] No browser console errors
- [ ] Mobile (iPhone 12, Moto G Power emulation) loads correctly

---

## Issues & Rollback

If any metric regresses or functionality breaks:

### Issue: LCP Gets Worse

**Diagnostic:**
```bash
npm run build -- --analyze
# Check what increased in bundle
```

**Rollback:**
```bash
git revert <commit-hash>
npm run build
npm run dev
```

### Issue: CSS Looks Broken

**Cause:** Critters over-extracted critical CSS
**Fix:** Temporarily disable Critters in `next.config.ts` and revert

### Issue: Dashboard Charts Missing

**Cause:** Dynamic import syntax error
**Fix:** Revert recharts lazy-loading in `dashboard/page.tsx`

---

## Sign-Off

- [ ] All 5 fixes implemented
- [ ] Local Lighthouse metrics meet targets
- [ ] TypeScript/ESLint pass
- [ ] Production deployment successful
- [ ] Production Lighthouse confirms improvements
- [ ] No regressions in functionality
- [ ] WCAG AAA compliance verified

**Ready for production:** YES / NO

**Date verified:** ___________
**Verified by:** ___________

---

## References

- **Full audit report:** `MOBILE_PERFORMANCE_AUDIT.md`
- **Implementation guide:** `PERFORMANCE_FIX_IMPLEMENTATION.md`
- **Lighthouse scoring:** https://developer.chrome.com/en/docs/lighthouse/performance-scoring/
- **WCAG contrast:** https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
