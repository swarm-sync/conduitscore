import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScanForm } from "@/components/scan/scan-form";
import { HomePageCards } from "@/components/home/home-page-cards";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "The Spectral Audit for AI Visibility",
  description:
    "Scan your site through the lens of ChatGPT, Claude, Gemini, and Perplexity. ConduitScore turns crawler visibility into a spectral audit with proof-backed fixes.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ConduitScore | The Spectral Audit for AI Visibility",
    description:
      "Stop optimizing for keywords alone. Audit how AI systems actually perceive your site and get proof-backed fixes.",
    url: SITE_URL,
    type: "website",
  },
};

const faqs = [
  {
    question: "What is a spectral audit?",
    answer:
      "A spectral audit is ConduitScore's AI visibility scan. It measures how machine crawlers, retrieval systems, and answer engines interpret your site instead of only checking traditional search signals.",
  },
  {
    question: "What does ConduitScore scan?",
    answer:
      "Each scan reviews seven areas that matter to AI systems: crawler access, structured data, content structure, LLMs.txt, technical health, citation signals, and content quality.",
  },
  {
    question: "Does ConduitScore use a real browser?",
    answer:
      "Yes. ConduitScore now runs scans through Conduit, a real audited browser pipeline, so the results reflect rendered pages instead of only static HTML fetches.",
  },
  {
    question: "What do I get back?",
    answer:
      "You get an overall AI visibility score, category breakdowns, concrete issues, copy-paste fixes, and a proof artifact showing what was observed during the scan.",
  },
  {
    question: "What is llms.txt and why does it matter?",
    answer:
      "llms.txt is an emerging standard where websites place a machine-readable summary file at /llms.txt describing what the site does, its key pages, and contact information. AI agents check for this file to quickly understand a site's purpose without crawling every page.",
  },
  {
    question: "How is AI visibility different from traditional SEO?",
    answer:
      "Traditional SEO optimizes for search engine ranking algorithms. AI visibility optimization (also called GEO or AEO) focuses on making content parseable, citable, and discoverable by AI agents like ChatGPT, Perplexity, and Claude, which process and present information differently than search result pages.",
  },
  {
    question: "Is ConduitScore free to use?",
    answer:
      "Yes, ConduitScore offers a free tier with 3 scans per month and no sign-up required. For higher volumes, monitoring dashboards, and API access, paid plans start at $29 per month.",
  },
  {
    question: "How often should I scan my site?",
    answer:
      "We recommend scanning after every major content or technical change. For actively maintained sites, a weekly scan helps catch regressions in AI visibility before they impact your presence in AI-generated answers.",
  },
];

const stats = [
  { value: "7", label: "Signal layers" },
  { value: "30s", label: "Typical scan" },
  { value: "Proof", label: "Built into every run" },
  { value: "Live", label: "Rendered browser audit" },
];

const auditSignals = [
  { label: "Crawler Visibility", value: "GPTBot / ClaudeBot / Gemini" },
  { label: "Structured Memory", value: "JSON-LD + machine-readable surfaces" },
  { label: "Render Integrity", value: "JS delta + proof export" },
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
    name: "How to run an AI visibility scan with ConduitScore",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter a URL",
        text: "Paste any public website URL into the ConduitScore scan aperture.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the spectral audit",
        text: "ConduitScore uses a real Conduit browser session to inspect rendered page signals and crawler visibility.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Apply the fixes",
        text: "Review the score, issues, fixes, and proof artifacts to improve how AI systems can read and cite the site.",
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

export default function Home() {
  return (
    <>
      <HomePageJsonLd />
      <Header />
      <main>
        <section className="relative overflow-hidden pt-18" aria-labelledby="hero-heading">
          <div className="container-wide mx-auto py-20 md:py-28">
            <div className="grid items-center gap-10 lg:grid-cols-[1.18fr_0.82fr]">
              <div className="animate-fade-up">
                <div className="flex items-center gap-3 mb-2">
                  <span className="section-label">Est. 2026 // AI Readiness</span>
                  <time dateTime="2026-03-14" className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                    Updated March 2026
                  </time>
                </div>
                <h1
                  id="hero-heading"
                  className="mt-5 max-w-4xl uppercase"
                  style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)", lineHeight: 1.04, letterSpacing: "-0.03em" }}
                >
                  The <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.26)", color: "transparent" }}>Spectral</span> Site Audit
                </h1>
                <p className="mt-6 max-w-xl text-lg">
                  Stop optimizing for keywords alone. Start optimizing for intelligence. ConduitScore shows how ChatGPT, Claude, Gemini, and Perplexity actually perceive your site.
                </p>

                <div id="scan" className="mt-10 max-w-2xl">
                  <ScanForm variant="hero" />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot"].map((agent) => (
                    <span
                      key={agent}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
                <div
                  className="relative overflow-hidden rounded-[32px] p-6 md:p-8"
                  style={{
                    background: "var(--gradient-card)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-raised)",
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, var(--brand-red), transparent)" }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <span className="section-label">Live Aperture</span>
                    <span
                      className="rounded-full px-3 py-1 text-[11px]"
                      style={{
                        background: "rgba(217,255,0,0.1)",
                        border: "1px solid rgba(217,255,0,0.2)",
                        color: "var(--brand-lime)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Conduit Active
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div
                      className="rounded-[24px] p-5"
                      style={{
                        background: "rgba(8,8,9,0.66)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                        STATUS // ANALYZING
                      </p>
                      <p
                        className="mt-3 text-6xl leading-none"
                        style={{
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.08em",
                        }}
                      >
                        82
                      </p>
                      <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                        Visibility score from rendered browser evidence, not just a raw HTML fetch.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {auditSignals.map((signal) => (
                        <div
                          key={signal.label}
                          className="rounded-[24px] p-4"
                          style={{
                            background: "rgba(8,8,9,0.5)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--text-tertiary)" }}>
                            {signal.label}
                          </p>
                          <p className="mt-2 text-sm" style={{ color: "var(--text-primary)" }}>
                            {signal.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[24px] p-5" style={{ background: "rgba(0,0,0,0.48)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                      Micro Proof
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>DOM hash</p>
                        <p style={{ color: "var(--brand-lime)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>sha256:5945...</p>
                      </div>
                      <div>
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Signature</p>
                        <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>ed25519 verified</p>
                      </div>
                      <div>
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Scan origin</p>
                        <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>conduitscore_worker</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-y"
          style={{ borderColor: "var(--border-subtle)", background: "rgba(18,18,20,0.72)" }}
        >
          <div className="container-wide mx-auto py-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-4xl"
                    style={{
                      color: "var(--brand-lime)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.08em",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em]" style={{ color: "var(--text-tertiary)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomePageCards />

        <section id="theory" className="border-t py-24" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-wide mx-auto grid gap-10 lg:grid-cols-2">
            <div>
              <span className="section-label">Technical Depth</span>
              <h2 className="mt-4 uppercase">Crawlable intelligence, not cosmetic SEO</h2>
              <p className="mt-6 max-w-xl">
                AI systems need more than keywords. They need explicit crawler access, structured surfaces, rendered answer blocks, and proof that the page can be understood by non-human readers.
              </p>
              <p className="mt-4 max-w-xl">
                ConduitScore checks the static layer, the rendered layer, and the machine-readable layer in one pass, then turns the gaps into fixes your team can ship immediately.
              </p>
            </div>

            <div className="code-block">
              <span style={{ color: "var(--brand-purple)" }}>{"// llms.txt surface"}</span>
              {"\n"}User-agent: *{"\n"}
              Allow: /guides/{"\n"}
              Allow: /pricing/{"\n"}
              Disallow: /checkout/{"\n"}
              {"\n"}
              <span style={{ color: "var(--brand-red)" }}>[Rendered proof exported]</span>
              {"\n"}schema.detected = true{"\n"}
              {'dom_hash = "sha256:..."'}{"\n"}
              js_dependency_ratio = 0.031
            </div>
          </div>
        </section>

        <section className="border-t py-24" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-wide mx-auto grid gap-10 lg:grid-cols-2">
            <div>
              <span className="section-label">Why AI Visibility Matters</span>
              <h2 className="mt-4 uppercase">The shift from search engines to answer engines</h2>
              <p className="mt-6 max-w-xl">
                Over 100 million people now use AI assistants like ChatGPT, Claude, and Perplexity for everyday search tasks.
                According to research from <a href="https://www.gartner.com/en/articles/3-bold-and-actionable-predictions-for-the-future-of-genai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>Gartner</a>,
                traditional search engine volume is expected to decline by 25% by 2026 as AI-powered answer engines gain adoption.
              </p>
              <p className="mt-4 max-w-xl">
                This means that websites optimized only for Google are missing a rapidly growing discovery channel.
                AI agents process information differently from traditional crawlers. They need structured data, explicit crawler permissions,
                machine-readable content surfaces, and clear answer patterns to cite your content in their responses.
              </p>
              <p className="mt-4 max-w-xl">
                The emerging standard <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>llms.txt</a> provides
                a machine-readable summary of your site specifically for AI agents, while <a href="https://schema.org/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>schema.org</a> structured
                data helps AI systems understand the entities, relationships, and facts on your pages.
              </p>
              <p className="mt-4 max-w-xl">
                ConduitScore was built to bridge this gap. Our scanner evaluates your website across seven categories that AI agents
                use to decide whether to crawl, index, understand, and ultimately cite your content in their answers. Every issue we detect
                comes with a copy-paste code fix so your team can ship improvements immediately.
              </p>
            </div>

            <div className="space-y-5">
              <div className="card-glow rounded-xl p-6">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Generative Engine Optimization (GEO)</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  GEO is the practice of optimizing web content so that AI-powered search engines and answer engines
                  surface and cite it in their generated responses. Unlike traditional SEO, GEO focuses on structured data,
                  citation-worthiness, and machine-readable content patterns that LLMs can extract and reference.
                </p>
              </div>
              <div className="card-glow rounded-xl p-6">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Answer Engine Optimization (AEO)</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  AEO targets the specific format and structure that answer engines like Perplexity, ChatGPT Search, and Google AI Overviews
                  prefer. This includes FAQ schemas, concise definitions, clear heading hierarchies, and content structured as direct
                  answers to common questions in your industry.
                </p>
              </div>
              <div className="card-glow rounded-xl p-6">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Crawler Access</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  AI companies operate dedicated crawlers -- GPTBot (OpenAI), ClaudeBot (Anthropic), and PerplexityBot -- that respect
                  robots.txt directives. If your robots.txt blocks these user-agents, your content becomes invisible to the AI systems
                  that millions of people rely on for information discovery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="border-y py-24"
          style={{ borderColor: "var(--border-subtle)", background: "rgba(18,18,20,0.68)" }}
        >
          <div className="container-base mx-auto px-6 md:px-0">
            <div className="text-center">
              <span className="section-label">FAQ</span>
              <h2 className="mt-4">Questions about the audit</h2>
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
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        background: "rgba(255,45,85,0.08)",
                        border: "1px solid rgba(255,45,85,0.18)",
                        color: "var(--brand-red)",
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-sm">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto px-6 md:px-0">
            <div className="flex items-start gap-6">
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(108,59,255,0.12)", border: "1px solid rgba(108,59,255,0.25)" }}
                aria-hidden="true"
              >
                <span style={{ color: "var(--violet-400)", fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>CS</span>
              </div>
              <div className="author">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Written by the ConduitScore Team
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  ConduitScore is built by a team of SEO engineers, AI researchers, and web performance specialists
                  who have spent over a decade working at the intersection of search, structured data, and machine learning.
                  Our scanner is informed by direct analysis of how GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers
                  process web content.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <a href="/about" className="text-xs font-medium" style={{ color: "var(--cyan-400)" }}>
                    About our team
                  </a>
                  <a href="/contact" className="text-xs font-medium" style={{ color: "var(--cyan-400)" }}>
                    Contact us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container-base mx-auto px-6 text-center md:px-0">
            <span className="section-label">Begin Scan</span>
            <h2 className="mt-4 uppercase">Run the site through the aperture</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg">
              The fastest way to see whether your site is visible to AI systems is to inspect it the same way they do: rendered, measured, and proof-backed.
            </p>
            <div className="mt-10 flex justify-center">
              <ScanForm variant="hero" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
