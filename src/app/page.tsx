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
  title: "ConduitScore — AI Visibility Score in 15 Seconds",
  description:
    "Paste your URL to see how visible your site is to AI tools, what's hurting you, and what to fix first. No signup required.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ConduitScore — See Your AI Visibility Score in 15 Seconds",
    description:
      "Paste your URL to see how visible your site is to AI tools, what's hurting you, and what to fix first. No signup required.",
    url: SITE_URL,
    type: "website",
  },
};

const faqs = [
  {
    question: "Is this free?",
    answer: "Yes. 3 scans/month, no account required.",
  },
  {
    question: "What does the score measure?",
    answer:
      "7 signals AI crawlers use to decide whether to cite your content.",
  },
  {
    question: "Will this slow down my site?",
    answer:
      "No. Reads public HTML exactly as a search engine would.",
  },
  {
    question: "How is this different from a regular SEO audit?",
    answer:
      "SEO tools tell you how you rank. ConduitScore shows whether AI systems can read, understand, and surface your site.",
  },
  {
    question: "How do I fix a low score?",
    answer:
      "Each scan returns copy-paste code fixes. Biggest gains: structured data and llms.txt.",
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
    name: "How to get your AI visibility score with ConduitScore",
    totalTime: "PT15S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter your URL",
        text: "Paste any public website URL into the ConduitScore scanner.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Score in 15 seconds",
        text: "ConduitScore checks 7 AI visibility signals and returns a 0-100 score.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy-paste the fixes",
        text: "Review your score, issues, and copy-paste code fixes.",
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
        .hero-inner { padding-top: 24px; padding-bottom: 80px; }
        @media (max-width: 767px) { .hero-inner { padding-top: 20px; padding-bottom: 56px; } }
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
              <div className="animate-fade-up">
                <h1
                  id="hero-heading"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.034em",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    maxWidth: "20ch",
                  }}
                >
                  Get your website&apos;s AI visibility score.
                </h1>

                <p
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    color: "var(--text-primary)",
                    maxWidth: "460px",
                    lineHeight: 1.5,
                  }}
                >
                  See your AI visibility score in 15 seconds.
                </p>

                <p
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    color: "var(--text-secondary)",
                    maxWidth: "440px",
                    lineHeight: 1.7,
                  }}
                >
                  <span>Paste your URL. </span>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    Find out if ChatGPT can see your site.
                  </span>
                </p>

                {/* Scan form */}
                <div style={{ marginTop: "32px", maxWidth: "520px" }}>
                  <ScanForm variant="hero" />
                </div>

                {/* Social proof micro-line */}
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                    color: "var(--text-tertiary)",
                    marginTop: "12px",
                  }}
                >
                  No signup required. Most sites we scan score lower than they should.
                </p>
              </div>

              {/* Right column */}
              <div
                className="animate-fade-up hero-score-card-col"
                style={{
                  animationDelay: "120ms",
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
              { stat: "41/100", label: "Average score: 41/100 — most sites are missing basic AI-readability signals" },
              { stat: "15s", label: "results in about 15 seconds. No signup required." },
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
                Three steps. Fifteen seconds.
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
                  iconBg: "rgba(108,59,255,0.10)",
                  iconBorder: "1px solid rgba(108,59,255,0.22)",
                  color: "var(--violet-400)",
                },
                {
                  num: "2",
                  label: "We scan your site for AI visibility issues",
                  iconBg: "rgba(255,45,85,0.10)",
                  iconBorder: "1px solid rgba(255,45,85,0.22)",
                  color: "var(--brand-red)",
                },
                {
                  num: "3",
                  label: "Get your score and your first fixes",
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
                    maxWidth: "180px",
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
                </div>
              ))}
            </div>

            <p
              style={{
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: "0.9375rem",
                fontFamily: "var(--font-body)",
                marginTop: "40px",
              }}
              >
              No signup. No credit card. Results in about 15 seconds.
            </p>
          </div>
        </section>

        {/* ===== WHO USES THIS ===== */}
        <WhoUsesSection />

        {/* ===== 7 SIGNALS ===== */}
        <SignalsSection />

        {/* ===== FAQ ===== */}
        <section
          id="faq"
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

            <div style={{ marginTop: "32px" }}>
              <ScanForm variant="hero" />
            </div>

            <p
              style={{
                marginTop: "16px",
                fontSize: "0.875rem",
                fontFamily: "var(--font-body)",
                color: "var(--text-tertiary)",
              }}
            >
              No signup required. Results in about 15 seconds.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
