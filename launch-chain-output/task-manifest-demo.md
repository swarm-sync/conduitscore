# Demo Context — ConduitScore
Source: O2O task-graph.md (task-008)
Agent: website-demo-wizard
Generated: 2026-03-28

---

website_url: https://conduitscore.com
product_name: ConduitScore
tagline: AI Visibility Score Scanner — find out if ChatGPT can see your website

---

## Key Features to Highlight

1. Free URL scan (no signup) → 0-100 score in 15 seconds
2. 7-category breakdown with specific issues per category
3. Code-level fixes with score impact and effort estimates
4. Shareable public scan report URLs
5. Project management with scheduled weekly scans

---

## Pages to Visit (from site audit)

1. Homepage (https://conduitscore.com) — scan widget, hero, how it works
2. Pricing page (https://conduitscore.com/pricing) — tier comparison
3. Live scan demo — run a scan on a real URL (e.g., example.com or a recognizable brand)
4. Scan result page — show the score, category breakdown, issues, and blurred fixes
5. What ConduitScore Checks (https://conduitscore.com/what-conduit-checks) — methodology

---

## Demo Arc

1. **Problem** — "AI systems like ChatGPT, Claude, and Perplexity ignore most websites. Not because of bad content — because of fixable technical signals they don't meet. We scanned 457 sites. Median score: 29/100."
2. **Tool** — "ConduitScore checks any URL against 14 signals across 7 categories — the exact signals AI crawlers use. Free. No signup. 15 seconds."
3. **Result** — Run live scan on a recognizable brand. Show the 0–100 score. Walk through each of the 7 categories. Hover on 2–3 specific issues. Show the 1 visible fix (free tier). Point to the blurred fixes that unlock with paid plan.
4. **CTA** — "Free scan at conduitscore.com. No account required. See where your site stands right now."

---

## Narration Tone

Confident, technical but accessible, data-led. The narrator should sound like a senior SEO practitioner who found a real gap in their toolchain and built the thing to fill it — not a SaaS marketer doing a product demo.

Avoid: hyperbole, vague claims ("revolutionizes," "game-changer"), and feature listing without context. Every feature should be shown in the context of a real outcome ("this is the fix that moves the Crawler Access score the most — one robots.txt update can add 12+ points").

---

## Most Compelling Demo Moment

Running a live scan on a well-known brand (e.g., a recognizable SaaS company or media outlet) and showing their low score. The more recognizable the brand, the more powerful the "if they score 34/100, what does your site score?" implication.

Suggested scan targets for demo (all have publicly accessible sites):
- A major SEO tool's own website (ironic angle: "even the SEO tools have AI visibility gaps")
- A well-known B2B SaaS product in the SEO/marketing category
- Any Fortune 500 site (most score below 50)

---

## Context from Site Audit

- Sitewide score: 6.6/10 — product is strong, marketing execution gaps are addressable
- Key differentiator vs. Ayzeo: self-serve (no sales call), faster, cheaper
- Real scan data: 457 sites scanned, median 29/100, average 35/100
- Fix gating: Free tier shows 1 unblurred fix. This is a demo-friendly moment — show the fix, then show blurred fixes and pricing CTA
- 7 scoring categories: Crawler Access, LLMs.txt, Structured Data, Content Quality, Content Structure, Citation Signals, Technical Health
- Score is 0–100 weighted composite across all 7 categories
- Issues are ranked by impact; fixes include score impact estimate and effort estimate

---

## Technical Context for Demo Recording

- Homepage scan widget accepts any URL (bare domains work — normalizeUrl() prepends https://)
- Anonymous scans allowed (no login required) — demo can be fully unauthenticated
- Scan takes ~15 seconds to complete
- Scan result URL is shareable (https://conduitscore.com/scan-result?id=[scan_id])
- Category breakdown shows individual scores for each of the 7 analyzers
- Free tier: 1 visible fix, rest blurred with "Upgrade to see all fixes" overlay

---

## Success Criteria (task-008)

- Demo video exists and is accessible via URL
- Duration: 2–4 minutes
- All 5 pages visited in sequence
- Live scan performed and shown in real-time (not a pre-recorded result screenshot)
- Score, category breakdown, at least 2 issues, and 1 fix shown on result page
- Pricing page shown with tier comparison
- CTA (conduitscore.com free scan) stated at end of narration
- Video quality: 1080p minimum, clear audio narration
