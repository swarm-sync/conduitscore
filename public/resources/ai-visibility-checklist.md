# The 46-Signal AI Visibility Checklist
### Every signal ChatGPT, Claude, and Perplexity use to discover your site

**Powered by ConduitScore — https://conduitscore.com**
*Run a free scan at conduitscore.com/scan to see your current score on all 46 signals.*

---

Total possible score: **100 points** across 7 categories.
Use this checklist to audit your site manually, or scan instantly at conduitscore.com.

---

## CATEGORY 1: Crawler Access (20 points)

### Signal 1 — robots.txt: AI Bot Access (12 points)

**Why it matters for AI visibility:**
GPTBot, PerplexityBot, ClaudeBot, and Google-Extended check your robots.txt before they crawl a single page. A single broad `Disallow: /` or a blanket block on all bots will prevent all three major AI systems from ever reading your content — no matter how good it is. You could have the best page on the internet and it will never be cited if the crawler is blocked at the gate.

**How to audit:**
Visit `https://yourdomain.com/robots.txt` in your browser. Look for any rules that target AI user-agents (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, anthropic-ai, cohere-ai). If you see `Disallow: /` under any of these, you are invisible to that AI system.

**Quick fix:**
Add explicit Allow rules for AI crawlers in your robots.txt:

```
# Allow all major AI crawlers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: cohere-ai
Allow: /
```

---

### Signal 2 — sitemap.xml: Content Map (8 points)

**Why it matters for AI visibility:**
AI crawlers use your sitemap.xml to discover pages efficiently. Without a sitemap, they rely on following links — and may miss entire product sections, blog archives, or documentation pages. A well-structured sitemap with `lastmod` dates also tells crawlers which content is fresh and worth re-indexing.

**How to audit:**
Visit `https://yourdomain.com/sitemap.xml`. It should return an XML file listing your important pages with `<loc>`, `<lastmod>`, and `<priority>` values. If you get a 404, you have no sitemap.

**Quick fix:**
Most CMS platforms (WordPress, Webflow, Squarespace) generate sitemaps automatically — check your SEO plugin settings. For custom sites, add a sitemap generator to your build:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/about</loc>
    <lastmod>2026-02-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## CATEGORY 2: LLMs.txt (15 points)

### Signal 3 — llms.txt: AI Intent File (15 points)

**Why it matters for AI visibility:**
The llms.txt standard (llmstxt.org) is a new file format specifically designed to tell AI agents what your site does, what's in scope for citations, and how to attribute your content. Sites with an llms.txt file get cited more accurately and more often — AI agents use it like a business card for your brand. As of 2026, fewer than 5% of websites have one, making it an instant competitive advantage.

**How to audit:**
Visit `https://yourdomain.com/llms.txt`. If you get a 404, you don't have one. If it exists, check that it includes a brand description, key pages, and usage/citation guidelines.

**Quick fix:**
Create a plain text file at `/public/llms.txt` (or your web root) with this structure:

```
# llms.txt
# https://yourdomain.com

> YourBrand is a [one-sentence description of what you do and who you serve].

## About
- Full name: YourBrand, Inc.
- Founded: 2024
- Primary topic: [your main topic/industry]
- Audience: [who your content is for]

## Key Pages
- [Homepage](/): [what this page covers]
- [Product](/product): [what this page covers]
- [Blog](/blog): [what types of articles you publish]
- [About](/about): [company background and mission]

## Content Topics
- [Topic 1]
- [Topic 2]
- [Topic 3]

## Usage Policy
- You may cite content from this site in AI-generated responses
- Attribute as: YourBrand (yourdomain.com)
- Do not reproduce full articles; quote with attribution
```

---

## CATEGORY 3: Structured Data (24 points)

### Signal 4 — JSON-LD Organization Schema (14 points)

**Why it matters for AI visibility:**
Organization schema tells AI agents your brand name, URL, description, logo, and contact details in a structured, machine-readable format. Without it, AI systems have to infer this information from your page text — and they often get it wrong (wrong brand name, outdated description, wrong URL). This is the single most impactful schema type for brand recognition by AI.

**How to audit:**
Open DevTools → Network tab → reload the page → search for `application/ld+json`. Alternatively, paste your URL into Google's Rich Results Test at `search.google.com/test/rich-results`.

**Quick fix:**
Add this to your `<head>` section (or in a `<script>` tag in the body):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourBrand",
  "url": "https://yourdomain.com",
  "description": "One clear sentence describing what you do.",
  "logo": "https://yourdomain.com/logo.png",
  "sameAs": [
    "https://twitter.com/yourbrand",
    "https://linkedin.com/company/yourbrand"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@yourdomain.com",
    "contactType": "customer support"
  }
}
</script>
```

---

### Signal 5 — FAQPage or HowTo Schema (10 points)

**Why it matters for AI visibility:**
FAQ and HowTo schema turns your content into direct-answer candidates. When ChatGPT or Perplexity generates a response, they actively look for structured answer candidates. FAQPage schema marks up question-answer pairs explicitly. HowTo schema marks up step-by-step instructions. Either one dramatically increases your chances of being the source that gets cited.

**How to audit:**
Use Google's Rich Results Test at `search.google.com/test/rich-results` — it will show you every schema type detected on the page. If you have FAQ content or how-to guides, they should appear as FAQPage or HowTo structured data.

**Quick fix:**
Add FAQPage schema to any page with question/answer content:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does YourProduct do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YourProduct [clear, direct answer in 1-2 sentences]."
      }
    },
    {
      "@type": "Question",
      "name": "How much does YourProduct cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YourProduct starts at $X/month. [pricing details]."
      }
    }
  ]
}
</script>
```

---

## CATEGORY 4: Citation Signals (9 points)

### Signal 6 — Author & Expertise Signals (9 points)

**Why it matters for AI visibility:**
ChatGPT and Perplexity strongly prefer to cite content with identifiable human authors. Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) is baked into how AI systems evaluate content quality. Pages with named authors, visible credentials, and links to author profiles or social accounts score significantly higher for citation worthiness. Anonymous content is treated as lower-trust.

**How to audit:**
Check your blog posts, guides, and key content pages. Does each article show: (1) author full name, (2) author job title or credentials, (3) author bio or link to author profile, (4) publish and update dates? All four should be visible on every page you want cited.

**Quick fix:**
Add author markup to your article pages. At minimum, add visible author bylines. For full credit, also add Person schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "jobTitle": "Senior Product Manager",
    "url": "https://yourdomain.com/team/jane-smith",
    "sameAs": "https://linkedin.com/in/janesmith"
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-03-01"
}
</script>
```

---

## CATEGORY 5: Technical Health (19 points)

### Signal 7 — Page Load Time Under 2 Seconds (8 points)

**Why it matters for AI visibility:**
AI crawlers operate on strict timeout budgets. Pages that take more than 2-3 seconds to respond are often skipped or crawled less frequently. Beyond crawling, slow pages signal poor technical maintenance — AI systems factor technical health into content quality scoring. A fast page tells the crawler your site is actively maintained and reliable.

**How to audit:**
Run your URL through Google PageSpeed Insights at `pagespeed.web.dev`. Look at the "Time to First Byte" (TTFB) — target under 800ms. Overall load time should be under 2 seconds. Check both mobile and desktop scores.

**Quick fix:**
The biggest wins are usually:
1. Enable server-side caching or use a CDN (Cloudflare is free)
2. Compress images — convert to WebP format, target under 100KB per image
3. Minimize JavaScript — defer non-critical scripts
4. Use a faster hosting provider if on shared hosting

---

### Signal 8 — HTTPS Enforced (6 points)

**Why it matters for AI visibility:**
HTTP-only sites signal an untrustworthy, unmaintained source. All major AI systems (and all major search engines) deprioritize or completely skip non-HTTPS content. If your site doesn't have SSL, AI crawlers may refuse to index it entirely. This is a hard gate — no SSL means no AI visibility.

**How to audit:**
Visit `http://yourdomain.com` (note: HTTP, not HTTPS). It should immediately redirect to `https://yourdomain.com`. Also check that there are no mixed content warnings (HTTP resources loaded on HTTPS pages) by opening DevTools → Console.

**Quick fix:**
If you're on a major hosting platform (Vercel, Netlify, Cloudflare, most web hosts), SSL certificates are free and one-click to enable. If using a custom server, install a free Let's Encrypt certificate via Certbot: `certbot --nginx -d yourdomain.com`.

---

### Signal 9 (via Technical Health) — Canonical Tags: Duplicate Content (5 points)

**Why it matters for AI visibility:**
Duplicate content confuses AI crawlers. If the same content is accessible at multiple URLs (e.g., `yourdomain.com/page` and `yourdomain.com/page?ref=email`), crawlers split their attention and scoring between versions. Canonical tags tell every crawler — AI and otherwise — which URL is the authoritative version, consolidating all signals into one.

**How to audit:**
Inspect the page source (`Ctrl+U` in browser) and search for `rel="canonical"`. Every page should have one. The canonical URL should match the preferred version of that URL (no trailing slash inconsistencies, no query parameters unless intentional).

**Quick fix:**
Add a canonical tag to every page `<head>`:
```html
<link rel="canonical" href="https://yourdomain.com/the-exact-preferred-url" />
```
For dynamic pages in Next.js: set `alternates.canonical` in your metadata object.

---

## CATEGORY 6: Content Structure (20 points)

### Signal 10 — Semantic HTML Heading Structure (8 points)

**Why it matters for AI visibility:**
AI agents parse your heading hierarchy (H1 → H2 → H3) to understand content structure before reading body text. A clear hierarchy — one H1 per page, H2 for major sections, H3 for subsections — makes your content dramatically more extractable. Pages with flat or broken heading hierarchies (multiple H1s, skipped levels, decorative use of headings) score lower for content parsability.

**How to audit:**
Open browser DevTools → Console → run this command:
```javascript
Array.from(document.querySelectorAll('h1,h2,h3,h4')).map(h => `${h.tagName}: ${h.textContent.trim().slice(0,60)}`).join('\n')
```
The output should show a logical hierarchy. There should be exactly one H1. H2s should represent major sections. H3s should be sub-points under H2s.

**Quick fix:**
Restructure your page headings to follow the outline rule: one H1 (the page title), H2 for each major section (treat them like chapter titles), H3 for sub-topics within sections. Never use a heading tag just to make text big — use CSS for that.

---

### Signal 11 — Direct Answer Patterns (7 points)

**Why it matters for AI visibility:**
Content written in the format "X is Y" or "To do X, [step]" gets cited significantly more often than content that buries the key point after context. AI agents are trained on direct Q&A patterns. When your content answers questions in the first sentence of a section (answer-first structure), it becomes a strong citation candidate. Content that takes a paragraph to reach the point often gets skipped.

**How to audit:**
Re-read the first sentence of each section on your key pages. Does it directly answer the implied question of that section's heading? Or does it start with background, context, or setup before getting to the point? Count how many sections lead with the answer vs. bury it.

**Quick fix:**
Rewrite section openings to lead with the answer: Instead of "There are many factors to consider when choosing a CRM..." write "The best CRM for small teams is [X] because [reason]." Apply the inverted pyramid structure: conclusion first, supporting details after.

---

### Signal 12 — Internal Linking: Topical Authority (5 points)

**Why it matters for AI visibility:**
Strong internal linking helps AI crawlers understand your topical authority — what subjects your site is expert in. A hub-and-spoke architecture, where a main topic page links out to detailed sub-pages and those pages link back, creates clear topical clusters. Sites with isolated "orphan" pages (no internal links pointing to them) score lower because crawlers can't confirm the page is part of a coherent knowledge base.

**How to audit:**
Pick your most important pages. Check that: (1) there are at least 2-3 pages on your site that link TO this page, (2) this page links to at least 2-3 related pages. If a page has zero internal links pointing to it, it's orphaned.

**Quick fix:**
Create a content hub structure: one "pillar" page per main topic that links to 4-8 "cluster" pages on related subtopics. Each cluster page links back to the pillar. Add contextual internal links naturally within body text — not just navigation menus.

---

## CATEGORY 7: Content Quality (13 points)

### Signal 13 — Content Depth: 1,000+ Words on Key Pages (7 points)

**Why it matters for AI visibility:**
Thin pages rarely get cited. AI agents need enough substantive content to extract a useful answer. A 200-word product page gives an AI system almost nothing to work with. Key landing pages, product pages, and any page you want cited should provide comprehensive coverage of the topic — the who, what, why, how, and common questions. Depth signals expertise.

**How to audit:**
Use a word count tool or paste key pages into a word processor. Any page you want to rank for or be cited on should have at least 800-1,200 words of substantive content (not counting navigation, footers, or boilerplate). For competitive topics, 2,000+ words is the benchmark.

**Quick fix:**
Expand thin pages by adding: (1) a detailed explanation of what the product/service does and how, (2) who it's for (customer segments), (3) a FAQ section answering the top 5 questions customers ask, (4) comparison with alternatives, (5) case study or example. Each addition should add genuine value, not filler.

---

### Signal 14 — Readability Score (6 points)

**Why it matters for AI visibility:**
Dense, jargon-heavy content is harder for AI systems to parse and extract clean answers from. AI agents assess readability using metrics similar to Flesch-Kincaid. Content written at a clear, accessible reading level (Grade 8-10) gets higher extraction quality scores. This doesn't mean dumbing down your content — it means using clear sentences, active voice, and plain language for concepts that don't require jargon.

**How to audit:**
Paste a key page's content into Hemingway App at `hemingwayapp.com`. Look at the Grade Level score — target Grade 8-10. Also note: highlighted red sentences are too complex, orange sentences are hard to read, and passive voice is flagged in green. Aim for minimal red.

**Quick fix:**
- Break long sentences (20+ words) into two shorter ones
- Replace passive voice ("The report was generated by...") with active ("The system generates...")
- Replace jargon with plain alternatives where possible (e.g., "utilize" → "use")
- Use bullet points and numbered lists for multi-part answers — they're easier to extract than dense paragraphs

---

## Summary Score Sheet

Use this to track your audit progress:

| # | Signal | Category | Points | Status |
|---|--------|----------|--------|--------|
| 1 | robots.txt AI Bot Access | Crawler Access | 12 | [ ] Pass / [ ] Fail |
| 2 | sitemap.xml Content Map | Crawler Access | 8 | [ ] Pass / [ ] Fail |
| 3 | llms.txt AI Intent File | LLMs.txt | 15 | [ ] Pass / [ ] Fail |
| 4 | JSON-LD Organization Schema | Structured Data | 14 | [ ] Pass / [ ] Fail |
| 5 | FAQPage or HowTo Schema | Structured Data | 10 | [ ] Pass / [ ] Fail |
| 6 | Author & Expertise Signals | Citation Signals | 9 | [ ] Pass / [ ] Fail |
| 7 | Page Load Time < 2s | Technical Health | 8 | [ ] Pass / [ ] Fail |
| 8 | HTTPS Enforced | Technical Health | 6 | [ ] Pass / [ ] Fail |
| 9 | Canonical Tags | Technical Health | 5 | [ ] Pass / [ ] Fail |
| 10 | Semantic HTML Heading Structure | Content Structure | 8 | [ ] Pass / [ ] Fail |
| 11 | Direct Answer Patterns | Content Structure | 7 | [ ] Pass / [ ] Fail |
| 12 | Internal Linking Topical Authority | Content Structure | 5 | [ ] Pass / [ ] Fail |
| 13 | Content Depth 1000+ Words | Content Quality | 7 | [ ] Pass / [ ] Fail |
| 14 | Readability Score | Content Quality | 6 | [ ] Pass / [ ] Fail |
| | **TOTAL** | | **100** | |

---

## Priority Order: Fix These First

If you're starting from scratch, tackle signals in this order for maximum impact:

1. **Signal 3 — llms.txt** (15 pts) — Takes 30 minutes, almost no sites have it yet
2. **Signal 1 — robots.txt AI Access** (12 pts) — 5-minute fix if you're currently blocking AI crawlers
3. **Signal 4 — Organization Schema** (14 pts) — One JSON-LD block added to your layout
4. **Signal 8 — HTTPS** (6 pts) — If not done, do this immediately. Everything else is blocked.
5. **Signal 2 — sitemap.xml** (8 pts) — Most platforms auto-generate; just verify and submit
6. **Signal 5 — FAQ/HowTo Schema** (10 pts) — Add to your most important pages
7. **Signal 10 — Heading Structure** (8 pts) — Content restructure, high ROI
8. **Signal 6 — Author Signals** (9 pts) — Add bylines and Person schema to content pages
9. **Signal 11 — Direct Answer Patterns** (7 pts) — Rewrite section openers
10. **Signal 7 — Page Load Time** (8 pts) — Technical optimization, use PageSpeed Insights
11. **Signal 13 — Content Depth** (7 pts) — Expand thin pages
12. **Signal 14 — Readability** (6 pts) — Run Hemingway App on key pages
13. **Signal 12 — Internal Linking** (5 pts) — Build content hub architecture
14. **Signal 9 — Canonical Tags** (5 pts) — Add to all pages

---

## Get Your Score Instantly

Instead of auditing manually, scan any website in seconds at:

**https://conduitscore.com/scan**

ConduitScore checks all 14 signals automatically and shows you exactly which ones you're passing, which need work, and the specific fix for each — with copy-paste code examples.

Free scan included. No account required.

---

*ConduitScore — AI Visibility Score Scanner*
*https://conduitscore.com | benstone@conduitscore.com*
*Version 1.0 — March 2026*
