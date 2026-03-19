import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const dynamic = "force-dynamic";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
}

const posts: Record<string, BlogPost> = {
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

If your robots.txt blocks these bots (which is the default on many platforms), ChatGPT literally cannot see your website.

## Step 2: Implement JSON-LD Structured Data

ChatGPT relies heavily on structured data to understand what your pages are about. The most impactful schemas for ChatGPT visibility are:

- **Organization**: Tells ChatGPT who you are
- **FAQPage**: Makes your Q&A directly extractable
- **HowTo**: Step-by-step content that ChatGPT can cite
- **Product**: Product details for shopping queries
- **Article**: Blog and editorial content metadata

## Step 3: Structure Content for Extraction

ChatGPT does not read your page like a human. It parses structured content. To maximize citations:

- Use clear H1/H2/H3 heading hierarchies
- Write answer-ready paragraphs (start with the answer, then explain)
- Include definition-style content for "what is" queries
- Add comparison tables for "vs" and "best" queries
- Include numbered lists for "how to" queries

## Step 4: Create a llms.txt File

While still an emerging standard, llms.txt provides a machine-readable summary of your entire website. Place it at your domain root (/llms.txt) with a Markdown-formatted overview of your key pages, products, and content.

## Step 5: Monitor Your ChatGPT Visibility

Use ConduitScore to scan your website and track your AI visibility score over time. The tool specifically checks whether GPTBot and OAI-SearchBot can access your site and whether your content is structured for ChatGPT extraction.`,
    category: "Platform Guides",
    date: "2026-03-05",
    readTime: "10 min read",
  },
  "llms-txt-guide": {
    slug: "llms-txt-guide",
    title: "LLMs.txt: The Complete Implementation Guide for AI Visibility",
    description:
      "Everything you need to know about the llms.txt standard. How to create, validate, and optimize your llms.txt file.",
    content: `The llms.txt standard, proposed by Jeremy Howard of Answer.AI, is a plain-text Markdown file hosted at your website's root directory that provides a concise, machine-readable map of your site's most important content.

## What Is llms.txt?

Think of llms.txt as a "table of contents for AI agents." While robots.txt tells crawlers what they can and cannot access, llms.txt tells AI agents what your site is about and where to find the most important information.

## How to Create Your llms.txt

Create a file called \`llms.txt\` in your website's public/root directory. Format it as Markdown with these sections:

\`\`\`markdown
# Your Company Name

> One-line description of what your company does

A 2-3 sentence overview of your business, products, and target audience.

## Key Pages

- [Homepage](https://yoursite.com/): Brief description
- [Product](https://yoursite.com/product): Brief description
- [Pricing](https://yoursite.com/pricing): Brief description
- [Blog](https://yoursite.com/blog): Brief description

## Products/Services

List your main products or services with brief descriptions.

## Contact

- Website: https://yoursite.com
- Email: contact@yoursite.com
\`\`\`

## Best Practices

1. **Keep it concise**: AI agents have context windows. Aim for under 2,000 words.
2. **Use Markdown formatting**: Headers, lists, and links are machine-parseable.
3. **Include your most important URLs**: Focus on pages you want AI to cite.
4. **Update regularly**: Keep it current with your latest content and offerings.
5. **Validate it**: Use ConduitScore's LLMs.txt checker to ensure proper formatting.

## Current Adoption Status

While no major AI company has officially confirmed they use llms.txt at inference time, the standard is gaining adoption across AI-first companies. Having a well-structured llms.txt file positions your website favorably as the standard matures.`,
    category: "Technical Guides",
    date: "2026-03-08",
    readTime: "8 min read",
  },
  "structured-data-for-ai": {
    slug: "structured-data-for-ai",
    title: "Structured Data for AI: JSON-LD Schema That AI Agents Actually Use",
    description:
      "Which schema.org types matter most for AI visibility? Learn how to implement Organization, FAQPage, HowTo, Product, and Article schema.",
    content: `Structured data is the single most impactful technical optimization for AI visibility. AI agents like ChatGPT, Perplexity, and Claude use JSON-LD schema markup to understand the entities, relationships, and facts on your website.

## Why Structured Data Matters for AI

When an AI agent crawls your page, it sees HTML. Structured data (JSON-LD) provides a machine-readable layer that explicitly states: "This page is about [entity], it has [attributes], and it relates to [other entities]." Without it, AI agents must infer meaning -- and they often get it wrong or skip your content entirely.

## The Top 5 Schemas for AI Visibility

### 1. Organization Schema
Every website should have Organization schema on the homepage. It tells AI agents who you are, what you do, and how to contact you.

### 2. FAQPage Schema
FAQPage schema is the most citation-friendly schema type. When AI agents search for answers, FAQPage schema provides pre-formatted question-answer pairs that are trivially easy to cite.

### 3. HowTo Schema
For instructional content, HowTo schema structures your steps into a machine-readable format. AI agents love citing step-by-step content.

### 4. Product Schema
If you sell products or services, Product schema with pricing, features, and reviews makes your offerings visible to AI shopping assistants.

### 5. Article/BlogPosting Schema
For editorial content, Article schema provides authorship, publication date, and topic metadata that AI agents use to assess content quality and recency.

## Implementation in Next.js

In Next.js, the recommended approach is server-rendered JSON-LD:

\`\`\`tsx
function PageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [{
      "@type": "Question",
      name: "Your question here?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your answer here."
      }
    }]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
\`\`\`

## Validation

Always validate your structured data using Google's Rich Results Test and the Schema.org Validator. ConduitScore's structured data analyzer also checks for AI-specific schema implementation.`,
    category: "Technical Guides",
    date: "2026-03-10",
    readTime: "15 min read",
  },
  "ai-crawler-access-guide": {
    slug: "ai-crawler-access-guide",
    title: "AI Crawler Access: robots.txt Configuration for GPTBot, PerplexityBot & ClaudeBot",
    description:
      "Your robots.txt might be blocking AI agents. Learn how to configure crawler access for every major AI bot.",
    content: `If AI agents cannot crawl your website, nothing else matters. Your robots.txt file is the first thing every AI crawler checks -- and most websites are accidentally blocking the AI bots that power ChatGPT, Perplexity, Claude, and Gemini.

## The Complete List of AI Crawlers

| Bot Name | Company | Purpose |
|----------|---------|---------|
| GPTBot | OpenAI | General crawling for ChatGPT |
| OAI-SearchBot | OpenAI | ChatGPT search results |
| ChatGPT-User | OpenAI | Real-time browsing by ChatGPT |
| PerplexityBot | Perplexity | Perplexity search and answers |
| ClaudeBot | Anthropic | Claude web browsing |
| Claude-Web | Anthropic | Claude web search |
| Google-Extended | Google | Gemini AI training and search |
| Amazonbot | Amazon | Alexa and Amazon search |
| Bingbot | Microsoft | Copilot and Bing AI |
| cohere-ai | Cohere | Cohere AI models |
| anthropic-ai | Anthropic | Anthropic general crawling |

## Recommended robots.txt Configuration

\`\`\`
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
\`\`\`

## Common Mistakes

1. **Blanket blocking**: Many CMS platforms and hosting providers block all unknown bots by default.
2. **Forgetting OAI-SearchBot**: GPTBot is not the only OpenAI crawler. OAI-SearchBot powers search.
3. **Blocking /api/ but not /dashboard/**: Protect private routes, but allow public content.
4. **No sitemap reference**: Including your sitemap URL helps AI crawlers discover all your pages.

## How to Test

Use ConduitScore to scan your URL -- our Crawler Access analyzer checks every major AI bot against your robots.txt and reports which ones are blocked.`,
    category: "Technical Guides",
    date: "2026-03-11",
    readTime: "7 min read",
  },
  "geo-vs-seo": {
    slug: "geo-vs-seo",
    title: "GEO vs SEO: Why You Need Both in 2026",
    description:
      "Generative Engine Optimization (GEO) and traditional SEO target different discovery channels. Learn when to prioritize each.",
    content: `In 2026, search is split into two distinct channels: traditional search engines (Google, Bing) and AI-powered answer engines (ChatGPT, Perplexity, Claude, Gemini). Each requires a different optimization strategy.

## What Is GEO?

Generative Engine Optimization (GEO) is the practice of optimizing content to be discovered, cited, and recommended by AI-powered answer engines. Unlike SEO, which aims to rank pages in search results, GEO aims to get your content included in AI-generated responses.

## What Is AEO?

Answer Engine Optimization (AEO) is a closely related term that focuses specifically on optimizing for question-answering AI systems. While GEO covers all generative AI, AEO focuses on the Q&A use case.

## Key Differences

| Dimension | SEO | GEO/AEO |
|-----------|-----|---------|
| Target | Google/Bing SERPs | AI-generated answers |
| Format | Keyword-optimized pages | Entity-rich, structured content |
| Success metric | Rankings, clicks | Citations, mentions, recommendations |
| Technical focus | Page speed, mobile | Structured data, crawler access |
| Content style | Keyword density, length | Comprehensiveness, authority, recency |
| Link strategy | Backlinks | Citation signals |

## Why You Need Both

SEO is not dead. Google still processes over 8.5 billion searches per day. But AI search is growing at 300% year-over-year. The websites that will dominate in 2026 and beyond are those that optimize for both channels simultaneously.

The good news: many GEO optimizations also improve traditional SEO. Structured data helps Google rich results. Quality content ranks better on both Google and AI. Clear content structure improves user experience and AI readability.

## How to Audit Both

ConduitScore provides a unified AI visibility score that covers all 7 categories relevant to both GEO and traditional SEO compliance. Scan your website to see where you stand across both channels.`,
    category: "AI SEO Fundamentals",
    date: "2026-02-28",
    readTime: "9 min read",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["ConduitScore"],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function BlogPostJsonLd({ post }: { post: BlogPost }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "ConduitScore",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ConduitScore",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-master.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

/**
 * renderInlineMarkdown
 * Processes inline markdown within a plain-text string and returns React nodes.
 * Handles: **bold**, `inline code`, and plain text segments.
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Split on **bold** and `code` markers, keeping the delimiters in the array
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85em",
            color: "var(--cyan-300)",
            backgroundColor: "var(--surface-sunken)",
            padding: "1px 5px",
            borderRadius: "4px",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <>
      <BlogPostJsonLd post={post} />
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)" }}>
        {/* Hero / article header */}
        <section
          className="hero-grid"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "80px",
            paddingBottom: "56px",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav
              className="mb-6 flex flex-wrap items-center gap-2 text-xs"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                className="hover:text-cyan-400 transition-colors"
              >
                Home
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <Link
                href="/blog"
                style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                className="hover:text-cyan-400 transition-colors"
              >
                Blog
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  maxWidth: "240px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {post.title}
              </span>
            </nav>

            {/* Category + meta */}
            <div
              className="flex flex-wrap items-center gap-3 text-xs mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="badge badge-cyan">{post.category}</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span style={{ color: "var(--text-tertiary)" }}>{post.readTime}</span>
            </div>

            <h1 style={{ color: "var(--text-primary)" }}>{post.title}</h1>
            <p
              className="mt-4 text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {post.description}
            </p>
          </div>
        </section>

        {/* Article body */}
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <div>
            {paragraphs.map((para, i) => {
              // H2
              if (para.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-12 mb-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {renderInlineMarkdown(para.replace("## ", ""))}
                  </h2>
                );
              }
              // H3
              if (para.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="mt-8 mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {renderInlineMarkdown(para.replace("### ", ""))}
                  </h3>
                );
              }
              // Fenced code block
              if (para.startsWith("```")) {
                const code = para.replace(/```\w*\n?/g, "").trim();
                return (
                  <pre
                    key={i}
                    className="code-block mt-6 mb-6"
                  >
                    <code>{code}</code>
                  </pre>
                );
              }
              // Markdown table
              if (para.startsWith("|")) {
                const rows = para.split("\n").filter((r) => !r.match(/^\|[-\s|]+\|$/));
                return (
                  <div key={i} className="mt-6 mb-6 overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
                    <table className="w-full text-sm">
                      <tbody>
                        {rows.map((row, ri) => {
                          const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                          const Tag = ri === 0 ? "th" : "td";
                          return (
                            <tr
                              key={ri}
                              style={{
                                backgroundColor:
                                  ri === 0
                                    ? "var(--surface-elevated)"
                                    : ri % 2 === 0
                                    ? "var(--surface-raised)"
                                    : "transparent",
                                borderTop: ri !== 0 ? "1px solid var(--border-subtle)" : undefined,
                              }}
                            >
                              {cells.map((cell, ci) => (
                                <Tag
                                  key={ci}
                                  className="px-4 py-3 text-left"
                                  style={{
                                    color:
                                      ri === 0
                                        ? "var(--text-primary)"
                                        : "var(--text-secondary)",
                                    fontWeight: ri === 0 ? 600 : 400,
                                  }}
                                >
                                  {renderInlineMarkdown(cell)}
                                </Tag>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              // Numbered list with bold items (e.g. "1. **Title**: desc")
              if (para.match(/^\d+\.\s\*\*/)) {
                const items = para.split("\n").filter(Boolean);
                return (
                  <ol key={i} className="mt-5 mb-5 space-y-3 list-decimal list-inside">
                    {items.map((item, ii) => {
                      const withoutNumber = item.replace(/^\d+\.\s/, "");
                      return (
                        <li
                          key={ii}
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {renderInlineMarkdown(withoutNumber)}
                        </li>
                      );
                    })}
                  </ol>
                );
              }
              // Unordered list (lines starting with "- ")
              if (para.match(/^-\s/m)) {
                const items = para.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="mt-5 mb-5 space-y-2 list-disc list-inside">
                    {items.map((item, ii) => {
                      const content = item.replace(/^-\s/, "");
                      return (
                        <li
                          key={ii}
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {renderInlineMarkdown(content)}
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              // Default paragraph
              return (
                <p
                  key={i}
                  className="mt-5 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {renderInlineMarkdown(para)}
                </p>
              );
            })}
          </div>

          {/* CTA block */}
          <div
            className="mt-20 rounded-2xl p-px"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div
              className="rounded-2xl p-10 text-center"
              style={{ backgroundColor: "var(--surface-elevated)" }}
            >
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Check Your AI Visibility Score
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                See how your website performs across all 7 categories in 30 seconds.
              </p>
              <Link
                href="/"
                className="btn btn-primary btn-lg mt-6 inline-flex"
              >
                Scan Your Website Free
              </Link>
            </div>
          </div>

          {/* Related articles */}
          <div className="mt-16">
            <h3
              className="text-lg font-bold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Related Articles
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.values(posts)
                .filter((p) => p.slug !== post.slug)
                .slice(0, 2)
                .map((related) => (
                  <a
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="card rounded-xl p-5 block transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--surface-overlay)",
                      textDecoration: "none",
                    }}
                  >
                    <span className="badge badge-cyan">{related.category}</span>
                    <h4
                      className="mt-3 text-sm font-semibold leading-snug line-clamp-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {related.title}
                    </h4>
                    <span
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: "var(--cyan-400)" }}
                    >
                      Read article
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
