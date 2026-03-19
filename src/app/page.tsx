import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScanForm } from "@/components/scan/scan-form";
import { ExampleScoreCard } from "@/components/home/example-score-card";
import { SignalsSection } from "@/components/home/signals-section";
import { WhoUsesSection } from "@/components/home/who-uses-section";
import prisma from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

const FALLBACK_WEEKLY_COUNT = "4,000+";

export const metadata: Metadata = {
  title: "ConduitScore — AI Visibility Diagnostic for Your Website",
  description:
    "See whether AI engines like ChatGPT, Claude, and Perplexity can understand, cite, and recommend your site. Get your score and prioritized fixes in 15 seconds.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ConduitScore — AI Visibility Diagnostic for Your Website",
    description:
      "See whether AI engines like ChatGPT, Claude, and Perplexity can understand, cite, and recommend your site. Get your score and prioritized fixes in 15 seconds.",
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
    </>
  );
}

export default async function Home() {
  // Fetch live weekly scan count directly via Prisma (Server Component — no extra HTTP hop).
  // Falls back to static placeholder if the DB is unavailable during render.
  // This is a Next.js async Server Component — it runs once per request on the server
  // and is NEVER re-rendered by React. Date.now() is therefore deterministic per request.
  // The react-hooks/purity rule does not distinguish server components from client render
  // functions, so we suppress it here with an explicit explanation.
  // eslint-disable-next-line react-hooks/purity
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let weeklyScanCount: string = FALLBACK_WEEKLY_COUNT;
  try {
    const count = await prisma.scan.count({
      where: {
        status: "completed",
        completedAt: { gte: oneWeekAgo },
      },
    });
    if (count > 0) {
      weeklyScanCount = count.toLocaleString();
    }
  } catch {
    // DB unavailable — keep the fallback; never crash the homepage.
  }

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
                  See whether AI engines can understand, cite, and recommend your site.
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
                  ConduitScore scans the technical and content signals that affect how tools like ChatGPT, Claude, and Perplexity read your website — then shows you exactly what to fix.
                </p>

                {/* Scan form */}
                <div style={{ marginTop: "32px", maxWidth: "520px" }}>
                  <ScanForm variant="hero" />
                </div>

                {/* Support line under CTA */}
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-body)",
                    color: "var(--text-tertiary)",
                    marginTop: "12px",
                  }}
                >
                  No signup required. Results in about 15 seconds.
                </p>
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
              Most sites are harder for AI to read than owners realize.
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
              If AI systems cannot properly crawl, interpret, structure, or cite your content, your site becomes less likely to appear in AI-generated answers. ConduitScore helps you find the gaps before they cost you visibility.
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
              { stat: weeklyScanCount, label: "sites scanned this week" },
              { stat: "41/100", label: "average score — most sites are missing basic signals" },
              { stat: "15s", label: "from URL to full diagnostic report" },
            ].map((item, i) => (
              <div
                key={item.stat}
                className="trust-band-item"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "20px 32px",
                  borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none",
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
              Run your free AI visibility scan
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
