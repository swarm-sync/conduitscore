import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For individual site owners",
    features: ["5 pages per scan", "50 scans/month", "PDF reports", "Email alerts", "Dashboard access"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    description: "For growing businesses",
    features: ["50 pages per scan", "500 scans/month", "Weekly monitoring", "Priority support", "API access", "Custom branding"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$149",
    description: "For agencies & enterprises",
    features: ["Unlimited pages", "Unlimited scans", "White-label reports", "API keys", "Team accounts", "Dedicated support", "Custom integrations"],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="py-24 bg-[#F9FAFB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0A1628] sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-[#475569]">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? "border-[#2E5C8A] ring-2 ring-[#2E5C8A]" : "border-[#E5E7EB]"}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2E5C8A] px-4 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-[#0A1628]">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#475569]">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-[#0A1628]">{plan.price}</span>
                  <span className="text-sm text-[#475569]">/month</span>
                </div>
                <button
                  className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${plan.popular ? "bg-[#2E5C8A] text-white hover:bg-[#1E3A5F]" : "border border-[#E5E7EB] text-[#0A1628] hover:bg-[#F9FAFB]"}`}
                >
                  {plan.cta}
                </button>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#475569]">
                      <svg className="h-4 w-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
