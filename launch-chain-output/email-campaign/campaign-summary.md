# ConduitScore Email Campaign Summary
**Generated:** 2026-03-28
**Delivery Method:** Gmail Draft (manual send — no auto-dispatch credentials)
**Campaign Status:** AWAITING HUMAN APPROVAL

---

## Campaign Overview

Two parallel sequences targeting different segments of the ConduitScore acquisition funnel.

| Sequence | Segment | Emails | Cadence | Primary CTA |
|----------|---------|--------|---------|-------------|
| Cold Outreach | SEO agency owners/directors (50 prospects) | 5 | Day 0, 2, 4, 7, 10 | conduitscore.com free scan + reply to discuss |
| Checklist Nurture | Checklist download leads | 3 | Day 0, 2, 5 | conduitscore.com free scan → /pricing upgrade |

---

## Sequence 1: Cold Email — Agency Outreach

### Send Cadence

| Email | File | Send Day | Subject (Primary) | Subject (Variant B) |
|-------|------|----------|-------------------|---------------------|
| 1 — The Hook | cold-email-1-hook.md | Day 0 (Mon/Tue) | [CONTACT_NAME] — ran your site through something | Your AI visibility score: [INSERT_THEIR_ACTUAL_SCORE]/100 |
| 2 — Value Delivery | cold-email-2-value.md | Day 2 (Wed) | The 3 fixes that move AI visibility scores the most | robots.txt + llms.txt + schema = +36 points |
| 3 — Case Study | cold-email-3-case-study.md | Day 4 (Fri) | How [AGENCY_TYPE] agencies are adding $500–$2k/month with AI audits | 8 out of 8 existing clients said yes. Here's how. |
| 4 — Objection Handler | cold-email-4-objection.md | Day 7 (Tue) | "My clients don't know about AI search yet" | ChatGPT hit 200M weekly users. Your clients will ask soon. |
| 5 — The Close | cold-email-5-close.md | Day 10 (Thu/Fri) | Last note — free scan offer | One client site. 15 seconds. That's all I'm asking. |

### Cold Email A/B Test Recommendations

**Email 1:** Test Subject A (name + intrigue) vs. Subject B (score in subject).
- Subject B is highest-leverage for low scores (under 40) — anxiety-inducing
- Subject A is safer for mid-range scores (50–75) — less aggressive opener

**Email 3:** Test [AGENCY_TYPE] personalization in Subject A vs. the curiosity-gap Subject B.
- Segment by agency type to personalize properly (SEO, digital marketing, content)

**Email 5:** Subject A ("Last note") consistently outperforms alternatives in breakup emails — recommend running Subject A only unless sequence performance is below 15% open rate overall.

### Cold Email Personalization Checklist (per prospect)

Before sending Email 1, verify for each of 50 prospects:
- [ ] Run ConduitScore scan on their agency website
- [ ] Record actual score in [INSERT_THEIR_ACTUAL_SCORE]
- [ ] If score < 50: identify top 2 issues from scan report
- [ ] Verify [CONTACT_NAME] (LinkedIn first name)
- [ ] Verify [THEIR_WEBSITE] (agency domain)
- [ ] Verify [AGENCY_NAME] (agency company name)
- [ ] Infer [AGENCY_TYPE] from their LinkedIn/website (SEO, digital marketing, etc.)

**Critical rule: Email 1 must NEVER be sent without a real scan score. The score is the entire hook.**

---

## Sequence 2: Checklist Nurture

### Send Cadence

| Email | File | Send Day | Subject (Primary) | Subject (Variant B) |
|-------|------|----------|-------------------|---------------------|
| 1 — Delivery | nurture-email-1-delivery.md | Day 0 (immediate) | Your AI Visibility Checklist is here | [FIRST_NAME], your checklist + one shortcut that saves 2 hours |
| 2 — Quick Win | nurture-email-2-quickwin.md | Day 2 | The fastest AI visibility fix (takes 5 minutes) | 4 lines in robots.txt. From blocked to visible in ChatGPT. |
| 3 — Benchmark | nurture-email-3-benchmark.md | Day 5 | We scanned 457 sites. Here's what we found. | Median AI visibility score: 29/100. Where does your site land? |

### Nurture Email A/B Test Recommendations

**Email 1:** Test Subject A (clean delivery) vs. Subject B (personalized + shortcut hint).
- Subject A is standard best practice for delivery emails — likely wins on open rate
- Subject B adds intrigue but risks feeling "bait and switch" to a subscriber who just wants their download

**Email 2:** Test Subject A ("fastest fix") vs. Subject B ("4 lines in robots.txt").
- Subject B will perform better with technical audiences (developers, SEO specialists)
- Subject A will perform better with non-technical audiences (marketing managers, business owners)
- Segment if list allows; otherwise use Subject A as default

**Email 3:** Test Subject A (data promise) vs. Subject B (direct benchmark challenge).
- Subject B performs better for subscribers who have not scanned yet (drives urgency)
- If tracking scan behavior: send Subject B to non-scanners, Subject A to scanners

### Nurture Personalization Checklist

For each subscriber:
- [ ] Verify [FIRST_NAME] from form submission
- [ ] Ensure checklist download link is live and resolves correctly
- [ ] Set UTM parameters on all conduitscore.com links

---

## CAN-SPAM Compliance Footer

All emails include this footer (customize physical address as needed):

```
You're receiving this because [reason — varies by email].
[Unsubscribe]({{unsubscribe_url}}) | ConduitScore | 123 Main St, Suite 100, San Francisco, CA 94105
```

**Important:** Replace the physical address placeholder with ConduitScore's actual registered business address before sending. If you do not have a registered street address, a P.O. Box is legally acceptable under CAN-SPAM.

**{{unsubscribe_url}}** must be replaced with your actual unsubscribe link. If using a manual send via Gmail, include a plain-text instruction: "Reply UNSUBSCRIBE to be removed from this list" and honor all unsubscribe requests within 10 business days (CAN-SPAM requirement).

---

## Spam Risk Summary

| Email | Risk Level | Notes |
|-------|-----------|-------|
| Cold 1 — Hook | LOW | Personal tone, no promotional pressure |
| Cold 2 — Value | LOW | Educational content, no pricing |
| Cold 3 — Case Study | LOW | Story-driven, soft CTA |
| Cold 4 — Objection | LOW | Conversational, question-based close |
| Cold 5 — Close | LOW | "Free" once, "money-back" once — both contextually legitimate |
| Nurture 1 — Delivery | LOW | Transactional delivery email — highest deliverability category |
| Nurture 2 — Quick Win | LOW | Technical content, code block — no promotional language |
| Nurture 3 — Benchmark | LOW | Data-driven, educational, no pricing |

All 8 emails rated LOW spam risk. No rewrites required before sending.

---

## Gmail Draft Organization

When creating Gmail drafts, label them as follows for easy identification:

**Cold Email Drafts:**
- Cold Email 1 of 5 — The Hook (Day 0)
- Cold Email 2 of 5 — Value Delivery (Day 2)
- Cold Email 3 of 5 — Case Study (Day 4)
- Cold Email 4 of 5 — Objection Handler (Day 7)
- Cold Email 5 of 5 — The Close (Day 10)

**Nurture Email Drafts:**
- Nurture Email 1 of 3 — Checklist Delivery (Day 0)
- Nurture Email 2 of 3 — Quick Win (Day 2)
- Nurture Email 3 of 3 — Benchmark Data (Day 5)

---

## Key Data Points (do not alter)

All emails reference verified benchmark data from ConduitScore's March 2026 scan dataset:

| Stat | Value | Source |
|------|-------|--------|
| Sites scanned | 457 | ConduitScore internal data, March 13–17, 2026 |
| Median score | 29/100 | ConduitScore internal data |
| Average score | 35/100 | ConduitScore internal data |
| Sites with llms.txt | <5% | ConduitScore internal data |
| Sites blocking GPTBot | 35.7% of top 1,000 | Cloudflare, August 2024 |
| ChatGPT WAU | 200M | OpenAI public announcement |
| Perplexity monthly queries | 100M+ | Perplexity public data |
| Google AI Overviews | 25% of US searches | Google public data |

---

## Success Criteria

**Cold Sequence:**
- task-001 COMPLETE when: 5 Gmail drafts created, correct subject lines, all personalization placeholders present, send-day labels noted
- Pre-send gate: Real scan score inserted for each of 50 prospects in Email 1

**Nurture Sequence:**
- task-002 COMPLETE when: 3 Gmail drafts created, correct subject lines, [FIRST_NAME] placeholder present, Day 0 trigger labeled as immediate

**Both sequences:**
- All drafts reviewed and approved by human before any send
- CAN-SPAM footer physical address filled in
- {{unsubscribe_url}} resolved to actual unsubscribe mechanism

---

## Delivery Notes

**Delivery method: Gmail Draft (manual send)**

Gmail MCP will create DRAFTS ONLY. No email is auto-sent. You must:
1. Open Gmail
2. Find each draft in your Drafts folder
3. Verify personalization tokens are filled in for each recipient
4. Click Send manually

For the cold email sequence (50 prospects × 5 emails = up to 250 sends total), consider batching sends to stay within Gmail's daily send limits. Gmail free accounts: 500/day. Google Workspace: 2,000/day.
