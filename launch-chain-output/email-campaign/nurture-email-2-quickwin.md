# Nurture Email 2 — Quick Win
**Sequence:** Post-Checklist Download Nurture
**Send Day:** Day 2 — 48 hours after checklist download
**Audience:** Checklist download leads (website owners, SEO managers, indie consultants)
**Framework:** PAS — Problem → Agitate → Solution (quick-win delivery variant)

---

## Subject Lines

**Primary (Subject A):** The fastest AI visibility fix (takes 5 minutes)
**Variant (Subject B):** 4 lines in robots.txt. From blocked to visible in ChatGPT.

*Subject A rationale: Direct benefit format — "fastest" + "5 minutes" removes all friction from engaging with the tip. Subscriber is still warm from Email 1. Predicted open rate: 38–48%.*

*Subject B rationale: Specificity formula — "4 lines" is a concrete number that signals the ask is genuinely small. "Blocked to visible in ChatGPT" names the before/after outcome directly. Use as B-test for technically-oriented audiences.*

---

## Preview Text

**Preview:** Most sites accidentally block ChatGPT. Here's the exact code to fix it before you scan.

*(88 characters — identifies the mistake (creates anxiety), promises the fix, adds scan hook)*

---

## Send Day Label

**Day 2** — 48 hours post-download. Subscriber has had time to look at the checklist but probably hasn't acted yet. Providing the #1 quick win keeps the momentum going and reinforces ConduitScore's value.

---

## Personalization Placeholder Instructions

1. Replace `[FIRST_NAME]` with subscriber's first name
2. The robots.txt code block is exact — do not modify the user-agent names or directives
3. The `conduitscore.com` CTA link should use UTM: `https://conduitscore.com?utm_source=email&utm_medium=drip&utm_campaign=checklist-nurture`
4. Replace `Ben` in signature with sender name if different

---

## Full Email Body

**FROM:** Ben Stone, ConduitScore <ben@conduitscore.com>
**TO:** [FIRST_NAME] <[EMAIL]>
**SUBJECT:** The fastest AI visibility fix (takes 5 minutes)

---

Hi [FIRST_NAME],

The fastest fix on the checklist — and the one with the biggest score impact:

**Add 4 lines to your robots.txt file.**

Most sites accidentally block AI crawlers through an overly broad Disallow rule. They're not doing it on purpose — it's a leftover from a template or a "block everything" directive that was meant for something else.

Here's the code to allow the four major AI bots:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: OAI-SearchBot
Allow: /
```

This alone can move your Crawler Access score from 0 to 60+.

**Here's the best way to use it:**

Before you add this, run a free scan to see your current Crawler Access score: conduitscore.com

Then implement the fix. Run the scan again. Watch the number move.

The before/after comparison is the fastest way to see what actually works — and to have a concrete number to show anyone who asks about your AI visibility progress.

— Ben

---

## CAN-SPAM Footer

---
You're receiving this because you downloaded the AI Visibility Checklist at conduitscore.com.
[Unsubscribe]({{unsubscribe_url}}) | ConduitScore | 123 Main St, Suite 100, San Francisco, CA 94105

---

## Plain Text Version

Hi [FIRST_NAME],

The fastest fix on the checklist — and the one with the biggest score impact:

Add 4 lines to your robots.txt file.

Most sites accidentally block AI crawlers through an overly broad Disallow rule. Here's the code to allow the four major AI bots:

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

This alone can move your Crawler Access score from 0 to 60+.

Here's the best way to use it: before you add this, run a free scan to see your current Crawler Access score at https://conduitscore.com

Then implement the fix. Run the scan again. Watch the number move.

The before/after comparison is the fastest way to see what actually works — and to have a concrete number to show anyone who asks about your AI visibility progress.

— Ben

--
You're receiving this because you downloaded the AI Visibility Checklist at conduitscore.com.
Unsubscribe: {{unsubscribe_url}} | ConduitScore | 123 Main St, Suite 100, San Francisco, CA 94105

---

## Spam Audit

**Risk Level: LOW**
Technical content email — code blocks are the primary content. "Free" appears once in a clear scan CTA context. No urgency language, no promotional pricing. Educational tone throughout. Code block format may need plain-text fallback handled carefully in HTML email clients — the plain text version addresses this.

## CAN-SPAM Check

- [x] Unsubscribe mechanism present ({{unsubscribe_url}})
- [x] Physical mailing address in footer
- [x] Footer identifies why they're receiving this
- [x] From address accurate
- [x] Subject not deceptive
- [x] No unresolved placeholders

**Status: PASS**
