# Task Manifest — Email Campaign
Source: O2O task-graph.md (task-001, task-002)
Agent: email-marketing-maestro
Generated: 2026-03-28

---

## Campaign Goal

Announce ConduitScore launch and drive free trial signups (no signup required — free scan at conduitscore.com). Convert agency prospects to paid Scale plan ($149/mo). Convert checklist leads to Starter/Pro plan ($29–$49/mo).

---

## Target Audience

- **Primary:** SEO agency owners and directors (2–20 employees), managing 5–25 client retainers
- **Secondary:** SaaS product marketers and SEO managers at Series A–C companies
- **Tertiary:** Independent SEO consultants and website owners who have downloaded the AI Visibility Checklist

---

## Tone

Direct, data-led, anxiety-then-relief arc. Lead with the problem (AI can't find your site / your clients are at risk) then deliver the relief (here's the score, here's the fix, here's the ROI). No hype, no vague claims — every sentence anchored to real data (457 scans, median 29/100, 35.7% Cloudflare stat).

---

## Key Hook

> "Median AI visibility score is 29/100 — what does your site score?"

Every email in both sequences should have this data point visible within the first 3 lines or in the P.S. The score creates anxiety. The free scan resolves it.

---

## CTA

**Primary CTA:** conduitscore.com (free scan, no signup required, 15 seconds)
**Secondary CTA (cold email sequence only):** Reply to discuss adding AI visibility audits to agency service line
**Upgrade CTA (nurture sequence):** /pricing → Starter $29/mo or Scale $149/mo

---

## Delivery Method

**gmail-draft** — create Gmail drafts for manual review and send. No API credentials available for auto-send. Drafts should be organized by sequence name and email number (e.g., "Cold Email 1 of 5 — The Hook", "Nurture Email 1 of 3 — Checklist Delivery").

---

## Sequence 1: Cold Email Outreach (Agency Prospects)

**File:** asset-06-cold-email-sequence.md
**Total emails:** 5
**Send cadence:** Day 0 → Day 2 → Day 4 → Day 7 → Day 10
**Target list:** 50 SEO agency owner/director prospects (LinkedIn-identified)
**Pre-send requirement:** Run ConduitScore scan on each prospect's website and insert real score in Email 1

### Email 1 — The Hook (Day 0, Monday/Tuesday 9–11am recipient timezone)
- **Subject:** [CONTACT_NAME] — ran your site through something
- **Key:** Include prospect's actual ConduitScore score. If <50: name top 2 issues. If 50–75: acknowledge lead vs. median, name 3 gaps.
- **CTA:** conduitscore.com free scan

### Email 2 — The Value Delivery (Day 2)
- **Subject:** The 3 fixes that move AI visibility scores the most
- **Key:** robots.txt (+12 pts), llms.txt (+10 pts), Organization schema (+14 pts). Three concrete fixes with point impacts.
- **CTA:** Reply to see [THEIR_WEBSITE]'s full issue list

### Email 3 — The Case Study (Day 4)
- **Subject:** How [AGENCY_TYPE] agencies are adding $500–$2k/month with AI visibility audits
- **Key:** 6-person agency story, 8/8 client conversions, $5,000/month new retainer revenue from <4 hours/client/month
- **CTA:** "Worth exploring?" → reply

### Email 4 — The Objection Handler (Day 7)
- **Subject:** "My clients don't know about AI search yet"
- **Key:** "They will" + ChatGPT 200M WAU stat + "You can introduce the conversation" approach
- **CTA:** Ask qualifying question about client verticals (SaaS, e-commerce, content publishing)

### Email 5 — The Close (Day 10)
- **Subject:** Last note — free scan offer
- **Key:** Simple ask: scan one client's site. Scale plan $149/mo + 14-day money-back guarantee.
- **CTA:** conduitscore.com + offer 20-minute call

---

## Sequence 2: Nurture Email Flow (Checklist Download Leads)

**File:** asset-07-nurture-email-flow.md
**Total emails:** 3 (first sequence — Post-Checklist Download)
**Send cadence:** Day 0 → Day 2 → Day 5
**Trigger:** User downloads 14-Point AI Visibility Checklist

### Email 1 — Checklist Delivery (Day 0 — immediate)
- **Subject:** Your AI Visibility Checklist is here
- **Key:** Deliver checklist + offer scan as shortcut
- **CTA:** conduitscore.com free scan
- **P.S.:** Median score 29/100 stat

### Email 2 — Quick Win (Day 2)
- **Subject:** The fastest AI visibility fix (takes 5 minutes)
- **Key:** robots.txt code snippet for 4 AI bots (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot). Before/after: "move Crawler Access from 0 to 60+"
- **CTA:** Run free scan before implementing fix → compare before/after

### Email 3 — Social Proof / Benchmark (Day 5)
- **Subject:** We scanned 457 sites. Here's what we found.
- **Key:** Full data dump: median 29/100, average 35/100, <5% have llms.txt, 90+ sites share 3 traits
- **CTA:** Find out where your site stands → conduitscore.com

---

## Key Assets

- Full email copy: `C:\Users\Administrator\Desktop\saas marketing machine\conduitscore\06-assets\asset-06-cold-email-sequence.md`
- Full nurture copy: `C:\Users\Administrator\Desktop\saas marketing machine\conduitscore\06-assets\asset-07-nurture-email-flow.md`
- Benchmark data source: 457 sites scanned March 13–17 2026, median 29/100, average 35/100
- Cloudflare citation: "35.7% of world's top 1,000 sites block GPTBot" (Cloudflare, Aug 2024)

---

## Success Criteria

- task-001 COMPLETE: 5 cold email gmail drafts created with correct subject lines, personalization placeholders ([CONTACT_NAME], [THEIR_WEBSITE], [INSERT_THEIR_ACTUAL_SCORE]), and send-day labels
- task-002 COMPLETE: 3 nurture email gmail drafts created with correct subject lines, personalization placeholder ([FIRST_NAME]), and send-day triggers labeled
- All drafts reviewed and approved before any send
- No email sent without prospect's real scan score inserted in Email 1
