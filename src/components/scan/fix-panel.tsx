"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Fix } from "@/lib/scanner/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all"
      style={{
        background: copied
          ? "rgba(0,229,160,0.10)"
          : "rgba(255,45,85,0.08)",
        color: copied ? "var(--success-400)" : "var(--brand-red)",
        border: `1px solid ${copied ? "rgba(0,229,160,0.22)" : "rgba(255,45,85,0.22)"}`,
        fontFamily: "var(--font-body)",
        transition: "all 0.15s",
      }}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 4V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

interface LockGateProps {
  fix: Fix;
  totalFixCount: number;
  scanDomain: string;
  isAuthenticated: boolean;
  overallScore?: number;
}

function LockGate({ fix, totalFixCount, scanDomain, isAuthenticated, overallScore }: LockGateProps) {
  const [upgrading, setUpgrading] = useState(false);
  const projectedScore =
    overallScore != null && fix.scoreImpact != null
      ? Math.min(100, overallScore + fix.scoreImpact)
      : null;

  async function handleUnlock() {
    if (!isAuthenticated) {
      window.location.href = "/pricing";
      return;
    }

    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "starter" }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <div>
      {/* Lock gate container */}
      <div
        style={{
          border: "1px solid rgba(108,59,255,0.35)",
          borderRadius: "var(--radius-md)",
          background: "rgba(108,59,255,0.04)",
          padding: "16px",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>
            <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
          >
            Code fix available
          </span>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          See the exact code to fix this.
          {totalFixCount > 1 && (
            <> Includes{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {totalFixCount - 1} more fix{totalFixCount - 1 !== 1 ? "es" : ""}
              </span>{" "}
              for {scanDomain}.
            </>
          )}
        </p>

        <p
          className="text-xs mb-4"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
        >
          {totalFixCount} fix{totalFixCount !== 1 ? "es" : ""} ready for {scanDomain}. You&apos;ve seen 1. Unlock the remaining {totalFixCount - 1}. — $29/mo, cancel anytime.
        </p>

        {/* Score delta — visible on all locked fixes */}
        {projectedScore !== null && overallScore != null && (
          <div
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(217,255,0,0.06)",
              border: "1px solid rgba(217,255,0,0.15)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "var(--brand-lime)" }}>
              <path d="M7 2v10M4 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs font-semibold" style={{ color: "var(--brand-lime)", fontFamily: "var(--font-mono)" }}>
              This fix moves your score{" "}
              <span style={{ color: "var(--text-secondary)" }}>{overallScore}</span>
              {" → "}
              <span style={{ color: "var(--brand-lime)" }}>{projectedScore}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleUnlock}
          disabled={upgrading}
          className="w-full rounded-[var(--radius-md)] py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--brand-red)",
            color: "#fff",
            border: "none",
            fontFamily: "var(--font-display)",
            cursor: upgrading ? "not-allowed" : "pointer",
            boxShadow: "var(--shadow-btn)",
          }}
          aria-label="Unlock all code fixes for $29 per month"
        >
          {upgrading ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Loading...
            </span>
          ) : (
            "Unlock Code Fixes — $29/mo"
          )}
        </button>

        <p className="text-xs text-center mt-2" style={{ color: "var(--text-tertiary)" }}>
          No commitment. Cancel anytime.
        </p>
      </div>

      {/* Char count visible below gate */}
      {fix.charCount != null && (
        <p className="mt-2 text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
          ~{fix.charCount} characters of code
        </p>
      )}
    </div>
  );
}

interface FixPanelProps {
  fixes: Fix[];
  scanDomain?: string;
  overallScore?: number;
}

export function FixPanel({ fixes, scanDomain = "your site", overallScore }: FixPanelProps) {
  const { status } = useSession();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isAuthenticated = status === "authenticated";

  const totalFixCount = fixes.length;

  if (fixes.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-14 rounded-xl"
        style={{
          background: "linear-gradient(145deg, rgba(0,229,160,0.04) 0%, var(--surface-overlay) 100%)",
          border: "1px solid rgba(0,229,160,0.18)",
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full mb-4"
          style={{
            background: "rgba(0,229,160,0.10)",
            border: "1px solid rgba(0,229,160,0.22)",
            boxShadow: "0 0 20px rgba(0,229,160,0.12)",
          }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12l4 4 10-10" stroke="var(--success-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--success-400)", fontFamily: "var(--font-display)" }}>
          No fixes needed
        </p>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>
          Your site is fully optimized for AI agents. Great work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5" role="list" aria-label="Available fixes">
      {fixes.map((fix) => {
        const isExpanded = expandedId === fix.issueId;
        const isLocked = fix.locked === true;
        const isSample = fix.sampleLabel === "Free sample";

        return (
          <div
            key={fix.issueId}
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--surface-overlay)",
              border: `1px solid ${isExpanded ? "rgba(108,59,255,0.35)" : "var(--border-subtle)"}`,
              boxShadow: isExpanded ? "0 0 20px rgba(108,59,255,0.06)" : "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            role="listitem"
          >
            {/* Accordion trigger */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : fix.issueId)}
              className="flex w-full items-center justify-between p-4 text-left"
              aria-expanded={isExpanded}
              aria-controls={`fix-${fix.issueId}`}
            >
              <div className="min-w-0 flex-1 pr-4">
                {/* Left accent line */}
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-0.5 h-full rounded-full flex-shrink-0 self-stretch min-h-[32px]"
                    style={{
                      background: isExpanded
                        ? "linear-gradient(180deg, #6C3BFF, #FF2D55)"
                        : "var(--border-subtle)",
                      minHeight: "32px",
                      transition: "background 0.2s",
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                      >
                        {fix.title}
                      </h4>
                      {/* Score impact badge — visible on all fixes */}
                      {fix.scoreImpact != null && (
                        <span
                          className="text-xs font-semibold rounded-full px-2 py-0.5 flex-shrink-0"
                          style={{
                            background: "rgba(217,255,0,0.08)",
                            color: "var(--brand-lime)",
                            border: "1px solid rgba(217,255,0,0.18)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          +{fix.scoreImpact} pts
                        </span>
                      )}
                      {/* Effort badge */}
                      {fix.effortMinutes != null && (
                        <span
                          className="text-xs rounded-full px-2 py-0.5 flex-shrink-0"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            color: "var(--text-tertiary)",
                            border: "1px solid var(--border-subtle)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          ~{fix.effortMinutes} min
                        </span>
                      )}
                      {/* Sample label badge */}
                      {isSample && (
                        <span
                          className="text-xs rounded-full px-2.5 py-0.5 flex-shrink-0"
                          style={{
                            background: "rgba(217,255,0,0.08)",
                            border: "1px solid rgba(217,255,0,0.2)",
                            color: "var(--brand-lime)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Free sample
                        </span>
                      )}
                      {/* Lock indicator for locked fixes */}
                      {isLocked && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-label="Locked"
                          style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
                        >
                          <rect x="2" y="5.5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.1" />
                          <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {fix.description}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-md transition-all"
                style={{
                  background: isExpanded ? "rgba(108,59,255,0.12)" : "rgba(255,255,255,0.04)",
                  color: isExpanded ? "var(--brand-red)" : "var(--text-tertiary)",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  border: "1px solid var(--border-subtle)",
                  transition: "all 0.2s",
                }}
                aria-hidden="true"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Expanded panel */}
            {isExpanded && (
              <div
                id={`fix-${fix.issueId}`}
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                {isLocked ? (
                  /* ===== LOCK GATE ===== */
                  <div className="p-4">
                    <LockGate
                      fix={fix}
                      totalFixCount={totalFixCount}
                      scanDomain={scanDomain}
                      isAuthenticated={isAuthenticated}
                      overallScore={overallScore}
                    />
                  </div>
                ) : (
                  /* ===== UNLOCKED CODE BLOCK ===== */
                  <>
                    {/* Free sample badge above code */}
                    {isSample && (
                      <div className="px-4 pt-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            background: "rgba(217,255,0,0.08)",
                            border: "1px solid rgba(217,255,0,0.2)",
                            color: "var(--brand-lime)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Free sample — this is what all fixes look like
                        </span>
                      </div>
                    )}

                    {/* Code toolbar */}
                    <div
                      className="flex items-center justify-between px-4 py-2.5"
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        background: "rgba(0,0,0,0.15)",
                        marginTop: isSample ? "8px" : "0",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {/* Terminal dots */}
                        <div className="flex gap-1.5" aria-hidden="true">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
                        </div>
                        <span
                          className="text-xs font-semibold uppercase tracking-wider ml-1"
                          style={{
                            color: "var(--text-tertiary)",
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.10em",
                          }}
                        >
                          {fix.language}
                        </span>
                      </div>
                      {fix.code && <CopyButton text={fix.code} />}
                    </div>

                    {/* Code block */}
                    <pre
                      className="overflow-x-auto p-5 text-xs leading-relaxed"
                      style={{
                        background: "var(--surface-sunken)",
                        color: "var(--brand-lime)",
                        fontFamily: "var(--font-mono)",
                        margin: 0,
                        fontSize: "0.8125rem",
                        lineHeight: 1.8,
                        borderLeft: "2px solid rgba(255,45,85,0.30)",
                      }}
                      tabIndex={0}
                      aria-label={`${fix.language} code fix for ${fix.title}`}
                    >
                      <code>{fix.code}</code>
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
