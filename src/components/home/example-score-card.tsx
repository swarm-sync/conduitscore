"use client";

import { useEffect, useRef, useState } from "react";

const EXAMPLE_SCORE = 74;

const CATEGORIES = [
  { name: "Crawler Access",    score: 80 },
  { name: "Structured Data",   score: 55 },
  { name: "Content Structure", score: 90 },
  { name: "LLMs.txt",          score: 30 },
  { name: "Technical Health",  score: 75 },
  { name: "Citation Signals",  score: 62 },
  { name: "Content Quality",   score: 85 },
];

function getBarColor(score: number): string {
  if (score >= 70) return "var(--success-500)";
  if (score >= 40) return "var(--warning-400)";
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

  // Responsive size
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  function startAnimation() {
    if (animationStarted.current) return;
    animationStarted.current = true;

    // Check reduced motion preference
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayScore(EXAMPLE_SCORE);
      setTimeout(() => setBarsVisible(true), 100);
      return;
    }

    const totalFrames = 80;
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
        // Trigger bar fills 200ms after circle finishes
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

  // For non-mount animation: expose a trigger via IntersectionObserver
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

  const gradeLabel = displayScore >= 90 ? "Excellent" : displayScore >= 70 ? "Good" : displayScore >= 40 ? "Fair" : "Poor";

  return (
    <>
      <article
        ref={cardRef}
        role="img"
        aria-label="Example ConduitScore scan result: example.com scores 74 out of 100 with 3 issues found"
        style={{
          background: "var(--surface-overlay)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          boxShadow: "0 0 60px rgba(217,255,0,0.06), 0 18px 60px rgba(0,0,0,0.45), 0 0 0 1px var(--border-subtle)",
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

        {/* Domain label */}
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
          <span>example.com</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M5 2H2v8h8V7M7 2h3m0 0v3M7 5l3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Score circle — centered */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                width: size * 0.75,
                height: size * 0.75,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(217,255,0,0.18) 0%, transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />

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
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
              />
              {/* Score arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--success-500)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ filter: "drop-shadow(0 0 6px rgba(217,255,0,0.18))" }}
              />
            </svg>

            {/* Center content */}
            <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "2.75rem",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #FF2D55 0%, #FFFFFF 40%, #D9FF00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                aria-hidden="true"
              >
                {displayScore}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontFamily: "var(--font-body)", lineHeight: 1.2 }}>
                / 100
              </div>
              {/* Grade pill */}
              <div
                style={{
                  display: "inline-flex",
                  marginTop: "4px",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  color: "var(--success-500)",
                  background: "rgba(217,255,0,0.10)",
                  border: "1px solid rgba(193,228,0,0.20)",
                  borderRadius: "var(--radius-full)",
                  padding: "1px 10px",
                }}
              >
                {gradeLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Category bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {CATEGORIES.map((cat) => {
            const barColor = getBarColor(cat.score);
            return (
              <div key={cat.name}>
                {/* Name + score row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.8125rem", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {cat.name}
                  </span>
                  <span style={{ fontSize: "0.8125rem", fontFamily: "var(--font-mono)", color: barColor }}>
                    {cat.score}
                  </span>
                </div>
                {/* Progress bar */}
                <div
                  role="progressbar"
                  aria-valuenow={cat.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.name}: ${cat.score} out of 100`}
                  style={{
                    height: "3px",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "9999px",
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

        {/* Issues line */}
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
            <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="#ffbc4a" strokeWidth="1.25" strokeLinejoin="round"/>
            <path d="M6 5v2.5" stroke="#ffbc4a" strokeWidth="1.25" strokeLinecap="round"/>
            <circle cx="6" cy="9" r="0.5" fill="#ffbc4a"/>
          </svg>
          3 issues found
        </div>

        {/* Blurred fix teaser */}
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
          {/* Blurred fake code */}
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

          {/* Overlay text */}
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
