"use client";

import { useState } from "react";

const SIGNALS = [
  {
    id: "crawler-access",
    label: "Crawler access",
    description: "Can AI and machine crawlers reach your pages?",
    example: "Issue: robots.txt blocks GPTBot for /blog/",
  },
  {
    id: "structured-data",
    label: "Structured data",
    description: "Are you helping machines understand what your content means?",
    example: "Issue: No Organization schema on homepage",
  },
  {
    id: "content-structure",
    label: "Content structure",
    description: "Are your pages organized in a way AI systems can parse?",
    example: "Issue: Multiple H1 tags detected, heading order broken",
  },
  {
    id: "llms-txt",
    label: "llms.txt",
    description: "Are you providing guidance for LLM-focused retrieval?",
    example: "Issue: /llms.txt not found",
  },
  {
    id: "technical-health",
    label: "Technical health",
    description: "Are there site-level issues hurting machine readability?",
    example: "Issue: Open Graph og:description missing",
  },
  {
    id: "citation-signals",
    label: "Citation signals",
    description: "Does your site provide strong trust and reference cues?",
    example: "Issue: No canonical tag — duplicate citation risk",
  },
  {
    id: "content-quality",
    label: "Content quality",
    description: "Is your content clear, extractable, and useful for AI answers?",
    example: "Issue: 3 pages under 300 words in crawl",
  },
];

export function SignalsSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  function toggleSignal(id: string) {
    setActiveId(prev => (prev === id ? null : id));
  }

  const activeSignal = SIGNALS.find(s => s.id === activeId);

  return (
    <section
      aria-labelledby="signals-heading"
      style={{
        padding: "80px 0",
        background: "var(--surface-base)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="container-wide mx-auto">
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h2
            id="signals-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              color: "var(--text-primary)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              marginTop: "12px",
            }}
          >
            What ConduitScore checks
          </h2>
        </div>

        {/* Intro sentence */}
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "0.9375rem",
            fontFamily: "var(--font-body)",
            maxWidth: "600px",
            marginInline: "auto",
            marginBottom: "36px",
            lineHeight: 1.6,
          }}
        >
          We scan the technical and content signals that affect whether AI systems can access, understand, and cite your site.
        </p>

        {/* Chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            maxWidth: "640px",
            marginInline: "auto",
          }}
        >
          {SIGNALS.map((signal) => {
            const isActive = activeId === signal.id;
            return (
              <button
                key={signal.id}
                type="button"
                onClick={() => toggleSignal(signal.id)}
                aria-expanded={isActive}
                aria-controls="signals-expansion-panel"
                style={{
                  background: isActive ? "rgba(0,217,255,0.06)" : "var(--surface-overlay)",
                  border: isActive ? "1px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
                  borderRadius: "9999px",
                  padding: "8px 16px",
                  fontSize: "0.9375rem",
                  fontFamily: "var(--font-body)",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "border-color 150ms cubic-bezier(0.16, 1, 0.3, 1), background 150ms cubic-bezier(0.16, 1, 0.3, 1), color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {signal.label}
              </button>
            );
          })}
        </div>

        {/* Expansion panel */}
        <div
          style={{
            maxWidth: "640px",
            marginInline: "auto",
            marginTop: activeSignal ? "16px" : "0",
            maxHeight: activeSignal ? "200px" : "0",
            opacity: activeSignal ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease, margin-top 200ms ease",
          }}
          role="region"
          id="signals-expansion-panel"
          aria-live="polite"
        >
          {activeSignal && (
            <div
              style={{
                background: "var(--surface-overlay)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 24px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {activeSignal.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  marginTop: "6px",
                  lineHeight: 1.6,
                }}
              >
                {activeSignal.description}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-tertiary)",
                  marginTop: "10px",
                  padding: "6px 10px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "2px solid var(--brand-red)",
                  lineHeight: 1.5,
                }}
              >
                {activeSignal.example}
              </p>
            </div>
          )}
        </div>

        {/* Trust / credibility line */}
        <p
          style={{
            textAlign: "center",
            color: "var(--text-tertiary)",
            fontSize: "0.8125rem",
            fontFamily: "var(--font-body)",
            marginTop: "24px",
            maxWidth: "540px",
            marginInline: "auto",
            lineHeight: 1.5,
          }}
        >
          ConduitScore evaluates real technical and content signals that influence how AI systems interpret your site — not vanity metrics.
        </p>
      </div>
    </section>
  );
}
