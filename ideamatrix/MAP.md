# MAP.md — Mind Map of User Wants
# ConduitScore: What Does a User Actually Want from a Scan?

---

## Central Node

"I ran a scan. Now I want..."

---

## Cluster 1: DIAGNOSIS — "What is wrong with my site?"

Branch 1.1 — Overall health score (single number to anchor the conversation)
Branch 1.2 — Category breakdown (which areas are hurt most)
Branch 1.3 — Issue inventory (the specific named problems)
Branch 1.4 — Severity ranking (which problems matter most)
Branch 1.5 — Comparison context (is my score good or bad relative to others?)
Branch 1.6 — Trend direction (am I getting better or worse over time?)

**Alive nodes (highest user intent):** 1.1, 1.2, 1.3, 1.4
**Data access:** All of these are generated at scan time. Zero marginal cost to display them.
**Self-service risk:** Low. Knowing what is wrong does not fix anything.

---

## Cluster 2: EDUCATION — "Why does this matter?"

Branch 2.1 — What AI citation means for their specific industry
Branch 2.2 — How each issue type affects AI model behavior
Branch 2.3 — Explanation of the scoring methodology
Branch 2.4 — Benchmarks and percentile data ("you're in the bottom 20%")
Branch 2.5 — Case studies and before/after impact data
Branch 2.6 — Glossary and terminology (what is JSON-LD, what is structured data)

**Alive nodes (highest user intent):** 2.2, 2.4
**Data access:** 2.1-2.3 are static content. 2.4 requires population-level data (paid tier justification).
**Self-service risk:** Very low. Education motivates action; it does not enable it.

---

## Cluster 3: IMPLEMENTATION — "How do I actually fix this?"

Branch 3.1 — Fix title (the name of the remedy)
Branch 3.2 — Fix description (plain English explanation of what to change)
Branch 3.3 — Code snippet (exact lines to paste into the site)
Branch 3.4 — Platform-specific instructions (Webflow vs. WordPress vs. raw HTML)
Branch 3.5 — Prioritization guidance (fix this before that)
Branch 3.6 — Estimated effort (5 minutes vs. 2 hours)
Branch 3.7 — Developer handoff package (zip of all fixes formatted for a dev)

**Alive nodes (highest user intent):** 3.3, 3.4, 3.7 — these are the product's core differentiator
**Data access:** All generated per scan. The unique moat.
**Self-service risk:** MAXIMUM. This is the problem. Branch 3.3 is both the reason users come AND the reason they do not pay.

---

## Cluster 4: VALIDATION — "Did my fix actually work?"

Branch 4.1 — Re-scan the same URL to see score change
Branch 4.2 — Diff view of what changed between two scans
Branch 4.3 — Confirmation that a specific fix was detected
Branch 4.4 — Before/after score comparison with timestamps
Branch 4.5 — Issue close tracking (mark an issue as resolved)

**Alive nodes (highest user intent):** 4.1, 4.2, 4.4
**Data access:** Requires scan history storage. Inherently recurring-use feature.
**Self-service risk:** None. Validation requires the product to run again. This is subscription behavior.

---

## Cluster 5: MONITORING — "Alert me if things change"

Branch 5.1 — Scheduled re-scans (weekly/monthly)
Branch 5.2 — Score drop alerts (email/Slack notification)
Branch 5.3 — New issue alerts (something broke after a deploy)
Branch 5.4 — Competitor monitoring (track competitor scores)
Branch 5.5 — Historical trend graph (score over time)
Branch 5.6 — API access (pull scan data into their own dashboards)

**Alive nodes (highest user intent):** 5.1, 5.2, 5.5
**Data access:** Requires infrastructure. Inherently high-tier feature.
**Self-service risk:** None. Monitoring requires ongoing subscription. Pure retention driver.

---

## Cluster 6: REPORTING — "Show clients or stakeholders what I found"

Branch 6.1 — Shareable public URL (no login required for viewer)
Branch 6.2 — White-label report with agency branding
Branch 6.3 — PDF export
Branch 6.4 — Client-facing summary view (hides methodology, shows results)
Branch 6.5 — Embeddable widget (put a live score on a proposal)
Branch 6.6 — Branded domain reports (reports.agency.com instead of conduitscore.com)

**Alive nodes (highest user intent):** 6.1, 6.2, 6.3
**Data access:** 6.1 already exists free. 6.2 and 6.6 are agency-tier infrastructure.
**Self-service risk:** Low — but 6.1 (shareable URL) is a distribution asset; it should remain free because the viewer of a shared report is a new acquisition candidate.

---

## Free vs. Paid Cluster Assignment

| Cluster | Free Tier | Starter $29 | Pro $79 | Agency $199 |
|---------|-----------|-------------|---------|-------------|
| Diagnosis (1) | Full — all of 1.1-1.4 | + 1.6 trends | + 1.5 benchmarks | + all |
| Education (2) | 2.1-2.3 static | + 2.4 percentiles | + 2.5 case studies | + all |
| Implementation (3) | 3.1-3.2 + one 3.3 sample | + all 3.3 + 3.5-3.6 | + 3.4 platform-specific | + 3.7 dev handoff |
| Validation (4) | None (re-scan counts as new scan) | 4.1-4.3 | + 4.4-4.5 | + all |
| Monitoring (5) | None | 5.1 weekly | + 5.2-5.3 alerts + 5.5 | + 5.4 competitor + 5.6 API |
| Reporting (6) | 6.1 shareable URL | + 6.3 PDF | + 6.4 client view | + 6.2 white-label + 6.6 |

---

## Key Insight from the Map

Implementation is the only cluster where free access destroys conversion. Every other cluster either:
(a) has no self-service risk (Education, Monitoring, Reporting), or
(b) is inherently recurring (Validation, Monitoring)

The gate belongs exclusively at the boundary between "seeing the fix exists" and "having the fix to use." All other information can flow freely.

The shareable URL (6.1) should remain free because it is the product's viral distribution mechanism. Every person who views a shared report is an unacquired lead. Locking shares would be the most expensive possible mistake.

