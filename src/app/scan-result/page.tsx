"use client";

import { useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { CategoryBreakdown } from "@/components/scan/category-breakdown";
import { IssueList } from "@/components/scan/issue-list";
import { FixPanel } from "@/components/scan/fix-panel";
import type { ScanResult } from "@/lib/scanner/types";
import { getClientFingerprint } from "@/lib/client-fingerprint";
import { FINGERPRINT_HEADER } from "@/lib/free-tier-abuse";

function LockOverlay({ title, body, ctaLabel, ctaHref }: {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        borderRadius: "12px",
        background: "rgba(10,10,20,0.55)",
        backdropFilter: "blur(2px)",
        zIndex: 10,
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(108,59,255,0.12)",
          border: "1px solid rgba(108,59,255,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="4" y="10" width="14" height="11" rx="2" stroke="rgba(108,59,255,0.9)" strokeWidth="1.5" />
          <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="rgba(108,59,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
          {title}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", maxWidth: "320px", lineHeight: 1.5 }}>
          {body}
        </p>
      </div>
      <a
        href={ctaHref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--brand-red)",
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "10px 24px",
          borderRadius: "9999px",
          textDecoration: "none",
          boxShadow: "0 2px 12px rgba(255,45,85,0.35)",
        }}
      >
        {ctaLabel}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

function ShareButton({ scanId }: { scanId?: string }) {
  const [copied, setCopied] = useState(false);
  if (!scanId) return null;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://conduitscore.com"}/scans/${scanId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      onClick={() => void handleCopy()}
      className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-all"
      style={{
        background: copied ? "rgba(0,229,160,0.10)" : "rgba(255,255,255,0.03)",
        border: copied ? "1px solid rgba(0,229,160,0.30)" : "1px solid var(--border-default)",
        color: copied ? "var(--success-400)" : "var(--text-secondary)",
      }}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Link copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8.5 1h-6a1 1 0 00-1 1v9a1 1 0 001 1h8a1 1 0 001-1V4.5L8.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 1v3.5H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4 7.5h6M4 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Share Report
        </>
      )}
    </button>
  );
}

function BenchmarkCapture({ scanId, score, url }: { scanId?: string; score: number; url: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput?.value;
    if (!email) return;

    setStatus("sending");

    try {
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scanId, score, url }),
      });

      if (response.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className="mt-6 rounded-xl p-8"
      style={{
        background: "linear-gradient(135deg, rgba(108,59,255,0.08) 0%, rgba(0,217,255,0.04) 100%)",
        border: "1px solid rgba(108,59,255,0.20)",
      }}
    >
      <div className="max-w-md">
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          See how your score compares
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          We&apos;ll send you a free benchmark report showing how your site ranks against others in your industry.
        </p>

        {status === "sent" ? (
          <p className="text-sm font-medium" style={{ color: "var(--success-400)" }}>
            Report sent! Check your inbox.
          </p>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 rounded-lg px-4 py-2.5 text-sm"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "rgba(217,255,0,0.20)",
                border: "1px solid rgba(217,255,0,0.30)",
                color: "var(--brand-lime)",
              }}
              onMouseEnter={(e) => {
                if (!(e.currentTarget as HTMLButtonElement).disabled) {
                  e.currentTarget.style.background = "rgba(217,255,0,0.30)";
                }
              }}
              onMouseLeave={(e) => {
                if (!(e.currentTarget as HTMLButtonElement).disabled) {
                  e.currentTarget.style.background = "rgba(217,255,0,0.20)";
                }
              }}
            >
              {status === "sending" ? "Sending..." : status === "error" ? "Try Again" : "Send My Benchmark Report"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-sm mt-2" style={{ color: "var(--error-400)" }}>
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ScanResultPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<"overview" | "issues" | "fixes">("overview");
  const router = useRouter();

  useEffect(() => {
    async function loadResult() {
      try {
        const params = new URLSearchParams(window.location.search);
        const scanId = params.get("id");

        if (scanId) {
          const fingerprint = await getClientFingerprint();
          const response = await fetch(`/api/scans/${scanId}`, {
            cache: "no-store",
            headers: {
              [FINGERPRINT_HEADER]: fingerprint,
            },
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to load scan result");
          }

          setCurrentScanId(scanId);
          startTransition(() => {
            setResult(data as ScanResult);
          });
          return;
        }

        const stored = sessionStorage.getItem("lastScanResult");
        if (!stored) {
          router.push("/");
          return;
        }

        const parsed = JSON.parse(stored) as ScanResult & { id?: string };
        if (parsed.id) setCurrentScanId(parsed.id);
        startTransition(() => {
          setResult(parsed);
        });
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Failed to load scan result.");
      } finally {
        setLoading(false);
      }
    }

    void loadResult();
  }, [router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--surface-base)" }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Animated scan rings */}
          <div className="relative flex items-center justify-center w-16 h-16">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid rgba(108,59,255,0.3)",
                animation: "spin-slow 2s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "6px",
                border: "1px solid rgba(0,217,255,0.2)",
                animation: "spin-slow 3s linear infinite reverse",
              }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            />
          </div>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ background: "var(--surface-base)" }}
      >
        <div
          className="max-w-md rounded-[28px] p-8 text-center"
          style={{
            background: "var(--surface-overlay)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {loadError ?? "No scan result was found."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            style={{
              background: "var(--brand-red)",
              color: "var(--text-primary)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const loadTimeMs = typeof result.metadata.loadTimeMs === "number" ? result.metadata.loadTimeMs : 0;
  const criticalCount = result.issues.filter((i) => i.severity === "critical").length;
  const warningCount  = result.issues.filter((i) => i.severity === "warning").length;

  // Determine if this is a free/anonymous user using the server-authoritative signal.
  // freeFixStatus is only set by the API for non-paid users — paid users get undefined.
  // Fallback: if freeFixStatus is absent but all fixes are locked, treat as gated.
  const freeFixStatus = result.metadata.freeFixStatus as { state?: string } | undefined;
  const isGated = freeFixStatus?.state != null
    ? true
    : result.fixes.length > 0 && result.fixes.every((f) => f.locked);

  const needsSignIn = freeFixStatus?.state === "sign_in_required";
  const gateCtaHref = needsSignIn
    ? `/signin?callbackUrl=${encodeURIComponent(
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/scan-result"
      )}`
    : "/pricing";
  const gateCtaLabel = needsSignIn ? "Sign In to Unlock" : "Upgrade to Unlock";

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "var(--surface-base)" }}>
        <div className="container-wide mx-auto py-12">

          {/* Page title */}
          <div className="mb-8">
            <span className="section-label">Scan Results</span>
            <h1
              className="mt-2 text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              AI Visibility Report
            </h1>
            <p className="mt-1 text-sm truncate flex items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 2.5C6 2.5 5 3.8 5 6s1 3.5 1 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M6 2.5C6 2.5 7 3.8 7 6s-1 3.5-1 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M1 6h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <span
                className="truncate"
                style={{ color: "var(--cyan-400)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}
              >
                {result.url}
              </span>
              <span>&mdash;</span>
              <span>{new Date(result.scannedAt).toLocaleString()}</span>
            </p>
          </div>

          {/* Score + categories */}
          <div className="grid gap-5 lg:grid-cols-3 mb-8">

            {/* Score card */}
            <div
              className="flex flex-col items-center justify-center rounded-xl p-8"
              style={{
                background: "linear-gradient(145deg, rgba(108,59,255,0.07) 0%, rgba(0,217,255,0.03) 50%, var(--surface-overlay) 100%)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-card), 0 0 40px rgba(108,59,255,0.06)",
              }}
            >
              <ScoreGauge score={result.overallScore} size={180} />
              <p
                className="mt-4 text-sm font-semibold"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}
              >
                AI Visibility Score
              </p>
              <a
                href="/methodology"
                style={{
                  fontSize: "12px",
                  color: "var(--text-tertiary)",
                  textDecoration: "none",
                  display: "block",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                About the score →
              </a>
              <div className="mt-2 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.5" stroke="var(--text-tertiary)" strokeWidth="1" />
                  <path d="M4 6h2.5v2.5" stroke="var(--text-tertiary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Load time:{" "}
                  <span
                    style={{
                      color: loadTimeMs < 2000 ? "var(--success-400)" : loadTimeMs < 4000 ? "var(--warning-400)" : "var(--error-400)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {loadTimeMs}ms
                  </span>
                </p>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="lg:col-span-2">
              <CategoryBreakdown categories={result.categories} />
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div
              className="flex gap-0.5 mb-6"
              role="tablist"
              aria-label="Scan result sections"
              style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0" }}
            >
              {(["overview", "issues", "fixes"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  aria-controls={`tabpanel-${t}`}
                  onClick={() => setTab(t)}
                  className="px-4 py-2.5 text-sm font-medium capitalize transition-all relative"
                  style={{
                    color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)",
                    marginBottom: "-1px",
                    fontFamily: "var(--font-body)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    paddingBottom: "calc(10px + 1px)",
                  }}
                >
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200"
                    style={{
                      background: tab === t ? "linear-gradient(90deg, #6C3BFF, #00D9FF)" : "transparent",
                    }}
                    aria-hidden="true"
                  />
                  {t}
                  {t === "issues" && (
                    <span
                      className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs"
                      style={{
                        background: result.issues.length > 0
                          ? "rgba(255,71,87,0.10)"
                          : "rgba(0,229,160,0.10)",
                        color: result.issues.length > 0
                          ? "var(--error-400)"
                          : "var(--success-400)",
                        border: result.issues.length > 0
                          ? "1px solid rgba(255,71,87,0.22)"
                          : "1px solid rgba(0,229,160,0.22)",
                      }}
                    >
                      {result.issues.length}
                    </span>
                  )}
                  {t === "fixes" && (
                    <span
                      className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs"
                      style={{
                        background: "rgba(0,217,255,0.08)",
                        color: "var(--cyan-400)",
                        border: "1px solid rgba(0,217,255,0.20)",
                      }}
                    >
                      {result.fixes.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div>
              {tab === "overview" && (
                <div
                  id="tabpanel-overview"
                  role="tabpanel"
                  aria-labelledby="tab-overview"
                  className="space-y-5"
                >
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Your website scored{" "}
                    <strong
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontWeight: 700,
                      }}
                    >
                      {result.overallScore}/100
                    </strong>{" "}
                    for AI visibility.{" "}
                    {result.overallScore >= 80
                      ? "Great work — your site is well-optimized for AI agents."
                      : result.overallScore >= 50
                      ? "Room to improve. Review the issues and fixes tabs for actionable steps."
                      : "Your site needs significant attention to become visible to AI agents."}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        label: "Critical Issues",
                        value: criticalCount,
                        color: "var(--error-400)",
                        bg: "rgba(255,71,87,0.06)",
                        border: "rgba(255,71,87,0.18)",
                        glow: "rgba(255,71,87,0.08)",
                      },
                      {
                        label: "Warnings",
                        value: warningCount,
                        color: "var(--warning-400)",
                        bg: "rgba(255,184,0,0.06)",
                        border: "rgba(255,184,0,0.18)",
                        glow: "rgba(255,184,0,0.06)",
                      },
                      {
                        label: "Available Fixes",
                        value: result.fixes.length,
                        color: "var(--success-400)",
                        bg: "rgba(0,229,160,0.06)",
                        border: "rgba(0,229,160,0.18)",
                        glow: "rgba(0,229,160,0.06)",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-5"
                        style={{
                          background: stat.bg,
                          border: `1px solid ${stat.border}`,
                        }}
                      >
                        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
                          {stat.label}
                        </p>
                        <p
                          className="text-3xl font-bold tabular-nums leading-none"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: stat.color,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "issues" && (
                <div id="tabpanel-issues" role="tabpanel" style={{ position: "relative" }}>
                  {/* Blurred preview for gated users */}
                  <div style={{ filter: isGated ? "blur(6px)" : "none", pointerEvents: isGated ? "none" : "auto", userSelect: isGated ? "none" : "auto" }}>
                    <IssueList issues={result.issues} />
                  </div>
                  {isGated && (
                    <LockOverlay
                      title="Issues are locked"
                      body="Upgrade to see the full breakdown of what's hurting your AI visibility score."
                      ctaLabel={gateCtaLabel}
                      ctaHref={gateCtaHref}
                    />
                  )}
                </div>
              )}

              {tab === "fixes" && (
                <div id="tabpanel-fixes" role="tabpanel" style={{ position: "relative" }}>
                  {/* Blurred preview for gated users */}
                  <div style={{ filter: isGated ? "blur(6px)" : "none", pointerEvents: isGated ? "none" : "auto", userSelect: isGated ? "none" : "auto" }}>
                    <FixPanel
                      fixes={result.fixes}
                      scanDomain={(() => { try { return new URL(result.url).hostname; } catch { return result.url; } })()}
                      overallScore={result.overallScore}
                      freeFixStatus={result.metadata.freeFixStatus}
                    />
                  </div>
                  {isGated && (
                    <LockOverlay
                      title="Code fixes are locked"
                      body="Get the exact code snippets to fix every issue and improve your score."
                      ctaLabel={gateCtaLabel}
                      ctaHref={gateCtaHref}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upgrade CTA — only for gated (free/anonymous) users */}
          {isGated && (
            <div
              className="mt-12 rounded-xl p-8"
              style={{
                background: "rgba(10,10,20,0.85)",
                border: "1px solid rgba(108,59,255,0.35)",
                boxShadow: "0 0 30px rgba(108,59,255,0.08)",
              }}
            >
              <div className="flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(108,59,255,0.12)",
                    border: "1px solid rgba(108,59,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <rect x="4" y="10" width="14" height="11" rx="2" stroke="rgba(108,59,255,0.9)" strokeWidth="1.5" />
                    <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="rgba(108,59,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  Unlock your full fix list
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {result.fixes.length > 0
                    ? `You have ${result.fixes.length} fix${result.fixes.length === 1 ? "" : "es"} waiting.`
                    : "Fixes are available for your issues."}{" "}
                  Upgrade to Starter to get exact code snippets and implementation steps.
                </p>
                <a
                  href="/pricing"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--brand-red)",
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    padding: "12px 28px",
                    borderRadius: "9999px",
                    textDecoration: "none",
                    boxShadow: "0 2px 12px rgba(255,45,85,0.35)",
                  }}
                >
                  Upgrade to Starter &mdash; $29/mo
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* Benchmark email capture — always visible */}
          <BenchmarkCapture
            scanId={currentScanId}
            score={result.overallScore}
            url={result.url}
          />

          {/* Action buttons */}
          <div className="mt-10 flex flex-wrap gap-3">
            <ShareButton scanId={currentScanId} />

            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Scan Another URL
            </button>

            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #6C3BFF 0%, #00D9FF 100%)",
                color: "#fff",
                boxShadow: "0 2px 12px rgba(108,59,255,0.50), 0 0 20px rgba(0,217,255,0.10)",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 24px rgba(108,59,255,0.65), 0 0 40px rgba(0,217,255,0.18)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 12px rgba(108,59,255,0.50), 0 0 20px rgba(0,217,255,0.10)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Upgrade for More Scans
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
