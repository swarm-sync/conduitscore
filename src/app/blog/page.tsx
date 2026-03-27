import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BLOG_POSTS } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "Blog - AI SEO Guides, GEO Tips & AI Visibility Insights",
  description:
    "Expert guides on AI SEO, GEO, and AEO. Learn to optimize your site for ChatGPT, Perplexity, and Claude with structured data, LLMs.txt, and content strategy.",
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

// Use shared posts from centralized source
// BLOG_POSTS imported from @/lib/blog-posts - single source of truth

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
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author,
        jobTitle: post.authorTitle,
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
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-checklist-card:hover {
          border-color: rgba(255,45,85,0.4) !important;
          box-shadow: 0 8px 32px rgba(99,102,241,0.12);
        }
      ` }} />
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

        {/* Featured resource — checklist lead magnet */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          <Link
            href="/resources/ai-visibility-checklist"
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              className="blog-checklist-card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(255,45,85,0.08) 60%, rgba(18,18,20,0.95) 100%)",
                border: "1px solid rgba(99,102,241,0.28)",
                borderRadius: "var(--radius-xl)",
                padding: "28px 28px 24px",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                transition: "border-color 200ms, box-shadow 200ms",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(217,255,0,0.1)",
                  border: "1px solid rgba(217,255,0,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "1.3rem",
                }}
                aria-hidden="true"
              >
                &#10003;
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--brand-lime)",
                    fontFamily: "var(--font-mono)",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Free Download
                </span>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-display)",
                    marginBottom: "6px",
                  }}
                >
                  The 14-Point AI Visibility Checklist
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  Every signal ChatGPT, Claude, and Perplexity use to discover your site — with copy-paste code fixes and a priority ranking.
                </p>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--brand-red)",
                  fontSize: "1.2rem",
                  marginLeft: "auto",
                  paddingLeft: "8px",
                }}
                aria-hidden="true"
              >
                &rarr;
              </div>
            </div>
          </Link>
        </div>

        {/* Entity bridge: product pages */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-0">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              padding: "20px 24px",
              background: "var(--surface-overlay)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}>
              Explore the product:
            </span>
            <Link
              href="/what-conduit-checks"
              style={{
                fontSize: "0.875rem",
                color: "var(--brand-cyan)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              What we check &rarr;
            </Link>
            <Link
              href="/methodology"
              style={{
                fontSize: "0.875rem",
                color: "var(--brand-cyan)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Our methodology &rarr;
            </Link>
            <Link
              href="/use-cases/saas"
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              SaaS use case &rarr;
            </Link>
            <Link
              href="/pricing"
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Pricing &rarr;
            </Link>
          </div>
        </div>

        {/* Post list */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-6">
            {BLOG_POSTS.map((post) => (
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
                  <span style={{ color: "var(--text-tertiary)" }} aria-hidden="true">·</span>
                  <span style={{ color: "var(--text-secondary)" }}>By {post.author}</span>
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

          {/* Ready to scan CTA */}
          <div
            style={{
              marginTop: "48px",
              padding: "36px",
              background: "var(--surface-overlay)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-xl)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Ready to see your own AI visibility score?
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Scan any website free — no signup needed. Results in 15 seconds.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  background: "var(--brand-lime)",
                  color: "#0a0a0b",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                }}
              >
                Scan My Site Free
              </Link>
              <Link
                href="/pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
