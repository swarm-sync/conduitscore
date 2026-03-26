import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "ConduitScore — Docs, FAQ, and API",
  description:
    "Answers to the most common questions about ConduitScore, AI visibility scans, plan access, bulk uploads, and Scale API access.",
  alternates: {
    canonical: `${SITE_URL}/docs`,
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
      "Yes. ConduitScore runs scans through Conduit, a real audited browser pipeline, so the results reflect rendered pages instead of only static HTML fetches.",
  },
  {
    question: "What do I get back?",
    answer:
      "You get an overall AI visibility score, category breakdowns, concrete issues, and fixes. Free scans show one sample fix with the rest locked. Paid plans unlock the full fix set.",
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
      "Yes, ConduitScore offers a free tier with 3 scans per month and no sign-up required. Free users get the score, issue titles, and one sample fix. Paid plans unlock monitoring, full fixes, and higher-volume workflows.",
  },
  {
    question: "How often should I scan my site?",
    answer:
      "We recommend scanning after every major content or technical change. For actively maintained sites, a weekly scan helps catch regressions in AI visibility before they impact your presence in AI-generated answers.",
  },
];

export default function DocsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto px-6 md:px-0">
            <span className="section-label">Documentation</span>
            <h1 className="mt-4 uppercase">Frequently Asked Questions</h1>
            <p className="mt-4 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Everything you need to know about AI visibility scans, plan access, bulk uploads, and Scale API access.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container-base mx-auto px-6 md:px-0">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="rounded-[24px]"
                  style={{
                    background: "var(--surface-overlay)",
                    border: "1px solid var(--border-subtle)",
                  }}
                  open={index === 0}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                    style={{ listStyle: "none", color: "var(--text-primary)" }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
                      {faq.question}
                    </span>
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "rgba(255,45,85,0.08)",
                        border: "1px solid rgba(255,45,85,0.18)",
                        color: "var(--brand-red)",
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <span className="section-label">Monitoring</span>
              <h2 className="mt-4 uppercase">Feature access by plan</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                ConduitScore keeps the free tier useful, then adds depth, automation, alerts, and integrations as your workflow gets more serious.
              </p>
            </div>
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
            >
              {[
                ["AI visibility score", "All plans"],
                ["Code fixes unlocked", "Fix+"],
                ["Issue descriptions", "Fix+"],
                ["Dashboard & history", "All plans"],
                ["Scheduled re-scans", "Monitor+"],
                ["Score trend chart", "Monitor+"],
                ["Email alerts", "Alert+"],
                ["Bulk scan (CSV upload)", "Scale"],
                ["REST API access", "Scale"],
              ].map(([label, plan], index) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
                  style={{
                    borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ color: "var(--text-primary)" }}>{label}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{plan}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <span className="section-label">API</span>
              <h2 className="mt-4 uppercase">REST API quick start</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Scale plans can create API keys from Billing. The public API overview explains what the API is for, and Scale customers get hands-on integration details inside the app once they have access.
              </p>
            </div>
            <div className="space-y-4">
              <div
                className="rounded-[24px] p-6"
                style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Available endpoints
                </p>
                <ul className="mt-4 space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <li><code>GET /api/public/domain/{"{domain}"}/score</code> is available as a simple public lookup.</li>
                  <li>Scale customers can create API keys from Billing for authenticated scan access.</li>
                  <li>Authenticated endpoints cover scans, scan history, and scan detail retrieval.</li>
                </ul>
              </div>
              <div
                className="rounded-[24px] p-6 text-sm leading-relaxed"
                style={{ background: "rgba(5,10,18,0.92)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                <p>
                  Want the non-technical overview first? Visit the public API access page. If you are already on Scale,
                  open Billing to create keys and use the in-app integration examples.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/api-access"
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all"
                    style={{ background: "var(--brand-red)", color: "var(--text-primary)", textDecoration: "none" }}
                  >
                    API overview
                  </Link>
                  <Link
                    href="/settings/billing"
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all"
                    style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)", textDecoration: "none" }}
                  >
                    Scale customer billing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <span className="section-label">Scale</span>
              <h2 className="mt-4 uppercase">Bulk CSV upload</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Scale plans can upload a CSV from the Projects dashboard to create multiple projects and trigger initial scans in one pass.
              </p>
            </div>
            <div
              className="rounded-[24px] p-6"
              style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                CSV format
              </p>
              <pre
                className="mt-4 overflow-x-auto rounded-2xl p-4 text-xs"
                style={{ background: "rgba(5,10,18,0.92)", color: "var(--text-secondary)" }}
              >
{`name,url
Main Site,https://example.com
Docs,https://docs.example.com`}
              </pre>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                You can also upload a one-column file with just URLs. ConduitScore will create missing projects automatically and start the first scan for each row.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto px-6 text-center md:px-0">
            <span className="section-label">Ready to audit?</span>
            <h2 className="mt-4 uppercase">See how AI systems read your site</h2>
            <p className="mx-auto mt-4 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Free scan, no sign-up required. Get your AI visibility score in about 15 seconds.
            </p>
            <div className="mt-8">
              <Link
                href="/#scan"
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all"
                style={{
                  background: "var(--brand-red)",
                  color: "var(--text-primary)",
                  border: "none",
                  textDecoration: "none",
                }}
              >
                Run a free scan
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
