"use client";

import type { CategoryScore } from "@/lib/scanner/types";

function getBarConfig(score: number, max: number): {
  color: string;
  glow: string;
  bg: string;
  gradient: string;
} {
  const pct = (score / max) * 100;
  if (pct >= 80) return {
    color: "var(--success-400)",
    glow: "rgba(217,255,0,0.35)",
    bg: "rgba(217,255,0,0.08)",
    gradient: "linear-gradient(90deg, #C1E400, #D9FF00)",
  };
  if (pct >= 60) return {
    color: "var(--success-500)",
    glow: "rgba(217,255,0,0.26)",
    bg: "rgba(217,255,0,0.08)",
    gradient: "linear-gradient(90deg, #A6C600, #D9FF00)",
  };
  if (pct >= 40) return {
    color: "var(--warning-400)",
    glow: "rgba(255,184,0,0.30)",
    bg: "rgba(255,184,0,0.08)",
    gradient: "linear-gradient(90deg, #CC8800, #FFB800)",
  };
  return {
    color: "var(--error-400)",
    glow: "rgba(255,45,85,0.3)",
    bg: "rgba(255,45,85,0.08)",
    gradient: "linear-gradient(90deg, #D52248, #FF2D55)",
  };
}

export function CategoryBreakdown({ categories }: { categories: CategoryScore[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((cat) => {
        const pct = (cat.score / cat.maxScore) * 100;
        const conf = getBarConfig(cat.score, cat.maxScore);

        return (
          <div
            key={cat.name}
            className="rounded-xl p-4 transition-all duration-200"
            style={{
              background: "var(--surface-overlay)",
              border: "1px solid var(--border-subtle)",
              transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,45,85,0.3)";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = `0 6px 24px rgba(0,0,0,0.3), 0 0 20px ${conf.glow.replace("0.35", "0.12").replace("0.30", "0.10")}`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-subtle)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="text-xs font-semibold leading-tight truncate"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  {cat.name}
                </span>
                {/* Issue count badge — visible to all tiers */}
                {cat.issues.length > 0 && (
                  <span
                    className="flex-shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold"
                    style={{
                      background: "rgba(255,45,85,0.08)",
                      border: "1px solid rgba(255,45,85,0.2)",
                      color: "var(--brand-red)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6875rem",
                      lineHeight: 1,
                    }}
                  >
                    {cat.issues.length}
                  </span>
                )}
              </div>
              <span
                className="text-xs font-bold tabular-nums flex-shrink-0"
                style={{
                  color: conf.color,
                  fontFamily: "var(--font-mono)",
                  background: conf.bg,
                  border: `1px solid ${conf.color}30`,
                  borderRadius: "var(--radius-full)",
                  padding: "1px 7px",
                }}
              >
                {cat.score}/{cat.maxScore}
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="rounded-full overflow-hidden mb-2.5"
              style={{ height: "4px", background: "rgba(255,255,255,0.05)" }}
              role="progressbar"
              aria-valuenow={cat.score}
              aria-valuemin={0}
              aria-valuemax={cat.maxScore}
              aria-label={`${cat.name}: ${cat.score} out of ${cat.maxScore}`}
            >
              {/* B9: GPU-composited animation — scaleX instead of width */}
              <div
                className="h-full rounded-full"
                style={{
                  transformOrigin: "left",
                  transform: `scaleX(${pct / 100})`,
                  background: conf.gradient,
                  boxShadow: `0 0 8px ${conf.glow}`,
                  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "transform",
                }}
              />
            </div>

            {/* Issue count */}
            <p
              className="text-xs flex items-center gap-1.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {cat.issues.length === 0 ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke="var(--success-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: "var(--success-400)" }}>All checks passed</span>
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <circle cx="5" cy="5" r="4" stroke={conf.color} strokeWidth="1.25" />
                    <path d="M5 3.5v2" stroke={conf.color} strokeWidth="1.25" strokeLinecap="round" />
                    <circle cx="5" cy="7" r="0.6" fill={conf.color} />
                  </svg>
                  {cat.issues.length} issue{cat.issues.length > 1 ? "s" : ""} found
                </>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
