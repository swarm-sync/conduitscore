"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

type TrendPoint = {
  date: string;
  score: number;
};

interface ProjectTrendChartProps {
  points: TrendPoint[];
}

const ProjectTrendChart = dynamic(
  () =>
    import("./project-trend-chart").then((mod) => ({
      default: mod.ProjectTrendChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[220px] items-center justify-center rounded-xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-tertiary)",
        }}
      >
        Loading chart...
      </div>
    ),
  }
);

export function ProjectTrendChartLazy({ points }: ProjectTrendChartProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[220px] items-center justify-center rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-tertiary)",
          }}
        >
          Loading chart...
        </div>
      }
    >
      <ProjectTrendChart points={points} />
    </Suspense>
  );
}
