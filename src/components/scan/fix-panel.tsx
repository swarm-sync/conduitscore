"use client";

import { useState } from "react";
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
          : "rgba(0,217,255,0.08)",
        color: copied ? "var(--success-400)" : "var(--cyan-400)",
        border: `1px solid ${copied ? "rgba(0,229,160,0.22)" : "rgba(0,217,255,0.22)"}`,
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

export function FixPanel({ fixes }: { fixes: Fix[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                        ? "linear-gradient(180deg, #6C3BFF, #00D9FF)"
                        : "var(--border-subtle)",
                      minHeight: "32px",
                      transition: "background 0.2s",
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <h4
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                    >
                      {fix.title}
                    </h4>
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
                  color: isExpanded ? "var(--cyan-400)" : "var(--text-tertiary)",
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

            {/* Expanded code panel */}
            {isExpanded && (
              <div
                id={`fix-${fix.issueId}`}
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                {/* Code toolbar */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.15)" }}
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
                  <CopyButton text={fix.code} />
                </div>

                {/* Code block with cyan left border */}
                <pre
                  className="overflow-x-auto p-5 text-xs leading-relaxed"
                  style={{
                    background: "var(--surface-sunken)",
                    color: "var(--cyan-300)",
                    fontFamily: "var(--font-mono)",
                    margin: 0,
                    fontSize: "0.8125rem",
                    lineHeight: 1.8,
                    borderLeft: "2px solid rgba(0,217,255,0.30)",
                  }}
                  tabIndex={0}
                  aria-label={`${fix.language} code fix for ${fix.title}`}
                >
                  <code>{fix.code}</code>
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
