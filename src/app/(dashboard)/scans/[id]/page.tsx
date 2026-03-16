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

function BadgeEmbedSection({ scanId, score }: { scanId: string; score: number }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://conduitscore.com";

  const embedSnippet = `<a href="${siteUrl}/?ref=badge" target="_blank">\n  <img src="${siteUrl}/api/badge/${scanId}" alt="ConduitScore Verified: ${score}/100 AI-Visible" />\n</a>`;

  async function handleCopyEmbed() {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = embedSnippet;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <section
      className="rounded-xl p-6"
      style={{
        background: "var(--surface-overlay)",
        border: "1px solid var(--border-subtle)",
      }}
      aria-labelledby="badge-section-heading"
    >
      <h2
        id="badge-section-heading"
        className="text-base font-semibold mb-1"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
      >
        Your site is AI-visible — show it off
      </h2>
      <p className="text-xs mb-5" style={{ color: "var(--text-tertiary)" }}>
        Embed this badge on your site to signal AI-readiness to visitors.
      </p>

      {/* Live badge preview */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="rounded-lg p-3 flex items-center justify-center"
          style={{
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-subtle)",
            minWidth: "80px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/badge/${scanId}`}
            alt={`ConduitScore badge: ${score}/100 AI-Visible`}
            style={{ display: "block", maxHeight: "28px", width: "auto" }}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Live badge — updates automatically when you re-scan.
        </p>
      </div>

      {/* Embed snippet */}
      <div className="mb-3">
        <label
          htmlFor="badge-embed-code"
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Embed code
        </label>
        <textarea
          id="badge-embed-code"
          readOnly
          value={embedSnippet}
          rows={3}
          className="w-full rounded-lg text-xs resize-none outline-none"
          style={{
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-subtle)",
            color: "var(--brand-lime)",
            fontFamily: "var(--font-mono)",
            padding: "12px",
            lineHeight: 1.6,
          }}
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          aria-label="Badge embed HTML code"
        />
      </div>

      <button
        onClick={() => void handleCopyEmbed()}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
        style={{
          background: copied ? "rgba(0,229,160,0.10)" : "var(--brand-red)",
          color: copied ? "var(--success-400)" : "#fff",
          border: copied ? "1px solid rgba(0,229,160,0.30)" : "none",
          fontFamily: "var(--font-display)",
          cursor: "pointer",
        }}
        aria-label={copied ? "Embed code copied" : "Copy badge embed code to clipboard"}
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Copy embed code
          </>
        )}
      </button>
    </section>
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

  // Extract domain from scan URL for fix panel display
  let scanDomain = scan.url;
  try {
    scanDomain = new URL(scan.url.startsWith("http") ? scan.url : `https://${scan.url}`).hostname;
  } catch {
    scanDomain = scan.url;
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
      {tab === "fixes" && (
        <FixPanel
          fixes={scan.fixes}
          scanDomain={scanDomain}
        />
      )}

      {/* Share Your Score badge section — only shown when score >= 70 */}
      {scan.overallScore >= 70 && params.id && (
        <BadgeEmbedSection scanId={params.id} score={scan.overallScore} />
      )}
    </div>
  );
}
