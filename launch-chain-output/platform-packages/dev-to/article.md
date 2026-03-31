---
title: "Why Your Well-Ranked Website Is Invisible to ChatGPT (And How to Fix It)"
published: false
description: "AI agents like ChatGPT and Perplexity use different signals than Google to decide what to cite. Here's what they check, and how to measure your site's AI visibility."
tags: seo, ai, webdev, tools
canonical_url: https://conduitscore.com/blog/ai-visibility-guide
cover_image: 
series: 
---

# Why Your Well-Ranked Website Is Invisible to ChatGPT (And How to Fix It)

You've done the SEO work. Your pages rank. Google Search Console is green. But when you ask ChatGPT about your product category, it cites three of your competitors and never mentions you.

This is the AI visibility gap — and it's not about content quality. It's about structure.

## What AI Agents Actually Check

When ChatGPT, Perplexity, or Claude crawl and index web content, they use a different set of signals than Google's PageRank algorithm. Here's what matters:

### 1. Crawler Access Permissions

Most sites have `robots.txt` files written years ago, before AI crawlers existed. If your robots.txt doesn't explicitly permit `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Googlebot-Extended`, you may be blocking the very agents you want to be cited by.

```
# robots.txt — modern AI-permissive configuration
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

Check yours right now: `https://yourdomain.com/robots.txt`

### 2. The llms.txt File

`llms.txt` is a new standard — think of it as `robots.txt` for LLMs. It provides AI agents with a structured, human-readable summary of your site's content and structure.

A minimal llms.txt at your domain root looks like:

```
# llms.txt
> [Your product name]: [one-line description]

## Key Pages
- [page title](url): [brief description of what this page covers]
- [page title](url): [brief description]
```

Most sites don't have this yet. Adding it costs 15 minutes and signals to AI crawlers that you're designed to be machine-readable.

### 3. Structured Data

AI models use JSON-LD schema markup to parse entity relationships — who wrote something, when it was published, what organization is behind it, what a product does. Without it, your content is unstructured text. With it, it's a knowledge graph entry.

At minimum, add `Organization`, `WebPage`, and `Article` schemas. For SaaS products, add `SoftwareApplication`.

### 4. Citation Signals

AI models are trained to weight sources by expertise and authority. The signals they use include:

- Named author with a linked author profile
- Publication date (clearly marked)
- Organization affiliation
- Existing external citations pointing to your domain
- E-E-A-T markers (first-person experience language, credentials stated explicitly)

A page with "Posted by Admin | March 2024" scores worse on citation signals than "By Sarah Chen, Head of SEO at [Company] | March 15, 2024 | [author bio link]."

### 5. Content Structure

AI models prefer content organized to answer questions directly. This means:

- `<h2>` and `<h3>` headers that are themselves complete questions or clear topic markers
- Short paragraphs (3–5 sentences max)
- Information in the first 100 words of each section (models truncate context)
- Lists and tables over dense prose where data is comparative

## Measuring Your AI Visibility

I built [ConduitScore](https://conduitscore.com) to measure exactly these signals — a 0–100 score across all seven dimensions above. You paste a URL, and it returns:

- Which signals are passing, partially passing, or missing
- The specific code change needed to fix each issue
- An estimated score impact per fix

It's free for up to 3 scans per month.

## Where Most Sites Stand

After scanning a few hundred sites, the median score for a "well-maintained" SaaS site is around 42/100. The most common failures:

1. **robots.txt blocking AI bots** (40% of sites) — often inherited from old security policies
2. **No llms.txt file** (85% of sites) — simply doesn't exist yet
3. **Missing author/date metadata** (60% of sites) — treated as cosmetic by dev teams
4. **No structured data beyond basic OG tags** (70% of sites) — JSON-LD is still underused

The fixes are largely low-effort. Most sites can move from 42 to 65+ in a single sprint.

## The Timeline Is Now

The AI search wave is early. Perplexity has 10M+ daily active users. ChatGPT's Browse mode is default-on for Plus users. The sites that establish AI visibility infrastructure now are the ones that will be cited when AI search becomes mainstream.

Check your score: [conduitscore.com](https://conduitscore.com)

---

*Have questions about a specific finding? Drop them in the comments — happy to explain what any particular score means.*
