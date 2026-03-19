"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

interface ScanFormProps {
  variant?: "hero" | "dashboard";
}

export function ScanForm({ variant = "hero" }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const router = useRouter();
  // useId() generates a unique ID per component instance, preventing duplicate
  // ARIA IDs when ScanForm is rendered more than once on the same page (A6).
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

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402 && data.upgradeRequired) {
          setError(`Scan limit reached (${String(data.used)}/${String(data.limit)} this month). Upgrade your plan for more scans.`);
          setUpgradeRequired(true);
        } else {
          setError(data.error || "Scan failed");
        }
        return;
      }

      sessionStorage.setItem("lastScanResult", JSON.stringify(data));
      router.push(data.id ? `/scan-result?id=${encodeURIComponent(data.id)}` : "/scan-result");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
              Enter your website URL to scan for AI visibility
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
              placeholder="https://yoursite.com"
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
              autoFocus
            />

            <div className="p-2 flex items-center flex-shrink-0">
              <button
                onClick={handleScan}
                disabled={loading}
                className="inline-flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "rgba(99,102,241,0.45)"
                    : "var(--brand-red)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "12px 24px",
                  boxShadow: loading ? "none" : "var(--shadow-btn)",
                  fontFamily: "var(--font-display)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    const el = e.currentTarget;
                    el.style.boxShadow = "var(--shadow-btn-hover)";
                    el.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = "var(--shadow-btn)";
                  el.style.transform = "scale(1)";
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
                    Run your free AI visibility scan
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

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
          Enter website URL to scan for AI visibility
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
        <button
          onClick={handleScan}
          disabled={loading}
          className="inline-flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--brand-red)",
            color: "#fff",
            borderRadius: "999px",
            padding: "12px 24px",
            boxShadow: "var(--shadow-btn)",
            fontFamily: "var(--font-display)",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = "var(--shadow-btn-hover)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-btn)";
            e.currentTarget.style.transform = "translateY(0)";
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
