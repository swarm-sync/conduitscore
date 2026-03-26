"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SampleChipRow, DemoResultCard, DEMO_DATA, type DemoScoreData } from "@/components/scan/sample-chip-row";
import { trackEvent } from "@/lib/analytics";

interface ScanFormProps {
  variant?: "hero" | "dashboard";
  /** When true, render the SampleChipRow below the hero CTA. Default: true for hero variant. */
  showChips?: boolean;
}

interface PendingScan {
  data: Record<string, unknown>;
  redirectUrl: string;
}

export function ScanForm({ variant = "hero", showChips }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  // Email gate state — shown after scan completes for anonymous users.
  const [pendingScan, setPendingScan] = useState<PendingScan | null>(null);
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureLoading, setCaptureLoading] = useState(false);
  // Demo state — set when a chip is double-clicked. Never triggers a live scan.
  const [demoData, setDemoData] = useState<DemoScoreData | null>(null);
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Chip row: visible by default on hero variant only, unless overridden.
  const chipRowVisible = showChips !== undefined ? showChips : variant === "hero";

  // Called by SampleChipRow on first chip click — fills the URL input only.
  // IMPORTANT: Only show demo state — never trigger live scan from chip click
  function handleFillInput(domain: string) {
    setUrl(`https://${domain}`);
    setError(null);
    setUpgradeRequired(false);
    // Clear any previously open demo card when a new domain is selected
    setDemoData(null);
  }

  // Called by SampleChipRow on second chip click — shows the polished pre-rendered result.
  // IMPORTANT: Only show demo state — never trigger live scan from chip click
  function handleDemoState(domain: string) {
    const data = DEMO_DATA[domain] ?? null;
    if (data) setDemoData(data);
  }

  const uid = useId();
  const inputId = `scan-url-input-${uid}`;
  const errorId = `scan-error-${uid}`;

  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setError(null);
    setUpgradeRequired(false);
    setLoading(true);
    trackEvent("scan_submit_attempt", { source: variant });

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json() as Record<string, unknown>;

      if (!res.ok) {
        if (res.status === 402 && data.upgradeRequired) {
          setError(`Scan limit reached (${String(data.used)}/${String(data.limit)} this month). Upgrade your plan for more scans.`);
          setUpgradeRequired(true);
          trackEvent("scan_submit_failure", {
            source: variant,
            http_status: res.status,
            reason: "scan_limit",
          });
        } else {
          setError((data.error as string) || "Scan failed");
          trackEvent("scan_submit_failure", {
            source: variant,
            http_status: res.status,
            reason: "api_error",
          });
        }
        return;
      }

      trackEvent("scan_submit_success", { source: variant });
      const redirectUrl = data.id ? `/scan-result?id=${encodeURIComponent(String(data.id))}` : "/scan-result";
      sessionStorage.setItem("lastScanResult", JSON.stringify(data));

      // Authenticated users skip the email gate entirely.
      if (isAuthenticated) {
        router.push(redirectUrl);
        return;
      }

      // Anonymous users see the email gate before viewing results.
      setPendingScan({ data, redirectUrl });
    } catch {
      trackEvent("scan_submit_failure", {
        source: variant,
        http_status: 0,
        reason: "network",
      });
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingScan) return;

    const trimmed = captureEmail.trim();

    // Fire-and-forget the email capture — don't block the user.
    if (trimmed && trimmed.includes("@")) {
      setCaptureLoading(true);
      void fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          scanId: pendingScan.data.id ?? null,
          scanUrl: pendingScan.data.url ?? null,
          score: pendingScan.data.overallScore ?? null,
        }),
      }).finally(() => setCaptureLoading(false));
    }

    router.push(pendingScan.redirectUrl);
  }

  function handleSkipEmail() {
    if (!pendingScan) return;
    router.push(pendingScan.redirectUrl);
  }

  // ===== EMAIL GATE SCREEN =====
  if (pendingScan) {
    const score = typeof pendingScan.data.overallScore === "number" ? pendingScan.data.overallScore : null;
    const scannedUrl = typeof pendingScan.data.url === "string" ? pendingScan.data.url : "";

    return (
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--surface-overlay)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl, 20px)",
          padding: "32px 28px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Score preview */}
        {score !== null && (
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
              style={{
                background: score >= 70 ? "rgba(0,229,160,0.10)" : score >= 40 ? "rgba(255,184,0,0.10)" : "rgba(255,45,85,0.10)",
                border: `2px solid ${score >= 70 ? "rgba(0,229,160,0.35)" : score >= 40 ? "rgba(255,184,0,0.35)" : "rgba(255,45,85,0.35)"}`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                  fontSize: "1.125rem",
                  color: score >= 70 ? "var(--success-400)" : score >= 40 ? "var(--warning-400)" : "var(--brand-red)",
                }}
              >
                {score}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                Your results are ready
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                {scannedUrl}
              </p>
            </div>
          </div>
        )}

        <h2
          className="text-base font-semibold mb-1"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          Enter your email to view your report
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--text-tertiary)", lineHeight: 1.5 }}>
          We&apos;ll email you a copy and send a 7-day follow-up to show what you&apos;ve fixed.
        </p>

        <form onSubmit={(e) => void handleEmailSubmit(e)} className="space-y-3">
          <input
            type="email"
            value={captureEmail}
            onChange={(e) => setCaptureEmail(e.target.value)}
            placeholder="you@company.com"
            autoFocus
            className="w-full text-sm outline-none"
            style={{
              background: "var(--surface-sunken)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "999px",
              padding: "12px 18px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              caretColor: "var(--brand-red)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-red)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,45,85,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={captureLoading}
            className="w-full rounded-full py-3 text-sm font-semibold transition-all disabled:opacity-40"
            style={{
              background: "var(--brand-red)",
              color: "#fff",
              border: "none",
              fontFamily: "var(--font-display)",
              cursor: captureLoading ? "not-allowed" : "pointer",
              boxShadow: "var(--shadow-btn)",
            }}
          >
            {captureLoading ? "Loading..." : "View My Report →"}
          </button>
        </form>

        <button
          onClick={handleSkipEmail}
          className="mt-3 w-full text-xs text-center"
          style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
        >
          Skip — view without saving
        </button>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div role="search" aria-label="AI visibility scanner" className="w-full max-w-lg">
        {/* Input container with gradient border effect */}
        <div
          className="relative"
          style={{
            padding: "1px",
            borderRadius: "999px",
            background: loading
              ? "linear-gradient(135deg, #FF2D55, #6366F1, #D9FF00)"
              : "linear-gradient(135deg, rgba(255,45,85,0.65), rgba(99,102,241,0.5), rgba(217,255,0,0.3))",
            boxShadow: "0 18px 40px rgba(0,0,0,0.3), 0 0 40px rgba(255,45,85,0.12)",
          }}
        >
          <div
            className="flex w-full overflow-hidden"
            style={{
              background: "rgba(18,18,20,0.92)",
              borderRadius: "999px",
            }}
          >
            {/* sr-only label gives the input an accessible name (A7: single label,
                no aria-label duplication). The label is associated via htmlFor/id. */}
            <label htmlFor={inputId} className="sr-only">
              Enter your website URL
            </label>

            {/* Globe icon */}
            <div
              className="flex items-center pl-4 flex-shrink-0"
              style={{ color: "var(--text-tertiary)" }}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
                <path d="M8 1.5C8 1.5 6 4 6 8s2 6.5 2 6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M8 1.5C8 1.5 10 4 10 8s-2 6.5-2 6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M2.5 5.5h11M2.5 10.5h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>

            <input
              id={inputId}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="your-site.com"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{
                padding: "18px 14px 18px 10px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                caretColor: "var(--brand-red)",
              }}
              disabled={loading}
              aria-busy={loading}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              autoComplete="url"
            />

            <div className="p-2 flex items-center flex-shrink-0">
              <style>{`
                .scan-button-cta {
                  background: var(--brand-red);
                  box-shadow: var(--shadow-btn);
                  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .scan-button-cta:not(:disabled):hover {
                  box-shadow: var(--shadow-btn-hover);
                  transform: scale(1.02);
                }
                .scan-button-cta:disabled {
                  background: rgba(99, 102, 241, 0.45);
                  box-shadow: none;
                }
              `}</style>
              <button
                onClick={handleScan}
                disabled={loading}
                className="scan-button-cta inline-flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "12px 24px",
                  fontFamily: "var(--font-display)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
                aria-label={loading ? "Scanning in progress" : "Scan website for AI visibility"}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan My Site Now
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: "0.8125rem",
            fontFamily: "var(--font-body)",
            color: "var(--text-tertiary)",
            marginTop: "12px",
            marginBottom: 0,
          }}
        >
          Free • No signup • Results in ~15 seconds
        </p>

        {/* Sample chip row — only in hero variant, only when chipRowVisible */}
        {chipRowVisible && (
          <SampleChipRow
            onFillInput={handleFillInput}
            onDemoState={handleDemoState}
          />
        )}

        {/* Demo result card — shown instantly when a chip is double-clicked.
            IMPORTANT: Only show demo state — never trigger live scan from chip click */}
        {demoData && (
          <DemoResultCard
            data={demoData}
            onClose={() => setDemoData(null)}
          />
        )}

        {error && (
          <div
            id={errorId}
            className="mt-3 flex flex-col gap-2"
            role="alert"
          >
            <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--error-400)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
                <path d="M7 4.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
              </svg>
              {error}
            </p>
            {upgradeRequired && (
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 self-start"
                style={{ background: "var(--gradient-primary)", color: "#fff" }}
              >
                Upgrade Plan →
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  /* Dashboard variant */
  return (
    <div role="search" aria-label="AI visibility scanner">
      <div className="flex gap-3">
        <label htmlFor={inputId} className="sr-only">
          Enter your website URL
        </label>
        <input
          id={inputId}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="https://example.com"
          className="flex-1 text-sm outline-none"
          style={{
            background: "var(--surface-sunken)",
            border: error ? "1px solid var(--error-500)" : "1px solid var(--border-subtle)",
            borderRadius: "999px",
            padding: "14px 18px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            transition: "border-color 0.15s, box-shadow 0.15s",
            caretColor: "var(--brand-red)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--brand-red)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,45,85,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--error-500)" : "var(--border-subtle)";
            e.currentTarget.style.boxShadow = "none";
          }}
          disabled={loading}
          aria-busy={loading}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        <style>{`
          .scan-button-dashboard {
            background: var(--brand-red);
            box-shadow: var(--shadow-btn);
            transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .scan-button-dashboard:not(:disabled):hover {
            box-shadow: var(--shadow-btn-hover);
            transform: translateY(-1px);
          }
          .scan-button-dashboard:disabled {
            cursor: not-allowed;
          }
        `}</style>
        <button
          onClick={handleScan}
          disabled={loading}
          className="scan-button-dashboard inline-flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            color: "#fff",
            borderRadius: "999px",
            padding: "12px 24px",
            fontFamily: "var(--font-display)",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
          aria-label={loading ? "Scanning in progress" : "Scan website for AI visibility"}
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>
      {error && (
        <div id={errorId} className="mt-2 flex flex-col gap-1.5" role="alert">
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--error-400)" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M6 3.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="6" cy="8.5" r="0.75" fill="currentColor" />
            </svg>
            {error}
          </p>
          {upgradeRequired && (
            <a
              href="/pricing"
              className="inline-flex items-center gap-1 text-xs font-semibold"
              style={{ color: "var(--violet-400)" }}
            >
              Upgrade Plan →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
