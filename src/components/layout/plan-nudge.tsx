"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAN_DISPLAY_NAMES, PLAN_LIMITS } from "@/lib/plan-limits";

export function PlanNudge() {
  const [tier, setTier] = useState<string>("free");
  const [scanCount, setScanCount] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch("/api/user/billing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json() as { tier?: string; scanCountMonth?: number };
        setTier(data.tier ?? "free");
        setScanCount(data.scanCountMonth ?? 0);
      } catch {
        // silently keep defaults
      } finally {
        setLoaded(true);
      }
    }
    void fetchBilling();
  }, []);

  const planName = PLAN_DISPLAY_NAMES[tier] ?? "Diagnose";
  const limits = PLAN_LIMITS[tier] ?? PLAN_LIMITS.free;
  const isPaid = tier !== "free";
  const isUnlimited = !Number.isFinite(limits.scansPerMonth);
  const remaining = isUnlimited ? null : Math.max(0, limits.scansPerMonth - scanCount);

  // Don't flash stale "Free Plan" text before the fetch resolves
  if (!loaded) {
    return (
      <div
        className="rounded-lg p-3"
        style={{
          background: "rgba(124,58,237,0.08)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="h-3 w-20 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="mt-2 h-2 w-28 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "rgba(124,58,237,0.08)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <p
        className="text-xs font-medium mb-1.5"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
      >
        {planName} Plan
      </p>
      <p className="text-xs mb-2.5" style={{ color: "var(--text-tertiary)" }}>
        {isUnlimited
          ? "Unlimited scans/month"
          : remaining !== null
          ? `${remaining} scan${remaining === 1 ? "" : "s"} remaining`
          : `${limits.scansPerMonth} scans/month`}
      </p>
      {!isPaid && (
        <Link
          href="/pricing"
          className="block w-full text-center rounded-md py-1.5 text-xs font-semibold transition-all"
          style={{
            background: "var(--gradient-primary)",
            color: "#fff",
            fontFamily: "var(--font-body)",
          }}
        >
          Upgrade
        </Link>
      )}
      {isPaid && (
        <Link
          href="/settings/billing"
          className="block w-full text-center rounded-md py-1.5 text-xs font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
            fontFamily: "var(--font-body)",
          }}
        >
          Manage Plan
        </Link>
      )}
    </div>
  );
}
