import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "Sample ConduitScore Report — Mid Score (62/100)",
  description:
    "See what a mid-range ConduitScore report looks like. A score of 62/100 shows a site with good fundamentals but several important AI visibility gaps still remaining.",
  alternates: {
    canonical: `${SITE_URL}/sample-reports/mid-score`,
  },
  openGraph: {
    title: "Sample ConduitScore Report — Mid Score (62/100)",
    description:
      "Example ConduitScore report for a moderately optimized website with a foundation in place but key gaps remaining.",
    url: `${SITE_URL}/sample-reports/mid-score`,
    type: "website",
  },
};

function MidScoreJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sample ConduitScore Report — Mid Score (62/100)",
    description:
      "Example ConduitScore report showing a site with moderate AI visibility scoring 62 out of 100.",
    url: `${SITE_URL}/sample-reports/mid-score`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Mid Score Example",
          item: `${SITE_URL}/sample-reports/mid-score`,
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
    title: "No canonical tag found",
    category: "Technical Health",
    severity: "warning" as const,
    description:
      "Without a canonical tag, AI crawlers may encounter duplicate content signals and deprioritize this page.",
    scoreDelta: "+3 pts",
    fix: "Add `<link rel='canonical' href='https://yourdomain.com/page'>` to the `<head>` of each page.",
  },
  {
    title: "No FAQ schema",
    category: "Structured Data",
    severity: "warning" as const,
    description:
      "FAQ content on this page is not marked up with structured data, missing a chance for AI to extract and cite Q&A pairs.",
    scoreDelta: "+8 pts",
    fix: "Wrap your FAQ section in FAQPage JSON-LD schema with Question and Answer markup.",
  },
  {
    title: "Content could be longer",
    category: "Content Quality",
    severity: "info" as const,
    description:
      "Pages with fewer than 1,000 words score lower on content extractability. AI agents prefer detailed, comprehensive content.",
    scoreDelta: "+2 pts",
    fix: "Expand key pages to at least 1,000 words with substantive, factual content structured around common questions.",
  },
];

const severityStyles = {
  warning: {
    color: "#FF9500",
    bg: "rgba(255,149,0,0.08)",
    border: "rgba(255,149,0,0.22)",
    label: "Warning",
  },
  info: {
    color: "#00D9FF",
    bg: "rgba(0,217,255,0.08)",
    border: "rgba(0,217,255,0.20)",
    label: "Info",
  },
};

export default function MidScoreSamplePage() {
  return (
    <>
      <MidScoreJsonLd />
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
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Mid Score</span>
            </nav>

            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#FFD60A",
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
              Moderate AI Visibility Score
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
              site with a reasonable foundation but several important AI
              visibility gaps remaining. A score of 60–74 means good progress
              has been made — but targeted fixes can push it significantly higher.
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
              <Link href="/sample-reports/mid-score" style={{ color: "var(--brand-cyan)", textDecoration: "none", fontWeight: 600 }}>
                Mid score
              </Link>{" "}
              &middot;{" "}
              <Link href="/sample-reports/high-score" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
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
              background: "rgba(255,214,10,0.05)",
              border: "1px solid rgba(255,214,10,0.22)",
              borderRadius: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "3px solid rgba(255,214,10,0.60)",
                background: "rgba(255,214,10,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Score: 62 out of 100"
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  color: "#FFD60A",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
              >
                62
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,214,10,0.7)",
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
                  color: "#FFD60A",
                  marginBottom: "6px",
                }}
              >
                Moderate AI Visibility
              </p>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                A solid foundation is in place — crawlers can access the site
                and basic structure is correct. But several important signals
                are missing that would increase AI citation likelihood. Fixing
                the 3 issues below could add up to 13 points.
              </p>
            </div>
          </div>

          {/* Issues */}
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
            Issues Found
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
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
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
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "var(--brand-lime)",
                        flexShrink: 0,
                      }}
                    >
                      Fix: {issue.scoreDelta}
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
