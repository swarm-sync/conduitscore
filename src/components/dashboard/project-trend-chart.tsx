"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = {
  date: string;
  score: number;
};

interface ProjectTrendChartProps {
  points: TrendPoint[];
}

export function ProjectTrendChart({ points }: ProjectTrendChartProps) {
  if (points.length === 0) {
    return (
      <div
        className="flex min-h-[220px] items-center justify-center rounded-xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-tertiary)",
        }}
      >
        Not enough scans yet to show a trend.
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--surface-overlay)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 12, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(18,18,20,0.96)",
                border: "1px solid rgba(108,59,255,0.25)",
                borderRadius: "12px",
                color: "var(--text-primary)",
              }}
              labelStyle={{ color: "var(--text-secondary)" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--cyan-400)"
              strokeWidth={3}
              dot={{ fill: "var(--brand-red)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5, fill: "var(--brand-lime)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
