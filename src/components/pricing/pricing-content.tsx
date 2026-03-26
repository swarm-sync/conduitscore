"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PricingCard } from "@/components/pricing/pricing-card";

export interface PricingPlan {
  name: string;
  monthlyPrice: string;
  annualPrice?: string;
  annualTotal?: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  contactOnly?: boolean;
}

export interface PricingFaq {
  question: string;
  answer: string;
}

interface PricingContentProps {
  plans: PricingPlan[];
  pricingFaqs: PricingFaq[];
}

export function PricingContent({ plans, pricingFaqs }: PricingContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [annualBilling, setAnnualBilling] = useState(() => searchParams.get("billing") === "yearly");

  useEffect(() => {
    setAnnualBilling(searchParams.get("billing") === "yearly");
  }, [searchParams]);

  function updateBillingMode(nextAnnualBilling: boolean) {
    setAnnualBilling(nextAnnualBilling);

    const params = new URLSearchParams(searchParams.toString());
    if (nextAnnualBilling) {
      params.set("billing", "yearly");
    } else {
      params.delete("billing");
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }

  const comparisonRows = [
    annualBilling
      ? { feature: "Yearly billing", free: "$0", starter: "$276/yr", pro: "$468/yr", growth: "$756/yr", agency: "Contact us" }
      : { feature: "Monthly price", free: "$0", starter: "$29", pro: "$49", growth: "$79", agency: "$149" },
    { feature: "Scans per month", free: "3", starter: "50", pro: "100", growth: "500", agency: "Unlimited" },
    { feature: "Dashboard & history", free: "Yes", starter: "Yes", pro: "Yes", growth: "Yes", agency: "Yes" },
    { feature: "Code fixes unlocked", free: "1 sample", starter: "Yes", pro: "Yes", growth: "Yes", agency: "Yes" },
    { feature: "Issue descriptions", free: "Titles only", starter: "Yes", pro: "Yes", growth: "Yes", agency: "Yes" },
    { feature: "Score trend chart", free: "—", starter: "—", pro: "Yes", growth: "Yes", agency: "Yes" },
    { feature: "Scheduled re-scans", free: "—", starter: "—", pro: "Yes", growth: "Yes", agency: "Yes" },
    { feature: "Email alerts", free: "—", starter: "—", pro: "—", growth: "Yes", agency: "Yes" },
    { feature: "Bulk CSV upload", free: "—", starter: "—", pro: "—", growth: "—", agency: "Yes" },
    { feature: "REST API access", free: "—", starter: "—", pro: "—", growth: "—", agency: "Yes" },
  ];

  return (
    <>
      <section className="py-20">
        <div className="container-wide mx-auto">
          <div className="mb-10 text-center">
            <div
              className="inline-flex rounded-full p-1"
              style={{
                background: "var(--surface-overlay)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <button
                type="button"
                onClick={() => updateBillingMode(false)}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all"
                style={{
                  background: annualBilling ? "transparent" : "var(--brand-red)",
                  color: annualBilling ? "var(--text-secondary)" : "#fff",
                }}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => updateBillingMode(true)}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all"
                style={{
                  background: annualBilling ? "var(--brand-red)" : "transparent",
                  color: annualBilling ? "#fff" : "var(--text-secondary)",
                }}
              >
                Yearly
              </button>
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
              Save 20% with yearly billing on Fix, Monitor, and Alert. Yearly prices are shown as monthly equivalents and billed annually.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-5 items-start">
            {plans.map((plan) => {
              const price = annualBilling && plan.annualPrice ? plan.annualPrice : plan.monthlyPrice;
              const annualNote = plan.contactOnly
                ? undefined
                : annualBilling
                ? plan.annualTotal
                  ? `${plan.annualTotal} billed yearly`
                  : undefined
                : plan.annualPrice
                ? `${plan.annualPrice}/mo billed annually`
                : undefined;

              return (
                <PricingCard
                  key={plan.name}
                  name={plan.name}
                  price={price}
                  period={plan.period}
                  annualNote={annualNote}
                  description={plan.description}
                  features={plan.features}
                  cta={plan.cta}
                  popular={plan.popular}
                  contactOnly={plan.contactOnly}
                  annual={annualBilling}
                />
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            All paid plans include a{" "}
            <span style={{ color: "var(--text-secondary)" }}>14-day money-back guarantee</span>.
            Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

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
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)", width: "25%" }}
                  >
                    Feature
                  </th>
                  {["Diagnose", "Fix", "Monitor", "Alert", "Scale"].map((plan) => (
                    <th
                      key={plan}
                      className="py-4 px-4 text-center font-semibold"
                      style={{
                        color: plan === "Monitor" ? "var(--brand-red)" : "var(--text-secondary)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {plan}
                      {plan === "Monitor" && (
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
                    {[row.free, row.starter, row.pro, row.growth, row.agency].map((val, vi) => (
                      <td key={vi} className="py-3.5 px-4 text-center">
                        {val === "Yes" ? (
                          <div className="flex justify-center">
                            <div
                              className="flex h-5 w-5 items-center justify-center rounded-full"
                              style={{
                                background: vi === 2
                                  ? "rgba(255,45,85,0.10)"
                                  : "rgba(0,229,160,0.08)",
                                border: vi === 2
                                  ? "1px solid rgba(255,45,85,0.22)"
                                  : "1px solid rgba(0,229,160,0.20)",
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-label="Included">
                                <path
                                  d="M2 5l2.5 2.5 3.5-4"
                                  stroke={vi === 2 ? "var(--brand-red)" : "var(--success-400)"}
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
                              color: vi === 2 ? "var(--brand-red)" : "var(--text-secondary)",
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
                      color: "var(--brand-red)",
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
    </>
  );
}
