<!--
PREREQUISITE WARNING: freeCodeCamp requires 3+ published articles before submitting.
Submit via: https://www.freecodecamp.org/news/contributing/
-->

# How to Make Your Website Visible to AI Search Engines: A Developer Checklist

AI-powered search is reshaping how people find information. ChatGPT Browse, Perplexity,
Claude web search — these answer questions by citing sources they have indexed.

If you maintain websites, understanding how AI systems crawl and evaluate content is now
part of the job. This guide covers the technical signals that matter.

## Why This Differs From Google SEO

Google PageRank is a link graph problem. AI citation is a retrieval problem.
RAG systems retrieve content chunks and evaluate credibility using four factors:

1. Was the crawler able to access the content?
2. Is the content structurally parseable?
3. Does the source have author authority signals?
4. Does the content directly answer common queries?

## 1. Update robots.txt for Modern AI Crawlers

Add explicit Allow rules for GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended:



Check yours: curl https://yourdomain.com/robots.txt

## 2. Add an llms.txt File

A new standard — robots.txt for LLMs — providing AI agents a structured overview
of your site. Create at yourdomain.com/llms.txt. Full spec at llmstxt.org.

Minimal example:


## 3. Implement JSON-LD Structured Data

For content pages, at minimum:



Also implement Organization schema site-wide.

## 4. Add Author and Publication Metadata

State author credentials explicitly in content. Named author + date + org affiliation
are the citation signals AI models use to evaluate source credibility.

## 5. Structure Content for Direct Answers

AI retrieval systems prefer content that directly answers questions in the first
100 words of each section. Use H2/H3 tags as complete questions when possible.

## 6. Audit Your Sitemap

Ensure sitemap.xml is linked from robots.txt, current, and includes all key pages.
For Next.js App Router, auto-generate via app/sitemap.ts.

## The Full Checklist

- [ ] robots.txt permits GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended
- [ ] sitemap.xml current and referenced in robots.txt
- [ ] llms.txt at domain root with correct format
- [ ] JSON-LD Article schema on content pages
- [ ] JSON-LD Organization schema in site head
- [ ] Named author with profile URL on content pages
- [ ] datePublished and dateModified on all content
- [ ] H2/H3 tags are questions or clear topic markers
- [ ] Key info in first 100 words of each section
- [ ] Site is HTTPS
- [ ] Core content renders without JavaScript

---

I built [ConduitScore](https://conduitscore.com) to audit all these signals automatically
and return a 0-100 score with prioritized fixes. Median score for production sites is
42/100. Most reach 65+ in one sprint.
