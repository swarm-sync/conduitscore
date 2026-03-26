import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BLOG_POSTS_MAP, type BlogPost } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_MAP[slug];
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
        url: `${SITE_URL}/conduitscore_mark.svg`,
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
  const post = BLOG_POSTS_MAP[slug];
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
              {Object.values(BLOG_POSTS_MAP)
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
