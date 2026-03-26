import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "Sample ConduitScore Report — High Score (88/100)",
  description:
    "See what a high ConduitScore report looks like. A score of 88/100 shows a well-optimized site with strong AI visibility across most categories and only minor improvements remaining.",
  alternates: {
    canonical: `${SITE_URL}/sample-reports/high-score`,
  },
  openGraph: {
    title: "Sample ConduitScore Report — High Score (88/100)",
    description:
      "Example ConduitScore report for a well-optimized website near the top of the AI visibility range.",
    url: `${SITE_URL}/sample-reports/high-score`,
    type: "website",
  },
};

function HighScoreJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sample ConduitScore Report — High Score (88/100)",
    description:
      "Example ConduitScore report showing a highly optimized site scoring 88 out of 100.",
    url: `${SITE_URL}/sample-reports/high-score`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "High Score Example",
          item: `${SITE_URL}/sample-reports/high-score`,
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

const issues = [
  {
    title: "No publish date found",
    category: "Content Quality",
    severity: "info" as const,
    description:
      "Adding a visible and machine-readable publish or updated date increases content credibility and AI citation confidence.",
    fix: "Add a `<time datetime='YYYY-MM-DD'>` element near your article or a `datePublished` field in your Article JSON-LD.",
  },
  {
    title: "llms.txt lists few URLs",
    category: "LLMs.txt",
    severity: "info" as const,
    description:
      "Your /llms.txt exists and is valid, but only references a few pages. Expanding it to cover more key pages improves AI navigation efficiency.",
    fix: "Add your pricing, documentation, blog, and case study pages to /llms.txt with short descriptions for each.",
  },
];

const passing = [
  "AI bots (GPTBot, ClaudeBot, PerplexityBot) are all allowed in robots.txt",
  "Organization and WebSite JSON-LD schema is present",
  "sitemap.xml is accessible and referenced in robots.txt",
  "Canonical tag is present on all major pages",
  "Content exceeds 1,200 words on key pages",
];

const severityStyles = {
  info: {
    color: "#00D9FF",
    bg: "rgba(0,217,255,0.08)",
    border: "rgba(0,217,255,0.20)",
    label: "Info",
  },
};

export default function HighScoreSamplePage() {
  return (
    <>
      <HighScoreJsonLd />
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)" }}>
        {/* Hero */}
        <section
          className="hero-grid"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "80px",
            paddingBottom: "56px",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <nav
              className="mb-6 flex items-center gap-2 text-xs"
              aria-label="Breadcrumb"
            >
              <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-secondary)" }}>Sample Reports</span>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>High Score</span>
            </nav>

            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#30D158",
                marginBottom: "16px",
              }}
            >
              Sample Report
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.034em",
                lineHeight: 1.1,
                color: "var(--text-primary)",
              }}
            >
              High AI Visibility Score
            </h1>
            <p
              style={{
                marginTop: "16px",
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                maxWidth: "560px",
              }}
            >
              This example shows what a ConduitScore report looks like for a
              well-optimized website. A score of 75–89 means the site has done
              most things right — AI agents can access, read, and cite the
              content — with only minor improvements remaining.
            </p>

            {/* See also */}
            <p
              style={{
                marginTop: "16px",
                fontSize: "0.8125rem",
                color: "var(--text-tertiary)",
              }}
            >
              See also:{" "}
              <Link href="/sample-reports/low-score" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                Low score
              </Link>{" "}
              &middot;{" "}
              <Link href="/sample-reports/mid-score" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                Mid score
              </Link>{" "}
              &middot;{" "}
              <Link href="/sample-reports/high-score" style={{ color: "var(--brand-cyan)", textDecoration: "none", fontWeight: 600 }}>
                High score
              </Link>
            </p>
          </div>
        </section>

        <div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "48px", paddingBottom: "80px" }}
        >
          {/* Score display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "32px",
              background: "rgba(48,209,88,0.05)",
              border: "1px solid rgba(48,209,88,0.22)",
              borderRadius: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "3px solid rgba(48,209,88,0.60)",
                background: "rgba(48,209,88,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Score: 88 out of 100"
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  color: "#30D158",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
              >
                88
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(48,209,88,0.7)",
                  marginTop: "2px",
                }}
              >
                / 100
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "#30D158",
                  marginBottom: "6px",
                }}
              >
                Good AI Visibility
              </p>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                This site is well-optimized for AI discovery and citation. The
                major signals are all in place. Only 2 minor informational
                improvements remain to reach the Excellent tier.
              </p>
            </div>
          </div>

          {/* What's working */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            What&apos;s Working
          </h2>
          <div
            style={{
              padding: "20px 24px",
              background: "rgba(48,209,88,0.04)",
              border: "1px solid rgba(48,209,88,0.16)",
              borderRadius: "14px",
              marginBottom: "40px",
            }}
          >
            <ul
              style={{
                margin: 0,
                paddingLeft: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {passing.map((item) => (
                <li
                  key={item}
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
                      marginTop: "2px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(48,209,88,0.12)",
                      border: "1px solid rgba(48,209,88,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 2.5"
                        stroke="#30D158"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Minor issues */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            Minor Improvements
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
            {issues.map((issue) => {
              const s = severityStyles[issue.severity];
              return (
                <div
                  key={issue.title}
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "14px",
                    padding: "20px 22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        color: s.color,
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {issue.category}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    {issue.title}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "10px" }}>
                    {issue.description}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-tertiary)",
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <strong style={{ color: "var(--brand-lime)" }}>Fix: </strong>
                    {issue.fix}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            style={{
              textAlign: "center",
              padding: "40px 32px",
              background: "var(--surface-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "20px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: "10px",
              }}
            >
              Scan your site free to see your real score
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginBottom: "24px" }}>
              No sign-up required. Results in about 15 seconds.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
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
              Scan your site free to see your real score →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
