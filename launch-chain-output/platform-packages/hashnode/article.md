---
title: "I Built a Tool to Score Websites for AI Visibility — Here's What I Found"
subtitle: "After scanning hundreds of sites, the median score is 42/100. Most of the fixes are trivial."
tags: [seo, ai, tools, webdev]
---

# I Built a Tool to Score Websites for AI Visibility — Here's What I Found

Last year I started noticing that ChatGPT kept citing the same handful of sites for topics where I knew there were better sources. After enough instances of this, I got curious: what was different about the sites that got cited?

After a few weeks of analysis, the pattern was clear. It wasn't content quality. It was structure.

## What I Built

[ConduitScore](https://conduitscore.com) is a web scanner that checks seven categories of AI-visibility signals and returns a 0–100 score. You paste a URL, it fetches the page along with robots.txt, sitemap.xml, and llms.txt, runs seven analyzers, and returns:

- A score per category
- Every issue found, with severity and score impact
- A specific code fix for each issue
- An effort estimate (trivial / low / medium / high)

It's built on Next.js 16, Neon PostgreSQL via Prisma, and deployed on Vercel. The scan itself runs seven parallel analyzers and completes in under 10 seconds for most sites.

## What I Found After Scanning ~500 Sites

**The median AI visibility score is 42/100.**

The distribution is roughly:
- 0–30: ~20% of sites (these are being actively blocked or have severe structural issues)
- 31–55: ~55% of sites (the typical "maintained but not optimized" site)
- 56–75: ~20% of sites (sites that have done some intentional technical work)
- 76–100: ~5% of sites (sites with active AI SEO programs)

**The most common failures:**
1. No llms.txt file: 85% of sites
2. Missing structured data beyond basic OG tags: 70% of sites  
3. No author/date metadata on content pages: 60% of sites
4. robots.txt that doesn't explicitly permit AI crawlers: 40% of sites

**The most impactful quick wins:**
1. Add llms.txt (30 minutes, moves score 8-12 points)
2. Add crawler permissions to robots.txt (15 minutes, moves score 5-8 points)
3. Add JSON-LD Article schema to content pages (2-4 hours, moves score 10-15 points)

## The Technical Architecture

The seven analyzers run in parallel via `Promise.all()`. Each returns a `CategoryScore` with:
- Category name and weight
- Score (0-100)
- Array of `Issue` objects (title, description, severity, fix, scoreImpact, effort)

The orchestrator aggregates into an overall score using weighted averaging. Fixes are gated by tier — free users see the top-severity fix, paid users see all.

I'm considering open-sourcing the scoring rubric as a standalone package. Happy to hear if there's interest.

## Try It

[conduitscore.com](https://conduitscore.com) — free, no account required for first scan.

If you run it on your site and something about the score seems wrong, I'd genuinely like to know. The methodology is evolving.

---

*Tags: #seo #ai #webdev #tools*
