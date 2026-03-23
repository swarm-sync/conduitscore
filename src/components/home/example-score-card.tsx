"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA — exact values from task spec
// ─────────────────────────────────────────────────────────────────────────────

const EXAMPLE_SCORE = 42;
const EXAMPLE_DOMAIN = "example.com";

const CATEGORIES = [
  { name: "Crawler Access",    score: 82 },
  { name: "Structured Data",   score: 61 },
  { name: "LLMs.txt",          score: 40 },
  { name: "Content Structure", score: 90 },
  { name: "Technical Health",  score: 78 },
  { name: "Citation Signals",  score: 55 },
  { name: "Content Quality",   score: 71 },
];

const TOP_ISSUES = [
  "Missing /llms.txt",
  "No Organization schema",
  "Missing Open Graph description",
];

// Exact code snippet from spec
const FIX_SNIPPET = `User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the fill colour for a category bar or score value label. */
function getBarColor(score: number): string {
  if (score >= 70) return "#22d3ee"; // cyan — passing
  if (score >= 40) return "#f59e0b"; // amber — warning
  return "#ff2d55";                  // red — critical
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS KEYFRAMES — injected once at module level via a <style> tag so that
// the animation declarations are available without relying on Tailwind v4
// (which strips custom CSS vars and purges custom class definitions).
// The style tag is rendered in the component but is idempotent.
// ─────────────────────────────────────────────────────────────────────────────

const KEYFRAMES_CSS = `
@keyframes cs-bar-fill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(var(--cs-bar-target)); }
}
@keyframes cs-fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface ExampleScoreCardProps {
  /** When true the score counter and bar fill start on mount (hero usage).
   *  When false they fire once the card scrolls into view. */
  animateOnMount?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ExampleScoreCard({ animateOnMount = true }: ExampleScoreCardProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [displayScore, setDisplayScore] = useState(0);
  const [barsVisible, setBarsVisible]   = useState(false);

  // Guards: only ever start the animation once
  const animationStarted = useRef(false);
  const rafRef           = useRef<number | null>(null);
  const timerRef         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef          = useRef<HTMLDivElement | null>(null);

  // ── SVG ring geometry ──────────────────────────────────────────────────────
  // 148 px diameter gives a tight, product-authentic ring that leaves room
  // for the dominant score label above the ring rather than inside it.
  const size        = 148;
  const strokeWidth = 6;
  const radius      = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference - (displayScore / 100) * circumference;

  // ── Animation trigger ──────────────────────────────────────────────────────
  const startAnimation = useCallback(() => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    // Respect prefers-reduced-motion — jump straight to final state
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayScore(EXAMPLE_SCORE);
      setBarsVisible(true);
      return;
    }

    // Count-up: 1 000 ms total, cubic ease-out, ~60 fps via rAF
    const DURATION_MS  = 1000;
    const START_TS = performance.now();

    function tick(now: number) {
      const elapsed = now - START_TS;
      const t       = Math.min(elapsed / DURATION_MS, 1);
      // cubic ease-out
      const eased   = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * EXAMPLE_SCORE));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayScore(EXAMPLE_SCORE);
        // Bars start filling 150 ms after the counter reaches its final value.
        // This is a minimal setTimeout for sequencing — it does NOT block
        // usability or the main thread; the page is already fully interactive.
        timerRef.current = setTimeout(() => setBarsVisible(true), 150);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Mount-based trigger (hero) — defer past the effect body so setState runs in a
  // frame callback (avoids react-hooks/set-state-in-effect on synchronous starts).
  useEffect(() => {
    if (!animateOnMount) return;
    const scheduleId = requestAnimationFrame(() => {
      startAnimation();
    });
    return () => {
      cancelAnimationFrame(scheduleId);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [animateOnMount, startAnimation]);

  // Scroll-into-view trigger (non-hero placements)
  useEffect(() => {
    if (animateOnMount) return;
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnMount, startAnimation]);

  // ── Score colour (the ring arc + dominant score number) ────────────────────
  // 42 is in the critical range — red
  const scoreColor = getBarColor(EXAMPLE_SCORE); // "#ff2d55"

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Inject keyframes once — idempotent in production SSR hydration */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} />

      <div
        ref={cardRef}
        role="img"
        aria-label={`Example scan result for ${EXAMPLE_DOMAIN}. AI Visibility Score: ${EXAMPLE_SCORE} out of 100.`}
        style={{
          background:   "rgba(12, 12, 15, 0.92)",
          border:       "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding:      "24px",
          boxShadow:    "0 0 60px rgba(255,45,85,0.10), 0 18px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
          position:     "relative",
          overflow:     "hidden",
          width:        "100%",
        }}
      >
        {/* ── Top accent gradient line ──────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            insetInline: 0,
            top:        0,
            height:     "1px",
            background: "linear-gradient(90deg, transparent, #ff2d55 40%, #6366f1 70%, transparent)",
          }}
        />

        {/* ── Card title + site line ────────────────────────────────────────── */}
        {/* "Example scan result" is the section header; site is the sub-label  */}
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize:   "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.38)",
              marginBottom: "4px",
            }}
          >
            Example scan result
          </p>

          {/* Site line — monospace domain with external-link icon */}
          <div
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "5px",
              fontFamily: "var(--font-mono)",
              fontSize:   "0.8125rem",
              color:      "rgba(255,255,255,0.55)",
            }}
          >
            <span>{EXAMPLE_DOMAIN}</span>
            {/* External-link icon — purely decorative */}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M5 2H2v8h8V7M7 2h3m0 0v3M7 5l3-3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SCORE SECTION — the most visually dominant element on the card.
            Layout: left column = ring arc, right column = big score number
            + "AI Visibility Score" label.
            This two-column arrangement keeps the number very large (3.75rem)
            while still housing the animated SVG ring, satisfying the spec
            requirement that the score is the dominant focal point.
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "16px",
            marginBottom:   "22px",
            padding:        "16px",
            background:     "rgba(255,45,85,0.05)",
            border:         "1px solid rgba(255,45,85,0.14)",
            borderRadius:   "14px",
          }}
        >
          {/* Animated SVG ring — left */}
          <div
            aria-hidden="true"
            style={{
              position: "relative",
              width:    size,
              height:   size,
              flexShrink: 0,
            }}
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{ transform: "rotate(-90deg)" }}
            >
              {/* Track ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
              />
              {/* Animated score arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{
                  // Smooth CSS transition on the dashOffset as React updates it
                  transition: "stroke-dashoffset 16ms linear",
                  filter:     `drop-shadow(0 0 8px ${scoreColor}88)`,
                }}
              />
            </svg>

            {/* Percentage inside ring */}
            <div
              style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "2rem",
                  fontWeight:    800,
                  letterSpacing: "-0.04em",
                  lineHeight:    1,
                  color:         scoreColor,
                }}
              >
                {displayScore}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize:   "0.6875rem",
                  color:      "rgba(255,255,255,0.38)",
                  lineHeight: 1.2,
                  marginTop:  "2px",
                }}
              >
                / 100
              </span>
            </div>
          </div>

          {/* Right side: dominant score label block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* "AI Visibility Score" label — small caps eyebrow */}
            <p
              style={{
                fontFamily:    "var(--font-body)",
                fontSize:      "0.6875rem",
                fontWeight:    600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,0.45)",
                marginBottom:  "4px",
              }}
            >
              AI Visibility Score
            </p>

            {/* The dominant number — 3.75rem, 800 weight, score colour */}
            <div
              aria-hidden="true"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "3.75rem",
                fontWeight:    800,
                letterSpacing: "-0.05em",
                lineHeight:    0.9,
                color:         scoreColor,
                // Subtle text glow to reinforce criticality
                textShadow:    `0 0 32px ${scoreColor}55`,
              }}
            >
              {displayScore}
            </div>

            {/* "/ 100" denominator */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize:   "0.875rem",
                color:      "rgba(255,255,255,0.35)",
                marginTop:  "2px",
              }}
            >
              / 100
            </p>

            {/* Score badge — critical range label */}
            <div
              style={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "4px",
                marginTop:    "10px",
                padding:      "3px 8px",
                borderRadius: "6px",
                background:   "rgba(255,45,85,0.12)",
                border:       "1px solid rgba(255,45,85,0.24)",
              }}
            >
              {/* Warning dot */}
              <span
                aria-hidden="true"
                style={{
                  width:        "6px",
                  height:       "6px",
                  borderRadius: "50%",
                  background:   "#ff2d55",
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontFamily:    "var(--font-body)",
                  fontSize:      "0.6875rem",
                  fontWeight:    600,
                  color:         "#ff2d55",
                  letterSpacing: "0.03em",
                }}
              >
                Needs improvement
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            CATEGORY BARS — all 7, animated via CSS scaleX transform.
            Each bar uses a CSS custom property (--cs-bar-target) for its
            target scale, set as an inline style on the fill div. The
            animation class is toggled once barsVisible becomes true,
            which fires after the score counter finishes.
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "9px",
            marginBottom:  "20px",
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const color = getBarColor(cat.score);
            return (
              <div key={cat.name}>
                {/* Label row */}
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    marginBottom:   "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize:   "0.75rem",
                      color:      "rgba(255,255,255,0.6)",
                    }}
                  >
                    {cat.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize:   "0.75rem",
                      color:      color,
                      minWidth:   "2ch",
                      textAlign:  "right",
                    }}
                  >
                    {cat.score}
                  </span>
                </div>

                {/* Progress bar track */}
                <div
                  aria-hidden="true"
                  style={{
                    height:       "3px",
                    borderRadius: "2px",
                    background:   "rgba(255,255,255,0.06)",
                    overflow:     "hidden",
                  }}
                >
                  {/* Fill — GPU-composited via scaleX, not width, per perf best practices */}
                  <div
                    style={{
                      height:          "100%",
                      borderRadius:    "2px",
                      background:      color,
                      transformOrigin: "left",
                      // CSS custom property carries the target scale value
                      ["--cs-bar-target" as string]: `${cat.score / 100}`,
                      // Once barsVisible, animate from scaleX(0) to --cs-bar-target
                      // using a CSS keyframe so no JS setTimeout blocks the UI.
                      // Stagger each bar by 40ms using animation-delay.
                      animation: barsVisible
                        ? `cs-bar-fill 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both`
                        : "none",
                      transform: barsVisible ? `scaleX(${cat.score / 100})` : "scaleX(0)",
                      willChange: "transform",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TOP ISSUES BLOCK
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            marginBottom: "16px",
            padding:      "14px",
            background:   "rgba(255,154,40,0.05)",
            border:       "1px solid rgba(255,154,40,0.14)",
            borderRadius: "12px",
          }}
        >
          {/* Block title */}
          <p
            style={{
              fontFamily:   "var(--font-display)",
              fontSize:     "0.75rem",
              fontWeight:   600,
              color:        "rgba(255,255,255,0.5)",
              marginBottom: "10px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Top issues holding this site back
          </p>

          {/* Issue list */}
          <ul
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           "7px",
              margin:        0,
              padding:       0,
              listStyle:     "none",
            }}
          >
            {TOP_ISSUES.map((issue) => (
              <li
                key={issue}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "7px",
                  fontFamily: "var(--font-body)",
                  fontSize:   "0.8125rem",
                  color:      "rgba(255,255,255,0.7)",
                }}
              >
                {/* Warning triangle icon */}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M6 1.5L11 10.5H1L6 1.5Z"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 5v2.5"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="6" cy="9" r="0.5" fill="#f59e0b" />
                </svg>
                {issue}
              </li>
            ))}
          </ul>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            FIX SNIPPET BLOCK — "First fix to implement"
            Shows the exact code snippet from the spec in a terminal-style
            preformatted block with a lime left-border accent.
            Per the fix-gating business rule (project memory):
              - Free tier shows exactly ONE unblurred fix.
              - Remaining fixes are blurred behind an upgrade CTA.
            This demo card shows the single free fix clearly, then the footer
            line drives toward the full-report CTA.
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: "16px" }}>
          {/* Block title */}
          <p
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "0.75rem",
              fontWeight:    600,
              color:         "rgba(255,255,255,0.5)",
              marginBottom:  "8px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            First fix to implement
          </p>

          {/* Code block */}
          <div
            style={{
              background:   "rgba(0,0,0,0.55)",
              border:       "1px solid rgba(217,255,0,0.16)",
              borderLeft:   "3px solid #d9ff00",
              borderRadius: "10px",
              padding:      "12px 14px",
              fontFamily:   "var(--font-mono)",
              fontSize:     "0.75rem",
              color:        "#d9ff00",
              lineHeight:   1.75,
              // Preserve exact whitespace and newlines from the spec
              whiteSpace:   "pre",
              overflowX:    "auto",
            }}
          >
            {FIX_SNIPPET}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            FOOTER LINE — the final persuasion line before the CTA.
            Presented as a quiet but persistent call to action.
        ══════════════════════════════════════════════════════════════════════ */}
        <p
          style={{
            fontFamily:  "var(--font-body)",
            fontSize:    "0.8125rem",
            color:       "rgba(255,255,255,0.45)",
            lineHeight:  1.5,
            textAlign:   "center",
            paddingTop:  "12px",
            borderTop:   "1px solid rgba(255,255,255,0.06)",
          }}
        >
          See the full issue breakdown and the highest-impact fixes first.
        </p>
      </div>

      {/* ── Supporting caption below card ─────────────────────────────────── */}
      <p
        style={{
          fontFamily:   "var(--font-body)",
          fontSize:     "0.8125rem",
          color:        "rgba(255,255,255,0.38)",
          textAlign:    "center",
          marginTop:    "14px",
          lineHeight:   1.5,
          maxWidth:     "380px",
          marginInline: "auto",
        }}
      >
        Most sites do not have one big AI visibility problem — they leak
        visibility through small technical gaps. ConduitScore shows you which
        issues matter first.
      </p>
    </>
  );
}

export default ExampleScoreCard;
