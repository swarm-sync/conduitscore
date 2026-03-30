import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "What ConduitScore Checks — 7 AI Visibility Categories",
  description:
    "Every check ConduitScore runs across 7 AI visibility categories: Crawler Access, Structured Data, LLMs.txt, Content Structure, Technical Health, Citation Signals, and Content Quality.",
  alternates: {
    canonical: `${SITE_URL}/what-conduit-checks`,
  },
  openGraph: {
    title: "What ConduitScore Checks — 7 AI Visibility Categories",
    description:
      "See exactly what ConduitScore evaluates across 7 categories that determine whether AI agents like ChatGPT, Perplexity, and Claude can find and cite your website.",
    url: `${SITE_URL}/what-conduit-checks`,
    type: "website",
  },
};

function WhatConduitChecksJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "What ConduitScore Checks — 7 AI Visibility Categories",
    description:
      "A detailed breakdown of every check ConduitScore runs across 7 AI visibility categories.",
    url: `${SITE_URL}/what-conduit-checks`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "What ConduitScore Checks",
          item: `${SITE_URL}/what-conduit-checks`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

const categories = [
  {
    id: "crawler-access",
    name: "Crawler Access",
    points: 15,
    whyMatters:
      "If AI bots are blocked by robots.txt or missing from your allowed crawlers list, they cannot index or cite your content — no matter how good it is. Crawler access is a prerequisite for any AI visibility. Beyond just avoiding blocks, ConduitScore detects and flags explicit Allow: / rules for each major AI crawler as a positive signal — distinguishing sites actively optimizing for AI versus those that simply have not blocked it yet.",
    checks: [
      "robots.txt presence and AI bot access rules (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot)",
      "Explicit Allow rules for AI crawlers (signals AI-friendliness beyond passive permission)",
      "Sitemap directive in robots.txt",
      "sitemap.xml presence and accessibility",
      "Blocked important pages or assets",
      "Crawlable HTML availability",
    ],
    issue: "GPTBot is blocked in robots.txt",
    fix: "Add explicit Allow rules for each AI crawler in robots.txt: `User-agent: GPTBot\\nAllow: /` — and repeat for ClaudeBot, PerplexityBot, and OAI-SearchBot. Explicit Allow rules (not just the absence of Disallow) signal proactive AI-friendliness.",
  },
  {
    id: "structured-data",
    name: "Structured Data",
    points: 20,
    whyMatters:
      "JSON-LD schema gives AI systems a machine-readable understanding of your organization, content type, and site structure. Without it, AI agents have to guess what your pages are about — and they often guess wrong.",
    checks: [
      "Organization schema (JSON-LD)",
      "WebSite schema with potential SearchAction",
      "FAQPage schema for Q&A content",
      "BreadcrumbList schema for navigation",
      "Article/BlogPosting schema for content pages",
    ],
    issue: "No Organization schema found",
    fix: "Add a JSON-LD Organization block to your `<head>` with your name, URL, logo, and description.",
  },
  {
    id: "llms-txt",
    name: "LLMs.txt",
    points: 10,
    whyMatters:
      "The /llms.txt file is the AI equivalent of sitemap.xml — it tells AI agents exactly which pages are important and what your site is for. Sites with a well-structured llms.txt are easier to summarize, cite, and recommend. The companion /llms-full.txt file goes further — it is designed for autonomous AI agents that need comprehensive instructions, not just a page index. The HTML meta tags (<link rel=\"llms-full\"> and <link rel=\"agent-manifest\">) act as machine-readable pointers that help agent frameworks discover your AI-readiness before they even request a file.",
    checks: [
      "File existence at /llms.txt",
      "File readability and structure (sections, headers)",
      "Number of URLs listed",
      "Whether key pages (about, pricing, docs) are referenced",
      "/llms-full.txt companion file presence",
      '<link rel="llms-full"> meta tag in HTML head',
      '<link rel="agent-manifest"> meta tag for AI agent discovery',
    ],
    issue: "No /llms.txt file found",
    fix: "Create a public/llms.txt file at the root of your site that lists your key pages with short descriptions. Consider also adding /llms-full.txt with comprehensive AI agent instructions. See llmstxt.org for the standard format.",
  },
  {
    id: "content-structure",
    name: "Content Structure",
    points: 15,
    whyMatters:
      "AI systems parse content the same way screen readers and structured data parsers do. Clear heading hierarchies, semantic HTML, and FAQ sections make it far easier for AI to extract and attribute answers from your content.",
    checks: [
      "Single H1 tag (exactly one)",
      "Multiple H2 subheadings",
      "H3 subsections",
      "Introductory paragraph near page top",
      "FAQ or Q&A section detection",
      "Semantic HTML (article, main, section)",
    ],
    issue: "Page has no H2 subheadings",
    fix: "Break long content pages into clearly labeled sections using H2 tags. Each major topic should have its own heading.",
  },
  {
    id: "technical-health",
    name: "Technical Health",
    points: 15,
    whyMatters:
      "Slow pages, missing canonical tags, or accidental noindex directives can prevent AI crawlers from successfully reading your content. Technical health ensures your pages are actually reachable and indexable.",
    checks: [
      "Page load speed (target: under 2 seconds)",
      "Canonical tag presence",
      "noindex directive detection",
      "Viewport meta tag",
      "Meta description presence",
      "Charset declaration",
    ],
    issue: "noindex meta tag found on a public-facing page",
    fix: "Remove `<meta name='robots' content='noindex'>` from pages you want AI agents to crawl and cite.",
  },
  {
    id: "citation-signals",
    name: "Citation Signals",
    points: 15,
    whyMatters:
      "AI agents are more likely to cite sources that demonstrate credibility, authorship, and institutional identity. Sites with clear author information, external links to authoritative sources, and trust pages rank higher for citation likelihood.",
    checks: [
      "External links to authoritative sources",
      "About page link",
      "Contact page link",
      "Author attribution (meta or HTML class)",
      "Organization identity signals",
      "Legal/trust pages (privacy, terms)",
    ],
    issue: "No author attribution found",
    fix: "Add author information using a `<meta name='author'>` tag, or mark up author names with `itemprop='author'` in your HTML.",
  },
  {
    id: "content-quality",
    name: "Content Quality",
    points: 10,
    whyMatters:
      "Thin, undated, or poorly titled content is less likely to be cited by AI systems. Longer content with good structure, clear publish dates, and quality title/description gives AI agents more confidence in using it as a source.",
    checks: [
      "Word count (target: 1000+ words for key pages)",
      "Title tag quality",
      "Meta description length (target: 50+ characters)",
      "Publish or updated date",
      "Paragraph count and structure",
    ],
    issue: "Meta description is too short (under 50 characters)",
    fix: "Write a meta description of 50–160 characters that accurately summarizes the page content. This helps AI agents understand what the page is about before reading it.",
  },
];

export default function WhatConduitChecksPage() {
  return (
    <>
      <WhatConduitChecksJsonLd />
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)" }}>
        {/* Hero */}
        <section
          className="hero-grid"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "96px",
            paddingBottom: "72px",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav
              className="mb-6 flex items-center gap-2 text-xs"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              >
                Home
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                What ConduitScore Checks
              </span>
            </nav>

            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--brand-cyan)",
                marginBottom: "16px",
              }}
            >
              7 Categories
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.034em",
                lineHeight: 1.1,
                color: "var(--text-primary)",
              }}
            >
              What ConduitScore Checks
            </h1>
            <p
              style={{
                marginTop: "24px",
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                maxWidth: "600px",
              }}
            >
              ConduitScore evaluates any website across 7 categories that
              determine how well AI agents — including ChatGPT, Perplexity,
              Claude, and Gemini — can access, understand, and cite your
              content. Here is exactly what each category checks, why it
              matters, and what common issues look like.
            </p>
          </div>
        </section>

        {/* Category sections */}
        <div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "64px", paddingBottom: "48px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
            {categories.map((cat, idx) => (
              <section key={cat.id} id={cat.id}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(0,217,255,0.08)",
                      border: "1px solid rgba(0,217,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "var(--brand-cyan)",
                      }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.375rem, 3vw, 1.75rem)",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.03em",
                      margin: 0,
                    }}
                  >
                    {cat.name}
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--text-tertiary)",
                        letterSpacing: "normal",
                      }}
                    >
                      ({cat.points} pts)
                    </span>
                  </h2>
                </div>

                {/* What it checks */}
                <h3
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--text-tertiary)",
                    margin: "0 0 10px 0",
                  }}
                >
                  What it checks
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {cat.checks.map((check) => (
                    <li
                      key={check}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: "4px",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "var(--brand-cyan)",
                          opacity: 0.6,
                        }}
                        aria-hidden="true"
                      />
                      {check}
                    </li>
                  ))}
                </ul>

                {/* Why it matters */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px 20px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Why it matters for AI visibility
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {cat.whyMatters}
                  </p>
                </div>

                {/* Common issue + fix */}
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px 20px",
                    background: "rgba(255,45,85,0.04)",
                    border: "1px solid rgba(255,45,85,0.15)",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--brand-red)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Common Issue
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                    }}
                  >
                    {cat.issue}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--brand-lime)",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Fix
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {cat.fix}
                  </p>
                </div>
              </section>
            ))}
          </div>

          {/* Related Concepts */}
          <section
            aria-labelledby="related-concepts-heading"
            style={{
              marginTop: "64px",
              padding: "36px",
              background: "var(--surface-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
            }}
          >
            <h2
              id="related-concepts-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: "20px",
              }}
            >
              Related Concepts and Deep Dives
            </h2>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {[
                {
                  href: "/blog/what-is-ai-seo",
                  title: "AI SEO vs Traditional SEO",
                  desc: "Understand the fundamental differences between optimizing for search engines and optimizing for AI agents.",
                },
                {
                  href: "/blog/how-to-optimize-for-chatgpt",
                  title: "How to Optimize for ChatGPT",
                  desc: "Step-by-step implementation guide for making your site visible and citable in ChatGPT responses.",
                },
                {
                  href: "/blog/ai-crawler-access-guide",
                  title: "Crawler Access Configuration",
                  desc: "Detailed robots.txt and sitemap guide for allowing GPTBot, ClaudeBot, and PerplexityBot.",
                },
                {
                  href: "/blog/structured-data-for-ai",
                  title: "Structured Data for AI",
                  desc: "JSON-LD schema examples and implementation patterns for AI-readable content.",
                },
                {
                  href: "/blog/llms-txt-guide",
                  title: "LLMs.txt Implementation Guide",
                  desc: "How to create and structure an llms.txt file that AI agents can use to understand your site.",
                },
              ].map((item) => (
                <li key={item.href} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: "5px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--brand-cyan)",
                      opacity: 0.7,
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <Link
                      href={item.href}
                      style={{
                        color: "var(--brand-cyan)",
                        textDecoration: "none",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </Link>
                    <span style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>
                      {" "}&mdash; {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div
            style={{
              marginTop: "80px",
              background: "var(--surface-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: "12px",
              }}
            >
              Run a Free Scan to See Your Results
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                marginBottom: "24px",
                maxWidth: "440px",
                marginInline: "auto",
              }}
            >
              Get your 0–100 AI visibility score across all 7 categories, plus
              prioritized copy-paste fixes. No sign-up required.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6C3BFF 0%, #00D9FF 100%)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9375rem",
                boxShadow: "0 2px 12px rgba(108,59,255,0.40)",
              }}
            >
              Scan Your Website Free →
            </Link>
            <p
              style={{
                marginTop: "16px",
                fontSize: "0.8125rem",
                color: "var(--text-tertiary)",
              }}
            >
              See also:{" "}
              <Link
                href="/methodology"
                style={{ color: "var(--brand-cyan)", textDecoration: "none" }}
              >
                Methodology
              </Link>{" "}
              &middot;{" "}
              <Link
                href="/sample-reports/mid-score"
                style={{ color: "var(--brand-cyan)", textDecoration: "none" }}
              >
                Sample Reports
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
