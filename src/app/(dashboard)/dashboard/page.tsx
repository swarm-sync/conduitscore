"use client";

import { ScanForm } from "@/components/scan/scan-form";

const stats = [
  {
    label: "Total Scans",
    value: "0",
    color: "var(--violet-400)",
    bg: "rgba(108,59,255,0.08)",
    border: "rgba(108,59,255,0.18)",
    gradient: "linear-gradient(135deg, rgba(108,59,255,0.12) 0%, rgba(108,59,255,0.04) 100%)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Avg Score",
    value: "—",
    color: "var(--cyan-400)",
    bg: "rgba(0,217,255,0.06)",
    border: "rgba(0,217,255,0.16)",
    gradient: "linear-gradient(135deg, rgba(0,217,255,0.10) 0%, rgba(0,217,255,0.03) 100%)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 13L7.5 8.5L10.5 11.5L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Issues Fixed",
    value: "0",
    color: "var(--success-400)",
    bg: "rgba(0,229,160,0.06)",
    border: "rgba(0,229,160,0.16)",
    gradient: "linear-gradient(135deg, rgba(0,229,160,0.10) 0%, rgba(0,229,160,0.03) 100%)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M4 9l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-2">

      {/* Page header */}
      <div>
        <span className="section-label">Overview</span>
        <h1
          className="mt-2 text-xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
          Monitor and improve your AI visibility across all pages.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{
              background: stat.gradient,
              border: `1px solid ${stat.border}`,
              transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = `0 6px 24px rgba(0,0,0,0.3)`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                {stat.label}
              </p>
              <p
                className="mt-0.5 text-2xl font-bold tabular-nums leading-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: stat.value === "—" ? "var(--text-tertiary)" : stat.color,
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick scan */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(145deg, rgba(108,59,255,0.06) 0%, rgba(0,217,255,0.02) 50%, var(--surface-overlay) 100%)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-4">
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            Quick Scan
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Enter any URL to check its AI visibility score.
          </p>
        </div>
        <ScanForm variant="dashboard" />
      </div>

      {/* Recent scans (empty state) */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Recent Scans
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          {/* Animated scan rings empty state */}
          <div className="relative flex items-center justify-center w-14 h-14 mb-4" aria-hidden="true">
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1.5px dashed rgba(108,59,255,0.25)" }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "5px",
                border: "1px dashed rgba(0,217,255,0.15)",
              }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "rgba(108,59,255,0.3)" }}
            />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
            No scans yet
          </p>
          <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>
            Run your first scan using the form above.
          </p>
        </div>
      </div>
    </div>
  );
}
