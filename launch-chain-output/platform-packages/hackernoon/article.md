---
title: "AI Search Is Eating Web Traffic — Here's How to Measure If Your Site Is Visible"
subtitle: "A technical breakdown of the signals ChatGPT, Claude, and Perplexity use to decide what to cite"
tags: [seo, artificial-intelligence, web-development, chatgpt, machine-learning]
---

# AI Search Is Eating Web Traffic — Here's How to Measure If Your Site Is Visible

Perplexity serves 10 million queries a day. ChatGPT Browse is default-on for 100 million Plus users. AI-generated answers are appearing in Google results. The search landscape is fragmenting, and the ranking signals that matter for AI citation are fundamentally different from those that govern Google PageRank.

This isn't speculation — it's measurable. Here's what the signals are, how to check yours, and where most sites stand.

## The Fundamental Difference Between Google SEO and AI Visibility

Google's algorithm is a link graph traversal problem. Inbound links signal authority. Content freshness and topical relevance determine ranking. It's a system built around human judgment (links as votes) aggregated at scale.

AI citation is a different problem. Language models don't traverse link graphs — they're pattern-matching over text they've seen during training or during retrieval-augmented generation (RAG) at inference time. What gets cited depends on:

1. Whether the AI crawler could access the content
2. Whether the content was structurally legible (parseable entities, clear semantic structure)
3. Whether the source had citation authority signals (author credentials, publication dates, organizational affiliation)
4. Whether the content directly answered the query without requiring inference

These are different requirements, and they require different infrastructure.

## The Seven Signal Categories

### Category 1: Crawler Access

The problem: Most `robots.txt` files predate AI crawlers. If you wrote yours before 2022, you likely never added explicit Allow rules for `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `PerplexityBot`, or `Googlebot-Extended` (Google's AI-specific crawler).

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot  
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot-Extended
Allow: /
```

About 40% of well-maintained sites have inadvertent AI bot restrictions.

### Category 2: llms.txt

A new file format — think `robots.txt` for LLMs — that provides AI agents with a structured, markdown-formatted overview of your site. The spec is at [llmstxt.org](https://llmstxt.org).

Minimal implementation:
```
# yourdomain.com
> [One-line description of your site/company]

## Important
- [Section name](url): [What this section covers]
```

85% of sites don't have this yet. Adding it takes under 30 minutes.

### Category 3: Structured Data

JSON-LD schema markup gives AI models a machine-readable entity graph for your content. At minimum, implement:
- `Organization` — who you are, where you're based, contact info
- `WebPage` — what each page is about
- `Article` — for content pages (author, date, publisher)
- `SoftwareApplication` — for product pages

### Category 4: Citation Signals

AI models are trained on human-curated content where authorship, dates, and organizational context are standard. Mimic that pattern:
- Named author with a linked author profile page
- `datePublished` and `dateModified` in ISO 8601 format
- Organization name and URL associated with the content
- E-E-A-T markers: first-person expertise language, credentials stated explicitly

### Category 5 & 6: Content Structure and Quality

AI models prefer content that directly answers questions in the first 100 words of each section. Heading structure matters: `<h2>` headers should be complete questions or clear topic markers. Dense marketing prose scores poorly; structured lists and tables with labeled data score well.

### Category 7: Technical Health

Fast enough not to time out during crawling. HTTPS required. Content should not be JavaScript-rendered (AI crawlers generally don't execute JS). Sitemap current and linked.

## Measuring Your Score

I built [ConduitScore](https://conduitscore.com) to automate this audit — a 0–100 score across all seven categories above, with specific code-level fixes ranked by score impact.

After scanning a few hundred sites: the median score for a production SaaS site is **42/100**. The most common failure is llms.txt absence (85% of sites). The most impactful quick fix is usually crawler access permissions.

Most sites can move from 40→65 in a single focused sprint.

## The Window

Major SEO tools are building AI visibility features. The sites that build this infrastructure now establish the citation track record before competition intensifies. The implementation cost is low — a sprint worth of work across most of these categories.

---

*Scan your site: [conduitscore.com](https://conduitscore.com) — free, no account required for first scan.*
