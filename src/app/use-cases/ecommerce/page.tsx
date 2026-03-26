import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "AI Visibility for E-commerce - ConduitScore",
  description:
    "E-commerce stores miss sales when AI shopping assistants can't read product data. ConduitScore scans your store so ChatGPT, Perplexity, and Gemini recommend your products to shoppers.",
  alternates: {
    canonical: `${SITE_URL}/use-cases/ecommerce`,
  },
  openGraph: {
    title: "AI Visibility for E-commerce - ConduitScore",
    description:
      "E-commerce stores miss sales when AI shopping assistants can't read product data. Get your AI visibility score in 30 seconds.",
    url: `${SITE_URL}/use-cases/ecommerce`,
    type: "website",
  },
};

function EcommerceUseCaseJsonLd() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why does AI visibility matter for e-commerce stores?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI shopping assistants like ChatGPT, Perplexity, and Google Gemini are becoming a primary product discovery channel. When shoppers ask 'best running shoes under $150' or 'compare wireless earbuds,' AI agents pull product data from stores with proper structured data and crawler access. Without AI optimization, your products are invisible to this growing channel.",
        },
      },
      {
        "@type": "Question",
        name: "What structured data does an e-commerce site need for AI visibility?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "E-commerce sites should implement Product schema with price, availability, and review data; BreadcrumbList for category navigation; FAQPage schema on product pages for common buyer questions; and AggregateRating schema for social proof. ConduitScore validates all of these and provides copy-paste JSON-LD code for each.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly can I improve my e-commerce AI visibility score?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most e-commerce sites can improve their AI visibility score by 20-30 points within a week by implementing three quick wins: allowing AI crawlers in robots.txt, adding Product schema to product pages, and creating an LLMs.txt file. ConduitScore provides the exact code for each fix.",
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
      { "@type": "ListItem", position: 3, name: "E-commerce", item: `${SITE_URL}/use-cases/ecommerce` },
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

export default function EcommerceUseCasePage() {
  return (
    <>
      <EcommerceUseCaseJsonLd />
      <Header />
      <main style={{ background: "var(--surface-base)" }}>
        {/* Hero */}
        <section className="hero-bg relative py-24 sm:py-32">
          <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="container-wide mx-auto relative z-10 text-center px-4">
            <span className="badge badge-cyan mb-6 inline-flex">E-commerce</span>
            <h1
              className="mx-auto max-w-3xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              AI Shopping Assistants Are Recommending Products.{" "}
              <span className="gradient-text">Are Yours on the List?</span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              When shoppers ask ChatGPT &ldquo;best noise-canceling headphones under $300&rdquo; or
              Perplexity &ldquo;compare standing desks,&rdquo; AI agents pull product data from the
              web. If your store is not optimized, your products are invisible to this fast-growing
              channel.
            </p>
            <div className="mt-10">
              <Link href="/" className="btn btn-primary btn-lg">
                Scan Your Store Free
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
                  Product Discovery Has a New Channel
                </h2>
                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                  AI-powered shopping is growing at over 400% year-over-year. Consumers now ask
                  ChatGPT, Perplexity, and Google Gemini for product recommendations before visiting
                  any store. These AI agents do not browse your site like humans -- they parse
                  structured data, read product schema, and evaluate your content for authority and
                  accuracy.
                </p>
                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                  The e-commerce sites that win in this new channel are the ones with proper Product
                  schema on every page, AI crawler access enabled, rich product descriptions with
                  comparison data, and a machine-readable site summary via LLMs.txt. Without these,
                  AI agents literally cannot see your inventory.
                </p>
              </div>
              <div className="card-glow p-8">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  What ConduitScore Checks for E-commerce
                </h3>
                <ul className="mt-5 space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {[
                    { label: "Product Schema", desc: "Price, availability, reviews, and offers in JSON-LD on every product page" },
                    { label: "Crawler Access", desc: "GPTBot, PerplexityBot, Google-Extended allowed to crawl product pages" },
                    { label: "Category Structure", desc: "BreadcrumbList schema for navigation hierarchy" },
                    { label: "Review Markup", desc: "AggregateRating schema for social proof in AI answers" },
                    { label: "Product Descriptions", desc: "Structured content that AI agents can extract and cite" },
                    { label: "LLMs.txt", desc: "Machine-readable catalog summary with top products and categories" },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <span
                        className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "rgba(0,217,255,0.12)", color: "var(--cyan-300)" }}
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

        {/* Stats */}
        <section className="py-20 sm:py-24" style={{ background: "var(--surface-raised)" }}>
          <div className="container-wide mx-auto px-4 text-center">
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              AI-Powered Shopping Is Not a Future Trend
            </h2>
            <p className="mx-auto mt-4 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              It is happening now. E-commerce stores that optimize for AI agents today are capturing
              demand that competitors cannot even see.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                { stat: "400%+", label: "YoY growth in AI-assisted shopping queries" },
                { stat: "73%", label: "of AI product recommendations cite stores with Product schema" },
                { stat: "20-30 pts", label: "average score improvement after implementing fixes" },
              ].map((item) => (
                <div key={item.label} className="card p-8">
                  <div
                    className="stat-number text-4xl gradient-text"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.stat}
                  </div>
                  <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.label}
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
                Make Your Products Visible to AI Shoppers
              </h2>
              <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                Scan your e-commerce store now. See exactly what AI agents find -- and what they miss.
                Get copy-paste Product schema and crawler access fixes in 30 seconds.
              </p>
              <div className="mt-8">
                <Link href="/" className="btn btn-primary btn-lg">
                  Scan Your Store Free
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
