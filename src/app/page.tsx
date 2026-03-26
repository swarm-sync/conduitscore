import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScanForm } from "@/components/scan/scan-form";
import { ExampleScoreCard } from "@/components/home/example-score-card";
import { SignalsSection } from "@/components/home/signals-section";
import { WhoUsesSection } from "@/components/home/who-uses-section";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "ConduitScore — See Why AI Ignores Your Site and Fix It in Minutes",
  description:
    "See why AI ignores your site. ConduitScore scans 14 AI visibility signals across 7 categories and shows the highest-impact fixes first. Results in about 15 seconds. Free, no signup required.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ConduitScore — See Why AI Ignores Your Site and Fix It in Minutes",
    description:
      "See why AI ignores your site. ConduitScore scans 14 AI visibility signals across 7 categories and shows the highest-impact fixes first. Results in about 15 seconds. Free, no signup required.",
    url: SITE_URL,
    type: "website",
  },
};

const faqs = [
  {
    question: "Is this free?",
    answer: "Yes. 3 scans per month, no account required.",
  },
  {
    question: "What does the score measure?",
    answer:
      "Seven technical and content signals that affect whether AI systems like ChatGPT, Claude, and Perplexity can access, understand, and cite your content.",
  },
  {
    question: "Will this slow down my site?",
    answer:
      "No. ConduitScore reads public HTML exactly as a search engine or AI crawler would.",
  },
  {
    question: "How is this different from a regular SEO audit?",
    answer:
      "SEO tools tell you how you rank in search engines. ConduitScore shows whether AI systems can read, interpret, and surface your site in AI-generated answers.",
  },
  {
    question: "How do I fix a low score?",
    answer:
      "Each scan returns prioritized fixes with copy-paste code snippets. Biggest gains typically come from structured data and adding an llms.txt file.",
  },
];

function HomePageJsonLd() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to check your AI visibility with ConduitScore",
    totalTime: "PT15S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your URL",
        text: "Enter any public website page you want to evaluate.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "We scan how AI systems read it",
        text: "ConduitScore checks the key technical and content signals that affect AI visibility.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get your score and prioritized fixes",
        text: "See what is helping, what is hurting, and what to fix first.",
      },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ConduitScore",
    url: "https://www.conduitscore.com",
    logo: "https://www.conduitscore.com/logo.svg",
    description:
      "AI visibility scanner that scores any website 0–100 for discoverability by ChatGPT, Perplexity, Claude, Gemini, and other AI agents.",
    sameAs: [
      "https://twitter.com/conduitscore",
      "https://linkedin.com/company/conduitscore",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "benstone@conduitscore.com",
      contactType: "customer support",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConduitScore",
    url: "https://www.conduitscore.com",
    description:
      "Free AI visibility scanner. Check how well ChatGPT, Perplexity, Claude, and other AI agents can find and cite your website.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
      urlTemplate: "https://www.conduitscore.com/?url={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      <HomePageJsonLd />
      {/* Responsive hero padding - Tailwind v4 strips custom :root vars, so we inline a <style> */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-inner { padding-top: 0px; padding-bottom: 80px; }
        @media (max-width: 767px) { .hero-inner { padding-top: 0px; padding-bottom: 56px; } }
      ` }} />
      <Header />
      <main>

        {/* ===== HERO ===== */}
        <section
          id="scan"
          className="relative overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <div className="container-wide hero-inner mx-auto">
            <div
              className="hero-two-col"
            >
              {/* Left column */}
              <div>
                <h1
                  id="hero-heading"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.034em",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    maxWidth: "22ch",
                  }}
                >
                  See Why AI Ignores Your Site — Fix It in Minutes
                </h1>

                <p
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.0625rem",
                    color: "var(--text-secondary)",
                    maxWidth: "520px",
                    lineHeight: 1.6,
                  }}
                >
                  ConduitScore scans 14 real AI visibility signals across 7 categories — from crawler access and structured data to llms.txt and content quality — then shows you the highest-impact fixes first. Results in about 15 seconds. Free, no signup.
                </p>

                {/* Scan form */}
                <div style={{ marginTop: "32px", maxWidth: "520px" }}>
                  <ScanForm variant="hero" />
                </div>
              </div>

              {/* Right column */}
              <div
                className="hero-score-card-col"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "100%", maxWidth: "420px" }}>
                  <ExampleScoreCard animateOnMount={true} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEM SECTION ===== */}
        <section
          aria-labelledby="problem-heading"
          style={{
            padding: "80px 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-base mx-auto px-6 md:px-0" style={{ maxWidth: "680px" }}>
            <h2
              id="problem-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "var(--text-primary)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.15,
                textAlign: "center",
              }}
            >
              Your site looks fine to Google. It&apos;s invisible to AI.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginTop: "24px",
                textAlign: "center",
              }}
            >
              SEO tools show you how you rank in search results. But AI agents like ChatGPT, Claude, and Perplexity see your site completely differently. They have stricter requirements for crawler access, structured data, content clarity, and citation signals. Miss even one of these 14 critical signals, and your site becomes invisible to AI-generated answers — no matter how well it ranks in Google.
            </p>

            <ul
              style={{
                marginTop: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                maxWidth: "440px",
                marginInline: "auto",
              }}
            >
              {[
                "Blocked or unclear crawler access",
                "Weak or missing schema",
                "Missing llms.txt",
                "Poor machine-readable content structure",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "rgba(255,45,85,0.10)",
                      border: "1px solid rgba(255,45,85,0.22)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 3l4 4M7 3L3 7" stroke="var(--brand-red)" strokeWidth="1.25" strokeLinecap="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== MECHANISM SECTION (14 SIGNALS) ===== */}
        <section
          id="mechanisms"
          aria-labelledby="mechanism-heading"
          style={{
            padding: "80px 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-wide mx-auto">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2
                id="mechanism-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15,
                }}
              >
                See exactly what AI agents see when they read your site.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginTop: "16px",
                  maxWidth: "520px",
                  marginInline: "auto",
                }}
              >
                ConduitScore checks all 14 signals across 7 categories that AI agents evaluate before citing your site.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
                maxWidth: "1200px",
                marginInline: "auto",
              }}
            >
              {[
                {
                  category: "Crawler Access",
                  signals: ["GPTBot detection", "ClaudeBot access", "PerplexityBot access", "OAI-SearchBot detection", "Sitemap.xml fetch"],
                },
                {
                  category: "Structured Data",
                  signals: ["Organization schema", "WebSite schema", "BreadcrumbList detection"],
                },
                {
                  category: "LLMs.txt File",
                  signals: ["URL count validation", "Section headers", "Fix templates"],
                },
                {
                  category: "Technical Health",
                  signals: ["Canonical tags", "Noindex penalties", "HTTPS enforcement"],
                },
                {
                  category: "Citation Signals",
                  signals: ["Contact page presence", "Entity signals", "Trust signals"],
                },
                {
                  category: "Content Structure",
                  signals: ["Intro paragraph", "Semantic HTML elements"],
                },
                {
                  category: "Content Quality",
                  signals: ["Title tag quality", "Meta description length"],
                },
              ].map((cat) => (
                <div
                  key={cat.category}
                  style={{
                    padding: "24px",
                    borderRadius: "12px",
                    background: "var(--surface-overlay)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "12px",
                    }}
                  >
                    {cat.category}
                  </h3>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {cat.signals.map((signal) => (
                      <li
                        key={signal}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--brand-lime)",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "48px",
                padding: "24px",
                background: "rgba(217,255,0,0.04)",
                border: "1px solid rgba(217,255,0,0.12)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                <strong>14 signals total</strong> — More than any competing AI visibility tool. Each one determines whether ChatGPT, Claude, and Perplexity can understand, trust, and cite your content.
              </p>
            </div>
          </div>
        </section>

        {/* ===== TRUST BAND ===== */}
        <section
          aria-label="ConduitScore at a glance"
          style={{
            background: "var(--surface-overlay)",
            borderTop: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-wide mx-auto trust-band-inner">
            {[
              { stat: "Most score below 50", label: "most sites are missing basic AI visibility signals" },
              { stat: "15s", label: "from URL to full diagnostic report" },
            ].map((item, i) => (
              <div
                key={item.stat}
                className="trust-band-item"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "20px 32px",
                  borderRight: i < 1 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {item.stat}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                    marginTop: "4px",
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          {/* Explanatory support line under stats */}
          <p
            style={{
              textAlign: "center",
              color: "var(--text-tertiary)",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-body)",
              paddingBottom: "16px",
            }}
          >
            Many sites score lower than expected because they are missing basic machine-readability signals.
          </p>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          style={{
            padding: "80px 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-wide mx-auto">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2
                id="how-it-works-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  marginTop: "12px",
                }}
              >
                How it works
              </h2>
            </div>

            <div
              className="how-it-works-steps"
              style={{
                display: "flex",
                gap: "48px",
                justifyContent: "center",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              {[
                {
                  num: "1",
                  label: "Paste your URL",
                  desc: "Enter any public website page you want to evaluate.",
                  iconBg: "rgba(108,59,255,0.10)",
                  iconBorder: "1px solid rgba(108,59,255,0.22)",
                  color: "var(--violet-400)",
                },
                {
                  num: "2",
                  label: "We scan how AI systems read it",
                  desc: "ConduitScore checks the key technical and content signals that affect AI visibility.",
                  iconBg: "rgba(255,45,85,0.10)",
                  iconBorder: "1px solid rgba(255,45,85,0.22)",
                  color: "var(--brand-red)",
                },
                {
                  num: "3",
                  label: "Get your score and prioritized fixes",
                  desc: "See what is helping, what is hurting, and what to fix first.",
                  iconBg: "rgba(217,255,0,0.08)",
                  iconBorder: "1px solid rgba(217,255,0,0.18)",
                  color: "var(--brand-lime)",
                },
              ].map((step, i) => (
                <div
                  key={step.num}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "12px",
                    maxWidth: "220px",
                    flex: 1,
                    position: "relative",
                  }}
                >
                  {i < 2 && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: "24px",
                        left: "calc(100% + 0px)",
                        width: "48px",
                        height: "1px",
                        background: "var(--border-subtle)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--radius-md)",
                      background: step.iconBg,
                      border: step.iconBorder,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        color: step.color,
                        letterSpacing: "-0.06em",
                        lineHeight: 1,
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHY SITES SCORE LOWER THAN EXPECTED ===== */}
        <section
          id="why-sites-score-low"
          aria-labelledby="why-sites-score-low-heading"
          style={{
            padding: "80px 0",
            background: "var(--surface-overlay)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-base mx-auto px-6 md:px-0" style={{ maxWidth: "1000px" }}>
            <h2
              id="why-sites-score-low-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "var(--text-primary)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.15,
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              5 Reasons Most Sites Score Lower Than They Expect
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--text-secondary)",
                textAlign: "center",
                lineHeight: 1.6,
                marginBottom: "48px",
              }}
            >
              AI visibility problems are rarely obvious. Most of them are invisible to humans but fully measurable.
            </p>

            {/* Card grid — 1 col mobile, 2 col tablet, 3+2 desktop via CSS grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                {
                  number: "01",
                  title: "Your robots.txt blocks AI crawlers without you knowing",
                  body: "GPTBot, ClaudeBot, and PerplexityBot are opt-out crawlers — they respect robots.txt directives meant for other bots. An overly broad Disallow rule added years ago can silently exclude your site from every major AI index. Cloudflare's 2024 data shows over 35% of top sites block at least one major AI crawler.",
                },
                {
                  number: "02",
                  title: "You have no llms.txt file",
                  body: "llms.txt is an emerging open standard (analogous to robots.txt) that tells AI models what your site is about, which pages matter most, and how to attribute your content. The vast majority of sites have never created one, leaving AI models to guess at your content's purpose and authority.",
                },
                {
                  number: "03",
                  title: "Your structured data is missing entity signals",
                  body: "Organization and WebSite schema markup tell AI systems who you are and what you do — not just what a page contains. Without these entity signals, AI models have no reliable way to connect your content to a named entity, which reduces citation frequency and answer attribution.",
                },
                {
                  number: "04",
                  title: "Your content is readable to humans but not to machines",
                  body: "Dense JavaScript-rendered text, missing semantic heading hierarchies, and content buried inside complex layouts can all prevent AI crawlers from extracting clean, attributable text. ConduitScore checks for these structural patterns directly — the same patterns that cause AI systems to skip or misinterpret your pages.",
                },
                {
                  number: "05",
                  title: "You assume Google rankings equal AI visibility",
                  body: "SEO and AI visibility are related but different optimization targets. Google ranks pages. AI models cite sources they can parse, trust, and attribute. A page can rank on page one and still be invisible to every AI system — because the signals that matter for AI (crawl access, entity markup, llms.txt, structured summaries) are simply not part of traditional SEO.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  style={{
                    padding: "24px",
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--brand-lime)",
                    }}
                  >
                    {item.number}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div
              style={{
                marginTop: "48px",
                textAlign: "center",
              }}
            >
              <a
                href="#scan"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "#0a0a0b",
                  background: "var(--brand-lime)",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Want to see which of these apply to your site?
              </a>
            </div>
          </div>
        </section>

        {/* ===== WHO USES THIS ===== */}
        <WhoUsesSection />

        {/* ===== 7 SIGNALS ===== */}
        <SignalsSection />

        {/* ===== FAQ ===== */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "96px 0",
            background: "rgba(18,18,20,0.68)",
          }}
        >
          <div className="container-base mx-auto px-6 md:px-0">
            <div className="text-center">
              <h2
                id="faq-heading"
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                Common questions
              </h2>
            </div>

            <div className="mt-12 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-[24px]"
                  style={{
                    background: "var(--surface-overlay)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                    style={{ listStyle: "none", color: "var(--text-primary)" }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>{faq.question}</span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        background: "rgba(255,45,85,0.08)",
                        border: "1px solid rgba(255,45,85,0.18)",
                        color: "var(--brand-red)",
                      }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                <p className="px-6 pb-6 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{faq.answer}</p>
              </details>
            ))}
          </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section
          aria-labelledby="cta-heading"
          style={{
            padding: "80px 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{ maxWidth: "480px", marginInline: "auto", textAlign: "center", paddingInline: "24px" }}
          >
            <h2
              id="cta-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "var(--text-primary)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              Scan My Site Now
            </h2>

            <p
              style={{
                marginTop: "12px",
                fontSize: "0.9375rem",
                fontFamily: "var(--font-body)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Find out how AI systems read your site — and what to fix first.
            </p>

            <div style={{ marginTop: "32px" }}>
              <ScanForm variant="hero" />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
