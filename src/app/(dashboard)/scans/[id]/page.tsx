"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { CategoryBreakdown } from "@/components/scan/category-breakdown";
import { IssueList } from "@/components/scan/issue-list";
import { FixPanel } from "@/components/scan/fix-panel";
import type { ScanResult } from "@/lib/scanner/types";

function ShareButton({ scanId }: { scanId: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://conduitscore.com"}/scans/${scanId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      onClick={() => void handleCopy()}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
      style={{
        background: copied ? "rgba(0,229,160,0.10)" : "rgba(255,255,255,0.04)",
        border: copied ? "1px solid rgba(0,229,160,0.30)" : "1px solid var(--border-subtle)",
        color: copied ? "var(--success-400)" : "var(--text-secondary)",
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M7 1H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V5L7 1z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 1v4h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

export default function DashboardScanResultPage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<"overview" | "issues" | "fixes">("overview");
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScan() {
      try {
        const response = await fetch(`/api/scans/${params.id}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load scan");
        }
        setScan(data as ScanResult);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load scan");
      }
    }

    if (params.id) {
      void loadScan();
    }
  }, [params.id]);

  if (!scan && !error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          Scan Result
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Loading scan {params.id}...
        </p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          Scan Result
        </h1>
        <p className="text-sm" style={{ color: "var(--error-400)" }}>
          {error}
        </p>
        <Link href="/dashboard/scans" className="footer-link text-sm">
          Back to scan history
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 rounded-[28px] p-6 lg:flex-row lg:items-center" style={{ background: "var(--gradient-card)", border: "1px solid var(--border-subtle)" }}>
        <ScoreGauge score={scan.overallScore} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold truncate" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {scan.url}
            </h1>
            <ShareButton scanId={params.id} />
          </div>
          <p className="mt-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Scanned {new Date(scan.scannedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 rounded-full border px-2 py-2" style={{ borderColor: "var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
        {(["overview", "issues", "fixes"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className="rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors"
            style={{
              background: tab === item ? "var(--brand-red)" : "transparent",
              color: tab === item ? "var(--text-primary)" : "var(--text-secondary)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "overview" && <CategoryBreakdown categories={scan.categories} />}
      {tab === "issues" && <IssueList issues={scan.issues} />}
      {tab === "fixes" && <FixPanel fixes={scan.fixes} />}
    </div>
  );
}
