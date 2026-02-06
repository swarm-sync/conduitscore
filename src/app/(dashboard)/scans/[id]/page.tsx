"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { CategoryBreakdown } from "@/components/scan/category-breakdown";
import { IssueList } from "@/components/scan/issue-list";
import { FixPanel } from "@/components/scan/fix-panel";
import type { ScanResult } from "@/lib/scanner/types";

export default function ScanResultPage() {
  const params = useParams();
  const [tab, setTab] = useState<"overview" | "issues" | "fixes">("overview");
  const [scan] = useState<ScanResult | null>(null);

  if (!scan) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#0A1628]">Scan Result</h1>
        <p className="text-sm text-[#475569]">Loading scan {params.id}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <ScoreGauge score={scan.overallScore} />
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">{scan.url}</h1>
          <p className="text-sm text-[#475569]">Scanned {new Date(scan.scannedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-[#F9FAFB] p-1">
        {(["overview", "issues", "fixes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-white text-[#0A1628] shadow-sm" : "text-[#475569] hover:text-[#0A1628]"}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && <CategoryBreakdown categories={scan.categories} />}
      {tab === "issues" && <IssueList issues={scan.issues} />}
      {tab === "fixes" && <FixPanel fixes={scan.fixes} />}
    </div>
  );
}
