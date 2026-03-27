import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "ConduitScore Methodology — How the Score Is Calculated",
  description:
    "How ConduitScore calculates your 0–100 AI visibility score. Transparent weights across 7 categories: Crawler Access, Structured Data, LLMs.txt, Content Structure, Technical Health, and more.",
  alternates: {
    canonical: `${SITE_URL}/methodology`,
  },
  openGraph: {
    title: "ConduitScore Methodology — How the Score Is Calculated",
    description:
      "A transparent breakdown of every category, weight, and signal used to score your website's visibility to AI agents like ChatGPT, Perplexity, Claude, and Gemini.",
    url: `${SITE_URL}/methodology`,
    type: "website",
  },
};

function MethodologyJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ConduitScore Methodology",
    description:
      "How the ConduitScore 0–100 AI visibility score is calculated across 7 core categories.",
    url: `${SITE_URL}/methodology`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Methodology",
          item: `${SITE_URL}/methodology`,
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
    name: "Crawler Access",
    points: 15,
    description:
      "Checks whether AI bots (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) can access your site, whether your robots.txt is configured correctly, and whether a sitemap is discoverable.",
    learnMore: { href: "/blog/ai-crawler-access-guide", label: "Crawler access guide" },
  },
  {
    name: "Structured Data",
    points: 20,
    description:
      "Evaluates JSON-LD schema markup including Organization, WebSite, FAQPage, BreadcrumbList, and article schemas that help AI systems understand your content.",
    learnMore: { href: "/blog/structured-data-for-ai", label: "Structured data for AI guide" },
  },
  {
    name: "LLMs.txt",
    points: 10,
    description:
      "Checks for the presence, completeness, and structure of your /llms.txt file — a machine-readable guide for AI agents about your site's key pages and purpose.",
    learnMore: { href: "/blog/llms-txt-guide", label: "LLMs.txt implementation guide" },
  },
  {
    name: "Content Structure",
    points: 15,
    description:
      "Assesses heading hierarchy, semantic HTML, FAQ sections, introductory paragraphs, and answer-friendly formatting.",
    learnMore: null,
  },
  {
    name: "Technical Health",
    points: 15,
    description:
      "Evaluates page load speed, canonical tags, viewport meta, meta descriptions, noindex directives, and other technical signals affecting AI crawler success.",
    learnMore: null,
  },
  {
    name: "Citation Signals",
    points: 15,
    description:
      "Checks for author attribution, external links to authoritative sources, about/contact pages, trust/legal pages, and clear organization identity.",
    learnMore: null,
  },
  {
    name: "Content Quality",
    points: 10,
    description:
      "Measures content depth, title and description quality, publish dates, paragraph structure, and extractability for AI answer generation.",
    learnMore: null,
  },
];

const scoreRanges = [
  {
    range: "0–39",
    label: "Poor",
    description: "Poor AI visibility. Major blockers are present.",
    color: "#FF2D55",
    bg: "rgba(255,45,85,0.08)",
    border: "rgba(255,45,85,0.22)",
  },
  {
    range: "40–59",
    label: "Below Average",
    description: "Below average. Several important signals are missing.",
    color: "#FF9500",
    bg: "rgba(255,149,0,0.08)",
    border: "rgba(255,149,0,0.22)",
  },
  {
    range: "60–74",
    label: "Moderate",
    description: "Moderate. Good foundation but key gaps remain.",
    color: "#FFD60A",
    bg: "rgba(255,214,10,0.08)",
    border: "rgba(255,214,10,0.22)",
  },
  {
    range: "75–89",
    label: "Good",
    description: "Good. Well-optimized with minor improvements available.",
    color: "#30D158",
    bg: "rgba(48,209,88,0.08)",
    border: "rgba(48,209,88,0.22)",
  },
  {
    range: "90–100",
    label: "Excellent",
    description: "Excellent. Highly visible to AI agents.",
    color: "#D9FF00",
    bg: "rgba(217,255,0,0.08)",
    border: "rgba(217,255,0,0.22)",
  },
];

const diagnosticModules = [
  {
    name: "AI Bot Policy",
    description:
      "A detailed breakdown of which AI crawlers are allowed or blocked, including OAI-SearchBot, GPTBot, and others.",
  },
  {
    name: "Answer Extraction Readiness",
    description:
      "How easily an AI system can extract a reliable answer from your content — based on heading quality, lists, tables, and paragraph structure.",
  },
  {
    name: "Public Reportability Gap",
    description:
      "Whether your site has the key pages (methodology, examples, about) that make your business easy for AI systems to summarize and recommend.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <MethodologyJsonLd />
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
                Methodology
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
              Transparency
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
              How ConduitScore Is Calculated
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
              The ConduitScore 0–100 score measures how well any website can be
              discovered, read, and cited by AI agents. It is based on 7 core
              categories that most directly affect AI visibility — each weighted
              by its real-world impact on AI discoverability.
            </p>
          </div>
        </section>

        {/* Content */}
        <div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "64px", paddingBottom: "96px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>

            {/* Section: What Your Score Means (SUMMARY BLOCK) */}
            <section aria-labelledby="score-meaning">
              <h2
                id="score-meaning"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                  marginBottom: "24px",
                }}
              >
                What Your Score Means
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                {[
                  { range: "0–39", meaning: "Poor. Site is largely invisible to AI agents—major blockers present." },
                  { range: "40–59", meaning: "Below Average. Partial visibility—several important signals are missing." },
                  { range: "60–74", meaning: "Moderate. Good foundation but key gaps remain." },
                  { range: "75–89", meaning: "Good. Well-optimized with minor improvements available." },
                  { range: "90–100", meaning: "Excellent. Highly visible to AI agents." },
                ].map((item) => (
                  <div
                    key={item.range}
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "16px",
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--brand-cyan)",
                        minWidth: "60px",
                        flexShrink: 0,
                      }}
                    >
                      {item.range}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.meaning}
                    </span>
                  </div>
                ))}
              </div>

              {/* Data callout box */}
              <aside
                style={{
                  background: "rgba(217,255,0,0.08)",
                  border: "1px solid rgba(217,255,0,0.18)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--brand-lime)",
                    margin: "0 0 12px 0",
                  }}
                >
                  The AI Visibility Gap
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    margin: "0 0 12px 0",
                  }}
                >
                  Based on 457 ConduitScore scans analyzed (March 13–17, 2026):
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <li
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Median score: 28/100</strong> — Half of all websites score below this threshold
                  </li>
                  <li
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>78% score below 50</strong> — Indicating widespread AI visibility gaps
                  </li>
                  <li
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Only 6% score above 80</strong> — Few sites have optimized comprehensively for AI
                  </li>
                </ul>
              </aside>
            </section>

            {/* Section A: Core Score Methodology */}
            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Core Score Methodology
              </h2>
              <p
                style={{
                  marginTop: "16px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
              >
                The ConduitScore is based on 7 core categories. Each category
                contributes a maximum number of points toward the 100-point
                total. A category score reflects how well a site satisfies the
                checks within that category — from fully passing (full points)
                to completely absent (zero points).
              </p>

              {/* Category cards */}
              <div
                style={{
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "16px",
                      padding: "20px 24px",
                      display: "flex",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Points badge */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: "52px",
                        height: "52px",
                        borderRadius: "12px",
                        background: "rgba(0,217,255,0.08)",
                        border: "1px solid rgba(0,217,255,0.18)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--brand-cyan)",
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {cat.points}
                      </span>
                      <span
                        style={{
                          fontSize: "0.625rem",
                          color: "var(--text-tertiary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginTop: "2px",
                        }}
                      >
                        pts
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        {cat.name}
                      </h3>
                      <p
                        style={{
                          marginTop: "6px",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {cat.description}
                        {cat.learnMore && (
                          <>
                            {" "}
                            <Link
                              href={cat.learnMore.href}
                              style={{ color: "var(--brand-cyan)", textDecoration: "none", fontSize: "0.8125rem" }}
                            >
                              {cat.learnMore.label} &rarr;
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Total row */}
                <div
                  style={{
                    background: "rgba(217,255,0,0.04)",
                    border: "1px solid rgba(217,255,0,0.18)",
                    borderRadius: "16px",
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "var(--brand-lime)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    100 pts
                  </span>
                </div>
              </div>
            </section>

            {/* Score ranges */}
            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Score Range Interpretation
              </h2>
              <p
                style={{
                  marginTop: "16px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
              >
                Use the following ranges to interpret any ConduitScore result:
              </p>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {scoreRanges.map((r) => (
                  <div
                    key={r.range}
                    style={{
                      background: r.bg,
                      border: `1px solid ${r.border}`,
                      borderRadius: "12px",
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: r.color,
                        minWidth: "52px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {r.range}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: r.color,
                        minWidth: "100px",
                      }}
                    >
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {r.description}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Callout box */}
            <aside
              style={{
                borderLeft: "3px solid var(--brand-lime)",
                background: "rgba(217,255,0,0.04)",
                borderRadius: "0 12px 12px 0",
                padding: "20px 24px",
              }}
            >
              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                }}
              >
                ConduitScore&apos;s 0–100 score is based on 7 core categories
                that most directly affect AI visibility. Reports may also
                include additional diagnostic checks and advanced
                recommendations that do not currently change the core score.
              </p>
            </aside>

            {/* Section B: Additional Diagnostic Modules */}
            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Additional Diagnostic Modules
              </h2>
              <p
                style={{
                  marginTop: "16px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
              >
                Some scan reports include additional diagnostic checks beyond
                the 7 core categories. These modules provide deeper insight
                into specific areas but do not currently change the main 0–100
                score. They are provided as supplemental guidance to help you
                identify advanced optimization opportunities.
              </p>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {diagnosticModules.map((mod) => (
                  <div
                    key={mod.name}
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "12px",
                      padding: "18px 22px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {mod.name}
                    </h3>
                    <p
                      style={{
                        marginTop: "6px",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Links to related pages */}
            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Learn More
              </h2>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <Link
                  href="/what-conduit-checks"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--brand-cyan)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  What ConduitScore Checks →
                </Link>
                <Link
                  href="/sample-reports/mid-score"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  See a Sample Report →
                </Link>
                <Link
                  href="/blog/ai-crawler-access-guide"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Crawler Access Guide →
                </Link>
                <Link
                  href="/blog/structured-data-for-ai"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Structured Data for AI →
                </Link>
                <Link
                  href="/blog/llms-txt-guide"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  LLMs.txt Implementation Guide →
                </Link>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: "80px",
              background: "var(--gradient-primary)",
              borderRadius: "2px",
              padding: "1px",
            }}
          >
            <div
              style={{
                borderRadius: "18px",
                padding: "40px",
                textAlign: "center",
                background: "var(--surface-elevated)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Ready to See Your Score?
              </h2>
              <p
                style={{
                  marginTop: "8px",
                  color: "var(--text-secondary)",
                  fontSize: "0.9375rem",
                }}
              >
                It takes 30 seconds and no sign-up is required.
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginTop: "24px",
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
                Scan Your Website Free
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
