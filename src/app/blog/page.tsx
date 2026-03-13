import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "Blog - AI SEO Guides, GEO Tips & AI Visibility Insights",
  description:
    "Learn how to optimize your website for AI agents. Expert guides on AI SEO, Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), structured data, LLMs.txt, and more.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "ConduitScore Blog - AI SEO & GEO Guides",
    description:
      "Expert guides on optimizing your website for ChatGPT, Perplexity, Claude, and AI search engines.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

const posts = [
  {
    slug: "what-is-ai-seo",
    title: "What Is AI SEO? The Complete Guide to Optimizing for AI Search in 2026",
    description:
      "AI SEO (also called GEO and AEO) is the practice of optimizing your website for AI-powered search engines. Learn the difference between traditional SEO and AI SEO, and how to rank on ChatGPT, Perplexity, and Claude.",
    category: "AI SEO Fundamentals",
    date: "2026-03-01",
    readTime: "12 min read",
  },
  {
    slug: "how-to-optimize-for-chatgpt",
    title: "How to Optimize Your Website for ChatGPT Search in 2026",
    description:
      "Step-by-step guide to making your website visible in ChatGPT search results. Covers GPTBot crawler access, structured data, content formatting, and citation optimization.",
    category: "Platform Guides",
    date: "2026-03-05",
    readTime: "10 min read",
  },
  {
    slug: "llms-txt-guide",
    title: "LLMs.txt: The Complete Implementation Guide for AI Visibility",
    description:
      "Everything you need to know about the llms.txt standard. How to create, validate, and optimize your llms.txt file so AI agents can understand your website.",
    category: "Technical Guides",
    date: "2026-03-08",
    readTime: "8 min read",
  },
  {
    slug: "structured-data-for-ai",
    title: "Structured Data for AI: JSON-LD Schema That AI Agents Actually Use",
    description:
      "Which schema.org types matter most for AI visibility? Learn how to implement Organization, FAQPage, HowTo, Product, and Article schema for maximum AI citation.",
    category: "Technical Guides",
    date: "2026-03-10",
    readTime: "15 min read",
  },
  {
    slug: "ai-crawler-access-guide",
    title: "AI Crawler Access: robots.txt Configuration for GPTBot, PerplexityBot & ClaudeBot",
    description:
      "Your robots.txt might be blocking AI agents from reading your content. Learn how to configure crawler access for every major AI bot including GPTBot, PerplexityBot, ClaudeBot, and Google-Extended.",
    category: "Technical Guides",
    date: "2026-03-11",
    readTime: "7 min read",
  },
  {
    slug: "geo-vs-seo",
    title: "GEO vs SEO: Why You Need Both in 2026",
    description:
      "Generative Engine Optimization (GEO) and Search Engine Optimization (SEO) target different discovery channels. Learn when to prioritize each and how they work together.",
    category: "AI SEO Fundamentals",
    date: "2026-02-28",
    readTime: "9 min read",
  },
];

function BlogIndexJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ConduitScore Blog",
    description:
      "Expert guides on AI SEO, Generative Engine Optimization, and AI visibility.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "ConduitScore",
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Organization",
        name: "ConduitScore",
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

export default function BlogPage() {
  return (
    <>
      <BlogIndexJsonLd />
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)" }}>
        {/* Hero section */}
        <section
          className="hero-grid"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "96px",
            paddingBottom: "72px",
          }}
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="section-label mb-4 block">The ConduitScore Blog</span>
            <h1 className="gradient-text">
              AI SEO Blog
            </h1>
            <p
              className="mt-4 text-lg mx-auto"
              style={{ color: "var(--text-secondary)", maxWidth: "560px" }}
            >
              Expert guides on optimizing your website for ChatGPT, Perplexity, Claude, and the new era of AI search.
            </p>
          </div>
        </section>

        {/* Post list */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="card rounded-xl p-8 group"
                style={{ backgroundColor: "var(--surface-overlay)" }}
              >
                {/* Meta row */}
                <div
                  className="flex flex-wrap items-center gap-3 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="badge badge-cyan"
                  >
                    {post.category}
                  </span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span style={{ color: "var(--text-tertiary)" }}>{post.readTime}</span>
                </div>

                {/* Title */}
                <h2
                  className="mt-4 text-xl font-bold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                    className="transition-colors group-hover:text-cyan-400"
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Description */}
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {post.description}
                </p>

                {/* Read more */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: "var(--cyan-400)", textDecoration: "none" }}
                >
                  Read full article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
