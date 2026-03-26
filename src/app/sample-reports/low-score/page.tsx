import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "Sample ConduitScore Report — Low Score (28/100)",
  description:
    "See what a low ConduitScore report looks like. A score of 28/100 indicates major AI visibility blockers including blocked bots, missing structured data, and no llms.txt file.",
  alternates: {
    canonical: `${SITE_URL}/sample-reports/low-score`,
  },
  openGraph: {
    title: "Sample ConduitScore Report — Low Score (28/100)",
    description:
      "Example ConduitScore report for a poorly optimized website. See the issues found and what fixing them would do to the score.",
    url: `${SITE_URL}/sample-reports/low-score`,
    type: "website",
  },
};

function LowScoreJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sample ConduitScore Report — Low Score (28/100)",
    description:
      "Example ConduitScore report showing a site with major AI visibility blockers scoring 28 out of 100.",
    url: `${SITE_URL}/sample-reports/low-score`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Low Score Example",
          item: `${SITE_URL}/sample-reports/low-score`,
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
    title: "No JSON-LD found",
    category: "Structured Data",
    severity: "critical" as const,
    description:
      "Your page has no structured data. AI agents have no machine-readable understanding of your content.",
    scoreDelta: "+12 pts",
    fix: "Add JSON-LD Organization and WebSite schema markup to your `<head>`.",
  },
  {
    title: "GPTBot is blocked",
    category: "Crawler Access",
    severity: "critical" as const,
    description:
      "ChatGPT cannot read or cite your content.",
    scoreDelta: "+5 pts",
    fix: "Update robots.txt to allow GPTBot: `User-agent: GPTBot\\nAllow: /`",
  },
  {
    title: "No /llms.txt found",
    category: "LLMs.txt",
    severity: "warning" as const,
    description:
      "AI crawlers cannot efficiently navigate your site.",
    scoreDelta: "+8 pts",
    fix: "Create a /llms.txt file listing your key pages and a short site description.",
  },
];

const severityStyles = {
  critical: {
    color: "#FF2D55",
    bg: "rgba(255,45,85,0.08)",
    border: "rgba(255,45,85,0.22)",
    label: "Critical",
  },
  warning: {
    color: "#FF9500",
    bg: "rgba(255,149,0,0.08)",
    border: "rgba(255,149,0,0.22)",
    label: "Warning",
  },
};

export default function LowScoreSamplePage() {
  return (
    <>
      <LowScoreJsonLd />
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
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Low Score</span>
            </nav>

            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#FF2D55",
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
              Low AI Visibility Score
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
              website with major AI visibility blockers. Sites scoring below 40
              typically have blocked crawlers, no structured data, and missing
              key files.
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
              <Link href="/sample-reports/low-score" style={{ color: "var(--brand-cyan)", textDecoration: "none", fontWeight: 600 }}>
                Low score
              </Link>{" "}
              &middot;{" "}
              <Link href="/sample-reports/mid-score" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
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
              background: "rgba(255,45,85,0.05)",
              border: "1px solid rgba(255,45,85,0.20)",
              borderRadius: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "3px solid rgba(255,45,85,0.60)",
                background: "rgba(255,45,85,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Score: 28 out of 100"
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  color: "#FF2D55",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
              >
                28
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,45,85,0.7)",
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
                  color: "#FF2D55",
                  marginBottom: "6px",
                }}
              >
                Poor AI Visibility
              </p>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Major blockers are preventing AI agents from crawling and citing
                this site. Addressing the 3 critical issues below could improve
                the score by up to 25 points.
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

          {/* Score delta */}
          <div
            style={{
              padding: "24px",
              background: "rgba(217,255,0,0.04)",
              border: "1px solid rgba(217,255,0,0.15)",
              borderRadius: "14px",
              marginBottom: "48px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--brand-lime)",
                marginBottom: "10px",
              }}
            >
              What fixing these issues would do
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Addressing just these 3 issues could improve the score from{" "}
              <strong style={{ color: "#FF2D55" }}>28</strong> to approximately{" "}
              <strong style={{ color: "#30D158" }}>53</strong> — moving from
              &ldquo;Poor&rdquo; to &ldquo;Below Average&rdquo; territory. Structured data
              alone (the highest-weight category at 20 pts) offers the biggest
              single gain.
            </p>
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
