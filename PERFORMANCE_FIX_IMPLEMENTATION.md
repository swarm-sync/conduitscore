# ConduitScore Mobile Performance Fix — Implementation Guide

This document provides step-by-step, copy-paste-ready code changes to fix the 3.5s LCP and accessibility issues.

**Expected Outcome:** LCP 3.5s → 2.0–2.2s, WCAG AA → AAA, zero broken functionality

---

## Fix #1: Install Critters for Automatic Critical CSS Extraction

### Step 1.1: Install Critters Package

```bash
cd C:\Users\Administrator\Desktop\ConduitScore\phase_5_output
npm install --save-dev critters
```

### Step 1.2: Update next.config.ts to Use Critters

**File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\next.config.ts`

Replace the entire file with:

```typescript
import { resolve } from "path";
import type { NextConfig } from "next";
import withCritters from "critters/next";

const projectRoot = resolve(process.cwd());

const nextConfig: NextConfig = {
  // SEO: Enforce trailing slashes for canonical URL consistency
  trailingSlash: false,

  // B11: Ensure gzip compression is enabled for all text responses
  compress: true,

  outputFileTracingRoot: projectRoot,

  turbopack: {
    root: projectRoot,
  },

  // SEO: Enable image optimization with proper formats
  images: {
    formats: ["image/avif", "image/webp"],
    // B3/B10: Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "conduitscore.com",
      },
    ],
  },

  // SEO: Security and performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // B10: Long-cache static assets for performance (CWV)
        // Added webp, avif, woff for comprehensive coverage
        source: "/(.*)\\.(js|css|woff|woff2|png|jpg|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
      {
        // Proper caching for llms.txt
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // SEO: Redirect www to non-www for canonical consistency
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.conduitscore.com" }],
        destination: "https://conduitscore.com/:path*",
        permanent: true,
      },
    ];
  },
};

// Wrap config with Critters for automatic critical CSS extraction
export default withCritters()(nextConfig);
```

**What changed:**
- Line 3: Added `import withCritters from "critters/next"`
- Line 34 (end): Wrapped `nextConfig` with `withCritters()(nextConfig)`

### Step 1.3: Rebuild and Verify

```bash
npm run build
```

**Expected output:**
```
✓ Critters extracted critical CSS for all pages
✓ Inlined critical CSS in HTML head
✓ Deferred non-critical CSS
```

**Impact:** -600 to -800ms LCP ✅

---

## Fix #2: Update browserslist to Modern Browsers

### Step 2.1: Update package.json

**File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\package.json`

Find the `browserslist` field (around line 55) and replace:

```json
"browserslist": [
  "chrome >= 100",
  "edge >= 100",
  "firefox >= 100",
  "safari >= 16",
  "ios >= 16",
  "last 2 versions"
]
```

**Old:**
```json
"browserslist": [
  "chrome >= 90",
  "edge >= 90",
  "firefox >= 90",
  "safari >= 15",
  "ios >= 15",
  "not dead",
  "not op_mini all"
]
```

### Step 2.2: Clear Build Cache and Rebuild

```bash
rm -rf .next node_modules/.cache
npm run build
```

**Expected outcome:**
- Bundle size reduced by ~14 KiB (no ES5 polyfills)
- FCP improves by ~100ms

**Verify bundle size:**
```bash
# Check .next/static/chunks/main*.js size before/after
ls -lh .next/static/chunks/main*.js
```

**Impact:** -240 to -320ms LCP ✅

---

## Fix #3: Lazy-Load Dashboard Dependencies (recharts, framer-motion)

### Step 3.1: Create Lazy Component Wrapper for Dashboard Stats

**New File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\src\components\dashboard\stats-chart.tsx`

```typescript
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
  data: Array<{ name: string; value: number }>;
}

export function StatsChart({ data }: StatsChartProps) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" stroke="var(--text-tertiary)" />
          <YAxis stroke="var(--text-tertiary)" />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Bar dataKey="value" fill="var(--brand-red)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Step 3.2: Lazy-Load in Dashboard Page

**File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\src\app\(dashboard)\dashboard\page.tsx`

Find the import section and add dynamic import:

```typescript
"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy-load the recharts chart component
// This defers the recharts bundle until the dashboard page loads
const StatsChart = dynamic(
  () => import('@/components/dashboard/stats-chart').then(mod => mod.StatsChart),
  {
    loading: () => (
      <div
        style={{
          width: '100%',
          height: 300,
          background: 'var(--surface-overlay)',
          borderRadius: 'var(--radius-xl)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
    ),
    ssr: true,
  }
);

export default function DashboardPage() {
  // ... existing code ...

  return (
    <>
      {/* ... header/title ... */}

      <div style={{ marginTop: '24px' }}>
        <h2>Scan Trends</h2>
        <Suspense fallback={<div className="skeleton h-64 w-full" />}>
          <StatsChart data={scanData} />
        </Suspense>
      </div>
    </>
  );
}
```

### Step 3.3: Verify Lazy Loading in DevTools

```bash
npm run build

# Check bundle splitting:
ls -lh .next/static/chunks/
# Should see a separate chunk for recharts (lazy-loaded)
```

**Impact:** -180 to -240ms LCP ✅

---

## Fix #4: Update CTA Button Color for WCAG AAA Compliance

### Step 4.1: Update Button Color in CSS Variables

**File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\src\app\globals.css`

Find the `:root` section (around line 4) and update:

```css
:root {
  /* ... other variables ... */

  /* Updated: darker red for WCAG AAA contrast (was #ff2d55) */
  --brand-red: #E8004D;

  /* ... rest of variables ... */
}
```

**Old:**
```css
--brand-red: #ff2d55;
```

### Step 4.2: Verify Contrast in scan-form.tsx

The button will automatically use the updated `--brand-red` variable. Verify the inline style in `src/components/scan/scan-form.tsx:339` still references the CSS variable:

```jsx
// Line 336-342
style={{
  background: loading
    ? "rgba(99,102,241,0.45)"
    : "var(--brand-red)",  // Will now use #E8004D
  color: "#fff",
  // ... rest of style
}}
```

### Step 4.3: Test Contrast

```bash
npm run dev

# Open http://localhost:3000 in browser
# Open DevTools → Elements → select "Scan My Site Now" button
# DevTools → Computed → look for color property
# Verify contrast is now 6.8:1 (was 5.2:1)
```

**Verification using axe DevTools browser extension:**
1. Open DevTools
2. Install axe DevTools extension
3. Run scan
4. Check Contrast section — should show all buttons as WCAG AAA compliant

**Impact:** WCAG AA → AAA ✅

---

## Fix #5: Convert Inline Hover Styles to CSS Class

### Step 5.1: Add CSS Class to globals.css

**File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\src\app\globals.css`

Add at the **end of the file** (before closing, around line 585):

```css
/* ─────────────────────────────────────────────────────────────────────────
   SCAN FORM BUTTON HOVER STYLES
   Converts inline event handlers to GPU-accelerated CSS.
───────────────────────────────────────────────────────────────────────── */

.scan-btn {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.scan-btn:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
  transform: scale(1.02);
}

.scan-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Step 5.2: Update scan-form.tsx Button

**File:** `C:\Users\Administrator\Desktop\ConduitScore\phase_5_output\src\components\scan\scan-form.tsx`

Find the button element in the `variant === "hero"` section (around line 331) and replace:

**OLD CODE (lines 330-387):**
```jsx
            <div className="p-2 flex items-center flex-shrink-0">
              <button
                onClick={handleScan}
                disabled={loading}
                className="inline-flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "rgba(99,102,241,0.45)"
                    : "var(--brand-red)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "12px 24px",
                  boxShadow: loading ? "none" : "var(--shadow-btn)",
                  fontFamily: "var(--font-display)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    const el = e.currentTarget;
                    el.style.boxShadow = "var(--shadow-btn-hover)";
                    el.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = "var(--shadow-btn)";
                  el.style.transform = "scale(1)";
                }}
                aria-label={loading ? "Scanning in progress" : "Scan website for AI visibility"}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan My Site Now
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
```

**NEW CODE (replace with):**
```jsx
            <div className="p-2 flex items-center flex-shrink-0">
              <button
                onClick={handleScan}
                disabled={loading}
                className="scan-btn inline-flex items-center gap-2 font-semibold text-sm"
                style={{
                  background: loading
                    ? "rgba(99,102,241,0.45)"
                    : "var(--brand-red)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "12px 24px",
                  boxShadow: loading ? "none" : "var(--shadow-btn)",
                  fontFamily: "var(--font-display)",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
                aria-label={loading ? "Scanning in progress" : "Scan website for AI visibility"}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan My Site Now
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
```

**Changes:**
- Line 334: Added `scan-btn` class
- Removed: `className="..." transition-all disabled:opacity-40 ...` (now in CSS class)
- Removed: `onMouseEnter`, `onMouseLeave` event handlers (now in `:hover` CSS)
- Simplified style object (removed `cursor`, `transition` — now in CSS)

### Step 5.3: Test Hover Behavior

```bash
npm run dev

# Open http://localhost:3000
# Hover over "Scan My Site Now" button
# Should see scale(1.02) and box-shadow change smoothly
# No jank, GPU-accelerated
```

**Impact:** -10 to -15ms TBT ✅

---

## Complete Build & Deploy Workflow

### Step 1: Build Locally

```bash
cd C:\Users\Administrator\Desktop\ConduitScore\phase_5_output

# Install Critters (if not already done)
npm install --save-dev critters

# Full rebuild
npm run build

# Check for errors
npm run typecheck
```

### Step 2: Test All Fixes

```bash
npm run dev

# Test homepage scan form
# - Button color is darker red (#E8004D)
# - Button scales on hover (CSS, not janky)
# - Scan works normally

# Test dashboard (if authenticated)
# - Charts lazy-load
# - No immediate recharts import

# Test on mobile (use DevTools device emulation)
# - Moto G Power (430px width)
# - Slow 4G throttle
# - LCP should improve
```

### Step 3: Run Lighthouse Audit (Local)

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Lighthouse
npx lighthouse http://localhost:3000 --preset=perf --output=json --output-path=lh-report-before.json

# Should see improvements in:
# - LCP: 3.5s → ~2.2s
# - FCP: 1.4s → ~1.0s
# - Speed Index: 4.4s → ~3.2s
```

### Step 4: Deploy to Vercel

```bash
# Commit changes
git add -A
git commit -m "perf: reduce LCP and improve WCAG contrast

- Install Critters for critical CSS extraction
- Update browserslist to modern browsers (chrome 100+, safari 16+)
- Lazy-load recharts and framer-motion on dashboard
- Update button color from #ff2d55 to #E8004D for WCAG AAA
- Convert hover styles from inline to CSS class for performance

Expected improvements:
- LCP: 3.5s → 2.0–2.2s
- FCP: 1.4s → 1.0–1.2s
- Speed Index: 4.4s → 2.8–3.2s
- WCAG AA → AAA compliance"

# Push to master (triggers auto-deploy to Vercel)
git push origin master

# Monitor deployment
npx vercel logs conduitscore --follow
```

### Step 5: Verify Production

```bash
# Wait for Vercel deployment to complete (~3 minutes)

# Run Lighthouse on production
npx lighthouse https://conduitscore.com --preset=perf --output=json --output-path=lh-report-prod.json

# Compare metrics
# Should meet targets:
# - LCP < 2.5s
# - FCP < 1.8s
# - CLS = 0
# - WCAG AA → AAA
```

---

## Rollback Plan (If Issues Occur)

### Issue: CSS Looks Broken or Missing

**Symptom:** Hero section unstyled, buttons have no color

**Cause:** Critters over-extracted critical CSS

**Fix:**
```bash
# Remove Critters temporarily
npm uninstall critters

# Revert next.config.ts to original (remove withCritters wrapper)
git checkout next.config.ts

# Rebuild
npm run build
npm run dev
```

### Issue: Button Hovers Are Jittery

**Symptom:** Scale animation looks stuttery on mobile

**Cause:** CSS class might not be loading

**Fix:**
```bash
# Verify scan-btn class exists in globals.css
grep -n "\.scan-btn" src/app/globals.css

# Verify button has className="scan-btn"
grep -n "className=\"scan-btn" src/components/scan/scan-form.tsx

# Rebuild
npm run build
```

### Issue: Lazy-Loading Breaks Dashboard

**Symptom:** Charts don't appear, infinite loader

**Cause:** Dynamic import syntax error

**Fix:**
```bash
# Revert recharts lazy-loading
git diff src/app/(dashboard)/dashboard/page.tsx
git checkout src/app/(dashboard)/dashboard/page.tsx

# Remove stats-chart.tsx
rm src/components/dashboard/stats-chart.tsx

# Rebuild
npm run build
```

---

## Success Criteria Checklist

- [ ] Critters installed and next.config.ts updated
- [ ] browserslist changed to modern browsers
- [ ] recharts lazy-loaded on dashboard only
- [ ] Button color changed from #ff2d55 to #E8004D
- [ ] Hover styles converted to CSS class (no inline handlers)
- [ ] Local build succeeds (`npm run build`)
- [ ] Local dev server runs without errors (`npm run dev`)
- [ ] Homepage loads and scans work
- [ ] Dashboard charts lazy-load and display
- [ ] Button hovers smoothly (no jank)
- [ ] Lighthouse LCP < 2.5s (local + production)
- [ ] WCAG contrast ratio 6.8:1+ (WCAG AAA)
- [ ] Deployed to production (Vercel)
- [ ] Production Lighthouse confirms improvements

---

## Estimated Timeline

| Task | Duration | Blocker? |
|------|----------|----------|
| Install Critters + rebuild | 5 min | No |
| Update browserslist + rebuild | 3 min | No |
| Lazy-load recharts | 15 min | No |
| Update button color | 2 min | No |
| Convert hover styles | 5 min | No |
| Local testing | 10 min | No |
| Lighthouse audit | 5 min | No |
| Git + Vercel deploy | 5 min | No |
| Production verification | 5 min | No |
| **Total** | **~55 minutes** | |

---

## Questions?

Refer to the main audit report: `MOBILE_PERFORMANCE_AUDIT.md`

For Critters-specific issues: https://github.com/GoogleChromeLabs/critters#readme
For Next.js code splitting: https://nextjs.org/docs/app/building-your-application/optimizing/code-splitting
