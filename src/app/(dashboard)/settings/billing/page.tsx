"use client";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Billing & Plan</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Manage your subscription and billing details.</p>
      </div>
      <div className="rounded-xl p-6" style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Current Plan</h2>
        <div className="mt-4 flex items-center gap-4">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium" style={{ background: "rgba(99,102,241,0.12)", color: "var(--brand-purple)" }}>
            Free
          </span>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>3 scans/month, 1 page per scan</span>
        </div>
        <div className="mt-6 flex gap-3">
          <a
            href="/pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
            style={{ background: "var(--gradient-primary)" }}
          >
            Upgrade Plan
          </a>
          <button
            onClick={async () => {
              const res = await fetch("/api/stripe/portal");
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)", background: "transparent" }}
          >
            Manage Billing
          </button>
        </div>
      </div>
      <div className="rounded-xl p-6" style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Usage</h2>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-tertiary)" }}>Scans this month</span>
            <span className="font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>0 / 3</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div className="h-1.5 rounded-full" style={{ width: "0%", background: "var(--brand-purple)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
