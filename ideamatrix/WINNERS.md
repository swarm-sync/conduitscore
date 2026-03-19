# WINNERS.md — Ranked Information Gate Configurations
# ConduitScore: Precise Tier-by-Tier Content Specification

---

## Preamble

The three configurations below are ranked by conversion probability and implementation safety. Each is a complete, implementable specification. They differ primarily in where the C-dimension (fix information) boundary is drawn and how the D-dimension gate is layered.

All three share the same foundation: A4 or A5 (full score transparency), B3 (severity labels), and D5 (scan count + information depth). The debate between the three configurations is entirely about how much fix content to show and how to frame the gap.

---

## RANK 1 — RECOMMENDED CONFIGURATION

**One-liner pitch:** Show the diagnosis in full, prove the fix format with one sample, lock the rest behind a count-down upgrade prompt.

**Matrix code:** A4 + B3 + C4 + D5 + E3

---

### Free Tier (Anonymous or logged-out, 3 scans/mo)

**Score information:**
- Overall AI Visibility Score (0-100) — always visible
- All 7 category scores — always visible
- Issue count per category (e.g., "Schema: 4 issues | Meta: 2 issues") — always visible
- Severity distribution total (e.g., "3 Critical, 8 Warning, 3 Info") — always visible

**Issue information:**
- Full list of all issue titles — visible
- Severity label (Critical / Warning / Info) on each issue — visible
- Issue descriptions — NOT shown (upgrade to see)

**Fix information:**
- One complete fix selected by the system: the first Info-severity issue in the highest-volume category — fully visible with complete, copyable code block
- All remaining fixes: title visible, one-sentence description visible, code block rendered but blurred with character count shown (e.g., "38 lines — unlock to copy")
- Copy button on locked fixes is visible but triggers upgrade modal on click

**Gate mechanics:**
- 3 scans per month on free plan (counter visible in nav: "2 of 3 scans used")
- Fix code gate is information-depth based, not login-based — anonymous users can run scans and see the sample fix
- Login is required only to save scan history and share reports

**Upgrade prompt:**
- Appears inline when user clicks a locked copy button
- Text: "14 fixes ready for [domain.com]. You've applied 1. Unlock the remaining 13."
- Secondary line: "Starting at $29/month — cancel anytime."
- No modal blocking the rest of the page

---

### Starter Tier — $29/month

**Everything in Free, plus:**
- Full issue descriptions for all issues
- Complete code blocks for all fixes — copy button active on every fix
- Platform-specific fix variants (Webflow, WordPress, Squarespace, raw HTML)
- Fix prioritization order with estimated implementation time per fix
- Scan history: previous 10 scans stored, viewable, comparable
- Re-scan diff: side-by-side before/after score comparison
- PDF export of full report
- 25 scans per month

**Fix delivery:** All code. All descriptions. Prioritized. Platform-aware.

**This tier is designed for:** Marketing managers and SEO consultants managing one or two sites who need to implement fixes themselves.

---

### Pro Tier — $79/month

**Everything in Starter, plus:**
- Score percentile benchmarking (where this site ranks vs. all ConduitScore-scanned sites)
- Historical trend graph (score over time, 12-month lookback)
- Automated weekly re-scans with email alert on score drop of 5+ points
- New issue alerts (email when a new Critical or Warning appears after a deploy)
- Client-facing report view (clean version that hides internal scoring methodology)
- Embeddable score badge (live widget for proposals or site footers)
- Developer handoff package (zip file of all fixes pre-formatted for a developer, includes README)
- 100 scans per month
- API access (read-only: pull scan results into external dashboards)

**This tier is designed for:** Freelance SEO consultants and in-house SEO leads managing 3-10 sites who need to delegate implementation and demonstrate ROI.

---

### Agency Tier — $199/month

**Everything in Pro, plus:**
- White-label reports: agency logo, colors, custom domain (reports.youragency.com)
- Client portal: clients receive login to view their own reports with agency branding, no ConduitScore mention
- Competitor monitoring: scan and track up to 10 competitor domains, receive alerts when their scores change
- Bulk scan: upload a CSV of domains, scan all simultaneously
- Multi-seat access: 5 user seats, team permissions (admin / analyst / viewer)
- Priority support with 4-hour SLA
- Unlimited scans
- Full API access (read + write: trigger scans programmatically, webhook notifications)

**This tier is designed for:** Agency owners billing clients for AI visibility audits, who need to deliver professional reports under their own brand and manage portfolios of 10+ sites.

---

## RANK 2 — CONSERVATIVE CONFIGURATION

**One-liner pitch:** Show severity without descriptions, blur all code, rely on the visual weight of locked content to drive conversions.

**Matrix code:** A5 + B3 + C3 + D5 + E2 + E3 hybrid

**Where it differs from Rank 1:** No sample fix is shown. Instead, all code blocks are blurred. The upgrade motivation is entirely visual — the user can see they are surrounded by blocked content without ever experiencing the product loop.

**Risk:** Lower conversion than Rank 1 because the user has never touched a real fix. They are asked to pay for something they have not sampled. This is the difference between a wine tasting that shows you the bottle vs. one that gives you a small pour.

**When to use:** If A/B testing reveals that Rank 1's sample fix is being shared or scraped (e.g., users rotating through free accounts to collect one fix at a time per scan), Rank 2 is the fallback that removes the exploitable element.

---

### Free Tier (Conservative)

**Score:** Full category scores + severity distribution (same as Rank 1)
**Issues:** All titles + severity labels (same as Rank 1)
**Fixes:** Fix titles visible. All code blocks blurred. Character counts shown. No sample fix.
**Upgrade prompt:** Soft blur overlay on all code blocks. Inline text: "13 code fixes ready. Unlock to copy."

---

## RANK 3 — AGGRESSIVE CONFIGURATION

**One-liner pitch:** Full diagnostic transparency, but the first click on any fix triggers login, and login reveals descriptions + blurred code only — requiring upgrade for actual code.

**Matrix code:** A5 + B5 + C4 + D5 + E3 (with two-stage auth gate)

**Where it differs:** Free users see full issue descriptions before login. Login is free and unlocks descriptions. Upgrade unlocks code. This creates a two-stage funnel: anonymous -> free account -> paid.

**Risk:** Creates an extra conversion step. Users may stop at "free account" and feel they have enough (descriptions without code). This configuration only makes sense if email capture of the "free account" step has high lifetime value in itself (email nurture sequences, retargeting).

**When to use:** If ConduitScore's email nurture or retargeting converts at >15%, the two-step gate earns more per acquired email than Rank 1's direct upgrade prompt.

---

### Free (Anonymous) Tier

**Score:** Full category scores + severity distribution
**Issues:** All titles + severity labels
**Fixes:** Nothing visible — fix section shows "Create free account to see fix recommendations"

### Free (Logged-In) Tier

**Score:** Same
**Issues:** All titles + severity + full descriptions
**Fixes:** Sample fix (one complete code block) + all others blurred

### Paid tiers: Same as Rank 1 structure

---

## Comparative Summary Table

| Element | Rank 1 (Recommended) | Rank 2 (Conservative) | Rank 3 (Aggressive) |
|---------|---------------------|----------------------|---------------------|
| Overall score | Free | Free | Free |
| Category scores | Free | Free | Free |
| Issue counts per category | Free | Free | Free |
| Severity distribution | Free | Free | Free |
| Issue titles | Free | Free | Free |
| Severity labels | Free | Free | Free |
| Issue descriptions | Starter | Starter | Free (logged in) |
| Sample fix (one complete code) | Free | NOT FREE | Free (logged in) |
| All fix code | Starter | Starter | Starter |
| Blurred code blocks visible | Yes | Yes | Yes (logged in) |
| Scan history / diff | Starter | Starter | Starter |
| PDF export | Starter | Starter | Starter |
| Benchmarks | Pro | Pro | Pro |
| Monitoring / alerts | Pro | Pro | Pro |
| Client reports | Pro | Pro | Pro |
| White-label | Agency | Agency | Agency |
| Competitor monitoring | Agency | Agency | Agency |

---

## Implementation Priority

**Immediate (before any A/B test):**
1. Remove full fix code from anonymous/free tier (from C5 to C4)
2. Add blur treatment to all locked code blocks (visual proof they exist)
3. Add count-down inline prompt on locked copy button clicks
4. Add issue count per category to score display (A4 — this is currently missing and adds density to the diagnostic view)

**After first 30 days of data:**
1. A/B test Rank 1 vs. Rank 2 (sample fix present vs. absent)
2. Measure: conversion rate, time-to-upgrade, support ticket volume about "what does a fix look like"

**At $20k MRR:**
1. Build two-stage auth gate (Rank 3 mechanics) as a secondary test if email list conversion is performing

---

## The Non-Negotiable Rule

The shareable public report URL must remain free and must show the SAME content the scan owner sees at their tier. A Starter user's shared report should show their full fixes to the viewer. The viewer landing on that shared report is a top-of-funnel acquisition — they should see the product's full value in context and have a clear path to run their own scan. Blocking the shared report or degrading it is the single fastest way to eliminate organic word-of-mouth distribution.

