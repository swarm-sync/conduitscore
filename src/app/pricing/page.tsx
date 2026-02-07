import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingCard } from "@/components/pricing/pricing-card";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For individual site owners",
    features: ["50 scans per month", "Single URL analysis", "SEO scoring", "Email alerts", "Dashboard access"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$199",
    description: "For growing businesses",
    features: ["500 scans per month", "Site-wide crawling", "Competitor tracking", "Priority support", "Weekly reports", "Custom branding"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Agency",
    price: "$499",
    description: "For agencies & enterprises",
    features: ["Unlimited scans", "Site-wide crawling", "White-label branding", "REST API access", "Dedicated account manager", "Custom integrations"],
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
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
