# Hero Section QA Checklist — task-005
**Scope:** ScanForm above fold, CTA zone isolation, animation on load, accessibility, copy integrity
**Viewport references:** Desktop = 1280 × 800 | Mobile = 375 × 812 (iPhone SE)
**Source files audited:**
- `phase_5_output/src/app/page.tsx`
- `phase_5_output/src/components/scan/scan-form.tsx`
- `phase_5_output/src/components/home/example-score-card.tsx`
- `phase_5_output/src/components/layout/header.tsx`
- `phase_5_output/src/app/globals.css`

---

## Check 1 — ScanForm above fold on desktop (1280 × 800)

| Field | Detail |
|---|---|
| **How to verify** | Open DevTools (F12) → Device toolbar → set 1280 × 800. Reload cold (no scroll). Measure the bottom edge of the `<ScanForm variant="hero">` wrapper (the pill-shaped input + button composite). Bottom edge must sit above y=800. The sticky header is `h-[104px]` (104 px). Hero padding is `padding-top: 0px; padding-bottom: 80px` (desktop). The ScanForm wrapper has `marginTop: 32px; maxWidth: 520px` inside `.hero-two-col` (55/45 grid). Confirm no vertical scroll is needed to reach the scan button. |
| **Pass condition** | The bottom edge of the scan button (including its 24 px vertical padding → ~52 px tall) is fully visible at y < 800 without scrolling. Header (104 px) + h1 (clamp, ~88 px at 1280 wide) + subheadline (~68 px) + marginTop 32 px + input height (~52 px) = ~344 px. This must measure < 800 px. |
| **Fix if fail** | Reduce hero `padding-bottom` from 80 px to 40 px, or reduce the h1 `clamp` floor from 2.8 rem toward 2.2 rem, or reduce `marginTop` on the ScanForm wrapper from 32 px to 20 px. Re-measure until button bottom edge is comfortably above 760 px to leave breathing room. |

---

## Check 2 — ScanForm above fold on mobile (375 × 812)

| Field | Detail |
|---|---|
| **How to verify** | DevTools → 375 × 812 (iPhone SE). Reload cold. On mobile, `.hero-two-col` collapses to `grid-template-columns: 1fr; gap: 0` (globals.css line 529–534). The score card column moves below with `margin-top: 40px`. Confirm the ScanForm (left column — it renders first in DOM order) is fully visible. Measure: header 104 px + h1 (~clamp 2.8 rem at 375 = ~44.8 px) + subheadline + marginTop 32 px + input. Also confirm the trust line ("No signup required. Results in about 15 seconds.") at marginTop 12 px is not pushed off screen by the subheadline length. |
| **Pass condition** | The scan button bottom edge is visible at y < 812 without scrolling. The SampleChipRow (rendered inside ScanForm below the button) may extend below the fold — that is acceptable. Only the input + button composite must be above fold. |
| **Fix if fail** | Add a `@media (max-width: 767px)` rule that reduces the hero h1 font size further (e.g. to clamp(1.9rem, 10vw, 2.8rem)) and reduces the subheadline marginTop from `mt-4` (16 px) to `mt-2` (8 px). Reduce ScanForm marginTop on mobile from 32 px to 16 px using a media query or inline-style override in the hero column. |

---

## Check 3 — No competing CTA within 200 px above or below the scan button

| Field | Detail |
|---|---|
| **How to verify** | With the page at 1280 × 800, use DevTools element picker to locate the scan button (the `<button>` inside ScanForm with text "Run your free AI visibility scan"). Note its vertical bounding box: `button.getBoundingClientRect().top` and `.bottom`. Then scan all interactive elements (links, buttons) in the range `[button.top - 200, button.bottom + 200]`. Check for: (a) nav links in the header — header is sticky at top: 0, height 104 px. If the scan button starts below y=336 (104 header + 232 margin clearance), the nav links are outside the 200 px zone. (b) The SampleChipRow chips — these are `<button>` elements rendered directly below the CTA. They must be visually subordinate (covered separately in Check 8). (c) Any anchor/link in the hero body text. The subheadline `<p>` is plain text — no links. The trust line is a `<p>` — no links. |
| **Pass condition** | No button or anchor tag with a primary-action visual weight (same size, same background color, or same prominence as the red scan CTA) exists in the 200 px zone above or below the scan button. The SampleChipRow chips are small ghost pills — they qualify as subordinate (see Check 8) and do not count as competing CTAs. |
| **Fix if fail** | If any nav link from the sticky header falls within 200 px of the scan button, increase the hero section top padding or decrease the header height. If the chip row is styled with a filled red/purple background at the same weight as the scan button, restyle chips to use border-only or text-only treatment. |

---

## Check 4 — Score count-up animation plays on page load (not on scroll)

| Field | Detail |
|---|---|
| **How to verify** | In `example-score-card.tsx` lines 139–144: `useEffect(() => { if (animateOnMount) startAnimation(); }, [animateOnMount, startAnimation])`. The component is rendered in `page.tsx` with `animateOnMount={true}`. Open the page, disable all scroll, and watch the score ring and dominant number immediately begin counting up from 0 to 42. Confirm in DevTools Performance tab: the `requestAnimationFrame` loop firing within the first 200 ms of page paint. Alternatively, confirm in React DevTools that `displayScore` transitions from 0 to 42 within ~1100 ms of mount. |
| **Pass condition** | The displayed score number starts at 0 and reaches 42 within 1000–1100 ms of page load, with no user scroll required. The SVG ring `strokeDashoffset` interpolates from `circumference` (full gap) to the target offset corresponding to 42/100. |
| **Fix if fail** | If the animation is gated by scroll, check whether `animateOnMount` is being passed as `false` or `undefined`. Also check if a parent layout wrapper is conditionally importing the component inside a `<Suspense>` that delays mount. If the rAF is not firing, check whether `performance.now()` is available (should be in all modern browsers). |

---

## Check 5 — Category bars animate on load with 40 ms stagger

| Field | Detail |
|---|---|
| **How to verify** | In `example-score-card.tsx` lines 506–509: each bar's `animation` property is set to `cs-bar-fill 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both` when `barsVisible === true`. `barsVisible` is set to `true` via `setTimeout(..., 150)` after the count-up completes (line 131). Verify with DevTools Animations panel: seven bar animations should fire sequentially 40 ms apart (bar 0 at ~1150 ms after load, bar 6 at ~1390 ms). The CSS keyframe `cs-bar-fill` runs `from { transform: scaleX(0) } to { transform: scaleX(var(--cs-bar-target)) }` — each bar must expand from left. |
| **Pass condition** | All 7 bars are invisible (scaleX 0) until ~1150 ms after page load, then fill left-to-right with a visible 40 ms offset between each bar. Bar 0 (Crawler Access) fills first; bar 6 (Content Quality) fills last. |
| **Fix if fail** | If bars all animate simultaneously, confirm the `i * 40` stagger is being applied as `animation-delay` in the inline style, not overridden by a CSS rule. If bars do not animate at all, confirm `barsVisible` state change is triggering a re-render (check React DevTools state). If the `cs-bar-fill` keyframe is missing, confirm the `<style>` tag from `KEYFRAMES_CSS` is rendering in the DOM. |

---

## Check 6 — prefers-reduced-motion: all animations skip to final state

| Field | Detail |
|---|---|
| **How to verify** | In `example-score-card.tsx` lines 103–111: the `startAnimation` callback checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. If true, it calls `setDisplayScore(EXAMPLE_SCORE)` and `setBarsVisible(true)` immediately, bypassing rAF entirely. Additionally, `globals.css` lines 579–585 apply `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` to all elements under `@media (prefers-reduced-motion: reduce)`. To test: DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce". Reload. The score should immediately show 42, all bars should be at full width, and no transitions should play. |
| **Pass condition** | With reduced motion enabled: (a) `displayScore` is 42 on first paint, never 0. (b) All 7 category bars render at their final `scaleX` values immediately. (c) No CSS transitions or keyframe animations are perceptible — they complete in ≤ 0.01 ms per the global rule. |
| **Fix if fail** | If the JS animation still plays: confirm the `matchMedia` check runs before `requestAnimationFrame` is called. If bars still animate: confirm `barsVisible` is `true` before the first paint cycle. For the CSS rule: if `animation-duration: 0.01ms` does not suppress the bar fill, add `animation: none !important` specifically for `@keyframes cs-bar-fill` inside the reduced-motion block. |

---

## Check 7 — Trust line "No signup required. Results in about 15 seconds." is visible and not truncated

| Field | Detail |
|---|---|
| **How to verify** | In `page.tsx` lines 237–246, the trust line is a `<p>` rendered immediately after the ScanForm wrapper with `marginTop: 12px; fontSize: 0.8125rem; color: var(--text-tertiary)`. The exact rendered text is **"No signup required. Results in about 15 seconds."** Note: the task spec calls for "Free • No signup • Results in ~15 seconds" but the current source reads "No signup required. Results in about 15 seconds." — this discrepancy must be flagged (see Fix if fail). Verify at 375 px width that the text wraps naturally and no `overflow: hidden` or `white-space: nowrap` truncates it. Also confirm color contrast: `var(--text-tertiary)` = `#8a8a96` on the page background `#080809`. Contrast ratio = approximately 4.6:1, which passes WCAG AA for normal text at this font size (13 px). |
| **Pass condition** | The full string is rendered in the DOM (inspect with DevTools), wraps naturally at mobile widths, is not clipped, and has no `text-overflow: ellipsis`. The text color achieves at least 4.5:1 contrast on the dark background. **Additionally**: if task spec requires the specific text "Free • No signup • Results in ~15 seconds", verify the content matches exactly. |
| **Fix if fail** | Content mismatch: update the `<p>` in `page.tsx` line 245 to read "Free · No signup · Results in ~15 seconds" to match the spec. Truncation: remove any `maxWidth` or `overflow` from the container. Contrast failure: lighten `--text-tertiary` from `#8a8a96` to at least `#9a9aa8` if additional contrast margin is needed. |

---

## Check 8 — Chip row is visually subordinate to the main CTA

| Field | Detail |
|---|---|
| **How to verify** | The scan CTA button (inside `scan-form.tsx` lines 313–369) renders with: `background: var(--brand-red)` (#ff2d55), `padding: 12px 24px`, `font-weight: semibold (600)`, `fontSize: 0.875rem (text-sm)`, `borderRadius: 999px`, `boxShadow: var(--shadow-btn)`. The SampleChipRow chips render below the main button. Inspect the `sample-chip-row.tsx` chip styles: they must use a clearly smaller font size, reduced opacity or ghost/border treatment, and no filled background color of equal weight to the CTA. Measure: chip font size ≤ 0.75 rem (12 px) vs CTA 0.875 rem (14 px). Chip must not use `var(--brand-red)` as a fill. Chip text weight must be ≤ 500 vs CTA 600. |
| **Pass condition** | At a glance, the scan CTA button is the single dominant interactive element. Chips are clearly smaller, lighter, and lower-contrast than the CTA. A naive user's eye lands on the CTA first, chips second. Confirm via visual inspection and by overlaying the elements in DevTools computed styles. |
| **Fix if fail** | If chips are styled with filled backgrounds matching the CTA color, switch them to `background: transparent; border: 1px solid rgba(255,255,255,0.12); color: var(--text-tertiary)`. Reduce chip font size to `0.75rem` if currently larger. Remove any `font-weight: 600` or higher from chip labels. Add `opacity: 0.7` if further de-emphasis is needed. |

---

## Check 9 — Demo card footer line is present

| Field | Detail |
|---|---|
| **How to verify** | In `example-score-card.tsx` lines 649–661, the footer `<p>` renders: **"See the full issue breakdown and the highest-impact fixes first."** Inspect the live DOM: right-click the card → Inspect. The `<p>` is the final child of the outer card `<div>` and has `borderTop: 1px solid rgba(255,255,255,0.06); paddingTop: 12px; textAlign: center`. Confirm the text string exactly matches. Also confirm it is not hidden by `display: none`, `visibility: hidden`, or clipped by `overflow: hidden` on the card. |
| **Pass condition** | The exact string "See the full issue breakdown and the highest-impact fixes first." appears in the rendered DOM, is visible within the card boundary (not clipped), and is painted with color `rgba(255,255,255,0.45)` which achieves approximately 3.2:1 contrast on the card background `rgba(12,12,15,0.92)`. This meets WCAG AA for large text or text serving a decorative/supplementary purpose; if treated as informational body text, the color should be raised to at least `rgba(255,255,255,0.60)` for 4.5:1 compliance. |
| **Fix if fail** | If the text is missing: confirm the `ExampleScoreCard` component is not conditionally returning early before reaching the footer `<p>`. If truncated: remove or increase the card's `overflow: hidden` constraint. If color contrast is flagged: change `rgba(255,255,255,0.45)` to `rgba(255,255,255,0.62)` to reliably clear 4.5:1 on the card background. |

---

## Summary Table

| # | Check | Source reference | Priority |
|---|---|---|---|
| 1 | ScanForm above fold — desktop 1280×800 | `page.tsx` hero section layout, `globals.css` hero-inner | P0 — blocks conversion |
| 2 | ScanForm above fold — mobile 375×812 | `globals.css` hero-two-col mobile breakpoint | P0 — blocks conversion |
| 3 | No competing CTA within 200 px of scan button | `scan-form.tsx` button, `header.tsx` nav, `sample-chip-row.tsx` | P1 — CTA dilution |
| 4 | Score count-up animates on load (not scroll) | `example-score-card.tsx` animateOnMount, rAF loop | P1 — engagement |
| 5 | Category bars animate on load with 40 ms stagger | `example-score-card.tsx` barsVisible, cs-bar-fill keyframe | P1 — engagement |
| 6 | prefers-reduced-motion skips to final state | `example-score-card.tsx` matchMedia check, `globals.css` PRM block | P0 — accessibility |
| 7 | Trust line visible and not truncated (copy match) | `page.tsx` trust `<p>` | P1 — copy integrity |
| 8 | Chip row visually subordinate to CTA | `sample-chip-row.tsx` styles vs `scan-form.tsx` CTA styles | P2 — hierarchy |
| 9 | Demo card footer line present | `example-score-card.tsx` footer `<p>` | P2 — copy integrity |

---

## Known discrepancy flagged for upstream review

The task spec (task-001 upstream context) specified the trust line copy as:
> "Free • No signup • Results in ~15 seconds"

The current implementation in `page.tsx` line 245 reads:
> "No signup required. Results in about 15 seconds."

The word "Free" is absent and the bullet-separated format differs. This should be resolved before QA sign-off: either update the source to match the spec, or formally update the spec to reflect the implemented copy. This is not a rendering defect — it is a content spec mismatch.
