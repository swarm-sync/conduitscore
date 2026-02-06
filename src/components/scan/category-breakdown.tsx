"use client";

import type { CategoryScore } from "@/lib/scanner/types";

function getBarColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "bg-[#10B981]";
  if (pct >= 60) return "bg-[#00C9A7]";
  if (pct >= 40) return "bg-[#F59E0B]";
  return "bg-[#EF4444]";
}

export function CategoryBreakdown({ categories }: { categories: CategoryScore[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((cat) => (
        <div key={cat.name} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#0A1628]">{cat.name}</span>
            <span className="text-sm font-bold text-[#0A1628]">{cat.score}/{cat.maxScore}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[#E5E7EB]">
            <div
              className={`h-2 rounded-full transition-all ${getBarColor(cat.score, cat.maxScore)}`}
              style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#475569]">
            {cat.issues.length === 0 ? "All checks passed" : `${cat.issues.length} issue${cat.issues.length > 1 ? "s" : ""} found`}
          </p>
        </div>
      ))}
    </div>
  );
}
