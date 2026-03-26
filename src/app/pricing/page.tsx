import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingContent } from "@/components/pricing/pricing-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "Pricing - AI Visibility Scanner Plans",
  description:
    "ConduitScore pricing: start free with Diagnose, unlock fixes with Fix, automate tracking with Monitor, add alerts with Alert, and scale workflows with Scale.",
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
  openGraph: {
    title: "ConduitScore Pricing - AI Visibility Scanner Plans",
    description:
      "Start free, then upgrade for full fixes, automation, alerts, and API access when your workflow needs more.",
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
};

const plans = [
  {
    name: "Diagnose",
    monthlyPrice: "$0",
    description: "See the problem before you commit",
    features: [
      "3 scans per month",
      "AI visibility score",
      "Issue titles only",
      "1 free sample code fix",
      "Basic dashboard & history",
      "No sign-up required",
    ],
    cta: "Scan Free",
    popular: false,
  },
  {
    name: "Fix",
    monthlyPrice: "$29",
    annualPrice: "$23",
    annualTotal: "$276",
    period: "/mo",
    description: "Unlock every fix and explanation",
    features: [
      "50 scans per month",
      "Everything in Diagnose",
      "All code fixes unlocked",
      "Full issue descriptions",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Monitor",
    monthlyPrice: "$49",
    annualPrice: "$39",
    annualTotal: "$468",
    period: "/mo",
    description: "Automate tracking across your sites",
    features: [
      "100 scans per month",
      "Everything in Fix",
      "Multi-site monitoring",
      "Scheduled weekly re-scans",
      "Score trend chart",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Alert",
    monthlyPrice: "$79",
    annualPrice: "$63",
    annualTotal: "$756",
    period: "/mo",
    description: "Get notified when your score slips",
    features: [
      "500 scans per month",
      "Everything in Monitor",
      "Email alerts on score drop",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Scale",
    monthlyPrice: "$149",
    description: "Integrate ConduitScore into high-volume workflows",
    features: [
      "Unlimited scans",
      "Everything in Alert",
      "Bulk scan via CSV upload",
      "REST API access",
      "API keys for programmatic scans",
      "Multi-client workflow",
    ],
    cta: "Contact Us",
    popular: false,
    contactOnly: true,
  },
];

function PricingPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ConduitScore Pricing",
    description: "Compare ConduitScore plans and pricing for AI visibility scanning.",
    url: `${SITE_URL}/pricing`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",    item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: plans.length,
      itemListElement: plans.map((plan, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: `${plan.name} Plan`,
          price: plan.monthlyPrice.replace("$", ""),
          priceCurrency: "USD",
          description: plan.description,
          url: `${SITE_URL}/pricing`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

const pricingFaqs = [
  {
    question: "Can I try ConduitScore before purchasing?",
    answer:
      "Yes. ConduitScore offers 3 free scans per month with no sign-up required. Just enter your URL and get your AI visibility score instantly.",
  },
  {
    question: "What happens when I exceed my monthly scan limit?",
    answer:
      "You can upgrade to a higher plan at any time. Unused scans do not roll over. Your scan count resets at the beginning of each billing cycle.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel anytime. Your plan will remain active until the end of your current billing period.",
  },
  {
    question: "Do you offer annual billing discounts?",
    answer:
      "Yes. Choose yearly billing on the pricing page to save 20% on Fix, Monitor, and Alert. Scale pricing is still handled directly with our team.",
  },
  {
    question: "Which plan should I start with?",
    answer:
      "Start with Diagnose if you want to see the problem. Move to Fix when you want the full remediation, Monitor when you need recurring tracking, Alert when you want score-drop notifications, and Scale when you need bulk workflows or API access.",
  },
];

function PricingFaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function PricingPage() {
  return (
    <>
      <PricingPageJsonLd />
      <PricingFaqJsonLd />
      <Header />
      <main className="min-h-screen" style={{ background: "var(--surface-base)" }}>

        {/* ===== HERO ===== */}
        <section
          className="relative py-24 overflow-hidden"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,59,255,0.22) 0%, rgba(217,255,0,0.04) 50%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none hero-grid"
            style={{ opacity: 0.5 }}
            aria-hidden="true"
          />

          <div className="container-wide mx-auto text-center relative">
            <span className="section-label">Pricing</span>
            <h1
              className="mt-3"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                fontWeight: 800,
                letterSpacing: "-0.034em",
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              }}
            >
              Pricing that grows with your workflow
            </h1>
            <p className="mt-4 text-lg max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              See the problem for free. Upgrade for full fixes, automation, alerts, and API access when you need more leverage.
            </p>
          </div>
        </section>

        <PricingContent plans={plans} pricingFaqs={pricingFaqs} />

        {/* ===== 14-SIGNAL COMPARISON ===== */}
        <section
          className="pb-20"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="container-wide mx-auto pt-16">
            <div className="text-center mb-12">
              <h2
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                More signals. More fixes. More visibility.
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                ConduitScore checks 14 signals across 7 categories that determine whether ChatGPT, Claude, and Perplexity can cite your site.
              </p>
            </div>
            <div
              className="overflow-x-auto rounded-xl"
              style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-overlay)" }}
            >
              <table className="w-full text-sm" role="table" aria-label="14-signal AI visibility comparison">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <th
                      className="py-4 px-6 text-left font-semibold"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)", width: "30%" }}
                    >
                      Signal checked
                    </th>
                    <th
                      className="py-4 px-4 text-center font-semibold"
                      style={{ color: "var(--brand-red)", fontFamily: "var(--font-display)" }}
                    >
                      ConduitScore
                    </th>
                    <th
                      className="py-4 px-4 text-center font-semibold"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}
                    >
                      Ayzeo
                    </th>
                    <th
                      className="py-4 px-4 text-center font-semibold"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}
                    >
                      GEOScore AI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { signal: "OAI-SearchBot detection", conduitscore: true, ayzeo: false, geoscore: false },
                    { signal: "GPTBot access", conduitscore: true, ayzeo: true, geoscore: true },
                    { signal: "ClaudeBot access", conduitscore: true, ayzeo: false, geoscore: false },
                    { signal: "PerplexityBot access", conduitscore: true, ayzeo: true, geoscore: true },
                    { signal: "Sitemap.xml fetch", conduitscore: true, ayzeo: true, geoscore: true },
                    { signal: "Canonical tags", conduitscore: true, ayzeo: false, geoscore: true },
                    { signal: "Noindex penalty scoring", conduitscore: true, ayzeo: false, geoscore: false },
                    { signal: "Contact page detection", conduitscore: true, ayzeo: false, geoscore: false },
                    { signal: "Schema.org markup", conduitscore: true, ayzeo: true, geoscore: true },
                    { signal: "LLMs.txt file", conduitscore: true, ayzeo: false, geoscore: false },
                    { signal: "Meta descriptions", conduitscore: true, ayzeo: true, geoscore: true },
                    { signal: "Structured data quality", conduitscore: true, ayzeo: true, geoscore: true },
                    { signal: "Copy-paste code fixes", conduitscore: true, ayzeo: false, geoscore: false },
                    { signal: "No credit card required for free scan", conduitscore: true, ayzeo: false, geoscore: false },
                  ].map((row, i) => (
                    <tr
                      key={row.signal}
                      style={{
                        borderBottom: i < 13 ? "1px solid var(--border-subtle)" : "none",
                        background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      }}
                    >
                      <td className="py-3.5 px-6" style={{ color: "var(--text-secondary)" }}>
                        {row.signal}
                      </td>
                      {[row.conduitscore, row.ayzeo, row.geoscore].map((included, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-center">
                          {included ? (
                            <div className="flex justify-center">
                              <div
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{
                                  background: idx === 0 ? "rgba(255,45,85,0.10)" : "rgba(100,100,120,0.10)",
                                  border: idx === 0 ? "1px solid rgba(255,45,85,0.22)" : "1px solid rgba(100,100,120,0.22)",
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-label="Included">
                                  <path
                                    d="M2 5l2.5 2.5 3.5-4"
                                    stroke={idx === 0 ? "var(--brand-red)" : "var(--text-tertiary)"}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: "var(--text-tertiary)" }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
