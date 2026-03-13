"use client";

import { useEffect, useState } from "react";

function getScoreConfig(score: number): {
  color: string;
  gradientId: string;
  label: string;
  glow: string;
  labelBg: string;
  labelBorder: string;
} {
  if (score >= 90) return {
    color: "var(--success-400)",
    gradientId: "score-excellent",
    label: "Excellent",
    glow: "rgba(217,255,0,0.24)",
    labelBg: "rgba(217,255,0,0.12)",
    labelBorder: "rgba(217,255,0,0.22)",
  };
  if (score >= 70) return {
    color: "var(--success-500)",
    gradientId: "score-good",
    label: "Good",
    glow: "rgba(217,255,0,0.18)",
    labelBg: "rgba(217,255,0,0.1)",
    labelBorder: "rgba(217,255,0,0.2)",
  };
  if (score >= 50) return {
    color: "var(--warning-400)",
    gradientId: "score-fair",
    label: "Fair",
    glow: "rgba(255, 184, 0, 0.22)",
    labelBg: "rgba(255,184,0,0.10)",
    labelBorder: "rgba(255,184,0,0.22)",
  };
  if (score >= 30) return {
    color: "var(--warning-500)",
    gradientId: "score-poor",
    label: "Poor",
    glow: "rgba(255,184,0,0.15)",
    labelBg: "rgba(255,184,0,0.08)",
    labelBorder: "rgba(255,184,0,0.18)",
  };
  return {
    color: "var(--error-400)",
    gradientId: "score-critical",
    label: "Critical",
    glow: "rgba(255, 71, 87, 0.22)",
    labelBg: "rgba(255,71,87,0.10)",
    labelBorder: "rgba(255,71,87,0.22)",
  };
}

export function ScoreGauge({ score, size = 180 }: { score: number; size?: number }) {
  const [displayScore, setDisplayScore] = useState(0);

  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let frame = 0;
    const duration = 80;
    const step = () => {
      frame++;
      const t = Math.min(frame / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * score));
      if (frame < duration) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const config = getScoreConfig(score);
  const progress = (displayScore / 100) * circumference;
  const dashOffset = circumference - progress;

  const uniqueId = `sg-${size}`;

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`AI visibility score: ${score} out of 100 — ${config.label}`}
    >
      {/* Ambient glow behind ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "background 0.6s",
        }}
        aria-hidden="true"
      />

      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient arc for primary (red -> purple) */}
          <linearGradient id={`${uniqueId}-grad`} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF2D55" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Score arc — uses semantic color OR gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={score >= 70 && score < 90 ? config.color : `url(#${uniqueId}-grad)`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.08s linear, stroke 0.5s",
            filter: `drop-shadow(0 0 6px ${config.glow})`,
          }}
        />
      </svg>

      {/* Center content */}
      <div
        className="absolute flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        {/* Score number in JetBrains Mono */}
        <span
          className="tabular-nums leading-none"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: size > 140 ? "2.75rem" : "2rem",
            background: "linear-gradient(135deg, #FF2D55 0%, #FFFFFF 40%, #D9FF00 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em",
            transition: "all 0.5s",
          }}
        >
          {displayScore}
        </span>

        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
        >
          / 100
        </span>

        {/* Grade label */}
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{
            background: config.labelBg,
            color: config.color,
            border: `1px solid ${config.labelBorder}`,
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            letterSpacing: "0.02em",
          }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
