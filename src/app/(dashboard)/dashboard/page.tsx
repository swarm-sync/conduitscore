"use client";

import { ScanForm } from "@/components/scan/scan-form";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ScanSummary {
  id: string;
  url: string;
  overallScore: number | null;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [totalScans, setTotalScans] = useState<number | null>(null);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [recentScans, setRecentScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [scansError, setScansError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Validate session first
        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });

        if (!sessionRes.ok) {
          console.error("Dashboard session check failed:", sessionRes.status);
          setSessionError("Unable to verify session. Please sign in again.");
          setLoading(false);
          return;
        }

        const session = await sessionRes.json();

        if (!session?.user) {
          console.error("No user in session");
          setSessionError("Please sign in to view your scans.");
          setLoading(false);
          return;
        }

        // Session valid, now fetch scans
        const res = await fetch("/api/scans?limit=5", { cache: "no-store" });

        if (!res.ok) {
          const status = res.status;
          const statusText = res.statusText;
          console.error("Dashboard fetch failed:", status, statusText);

          if (status === 401) {
            setScansError("Session expired. Please sign in again.");
          } else if (status === 403) {
            setScansError("You don't have permission to view scans.");
          } else if (status === 500) {
            setScansError("Server error. Please try again later.");
          } else {
            setScansError(`Failed to load scans (${status})`);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        const scans: ScanSummary[] = data.scans ?? [];
        const total: number = data.total ?? 0;
        const scores = scans.map((s) => s.overallScore).filter((s): s is number => s !== null);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        setTotalScans(total);
        setAvgScore(avg);
        setLastScore(scans[0]?.overallScore ?? null);
        setRecentScans(scans);
        setScansError(null);
      } catch (e) {
        console.error("Dashboard fetch failed:", e);
        setScansError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    void loadDashboard();
  }, []);

  const statCards = [
    {
      label: "Total Scans",
      value: loading ? "…" : totalScans !== null ? String(totalScans) : "0",
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
      value: loading ? "…" : avgScore !== null ? String(avgScore) : "—",
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
      label: "Last Score",
      value: loading ? "…" : lastScore !== null ? String(lastScore) : "—",
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

  // Show session error first - prevents confusing empty state
  if (sessionError) {
    return (
      <div className="space-y-6 py-2">
        <div>
          <span className="section-label">Overview</span>
          <h1 className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Dashboard
          </h1>
        </div>
        <div className="rounded-xl p-6 border" style={{ background: "rgba(220, 38, 38, 0.05)", borderColor: "rgba(220, 38, 38, 0.3)" }}>
          <p className="text-sm font-medium" style={{ color: "rgb(220, 38, 38)" }}>
            {sessionError}
          </p>
          <Link href="/signin" className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "rgb(220, 38, 38)", color: "white" }}>
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <div>
        <span className="section-label">Overview</span>
        <h1 className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
          Monitor and improve your AI visibility across all pages.
        </p>
      </div>

      {/* Error banner for scan fetch failures */}
      {scansError && (
        <div className="rounded-xl p-4 border" style={{ background: "rgba(220, 38, 38, 0.05)", borderColor: "rgba(220, 38, 38, 0.3)" }}>
          <p className="text-sm font-medium" style={{ color: "rgb(220, 38, 38)" }}>
            {scansError}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: stat.gradient, border: `1px solid ${stat.border}`, transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums leading-none" style={{ fontFamily: "var(--font-mono)", color: ["—", "…"].includes(stat.value) ? "var(--text-tertiary)" : stat.color, letterSpacing: "-0.03em" }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick scan */}
      <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, rgba(108,59,255,0.06) 0%, rgba(0,217,255,0.02) 50%, var(--surface-overlay) 100%)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-card)" }}>
        <div className="mb-4">
          <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Quick Scan</h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--text-tertiary)" }}>Enter any URL to check its AI visibility score.</p>
        </div>
        <ScanForm variant="dashboard" />
      </div>

      {/* Recent scans */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Recent Scans</h2>
          {recentScans.length > 0 && (
            <Link href="/scans" className="text-xs font-medium" style={{ color: "var(--cyan-400)" }}>View all →</Link>
          )}
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>Loading…</div>
        ) : recentScans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="relative flex items-center justify-center w-14 h-14 mb-4" aria-hidden="true">
              <div className="absolute inset-0 rounded-full" style={{ border: "1.5px dashed rgba(108,59,255,0.25)" }} />
              <div className="absolute rounded-full" style={{ inset: "5px", border: "1px dashed rgba(0,217,255,0.15)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(108,59,255,0.3)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>No scans yet</p>
            <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>Run your first scan using the form above.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[2fr_0.7fr_1fr] gap-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "var(--text-tertiary)" }}>
              <span>URL</span><span>Score</span><span>Date</span>
            </div>
            {recentScans.map((scan) => (
              <Link
                key={scan.id}
                href={`/scans/${scan.id}`}
                className="grid grid-cols-[2fr_0.7fr_1fr] gap-4 px-5 py-3.5 text-sm hover:bg-white/[0.025] transition-colors"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)", color: "var(--text-secondary)" }}
              >
                <span className="truncate" style={{ color: "var(--text-primary)" }}>{scan.url}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: scan.overallScore == null ? "var(--text-tertiary)" : scan.overallScore >= 80 ? "var(--success-400)" : scan.overallScore >= 60 ? "var(--cyan-400)" : "var(--brand-red)" }}>
                  {scan.overallScore ?? "—"}
                </span>
                <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
