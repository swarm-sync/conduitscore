import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "Contact ConduitScore - Get in Touch",
  description:
    "Contact the ConduitScore team for support, partnerships, or enterprise inquiries. We help websites optimize for AI visibility across ChatGPT, Perplexity, Claude, and Gemini.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact ConduitScore",
    description:
      "Get in touch with the ConduitScore team for support, partnerships, or enterprise inquiries.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

function ContactPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact ConduitScore",
    description:
      "Contact the ConduitScore team for support, partnerships, or enterprise inquiries.",
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "ConduitScore",
      url: SITE_URL,
      email: "support@conduitscore.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "support@conduitscore.com",
          contactType: "customer support",
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          email: "hello@conduitscore.com",
          contactType: "sales",
          availableLanguage: "English",
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: `${SITE_URL}/contact`,
        },
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

export default function ContactPage() {
  return (
    <>
      <ContactPageJsonLd />
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)" }}>
        <section
          className="hero-grid"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "96px",
            paddingBottom: "72px",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <nav
              className="mb-6 flex items-center gap-2 text-xs"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
                className="hover:text-cyan-400 transition-colors"
              >
                Home
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                Contact
              </span>
            </nav>

            <span className="section-label mb-4 block">Get in Touch</span>
            <h1 className="gradient-text">Contact ConduitScore</h1>
            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)", maxWidth: "600px" }}
            >
              Have questions about AI visibility optimization? Need help with
              your scan results? Want to discuss enterprise or agency
              partnerships? We are here to help.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="card-glow rounded-xl p-8">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                General Inquiries
              </h2>
              <p
                className="mt-3 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                For general questions, feedback, or partnership opportunities.
              </p>
              <a
                href="mailto:hello@conduitscore.com"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--cyan-400)" }}
              >
                hello@conduitscore.com
              </a>
            </div>

            <div className="card-glow rounded-xl p-8">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Technical Support
              </h2>
              <p
                className="mt-3 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Need help with scan results, API integration, or
                troubleshooting?
              </p>
              <a
                href="mailto:support@conduitscore.com"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--cyan-400)" }}
              >
                support@conduitscore.com
              </a>
            </div>

            <div className="card-glow rounded-xl p-8">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Enterprise &amp; Agency
              </h2>
              <p
                className="mt-3 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Interested in white-label solutions, custom API integrations, or
                volume pricing? Let us tailor a plan.
              </p>
              <a
                href="mailto:enterprise@conduitscore.com"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--cyan-400)" }}
              >
                enterprise@conduitscore.com
              </a>
            </div>

            <div className="card-glow rounded-xl p-8">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Follow Us
              </h2>
              <p
                className="mt-3 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Stay up to date with AI visibility insights, product updates,
                and industry news.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="https://twitter.com/conduitscore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium"
                  style={{ color: "var(--cyan-400)" }}
                >
                  X (Twitter)
                </a>
                <a
                  href="https://linkedin.com/company/conduitscore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium"
                  style={{ color: "var(--cyan-400)" }}
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/conduitscore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium"
                  style={{ color: "var(--cyan-400)" }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

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
                Run a free scan in 30 seconds. No account required.
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
