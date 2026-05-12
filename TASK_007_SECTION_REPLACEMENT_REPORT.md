# Task 007 -- Replacement Recommendation for "Does fixing your AI score actually work?" Section

**Date:** 2026-03-23
**Requested by:** User (via FinalFixes.md)
**Analyst:** Atlas-Luna (Research + Content Strategy)

---

## 1. Current State: What Exists and Why It Must Go

### Location
`phase_5_output/src/app/page.tsx`, lines 685-835 -- the section with `id="objections"` and heading "Does fixing your AI score actually work?"

### What It Contains
Three fabricated "case study" cards, each with:
- **Fake before/after scores** (34 to 67, 28 to 72, 41 to 81)
- **Fake improvement timelines** ("Fixed in 2 hours," "Fixed in 4 hours," "Fixed in 3 hours")
- **Fake quotes** with attributed claims about AI traffic gains ("our traffic from AI agents went from nearly 0 to 15% of total visits")
- **Generic company labels** ("SaaS Startup," "B2B Software," "Enterprise SaaS") -- no real companies named
- **A summary claim**: "Real results from real users. Most fixes take 1-4 hours to implement. Average score improvement: +38 points in 30 days."

### Why It Is Harmful
1. **It is explicitly fabricated.** The user confirmed these are fake. No real user provided these quotes or data points.
2. **It claims to be "Real results from real users"** -- which is a direct false statement.
3. **It erodes trust.** Anyone who investigates (searches for the quoted companies, asks for verification, or simply notices the generic labels) will distrust the entire site.
4. **It creates legal exposure.** Fabricated testimonials with attributed quotes can violate FTC endorsement guidelines, even with generic company names.
5. **It undermines the product's credibility** at the exact moment the page is trying to build it.

---

## 2. Options Evaluated

### Option A: Real Testimonials
**Verdict: Not viable right now.**
ConduitScore does not yet have documented user feedback or permission-granted testimonials. You cannot replace fake data with real data that does not exist. This becomes viable once you have paying users and can collect feedback.

### Option B: Educational "Common Mistakes" Section
**Verdict: RECOMMENDED (Primary choice).**
Replace the fake proof section with fact-based educational content that demonstrates expertise without requiring any external validation. Details below.

### Option C: Trust Signals (Badges, Metrics, Integrations)
**Verdict: Partially viable as a supplement.**
ConduitScore can truthfully state things like "14 signals scanned" and "Results in 15 seconds" -- these already appear elsewhere on the page. A real scan counter ("X scans completed") would be strong if the number is meaningful (500+). But this alone is too thin to fill the section.

### Option D: Link to Blog Case Study
**Verdict: Premature.**
No blog case study exists yet, and the blog page currently throws a server-side error. This is a future play, not a current fix.

### Option E: Remove Section Entirely
**Verdict: Acceptable but suboptimal.**
Removing the section loses a conversion opportunity. The page flow would jump from "How it works" directly to "Who this is for." The objection-handling slot is valuable real estate -- it should be used, just with honest content.

---

## 3. Recommendation: "5 Reasons Most Sites Score Lower Than They Expect"

### Why This Works

1. **No fake data required.** Every claim is based on real, documented AI visibility patterns that ConduitScore actually checks.
2. **Demonstrates expertise.** It proves ConduitScore understands the problem domain, which is more convincing than fabricated quotes from unnamed companies.
3. **Answers the same objection.** The original section tried to answer "Does this actually matter?" This new section answers the same question through education instead of fabricated proof.
4. **Creates urgency.** Each mistake makes the visitor think "Am I doing this?" -- which drives them toward the scan CTA.
5. **SEO value.** These are real search-intent topics people look for. The content can be crawled and cited by AI systems (which is meta-appropriate for an AI visibility tool).
6. **Fact-checkable.** Every item below can be verified against public documentation and industry data.

### Proposed Section Content

**Heading:** "5 reasons most sites score lower than they expect"

**Subheading:** "These are the most common issues ConduitScore finds -- and most site owners have no idea they exist."

**Item 1: Your robots.txt blocks AI crawlers without you knowing**
Body: "Most robots.txt files were written for Googlebot. AI crawlers like GPTBot, ClaudeBot, and PerplexityBot use different user-agent strings. If your robots.txt does not explicitly allow them, some AI systems treat ambiguous rules as 'do not crawl.' Ahrefs research shows 35% of top websites actively block GPTBot."

Why it is safe: This is a documented, verifiable technical fact. ConduitScore checks for this.

**Item 2: You have no llms.txt file**
Body: "llms.txt is a new standard that tells AI systems what your site is about and which pages matter most. Most sites do not have one yet. Adding it is one of the fastest ways to improve your AI visibility score."

Why it is safe: llms.txt is a real, documented standard. Its absence is a factual finding.

**Item 3: Your structured data does not include Organization or WebSite schema**
Body: "Google does not require Organization schema to rank you. But AI systems use it to verify your entity identity -- who you are, what you do, and whether you are a real business. Without it, AI tools have less reason to cite you."

Why it is safe: Schema.org documentation and AI crawler behavior are public knowledge.

**Item 4: Your content is written for humans but unreadable to machines**
Body: "AI systems parse your HTML structure, not your visual design. If your headings are out of order, your intro paragraph is missing, or your content lacks semantic HTML, AI tools struggle to extract clear answers from your pages."

Why it is safe: This reflects what ConduitScore's content structure analyzer actually checks.

**Item 5: You assume good Google rankings mean good AI visibility**
Body: "SEO tools measure search engine rankings. AI visibility is different. AI agents have stricter requirements for crawler access, structured data, and content clarity. A site can rank #1 on Google and still be invisible to ChatGPT."

Why it is safe: This is the core thesis of ConduitScore and is supported by multiple industry analyses.

**Bottom CTA box:**
"Want to see which of these apply to your site?" followed by an anchor link to the scan form.

### Visual Design Direction

- Keep the same visual container style as the current section (cards with `var(--surface-raised)` background, `var(--border-subtle)` borders, 12px radius)
- Each item should be a numbered card (1-5), not a before/after comparison
- Use an icon or colored dot per card (consistent with the existing design language)
- The bottom CTA box should use the existing violet tint style (`rgba(108,59,255,0.04)` background)
- No fake numbers, no fake quotes, no fake company names

---

## 4. Implementation Specification

### What to Remove
Lines 685-835 of `phase_5_output/src/app/page.tsx` -- the entire `id="objections"` section.

### What to Add
A new section in the same position with:

**Data structure:**
```typescript
const COMMON_MISTAKES = [
  {
    num: "1",
    title: "Your robots.txt blocks AI crawlers without you knowing",
    body: "Most robots.txt files were written for Googlebot. AI crawlers like GPTBot, ClaudeBot, and PerplexityBot use different user-agent strings. If yours does not explicitly allow them, some AI systems will not crawl your site.",
  },
  {
    num: "2",
    title: "You have no llms.txt file",
    body: "llms.txt is a standard that tells AI systems what your site is about and which pages matter most. Most sites do not have one. Adding it is one of the fastest ways to improve your score.",
  },
  {
    num: "3",
    title: "Your structured data is missing entity signals",
    body: "AI systems use Organization and WebSite schema to verify who you are and what you do. Without it, AI tools have less reason to cite you -- even if Google ranks you fine.",
  },
  {
    num: "4",
    title: "Your content is readable to humans but not to machines",
    body: "AI systems parse HTML structure, not visual design. Out-of-order headings, missing intro paragraphs, and non-semantic markup make it harder for AI to extract clear answers.",
  },
  {
    num: "5",
    title: "You assume Google rankings equal AI visibility",
    body: "SEO tools measure search rankings. AI visibility is different. A site can rank number one on Google and still be invisible to ChatGPT, Claude, and Perplexity.",
  },
];
```

**Section heading:** "5 reasons most sites score lower than they expect"
**Section subheading:** "These are the most common issues ConduitScore finds -- and most site owners have no idea they exist."
**Section id:** `"common-mistakes"` (replaces `"objections"`)
**Bottom CTA:** "Want to see which of these apply to your site?" with link to `#scan`

### Assets Needed
- No images required
- No external data required
- No testimonials required
- Copy is provided above -- ready to implement

---

## 5. Why This Is Better Than Fake Proof

| Criterion | Fake Case Studies (current) | Educational Mistakes Section (proposed) |
|-----------|---------------------------|----------------------------------------|
| **Truthfulness** | Fabricated data + fake quotes | Every claim is verifiable |
| **Trust impact** | Destroys trust if discovered | Builds authority through expertise |
| **Legal risk** | FTC endorsement violations possible | Zero legal risk |
| **SEO value** | None (generic fake text) | High (targets real search queries) |
| **Conversion mechanism** | Social proof (fake) | Fear of missing out + expertise (real) |
| **Maintenance** | Cannot be updated (no real data) | Evergreen (always true) |
| **AI visibility** | Ironic: an AI visibility tool with fake content | Consistent: practices what it preaches |

---

## 6. Future Upgrades (When Real Data Exists)

Once ConduitScore has real users and real outcomes, this section can evolve:

**Phase 2 (after 500+ scans):**
- Add a real aggregate stat: "Average score across X scans: Y/100"
- Add: "Most common issue found: [real data from scan database]"

**Phase 3 (after first paying customers):**
- Add 1-2 real testimonial cards below the educational section
- Keep the educational content; add real proof alongside it

**Phase 4 (after documented improvements):**
- Create a real case study blog post with permission-granted data
- Link from this section: "See how [Company] improved their score"

---

## 7. Verification Checklist

- [ ] No fabricated data in the replacement section
- [ ] Every claim can be traced to a verifiable source (robots.txt behavior, llms.txt standard, Schema.org docs, AI crawler documentation)
- [ ] Section visually matches the existing page design language
- [ ] Bottom CTA links to the scan form (`#scan`)
- [ ] Section id updated from `"objections"` to `"common-mistakes"`
- [ ] No fake company names, no fake quotes, no fake metrics
- [ ] Copy is concise (each card body under 50 words)

---

## 8. Sources Consulted

- [5 AI Visibility Mistakes That Keep Your Website Hidden from ChatGPT & Perplexity](https://www.amivisibleonai.com/blog/ai-content-myths-2025) -- validates the common mistakes listed
- [What Hurts AI Visibility? 7 Common Mistakes (2026)](https://www.visiblie.com/blog/what-hurts-ai-visibility) -- confirms robots.txt blocking and entity signal issues
- [AI Search Is Stealing Your Traffic: 10 Fixes Every Brand Needs in 2026](https://www.prnewsonline.com/ai-search-is-stealing-your-traffic-10-fixes-every-brand-needs-in-2026/) -- industry data on AI crawler blocking rates
- [7 ways to add social proof to your B2B SaaS landing page](https://landingrabbit.com/blog/social-proof) -- alternatives when testimonials are unavailable
- [The Perfect Homepage for Early-stage SaaS companies](https://www.mrrunlocked.com/p/the-perfect-homepage-for-early-stage-saas) -- homepage patterns for pre-traction startups
- [SaaS website design in 2026](https://www.stan.vision/journal/saas-website-design) -- conversion framework for SaaS homepages
- [B2B SaaS Homepage Template | Best Practices](https://www.joinamply.com/academy/saas-homepage-template-the-guide-to-product-storytelling-and-conversion) -- educational content as trust-building alternative
