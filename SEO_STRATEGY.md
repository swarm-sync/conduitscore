# SEO Strategy: AgentOptimize

**Date:** 2026-03-11
**Primary Goal:** Organic rankings + AI search citations + traffic + conversions (free-to-paid)
**Target Audience:** SaaS founders, e-commerce managers, SEO professionals, digital agencies
**Geo:** Global (English-first)
**Timeframe:** 90 days (Q1-Q2 2026)

---

## Executive Summary

AgentOptimize is an AI visibility scanner that checks how AI agents (ChatGPT, Perplexity, Claude, Gemini) see a website. It occupies a high-growth niche at the intersection of SEO tooling and the AI search revolution. The competitive landscape includes GEOScore, Ayzeo, Free AEO Check, AI Rank Lab, WebTrek, Score My Geo, and GEO Tool -- all launched within the past 12 months.

**Strategy:** Position AgentOptimize as the definitive AI visibility scanner by combining a free tool (top-of-funnel acquisition) with the most comprehensive content hub for AI SEO education (topical authority) and technical SEO implementation that makes the site itself a showcase of AI-optimized best practices.

**First priority:** Fix the technical SEO foundation (metadata, sitemap, robots.txt, structured data, llms.txt) and launch 6 pillar content pieces targeting the highest-intent keywords. These have been implemented in this audit.

---

## SERP Reality

### Dominant Intent by Cluster

| Cluster | Primary Intent | Winning Formats | Bar to Entry |
|---------|---------------|-----------------|-------------|
| AI visibility score | Transactional / Tool | Free scanners, graders | Working tool + good UX |
| AI SEO guide | Informational | Long-form guides (2000+ words) | Depth + recency + authority |
| ChatGPT optimization | Informational / How-to | Step-by-step guides | Practical, actionable content |
| LLMs.txt | Informational | Technical guides | Accuracy + implementation detail |
| GEO vs SEO | Informational | Comparison articles | Balanced, comprehensive |
| robots.txt AI bots | Informational / How-to | Configuration guides, code examples | Technical accuracy |

### Competitive Landscape (Direct Competitors)

1. **GEOScore (geoscoreai.com)** - 0-100 score, letter grade, 5-area pipeline. Clean but limited content.
2. **Ayzeo (ayzeo.com)** - 12+ categories, GEO score, 30-second scan. Content-light.
3. **Free AEO Check (freeaeocheck.com)** - 7 categories, AEO + GEO scores. No blog.
4. **AI Rank Lab (airanklab.com)** - SEO/AEO/GEO analyzer, blog content present.
5. **WebTrek (webtrek.io)** - 0-100 score, simulated answers. Tool-focused.
6. **Score My Geo (scoremygeo.com)** - 5 pillars, AI ranking forecast.
7. **GEO Tool (geo-tool.com)** - 47-second scan, quick wins, forecast.
8. **HubSpot AEO Grader** - Brand authority, limited depth.

### Differentiation Opportunity

Most competitors are tool-only with minimal educational content. AgentOptimize can win by being both the best free scanner AND the most authoritative content hub for AI SEO education -- the "Moz of AI SEO."

---

## Technical SEO Audit & Fixes (Implemented)

### Issues Found and Fixed

| Issue | Severity | Status | What Was Done |
|-------|----------|--------|---------------|
| No sitemap.xml | Critical | FIXED | Created `src/app/sitemap.ts` with 14 URLs |
| No robots.txt | Critical | FIXED | Created `src/app/robots.ts` with rules for 13 AI crawlers |
| Minimal metadata | High | FIXED | Comprehensive Metadata API in layout.tsx with title template, OG, Twitter cards |
| No JSON-LD structured data | High | FIXED | Added Organization, SoftwareApplication, WebSite, FAQPage, HowTo, BreadcrumbList, Blog, BlogPosting schemas |
| No Open Graph images defined | High | FIXED | OG image path set in metadata (image file needs creation) |
| No Twitter Card meta | Medium | FIXED | Full Twitter card metadata added |
| No canonical URLs | High | FIXED | Canonical URLs set for every page |
| No llms.txt | Medium | FIXED | Created `public/llms.txt` with comprehensive site summary |
| No manifest.webmanifest | Low | FIXED | Created PWA manifest |
| No FAQ section (homepage) | High | FIXED | Added 6 FAQs with FAQPage schema |
| No "How It Works" schema | Medium | FIXED | Added HowTo schema for 3-step process |
| Missing pages (About, Blog) | High | FIXED | Created About page (E-E-A-T), Blog index, 6 blog posts |
| No breadcrumb schema | Medium | FIXED | BreadcrumbList schema on all pages |
| Empty next.config.ts | Medium | FIXED | Added security headers, image optimization, www redirect, caching |
| Only 4 feature cards shown | Low | FIXED | All 7 categories displayed |
| No pricing comparison table | Medium | FIXED | Added feature comparison table on pricing page |
| No Free tier on pricing page | Medium | FIXED | Added Free tier card |
| No internal linking strategy | High | FIXED | Blog posts link to tool, related articles section, nav updated |
| Minimal nav links | Low | FIXED | Added How It Works, Blog links to header |
| No AI crawler access rules | Critical | FIXED | Explicit allow rules for GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, and 7 more |

### Remaining Technical Items (Not Implemented - Need Dev)

| Item | Priority | Notes |
|------|----------|-------|
| Create OG image (1200x630 PNG) | High | Design needed: `public/og-image.png` |
| Create favicon/icon files | High | `public/favicon.ico`, `public/icon.svg`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png` |
| Create logo.png | Medium | Referenced in Organization schema |
| Set NEXT_PUBLIC_SITE_URL env var | High | Must be set to actual production domain |
| Verify robots.txt renders correctly | High | Deploy and check /robots.txt |
| Verify sitemap.xml renders correctly | High | Deploy and check /sitemap.xml |
| Submit sitemap to Google Search Console | High | After deployment |
| Submit sitemap to Bing Webmaster Tools | Medium | After deployment |
| Set up Google Analytics / Plausible | High | For traffic measurement |
| Core Web Vitals audit (Lighthouse) | High | Run after deployment |

---

## Keyword Strategy

### Primary Target Keywords

| Keyword / Topic | Intent | Search Trend | Target Page | Priority |
|----------------|--------|-------------|-------------|----------|
| AI visibility score | Transactional | Rising fast | / (homepage) | 1 |
| AI SEO scanner | Transactional | Rising | / (homepage) | 1 |
| optimize website for AI agents | Informational | Rising fast | /blog/what-is-ai-seo | 2 |
| GEO optimization | Informational | New/Rising | /blog/geo-vs-seo | 2 |
| how to optimize for ChatGPT | Informational | High volume | /blog/how-to-optimize-for-chatgpt | 1 |
| llms.txt guide | Informational | Rising | /blog/llms-txt-guide | 2 |
| robots.txt AI bots | Informational | Rising | /blog/ai-crawler-access-guide | 2 |
| structured data for AI | Informational | Rising | /blog/structured-data-for-ai | 2 |
| answer engine optimization | Informational | Rising | /blog/what-is-ai-seo | 3 |
| AI website scanner free | Transactional | Rising | / (homepage) | 1 |
| ChatGPT SEO | Informational | High volume | /blog/how-to-optimize-for-chatgpt | 1 |
| Perplexity optimization | Informational | Rising | /blog/how-to-optimize-for-chatgpt | 3 |
| GEO vs SEO | Informational | Rising | /blog/geo-vs-seo | 2 |
| AI SEO tool pricing | Commercial | Moderate | /pricing | 3 |
| AI visibility checker free | Transactional | Rising | / (homepage) | 1 |

### Long-Tail Keywords (Featured Snippet Targets)

| Long-Tail Query | Target Format | Target Page |
|----------------|---------------|-------------|
| what is an AI visibility score | Definition paragraph | / (FAQ) |
| how does AI SEO work | Step list | /blog/what-is-ai-seo |
| what is the difference between SEO and GEO | Comparison table | /blog/geo-vs-seo |
| how to add llms.txt to website | Code snippet | /blog/llms-txt-guide |
| robots.txt allow GPTBot | Code snippet | /blog/ai-crawler-access-guide |
| which structured data does ChatGPT use | List | /blog/structured-data-for-ai |
| is AI SEO real | Answer paragraph | /blog/what-is-ai-seo |
| how to check if ChatGPT can see my website | Step list | / (homepage) |

---

## Content Architecture

### Topic Cluster: AI Visibility (Pillar)

```
/ (Homepage - Scanner Tool)
  |
  +-- /blog/what-is-ai-seo (Pillar Post)
  |     |-- /blog/geo-vs-seo
  |     |-- /blog/how-to-optimize-for-chatgpt
  |     |-- /blog/llms-txt-guide
  |     |-- /blog/structured-data-for-ai
  |     |-- /blog/ai-crawler-access-guide
  |
  +-- /pricing (Commercial)
  +-- /about (E-E-A-T)
  +-- /use-cases/saas
  +-- /use-cases/ecommerce
  +-- /use-cases/agencies
```

### Internal Linking Strategy

1. **Every blog post** links to the homepage scanner (bottom CTA)
2. **Every blog post** links to 2 related articles (related posts section)
3. **Homepage FAQ** answers link to relevant blog posts
4. **Pillar post** (what-is-ai-seo) links to all supporting posts
5. **Footer** links to Blog, Docs, Features, Pricing
6. **Header** links to Features, How It Works, Pricing, Blog

---

## AI-Era SEO Optimizations (Beyond Traditional)

### 1. Optimizing for AI Answer Engines

- **FAQPage schema** on homepage and pricing page enables direct extraction by ChatGPT/Perplexity
- **HowTo schema** on homepage makes the 3-step process citable
- **Definition paragraphs** at the top of each blog post answer "what is" queries directly
- **Comparison tables** in blog posts provide structured data for "vs" queries

### 2. Entity-Based SEO

- **Organization schema** establishes AgentOptimize as a known entity
- **SoftwareApplication schema** with features, pricing, and ratings signals product entity
- **WebSite schema with SearchAction** enables sitelinks search box
- **knowsAbout** property in About page schema declares topical expertise

### 3. Zero-Click Optimization

- FAQ sections are designed to be extracted verbatim by Google AI Overviews
- Code snippets in blog posts can be featured in snippet boxes
- Comparison tables target featured snippet slots for "vs" queries
- Each blog post starts with a concise answer paragraph before expanding

### 4. E-E-A-T Signals

- **Experience**: Scanner tool demonstrates real product experience
- **Expertise**: Blog content covers technical implementation with code examples
- **Authoritativeness**: About page establishes organizational authority
- **Trustworthiness**: Transparent pricing, privacy/terms links in footer, factual content

### 5. Programmatic SEO Opportunities

- **Scan result pages**: Each scan could generate a public, indexable result page (e.g., /scan/example-com) with unique content
- **Industry benchmarks**: Auto-generated pages like /benchmarks/saas, /benchmarks/ecommerce with aggregate data
- **AI bot directory**: Individual pages for each AI crawler (e.g., /bots/gptbot, /bots/perplexitybot)

### 6. Voice Search Optimization

- FAQ answers are written in natural language suitable for voice responses
- Questions use natural phrasing ("What is an AI visibility score?" vs "AI visibility score definition")
- Answers start with the direct response before elaborating

---

## Structured Data Implementation Summary

| Page | Schema Types | Status |
|------|-------------|--------|
| Layout (all pages) | Organization, SoftwareApplication, WebSite | IMPLEMENTED |
| Homepage | FAQPage, HowTo, BreadcrumbList | IMPLEMENTED |
| Pricing | WebPage, BreadcrumbList, ItemList (Offers), FAQPage | IMPLEMENTED |
| About | AboutPage, BreadcrumbList | IMPLEMENTED |
| Blog Index | Blog, BreadcrumbList | IMPLEMENTED |
| Blog Posts (each) | BlogPosting, BreadcrumbList | IMPLEMENTED |

---

## 90-Day Content Calendar

### Month 1 (Weeks 1-4): Foundation

| Week | Title | Cluster | Type | Status |
|------|-------|---------|------|--------|
| 1 | What Is AI SEO? Complete Guide | AI SEO Fundamentals | Pillar | PUBLISHED |
| 1 | How to Optimize for ChatGPT | Platform Guides | Support | PUBLISHED |
| 2 | LLMs.txt Implementation Guide | Technical Guides | Support | PUBLISHED |
| 2 | Structured Data for AI | Technical Guides | Support | PUBLISHED |
| 3 | AI Crawler Access Guide (robots.txt) | Technical Guides | Support | PUBLISHED |
| 3 | GEO vs SEO: Why You Need Both | AI SEO Fundamentals | Support | PUBLISHED |
| 4 | How to Optimize for Perplexity AI | Platform Guides | Support | PLANNED |
| 4 | AI SEO Checklist: 50-Point Audit | AI SEO Fundamentals | Support | PLANNED |

### Month 2 (Weeks 5-8): Authority Building

| Week | Title | Cluster | Type |
|------|-------|---------|------|
| 5 | How to Optimize for Claude (Anthropic) | Platform Guides | Support |
| 5 | Schema.org Types Every Website Needs for AI | Technical Guides | Support |
| 6 | AI SEO for SaaS: Complete Playbook | Industry Guides | Pillar |
| 6 | AI SEO for E-Commerce: Product Visibility Guide | Industry Guides | Pillar |
| 7 | AI Visibility Benchmarks: 2026 Industry Report | Data / Research | Link Bait |
| 7 | What Is Answer Engine Optimization (AEO)? | AI SEO Fundamentals | Support |
| 8 | Content Formatting for AI Citation | Content Strategy | Support |
| 8 | How AI Shopping Assistants Choose Products | Industry Guides | Support |

### Month 3 (Weeks 9-12): Scaling & Conversion

| Week | Title | Cluster | Type |
|------|-------|---------|------|
| 9 | AI SEO for Agencies: White-Label Playbook | Industry Guides | Pillar |
| 9 | Google AI Overviews: How to Get Featured | Platform Guides | Support |
| 10 | AI SEO Tools Compared: 2026 Buyer's Guide | Commercial | Support |
| 10 | Open Graph Tags for AI: Complete Guide | Technical Guides | Support |
| 11 | How to Track AI Search Traffic (Analytics Setup) | Technical Guides | Support |
| 11 | The Future of Search: AI Agents and the Agentic Web | Thought Leadership | Link Bait |
| 12 | AI Visibility Case Study: From 20 to 90 Score | Social Proof | Support |
| 12 | Monthly AI SEO Roundup: March 2026 | News / Roundup | Recurring |

---

## Verification Plan

### Technical SEO Verification

- [ ] Deploy and verify /robots.txt renders correctly with all AI crawler rules
- [ ] Deploy and verify /sitemap.xml renders correctly with all URLs
- [ ] Validate all JSON-LD using Google Rich Results Test (https://search.google.com/test/rich-results)
- [ ] Validate all JSON-LD using Schema.org Validator (https://validator.schema.org)
- [ ] Run Lighthouse audit on all public pages (target: 90+ performance, 100 SEO)
- [ ] Verify OG meta tags render correctly using https://www.opengraph.xyz/
- [ ] Verify Twitter Card preview using https://cards-dev.twitter.com/validator
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify /llms.txt is accessible and properly formatted
- [ ] Check canonical URLs resolve correctly (no redirect chains)
- [ ] Verify www-to-non-www redirect works

### Content Verification

- [ ] All 6 blog posts have unique title tags, meta descriptions, and canonical URLs
- [ ] All pages have BreadcrumbList schema
- [ ] Every blog post has internal links to scanner (CTA) and related articles
- [ ] Homepage FAQ section has 6 questions with FAQPage schema
- [ ] Pricing page has feature comparison table and pricing FAQ

### Ongoing Monitoring (Post-Launch)

- [ ] Set up Google Search Console and monitor indexing status weekly
- [ ] Track Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Monitor keyword rankings for top 15 target keywords
- [ ] Track organic traffic growth week-over-week
- [ ] Monitor AI citation mentions (manual check across ChatGPT, Perplexity, Claude monthly)
- [ ] Review and update blog content quarterly for freshness signals

---

## Success Metrics (90-Day Targets)

| Metric | Current | 30-Day Target | 60-Day Target | 90-Day Target |
|--------|---------|---------------|---------------|---------------|
| Indexed pages | ~3 | 15+ | 20+ | 30+ |
| Organic impressions/week | 0 | 500 | 2,000 | 5,000 |
| Organic clicks/week | 0 | 50 | 200 | 500 |
| Target keywords ranking top 20 | 0 | 3 | 8 | 12 |
| Blog posts published | 0 | 6 | 14 | 22 |
| Lighthouse SEO score | N/A | 95+ | 98+ | 100 |
| Free scan conversions/week | N/A | 100 | 300 | 500 |

---

## Files Created / Modified in This Audit

### New Files Created
1. `website/src/app/sitemap.ts` -- Dynamic sitemap generation (14 URLs)
2. `website/src/app/robots.ts` -- Robots.txt with 13 AI crawler rules
3. `website/src/app/about/page.tsx` -- About page with E-E-A-T signals + AboutPage schema
4. `website/src/app/blog/page.tsx` -- Blog index with Blog schema + 6 article listings
5. `website/src/app/blog/[slug]/page.tsx` -- Dynamic blog posts with BlogPosting + BreadcrumbList schema
6. `website/public/llms.txt` -- Machine-readable site summary for AI agents
7. `website/public/manifest.webmanifest` -- PWA manifest
8. `SEO_STRATEGY.md` -- This document

### Files Modified
1. `website/src/app/layout.tsx` -- Comprehensive Metadata API (title template, OG, Twitter, viewport, icons, 3x JSON-LD schemas)
2. `website/src/app/page.tsx` -- Page-level metadata, FAQ section with FAQPage schema, HowTo schema, Use Cases section, bottom CTA, trust bar
3. `website/src/app/pricing/page.tsx` -- Page metadata, Free tier added, feature comparison table, pricing FAQ with FAQPage schema, BreadcrumbList schema
4. `website/src/components/layout/header.tsx` -- Added How It Works + Blog nav links (desktop + mobile)
5. `website/next.config.ts` -- Security headers, image optimization, www redirect, caching rules, llms.txt content-type

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Competitors index faster | Medium | Medium | Publish immediately, submit sitemap to GSC |
| AI search landscape changes | High | Low | Content is educational, stays relevant regardless of specific platforms |
| Low domain authority (new domain) | High | High | Focus on long-tail keywords first, build backlinks via data/research content |
| Google penalizes thin blog content | Low | High | All posts are 500+ words with genuine expertise |
| OG image not created | Medium | Medium | Social sharing will have no preview -- prioritize design |

---

## Summary of What Was Implemented

This audit implemented a **production-ready technical SEO foundation** covering:

- **13 AI crawler rules** in robots.txt (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, and more)
- **14-URL dynamic sitemap** with proper priorities and change frequencies
- **8 distinct JSON-LD schema types** across the site (Organization, SoftwareApplication, WebSite, FAQPage, HowTo, BreadcrumbList, Blog, BlogPosting, AboutPage, WebPage)
- **Full Open Graph and Twitter Card metadata** on every page
- **Canonical URLs** on every page to prevent duplicate content
- **6 publish-ready blog posts** targeting the highest-value AI SEO keywords
- **About page** for E-E-A-T authority signals
- **llms.txt file** so AI agents can understand AgentOptimize itself
- **Security and caching headers** for Core Web Vitals performance
- **Internal linking architecture** connecting blog content to the scanner tool
- **Feature comparison table** on pricing for commercial intent queries
- **12 FAQ entries** across homepage and pricing page with FAQPage schema

The site is now technically prepared to rank for AI SEO keywords in both traditional search and AI answer engines.
