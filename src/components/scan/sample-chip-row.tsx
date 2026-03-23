"use client";

// IMPORTANT: Only show demo state — never trigger live scan from chip click

import { useState } from "react";

import { trackEvent } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Pre-rendered demo data per domain.
// These are fixed, polished fixtures — they are NEVER fetched from the network.
// ---------------------------------------------------------------------------
export interface DemoScoreData {
  domain: string;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  categories: { name: string; score: number }[];
  topIssues: string[];
  topFix: string;
}

// One high-scorer, one mid, one problematic — gives visitors a sense of range.
export const DEMO_DATA: Record<string, DemoScoreData> = {
  "apple.com": {
    domain: "apple.com",
    overallScore: 88,
    grade: "A",
    categories: [
      { name: "Crawler Access", score: 95 },
      { name: "Structured Data", score: 90 },
      { name: "LLMs.txt", score: 60 },
      { name: "Content Structure", score: 96 },
      { name: "Technical Health", score: 98 },
      { name: "Citation Signals", score: 84 },
      { name: "Content Quality", score: 92 },
    ],
    topIssues: [
      "No /llms.txt found",
      "BreadcrumbList schema missing on product pages",
      "Meta descriptions shorter than recommended on deep pages",
    ],
    topFix: `# Add to site root
User-agent: OAI-SearchBot
Allow: /`,
  },

  "hubspot.com": {
    domain: "hubspot.com",
    overallScore: 72,
    grade: "B",
    categories: [
      { name: "Crawler Access", score: 80 },
      { name: "Structured Data", score: 65 },
      { name: "LLMs.txt", score: 45 },
      { name: "Content Structure", score: 88 },
      { name: "Technical Health", score: 91 },
      { name: "Citation Signals", score: 62 },
      { name: "Content Quality", score: 74 },
    ],
    topIssues: [
      "Missing /llms.txt",
      "No Organization schema on homepage",
      "ClaudeBot not explicitly allowed in robots.txt",
    ],
    topFix: `# Add to robots.txt
User-agent: ClaudeBot
Allow: /`,
  },

  "stripe.com": {
    domain: "stripe.com",
    overallScore: 91,
    grade: "A",
    categories: [
      { name: "Crawler Access", score: 98 },
      { name: "Structured Data", score: 95 },
      { name: "LLMs.txt", score: 72 },
      { name: "Content Structure", score: 97 },
      { name: "Technical Health", score: 99 },
      { name: "Citation Signals", score: 88 },
      { name: "Content Quality", score: 93 },
    ],
    topIssues: [
      "/llms.txt present but missing section headers",
      "Some deep docs pages lack WebPage schema",
      "FAQ schema absent on pricing page",
    ],
    topFix: `# llms.txt — add explicit sections
## Products
- https://stripe.com/payments
- https://stripe.com/billing`,
  },
};

// ---------------------------------------------------------------------------
// Colour helpers (mirrors scan-result page conventions)
// ---------------------------------------------------------------------------
function getBarColor(score: number): string {
  if (score >= 70) return "var(--cyan-400, #22d3ee)";
  if (score >= 40) return "#f59e0b";
  return "var(--brand-red, #FF2D55)";
}

function getGradeColor(grade: DemoScoreData["grade"]): string {
  switch (grade) {
    case "A": return "var(--cyan-400, #22d3ee)";
    case "B": return "#86efac"; // green-300
    case "C": return "#f59e0b";
    case "D": return "#fb923c"; // orange-400
    case "F": return "var(--brand-red, #FF2D55)";
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface SampleChipRowProps {
  /** Called when a chip is clicked once — fill the URL input with this domain. */
  onFillInput: (domain: string) => void;
  /**
   * Called when a chip is clicked a second time (or the same chip is selected
   * while the input already contains that domain) — trigger the polished demo
   * output state. This callback must NEVER initiate a live network scan.
   */
  onDemoState: (domain: string) => void;
}

// ---------------------------------------------------------------------------
// SampleChipRow
// ---------------------------------------------------------------------------
export function SampleChipRow({ onFillInput, onDemoState }: SampleChipRowProps) {
  const SAMPLE_DOMAINS = ["apple.com", "hubspot.com", "stripe.com"] as const;
  // Track which domain (if any) was last filled into the input via a chip click
  const [lastFilledDomain, setLastFilledDomain] = useState<string | null>(null);

  function handleChipClick(domain: string) {
    if (lastFilledDomain === domain) {
      // Second click on the same chip — activate the demo/sample output state.
      // IMPORTANT: Only show demo state — never trigger live scan from chip click
      trackEvent("chip_demo_state", { domain, interaction: "second_click" });
      onDemoState(domain);
    } else {
      // First click — fill the input field only.
      trackEvent("chip_click", { domain, interaction: "fill_url" });
      setLastFilledDomain(domain);
      onFillInput(domain);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "14px",
      }}
      role="group"
      aria-label="Try a sample site"
    >
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: "0.8125rem",
          color: "var(--text-tertiary, rgba(255,255,255,0.38))",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        Try a sample site:
      </span>

      {/* Chips */}
      {SAMPLE_DOMAINS.map((domain) => {
        const isActive = lastFilledDomain === domain;
        return (
          <button
            key={domain}
            type="button"
            onClick={() => handleChipClick(domain)}
            aria-pressed={isActive}
            aria-label={
              isActive
                ? `View sample result for ${domain}`
                : `Fill URL input with ${domain}`
            }
            style={{
              // Secondary / ghost appearance — visually subordinate to the main CTA
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.75rem",
              fontWeight: 500,
              lineHeight: 1,
              padding: "6px 12px",
              borderRadius: "999px",
              // Border-only treatment — no filled background
              background: isActive
                ? "rgba(255,255,255,0.06)"
                : "transparent",
              border: isActive
                ? "1px solid rgba(255,255,255,0.22)"
                : "1px solid rgba(255,255,255,0.14)",
              color: isActive
                ? "var(--text-secondary, rgba(255,255,255,0.62))"
                : "var(--text-tertiary, rgba(255,255,255,0.38))",
              cursor: "pointer",
              transition: "color 0.12s, border-color 0.12s, background 0.12s",
              // No box-shadow, no heavy glow — deliberately lightweight
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(255,255,255,0.30)";
              el.style.color = "var(--text-secondary, rgba(255,255,255,0.62))";
              el.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = isActive
                ? "rgba(255,255,255,0.22)"
                : "rgba(255,255,255,0.14)";
              el.style.color = isActive
                ? "var(--text-secondary, rgba(255,255,255,0.62))"
                : "var(--text-tertiary, rgba(255,255,255,0.38))";
              el.style.background = isActive
                ? "rgba(255,255,255,0.06)"
                : "transparent";
            }}
          >
            {/* Small globe icon to hint these are URLs */}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0, opacity: 0.7 }}
            >
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
              <path d="M5 1C5 1 3.5 2.5 3.5 5s1.5 4 1.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M5 1C5 1 6.5 2.5 6.5 5s-1.5 4-1.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M1 5h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {domain}
            {isActive && (
              // "→ preview" hint on active chip
              <span
                style={{
                  fontSize: "0.6875rem",
                  opacity: 0.6,
                  marginLeft: "1px",
                }}
              >
                → preview
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DemoResultCard — polished pre-rendered result panel
// Shown when onDemoState fires. No spinner. No loading. Instant.
// ---------------------------------------------------------------------------
interface DemoResultCardProps {
  data: DemoScoreData;
  onClose: () => void;
}

export function DemoResultCard({ data, onClose }: DemoResultCardProps) {
  const gradeColor = getGradeColor(data.grade);

  return (
    <div
      role="region"
      aria-label={`Sample AI visibility result for ${data.domain}`}
      style={{
        marginTop: "16px",
        padding: "20px",
        background: "rgba(18,18,20,0.92)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        position: "relative",
        maxWidth: "520px",
      }}
    >
      {/* Demo badge */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "44px",
          fontSize: "0.6875rem",
          fontFamily: "var(--font-mono, monospace)",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "999px",
          padding: "3px 8px",
        }}
        aria-label="This is a sample result, not a live scan"
      >
        sample
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close sample result"
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.35)",
          padding: "4px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Header row — domain + score */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
        {/* Score badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: `2px solid ${gradeColor}`,
            background: `${gradeColor}12`,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 800,
              fontSize: "1.375rem",
              color: gradeColor,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {data.overallScore}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: "0.625rem",
              color: "var(--text-tertiary, rgba(255,255,255,0.38))",
              lineHeight: 1.2,
            }}
          >
            / 100
          </span>
        </div>

        {/* Domain + grade */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--text-primary, #fff)",
              marginBottom: "4px",
            }}
          >
            {data.domain}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: gradeColor,
              }}
            >
              Grade {data.grade}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, rgba(255,255,255,0.38))",
                fontFamily: "var(--font-body, sans-serif)",
              }}
            >
              — {data.overallScore >= 80 ? "Strong AI visibility" : data.overallScore >= 60 ? "Moderate AI visibility" : "Weak AI visibility"}
            </span>
          </div>
        </div>
      </div>

      {/* Category bar breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
          marginBottom: "16px",
        }}
        role="list"
        aria-label="Category scores"
      >
        {data.categories.map((cat) => {
          const barColor = getBarColor(cat.score);
          return (
            <div
              key={cat.name}
              role="listitem"
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: "0.6875rem",
                    color: "var(--text-tertiary, rgba(255,255,255,0.38))",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "80%",
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.6875rem",
                    color: barColor,
                    flexShrink: 0,
                    marginLeft: "4px",
                  }}
                >
                  {cat.score}
                </span>
              </div>
              {/* Progress bar */}
              <div
                aria-hidden="true"
                style={{
                  height: "3px",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "2px",
                    background: barColor,
                    width: "100%",
                    transform: `scaleX(${cat.score / 100})`,
                    transformOrigin: "left",
                    // No animation — instant render to match "no lag" requirement
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.07)",
          marginBottom: "14px",
        }}
      />

      {/* Top issues */}
      <div style={{ marginBottom: "14px" }}>
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--text-tertiary, rgba(255,255,255,0.38))",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "8px",
          }}
        >
          Top issues found
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: "6px", listStyle: "none", padding: 0, margin: 0 }}>
          {data.topIssues.map((issue) => (
            <li
              key={issue}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "7px",
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: "0.8125rem",
                color: "var(--text-secondary, rgba(255,255,255,0.62))",
                lineHeight: 1.4,
              }}
            >
              {/* Warning icon */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: "1px" }}
              >
                <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="#f59e0b" strokeWidth="1.25" strokeLinejoin="round" />
                <path d="M6 5v2.5" stroke="#f59e0b" strokeWidth="1.25" strokeLinecap="round" />
                <circle cx="6" cy="9" r="0.5" fill="#f59e0b" />
              </svg>
              {issue}
            </li>
          ))}
        </ul>
      </div>

      {/* Top fix preview */}
      <div
        style={{
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(217,255,0,0.14)",
          borderLeft: "3px solid var(--brand-lime, #D9FF00)",
          borderRadius: "8px",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.6875rem",
          padding: "10px 12px",
          color: "var(--brand-lime, #D9FF00)",
          lineHeight: 1.7,
          whiteSpace: "pre",
          overflowX: "auto",
          marginBottom: "16px",
        }}
        aria-label="Highest priority fix"
      >
        {data.topFix}
      </div>

      {/* Prompt to scan your own site */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "0.75rem",
            color: "var(--text-tertiary, rgba(255,255,255,0.38))",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          This is a sample result. Scan your own site to see your real score.
        </p>
        <a
          href="#scan"
          onClick={() => trackEvent("chip_demo_cta_click", { source: data.domain })}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "var(--font-display, sans-serif)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#fff",
            background: "var(--brand-red, #FF2D55)",
            borderRadius: "999px",
            padding: "8px 16px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            border: "none",
          }}
        >
          Scan my site
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7M7 3.5l2.5 2.5L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default SampleChipRow;
