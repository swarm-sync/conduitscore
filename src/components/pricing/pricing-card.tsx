"use client";

import { useState } from "react";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  annualNote?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export function PricingCard({ name, price, period, annualNote, description, features, cta, popular }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (name === "Agency") {
      window.location.href = "mailto:sales@conduitscore.com";
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
    /* Popular card gets animated gradient border wrapper */
    <div
      className="relative flex-1"
      style={
        popular
          ? {
              padding: "1px",
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, #FF2D55 0%, #6366F1 56%, #D9FF00 100%)",
              backgroundSize: "200% 200%",
              animation: "gradient-shift 5s ease infinite",
            }
          : undefined
      }
    >
      <div
        className="relative flex h-full flex-col rounded-2xl p-8"
        style={{
          background: popular
            ? "linear-gradient(145deg, rgba(255,45,85,0.1) 0%, rgba(99,102,241,0.08) 42%, var(--surface-overlay) 100%)"
            : "var(--surface-overlay)",
          border: popular ? "none" : "1px solid var(--border-subtle)",
          borderRadius: popular ? "calc(var(--radius-xl) - 1px)" : "var(--radius-xl)",
          boxShadow: popular ? "var(--shadow-glow)" : "var(--shadow-card)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
          if (!popular) {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(108,59,255,0.35)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(108,59,255,0.08)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          if (!popular) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
          }
        }}
      >
        {/* Popular badge */}
        {popular && (
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #FF2D55 0%, #6366F1 100%)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(255,45,85,0.32), 0 0 20px rgba(99,102,241,0.18)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Most Popular
          </div>
        )}

        {/* Plan header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {name}
            </h3>
            {popular && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  background: "rgba(217,255,0,0.1)",
                  color: "var(--brand-lime)",
                  border: "1px solid rgba(217,255,0,0.22)",
                }}
              >
                Recommended
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{description}</p>
        </div>

        {/* Price */}
        <div className="mb-7">
          <div className="flex items-baseline gap-1">
            <span
              className="font-extrabold tabular-nums leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                letterSpacing: "-0.04em",
                ...(popular
                  ? {
                      background: "linear-gradient(135deg, #FF2D55 0%, #6366F1 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : { color: "var(--text-primary)" }),
              }}
            >
              {price}
            </span>
            {period && (
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{period}</span>
            )}
          </div>
          {annualNote && (
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              {annualNote} — save 20%
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-[var(--radius-md)] py-3 text-sm font-semibold transition-all mb-8 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: popular
              ? "var(--brand-red)"
              : "rgba(255, 45, 85, 0.08)",
            color: popular ? "#fff" : "var(--text-primary)",
            border: popular ? "none" : "1px solid var(--border-default)",
            boxShadow: popular ? "var(--shadow-btn)" : "none",
            fontFamily: "var(--font-display)",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.005em",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const el = e.currentTarget;
              if (popular) {
                el.style.boxShadow = "var(--shadow-btn-hover)";
                el.style.transform = "translateY(-1px)";
              } else {
                el.style.background = "rgba(255, 45, 85, 0.14)";
                el.style.borderColor = "rgba(255,45,85,0.35)";
                el.style.color = "var(--brand-lime)";
              }
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(0)";
            if (popular) {
              el.style.boxShadow = "var(--shadow-btn)";
            } else {
              el.style.background = "rgba(255, 45, 85, 0.08)";
              el.style.borderColor = "var(--border-default)";
              el.style.color = "var(--text-primary)";
            }
          }}
          aria-label={`${cta} for ${name} plan at ${price} per month`}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                <path d="M7 2a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Loading...
            </span>
          ) : (
            cta
          )}
        </button>

        {/* Feature list */}
        <ul className="space-y-3.5 mt-auto" aria-label={`${name} plan features`}>
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <div
                className="mt-0.5 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full"
                style={{
                  background: popular
                    ? "rgba(217,255,0,0.12)"
                    : "rgba(255,45,85,0.08)",
                  border: popular
                    ? "1px solid rgba(217,255,0,0.22)"
                    : "1px solid rgba(255,45,85,0.2)",
                }}
                aria-hidden="true"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5 3.5-4"
                    stroke={popular ? "var(--brand-lime)" : "var(--brand-red)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={{ color: "var(--text-secondary)" }}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
