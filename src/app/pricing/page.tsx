import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingCard } from "@/components/pricing/pricing-card";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "Pricing - AI Visibility Scanner Plans",
  description:
    "ConduitScore pricing: Free (3 scans/month), Starter ($29/mo, 50 scans), Pro ($199/mo, 500 scans + site-wide crawling), Agency ($499/mo, unlimited + API). Start free, upgrade when you need more.",
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
  openGraph: {
    title: "ConduitScore Pricing - AI Visibility Scanner Plans",
    description:
      "Start free with 3 AI visibility scans per month. Upgrade for site-wide crawling, competitor tracking, and white-label options.",
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try it out, no commitment",
    features: [
      "3 scans per month",
      "Single URL analysis",
      "7-category AI scoring",
      "Copy-paste code fixes",
      "No sign-up required",
    ],
    cta: "Scan Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$29",
    description: "For individual site owners",
    features: [
      "50 scans per month",
      "Single URL analysis",
      "7-category AI scoring",
      "Email alerts on score changes",
      "Dashboard access",
      "Scan history",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$199",
    description: "For growing businesses",
    features: [
      "500 scans per month",
      "Site-wide crawling",
      "Competitor tracking (up to 10)",
      "Priority support",
      "Weekly PDF reports",
      "Custom branding",
      "Scheduled scanning",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Agency",
    price: "$499",
    description: "For agencies and enterprises",
    features: [
      "Unlimited scans",
      "Site-wide crawling",
      "White-label branding",
      "REST API access",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited competitor tracking",
    ],
    cta: "Contact Sales",
    popular: false,
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
          price: plan.price.replace("$", ""),
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
      "Yes, annual billing saves you 20% compared to monthly pricing. Contact our sales team for custom enterprise pricing.",
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

const comparisonRows = [
  { feature: "Scans per month",     free: "3",       starter: "50",   pro: "500",       agency: "Unlimited" },
  { feature: "AI visibility score", free: "Yes",     starter: "Yes",  pro: "Yes",       agency: "Yes" },
  { feature: "Copy-paste fixes",    free: "Yes",     starter: "Yes",  pro: "Yes",       agency: "Yes" },
  { feature: "Scan history",        free: "—",       starter: "Yes",  pro: "Yes",       agency: "Yes" },
  { feature: "Site-wide crawling",  free: "—",       starter: "—",    pro: "Yes",       agency: "Yes" },
  { feature: "Competitor tracking", free: "—",       starter: "—",    pro: "Up to 10",  agency: "Unlimited" },
  { feature: "Scheduled scanning",  free: "—",       starter: "—",    pro: "Weekly",    agency: "Daily" },
  { feature: "PDF reports",         free: "—",       starter: "—",    pro: "Yes",       agency: "Yes" },
  { feature: "REST API access",     free: "—",       starter: "—",    pro: "—",         agency: "Yes" },
  { feature: "White-label",         free: "—",       starter: "—",    pro: "—",         agency: "Yes" },
];

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
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,59,255,0.22) 0%, rgba(0,217,255,0.06) 50%, transparent 70%)",
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
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Start free. Upgrade when you need more AI visibility coverage.
            </p>
            {/* Annual savings badge */}
            <div
              className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{
                background: "rgba(0,229,160,0.08)",
                border: "1px solid rgba(0,229,160,0.22)",
                color: "var(--success-400)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Annual billing saves 20%
            </div>
          </div>
        </section>

        {/* ===== PLANS GRID ===== */}
        <section className="py-20">
          <div className="container-wide mx-auto">
            <div className="grid gap-5 lg:grid-cols-4 items-start">
              {plans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>

            {/* Money-back note */}
            <p className="mt-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              All paid plans include a{" "}
              <span style={{ color: "var(--text-secondary)" }}>14-day money-back guarantee</span>.
              Cancel anytime, no questions asked.
            </p>
          </div>
        </section>

        {/* ===== COMPARISON TABLE ===== */}
        <section
          className="pb-20"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="container-wide mx-auto pt-16">
            <h2
              className="text-center text-2xl font-bold mb-10"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              Compare all features
            </h2>
            <div
              className="overflow-x-auto rounded-xl"
              style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-overlay)" }}
            >
              <table className="w-full text-sm" role="table" aria-label="Plan feature comparison">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <th
                      className="py-4 px-6 text-left font-semibold"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)", width: "30%" }}
                    >
                      Feature
                    </th>
                    {["Free", "Starter", "Pro", "Agency"].map((plan) => (
                      <th
                        key={plan}
                        className="py-4 px-4 text-center font-semibold"
                        style={{
                          color: plan === "Pro" ? "var(--cyan-400)" : "var(--text-secondary)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {plan}
                        {plan === "Pro" && (
                          <span
                            className="block text-xs font-normal mt-0.5"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            Popular
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        borderBottom: i < comparisonRows.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      }}
                    >
                      <td className="py-3.5 px-6" style={{ color: "var(--text-secondary)" }}>
                        {row.feature}
                      </td>
                      {[row.free, row.starter, row.pro, row.agency].map((val, vi) => (
                        <td key={vi} className="py-3.5 px-4 text-center">
                          {val === "Yes" ? (
                            <div className="flex justify-center">
                              <div
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{
                                  background: vi === 2
                                    ? "rgba(0,217,255,0.10)"
                                    : "rgba(0,229,160,0.08)",
                                  border: vi === 2
                                    ? "1px solid rgba(0,217,255,0.22)"
                                    : "1px solid rgba(0,229,160,0.20)",
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-label="Included">
                                  <path
                                    d="M2 5l2.5 2.5 3.5-4"
                                    stroke={vi === 2 ? "var(--cyan-400)" : "var(--success-400)"}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          ) : val === "—" ? (
                            <span style={{ color: "var(--text-tertiary)" }}>—</span>
                          ) : (
                            <span
                              style={{
                                color: vi === 2 ? "var(--cyan-400)" : "var(--text-secondary)",
                                fontWeight: vi === 2 ? 600 : 400,
                                fontFamily: vi === 2 ? "var(--font-mono)" : "inherit",
                                fontSize: vi === 2 ? "0.8125rem" : "inherit",
                              }}
                            >
                              {val}
                            </span>
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

        {/* ===== PRICING FAQ ===== */}
        <section
          className="pb-24"
          style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}
        >
          <div className="container-wide mx-auto pt-16">
            <h2
              className="text-center text-2xl font-bold mb-10"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              Pricing FAQ
            </h2>
            <div className="mx-auto max-w-2xl space-y-3">
              {pricingFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl"
                  style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)", transition: "border-color 0.2s" }}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between p-5 font-semibold text-sm select-none"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", listStyle: "none" }}
                  >
                    {faq.question}
                    <span
                      className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-all group-open:rotate-180"
                      style={{
                        background: "rgba(108,59,255,0.08)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--cyan-400)",
                      }}
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
