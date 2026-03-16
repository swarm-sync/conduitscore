import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "ConduitScore — Documentation & FAQ",
  description:
    "Answers to the most common questions about ConduitScore, AI visibility optimization, llms.txt, structured data, and how to improve your AI readiness score.",
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
              Everything you need to know about AI visibility auditing, ConduitScore&apos;s scan methodology, and how to improve your site&apos;s score.
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
          <div className="container-base mx-auto px-6 text-center md:px-0">
            <span className="section-label">Ready to audit?</span>
            <h2 className="mt-4 uppercase">See how AI systems read your site</h2>
            <p className="mx-auto mt-4 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Free scan, no sign-up required. Get your AI visibility score in under 30 seconds.
            </p>
            <div className="mt-8">
              <a
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
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
