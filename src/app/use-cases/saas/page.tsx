import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "AI Visibility for SaaS Companies - ConduitScore",
  description:
    "SaaS companies lose pipeline when AI agents can't cite their product. ConduitScore scans 7 visibility categories so ChatGPT, Perplexity, and Claude recommend you to buyers.",
  alternates: {
    canonical: `${SITE_URL}/use-cases/saas`,
  },
  openGraph: {
    title: "AI Visibility for SaaS Companies - ConduitScore",
    description:
      "SaaS companies lose pipeline when AI agents can't find or cite their product. Get your AI visibility score in 30 seconds.",
    url: `${SITE_URL}/use-cases/saas`,
    type: "website",
  },
};

function SaasUseCaseJsonLd() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why do SaaS companies need AI visibility optimization?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SaaS buyers increasingly use AI assistants like ChatGPT and Perplexity to research software. If your SaaS website is not optimized for AI agents, you will not appear in AI-generated recommendations, losing qualified pipeline to competitors who are visible. ConduitScore scans your site across 7 categories to measure and improve your AI visibility.",
        },
      },
      {
        "@type": "Question",
        name: "What AI visibility score should a SaaS website aim for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SaaS sites commonly underperform on structured data (Product and FAQPage schema), crawler access for AI bots, and missing LLMs.txt files. ConduitScore scans all seven categories and shows you the highest-impact fixes to improve your score.",
        },
      },
      {
        "@type": "Question",
        name: "How does ConduitScore help SaaS companies specifically?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ConduitScore provides SaaS-specific analysis including Product schema validation for pricing and feature pages, comparison page structure for 'vs' and 'alternative' queries, knowledge base optimization for support content, and API documentation visibility. You get copy-paste code fixes for every issue found.",
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
      { "@type": "ListItem", position: 3, name: "SaaS", item: `${SITE_URL}/use-cases/saas` },
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

export default function SaasUseCasePage() {
  return (
    <>
      <SaasUseCaseJsonLd />
      <Header />
      <main style={{ background: "var(--surface-base)" }}>
        {/* Hero */}
        <section className="hero-bg relative py-24 sm:py-32">
          <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="container-wide mx-auto relative z-10 text-center px-4">
            <span className="badge badge-violet mb-6 inline-flex">SaaS Companies</span>
            <h1
              className="mx-auto max-w-3xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              AI Agents Are the New Buyer Journey.{" "}
              <span className="gradient-text">Is Your SaaS Visible?</span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              When a prospect asks ChatGPT &ldquo;best project management tool for startups&rdquo;
              or Perplexity &ldquo;CRM with API integrations,&rdquo; your product needs to be in the
              answer. ConduitScore shows you exactly where you stand and how to get cited.
            </p>
            <div className="mt-10">
              <Link href="/" className="btn btn-primary btn-lg">
                Scan Your SaaS Website Free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="py-20 sm:py-24">
          <div className="container-wide mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  The SaaS Discovery Channel Has Shifted
                </h2>
                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                  B2B software buyers are replacing Google searches with AI-powered research. When
                  someone asks an AI assistant &ldquo;what are the best alternatives to [competitor]&rdquo;
                  or &ldquo;compare [category] tools,&rdquo; AI agents synthesize answers from across
                  the web. If your website is not structured for AI consumption, you are invisible in
                  this new discovery layer.{" "}
                  <Link href="/blog/what-is-ai-seo" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                    Learn how AI SEO differs from traditional SEO
                  </Link>.
                </p>
                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                  Traditional SEO still matters, but it is no longer sufficient. AI agents do not rank
                  pages -- they extract, synthesize, and cite. Your pricing page, comparison pages,
                  feature documentation, and knowledge base all need to be machine-readable for
                  ChatGPT, Perplexity, Claude, and Gemini.{" "}
                  <Link href="/methodology" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                    See how ConduitScore measures each signal
                  </Link>.
                </p>
              </div>
              <div className="card-glow p-8">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  What ConduitScore Checks for SaaS
                </h3>
                <ul className="mt-5 space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {[
                    { label: "Crawler Access", desc: "GPTBot, PerplexityBot, ClaudeBot allowed in robots.txt" },
                    { label: "Product Schema", desc: "Pricing tiers, features, and offers in JSON-LD" },
                    { label: "Comparison Content", desc: "vs-pages and alternatives structured for extraction" },
                    { label: "Knowledge Base", desc: "Help docs, API reference optimized for AI citation" },
                    { label: "LLMs.txt", desc: "Machine-readable site summary for AI agents" },
                    { label: "Citation Signals", desc: "Authority markers that make AI trust your content" },
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

        {/* How it works */}
        <section className="py-20 sm:py-24" style={{ background: "var(--surface-raised)" }}>
          <div className="container-wide mx-auto px-4 text-center">
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              Three Steps to AI Visibility for Your SaaS
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Scan",
                  desc: "Enter your SaaS URL. ConduitScore analyzes 7 categories in 30 seconds, checking how every major AI bot sees your site.",
                },
                {
                  step: "02",
                  title: "Fix",
                  desc: "Get copy-paste code snippets for robots.txt rules, Product schema, FAQ markup, and LLMs.txt. Implement in minutes, not weeks.",
                },
                {
                  step: "03",
                  title: "Monitor",
                  desc: "Track your AI visibility score over time. Get alerts when crawler access changes or new AI bots emerge.",
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

        {/* First-party data proof */}
        <section className="py-20 sm:py-24">
          <div className="container-wide mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <div
                className="rounded-2xl border p-8 sm:p-10"
                style={{
                  background: "var(--surface-raised)",
                  borderColor: "rgba(108,59,255,0.2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: "rgba(108,59,255,0.15)", color: "var(--violet-300)" }}
                  >
                    &#9679;
                  </span>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--violet-300)" }}
                    >
                      What we see in our data
                    </p>
                    <h2
                      className="mt-2 text-xl font-bold sm:text-2xl"
                      style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                    >
                      Most sites have significant room to improve
                    </h2>
                  </div>
                </div>
                <p className="mt-6" style={{ color: "var(--text-secondary)" }}>
                  Based on 457 ConduitScore scans run between March 13 and March 17, 2026, the
                  median AI visibility score across all sites is{" "}
                  <strong style={{ color: "var(--text-primary)" }}>29 out of 100</strong>. That
                  means half of all sites we have scanned score below 29 -- signaling that crawler
                  access, structured data, and LLMs.txt coverage are consistently missing or
                  incomplete across the web.
                </p>
                <div
                  className="mt-6 grid gap-4 sm:grid-cols-3 rounded-xl p-6"
                  style={{ background: "var(--surface-base)" }}
                >
                  {[
                    { stat: "457", label: "Sites scanned" },
                    { stat: "29 / 100", label: "Median score" },
                    { stat: "95 / 100", label: "Top score observed" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--violet-300)", fontFamily: "var(--font-display)" }}
                      >
                        {item.stat}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
                  The highest-scoring sites in our sample (95+) share three traits: AI crawlers
                  are explicitly allowed in robots.txt, key pages carry valid JSON-LD structured
                  data, and an LLMs.txt file is present at the domain root. These are mechanical
                  fixes -- not content overhauls -- and they account for most of the gap between
                  a score of 29 and a score above 90.
                </p>
                <p
                  className="mt-4 text-xs"
                  style={{ color: "var(--text-tertiary, var(--text-secondary))", opacity: 0.7 }}
                >
                  Data from 457 anonymous ConduitScore scans, March 13&ndash;17, 2026.
                </p>
              </div>
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
                Stop Losing Pipeline to Invisible Pages
              </h2>
              <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                Scan your SaaS website now and find out exactly what AI agents see -- and what they
                are missing. Free scan, no sign-up required.{" "}
                <Link href="/sample-reports/high-score" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                  See what a high-scoring site looks like
                </Link>.
              </p>
              <div className="mt-8">
                <Link href="/" className="btn btn-primary btn-lg">
                  Scan Your Website Free
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
