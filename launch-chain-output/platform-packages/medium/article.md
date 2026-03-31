# The Hidden Reason ChatGPT Ignores Your Website

*And the 7-point checklist that fixes it*

---

If you've ever asked ChatGPT or Perplexity about a topic where you're a legitimate authority — and watched it cite your competitors instead of you — you've experienced the AI visibility gap.

It's not about having better content. It's about being structurally legible to AI agents.

Search engines like Google built their indexing infrastructure over decades, and the web adapted to them. llms.txt files, AI-permissive robots.txt configurations, JSON-LD schema, structured citation signals — this is the equivalent infrastructure for AI agents. And most of the web hasn't built it yet.

Here's the seven-point checklist I've compiled from analyzing hundreds of sites:

## 1. AI Bot Permissions in robots.txt

Your robots.txt file, written in 2019, probably doesn't mention `GPTBot`. Check it now. If AI crawlers are blocked — intentionally or by accident — the rest of this list doesn't matter.

Add explicit Allow rules for: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Googlebot-Extended`.

## 2. llms.txt File

A new standard (similar to robots.txt but designed for LLMs) that gives AI agents a structured overview of your site. Drop a text file at `yourdomain.com/llms.txt`. Template at llmstxt.org.

## 3. JSON-LD Structured Data

At minimum: `Organization`, `WebPage`, `Article` schemas. For products: `SoftwareApplication`. AI models use these to build entity graphs — without them, your content is unstructured noise.

## 4. Author and Publication Metadata

Named author with a linked profile. Clear publication date. Organizational affiliation. These are the citation signals that AI models are trained to weigh.

## 5. Content Structure

Headers that are questions or clear topic markers. Short paragraphs. Key information in the first 100 words of each section. Lists and tables over dense prose.

## 6. Crawlability

Is your sitemap.xml current and linked from robots.txt? Are your most important pages within three clicks of the homepage? AI crawl budgets are finite.

## 7. Technical Baseline

HTTPS (not negotiable). Fast enough to not time out during crawling. No JavaScript-only rendering for content that needs to be indexed.

---

## How to Measure This

I built [ConduitScore](https://conduitscore.com) as a free tool to score any website across all seven dimensions above. Paste a URL and get a 0–100 score with specific, prioritized fixes.

The median score for a "well-maintained" site is around 42/100. Most sites can reach 65+ with one focused sprint.

The window to do this before it becomes table stakes is now.

---

*[Check your site's AI visibility score →](https://conduitscore.com)*
