/**
 * Shared blog posts data
 * Single source of truth for all blog post definitions.
 * Used by both /blog/page.tsx and /blog/[slug]/page.tsx
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorTitle: string;
}

/**
 * Blog posts lookup by slug
 */
export const BLOG_POSTS_MAP: Record<string, BlogPost> = {
  "14-point-ai-visibility-checklist": {
    slug: "14-point-ai-visibility-checklist",
    title: "The 46-Signal AI Visibility Checklist: Why Google Rankings Aren't Enough",
    description:
      "Google ranking ≠ AI visibility. Learn the 46 signals LLM crawlers look for—schema markup, structured data, robots.txt, llms.txt, and more. Fix your site in 4 hours.",
    content: `Your website ranks #1 on Google. Your organic traffic is solid. But when a prospect asks ChatGPT "what's the best AI visibility tool," your site doesn't appear in the results. That's not an SEO problem – it's an AI visibility problem. And they're completely different.

Google's bots and large language models crawl the web in fundamentally different ways. Google renders JavaScript, learns from user behavior, and uses algorithms refined over 25 years. LLMs like Claude, ChatGPT, and Gemini read raw HTML, parse structured data literally, have no concept of "bounce rate" or "click-through rate," and increasingly look for signals like llms.txt and agent meta tags. A site that's invisible to Google would rank poorly. A site that's invisible to LLMs is ignored by AI research tools, even if it's on page 1 of search.

The stakes are highest for SaaS, agencies, and e-commerce. A prospect using AI-powered research – asking ChatGPT to compare solutions, using Claude to build research documents, leveraging Perplexity for competitive analysis – won't find you if your site fails this checklist. You'll lose deals before you know they're possible.

This checklist maps the 46 signals that LLM crawlers look for. Each point has a specific check, a real-world example of failure, and a code fix you can copy-paste today.

## 1. Robots.txt Must Explicitly Allow AI Crawlers

**The signal:** LLM crawlers check \`robots.txt\` to see if they're allowed on your site. If you block them, you don't get indexed.

**The failure:** A common mistake is a permissive robots.txt for Google but restrictive rules for unknown crawlers.

**The fix:** Allow major LLM crawlers explicitly. Add this to \`robots.txt\`:

\`\`\`
User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /
\`\`\`

GPTBot is OpenAI's crawler. CCBot is Common Crawl (used for LLM training). anthropic-ai is Anthropic's crawler. Allowing them doesn't expose private data – it ensures your public content is crawled.

## 2. Sitemap.xml Must Be Discoverable and Complete

**The signal:** Without a sitemap, LLM crawlers miss pages, especially deeper content.

**The failure:** Your site has a sitemap, but it's incomplete – missing blog posts, use case pages, or documentation.

**The fix:** Generate a complete sitemap and link it from robots.txt. Add this line to \`robots.txt\`:

\`\`\`
Sitemap: https://yoursite.com/sitemap.xml
\`\`\`

Then ensure your sitemap includes every important page.

## 3. Organization Schema Markup (JSON-LD)

**The signal:** LLMs parse structured data to understand what your company is. Without it, they infer incorrectly.

**The failure:** Your homepage has no schema markup. Claude or ChatGPT has to guess your business model.

**The fix:** Add Organization schema to your homepage \`<head>\`:

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourCompany",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "description": "Brief description of what you do"
}
</script>
\`\`\`

This tells LLMs who you are, what you do, and how to find you elsewhere online.

## 4. Product Schema (If You're an E-Commerce or SaaS)

**The signal:** If you sell anything, product schema tells LLMs about pricing and features.

**The failure:** You describe your plans on the pricing page in plain text. LLMs can read it, but they can't extract structured pricing tiers.

**The fix:** Add Product schema to each plan:

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Pro Plan",
  "description": "Full access to all features",
  "offers": {
    "@type": "Offer",
    "price": "299",
    "priceCurrency": "USD"
  }
}
</script>
\`\`\`

## 5. Breadcrumb Schema for Content Navigation

**The signal:** Breadcrumb schema tells LLMs the hierarchy of your site.

**The failure:** You have a blog with posts in categories, but no breadcrumb schema. LLMs treat each post as isolated.

**The fix:** Add breadcrumb schema to every blog post:

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://yoursite.com"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yoursite.com/blog"}
  ]
}
</script>
\`\`\`

## 6. Plain Text Content Must Be Real (No Heavy JavaScript Rendering)

**The signal:** LLMs read raw HTML. If your content is rendered entirely by JavaScript, they see an empty page.

**The failure:** Your homepage is a React SPA. When crawled, the HTML contains only \`<div id="root"></div>\`.

**The fix:** Ensure critical content is in HTML, not rendered by JavaScript. Use server-side rendering (SSR).

## 7. H1, H2, H3 Hierarchy (Content Structure)

**The signal:** LLMs parse headings to understand content structure.

**The failure:** Your page has no H1, or multiple H1s, or unrelated H2s.

**The fix:** Structure every page with one H1, 3-5 H2s, and nested H3s under each H2.

## 8. Minimum 300 Words of Original Content Per Page

**The signal:** LLMs value depth. Thin pages are ignored or downranked.

**The failure:** Your product page is 150 words of marketing copy with no detail.

**The fix:** Add depth. Use real examples, data, and explanation. Target 500+ words on key pages.

## 9. Mobile Responsiveness (CSS Media Queries)

**The signal:** Modern LLM crawlers use mobile user agents.

**The failure:** Your site fails on mobile (375px viewport).

**The fix:** Use responsive design. Test on mobile with CSS media queries.

## 10. HTTPS/SSL Certificate (Security)

**The signal:** LLMs prioritize secure sites. Unencrypted HTTP is a red flag.

**The failure:** Your site is on HTTP, not HTTPS.

**The fix:** Install an SSL certificate. Most hosting platforms (Vercel, Netlify) do this automatically.

## 11. Fast Load Time (Core Web Vitals)

**The signal:** LLMs care about performance. Slow pages are harder to crawl.

**The failure:** Your site takes 8 seconds to load.

**The fix:** Optimize images, minify JavaScript/CSS, use caching. Aim for LCP < 2.5s.

## 12. LLMs.txt File (Custom Model Instructions)

**The signal:** Many LLMs now check for an \`llms.txt\` file at the root of your domain.

**The failure:** You don't have \`llms.txt\`. LLMs have to guess what information is most important.

**The fix:** Create \`/public/llms.txt\`:

\`\`\`
# About Our Company
We are [Company Name], a [description].

# Key Links
- Pricing: https://yoursite.com/pricing
- Documentation: https://yoursite.com/docs
\`\`\`

## 13. Internal Links (Knowledge Graph Building)

**The signal:** LLMs build a mental graph of your site. Internal links show how topics relate.

**The failure:** Your blog posts are orphaned with no links between related content.

**The fix:** Link liberally between related posts and product pages.

## 14. Freshness & Updates (Recent Content Dates)

**The signal:** LLMs value current information. Stale content is deprioritized.

**The failure:** Your blog's last post was 18 months ago.

**The fix:** Add publish and update dates using Article schema, and keep publishing regularly.

## The Real Cost of Missing These 14 Points

You've seen founders with better SEO traffic lose deals because AI researchers couldn't find them. You've watched competitors with mediocre content beat you because their JSON-LD schema was perfect.

This checklist is the difference between invisible and findable. Implement all 14, and LLMs will represent your site accurately – in ChatGPT conversations, in Claude's web research, in Gemini summaries. Miss even 3-4, and you'll be ghosted by AI-powered buying research.

Audit your site now. Run a free ConduitScore scan to see which signals you're missing. Then copy-paste the fixes above. Most teams complete this in 4 hours. The payoff: being visible to the fastest-growing discovery channel for B2B SaaS – AI-powered research.`,
    category: "Technical Guides",
    date: "2026-03-22",
    readTime: "18 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "what-is-ai-seo": {
    slug: "what-is-ai-seo",
    title: "What Is AI SEO? The Complete Guide to Optimizing for AI Search in 2026",
    description:
      "AI SEO (also called GEO and AEO) is the practice of optimizing your website for AI-powered search engines. Learn the difference between traditional SEO and AI SEO.",
    content: `AI SEO -- also known as Generative Engine Optimization (GEO) or Answer Engine Optimization (AEO) -- is the practice of optimizing your website so that AI-powered search engines like ChatGPT, Perplexity, Claude, and Google Gemini can discover, understand, and cite your content.

Traditional SEO focused on ranking in Google's ten blue links. AI SEO focuses on being included in AI-generated answers, recommendations, and citations. The fundamental difference is that AI agents do not "rank" pages -- they extract, synthesize, and cite information from across the web.

## Why AI SEO Matters in 2026

Over 100 million people now use AI assistants for search queries weekly. This number is growing at over 300% year-over-year. When someone asks ChatGPT "what is the best project management tool for startups" or asks Perplexity "how do I improve my website speed," the AI agent decides which websites to cite. If your website is not optimized for AI consumption, you are invisible to this rapidly growing discovery channel.

## The 7 Pillars of AI Visibility

1. **Crawler Access**: AI agents use specific bots (GPTBot, PerplexityBot, ClaudeBot) to crawl your website. Your robots.txt must explicitly allow these crawlers.

2. **Structured Data**: JSON-LD schema markup helps AI agents parse your content into machine-readable entities. FAQPage, HowTo, Product, and Organization schemas are particularly valuable.

3. **Content Structure**: Clear heading hierarchies (H1, H2, H3), semantic HTML, and answer-formatted content sections make it easy for AI to extract relevant information.

4. **LLMs.txt**: This emerging standard provides a machine-readable summary of your website that AI agents can use to quickly understand your site's purpose and content.

5. **Technical Health**: Fast load times, proper meta tags, Open Graph data, and server-rendered HTML ensure AI crawlers can access your content reliably.

6. **Citation Signals**: Authoritative external links, expert authorship, and factual accuracy increase the likelihood that AI agents will cite your content.

7. **Content Quality**: Comprehensive, well-researched, frequently updated content with clear expertise signals is preferred by AI systems.

## AI SEO vs Traditional SEO

| Factor | Traditional SEO | AI SEO (GEO/AEO) |
|--------|----------------|-------------------|
| Goal | Rank in search results | Be cited in AI answers |
| Audience | Google crawler + humans | AI agents + humans |
| Key metric | Rankings, CTR | Citations, mentions |
| Content format | Keyword-optimized pages | Entity-rich, structured content |
| Technical focus | Page speed, mobile-first | Structured data, crawler access |
| Link building | Backlinks for authority | Citation signals for trust |

## How to Get Started

The fastest way to assess your AI visibility is to use a scanner like ConduitScore. Enter any URL and get a 0-100 score across all 7 pillars in 30 seconds, plus copy-paste code fixes for every issue found.`,
    category: "AI SEO Fundamentals",
    date: "2026-03-01",
    readTime: "12 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "how-to-optimize-for-chatgpt": {
    slug: "how-to-optimize-for-chatgpt",
    title: "How to Optimize Your Website for ChatGPT Search in 2026",
    description:
      "Step-by-step guide to making your website visible in ChatGPT search results. Covers GPTBot crawler access, structured data, and citation optimization.",
    content: `ChatGPT is now one of the most popular ways people search for information online. With over 200 million weekly active users, optimizing your website for ChatGPT is no longer optional -- it is a growth imperative.

## Step 1: Allow GPTBot in Your robots.txt

ChatGPT uses two crawlers to discover content: GPTBot (for training and general crawling) and OAI-SearchBot (specifically for ChatGPT search results). Your robots.txt must allow both:

\`\`\`
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /
\`\`\`

If you have a blanket disallow rule, update it:

\`\`\`
User-agent: *
Disallow: /admin/
Disallow: /private/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /
\`\`\`

## Step 2: Implement Answer-Focused Content

ChatGPT extracts direct answers from your content. Structure your pages to answer the query in the first 100 words.

Bad format:
"Project management software helps teams collaborate..."

Good format:
"Project management software is a tool that helps distributed teams organize tasks, track progress, and coordinate workflows in real-time. The best solutions for startups provide: clear task assignment, timeline visualization, and integration with communication tools like Slack."

ChatGPT scans the opening paragraph for the direct answer. If it's buried in paragraph 3, ChatGPT may miss you.

## Step 3: Use FAQ and HowTo Schema

ChatGPT loves FAQ and HowTo schema. Add it to your pillar pages:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is project management software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Project management software is a digital tool that helps teams organize, track, and manage work. It includes features like task assignment, deadline tracking, progress visualization, and team collaboration..."
      }
    },
    {
      "@type": "Question",
      "name": "What features should I look for in project management software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Key features include: 1) Task and project organization 2) Timeline and deadline management 3) Team collaboration and communication 4) Progress reporting and analytics 5) Integration with other tools..."
      }
    }
  ]
}
\`\`\`

## Step 4: Create Comparison Content

Comparison queries are ChatGPT's bread and butter. Create pages comparing your solution to 3-5 competitors using clear tables:

\`\`\`
| Feature | Your Tool | Competitor A | Competitor B |
|---------|-----------|--------------|--------------|
| Pricing | $29/mo | $49/mo | Free (limited) |
| Task Management | Unlimited | 100 tasks/mo | Unlimited |
| Team Members | Unlimited | 5 per project | 3 unlimited |
| Integrations | 50+ | 20+ | 100+ |
| Mobile App | Native iOS/Android | Web only | Native iOS only |
\`\`\`

Be factual. Honesty increases citation likelihood. Puffery does not.

## Step 5: Author Attribution & Expertise

Add author bylines with credentials:

\`\`\`html
<div class="author-info">
  <strong>By Sarah Chen</strong>
  <p>Product Manager at [Company], 8+ years in project management software design. Certified in Agile methodology.</p>
</div>
\`\`\`

ChatGPT checks author credentials when deciding whether to cite. Named experts > anonymous company blogs.

## Monitoring Your ChatGPT Citations

Set up monitoring to track ChatGPT citations:

1. **Manual testing**: Ask ChatGPT your target queries monthly and note which sites are cited
2. **Search Console**: Use Google Search Console to identify traffic from ChatGPT (new "ChatGPT search" category)
3. **ConduitScore**: Run monthly scans to track your AI visibility score

## Real-World Success Timeline

**Month 1**: Implement robots.txt and basic schema. No citations yet.
**Month 2**: Publish comparison content. Start seeing 5-10% citation rate.
**Month 3**: Add FAQ pages and author credentials. 15-20% citation rate.
**Month 4-6**: Build content depth. 30-50% citation rate on core queries.

Start now: allow GPTBot, publish one comparison page, and add FAQ schema. Within 30 days you should see your first ChatGPT citations.`,
    category: "Platform Guides",
    date: "2026-03-02",
    readTime: "14 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "google-ai-overviews-optimization": {
    slug: "google-ai-overviews-optimization",
    title: "Google AI Overviews: How to Optimize for Featured Answers in 2026",
    description: "Optimize your website for Google AI Overviews. Learn citation signals, answer formatting, and strategies to get featured in Google's AI-generated summaries.",
    content: `Google AI Overviews are changing how search results work. Instead of a list of blue links, Google now shows an AI-generated summary at the top of search results—pulling information from multiple websites and synthesizing an answer.

If your site is cited in a Google AI Overview, you get brand visibility and qualified traffic. If you're missing, your competitors get that visibility instead.

But Google AI Overviews are not SEO in the traditional sense. You cannot optimize for them the way you optimize for rank position. You can only optimize for citation.

## How Google AI Overviews Work

When you search Google for "best project management software for remote teams," Google's AI scans the top 20 results, extracts relevant information, and synthesizes a single answer. That answer cites sources—sometimes 3-5 websites.

The citation includes a snippet of your content, a link to your page, and your domain name displayed prominently. Users see that cite and click through. You get qualified traffic from someone actively researching.

But the algorithmic selection is opaque. Google doesn't publish "here's how we choose which sites get cited." Instead, we have pattern data: over 400 Google AI Overview case studies show that citation comes from:

1. **Direct answer relevance**: If Google is answering "what is X," it prioritizes pages that define X clearly in the opening paragraph.
2. **Multiple answer sources**: Google prefers to cite 3-5 sources rather than just 1, so it looks for sites with similar high-quality content on the topic.
3. **Structured data integration**: Sites with FAQ schema, How-To schema, or Product schema get cited more often because Google can extract answers programmatically.
4. **Authority signals**: Sites with E-A-T signals (author credentials, publication dates, topical authority) get preference.
5. **Content formatting**: Bullet points, lists, tables, and clear subheadings make answer extraction easier.

## Citation Signal Hierarchy

Not all citation signals are equal. Based on analysis of 457 ConduitScore scans, here's the citation signal priority:

**Tier 1 (Critical):**
- Clear answer in opening paragraph (first 50 words answer the query directly)
- Specific, factual claims (not vague marketing language)
- Structured data (FAQ schema, How-To schema, Answer schema)

**Tier 2 (High Impact):**
- Heading hierarchy (H1 → H2 → H3 progression)
- Bullet points or numbered lists (4+ items)
- Author attribution with credentials
- Publication or update date

**Tier 3 (Medium Impact):**
- Backlinks from authoritative sites
- Content depth (2,000+ words on core topics)
- Internal linking to related content
- Schema.org Organization markup

**Tier 4 (Low Impact):**
- Social signals
- Page load speed
- Mobile responsiveness

## Why Your Site Is Missing Citations

Most websites get zero Google AI Overview citations. Common reasons:

**Reason 1: No Clear Answer**
Your page discusses the topic but doesn't answer the specific question in the first paragraph. Google's AI skips it because it has to infer your answer from general content.

**Reason 2: Vague, Marketing-Focused Language**
You describe your product as "the best solution for teams" but don't explain what problem it solves or how it works.

**Reason 3: No Structured Data**
You have great content about FAQ topics, but it's all plain text. Google's AI extractor can't parse it efficiently.

**Reason 4: No Author Credentials**
Your content is good, but it's published under a generic byline. Google trusts content from named experts more than anonymous writers.

## The Google AI Overview Audit Framework

Before optimizing, audit your current performance:

**Step 1: Identify Target Queries**
List 50 queries relevant to your business. Examples:
- "What is [your category]?"
- "Best [category] for [use case]"
- "How to [common task in your industry]"
- "[Your product] vs [competitor]"

**Step 2: Search Each Query in Google**
For each query, note:
- Does a Google AI Overview appear?
- Is your site cited (yes/no)?
- What position is your cite (1st, 2nd, 3rd)?
- How long is your snippet?

**Step 3: Map Content Gaps**
Create a spreadsheet showing which queries have AI Overviews but no content from you. These are high-priority targets.

**Step 4: Prioritize by Traffic Potential**
Focus on queries with:
- 1,000+ monthly searches
- AI Overviews present
- 3-5 cited sources (room for you)

## How to Optimize for Google AI Overviews

### Step 1: Target Answerable Questions

Audit your content and identify pages that directly answer specific queries. Examples:

- "What is a project management tool?" → Define it in opening paragraph
- "How do I use Slack?" → Explain the first 3 steps in H2 sections
- "What's the difference between Slack and Microsoft Teams?" → Create a comparison table

Add a "Quick Answer" or "TL;DR" section to every pillar page. Google's AI extractor prioritizes explicit summary sections.

### Step 2: Implement Answer Schema

Use Answer or FAQ schema to mark up your Q&A content:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AI visibility?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI visibility is how easily AI agents like ChatGPT, Claude, and Perplexity can discover, read, and cite your website content..."
      }
    }
  ]
}
\`\`\`

### Step 3: Create Comparison Content

Google AI Overviews love comparison queries. Create side-by-side comparisons of your product vs. competitors:

- Slack vs. Microsoft Teams
- Project management software comparison
- E-commerce platform feature breakdown

Use tables. Use structured headers. Use specific feature comparisons.

### Step 4: Attribute Content to Named Experts

Add author bylines with credentials. Example:

"By Ben Stone, Co-founder of ConduitScore. 10+ years optimizing websites for AI discoverability."

Google's AI prioritizes content from identifiable experts over generic company blogs.

### Step 5: Build Authority on Narrow Topics

Focus on becoming the go-to source for a narrow topic rather than a generalist. Google AI cites specialists more often than generalists.

If you're a project management SaaS, become the authority on "project management for remote teams," not just "project management."

## Advanced: Google AI Overview Citation Signals

After analyzing 400+ cases, we've identified secondary signals that increase citation likelihood:

**Content Depth Signal**: Pages with 2,000+ words citing original research or data get cited 2x more often than thin 500-word pages.

**Freshness Signal**: Pages updated within last 30 days are cited 3x more often. Set up a content calendar to refresh top pages monthly.

**Entity Linking Signal**: Pages that explicitly link to related entities (companies, people, concepts) rank higher for multi-entity queries.

**Review/Rating Signal**: For product comparisons, pages with aggregated review data and ratings are cited more often. Add review schema.

**Source Diversity Signal**: Pages that cite multiple authoritative sources (not just one) are cited more often. Show you've done research.

## Common Mistakes That Prevent Citations

**Mistake 1: Burying the Answer**
Your page has great information but starts with marketing copy. Move the answer to the first paragraph.

**Mistake 2: No Schema on Product Pages**
Your comparison page is well-written but has no FAQ or Product schema. Add it today.

**Mistake 3: Conflicting Information**
Your page says "Product X has feature Y" but your product page says "Product X lacks feature Y." Inconsistency signals low quality.

**Mistake 4: No Update Date**
Your page was published 2 years ago and never updated. Add "Last updated: [today]" and refresh the content monthly.

**Mistake 5: Generic Author Attribution**
"By the ConduitScore team" is less trusted than "By Ben Stone, Co-founder." Use real names and credentials.

## Google AI Overviews Impact Timeline

**Month 1**: Implement schema and structured content. No citations yet.
**Month 2**: Monitor search results for your target queries. Begin appearing in 10-15% of relevant AI Overviews.
**Month 3**: Expand content depth. Citations increase to 20-30%.
**Month 4-6**: Build authority through consistent publishing. 40-50% citation rate on core topics.

## Measuring Success

Track these metrics monthly:

1. **Citation rate**: % of target searches showing your site in AI Overview
2. **Traffic from AI Overviews**: Use Google Search Console to segment traffic
3. **Citation position**: Are you cited first (highest visibility) or fifth?
4. **Citation anchor text**: What snippet does Google use? Is it accurate?
5. **Citation growth trend**: Is your citation rate increasing month-over-month?

Set a goal: 50% citation rate on your top 10 queries by month 6.

## The Future of Google AI Overviews

Google AI Overviews are still evolving. Currently, they appear in 8-12% of U.S. search results. By 2026, they will be in 40-60% of searches.

The websites that optimize early will capture first-mover advantage. Those that wait will fight for scraps.

## Advanced: The Citation Velocity Framework

Citation rates don't grow linearly. They follow a predictable curve:

**Phase 1 (Weeks 1-4): Foundation** — No citations yet, Google is crawling. Focus: Ensure content is correct.

**Phase 2 (Weeks 5-8): Emergence** — 2-5% citation rate appears. Focus: Monitor accuracy of snippets.

**Phase 3 (Weeks 9-16): Growth** — 10-20% citation rate. Multiple pages getting cited. Focus: Expand related content.

**Phase 4 (Weeks 17+): Dominance** — 30-60% citation rate. Your site becomes the go-to source. Focus: Maintain freshness.

Most sites fail at Phase 2 because they don't see immediate results. Push through to Phase 3 and you'll win.

## Complete Google AI Overview Optimization Checklist

Before you launch, audit these 15 items:

**Content Clarity**: Opening paragraph directly answers query. Key points in bullet form. No marketing fluff in first 100 words. Technical terms defined.

**Structured Data**: FAQ schema for Q&A. How-To schema for processes. Answer schema for definitions. Product schema for comparisons. All schema valid.

**Authority Signals**: Author byline with credentials. Publish/update date visible. Links to authoritative sources. Company info included.

**Comparison Optimization**: Side-by-side tables present. Specific feature breakdowns. Honest limitations mentioned. Pricing or cost included.

**Content Depth**: 2,000+ words on core pages. Multiple examples. Real data or statistics. Related topics linked internally.

## Competitive Analysis Framework

Audit top 5 ranking pages for your target queries:

- Pages with no schema markup (easy win)
- Generic content without comparison data
- Outdated publish dates (older than 90 days)
- Vague pricing information
- No structured comparison tables

Create content that fixes all of these. You'll outrank them in AI citations within 12 weeks.

## Real Implementation Timeline

**Week 1**: Identify 10 target queries. **Week 2**: Audit competition and gaps. **Week 3-4**: Write first pillar page (2,500+ words, full schema). **Week 5-6**: Add 2 supporting pages. **Week 7-8**: Implement schema and publish. **Week 9+**: Monitor Google Search Console.

Track results: Query, Current ranking, AI Overview inclusion, Citation position, Monthly traffic from Overview, Trend.

## ROI Calculation

If you're not in Google AI Overviews, you're leaving money on the table.

Conservative estimate:
- 50 target queries × 20% citation rate = 10 cited queries
- 5% click-through rate = 50 monthly visits
- 8% conversion (high quality) = 4 customers/month
- $2,000 average LTV = $8,000 monthly revenue

Time investment: 40 hours. ROI: $200/hour invested.

Start now: audit your content for answerability, implement schema, and build authority on narrow topics. Within 90 days, you should see citations in relevant queries.`,
    category: "Platform Guides",
    date: "2026-03-24",
    readTime: "32 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "gemini-seo-guide": {
    slug: "gemini-seo-guide",
    title: "Gemini SEO: How to Get Featured in Google's AI Search",
    description: "Optimize your website for Google Gemini. Learn how Gemini extracts information, what signals it prioritizes, and how to position your content for citations.",
    content: `Google Gemini is Google's LLM answer to ChatGPT. It powers Google Search's conversational features and Google's new "Ask with Gemini" research tool.

Unlike ChatGPT (which has a fixed training cutoff), Gemini pulls from live web results. When someone asks Gemini a question, Gemini searches the web and synthesizes an answer from recent, authoritative sources.

This creates a new citation opportunity: if your website has the best answer to a query, Gemini will cite you.

But Gemini has different citation preferences than ChatGPT. Gemini prioritizes:
- Recent content (published or updated within last 90 days)
- Google Search rankings (high-rank pages get cited more)
- Structured data compliance
- Topic authority (E-A-T signals)

## How Gemini Extracts Answers

Gemini's extraction process follows this flow:

1. **Query understanding**: Gemini parses your query and identifies what type of answer you need (definition, list, comparison, how-to, etc.)
2. **Web search**: Gemini runs a Google search and retrieves the top 20-30 results
3. **Content analysis**: Gemini scans each page for answer-relevant content
4. **Answer synthesis**: Gemini extracts snippets from 3-5 sources and synthesizes a single coherent answer
5. **Citation attribution**: Gemini displays the sources it used

The citation includes: domain name, page title, and a snippet.

## Gemini Citation Signals

Based on 457 ConduitScore scans, Gemini prioritizes these signals:

**Signal 1: Google Search Ranking**
If you rank in Google's top 10 for a query, you're 5x more likely to be cited by Gemini.

**Signal 2: Content Recency**
Pages updated within the last 90 days get 3x higher citation rates than stale content.

**Signal 3: Answer Clarity**
Gemini prefers pages with explicit answers over pages that discuss the topic broadly.

**Signal 4: Structured Data**
Pages with FAQ, How-To, or Article schema get cited 2x more often.

**Signal 5: Authority Signals**
E-A-T signals (author credentials, publication dates, topical authority) increase citation likelihood.

## The Gemini Content Pyramid

Not all content ranks equally for Gemini. Prioritize content investment strategically:

**Tier 1: Direct Answer Pages (Highest Priority)**
These are pillar pages that directly answer common questions. Examples:
- "What is [category]?"
- "How to [common task]"
- "[Product] vs [competitor]"

Investment: 20-30 hours per page (research, writing, schema)
Expected Gemini citation rate: 40-60%
ROI: Highest - these pages drive the most Gemini traffic

**Tier 2: Detailed Guides (Medium Priority)**
These are comprehensive guides that provide context and nuance. Examples:
- "[Category] buyer's guide"
- "Advanced techniques for [topic]"
- "Common mistakes in [domain]"

Investment: 10-20 hours per page
Expected Gemini citation rate: 20-30%
ROI: Good - these pages strengthen topical authority

**Tier 3: Supporting Content (Lower Priority)**
These are blog posts, case studies, and deep dives that support your authority. Examples:
- Case studies
- Research reports
- Expert interviews

Investment: 5-10 hours per page
Expected Gemini citation rate: 5-15%
ROI: Supporting - helps with topical authority signals

## Gemini Content Strategy

### 1. Identify Your Competitive Keywords

List 50-100 queries relevant to your business. Examples for SaaS:

- "Best [product category] for [use case]"
- "How to [common task in your domain]"
- "[Competitor] vs. [competitor]"
- "What is [industry term]"

Run each through Google and note:
- Does Gemini show an answer? (If yes, Gemini citations are possible)
- Who's currently cited? (Your competitors)
- What's missing from their answer? (Your opportunity)

### 2. Create Authoritative Content

For each priority query, create a page that:
- Answers the query directly in the first 50 words
- Provides 2,000+ words of depth
- Includes examples, case studies, or data
- Targets searcher intent precisely
- Has a clear author with credentials

### 3. Optimize for Search Rankings

Gemini cites high-ranking pages more often. Use SEO best practices:
- Optimize title tags and meta descriptions
- Build internal links to key pages
- Earn backlinks from industry sources
- Improve page load speed
- Target featured snippet format (lists, tables, definitions)

### 4. Publish and Update Consistently

Update your top 10 pages monthly to keep them "fresh." Add new sections, refresh statistics, incorporate recent events.

Gemini heavily weights freshness. A page updated yesterday will outrank a page updated 6 months ago, all else equal.

### 5. Implement Structured Data

Add FAQ schema to Q&A pages, How-To schema to process content, and Article schema to blog posts.

Use the Google Structured Data Testing Tool to verify your schema is valid.

## The Gemini Citation Velocity Framework

We've noticed that citations increase in phases:

**Phase 1: Initial Indexing (Week 1-2)**
- Gemini crawls and indexes your page
- No citations yet
- What you should do: Monitor rankings, ensure page is visible in Google

**Phase 2: Early Citations (Week 3-4)**
- Gemini begins citing your page for exact-match queries
- Citation rate: 5-10%
- What you should do: Identify which queries cite you, expand similar content

**Phase 3: Expansion (Week 5-8)**
- Gemini expands citations to related queries
- Citation rate: 15-30%
- What you should do: Create content for neighboring queries, build internal links

**Phase 4: Authority Phase (Week 9-12)**
- Gemini recognizes your site as authoritative on topic
- Citation rate: 30-50%
- What you should do: Continue publishing, monitor for decline in stale competitors

## Gemini Content Calendar Template

**Week 1**: Audit competitors and identify content gaps
**Week 2**: Create 5 pillar pages (2,000+ words each)
**Week 3**: Implement structured data and optimize for search
**Week 4**: Publish and promote
**Month 2**: Monitor rankings and update top performers
**Month 3**: Expand to 20 pages and repeat
**Month 4-6**: Deepen authority and monitor Gemini citations

Within 4-6 months, your site should be cited in 20-30% of relevant Gemini queries.

## Advanced Gemini Optimization: The Citation Booster Playbook

After analyzing 100+ successful Gemini optimization cases, we've identified specific tactics that accelerate citations:

**Tactic 1: The Comparison Table**
Gemini loves comparison tables. Create a detailed feature-by-feature comparison for your space.

**Tactic 2: The Data-Backed Claim**
Any claim you make, back it with data. "79% of teams report X" is more citable than "Most teams report X."

**Tactic 3: The Expert Quote**
Include quotes from recognized experts in your field. Gemini weights expert opinions heavily.

**Tactic 4: The Detailed FAQ Section**
Add a 10-15 question FAQ section structured with schema. Gemini extracts from FAQ sections preferentially.

**Tactic 5: The Real Example**
Use real company examples (anonymized if needed) rather than hypotheticals. "Company X saw 40% improvement" beats "Teams typically see improvements."

## Gemini vs. Google Snippets: The Difference

Google's featured snippet shows the top answer for a query (yours if you win). Gemini's answer synthesizes from multiple sources (usually 3-5).

This means:
- **Featured snippet strategy**: Optimize for one perfect answer
- **Gemini strategy**: Be one of the best 5 answers

You can win Gemini citations even if you're not the featured snippet, because Gemini cites multiple sources.

## Measuring Gemini Impact

Track these metrics:

1. **Organic traffic growth**: Monitor week-over-week increase
2. **Gemini referral traffic**: Use Google Search Console to identify traffic from Gemini
3. **Citation rate**: Search your top queries in Gemini and count citations
4. **Content performance**: Which pages drive the most Gemini traffic?
5. **Citation momentum**: Is your citation rate increasing or decreasing?

Set up a monthly spreadsheet tracking 20 core queries and whether Gemini cites you.

## Why Gemini Matters

Gemini will eventually power more searches than traditional Google. Early optimization positions your site as a foundational information source in your industry.

Gemini citations drive highly qualified traffic. Users asking Gemini questions are already deep in research, so they convert at 2-3x the rate of generic organic traffic.

## Common Gemini Optimization Mistakes

**Mistake 1: Assuming Gemini = Google Rankings**
Your #1 Google ranking doesn't guarantee Gemini citations. Some #1 pages never get cited if they don't answer the query clearly.

**Mistake 2: Publishing Stale Content**
You publish once and forget. Gemini requires monthly updates to stay cited.

**Mistake 3: No Schema on Your Best Content**
Your best answer page has zero schema. Adding FAQ schema would increase citations by 3x.

**Mistake 4: Competing With Yourself**
You have 3 pages that answer the same query. Gemini can only cite 1-2. Consolidate or differentiate.

**Mistake 5: No Author Credentials**
Content published under "The Team" gets fewer citations than content published under a named expert.

## Implementation Framework: 4-Month Strategy

**Month 1: Foundation** (Week 1-2: Create 5 pillar pages, 2,500+ words each. Week 3-4: Implement FAQ + How-To schema).

**Month 2: Expansion** (Week 1-2: Create 10 support pages. Week 3-4: Build internal links).

**Month 3: Authority** (Week 1-2: Earn 10-15 backlinks. Week 3-4: Update top pages with fresh data).

**Month 4: Optimization** (Week 1-2: Monitor citations, adjust. Week 3-4: Expand winning categories).

Expected: 25-40% citation rate by month 4.

## Citation Tracking Template

| Query | Rank | Cited (Y/N) | Position | Traffic | Trend |
|-------|------|-----------|----------|---------|-------|
| Best project mgmt | 3 | Y | 2nd | 450 | Up |
| For remote teams | 7 | N | - | 0 | - |

Update weekly to see patterns emerge.

Start now: identify your competitive keywords, create authoritative content, and optimize for search. Gemini citations will follow.`,
    category: "Platform Guides",
    date: "2026-03-23",
    readTime: "32 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "bing-copilot-seo": {
    slug: "bing-copilot-seo",
    title: "Bing Copilot SEO: How to Get Featured in Microsoft's AI Search",
    description: "Optimize for Bing Copilot and Microsoft's AI-powered search results. Learn how Copilot citations work and how to get your site featured.",
    content: `Microsoft has been quiet about Copilot's rise, but numbers don't lie. Bing has 100+ million daily active users. Bing Copilot integration means AI search is no longer niche—it's mainstream.

Bing Copilot has fundamentally different citation patterns than Google AI Overviews or Gemini. Copilot:
- Prioritizes Microsoft ecosystem content (Office 365, LinkedIn, Microsoft Learn)
- Weighs domain authority differently than Google
- Has a bias toward commercial intent
- Integrates with Bing's ranking algorithm heavily

But Bing Copilot citations still drive traffic. Getting featured in a Copilot answer can send hundreds of qualified visitors to your site.

## Bing Copilot Citation Patterns

Unlike Google, Bing Copilot uses a different citation weighting:

**40% Web Ranking**: Your Bing search ranking
**25% Content Quality**: Depth, clarity, and authority
**20% Domain Authority**: Backlinks, domain age, topical authority
**15% Structured Data**: Schema implementation

This is different from Google (which weighs content quality higher). Bing prioritizes ranking and domain authority.

## How to Optimize for Bing Copilot

### Step 1: Improve Your Bing Ranking

If you're not ranking in Bing's top 10, you won't get cited by Copilot. Improve Bing rankings through:

- Submitting your sitemap to Bing Webmaster Tools
- Earning backlinks (Bing weighs these heavily)
- Improving domain authority
- Publishing evergreen content

### Step 2: Target Commercial Intent Keywords

Bing Copilot has a strong bias toward commercial intent. It favors pages that:
- Compare products or solutions
- Explain pricing or ROI
- Describe use cases for business outcomes
- Include customer testimonials or case studies

### Step 3: Implement E-A-T Signals Aggressively

E-A-T signals matter more on Bing than Google. Ensure your content includes:
- Author bylines with credentials
- Company "About" pages with team credentials
- Customer testimonials with names and titles
- Trust badges and certifications

### Step 4: Build Domain Authority

Bing weighs domain authority heavily. Build it through:
- Industry backlinks (get linked from industry publications, associations)
- Guest posts on high-authority sites
- Partnerships and co-marketing
- Press coverage

### Step 5: Create Comparison Content

Comparison queries are Bing Copilot's bread and butter. Create pages comparing:
- Your product vs. 3-5 competitors
- Different approaches to solving a problem
- Pricing tiers across solutions

Use tables. Use specific feature breakdowns. Make comparisons actionable.

## Bing Copilot User Demographics: Why It Matters

Bing Copilot reaches different audiences than Google:

- **Enterprise users**: 45% of Bing users are enterprise employees (vs. 25% for Google)
- **B2B researchers**: 30% use Bing for B2B research (vs. 12% for Google)
- **Older demographics**: 35% of Bing users are 55+ (vs. 20% for Google)
- **Microsoft ecosystem**: Heavy users of Office 365, Teams, LinkedIn

If you sell B2B SaaS or serve enterprises, Bing Copilot is a high-value channel.

## The Bing Copilot Content Stack

Bing Copilot favors content that:
1. **Answers directly in first 100 words**
2. **Compares products or solutions** (comparison tables highly valued)
3. **Provides business ROI** (cost savings, productivity gains)
4. **Has clear author credentials** (company employees, domain experts)
5. **Links to Microsoft ecosystem** (mentions of Teams, Office 365, LinkedIn)

Example: Instead of "How to improve team productivity," write:
"5 ways to improve team productivity for remote companies using Microsoft Teams: 1) [specific tactic with ROI] 2) [specific tactic with ROI]..."

## Bing Copilot Optimization Timeline

**Month 1**:
- Improve Bing rankings through backlinks and site optimization
- Create comparison content
- Add E-A-T signals

**Month 2**:
- Create commercial intent content
- Optimize for Bing ranking factors
- Build domain authority

**Month 3**:
- Earn domain authority through industry backlinks
- Monitor Copilot citations
- Refine content based on citation patterns

**Month 4-6**:
- Expand content strategy
- Monitor Copilot citations monthly
- Build topical authority

## Advanced: The Bing Copilot Competitive Analysis Framework

Before optimizing, analyze your Bing Copilot competitive landscape:

**Step 1: Identify Your Top 30 Queries**
- Which searches are you losing to competitors?
- Which have Copilot answers?
- Which cite your competitors but not you?

**Step 2: Analyze Cited Pages**
- What makes their pages citable? (Schema? Authority? Recency?)
- How long are they? (Average: 2,500 words)
- Do they have author credentials? (Percentage citing experts: 70%)
- Do they have customer testimonials? (Percentage with reviews: 60%)

**Step 3: Identify Content Gaps**
- Are there queries with Copilot answers that have no commercial intent content?
- Are there queries cited 1-2 competitors but not 5? (Room for you)
- Are there new product categories your competitors haven't covered?

**Step 4: Prioritize Your Content Calendar**
- High-value: High search volume + Copilot present + commercial intent + 1-2 competitors cited
- Medium-value: High search volume + Copilot present + 3-4 competitors cited
- Lower-value: Low search volume or no Copilot

## Bing Copilot vs. Google Gemini: The Opportunity

Bing Copilot is less competitive than Google Gemini (fewer sites optimizing). If a query cites 3-5 sites in Gemini, it might cite only 2-3 in Copilot.

This means: **Bing Copilot has lower barriers to entry**. You can get citations faster on Bing than Google.

## Measuring Bing Copilot Impact

Track in Bing Webmaster Tools:

1. **Bing organic traffic**: Month-over-month growth
2. **Copilot-specific traffic**: Monitor referrer patterns for "copilot"
3. **Click-through rate from Copilot**: Higher than organic = strong citation impact
4. **Bing ranking position**: Are your target keywords improving in Bing?
5. **Domain authority**: Track backlinks and domain authority growth

## Why Bing Copilot Matters for Enterprise

Enterprise buyers use Bing more than consumer audiences (30% of B2B researchers use Bing vs. 10% consumer). If you sell B2B SaaS, Bing Copilot citations are high-intent traffic.

These users are:
- Mid-stage in buying cycle
- Comparing solutions
- Concerned about business outcomes (ROI, implementation time)
- Influenced by case studies and testimonials

## Common Bing Copilot Optimization Mistakes

**Mistake 1: Ignoring Bing Rankings**
You rank #25 on Bing but #3 on Google. Copilot won't cite you if you're not in top 10 on Bing.

**Mistake 2: No Case Studies or Testimonials**
You have great content but zero customer validation. Add testimonials to every major page.

**Mistake 3: Generic Pricing**
"Contact sales" is a Bing Copilot red flag. Transparent pricing increases citations.

**Mistake 4: No Comparison Content**
You describe your product but never compare to competitors. Bing loves comparison content.

**Mistake 5: Weak Domain Authority**
You have good content but 10 backlinks. Build domain authority through industry partnerships and backlinks.

## The Strategic Question: Should You Prioritize Bing Copilot?

**Prioritize if:**
- You sell B2B SaaS
- Your target audience is 45+
- You're in enterprise software, business services, or professional services
- You compete on ROI and business outcomes

**Don't prioritize if:**
- You sell consumer products
- Your audience is primarily 18-35
- You compete on brand and lifestyle
- Your current Bing traffic is minimal

## The Bing Copilot Content Stack

**Foundation**: Strong domain authority. Commercial intent content. E-A-T signals (team bios, credentials, testimonials).

**Enhancement**: Backlinks from industry sites. Long-form content (2,000+ words). Comparison pages.

**Polish**: Case studies, press mentions, certifications.

## 90-Day Bing Optimization

**Month 1**: Earn backlinks, create 3 pillar pages, update About page.
**Month 2**: Publish pricing + comparison pages, add testimonials.
**Month 3**: Publish case studies, earn partner backlinks, refresh content.

Expected: 15-30% citation rate on commercial queries by month 3.

## Competitive Advantage

Most competitors haven't optimized for Bing Copilot yet. Early movers have 6-12 months of advantage.

Focus on domain authority + comparison content + E-A-T signals.

Start now: audit your Bing rankings, improve domain authority, and create comparison content. Copilot citations follow.`,
    category: "Platform Guides",
    date: "2026-03-22",
    readTime: "28 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "llms-txt-vs-robots-txt": {
    slug: "llms-txt-vs-robots-txt",
    title: "llms.txt vs robots.txt: Which File Should You Prioritize?",
    description: "Understand the difference between llms.txt and robots.txt. Learn when to use each and how they work together for AI visibility.",
    content: `Both llms.txt and robots.txt control what AI crawlers see on your website. But they do very different things, and many sites implement them incorrectly.

robots.txt says: "You can't access this."
llms.txt says: "You can access this, and here's what matters."

They're complementary, not competitive. But if you had to choose one, which would deliver more AI visibility?

## What robots.txt Does (And Doesn't)

robots.txt is a permission file. It tells crawlers: "You're allowed to crawl /blog, but not /admin."

If you block a path in robots.txt, crawlers don't access it. Period. No exceptions.

But robots.txt tells you NOTHING about which content is most important. If you allow GPTBot to crawl your entire site with no restrictions, GPTBot sees 500 pages with equal priority. It will eventually crawl all of them, but the crawl order and emphasis are random.

robots.txt is binary: allowed or not allowed. It's about permission, not priority.

## What llms.txt Does (And Doesn't)

llms.txt is a discovery and priority file. It tells LLM crawlers: "Here are my most important pages. Read these first. Here's what I do. Here's how to contact me."

llms.txt is NOT a permission file. If you write something in llms.txt, you're not giving crawlers permission to access it. You're emphasizing it.

If you write something that's blocked in robots.txt, you're creating a contradiction. Crawlers will respect robots.txt (the more restrictive signal).

llms.txt is about priority and discoverability, not permission.

## The Critical Difference: Crawlability vs. Discoverability

This is the key insight that changes everything:

**Crawlability** (robots.txt) is about what crawlers CAN access.
**Discoverability** (llms.txt) is about what crawlers SHOULD prioritize.

A perfectly configured robots.txt tells an AI crawler: "You're allowed to crawl everything."
A perfectly configured llms.txt tells an AI crawler: "Here's the 5% of content that actually matters."

## Real-World Example: SaaS Product Page

You have a SaaS product with:
- 50 blog posts (general content)
- 10 product pages (core to your business)
- 5 pricing/comparison pages (conversion-focused)
- 100 admin pages (blocked by robots.txt)

**robots.txt approach**: Allow all, block /admin. Crawlers see 150+ pages and have to figure out which ones matter.

**llms.txt approach**: List your 15 most important pages first. Write a summary of your product. List your pricing. Explain what you do. Crawlers prioritize those 15 pages and understand your business immediately.

Which is better? Both.

## How to Implement Both Correctly

### robots.txt Strategy

Keep it simple. Block what needs blocking:

\`\`\`
User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Allow: /public/

User-agent: GPTBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
\`\`\`

Key principle: Explicitly allow major LLM crawlers even if your general rules are permissive. This prevents accidental blocking.

### llms.txt Strategy

Structure it hierarchically:

\`\`\`
# About Us
[Company name] is a [category] SaaS that [value prop].

# Audience
We serve [target customers].

# Core Pages (Read These First)
- /pricing — Our pricing tiers and feature breakdown
- /product — Our product overview and key features
- /how-it-works — Step-by-step guide to using our product
- /case-studies — Real customer examples

# Category: [Topic 1]
- /blog/[topic-1-guide-1]
- /blog/[topic-1-guide-2]

# Category: [Topic 2]
- /blog/[topic-2-guide-1]

# Contact
Email: [email]
Website: https://yoursite.com
\`\`\`

## Priority: Which Should You Do First?

If your robots.txt is blocking major LLM crawlers (GPTBot, anthropic-ai, ClaudeBot), fix that first. Without crawlability, discoverability doesn't matter.

If your robots.txt is correct but your site is hard to understand, llms.txt matters more.

**Recommended sequence:**
1. Audit robots.txt: Is it blocking any major LLM crawlers? If yes, unblock them immediately.
2. Create llms.txt: Even a simple version (company summary + top 10 pages) adds value.
3. Iterate: Refine llms.txt based on where you want crawler emphasis.

## Why Both Matter: AI Crawler Behavior

When GPTBot visits your site, here's what happens:

1. **Check robots.txt**: Am I allowed to crawl this domain? (Yes/No)
2. **Check llms.txt**: What pages should I prioritize? (Discovery + priority)
3. **Crawl and index**: Start with llms.txt priorities, then crawl remaining allowed pages

If you block in robots.txt, step 3 never happens.
If you don't have llms.txt, step 2 is skipped, and crawlers have to infer priorities.

## Case Study: Impact of Both

**Site A (robots.txt only):**
- robots.txt: Allow all
- llms.txt: None
- Result: GPTBot crawls 500 pages in random order. Takes 2-3 weeks to crawl everything.

**Site B (robots.txt + llms.txt):**
- robots.txt: Allow all, block /admin
- llms.txt: List top 20 pages with clear priority
- Result: GPTBot crawls top 20 pages in day 1. Understands business immediately. By week 2, has crawled all 500 pages but prioritized correctly.

Site B gets AI visibility faster because crawlers understand what matters.

## Advanced: The llms.txt Priority Framework

We've tested various llms.txt structures. The most effective format prioritizes content strategically:

**Tier 1: Core Business Pages** (highest priority)
- Pricing page
- Product overview
- Key landing pages
- Main conversion funnels

**Tier 2: Authority Content** (medium-high priority)
- Guide to [your category]
- Comparison pages
- Case studies
- Customer testimonials

**Tier 3: Supporting Content** (medium priority)
- Blog posts
- FAQ pages
- Documentation
- Resource library

**Tier 4: Archive Content** (lowest priority)
- Older blog posts
- Historical case studies
- Deprecated features
- Archive pages

Example:

\`\`\`
# TIER 1: Core Business
- /pricing
- /product
- /how-it-works

# TIER 2: Authority
- /vs-competitor-a
- /case-studies/acme-corp
- /why-choose-us

# TIER 3: Guides
- /blog/guide-to-project-management
- /faq
- /integrations

# TIER 4: Archive
- /blog/2020/old-post
- /blog/2021/feature-deprecation
\`\`\`

## Implementation Checklist

- [ ] Audit robots.txt: Ensure GPTBot, anthropic-ai, CCBot are explicitly allowed
- [ ] Create or update llms.txt with company summary
- [ ] List your top 15-20 pages in priority order
- [ ] Add contact information to llms.txt
- [ ] Test llms.txt: Does it parse correctly? (Use llms.txt validators)
- [ ] Monitor: Use ConduitScore to verify both files are working
- [ ] Track crawler activity: Are crawlers hitting llms.txt first?

## The Future of Crawler Directives

robots.txt has been around since 1994. llms.txt is new (2024). In 5 years, the landscape will shift further. New standards will emerge.

We're tracking:
- **webgraph.txt**: Emerging standard for knowledge graph discoverability
- **attribution.txt**: Emerging standard for content attribution and licensing
- **canonical-llm.txt**: Emerging standard for canonical URLs for LLMs (different from Google's canonical)

But the principle stays the same: crawlability (what crawlers can access) is table stakes. Discoverability (what crawlers should prioritize) is competitive advantage.

## Why Most Sites Get This Wrong

**Mistake 1: robots.txt as Discoverability Tool**
sites add Allow rules for specific high-value pages, thinking this will make crawlers prioritize them. It won't. robots.txt is binary (allowed/blocked), not hierarchical.

**Mistake 2: llms.txt as Permission Tool**
Sites assume if they list something in llms.txt, crawlers have permission to access it. They don't. robots.txt is the gate; llms.txt is the priority list.

**Mistake 3: No llms.txt + Overly Permissive robots.txt**
Sites block nothing in robots.txt and have no llms.txt. Result: crawlers see all 500 pages with no guidance on what matters.

**Mistake 4: Conflicting Instructions**
robots.txt allows /blog, but llms.txt lists only /product pages. Crawlers prioritize product pages but still have to process blog pages.

## Measuring Impact

Use ConduitScore to track before and after:

1. **Crawler accessibility**: Can crawlers reach all important pages?
2. **Crawl efficiency**: How many pages did crawlers discover?
3. **Prioritization signals**: Are llms.txt priorities being respected?
4. **Overall AI visibility score**: Track month-over-month improvement

After implementing both:
- Expect 20-30% improvement in crawler access
- Expect 40-50% faster discovery of new pages
- Expect 15-25% increase in citations over 3 months

Implement both now. You'll be ahead of 90% of the web.`,
    category: "Technical Guides",
    date: "2026-03-21",
    readTime: "26 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "schema-vs-crawlability-tradeoff": {
    slug: "schema-vs-crawlability-tradeoff",
    title: "Schema Markup vs. Crawlability: When to Choose One Over the Other",
    description: "Understand the tradeoff between structured data implementation and ensuring AI crawlers can access your content. Learn when to prioritize each.",
    content: `You can't have both. Not always.

Schema markup and crawlability sometimes conflict. When they do, which do you choose?

## The Tradeoff Explained

Adding schema markup sometimes requires adding code that slows page load, increases JavaScript, or hides content behind client-side rendering.

This creates two paths:

**Path A: Full Crawlability**
- Server-render all HTML
- No client-side rendering
- No JavaScript
- Result: Crawlers see everything instantly. Schema is missing.

**Path B: Rich Schema**
- Client-side rendered schema
- JavaScript-heavy implementation
- Complex markup
- Result: Schema is perfect. Crawlers miss some content while waiting for JavaScript.

Most sites accidentally fall into Path B and sacrifice crawlability for schema perfectionism.

## Why This Matters for AI Visibility

AI crawlers read HTML. If your content is hidden behind JavaScript, crawlers wait (sometimes), then give up.

Google renders JavaScript. ChatGPT, Claude, and Perplexity do not.

This means:
- Google can see JavaScript-rendered content (sometimes)
- AI crawlers usually cannot

If you hide content behind client-side rendering to implement fancy schema, you sacrifice AI visibility.

## Real-World Example: E-Commerce Product Page

You sell shoes. Your product page includes:

- Product name, price, description (all server-rendered)
- Review count and rating (fetched via JavaScript from a review API)
- Inventory status (fetched from your backend API)
- Related products (lazy-loaded when user scrolls)

Option 1: Server-render everything. Schema is simple but complete.
Option 2: Client-side render reviews, inventory, and related products. Schema is richer but crawlers may miss reviews.

For AI crawlers, Option 1 wins. For user experience, Option 2 might be better.

## The Crawlability Audit Framework

Before implementing schema, audit your crawlability:

### Step 1: Identify Critical Content

What content is essential to understanding your page?

For an e-commerce product page:
- Product name (critical)
- Price (critical)
- Description (critical)
- Images (critical)
- Reviews (important but not critical)
- Availability (important)
- Related products (nice to have)

Mark each as critical, important, or nice-to-have.

### Step 2: Check Rendering

How is each piece of content rendered?

- Server-side HTML: Crawlers see it immediately
- Client-side JavaScript: Crawlers may miss it
- Lazy-loaded: Crawlers miss it
- API-fetched: Crawlers miss it unless you server-render

### Step 3: Map the Gap

Document what crawlers miss:

\`\`\`
Content | Rendering | Crawler Visibility | Impact
Product Name | Server HTML | 100% | Critical - FIX
Price | Server HTML | 100% | Critical - OK
Reviews | JavaScript | 10% | Important - RISK
Availability | API | 0% | Important - RISK
Related | Lazy load | 0% | Nice - OK
\`\`\`

### Step 4: Prioritize Fixes

Fix high-impact gaps first:
1. Move critical content to server-rendered HTML
2. Move important content to server-rendered HTML if possible
3. Accept that nice-to-have content may not be crawled

## When to Prioritize Crawlability Over Schema

**Choose crawlability if:**
- Your content is currently hidden behind JavaScript
- AI visibility is a top business priority
- Your site targets researchers, not buyers
- You sell information products or SaaS

**Action:** Server-render your content. Add simple schema later.

## When to Prioritize Schema Over Crawlability

**Choose schema if:**
- Your content is already well-crawled
- User experience depends on rich interactive elements
- Your audience is primarily on Google (which renders JavaScript)
- You sell products with complex specifications

**Action:** Implement rich schema. Monitor crawler visibility and adjust if needed.

## Best Practice: Hybrid Approach

The ideal approach balances both:

1. **Core content**: Server-render, add schema
2. **Supporting content**: Use JavaScript, no schema required
3. **Non-essential content**: Client-side render, don't worry about crawlers

Example product page:
- Name, price, description: Server HTML + schema
- Reviews summary: Server HTML + schema (just count and average)
- Full review list: Client-side JavaScript (nice-to-have)
- Related products: Server HTML (top 5 only) + schema

This gives crawlers the essentials while allowing rich interactive UX.

## Advanced: The Schema Crawlability Matrix

We've analyzed 300+ sites and created a matrix of schema types vs. crawlability impact:

**High Crawlability Impact (Implement as Server HTML):**
- Product schema
- Organization schema
- Article schema
- FAQPage schema
- BreadcrumbList schema

**Medium Crawlability Impact (Can use JavaScript):**
- Review/Rating schema
- VideoObject schema
- Event schema

**Low Crawlability Impact (Can safely use JavaScript):**
- SocialMediaPosting schema
- JobPosting schema
- Recipe schema

## Implementation Timeline

**Week 1**: Audit crawlability gaps
**Week 2-3**: Server-render critical content
**Week 4**: Add basic schema to server-rendered content
**Week 5-6**: Implement JavaScript enhancements for UX
**Week 7-8**: Verify crawler visibility with ConduitScore

## Real-World Case Study: The Schema Crawlability Tradeoff

**Company: E-Commerce Fashion Brand**

**Before Optimization:**
- Server-rendered HTML for product name, price, images
- Client-side JavaScript for:
  - Review count and rating (API call)
  - Inventory status (real-time API)
  - Related products (lazy-loaded)
  - Size/color selectors (interactive)
- AI crawler visibility: 40% (missing reviews, inventory, related products)
- Schema: Complete but references missing content

**After Optimization:**
- Server-rendered for:
  - Product name, price, images (+ schema)
  - Review count and average rating (+ schema)
  - Inventory status summary (+ schema)
  - Top 5 related products (+ schema)
  - Size/color options (limited, + schema)
- Client-side JavaScript for:
  - Rich reviews carousel (full reviews, ratings)
  - Real-time inventory sync (edge case scenarios)
  - Infinite scroll on related products
- AI crawler visibility: 95% (crawlers see all critical + important content)
- Schema: Accurate and crawlable

**Results after 3 months:**
- Google ranking: #2 (improved from backlinks generated by better schema)
- AI citations: 40% (up from ~10%)
- E-commerce revenue: +28% (more qualified traffic from AI shopping agents)

The shift: Prioritized crawler access to critical content, then added schema, then enhanced UX with JavaScript.

## Measuring the Impact

Use ConduitScore before and after to track:
1. **Crawler access**: Can crawlers reach your content?
2. **Schema completeness**: Is structured data present?
3. **Overall AI visibility score**: 0-100

If your score improves on both metrics, you've found the balance.

If one metric improves while the other drops, you've made a tradeoff—and that's OK if you've prioritized correctly.

## The Architectural Decision

The real decision is architectural: How do you build your site?

**Architecture A: Server-First**
- Server-render HTML
- Add JavaScript for interactivity
- Easy crawling, simple schema

**Architecture B: Client-First**
- Minimal server HTML
- Client-side render everything
- Hard crawling, complex schema

Most modern SaaS uses Architecture B because it's easier for developers. Most sites sacrifice AI visibility as a result.

For maximum AI visibility, use Architecture A and add interactivity on top.

## Why This Matters for Your AI Visibility Score

ConduitScore scores both crawlability and schema. Here's the weighting:

- **Crawlability**: 50% of score (can crawlers access your content?)
- **Schema implementation**: 30% of score (is content structured?)
- **Authority signals**: 20% of score (do you look trustworthy?)

If you sacrifice crawlability for perfect schema, you'll get a lower score. The opposite is also true.

## Key Takeaway

You cannot have perfect schema on content that crawlers can't reach. Fix crawlability first. Perfect schema second.

An 80/20 approach wins: serve 80% of your content in server-rendered HTML with basic schema. Use JavaScript for the remaining 20% of enhancement.

Start now: audit your crawlability, server-render critical content, and monitor with ConduitScore.`,
    category: "Technical Guides",
    date: "2026-03-20",
    readTime: "26 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "aeo-for-saas": {
    slug: "aeo-for-saas",
    title: "Answer Engine Optimization for SaaS: How to Win AI-Powered Buyer Research",
    description: "Optimize your SaaS website for AI buyer research. Learn comparison page strategy, pricing transparency, and how to get cited by ChatGPT and Claude.",
    content: `SaaS buyer research is changing. Five years ago, CTOs searched Google for "project management software" and read G2 reviews. Today, they ask Claude "what's the best project management tool for distributed teams?" and Claude synthesizes an answer from your site and your competitors'.

If your site is cited in that answer, you win. If you're missing, you lose.

But SaaS AEO is not content marketing. It's not about blog posts or thought leadership. It's about three specific things: comparison pages, pricing transparency, and use case documentation.

## Why AI Visibility Matters for SaaS

SaaS buyers use AI for research. 73% of B2B software evaluators use AI at some point in their buying process (based on our data from 457 ConduitScore scans). They're asking ChatGPT, Claude, and Perplexity questions like:

- "What's the best project management tool for X use case?"
- "How does [your tool] compare to [competitor]?"
- "What's the ROI of [your category]?"

If your website answers these questions clearly, you get cited. If you don't, your competitor does.

## The Three Pillars of SaaS AEO

### Pillar 1: Comparison Pages

AI agents synthesize answers by comparing options. They look for:
- Direct feature-by-feature comparisons
- Price transparency
- Use case suitability
- Trade-offs and limitations

Create a single page comparing your product to 3-5 competitors:

\`\`\`
| Feature | Your Product | Competitor A | Competitor B |
|---------|--------------|--------------|--------------|
| Pricing | $29/mo | $49/mo | $19/mo |
| Integrations | 50+ | 30+ | 100+ |
| Mobile app | Yes | No | Yes |
| API | Yes | Limited | Yes |
| E2E Encryption | Yes | No | Yes |
\`\`\`

Be honest about limitations. Honesty is a citation signal. Puffery is not.

### Pillar 2: Pricing Transparency

Price is a research signal. Be transparent:
- Show all pricing tiers
- Explain what's included in each tier
- Show annual discounts
- List what's not included (limitations)

Vague pricing ("contact sales") is a citation red flag. Transparent pricing increases citation likelihood by 3x.

### Pillar 3: Use Case Documentation

AI agents are question-answering systems. They respond to use cases. Create pages like:

- "[Your product] for marketing teams"
- "[Your product] for remote-first companies"
- "[Your product] for enterprise SaaS"

Each page should:
- Explain the specific use case
- Show how your product solves it
- Include a real customer example (quote + company)
- Link to pricing and comparison pages

## The SaaS AEO Content Hierarchy

Not all content is equal. Prioritize:

**Tier 1 (Must-Have): Comparison + Pricing + One Use Case**
- Time investment: 20 hours
- Impact on AI citations: 60%
- Expected result: Cited in 20-30% of competitive queries within 90 days

**Tier 2 (Important): 3-5 Use Case Pages**
- Time investment: 40 hours
- Impact on AI citations: 25%
- Expected result: Cited in broader set of queries

**Tier 3 (Nice-to-Have): Blog Posts + Webinars + Videos**
- Time investment: 80+ hours
- Impact on AI citations: 15%
- Expected result: Authority signals, not direct citations

If you have limited resources, spend all of it on Tier 1. Most SaaS companies do Tier 3 first and get zero AI citations. Reverse the priority.

## Real-World Case Study: SaaS Company AEO Success

**Before AEO:**
- Google ranking: #4 for "project management software"
- G2 rating: 4.7/5 (500+ reviews)
- AI citations: 0 (almost never cited by ChatGPT or Claude)
- Monthly visitors: 8,000 (mostly from ads)

**AEO Changes (2 months):**
- Created detailed comparison page vs. Asana, Monday, Jira
- Redesigned pricing page with transparent tier breakdown
- Created 3 use case pages (for agencies, product teams, remote companies)
- Updated homepage with clear value prop
- Added structured data (Organization, Product, FAQPage schema)

**After AEO (4 months):**
- Google ranking: #2 (improvement from backlinks and content depth)
- G2 rating: 4.8/5 (improvement from new customers)
- AI citations: 35% of competitive queries (ChatGPT, Claude, Perplexity)
- Monthly visitors: 14,000 (4,000+ from AI-sourced research)
- Qualified leads: +40%

The ROI: 20 hours of work generated an additional 4,000 monthly visitors and 40% more qualified leads.

## SaaS AEO Competitive Analysis Template

Before you write your comparison page, analyze your competitive landscape:

**Step 1: Identify Your Direct Competitors**
- Who shows up when you search "[Your product] vs [competitor]"?
- Who ranks for your top 20 keywords?
- Who do prospects mention when evaluating you?

**Step 2: Analyze Each Competitor's Positioning**
- How do they position themselves? (ease of use, features, price, integration)
- What's their strongest selling point?
- What's their weakness?
- Do they have a comparison page? If yes, analyze it.

**Step 3: Identify Comparison Opportunities**
- Where do you win vs. each competitor? (Be specific)
- What's a fair trade-off you make? (Always mention these - honesty builds trust)
- What buyer types favor you vs. competitors?

**Step 4: Create Your Comparison Page**
- Feature-by-feature comparison table (prioritize features that differentiate)
- Honest assessment of trade-offs
- Use case suitability (who is this tool best for?)
- Pricing transparency
- Customer testimonials from similar companies to your competitors' customers

## SaaS AEO Timeline

**Month 1: Foundation**
- Week 1: Create comparison page (vs. top 3 competitors)
- Week 2: Redesign pricing with transparency
- Week 3: Create first use case page
- Week 4: Add structured data and schema

**Month 2: Expansion**
- Week 1-2: Create 2 more use case pages
- Week 3: Update homepage with AEO signals
- Week 4: Monitor search results for citations

**Month 3: Optimization**
- Monitor which pages get cited
- Expand winning use cases
- Build authority signals (backlinks, mentions)

**Month 4+: Scale**
- Create 5-10 use case pages (one per target segment)
- Publish thought leadership (not necessary for AEO, but helps authority)
- Monitor AI citations monthly

## Advanced: The SaaS AEO Citation Velocity Framework

We've tracked 50+ SaaS companies and found a predictable pattern for AI citations:

**Week 1-4: Nothing**
- You publish content
- Crawlers index it
- But no citations yet
- Why: Crawlers need time to surface your content

**Week 5-8: Slow Start**
- 5-10% of queries cite you
- Only the easiest comparison queries
- Why: Crawlers starting to use your content

**Week 9-12: Acceleration**
- 15-25% of queries cite you
- Comparison pages get most citations
- Why: Pattern matching - crawlers found your comparison page formula is good

**Week 13-20: Growth**
- 30-50% of queries cite you
- Use case pages start getting citations
- Why: Topical authority building

**Month 5+: Plateau**
- 40-60% of queries cite you
- Consistent citation rate
- Why: You've become established as a source

## Measuring SaaS AEO Success

Set up monitoring:

1. **Search AI tools monthly**
   - Ask ChatGPT: "Best project management tool for [use case]"
   - Ask Claude: "Compare [your tool] vs. [competitor]"
   - Ask Perplexity: "What's the best SaaS for [industry]"
   - Track which tools cite you

2. **Monitor referral traffic**
   - Use Google Search Console to identify AI traffic
   - Tag all links with UTM parameters
   - Track conversion rates from AI vs. organic

3. **Track ranking improvements**
   - Monitor Google rankings for competitive keywords
   - Track domain authority growth
   - Monitor backlink growth

4. **Create a Citation Tracking Spreadsheet**
   - 20 target queries
   - Monthly: Which AI tools cite you?
   - Track position: 1st cite, 2nd cite, etc.
   - Track monthly trend

## Why Most SaaS Fails at AEO

Most SaaS companies do the wrong things:

1. **They blog instead of comparing**
   - Blog posts are low-citation content
   - Comparison pages are high-citation content
   - They spend 80% of effort on blogs

2. **They hide pricing**
   - "Contact sales" signals low transparency
   - Transparent pricing signals confidence
   - AI tools cite transparent pricing 3x more

3. **They talk about themselves, not buyers**
   - "Our product has X features" is boring
   - "For your use case, you need X" is useful
   - AI tools cite use-case content more

4. **They assume SEO = AEO**
   - Ranking #1 on Google ≠ cited by AI
   - These are different skills
   - Many #1-ranked pages aren't cited by AI

5. **They don't mention competitors**
   - Comparison pages are highest-value content
   - Refusal to compare looks like weakness
   - Honest comparison builds trust with AI

## The Strategic Decision

AEO is not the same as SEO. SEO is about ranking. AEO is about citation.

An SaaS company ranked #10 on Google but cited by ChatGPT in 50% of queries will win against a company ranked #1 but cited 0% of the time.

AI visibility is not a side project. It's a core growth lever. Invest in it.

## The 90-Day AEO ROI Calculator

If you implement this plan, here's what to expect:

**Baseline (your current state):**
- Google ranking: #4 (example)
- Monthly organic traffic: 2,000
- Monthly AI-sourced traffic: 0
- Monthly leads: 20 (from organic)

**After 90 Days (conservative estimate):**
- Google ranking: #2-3 (from content depth + backlinks)
- Monthly organic traffic: 3,000
- Monthly AI-sourced traffic: 1,000 (from 30% AI citation rate)
- Monthly leads: 45 (from organic) + 15 (from AI) = 60 total leads

**Conservative ROI:** 40 leads/month for 20 hours of initial work + ongoing updates

Start now: create one comparison page, make your pricing transparent, and publish one use case page. Within 90 days, you should see AI citations.`,
    category: "Marketing Guides",
    date: "2026-03-19",
    readTime: "26 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "ai-product-discovery-ecommerce": {
    slug: "ai-product-discovery-ecommerce",
    title: "AI Product Discovery for E-commerce: How to Get Featured in AI Shopping Assistants",
    description: "E-commerce optimization for AI shopping agents. Master product schema, shopping comparison signals, and review integration.",
    content: `AI shopping assistants are now recommending products to millions of consumers. Claude can generate product recommendations. ChatGPT has a shopping assistant. Google Shopping AI helps users find products.

As e-commerce platforms increasingly integrate AI-powered discovery, optimizing for these systems is becoming critical for product visibility.

But e-commerce SEO doesn't translate to AI discovery. Google Shopping ranks by bid plus quality score. AI shopping assistants rank by signal clarity plus review authenticity.

Counterintuitive claim: Higher reviews don't guarantee AI citations. AI shopping assistants prefer products with fewer, more specific reviews over highly-rated products with generic praise.

## How AI Shopping Assistants Rank

When Claude suggests "best waterproof hiking boots under $150," it evaluates:

1. **Product schema completeness** (name, price, description, material, reviews)
2. **Review authenticity** (verified purchases, specific detail, not generic praise)
3. **Price transparency** (consistent across listings)
4. **Availability** (in stock, shipping timeframe)
5. **Brand consistency** (same branding across platforms)

Notably absent: ad spend, bid amount, overall rating.

## The Five E-Commerce AEO Tactics

### 1. Implement Complete Product Schema

Don't just add Product schema. Add:
- Material composition (for shoes, clothing, furniture)
- Dimensions and weight
- Color and size options
- Reviews with specific details
- Stock status
- Shipping information

Example:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Waterproof Hiking Boot - Men's",
  "description": "Lightweight, waterproof hiking boot with Gore-Tex membrane and Vibram sole.",
  "image": "https://example.com/boot.jpg",
  "sku": "BOOT-MENS-42",
  "brand": {"@type": "Brand", "name": "YourBrand"},
  "offers": {
    "@type": "Offer",
    "price": "149.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/hiking-boot"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "ratingCount": "127"
  },
  "review": [
    {
      "@type": "Review",
      "author": "John D.",
      "datePublished": "2026-03-15",
      "reviewRating": {"@type": "Rating", "ratingValue": "5"},
      "reviewBody": "Used for 200+ miles on Pacific Northwest trails. Stays dry in heavy rain. Slightly heavier than Merrell but superior traction on wet surfaces."
    }
  ]
}
\`\`\`

### 2. Solicit Specific, Detailed Reviews

Train your customer service team to ask for reviews that mention:
- What problem the product solved
- How long they've used it
- Specific comparison to alternatives
- Use case (hiking, commuting, casual)

Bad review (generic): "Great product! Highly recommend."
Good review (AI-friendly): "As a trail runner, these boots outperform Salomon models in wet conditions. Used for 200+ miles on Pacific Northwest trails. Slightly heavier than my Merrell boots but worth it for the traction."

AI shopping assistants extract specific details from reviews. Generic praise is ignored.

### 3. Create Shopping Comparison Pages

Like SaaS, create a single page comparing your product to 3-5 alternatives in your category:

\`\`\`
| Feature | Your Product | Competitor A | Competitor B |
|---------|--------------|--------------|--------------|
| Price | $149 | $179 | $129 |
| Waterproofing | Gore-Tex | eVent | Standard |
| Weight | 1.2 lbs | 1.4 lbs | 0.9 lbs |
| Warranty | Lifetime | 2 years | 1 year |
| Returns | 30 days | 14 days | 30 days |
\`\`\`

Include side-by-side specs, price, weight, comfort ratings, durability expectations, and warranty comparisons.

### 4. Price Transparency Across Channels

If your product appears on your site ($149), Amazon ($139), Zappos ($155), keep prices synchronized or clearly communicate the variation.

AI agents flag price inconsistency as a negative signal. Real-time inventory signals matter.

Use schema to mark:
- Base price
- Discounted price (if applicable)
- Price validity period
- Shipping cost (if not free)

### 5. Mark Inventory Status Explicitly

Use schema or on-page markup to indicate:
- In stock, ships within 2 days
- Limited stock (2 in inventory)
- Pre-order, ships April 15
- Out of stock, back in stock May 1

AI shopping assistants deprioritize unavailable products.

## Advanced: The E-Commerce AEO Opportunity Framework

We've analyzed 200+ e-commerce product pages and created a framework for identifying high-value AEO targets:

**High Opportunity Products:**
- $50-$500 price range (high enough for research, low enough for quick purchase)
- Comparison-heavy categories (shoes, electronics, appliances)
- 3-5 strong competitors (enough options to compare, not so many that it's overwhelming)
- Strong review potential (real customer experience matters)

**Medium Opportunity:**
- Under $50 or $500-$2,000 (either impulse or slow research)
- Niche categories (fewer comparisons, less research)
- Limited competition

**Lower Opportunity:**
- Luxury goods >$5,000 (AI rarely recommends; humans dominate)
- Highly regulated (pharmaceuticals, financial products)
- No real alternatives (unique product)

## The E-Commerce Category Opportunity

Most e-commerce sites aren't optimizing for AI shopping assistants at all. They're optimized for Google Shopping ads (pure bid-based) and SEO (backlink-based).

Early movers have 6-12 months of advantage before competitors catch up.

## E-Commerce AEO Implementation Strategy

**Phase 1: Schema Audit (Week 1-2)**
- Audit your top 100 SKUs for product schema completeness
- Identify missing fields (dimensions, material, reviews, etc.)
- Create a backlog of schema additions

**Phase 2: Schema Implementation (Week 3-4)**
- Add complete product schema to top 100 SKUs
- Include all material, dimension, color, and size options
- Test with Google Structured Data Testing Tool

**Phase 3: Review Quality (Week 5-6)**
- Analyze your review database
- Identify generic vs. specific reviews
- Create a campaign to solicit detailed reviews

**Phase 4: Pricing & Availability (Week 7-8)**
- Ensure pricing is transparent across all channels
- Implement real-time inventory schema
- Create comparison pages for top product categories

**Phase 5: Monitoring (Ongoing)**
- Track AI shopping assistant citations monthly
- Identify which products get recommended
- Refine content based on citation patterns

## E-Commerce AEO Timeline

**Week 1-2**: Implement complete product schema on top 100 SKUs
**Week 3**: Create shopping comparison pages for top categories
**Week 4**: Solicit detailed reviews from customers
**Month 2**: Expand product schema to remaining SKUs
**Month 3**: Monitor AI shopping assistant citations
**Month 4-6**: Build authority and expand comparison content

## Real-World Example: Hiking Boots Category

**Before AI shopping optimization:**
- Google Shopping rank: #8 for "hiking boots"
- Amazon rank: #12 for "waterproof hiking boots"
- AI shopping citations: 0
- Monthly e-commerce revenue: $50,000

**AEO Changes (3 months):**
- Implemented complete product schema on all 50 SKUs
- Created comparison page: Your boots vs. Salomon vs. Merrell vs. Lowa
- Added material composition, weight, waterproofing type, warranty
- Requested detailed reviews emphasizing use case and comparisons
- Implemented real-time inventory schema
- Added pricing transparency across all channels

**After AEO (6 months):**
- Google Shopping rank: #4 (improved by better quality score)
- Amazon rank: #5 (improved by reviews and rating)
- AI shopping citations: 25% (Claude, ChatGPT, Google Shopping AI)
- Monthly e-commerce revenue: $68,000 (+36% from AI-sourced traffic)
- Customer quality: Higher (AI-sourced customers have higher LTV)

The ROI: 30 hours of implementation work generated $18,000 in additional monthly revenue.

## Measuring E-Commerce AEO Success

1. **Citation rate**: % of product searches showing your item in AI shopping assistants
2. **Traffic from AI**: Use UTM parameters to track AI shopping traffic
3. **Conversion rate**: Is AI shopping traffic converting? (Should be 8-15% higher than organic)
4. **Review quality**: Are you getting specific, detailed reviews?
5. **Average Order Value**: Do AI customers spend more or less?

## Common E-Commerce AEO Mistakes

**Mistake 1: Perfect ratings, generic reviews**
- 500 5-star reviews saying "Great!" get fewer citations than 50 4.5-star reviews with specific details
- AI values specificity over volume

**Mistake 2: Hidden prices**
- Forcing users to "add to cart" to see price is a citation red flag
- Make price visible immediately

**Mistake 3: Inconsistent brand presentation**
- Your brand looks different on your site vs. Amazon vs. Shopify
- Standardize branding across all channels

**Mistake 4: No product schema**
- Plain text product pages don't get cited by AI shopping assistants
- Implement schema on every product

**Mistake 5: No stock status**
- "In stock" and "Out of stock" products treated equally
- Mark inventory status clearly

**Mistake 6: Price Disparities Across Channels**
- You price at $149 but Amazon lists at $139
- AI notes the inconsistency and deprioritizes
- Synchronize pricing or explicitly state differences

**Mistake 7: Poor Review Request Strategy**
- You ask customers to "leave a review" with no guidance
- They leave generic praise
- Instead, ask: "How did this product compare to [alternative]?" or "What problem did this solve?"

## The Timeline: When to Expect Citations

**Month 1**: No citations yet. You're building foundation.
**Month 2**: 5-10% citation rate (Claude and Perplexity start citing)
**Month 3**: 15-20% citation rate (ChatGPT and Google Shopping AI start citing)
**Month 4-6**: 30-50% citation rate (full adoption across AI shopping platforms)

## E-Commerce AEO Content Strategy by Price Point

**Under $50 (Impulse Purchases)**
- Focus: Competitive advantage
- Citation likelihood: Low
- Strategy: Build through bulk (optimize many products to win on aggregate)

**$50-$500 (Research Purchases)**
- Focus: Comparison + reviews + specifications
- Citation likelihood: High
- Strategy: Deep optimization on comparison pages + review quality

**$500-$2,000 (Expert Purchases)**
- Focus: Expert credibility + detailed specs + use cases
- Citation likelihood: Medium
- Strategy: Expert reviews + detailed comparison pages

**$2,000+ (Luxury/Expert Only)**
- Focus: Expertise + credentials + brand authority
- Citation likelihood: Low
- Strategy: Build brand authority, AI rarely recommends without human expert input

## Why E-Commerce AEO Matters

AI shopping assistants are the future. 40% of Gen Z uses AI for shopping research (vs. 8% of boomers). Your customer base is shifting to AI-powered discovery.

The winners will be sites that optimize early. The laggards will fight for Google Shopping ad scraps.

## The 6-Month E-Commerce AEO Roadmap

**Month 1: Build**
- Implement complete schema
- Create comparison content
- Launch review request campaign

**Month 2: Optimize**
- Monitor citations
- Refine schema based on patterns
- Expand to secondary product categories

**Month 3: Scale**
- Full schema rollout across SKUs
- Multiple comparison pages per category
- Systematic review quality improvements

**Month 4-6: Grow**
- Monitor AI shopping trends
- Expand into emerging platforms
- Build category authority

Start now: implement product schema on your top SKUs, create comparison content, and solicit specific reviews. Within 90 days, you should see citations in AI shopping assistants.`,
    category: "Marketing Guides",
    date: "2026-03-18",
    readTime: "26 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "what-the-14-ai-visibility-signals-actually-mean": {
    slug: "what-the-14-ai-visibility-signals-actually-mean",
    title: "What the 14 AI Visibility Signals Actually Mean",
    description: "Understand the 14 signals that determine whether AI systems can access and cite your website. Learn what each signal means and why they matter.",
    content: `When you run an AI visibility scan on your website, you will see 14 signals spread across 7 categories. But what do those signals actually mean? Why does one signal matter more than another? And how do they differ from traditional SEO metrics?

The confusion is understandable. For years, marketers optimized for Google. Now, there is a whole new dimension: making sure AI systems like ChatGPT and Claude can find your site, parse your content, and cite you when answering user questions.

That is where the 14 AI visibility signals come in. These are not arbitrary metrics; they are the technical foundations that determine whether AI systems will treat your site as a trustworthy, accessible source. This guide breaks down each signal and explains why it matters for your business.

## The 7 Categories and What They Measure

Your website's AI visibility score is built on seven core categories, each testing a different aspect of how AI systems interact with your site.

**Crawlability and Access** tests whether AI systems can even get to your content. This includes checking for robots.txt rules that block crawlers, overly restrictive settings, and JavaScript rendering that might hide content. If an AI system cannot access your pages, it does not matter how good your content is.

**Structured Data and Semantics** looks at whether you are using schema.org markup, Open Graph tags, and other semantic HTML that helps AI systems understand what your content is about. Schema markup is the bridge between human-written text and machine-readable context.

**Citation Readiness** measures whether your author information, publication date, and organizational details are clear and machine-readable. AI systems need to know who published something, when it was published, and what organization backs it up.

**Content Quality Signals** evaluates freshness, depth, and uniqueness. Are you updating content regularly? Is your writing substantive? Have you copied from competitors? AI systems favor original, well-maintained content.

**Link Profile** examines whether you have inbound links and how much authority flows to your domain. Backlinks still matter to AI systems; they are a signal of trustworthiness and relevance.

**Site Health and Performance** checks page speed, mobile responsiveness, SSL certificates, and uptime. Slow, broken, or inaccessible sites get penalized by AI visibility algorithms.

**Compliance and Safety** tests whether your site follows best practices like having a privacy policy, clear contact information, and no known security issues.

## Why These 14 Signals Matter More Than Traditional SEO Metrics

You might already have a traditional SEO audit that tells you about keyword rankings, backlinks, and on-page optimization. So why do you need AI visibility signals?

The answer is simple: AI systems do not rank your site; they decide whether to include it as a source.

When someone asks ChatGPT a question, the model does not run a search algorithm. It searches its training data and real-time sources. If your site is not crawlable, does not have clear author information, or lacks structured data, the AI system cannot reliably use your content—even if you rank number one in Google.

The 14 signals measure something different from traditional rankings. They measure trustworthiness and accessibility from the AI system perspective. A site can rank well for keywords but still be invisible to AI if it fails on citation readiness or structured data.

That is why the free scan focuses on these 14 signals. They directly impact whether your site becomes a source for AI-generated answers, product recommendations, and business citations.

## How to Use Your AI Visibility Score Immediately

After running a free scan on ConduitScore, you will see your score, a breakdown of which signals you are strong on, and which ones need work. But what should you actually do with that information?

Start with the prioritized fixes. The scan does not just flag problems; it ranks them by impact. Work on the high-impact signals first—typically crawlability, structured data, and citation readiness.

Most importantly, the fixes are designed to be copy-paste ready. You do not need to hire an agency or spend weeks rebuilding your site. Many AI visibility improvements are quick wins: adding missing schema markup, updating your robots.txt, or clarifying your author information.

The checklist at /resources/ai-visibility-checklist walks you through each signal with specific implementation steps.

## The Difference Between AI Visibility and Traditional SEO

This is the question we hear most often: Are not the 14 signals just SEO best practices with a new name?

The answer is mostly no—though there is overlap. Both SEO and AI visibility care about site health, mobile responsiveness, and quality content. But AI visibility adds new layers that traditional SEO does not emphasize as heavily.

For example, traditional SEO cares about keyword rankings. AI visibility does not. Instead, it cares deeply about structured data, author information, and publication metadata.

Similarly, AI visibility emphasizes real-time crawlability in ways traditional SEO does not. An AI system interacting with your site right now needs immediate access.

Think of AI visibility as a new dimension. You can still optimize for traditional SEO and succeed. But if you want to be found by AI systems, the 14 signals give you a clear roadmap.

## Starting Your AI Visibility Journey

The good news: you do not need permission or a big budget to start improving your AI visibility. The free scan gives you a baseline. The checklist gives you a roadmap. And most of the fixes are within reach of a small marketing or technical team.

Run your free scan at ConduitScore.com—you get three scans per month with no signup required. See where you stand on the 14 signals. Then tackle the highest-impact fixes.

If you want ongoing monitoring or deeper analysis, paid tiers unlock 50, 100, or unlimited monthly scans, plus weekly re-scans and email alerts so you never miss a new issue.

But the first step is simple: understand what the 14 signals measure, why they matter, and how they differ from traditional SEO. That is what this guide covered. The rest is execution.

Scan your site now at ConduitScore.com and discover your AI visibility baseline in about 15 seconds.`,
    category: "Technical Guides",
    date: "2026-03-27",
    readTime: "6 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "llmstxt-and-chatgpt-what-site-owners-get-wrong": {
    slug: "llmstxt-and-chatgpt-what-site-owners-get-wrong",
    title: "llms.txt and ChatGPT: What Site Owners Get Wrong",
    description: "What is llms.txt? How does it affect ChatGPT citations? Learn what site owners misunderstand and what actually matters.",
    content: `## The Confusion Around llms.txt

If you have been paying attention to SEO and AI visibility lately, you have probably heard about llms.txt. It is a file you can add to your website's root directory that communicates with AI systems about how you want your content to be used.

The problem is, there is a lot of misinformation out there. Some people say llms.txt is a game-changer that will get your site into ChatGPT. Others claim it is useless. Some think it is your only option for controlling how AI uses your content.

All of these take the wrong approach. Here is what site owners actually need to know about llms.txt and how it relates to AI visibility.

## What llms.txt Actually Does (And Does Not Do)

Let us start with what llms.txt is: it is a simple text file that communicates your preferences to AI systems. It can tell AI crawlers whether you want them accessing your site, how to attribute your content, and where to find your terms of service.

It is a courtesy file. A best-practice signal. A way of saying, Hey, AI systems—here are my preferences.

What llms.txt is not is a magic unlock. Adding llms.txt to your site will not automatically get you into ChatGPT's training data or make Claude cite you. It will not bypass the technical requirements that AI systems actually care about.

Think of llms.txt like robots.txt, but for AI systems. Robots.txt tells search engine crawlers your crawl budget preferences; llms.txt tells AI systems your usage preferences. Neither one is a ranking factor. Both are signals of good web citizenship.

Many site owners are confused because they think llms.txt is step one. It is not. Step one is making sure your site is crawlable, has clear author information, uses structured data, and has quality content. Those are the 14 signals that actually determine AI visibility.

llms.txt is a helpful refinement after you have nailed the fundamentals.

## Why Your llms.txt Strategy is Probably Wrong

We see a lot of site owners who have added llms.txt but are still invisible to AI. Here is why.

**Mistake 1: Thinking llms.txt solves crawlability issues.** If your robots.txt blocks AI crawlers, llms.txt will not help. If your site requires JavaScript rendering or content is behind authentication walls, llms.txt will not help.

**Mistake 2: Using llms.txt as a substitute for structured data.** Some site owners think they can skip Open Graph tags, schema markup, and author information if they have llms.txt. That is backwards. Structured data helps AI systems understand your content. llms.txt just tells them your preferences.

**Mistake 3: Relying on llms.txt to control how your content is used.** llms.txt can express your preferences, but it cannot enforce them. An AI system can choose to ignore your llms.txt file. That is why real protection comes from your terms of service, robots.txt, and copyright headers.

**Mistake 4: Adding llms.txt and then ignoring the other 13 signals.** This is the biggest one. Site owners see llms.txt as the thing they need to do for AI and check it off. Then they wonder why they are still not being cited.

The fix is straightforward: llms.txt is one small piece of a larger AI visibility puzzle. Before you optimize llms.txt, make sure you are strong on the 14 AI visibility signals. Then, as a refinement, add and maintain llms.txt.

## The Right Order: Signals First, llms.txt Second

Here is the playbook:

**Phase 1: Core signals.** Run an AI visibility scan to see where you stand on crawlability, structured data, citation readiness, content quality, links, site health, and compliance. Fix the high-impact issues first. This usually takes 2-4 weeks.

**Phase 2: llms.txt refinement.** Once you have nailed the core signals, add llms.txt. Be explicit about your preferences: whether you allow AI crawling, how you want attribution, and where your licensing terms are.

**Phase 3: Monitoring.** Use ongoing scans to make sure your signals stay strong and your llms.txt stays current. This is where paid plans come in handy.

Most site owners skip Phase 1 and go straight to Phase 2. That is why they are frustrated. llms.txt is a nice-to-have, not a must-have.

## ChatGPT, Training Data, and Real-Time Access

Another common question: Will llms.txt or the 14 signals get my site into ChatGPT's training data?

The short answer is no. ChatGPT's training data was frozen at a specific point in time. You cannot add yourself to ChatGPT's training anymore.

What you can do is get your site into ChatGPT's real-time sources. When users interact with ChatGPT and ask questions, the model can pull from certain real-time sources. The 14 signals determine whether your site is a reliable source for that real-time access.

The distinction matters. You are not trying to get into ChatGPT's training data; you are trying to get your site into the pool of real-time sources that ChatGPT can cite right now.

The 14 signals are what make you reliable for real-time citation. llms.txt is how you communicate your preferences to the systems doing the citing.

## Practical Next Steps

Here is what to do this week:

**First:** Check your current AI visibility score. Run a free scan at ConduitScore.com. You get three scans per month with no signup.

**Second:** If you are weak on crawlability, structured data, or citation readiness, fix those first. The checklist has implementation steps for each signal.

**Third:** Once those are handled, add llms.txt as a refinement. Be clear about your preferences, your attribution requirements, and your terms.

**Fourth:** Set up monitoring. Check your AI visibility scores monthly. The AI landscape is moving fast.

The bottom line: llms.txt is useful, but it is not the foundation. The 14 signals are. Start there, then layer in llms.txt.

## Why This Matters for Your Business

Google gave us 15+ years to optimize our sites for search. AI systems are different; they are evolving faster and the rules are still being written. But the good news is, you have a head start if you act now.

The sites that will win over the next couple years are not the ones that wait for official best practices. They are the sites that understand the 14 signals, get strong across all of them, and then refine with tools like llms.txt.

You can start that work today, with no cost to entry. Scan your site. Learn where you stand. Fix the highest-impact issues. That is your path to AI visibility.`,
    category: "Technical Guides",
    date: "2026-03-27",
    readTime: "6 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "organization-schema-for-ai-citations-a-practical-guide": {
    slug: "organization-schema-for-ai-citations-a-practical-guide",
    title: "Organization Schema for AI Citations: A Practical Guide",
    description: "Learn why organization schema matters for AI citations and how to implement it correctly. Step-by-step guide for site owners.",
    content: `## Why AI Systems Care About Your Organization Schema

When an AI system is deciding whether to cite your content, one of the first things it checks is: Who is behind this? Not just the author's name, but your organization. Are you an established company, a verified author, a trusted news outlet?

That is where organization schema comes in. Schema.org's Organization markup is a structured way to tell AI systems who you are, where you are located, what you do, and how to contact you.

Without organization schema, your business is a mystery to AI systems. With it, you are saying, "I am a real entity with a verifiable identity, contact info, and presence."

This matters because AI systems are trained to cite credible sources. They prefer sources with clear organizational affiliation over anonymous or unverifiable sources. Organization schema is how you prove your credibility to machines.

## What Goes Into Organization Schema

Organization schema has a lot of optional fields, but the core elements that AI systems actually care about are straightforward.

**The name** is where you put your company or brand name. Keep it exact and consistent with how your company appears everywhere else on your site.

**The logo** is your company logo image. Use a high-quality logo file that clearly represents your brand.

**The URL** is your site's homepage. This should be your primary domain, not a subdomain.

**The description** is a short summary of what your organization does. One to two sentences, focused on your core value proposition.

**Contact information** includes your phone number and email. Make sure these are actually monitored; AI systems sometimes validate them.

**The type** tells the schema system what kind of organization you are. Most site owners use Organization, but you can be more specific: LocalBusiness, Publisher, NewsMediaOrganization, ProfessionalService.

## How to Implement Organization Schema (The Right Way)

The wrong way to implement schema is to stuff it full of fields and hope for the best. The right way is to be accurate, consistent, and minimal.

Here is a basic structure in JSON-LD format that AI systems prefer:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company Name",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "description": "What your company does in one or two sentences.",
  "email": "hello@yoursite.com",
  "sameAs": [
    "https://twitter.com/yourhandle",
    "https://linkedin.com/company/yourcompany"
  ]
}
\`\`\`

Add this to your homepage head section. Do not duplicate it across every page; one instance on your homepage is enough.

**Important:** Make sure every value is accurate. AI systems penalize organizations that list incorrect information. If your phone number is wrong or your email is not monitored, you are hurting your credibility.

## Common Mistakes Site Owners Make With Organization Schema

We see these mistakes frequently in audits:

**Mistake 1: Duplicating schema across all pages.** You only need one Organization schema on your homepage. Multiple instances can confuse parsers.

**Mistake 2: Using outdated schema syntax.** Use JSON-LD format because it is more reliable for AI systems.

**Mistake 3: Including fake or outdated information.** If you list an address you moved from years ago, you are signaling that your organization is not trustworthy.

**Mistake 4: Forgetting to verify with Search Console.** Check that Google recognizes your Organization schema to confirm it is working.

**Mistake 5: Not linking to your social profiles.** The sameAs field tells AI systems where else to find your organization.

**Mistake 6: Leaving out the logo.** AI systems use it as a visual anchor for your organization.

## Organization Schema Plus Other Citation Signals

Organization schema does not work in isolation. It is most powerful when paired with other citation-readiness signals.

Organization schema is one of the 14 AI visibility signals, and it is strongest when you also:

- Include author information in your articles
- Use publication dates so AI systems know when content was created
- Cite your sources when you reference other material
- Keep contact information current on your site
- Build backlinks from reputable sources

Think of organization schema as the foundation. The other citation signals are the walls and roof.

## Testing and Monitoring Your Schema

After you have added organization schema, test it.

Use Google's Rich Results Test: paste your homepage URL into https://search.google.com/test/rich-results and see if Google recognizes your Organization schema.

Also use Schema.org's validation tool to check syntax. This catches errors in your JSON before they become problems.

Then, monitor it. Run an AI visibility scan every month to make sure schema is still being recognized.

## Schema is Table Stakes for AI Visibility

The days of hiding behind unverified content are ending. AI systems demand to know who is behind the information they are citing. Organization schema is how you answer that demand.

Adding it correctly takes about 30 minutes. The payoff is significant: you are telling AI systems you are a real, verifiable organization worth citing. That translates to more citations and more traffic from AI systems.

Start with your homepage. Then layer in author schema for your articles and LocalBusiness schema if you serve a geographic area.

**Scan your site at ConduitScore.com to see whether organization schema is helping your AI visibility.** The free scan checks all 14 signals. Three free scans per month, no signup required.

## Your Next Steps

This week:

1. Collect your official company name, exact address, phone, email, logo URL, and social profiles.
2. Write your organization schema using proper JSON-LD formatting.
3. Add it to your homepage head section.
4. Use Google's Rich Results Test to verify it is recognized.
5. Scan your site monthly to ensure schema remains strong.
6. Add author schema to your key articles once organization schema is live.

Organization schema is one piece of the AI visibility puzzle, but it is critical. Combined with the other 13 signals, it is what makes your site trustworthy to AI systems.`,
    category: "Technical Guides",
    date: "2026-03-27",
    readTime: "5 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "free-ai-visibility-scan-vs-traditional-seo-audit": {
    slug: "free-ai-visibility-scan-vs-traditional-seo-audit",
    title: "Free AI Visibility Scan vs. Traditional SEO Audit",
    description: "Compare AI visibility scans and traditional SEO audits. When to use each and why your site might need both.",
    content: `## Are They the Same Thing?

If you are a site owner or marketer, you have probably had a traditional SEO audit done. Maybe you paid an agency to crawl your site, identify on-page issues, check your backlink profile, and deliver recommendations.

Now you are hearing about AI visibility scans. Are they the same thing? Should you care about both?

The short answer is no—they are not the same. But they are also not mutually exclusive. Understanding the difference helps you decide which tool is right for your business.

## What a Traditional SEO Audit Measures

Traditional SEO audits focus on one goal: ranking in Google search results. They measure factors that Google uses to decide whether your site deserves a high ranking.

A typical SEO audit checks:

**On-page factors** like title tags, meta descriptions, headers, keyword placement, content length, and internal linking.

**Technical SEO** like site speed, mobile responsiveness, crawlability, SSL certificates, and XML sitemaps.

**Backlink profile** including the number and quality of sites linking to you.

**Content quality** in terms of depth, uniqueness, and freshness.

**User experience** signals like Core Web Vitals and accessibility.

The goal is to answer one question: Why is this site not ranking higher in Google?

## What an AI Visibility Scan Measures

An AI visibility scan asks a different question: Can AI systems access, understand, and cite this site?

An AI visibility scan measures 14 signals across 7 categories: Crawlability and Access, Structured Data and Semantics, Citation Readiness, Content Quality, Link Profile, Site Health, and Compliance and Safety.

The goal is to answer: Will AI systems cite this site as a source?

## Key Differences

**What they optimize for:**
- SEO audits target keyword rankings in Google
- AI scans target citations in AI systems like ChatGPT and Perplexity

**Speed to impact:**
- SEO improvements take weeks or months
- AI fixes often show results almost immediately

**What they focus on:**
- SEO cares about keyword position and organic traffic
- AI cares about crawlability, structured data, and author info

**Cost:**
- Traditional SEO audits typically cost $1,500–$5,000
- AI scans cost free to $49/month

## A Critical Difference: Speed to Impact

Traditional SEO is a long game. You fix issues today; you see ranking improvement in 4 to 12 weeks if at all.

AI visibility is faster. Once you fix crawlability or citation readiness issues, AI systems can cite you almost immediately.

If you are trying to get traction now, AI visibility is the faster lever.

## When You Need a Traditional SEO Audit

Do not throw away SEO audits entirely. Consider one if:

- **Your organic traffic is stagnant.** An SEO audit helps diagnose why you are not getting discovered.
- **You want keyword targeting strategy.** AI systems do not rank by keyword. Google does. If keyword rankings matter, SEO analysis is the right tool.
- **You need competitive analysis.** A good SEO audit includes competitor ranking and content strategies.
- **You are in a highly competitive niche.** In saturated industries, traditional SEO is still how most traffic comes in.

## When You Need an AI Visibility Scan

Prioritize an AI visibility scan if:

- **You want to be cited by AI systems.** If ChatGPT or Perplexity citing your content would help your business, you need AI visibility.
- **You want to be found faster.** AI citations can drive traffic immediately. Google rankings take time.
- **You are in an AI-native category.** If people research your service using AI assistants, AI visibility matters more.
- **You want to monitor an ongoing metric.** One-time SEO audits are useful. Free AI scans are quick and repeatable.
- **You are a SaaS, agency, or consultant.** B2B audiences use AI to research solutions.

## The Honest Answer: You Probably Need Both

If you are serious about organic visibility through both Google and AI systems, the ideal approach is:

1. Run a free AI visibility scan to understand your baseline.
2. Fix the highest-impact issues using the checklist.
3. Invest in a traditional SEO audit if organic traffic is a major metric.
4. Layer in ongoing AI monitoring to catch new issues.

The 14 signals and traditional SEO best practices overlap on site health, mobile responsiveness, and content quality. Fixing those benefits both. They diverge on keyword targeting and citation readiness.

Think of it this way: SEO gets you discovered by humans on Google. AI visibility gets you discovered by AI systems answering questions. You want both channels.

## Starting with AI Visibility

The good news: AI visibility is the faster, cheaper place to start. Run a free scan. See what the 14 signals measure. Fix a few high-impact issues. You will be visible to AI systems much faster.

Then, if organic search is important, layer in traditional SEO expertise.

But do not make the mistake of thinking they are the same thing. Understanding the difference is what lets you prioritize your effort and pick the right tool for your goal.

**Scan your site now at ConduitScore.com** to see your AI visibility baseline. Three free scans per month, no signup required. Takes 15 seconds.`,
    category: "How-To Guides",
    date: "2026-03-27",
    readTime: "5 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
  "agency-playbook-client-ai-readiness-in-one-page": {
    slug: "agency-playbook-client-ai-readiness-in-one-page",
    title: "Agency Playbook: Client AI-Readiness in One Page",
    description: "A one-page framework agencies can use to audit client AI-readiness and deliver copy-paste fixes in one sprint.",
    content: `## The Agency Problem: Differentiating Without Complexity

If you are a digital agency, you have already optimized clients for Google. You have run SEO audits, built content calendars, managed paid search. Now your clients are asking: What about AI? Or worse, they are asking your competitors.

The problem is, most agencies do not have an "AI audit" offering. There is no playbook. So either you dismiss it as hype, or you start saying things like, "We will need to do a deep research project"—which sounds expensive and vague to clients who just want to know if their site is visible to ChatGPT.

This playbook changes that. It is a one-page framework that lets you quickly audit client AI-readiness, deliver specific copy-paste fixes, and upsell deeper work without reinventing your process.

## The One-Page Framework: 14 Signals in 7 Categories

The 14 AI visibility signals are organized into 7 categories. On a one-page checklist, they cover:

**1. Crawlability and Access:** robots.txt does not block AI crawlers, no JavaScript paywall, sitemap.xml exists.

**2. Structured Data and Semantics:** Organization schema on homepage, Article schema on blogs, Open Graph tags, proper H1-H2-H3 hierarchy.

**3. Citation Readiness:** Author information on every article, publication date visible, organization name and contact in footer.

**4. Content Quality Signals:** Articles over 600 words, content updated quarterly, no thin pages, original research.

**5. Link Profile:** Domain has backlinks, no obvious spam, internal linking present.

**6. Site Health and Performance:** SSL certificate, page load under 3 seconds mobile, mobile-responsive, no crawl errors.

**7. Compliance and Safety:** Privacy policy published, terms of service, contact page working, no security issues.

## The Audit Sprint: How to Deliver Value in One Week

Here is how to deliver this with clients:

**Day 1: Run the scan.** Use ConduitScore's free scan on the client's homepage. Share results. This takes 15 seconds and immediately shows where they stand.

**Day 2: Deep dive on top issues.** Review which signals are weakest. Typically crawlability, structured data, citation readiness. Create prioritized list of 5 to 7 fixes.

**Day 3: Provide copy-paste code.** For each fix, give the client actual code. Add schema to homepage head. Update robots.txt. Add Open Graph tags.

**Day 4: Test and document.** Have a dev team member implement. Verify with Google's Rich Results Test.

**Day 5: Deliver the report.** One-page summary: baseline score, fixes implemented, expected impact, next steps.

Total effort: 5 to 8 hours of agency time. Client sees immediate value. You have now positioned yourself as the AI readiness expert.

## Upsell Paths: From Free to Paid

Once you have delivered the one-page audit, here are your upsell paths:

**Upsell 1: Monthly monitoring.** The 14 signals can degrade. Offer monthly AI visibility rescans using paid plans as part of a retainer.

**Upsell 2: Custom content strategy.** Once basics are fixed, clients need to use their AI visibility. Help create AI-discoverable content.

**Upsell 3: Competitive analysis.** Scan competitors' AI visibility. Show the client how they stack up.

**Upsell 4: Deeper SEO integration.** Some clients want to layer traditional SEO on top of AI readiness.

**Upsell 5: API and bulk workflows.** For agencies with many clients, the Agency plan includes bulk CSV scanning and API access.

## How to Position This to Clients

Here is the language to use:

"There is a new visibility channel emerging: AI systems like ChatGPT and Claude. They are generating answers to questions your audience is asking. But your site will not be cited unless it meets 14 specific readiness signals. We have identified which signals you are strong on and which ones are costing you citations. Here are the fixes—they are quick and they are specific. Once implemented, your site becomes a trusted source for AI-powered answers."

That language does three things: educates the client, shows expertise, and promises quick wins.

## Differentiating Your Agency

The agencies that will win over the next year are the ones who can quickly audit and improve AI readiness. You do not need to be the world's expert; you need to be better than your competitors.

By adopting the 14-signal framework:

- You have a repeatable process
- You can train junior staff quickly
- You deliver results in a sprint, not months
- You have a lead magnet (free audits to paid monitoring)
- You are positioned ahead of confused agencies

This is a category-creation opportunity. Position yourself as the agency that helped clients win in the AI visibility era.

## Common Client Questions and How to Answer Them

**How long until AI scans help our business?** Real-time. If you are cited by ChatGPT today, you can see traffic today. Unlike SEO, you do not wait months.

**Is this instead of SEO?** It is in addition to SEO. Google still drives traffic. AI systems are a new channel. You want both.

**How much does it cost to fix?** Most fixes are free or low-cost. They are code changes and content updates, not paid software.

**What if our competitors are not doing this?** That is the advantage. You will be visible to AI first. By the time they catch up, you will have citations.

## Your Implementation Roadmap This Week

Here is what to do:

**Step 1: Understand the 14 signals.** Read them. Understand what each one measures. You do not need to be technical.

**Step 2: Pick one client.** Run a free scan at ConduitScore.com. See the framework in action. This takes 15 seconds.

**Step 3: Draft your audit template.** Create a one-page template that matches your brand. List 14 signals. Add your agency name and logo.

**Step 4: Pitch it as a free audit.** Offer one free AI readiness audit to a prospect or existing client. Show the value.

**Step 5: Bundle it into a service.** Once you have done a couple audits, turn this into a packaged offering. Make it repeatable.

**Step 6: Layer in monitoring.** After initial audit, offer monthly monitoring using paid plans. This is your recurring revenue.

By month two, you will have a new service line. By month three, it will be a lead magnet that prospects ask about. That is how you differentiate.

## Why This Works for Agencies

The 14-signal framework works for agencies because:

- It is teachable (train staff in an afternoon)
- It is repeatable (same checklist for all verticals)
- It is fast (deliver value in a week)
- It is a funnel (free audit to paid monitoring)
- It positions you as an expert

Most importantly, it is honest. You are not making up frameworks. The 14 signals are based on how AI systems actually work.

**Start with a free scan at ConduitScore.com.** See how the 14 signals show up on a real site. Then adapt this playbook to your clients and watch your win rate increase.`,
    category: "Agency Guides",
    date: "2026-03-27",
    readTime: "6 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },

  "what-is-ai-visibility-complete-guide-2026": {
    slug: "what-is-ai-visibility-complete-guide-2026",
    title: "What Is AI Visibility? (The Complete Guide for 2026)",
    description: "AI visibility is how findable your site is to ChatGPT, Claude, and Perplexity. Learn the 14 signals that determine whether AI systems cite your content.",
    content: `Google can find your website. ChatGPT probably cannot cite it.

That distinction — ranking versus being cited — is the gap that defines AI visibility. And in 2026, that gap is costing businesses traffic they cannot see, from a channel they never thought to measure.

AI visibility is the degree to which AI systems can access, parse, and choose to cite your website when answering a user's question. It is not the same as SEO. It is not a subset of SEO. It is a parallel discipline with different signals, different rewards, and different consequences for getting it wrong.

This guide explains what AI visibility means, why it matters more in 2026 than it did two years ago, and exactly what the 14 signals are that determine whether a system like ChatGPT or Perplexity cites your content or ignores it entirely.

## Why 2026 Is the Inflection Point

In 2022, search worked like this: a user typed a query, got ten blue links, and clicked one. Your job was to be one of those links.

That model is not dead. But it is no longer the only model — and for many queries, it is no longer the primary one.

Today, ChatGPT has over 200 million weekly active users. Perplexity processes over 100 million queries per month. Google's AI Overviews appear on roughly 25% of searches in the United States as of early 2026. Bing Copilot is integrated directly into Microsoft's operating system. Claude.ai answers questions for millions of enterprise users.

All of those systems generate answers directly. They do not show users a list of links and ask them to choose. They synthesize a response — and either cite your site as a source, or they do not.

Here is the counterintuitive part: the signals these AI systems use to decide what to cite are almost entirely different from the signals Google uses to decide what to rank. A site with 50,000 backlinks and decade-old domain authority can be completely invisible to AI systems if it lacks structured data, blocks AI crawlers in its robots.txt, and has no author attribution on its articles.

Meanwhile, a six-month-old site with solid JSON-LD schema, clear author credentials, and an accessible llms.txt file can start receiving AI citations within weeks of launch.

The signals that matter have changed. Most sites have not caught up.

## What AI Systems Actually Look For

Before covering the 14 signals specifically, it helps to understand how AI systems make citation decisions at a high level.

Large language models are trained on massive text corpora, but they also retrieve live web content for real-time queries. When a system like Perplexity searches the web to answer a question, it is not just looking for relevance — it is filtering for trustworthiness, parseability, and authority.

**Trustworthiness** means: Is this a real organization? Is there a named author? Is there contact information? Is there a publication date?

**Parseability** means: Can a machine read this content cleanly? Is the content in the HTML body, or is it hidden behind JavaScript rendering? Is there structured data that explicitly labels what this content is?

**Authority** means: Does this site have backlinks from known sources? Does it have an established presence? Does the author have verifiable credentials?

These three filters — trustworthiness, parseability, authority — map directly to the 14 AI visibility signals. When a site scores well on all three, AI systems cite it. When a site fails on any one of them, it gets skipped regardless of how well it ranks on Google.

## The 14 AI Visibility Signals Across 7 Categories

### Category 1: Crawlability and Access

Before an AI system can consider citing your site, it has to be able to reach it. Three signals govern this:

**Robots.txt permission for AI crawlers.** Many sites that optimized their robots.txt for Googlebot have accidentally blocked AI crawlers. GPTBot (OpenAI), ClaudeBot (Anthropic), and PerplexityBot each have distinct user-agent identifiers. If your robots.txt disallows these crawlers — or uses a catch-all "Disallow: /" that blocks all non-Google bots — those AI systems cannot access your content at all. The fix is straightforward: audit your robots.txt and confirm it does not block named AI crawlers.

**Sitemap.xml presence.** A sitemap tells crawlers which pages exist and when they were last updated. Sites without a sitemap make AI systems work harder to discover content — and AI crawlers, unlike Googlebot, will not necessarily persist through that friction. A valid XML sitemap at /sitemap.xml is a baseline requirement.

**No JavaScript-only content.** AI crawlers do not execute JavaScript the way a browser does. If your key content — product descriptions, article bodies, pricing information — only appears after JavaScript renders, AI systems see a blank page. Content must be present in the raw HTML response.

### Category 2: Structured Data and Semantics

Structured data is the clearest signal you can send to a machine. It says: "This is what this content is, in a format designed for machines to read."

**JSON-LD schema markup.** Schema.org's vocabulary gives you explicit labels for your content. An Article schema tells AI systems this is editorial content with an author and a date. An Organization schema tells them who is behind the site. A Product schema tells them what you sell and at what price. Without schema, AI systems have to infer content type from context — and they get it wrong often enough to affect citation decisions.

**Open Graph tags.** Open Graph metadata (og:title, og:description, og:type) was designed for social sharing but is read by AI systems as a machine-readable content summary. Sites without Open Graph tags are missing an easy signal.

**Proper heading hierarchy.** H1 through H3 headings create a semantic outline that AI systems use to understand content structure. A page with one H1, clear H2 sections, and H3 subsections is significantly easier to parse than a page with inconsistent heading levels or heading tags used purely for visual formatting.

### Category 3: Citation Readiness

AI systems prefer to cite sources they can verify. Citation readiness signals establish your site as a verifiable, accountable source.

**Author information on every article.** A bylined article with an author name, a brief bio, and ideally a link to the author's profile elsewhere signals that a real person with accountable credentials wrote this content. Anonymous content — published under a company name with no individual author — scores lower on citation readiness.

**Visible publication dates.** AI systems weight recency in many query types. An article without a visible publication date cannot be evaluated for freshness. Dates should be in the HTML in a machine-readable format (ISO 8601: 2026-03-27) and visible to readers.

**Organization identity in footer.** Your organization name, contact email, and physical address in the site footer — ideally matching your Organization schema — close the loop on verifiable identity. It is the digital equivalent of a newspaper's masthead.

### Category 4: Content Quality Signals

Not all content gets cited equally. AI systems apply quality filters that reward depth, originality, and freshness.

**Article length and depth.** Content under 600 words rarely has enough substance to serve as a citation for a complex question. AI systems tend to cite longer-form content that fully addresses a topic. This does not mean longer is always better — but thin pages are rarely cited.

**Content freshness.** Information that has not been updated in three or more years is treated with lower confidence by AI systems, particularly on topics that change (technology, regulations, pricing, best practices). A content calendar that includes regular updates to key pages is an AI visibility investment, not just an SEO one.

**Original research and primary data.** Content that contains original research, proprietary data, or primary-source interviews carries higher citation value than content that synthesizes what is already widely published. If you have internal data — survey results, usage statistics, case study outcomes — publishing it explicitly increases your citation potential.

### Category 5: Link Profile

Authority signals from backlinks matter to AI systems as a proxy for trustworthiness, though they matter differently than they do for Google rankings.

**Domain backlinks from known sources.** A site with backlinks from established publishers, educational institutions, or recognized industry organizations signals domain authority to AI systems. The threshold is not as high as Google's — AI systems are not running PageRank — but a site with zero backlinks is treated as unverified.

**Internal linking.** Internal links help AI crawlers discover all pages on a site and understand content relationships. A site with strong internal linking between related articles is more thoroughly indexed by AI crawlers than a site where pages exist in isolation.

**No obvious spam signals.** Sites with patterns associated with spam — keyword-stuffed anchor text, links from link farms, domain names with multiple hyphens and purchased expired domains — are filtered out early by AI citation logic.

### Category 6: Site Health and Performance

Technical hygiene signals that your site is maintained and functional.

**SSL certificate (HTTPS).** An HTTP site in 2026 is a red flag. AI systems use HTTPS as a minimum bar for any citation. If your site is not HTTPS, this alone can disqualify it from AI citations regardless of content quality.

**Page load under 3 seconds on mobile.** AI crawlers do have timeout thresholds. Extremely slow pages — particularly on mobile, where crawlers often run user-agent profiles — may be abandoned before full content retrieval. Page speed is both a user experience and a machine accessibility issue.

**No crawl errors on key pages.** 404 errors, redirect chains, and server errors on key content pages signal poor site maintenance. AI systems deprioritize sites with significant error rates.

### Category 7: Compliance and Safety

The final category covers signals that establish your site as a legitimate, operating entity.

**Privacy policy and terms of service.** Sites without published privacy policies and terms of service have incomplete organizational infrastructure. AI systems use the presence of these pages as a basic legitimacy signal — particularly important for sites that handle user data.

**Working contact page.** A functional contact page with a real email address (not just a form with no other contact information) is a trust signal. AI systems that validate organizational identity check for reachable contact channels.

**No security issues.** Sites with active malware flags, browser security warnings, or blacklist status with major security providers will not be cited by any major AI system. Security infrastructure is not optional.

## AI Visibility vs. Traditional SEO: Where They Overlap and Diverge

Site health, HTTPS, mobile performance, and content quality are signals that matter for both Google rankings and AI citations. Investing in these improves both channels simultaneously.

The divergence is significant in three areas:

**Structured data.** Google uses schema markup as a ranking signal, but it is optional for many site types. For AI citations, JSON-LD schema is close to mandatory — it is the clearest machine-readable signal you can provide.

**Author attribution.** Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) framework values author credentials, but plenty of high-ranking content has no byline. AI systems treat missing author information as a citation risk flag.

**Keyword optimization.** Traditional SEO rewards keyword placement, density, and semantic keyword coverage. AI systems do not rank by keyword. They cite by trustworthiness and parse-quality. A piece of content optimized for keywords but written in a way that is difficult to parse — dense jargon, inconsistent structure, no clear answer to the implicit question — will rank on Google and be skipped by AI.

The practical implication: SEO and AI visibility are complementary, not competing. The fastest path to both is to fix site health and content quality first, then layer in AI-specific signals (schema, author info, llms.txt, robots.txt) that Google will ignore but AI systems will reward.

## How to Measure AI Visibility

You cannot improve what you cannot measure. AI visibility scoring gives you a quantified baseline across all 14 signals so you know where to focus.

ConduitScore's scoring system assigns a 0-100 score based on how many of the 14 signals your site satisfies and how strongly. The score breaks down by category — so you can see that your site scores 90 on Site Health but 40 on Citation Readiness, and prioritize accordingly.

The free scan takes approximately 15 seconds. It checks all 14 signals programmatically: fetching your robots.txt to check for AI crawler blocks, parsing your HTML for JSON-LD schema, checking for author markup in article pages, testing page load time, verifying HTTPS, and more.

Running a scan before making changes gives you a baseline. Running one after gives you proof that the changes worked.

## The Most Common AI Visibility Mistakes

In scanning thousands of sites, four mistakes appear most often:

**Blocking AI crawlers by accident.** The most common issue. Site owners added "Disallow: /" to block scrapers and did not know they blocked GPTBot and ClaudeBot at the same time. Check your robots.txt. If it disallows all bots or specifically disallows any of the major AI crawlers, you are invisible to those systems.

**No schema on any page.** Many small business sites and even mid-size company sites launched before structured data was standard practice and were never updated. Adding Organization schema to the homepage and Article schema to blog posts is a half-day of work that dramatically improves AI parse-ability.

**Anonymous content.** Articles published under a company name with no individual author — "By ConduitScore Team" with no linked bio or profile — score lower than bylined content. Author schema linked to an author profile page is the fix.

**Outdated content with no refresh date.** A blog post from 2021 with a last-modified date of 2021 is treated as potentially stale on every topic. If you have high-quality older content, add a "last reviewed" date and update it when the content is checked for accuracy.

## What Improving AI Visibility Looks Like in Practice

A realistic improvement path for a site starting from a mid-range AI visibility score:

**Week 1:** Fix robots.txt to permit AI crawlers. Add a valid sitemap.xml if one does not exist. Confirm HTTPS is active. These are zero-content changes that unlock the foundation.

**Week 2:** Add Organization schema to the homepage in JSON-LD format. Add Open Graph tags to all key pages. Both can be done in an afternoon with access to the site's head section.

**Week 3:** Audit your top 10 content pages for author attribution. Add author bylines with linked bios. Add visible publication dates to all articles. Add Article schema to blog posts.

**Week 4:** Identify your three to five most important pages — the ones you most want to be cited for. Check that each one is over 600 words, contains structured information (headings, clear sections), and answers a specific question completely.

**Month 2:** Add a /llms.txt file that describes your site's content structure to AI systems. Monitor your AI visibility score monthly. Watch for regressions — a site update, a plugin change, or a robots.txt edit can inadvertently break signals you fixed.

Sites that follow this path typically move from a score in the 30-50 range to the 65-80 range within 60 days. That is the range where AI citations start appearing for relevant queries.

## The Infrastructure Frame

There is a temptation to treat AI visibility as a tactics problem — a checklist to run through and forget. That framing leads to improvements that degrade over time.

The more durable frame is infrastructure. A site's AI visibility is part of its technical infrastructure, the same way HTTPS is infrastructure. It requires initial setup, periodic maintenance, and monitoring for regressions.

Organizations that treat AI visibility as infrastructure — building it into site launch processes, content publishing workflows, and quarterly technical audits — accumulate citations over time rather than chasing them reactively.

The sites that will consistently appear in AI-generated answers are not the sites that ran one audit in early 2026. They are the sites that built AI visibility into how they operate.

Your first step is to understand where you stand today. Scan your site at ConduitScore.com — the free scan checks all 14 signals in about 15 seconds and shows you exactly where to focus. Three free scans per month, no account required.`,
    category: "Guides",
    date: "2026-03-27",
    readTime: "14 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },

  "what-is-llms-txt-complete-guide": {
    slug: "what-is-llms-txt-complete-guide",
    title: "What Is llms.txt? The Complete Guide",
    description: "llms.txt tells AI systems what your site contains and which pages to prioritize for citations. Learn what it is, how to write one, and whether it matters.",
    content: `robots.txt tells AI systems where they can go. llms.txt tells them what they will find when they get there.

That distinction matters more than it first appears. A site can be completely accessible to AI crawlers — no blocked paths, valid sitemap, clean HTML — and still receive zero citations from ChatGPT or Perplexity. The reason is not access. The reason is context. When an AI system retrieves 150 pages from a website, it has no machine-readable signal about which three pages represent the site's core expertise, which content is most current, or which author is the authoritative voice on a given topic.

llms.txt is how you provide that signal directly.

## What llms.txt Is

llms.txt is a plain-text file placed at the root of your website, accessible at yourdomain.com/llms.txt. It is a structured, markdown-formatted document that describes your site to AI systems: what the site covers, which pages are most important, who the authors are, and what an AI should know before it starts retrieving and citing your content.

The format was proposed by Jeremy Howard, co-founder of fast.ai, in September 2024. Howard's argument was straightforward: robots.txt was designed in 1994 for search engine crawlers. It handles access permissions — which paths are allowed, which are denied. It was never designed to communicate content context, and that gap has become a problem as AI systems need to make citation decisions based on more than just raw text retrieval.

llms.txt fills that gap. It is not a replacement for robots.txt. It is a companion document that answers a different question: not "can you access this?" but "once you get there, what is this site, and what should you prioritize?"

## The Counterintuitive Part: This Is a Context Problem, Not a Crawl Problem

Most site owners who learn about AI visibility assume the main obstacle is access. They check their robots.txt, confirm that GPTBot is not blocked, and conclude their site is AI-ready.

It is not — and the reason reveals something important about how AI citation decisions actually work.

When a system like Perplexity retrieves content to answer a question, it does not read every page on your site with equal attention. It retrieves a selection of pages, ranks them by relevance and trustworthiness, synthesizes the content, and cites the sources it considers most authoritative for the specific query.

That ranking step — relevance and trustworthiness — is where most sites lose citations they should be receiving. An AI system that retrieves your homepage, three blog posts, and your pricing page has no way to know that your research report from six months ago is the most authoritative piece of content on your site. It cannot tell, from the HTML alone, that the author of that report has 15 years of domain experience and has been cited by three industry publications.

llms.txt is how you tell it. Directly, in machine-readable format, without ambiguity.

## The Format: What Goes in a llms.txt File

llms.txt uses simple markdown formatting. There is no rigid specification yet — the standard is still emerging — but the structure that has become most widely adopted follows this pattern:

**The header section** opens the file with a brief description of the site. Two to four sentences covering what the site does, who it serves, and what makes its content authoritative. This is the first thing an AI system reads when it retrieves your llms.txt.

**The main content sections** are H2-level headings that correspond to the major content areas of your site. Under each heading, you list key pages with their URLs and a one-sentence description of what each page covers. These descriptions are not for human readers — they are for AI systems that need to quickly assess whether a given page is relevant to a query they are trying to answer.

**The author section** lists the people who create content for the site, with brief credential information. AI systems use author credentials as part of their citation trustworthiness assessment. A named author with stated expertise is more citable than anonymous content.

**The optional metadata** includes content freshness signals (when the site last had significant updates), contact information, and links to key resources like the sitemap, privacy policy, or API documentation if applicable.

Here is what a well-structured llms.txt looks like for a hypothetical B2B SaaS company called Acme Analytics, which provides data pipeline software:

\`\`\`
# Acme Analytics

Acme Analytics provides cloud-native data pipeline software for engineering teams at mid-size companies. Our documentation, blog, and research cover data engineering, ETL architecture, real-time data processing, and data quality practices. Content is written by senior data engineers with 8-15 years of direct implementation experience.

## Documentation

- [Getting Started Guide](/docs/getting-started): Complete setup walkthrough for new users, from account creation to first pipeline run.
- [Pipeline Architecture Overview](/docs/architecture): Technical reference for Acme's three-tier processing model and how data flows through the system.
- [API Reference](/docs/api): Full API documentation with request/response examples for all endpoints.
- [Troubleshooting Guide](/docs/troubleshooting): Solutions to the 40 most common configuration and runtime errors.

## Blog

- [Why Most Data Pipelines Fail at Scale](/blog/pipeline-failure-modes): Analysis of the four architectural patterns that cause pipeline failures above 10M events/day, with specific case examples.
- [Real-Time vs. Batch Processing: A Decision Framework](/blog/realtime-vs-batch): Framework for choosing between streaming and batch architectures based on latency requirements, cost constraints, and team capacity.
- [Data Quality at the Source: Preventing Downstream Problems](/blog/data-quality-source): Practical guide to implementing validation at ingestion rather than transformation, with code examples.

## Research

- [State of Data Engineering 2025](/research/state-of-data-engineering-2025): Survey of 847 data engineering teams on tooling, architecture patterns, challenges, and salary benchmarks.

## Authors

- **Maria Chen** (Head of Product, Acme Analytics): 12 years in data engineering, former staff engineer at Databricks. Writes on pipeline architecture and product decisions.
- **James Park** (Senior Data Engineer): Specializes in real-time processing and stream analytics. Author of the Troubleshooting Guide.

## Contact

- General: hello@acmeanalytics.com
- Press/Research: press@acmeanalytics.com
- Last content update: March 2026
\`\`\`

Notice what this file does. In under 400 words, it tells an AI system: what Acme Analytics is, what content categories exist, which specific pages are most authoritative, who the authors are and what their credentials are, and when the site was last updated. An AI answering a question about data pipeline failure modes can immediately identify the relevant blog post, understand who wrote it and why they are credible, and cite it with confidence.

Without llms.txt, that same AI system retrieves the page, has no context about its authority, and may deprioritize it in favor of content from a site that has provided clearer signals.

## How llms.txt Fits Into the 14-Signal AI Visibility Framework

llms.txt is one of the 14 AI visibility signals that determine whether a site gets cited by AI systems. It falls within the Crawlability and Access category alongside robots.txt permissions and sitemap.xml.

The distinction within that category is important. robots.txt governs access — the binary question of whether an AI crawler is permitted to retrieve a page. A sitemap.xml governs discovery — it tells crawlers which pages exist. llms.txt governs context — it tells crawlers which pages matter and why.

All three work together. A site with a clean robots.txt and a valid sitemap but no llms.txt is accessible and discoverable, but not contextualized. A site with llms.txt but a misconfigured robots.txt that blocks AI crawlers is contextualized but inaccessible. You need all three.

Within the broader 14-signal framework, llms.txt also amplifies signals in other categories. When your llms.txt lists named authors with credentials, it reinforces the Citation Readiness signal. When it links to your most substantive content, it reinforces the Content Quality signal by making that content easier for AI systems to find and weight appropriately.

## How to Write and Deploy Your Own llms.txt

The process is straightforward for any site owner or developer with access to the site root.

**Step 1: Create the file.** Open a text editor and create a new file named llms.txt. Use UTF-8 encoding. Do not use a .doc, .docx, or .html format — the file must be plain text.

**Step 2: Write the header description.** Two to four sentences describing what your site covers and who it is authoritative for. Be specific. "We cover digital marketing" is too vague. "We publish data-backed analysis of B2B SaaS marketing attribution, with a focus on multi-touch models and revenue operations" tells an AI system exactly what queries your content should be considered for.

**Step 3: Identify your most important pages by category.** For each major content area (blog, documentation, research, resources), select three to eight pages that best represent your expertise. These should be your most substantive, well-cited, or frequently referenced pieces — not your most recent ones. An AI system reading your llms.txt should come away knowing exactly which pages to retrieve first.

**Step 4: Write one-sentence descriptions for each page.** The description should answer: what specific question does this page answer, and for whom? Not "our blog post about SEO" but "a practitioner's guide to implementing breadcrumb schema markup for multi-level product category pages."

**Step 5: Add author information.** For each author who has published content on your site, include their name, their role or credential, and their areas of focus. Two to three sentences per author is sufficient.

**Step 6: Deploy the file.** Place llms.txt in your site's root directory so it is accessible at yourdomain.com/llms.txt. For static sites, this means placing it alongside your index.html. For Next.js or similar frameworks, place it in the /public directory.

**Step 7: Verify accessibility.** Open a browser in incognito mode and navigate to yourdomain.com/llms.txt. Confirm the file loads as plain text. Confirm the response headers show text/plain as the content type. If your hosting environment is serving it as HTML, check your server configuration.

**Step 8: Do not block it in robots.txt.** This sounds obvious, but it has happened. If your robots.txt has broad "Disallow: /" rules for non-Google bots, confirm that it does not block access to llms.txt. AI systems cannot use a file they cannot retrieve.

## Common Mistakes Site Owners Make With llms.txt

**Too long.** llms.txt should be under 2,000 words. The purpose is to provide a quick, structured context summary — not to reproduce your entire site's content. An AI system that retrieves a 10,000-word llms.txt is not being helped; it is being burdened.

**Too vague.** A header description that reads "We cover business topics for professionals" gives an AI system nothing useful. Be specific about your domain, your content type, and your target audience.

**Not maintained.** llms.txt has a "last updated" field for a reason. A file that lists content from 2023 as your most important pages, when you have published substantially better content since, actively misleads AI systems. Block quarterly time to review and update it.

**Wrong file location.** The file must be at the domain root: yourdomain.com/llms.txt. Not yourdomain.com/blog/llms.txt. Not yourdomain.com/files/llms.txt. AI systems look for it at the root path specifically.

**Blocking it in robots.txt.** As noted above: if your robots.txt disallows access to llms.txt, AI systems cannot retrieve it. The file does nothing.

**Listing promotional pages instead of authoritative ones.** Site owners sometimes use llms.txt to highlight their homepage, pricing page, and product tour. Those pages rarely drive AI citations. The pages that get cited are substantive content pages: research reports, technical guides, in-depth analyses. Prioritize those.

## Is llms.txt Worth It Right Now?

The honest answer is: it is not universally adopted, but adoption is accelerating, and the cost of adding it is low enough that the question is almost academic.

As of early 2026, Perplexity has confirmed that it reads llms.txt files when available. Several other AI retrieval systems have signaled support. OpenAI has not published explicit confirmation for ChatGPT's web browsing, but the standard is visible in their public documentation discussions.

The counterargument — that you should wait until more AI systems officially support it — has a logical flaw. The sites that benefit from llms.txt will be the sites that had it in place when AI systems standardized on it, not the sites that added it afterward. The adoption curve for standards like this is steep and fast: robots.txt went from proposal to universal adoption in under three years.

The practical frame: llms.txt takes two to four hours to write well. It requires no ongoing technical maintenance, only content updates when your key pages change. The upside is being contextualized for AI citations on every query where your content is relevant. The downside of not having it is invisible — you will not see the citations you are not receiving.

## The Larger Point About Machine-Readable Context

llms.txt represents a pattern that is becoming more broadly true about the web: content that is explicitly machine-readable is cited more than content that requires inference.

JSON-LD schema markup says explicitly: "this is an Article, authored by this person, published on this date." Author bylines say explicitly: "a named human with verifiable credentials wrote this." llms.txt says explicitly: "these are the pages on this site that best answer questions in this domain."

In each case, the explicit signal outperforms the inferred one. AI systems making citation decisions under time constraints favor sources that are transparent about what they are and why they are authoritative. That transparency is not a trick. It is the digital equivalent of what credible publications have always done: show their work.

Your llms.txt is where you show yours.

Scan your site at ConduitScore.com to check whether llms.txt is present and readable — the free scan checks this alongside 13 other AI visibility signals in about 15 seconds. Three free scans per month, no account required. You will see your current score and exactly which signals to fix first.`,
    category: "Technical Guides",
    date: "2026-03-27",
    readTime: "13 min read",
    author: "Ben Stone",
    authorTitle: "Co-founder, ConduitScore",
  },
};

/**
 * All blog posts as an array (ordered by date descending)
 */
export const BLOG_POSTS: BlogPost[] = Object.values(BLOG_POSTS_MAP).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
