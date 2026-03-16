"use client";

import { useEffect, useRef, useState } from "react";

const EXAMPLE_SCORE = 74;
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

function getBarColor(score: number): string {
  if (score >= 70) return "var(--cyan-400)";
  if (score >= 40) return "#f59e0b";
  return "var(--brand-red)";
}

interface ExampleScoreCardProps {
  animateOnMount?: boolean;
}

export function ExampleScoreCard({ animateOnMount = true }: ExampleScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const animationStarted = useRef(false);
  const rafRef = useRef<number | null>(null);

  // SVG ring geometry — 160px diameter, 4px stroke per spec
  const size = 160;
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  function startAnimation() {
    if (animationStarted.current) return;
    animationStarted.current = true;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayScore(EXAMPLE_SCORE);
      setTimeout(() => setBarsVisible(true), 100);
      return;
    }

    // 1200ms total at 60fps = ~72 frames
    const totalFrames = 72;
    let frame = 0;

    function tick() {
      frame++;
      const t = frame / totalFrames;
      // cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * EXAMPLE_SCORE));

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayScore(EXAMPLE_SCORE);
        // Bar fills start 200ms after circle finishes
        setTimeout(() => setBarsVisible(true), 200);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    if (animateOnMount) {
      startAnimation();
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateOnMount]);

  // When animateOnMount=false, trigger on scroll into view — fires ONCE
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (animateOnMount) return;
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateOnMount]);

  const dashOffset = circumference - (displayScore / 100) * circumference;

  return (
    <>
      <article
        ref={cardRef}
        role="img"
        aria-label={`Example ConduitScore scan result: ${EXAMPLE_DOMAIN} scores ${EXAMPLE_SCORE} out of 100 with 3 issues found`}
        style={{
          background: "var(--surface-overlay)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          // Spec: 0 0 60px rgba(0,217,255,0.08) glow + shadow-card
          boxShadow: "0 0 60px rgba(255,45,85,0.08), var(--shadow-card)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            insetInline: 0,
            top: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--brand-red), transparent)",
          }}
        />

        {/* Domain label with external-link icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "20px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            color: "var(--text-tertiary)",
          }}
        >
          <span>{EXAMPLE_DOMAIN}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M5 2H2v8h8V7M7 2h3m0 0v3M7 5l3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Score circle — 160px, centered */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* SVG ring */}
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              aria-hidden="true"
              style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
            >
              {/* Background track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
              />
              {/* Score arc — stroke: var(--cyan-400), 4px */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--cyan-400)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ filter: "drop-shadow(0 0 6px rgba(255,45,85,0.35))" }}
              />
            </svg>

            {/* Center content — spec: font-display, 3.5rem, 800, text-primary */}
            <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "var(--text-primary)",
                }}
                aria-hidden="true"
              >
                {displayScore}
              </div>
              {/* Sub-label: "/ 100" */}
              <div
                style={{
                  fontSize: "1rem",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.2,
                  marginTop: "2px",
                }}
              >
                / 100
              </div>
            </div>
          </div>
        </div>

        {/* Category bars — 7 rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {CATEGORIES.map((cat) => {
            const barColor = getBarColor(cat.score);
            return (
              <div key={cat.name} style={{ minHeight: "32px" }}>
                {/* Name + score row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontFamily: "var(--font-body)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {cat.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontFamily: "var(--font-mono)",
                      color: barColor,
                      textAlign: "right",
                    }}
                  >
                    {cat.score}
                  </span>
                </div>
                {/* Progress bar — 3px height */}
                <div
                  role="progressbar"
                  aria-valuenow={cat.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.name}: ${cat.score} out of 100`}
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
                      width: barsVisible ? `${cat.score}%` : "0%",
                      transition: "width 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Issues line — amber warning icon + text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "12px",
            fontSize: "0.8125rem",
            fontFamily: "var(--font-body)",
            color: "var(--text-tertiary)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="#f59e0b" strokeWidth="1.25" strokeLinejoin="round"/>
            <path d="M6 5v2.5" stroke="#f59e0b" strokeWidth="1.25" strokeLinecap="round"/>
            <circle cx="6" cy="9" r="0.5" fill="#f59e0b"/>
          </svg>
          3 issues found
        </div>

        {/* Blurred fix teaser — height 72px, blur 4px, overlay text */}
        <div
          style={{
            position: "relative",
            marginTop: "16px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            padding: "12px",
            height: "72px",
            overflow: "hidden",
          }}
        >
          {/* Blurred fake code — not accessible, intentionally hidden */}
          <div
            aria-hidden="true"
            style={{
              color: "var(--brand-lime)",
              filter: "blur(4px)",
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1.6,
              whiteSpace: "pre",
            }}
          >{`<meta name="description" content="AI-read...
{
  "@type": "WebSite",
  "url": "https://exa
User-agent: GPTBot
Allow: /`}</div>

          {/* Overlay — "preview is locked" signal */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8125rem",
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
              background: "rgba(0,0,0,0.1)",
              pointerEvents: "none",
            }}
          >
            Scan your site to see all fixes
          </div>
        </div>
      </article>

      {/* Caption below card */}
      <p
        style={{
          fontSize: "0.8125rem",
          fontFamily: "var(--font-body)",
          color: "var(--text-tertiary)",
          textAlign: "center",
          marginTop: "12px",
        }}
      >
        Live example — scan yours
      </p>
    </>
  );
}

export default ExampleScoreCard;
