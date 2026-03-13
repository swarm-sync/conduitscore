import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "About ConduitScore - AI Visibility Experts",
  description:
    "ConduitScore is the leading AI visibility scanner built by SEO and AI specialists. Learn about our mission to help every website thrive in the agent economy.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About ConduitScore - AI Visibility Experts",
    description:
      "Built by SEO and AI specialists for the agent economy. Learn how we help websites optimize for ChatGPT, Perplexity, Claude, and more.",
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
      "ConduitScore is the leading AI visibility scanner built to help websites optimize for AI agents.",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "ConduitScore",
      url: SITE_URL,
      foundingDate: "2026",
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
                Citation Signals, and Content Quality. In 30 seconds, you get a 0-100 AI visibility
                score plus copy-paste code fixes to improve it.
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
                It takes 30 seconds and no sign-up is required.
              </p>
              <Link
                href="/"
                className="btn btn-primary btn-lg mt-6 inline-flex"
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
