import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "AI Visibility for Marketing Agencies - ConduitScore",
  description:
    "Marketing and SEO agencies need a scalable way to audit AI visibility for clients. ConduitScore gives you white-label scanning, bulk analysis, and client-ready reports for ChatGPT, Perplexity, and Claude optimization.",
  alternates: {
    canonical: `${SITE_URL}/use-cases/agencies`,
  },
  openGraph: {
    title: "AI Visibility for Marketing Agencies - ConduitScore",
    description:
      "Offer AI visibility audits as a service. White-label scanning, bulk analysis, and client-ready reports.",
    url: `${SITE_URL}/use-cases/agencies`,
    type: "website",
  },
};

function AgenciesUseCaseJsonLd() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can agencies use ConduitScore for client work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ConduitScore's Agency plan provides unlimited scans, white-label reports, bulk site-wide crawling, and REST API access. Agencies can run AI visibility audits during sales calls to demonstrate immediate value, include AI optimization in ongoing retainers, and generate branded reports for client presentations.",
        },
      },
      {
        "@type": "Question",
        name: "Does ConduitScore offer white-label or co-branded reports?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The Agency plan ($149/month, contact us) includes full white-label capabilities. You can generate client-facing AI visibility reports with your agency branding, use the REST API to integrate scanning into your own tools, and embed scan results in custom dashboards.",
        },
      },
      {
        "@type": "Question",
        name: "What AI visibility services can agencies offer their clients?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agencies can offer AI visibility audits (one-time analysis of a client's site across 7 categories), ongoing AI optimization retainers (monthly scanning and implementation), AI-ready content strategy (structured data, LLMs.txt, and content formatting), and competitive AI visibility benchmarking. These services complement traditional SEO retainers.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Use Cases", item: `${SITE_URL}/use-cases` },
      { "@type": "ListItem", position: 3, name: "Agencies", item: `${SITE_URL}/use-cases/agencies` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

export default function AgenciesUseCasePage() {
  return (
    <>
      <AgenciesUseCaseJsonLd />
      <Header />
      <main style={{ background: "var(--surface-base)" }}>
        {/* Hero */}
        <section className="hero-bg relative py-24 sm:py-32">
          <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="container-wide mx-auto relative z-10 text-center px-4">
            <span className="badge badge-violet mb-6 inline-flex">Marketing Agencies</span>
            <h1
              className="mx-auto max-w-3xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              Add AI Visibility to Your Agency&rsquo;s Service Line.{" "}
              <span className="gradient-text">Win More Retainers.</span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Your clients are asking about AI search. Give them answers. ConduitScore provides
              white-label AI visibility audits, bulk scanning, and client-ready reports so your
              agency can lead the next wave of search optimization.
            </p>
            <div className="mt-10">
              <Link href="/" className="btn btn-primary btn-lg">
                Try a Free Agency Scan
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Value prop */}
        <section className="py-20 sm:py-24">
          <div className="container-wide mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  Your Clients Need AI Optimization. You Need Scalable Tools.
                </h2>
                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                  AI search is growing at 300% year-over-year. Clients are already asking
                  &ldquo;how do we show up in ChatGPT?&rdquo; and &ldquo;why aren&rsquo;t we cited in
                  Perplexity?&rdquo; The agencies that can answer these questions -- with data, not
                  guesswork -- will win the next generation of retainers.
                </p>
                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                  ConduitScore gives your team a scalable audit platform. Run scans during
                  prospect calls to demonstrate immediate value. Generate white-label reports for
                  client presentations. Build AI visibility into your monthly retainer workflow
                  with automated monitoring and alerts.
                </p>
              </div>
              <div className="card-glow p-8">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  Agency Plan Capabilities
                </h3>
                <ul className="mt-5 space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {[
                    { label: "Unlimited Scans", desc: "No per-scan limits. Audit as many client sites as you need." },
                    { label: "White-Label Reports", desc: "Client-facing reports with your agency branding." },
                    { label: "Site-Wide Crawling", desc: "Crawl entire domains, not just single URLs." },
                    { label: "REST API Access", desc: "Integrate scanning into your own dashboards and tools." },
                    { label: "Competitor Benchmarks", desc: "Compare client visibility against competitors." },
                    { label: "Priority Support", desc: "Dedicated account management for agency partners." },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <span
                        className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "rgba(108,59,255,0.15)", color: "var(--violet-300)" }}
                      >
                        &#10003;
                      </span>
                      <div>
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {item.label}
                        </span>{" "}
                        &mdash; {item.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-20 sm:py-24" style={{ background: "var(--surface-raised)" }}>
          <div className="container-wide mx-auto px-4 text-center">
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              Three Ways Agencies Use ConduitScore
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Sales Tool",
                  desc: "Run a live scan during prospect calls. The AI visibility score creates urgency and demonstrates your agency's technical expertise in a way competitors cannot match.",
                },
                {
                  step: "02",
                  title: "Retainer Add-On",
                  desc: "Add monthly AI visibility monitoring to existing SEO retainers. Scan client sites, track score changes, and deliver automated improvement reports each month.",
                },
                {
                  step: "03",
                  title: "New Service Line",
                  desc: "Launch a dedicated AI optimization service: one-time audits, implementation projects, and ongoing optimization. Position your agency as an AI search leader.",
                },
              ].map((item) => (
                <div key={item.step} className="card p-8 text-left">
                  <span
                    className="text-sm font-mono font-semibold"
                    style={{ color: "var(--cyan-400)" }}
                  >
                    {item.step}
                  </span>
                  <h3
                    className="mt-3 text-xl font-bold"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="container-wide mx-auto px-4 text-center">
            <div className="card-glow mx-auto max-w-2xl p-12">
              <h2
                className="text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
              >
                Start Offering AI Visibility Audits Today
              </h2>
              <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                Run a free scan on any client site right now. See the AI visibility score, identify
                quick wins, and use the results to start a conversation about AI search optimization.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/" className="btn btn-primary btn-lg">
                  Scan a Client Site Free
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/pricing" className="btn btn-secondary btn-lg">
                  View Agency Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
