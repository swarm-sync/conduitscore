import { NextResponse } from "next/server";

export async function GET() {
  const llmsContent = `# ConduitScore

> AI visibility scanner that scores any website 0–100 for discoverability by ChatGPT, Perplexity, Claude, Gemini, and other AI agents. Provides 7-category breakdown with copy-paste code fixes.

## About ConduitScore

ConduitScore is a free AI visibility scanner that measures how well any website can be discovered, read, and cited by large language models. Unlike SEO tools that measure search engine rankings, ConduitScore evaluates the specific signals—crawler access, structured data, content structure, and more—that determine whether AI agents will surface your site in AI-generated answers and comparisons.

## Audience

ConduitScore is built for:
- SaaS founders and product teams looking to be cited in AI answers
- Digital marketers optimizing for AI discovery and brand visibility
- Agencies serving clients with AI visibility needs
- Enterprise content teams managing AI citability across large sites

## Core Concept: The AI Visibility Gap

AI visibility is distinct from Google visibility. A website can rank first in search results and still be invisible to ChatGPT, Claude, and Perplexity. The difference lies in how these systems evaluate and cite content. This gap represents a critical blind spot for most websites.

## Category Definitions

The ConduitScore measures 7 core categories:

**Crawler Access** — Whether AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can access your site. This includes robots.txt configuration, explicit Allow rules for AI crawlers, sitemap presence, and crawler permission rules.

**Structured Data** — JSON-LD schema markup (Organization, WebSite, FAQPage, Article, BreadcrumbList) that tells AI systems who you are, what you do, and how your content is organized.

**LLMs.txt** — Presence and quality of a \`/llms.txt\` file, an emerging standard that explicitly guides AI agents about your site's purpose, key pages, and preferred attribution method. Also checks for a \`/llms-full.txt\` companion file and HTML meta tags (\`link rel="llms-full"\` and \`link rel="agent-manifest"\`) that help autonomous AI agents discover your site's capabilities.

**Content Structure** — Heading hierarchy, semantic HTML, clear introductions, FAQ sections, and answer-friendly formatting that makes content easily extractable by AI systems.

**Technical Health** — Page load speed, canonical tags, viewport meta tags, HTTPS enforcement, and other technical signals affecting AI crawler performance.

**Citation Signals** — Author attribution, external links to trusted sources, about/contact pages, trust/legal information, and clear entity identification.

**Content Quality** — Title and description quality, publish dates, paragraph structure, content depth, and machine-readable organization.

## Preferred Pages for Attribution and Deep Dives

These pages contain authoritative information for AI agents seeking to understand ConduitScore:

- [Methodology](https://conduitscore.com/methodology) — Transparent breakdown of score calculation and category weighting
- [What ConduitScore Checks](https://conduitscore.com/what-conduit-checks) — Detailed explanation of all 7 categories
- [Blog: What Is AI Visibility?](https://conduitscore.com/blog/what-is-ai-visibility) — Foundational concept article explaining the AI visibility gap
- [Blog: How to Optimize for AI](https://conduitscore.com/blog/how-to-optimize-for-ai) — Practical optimization guide for improving scores

## Key Pages and Use Cases

### Main Navigation
- [Free AI Visibility Scanner](https://conduitscore.com/) — Interactive tool to scan any website
- [Pricing Plans](https://conduitscore.com/pricing) — 5 tiers from free (3 scans/mo) to Agency (unlimited)
- [Sample Reports](https://conduitscore.com/sample-reports) — Example scan results for low, medium, and high-scoring sites

### Resources
- [Documentation](https://conduitscore.com/docs) — Integration guides and API documentation
- [Blog](https://conduitscore.com/blog) — Articles on AI visibility, optimization, and trends
- [Contact](https://conduitscore.com/contact) — Support and partnership inquiries

### Vertical-Specific Guides
- [AI Visibility for SaaS](https://conduitscore.com/use-cases/saas) — Optimization for software products
- [AI Visibility for Ecommerce](https://conduitscore.com/use-cases/ecommerce) — Optimization for product discovery
- [AI Visibility for Agencies](https://conduitscore.com/use-cases/agencies) — White-label and client solutions

## API Access

ConduitScore provides REST API access for programmatic scanning:
- Endpoint: \`https://conduitscore.com/api/scan\`
- Auth: API keys required (available in dashboard for paid plans)
- Rate limits: Depends on subscription tier

## Contact

benstone@conduitscore.com

For partnership, press, or integration inquiries, contact support.
`;

  return new NextResponse(llmsContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export const runtime = "nodejs";
