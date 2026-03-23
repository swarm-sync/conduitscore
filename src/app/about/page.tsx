import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "About ConduitScore — Built by Ben",
  description:
    "ConduitScore is built by Ben, a search and AI specialist with 7+ years optimizing websites for discoverability. Learn how we help every website thrive in the agent economy.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About ConduitScore — Built by Ben",
    description:
      "Built by Ben, the founder of ConduitScore — 7+ years at the intersection of SEO, AI, and search systems.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

function AboutPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About ConduitScore",
    description:
      "ConduitScore is the leading AI visibility scanner built by Ben to help websites optimize for AI agents.",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "ConduitScore",
      url: SITE_URL,
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        name: "Ben Stone",
        jobTitle: "Founder & CEO",
        email: "benstone@conduitscore.com",
        knowsAbout: [
          "AI Search Optimization",
          "Technical SEO",
          "Structured Data",
          "Large Language Models",
          "Search Engine Optimization",
        ],
      },
      description:
        "ConduitScore scans websites across 7 categories to measure how well AI agents like ChatGPT, Perplexity, Claude, and Gemini can discover, read, and cite the content.",
      knowsAbout: [
        "AI Search Optimization",
        "Generative Engine Optimization",
        "Answer Engine Optimization",
        "AI Crawler Access",
        "Structured Data for LLMs",
        "LLMs.txt Standard",
        "SEO for AI Agents",
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
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

export default function AboutPage() {
  return (
    <>
      <AboutPageJsonLd />
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)" }}>
        {/* Hero section with dot-grid texture */}
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
            <nav className="mb-6 flex items-center gap-2 text-xs" aria-label="Breadcrumb">
              <Link
                href="/"
                style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                className="hover:text-cyan-400 transition-colors"
              >
                Home
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>About</span>
            </nav>

            <span className="section-label mb-4 block">About Us</span>
            <h1 className="gradient-text">
              About ConduitScore
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)", maxWidth: "600px" }}
            >
              The web is changing. Google was the gatekeeper for 25 years, but a new era is emerging.
              AI agents -- ChatGPT, Perplexity, Claude, Gemini -- are becoming the primary way people
              discover information, compare products, and make decisions.
            </p>
            <p className="mt-3 text-sm author" style={{ color: "var(--text-tertiary)" }}>
              Built by Ben — 7+ years at the intersection of SEO, AI, and search systems.
            </p>
          </div>
        </section>

        {/* Content sections */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">

          <div className="space-y-16">
            {/* The Problem */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>The Problem</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Most websites were built for human visitors and Google crawlers. But AI agents process
                information differently. They need structured data, machine-readable content, explicit
                crawler access, and content formatted for extraction and citation. Without these signals,
                your website is invisible to the fastest-growing discovery channel on the internet.
              </p>
            </section>

            {/* Our Solution */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>Our Solution</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                ConduitScore scans any URL across 7 critical categories that AI agents evaluate:
                Crawler Access, Structured Data, Content Structure, LLMs.txt, Technical Health,
                Citation Signals, and Content Quality. In about 15 seconds, you get a 0-100 AI visibility
                score plus prioritized fixes to improve it.
              </p>
            </section>

            {/* Our Mission */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>Our Mission</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                We believe every website deserves to be visible in the agent economy. Our mission is
                to make AI visibility optimization as accessible and actionable as traditional SEO.
                Whether you are a solo founder, growing SaaS, or enterprise agency, ConduitScore
                gives you the tools to ensure AI agents can find, understand, and recommend your content.
              </p>
            </section>

            {/* What We Believe */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>What We Believe</h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "AI search is not a trend -- it is the new default.",
                    desc: "Over 100 million people already use AI assistants for search. That number is growing 300% year over year.",
                  },
                  {
                    title: "Structured data is the new SEO.",
                    desc: "JSON-LD, schema.org markup, and machine-readable content are what AI agents need to cite your website.",
                  },
                  {
                    title: "Every website should control its AI narrative.",
                    desc: "If you do not tell AI agents what your site is about, they will guess -- or ignore you entirely.",
                  },
                  {
                    title: "Optimization should be actionable, not theoretical.",
                    desc: "Every issue we detect comes with a copy-paste code fix. No vague advice, just working solutions.",
                  },
                ].map((belief) => (
                  <div key={belief.title} className="card-glow rounded-xl p-6">
                    <h3
                      className="font-semibold text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {belief.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {belief.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Founder */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>Meet the Founder</h2>

              {/* Founder card */}
              <div
                className="card-glow rounded-2xl mt-6 overflow-hidden"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    height: "3px",
                    background: "var(--gradient-primary)",
                    width: "100%",
                  }}
                />

                <div
                  style={{
                    padding: "32px",
                    display: "flex",
                    gap: "28px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Avatar */}
                  <div style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        padding: "2px",
                        background: "var(--gradient-primary)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/ben-stone-founder.svg"
                        alt="Ben, founder of ConduitScore"
                        width={116}
                        height={116}
                        style={{
                          borderRadius: "10px",
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  {/* Bio content */}
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    {/* Name + title row */}
                    <div style={{ marginBottom: "4px" }}>
                      <h3
                        style={{
                          color: "var(--text-primary)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        Ben Stone
                      </h3>
                      <p
                        style={{
                          color: "var(--brand-red)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          margin: "4px 0 0",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        Founder &amp; CEO
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: "1px",
                        background: "var(--border-subtle)",
                        margin: "14px 0",
                      }}
                    />

                    {/* Bio paragraphs */}
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        fontSize: "0.95rem",
                        marginBottom: "12px",
                      }}
                    >
                      Ben has spent 7+ years building products at the intersection of SEO, AI, and search
                      systems. He previously led technical SEO at a leading search optimization agency, where
                      he helped 50+ SaaS companies and e-commerce businesses optimize for discoverability
                      across Google, Bing, and structured data channels.
                    </p>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        fontSize: "0.95rem",
                        marginBottom: "20px",
                      }}
                    >
                      Frustrated by the gap between traditional SEO tooling and the emerging world of
                      AI-driven discovery, Ben built ConduitScore to help websites thrive as AI agents
                      become the primary way people find information. His mission: make AI visibility
                      optimization as accessible and actionable as traditional SEO.
                    </p>

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                      {["Technical SEO", "AI/LLMs", "Structured Data", "Search Systems", "SaaS"].map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: "3px 10px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                            background: "rgba(99, 102, 241, 0.12)",
                            border: "1px solid rgba(99, 102, 241, 0.22)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Social links */}
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <a
                        href="mailto:benstone@conduitscore.com"
                        className="founder-social-link founder-social-link--lime"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="20" height="16" x="2" y="4" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Expertise */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>Our Expertise</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                The ConduitScore team brings deep expertise across search engineering, AI systems, and web
                performance. Our scanner methodology is informed by direct analysis of how AI crawlers like
                {" "}<a href="https://platform.openai.com/docs/bots" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>GPTBot</a>,
                {" "}<a href="https://docs.anthropic.com/en/docs/about-claude/models" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>ClaudeBot</a>, and
                {" "}<a href="https://docs.perplexity.ai/guides/how-perplexity-works" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>PerplexityBot</a> process
                web content, combined with years of experience in structured data implementation and
                search engine optimization.
              </p>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                We are active contributors to the
                {" "}<a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)" }}>llms.txt standard</a> community
                and advocates for the open web, believing that websites should be able to control their
                visibility in AI systems the same way they control their visibility in traditional search engines.
              </p>
            </section>

            {/* Methodology Link */}
            <section>
              <h2 style={{ color: "var(--text-primary)" }}>How We Score Your Site</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Want to understand exactly how ConduitScore evaluates your AI visibility? Check out our detailed
                {" "}<Link href="/methodology" style={{ color: "var(--cyan-400)", textDecoration: "none" }} className="hover:underline">methodology page</Link> for
                a complete breakdown of the 14 signals, 7 categories, and scoring methodology.
              </p>
            </section>
          </div>

          {/* CTA block */}
          <div
            className="mt-20 rounded-2xl p-px"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div
              className="rounded-2xl p-10 text-center"
              style={{ backgroundColor: "var(--surface-elevated)" }}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Ready to Check Your AI Visibility?
              </h2>
              <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
                It takes about 15 seconds and no sign-up required.
              </p>
              <Link
                href="/"
                className="btn btn-primary btn-lg mt-6 inline-flex"
              >
                Scan My Site Now
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
