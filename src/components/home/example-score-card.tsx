"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

  const startAnimation = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (animateOnMount) {
      startAnimation();
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [animateOnMount, startAnimation]);

  // When animateOnMount=false, trigger on scroll into view — fires ONCE
  const cardRef = useRef<HTMLDivElement | null>(null);

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
  }, [animateOnMount, startAnimation]);

  const dashOffset = circumference - (displayScore / 100) * circumference;

  return (
    <>
      <div
        ref={cardRef}
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
              <span className="sr-only">AI visibility score: {displayScore} out of 100</span>
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

        {/* Category bars — keep the text visible to AT, hide only the visual fills. */}
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
                {/* Progress bar — 3px height, presentational within role=img */}
                <div
                  aria-hidden="true"
                  style={{
                    height: "3px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  {/* B9: GPU-composited animation — scaleX instead of width */}
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "2px",
                      background: barColor,
                      transformOrigin: "left",
                      transform: barsVisible ? `scaleX(${cat.score / 100})` : "scaleX(0)",
                      transition: "transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                      willChange: "transform",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top 3 issues listed per spec */}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {[
            "Missing /llms.txt",
            "No Organization schema",
            "Open Graph og:description missing",
          ].map((issue) => (
            <div
              key={issue}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
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
              {issue}
            </div>
          ))}
        </div>

        {/* Fix teaser section — one visible fix + blurred previews */}
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>

          {/* ONE unblurred fix — real value demonstration */}
          <div
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(217,255,0,0.18)",
              borderLeft: "3px solid var(--brand-lime)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              padding: "10px 12px",
              color: "var(--brand-lime)",
              lineHeight: 1.7,
              whiteSpace: "pre",
            }}
          >{`# Add to robots.txt
User-agent: GPTBot
Allow: /`}</div>

          {/* Blurred previews — 2 more snippets with overlay CTA */}
          <div
            style={{
              position: "relative",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              padding: "10px 12px",
              overflow: "hidden",
            }}
          >
            {/* Blurred code snippets — intentionally unreadable */}
            <div
              aria-hidden="true"
              style={{
                color: "var(--brand-lime)",
                filter: "blur(4px)",
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1.7,
                whiteSpace: "pre",
              }}
            >{`<script type="application/ld+json">
{
  "@type": "WebSite",
  "url": "https://example.com"
}
</script>
---
<meta name="description" content="AI-optimized...`}</div>

            {/* Overlay CTA */}
            <a
              href="#scan"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(8,8,9,0.72)",
                backdropFilter: "blur(2px)",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  color: "var(--text-primary)",
                  textAlign: "center",
                  padding: "0 12px",
                }}
              >
                See the full issue breakdown and the highest-impact fixes first.
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Supporting sentence + caption below card */}
      <p
        style={{
          fontSize: "0.8125rem",
          fontFamily: "var(--font-body)",
          color: "var(--text-secondary)",
          textAlign: "center",
          marginTop: "16px",
          lineHeight: 1.5,
          maxWidth: "380px",
          marginInline: "auto",
        }}
      >
        Most sites do not have one big AI visibility problem — they leak visibility through small technical gaps. ConduitScore shows you which issues matter first.
      </p>
    </>
  );
}

export default ExampleScoreCard;
