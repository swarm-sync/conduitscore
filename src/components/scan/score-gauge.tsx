"use client";

import { useEffect, useState } from "react";

function getScoreColor(score: number): string {
  if (score >= 90) return "#10B981";
  if (score >= 70) return "#00C9A7";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export function ScoreGauge({ score, size = 160 }: { score: number; size?: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    let frame = 0;
    const duration = 60;
    const step = () => {
      frame++;
      const t = Math.min(frame / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * score));
      if (frame < duration) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-300"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-4xl font-extrabold" style={{ color }}>{displayScore}</span>
        <span className="block text-xs text-[#475569]">/100</span>
      </div>
    </div>
  );
}
