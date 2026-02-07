"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { CategoryBreakdown } from "@/components/scan/category-breakdown";
import { IssueList } from "@/components/scan/issue-list";
import { FixPanel } from "@/components/scan/fix-panel";
import type { ScanResult } from "@/lib/scanner/types";

export default function ScanResultPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [tab, setTab] = useState<"overview" | "issues" | "fixes">("overview");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("lastScanResult");
    if (!stored) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#475569]">Loading results...</p>
      </div>
    );
  }

  const loadTimeMs = typeof result.metadata.loadTimeMs === "number" ? result.metadata.loadTimeMs : 0;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0A1628]">Scan Results</h1>
          <p className="mt-1 text-sm text-[#475569]">
            {result.url} — scanned {new Date(result.scannedAt).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl border border-[#E5E7EB] bg-white p-8">
            <ScoreGauge score={result.overallScore} />
            <p className="mt-4 text-sm text-[#475569]">AI Visibility Score</p>
            <p className="mt-1 text-xs text-[#475569]">
              Load time: {loadTimeMs}ms
            </p>
          </div>
          <div className="lg:col-span-2">
            <CategoryBreakdown categories={result.categories} />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex gap-1 border-b border-[#E5E7EB]">
            {(["overview", "issues", "fixes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? "border-b-2 border-[#2E5C8A] text-[#2E5C8A]"
                    : "text-[#475569] hover:text-[#0A1628]"
                }`}
              >
                {t} {t === "issues" ? `(${result.issues.length})` : t === "fixes" ? `(${result.fixes.length})` : ""}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {tab === "overview" && (
              <div className="space-y-4">
                <p className="text-sm text-[#475569]">
                  Your website scored <strong>{result.overallScore}/100</strong> for AI visibility.
                  {result.overallScore >= 80
                    ? " Great job! Your site is well-optimized for AI agents."
                    : result.overallScore >= 50
                      ? " There's room for improvement. Check the issues and fixes tabs."
                      : " Your site needs significant work to be visible to AI agents."}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                    <p className="text-xs text-[#475569]">Critical Issues</p>
                    <p className="mt-1 text-2xl font-bold text-[#EF4444]">
                      {result.issues.filter((i) => i.severity === "critical").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                    <p className="text-xs text-[#475569]">Warnings</p>
                    <p className="mt-1 text-2xl font-bold text-[#F59E0B]">
                      {result.issues.filter((i) => i.severity === "warning").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                    <p className="text-xs text-[#475569]">Available Fixes</p>
                    <p className="mt-1 text-2xl font-bold text-[#10B981]">
                      {result.fixes.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {tab === "issues" && <IssueList issues={result.issues} />}
            {tab === "fixes" && <FixPanel fixes={result.fixes} />}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F9FAFB] transition-colors"
          >
            Scan Another URL
          </button>
          <a
            href="/pricing"
            className="rounded-lg bg-[#2E5C8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3A5F] transition-colors"
          >
            Upgrade for More Scans
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
