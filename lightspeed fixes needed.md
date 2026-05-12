Core Metrics (Desktop)

First Contentful Paint (FCP): 0.8 s
Largest Contentful Paint (LCP): 0.8 s
Total Blocking Time (TBT): 0 ms
Cumulative Layout Shift (CLS): 0.001
Speed Index: 0.9 s

These are significantly faster than mobile (e.g., mobile FCP 3.0 s → desktop 0.8 s; LCP 3.5 s → 0.8 s), due to no slow 4G throttling, faster CPU/network simulation, and larger viewport reducing some layout/reflow costs.
Performance-Related Issues & Opportunities

Render blocking requests — Est savings of 550 ms (affects LCP/FCP; includes site CSS and Google Fonts CSS; lower savings than mobile's 1,660 ms because faster connection reduces impact)
LCP request discovery — Optimize LCP image (ConduitScore logo) discoverability; lazy load not applied, fetchpriority=high should be applied (request is discoverable in initial document)
Network dependency tree / Avoid chaining critical requests — Maximum critical path latency: 650 ms (chain involves initial navigation → site CSS → Google Fonts CSS → multiple .woff2 font files from fonts.gstatic.com)
Legacy JavaScript — Est savings of 14 KiB (polyfills/transforms for modern features like Array.prototype.at, .flat, .flatMap, Object.fromEntries, etc., unnecessary for modern browsers)
Layout shift culprits — Total CLS score 0.001; minor shifts from elements like  (likely font loading or minor reflows)
LCP breakdown — Resource load delay 350 ms + load duration 620 ms dominate; element render delay only 170 ms (better than mobile's 1,880 ms render delay)
3rd party code — Google Fonts (~116 KiB transfer size across CSS + .woff2 files); impacts load performance (same as mobile)
Reduce unused JavaScript — Est savings of 26 KiB (from main chunk ~69.6 KiB transfer size)
Avoid non-composited animations — 7 animated elements found (non-composited width/style changes on progress-like bars can cause jank/increase CLS)
Font display — Consider font-display: swap or optional to avoid invisible text or layout shifts
Improve image delivery — Optimize image download times/sizes (affects perceived load and LCP)
Reduce unused CSS — Reduce unused rules and defer non-critical CSS
Minify CSS — Minify CSS files to reduce payload
Minify JavaScript — Minify JS files to reduce payload/parse time
Duplicated JavaScript — Remove large/duplicate JS modules from bundles
Preconnected origins — Already preconnecting to fonts.googleapis.com and fonts.gstatic.com; no additional strong candidates
Optimize DOM size — 411 total elements; max depth 14; most children under body (large DOM noted, same as mobile)
Forced reflow — Occurs when JS queries layout after style invalidation (unscored, same as mobile)

Accessibility Issues (score 96)
Identical to mobile:

Contrast — Insufficient contrast on multiple elements (e.g., red button, tertiary text, example.com spans/sections)
ARIA IDs are unique — Duplicates (e.g., hero-url-input input ID repeated)
No form fields have multiple labels — Hero input field has multiple labels
Uses ARIA roles only on compatible elements —  inappropriate for article elements
Additional manual checks: keyboard focusable controls, state indication, tab order, DOM vs visual order, no focus traps, landmarks, offscreen hiding, custom control labels/roles

Best Practices (score 100)

No major failures; diagnostics remind to ensure CSP, strong HSTS, COOP, XFO/clickjacking mitigation, Trusted Types (same as mobile)

SEO (score 100)

Structured data is valid — Manual validator check recommended
No other failures

Other / Passed but Mentioned Diagnostics

Use efficient cache lifetimes — For repeat visits
Document request latency — Excellent (avoids redirects, server ~3 ms, compression applied)
Avoids enormous network payloads — Total 357 KiB (slightly higher than mobile's 328 KiB due to different emulation)
JavaScript execution time — 0.2 s (very low)
Minimizes main-thread work — 0.8 s total
Image elements have explicit width and height — Set (helps CLS)
INP breakdown — Investigate longest subpart
Optimize viewport for mobile — Proper meta viewport present (desktop irrelevant but noted)
Avoid long main-thread tasks — None flagged (unlike mobile's 1 long task)
User Timing marks and measures — Consider adding for measurement

Key Differences vs Mobile

Desktop is much faster overall (metrics ~4x better) because of no mobile throttling, faster simulated CPU/network, and larger screen reducing some reflow/animation costs.
Render-blocking savings lower (550 ms vs 1,660 ms) since faster baseline hides impact.
Critical path longer in absolute ms (650 ms vs 371 ms) but less harmful due to speed.
CLS very low (0.001) with minor culprits; mobile had 0.
No long main-thread tasks or forced reflow time quantified here.
Accessibility issues identical (contrast, ARIA, labels, roles).
Google Fonts remain the top shared bottleneck (render-blocking, chaining, 3rd-party size).

Prioritize: self-host/subset Google Fonts (or use font-display: swap + preload), add fetchpriority="high" to LCP logo, tree-shake/reduce unused JS/CSS, fix contrast/ARIA for accessibility. These would benefit both desktop and mobile, with mobile gaining more.