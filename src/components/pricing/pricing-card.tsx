"use client";

import { useState } from "react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export function PricingCard({ name, price, description, features, cta, popular }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (name === "Agency") {
      window.location.href = "mailto:sales@agentoptimize.com";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: name.toLowerCase() }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative rounded-2xl border bg-white p-8 ${popular ? "border-[#2E5C8A] ring-2 ring-[#2E5C8A]" : "border-[#E5E7EB]"}`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2E5C8A] px-4 py-1 text-xs font-medium text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-[#0A1628]">{name}</h3>
      <p className="mt-1 text-sm text-[#475569]">{description}</p>
      <div className="mt-6">
        <span className="text-4xl font-extrabold text-[#0A1628]">{price}</span>
        <span className="text-sm text-[#475569]">/month</span>
      </div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${popular ? "bg-[#2E5C8A] text-white hover:bg-[#1E3A5F]" : "border border-[#E5E7EB] text-[#0A1628] hover:bg-[#F9FAFB]"}`}
      >
        {loading ? "Loading..." : cta}
      </button>
      <ul className="mt-8 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-[#475569]">
            <svg className="h-4 w-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
