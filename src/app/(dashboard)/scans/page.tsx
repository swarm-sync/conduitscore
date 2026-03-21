"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ScanSummary {
  id: string;
  url: string;
  overallScore: number | null;
  status: string;
  createdAt: string;
}

export default function ScansPage() {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScans() {
      try {
        const response = await fetch("/api/scans", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load scans");
        }
        setScans(data.scans ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load scans");
      } finally {
        setLoading(false);
      }
    }

    void loadScans();
  }, []);

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Scan History
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
          View and revisit all previous AI visibility scans.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-[28px]"
        style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
      >
        <div
          className="grid grid-cols-[2fr_0.8fr_0.9fr_1fr] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            color: "var(--text-tertiary)",
          }}
        >
          <span>URL</span>
          <span>Score</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Loading scans...
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-sm" style={{ color: "var(--error-400)" }}>
            {error}
          </div>
        ) : scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(255,45,85,0.08)", border: "1px solid var(--border-subtle)" }}
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="var(--brand-red)" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="11" cy="11" r="3" fill="var(--brand-red)" fillOpacity="0.3" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No scans yet
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
              Run your first scan from the dashboard.
            </p>
          </div>
        ) : (
          <div>
            {scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/scans/${scan.id}`}
                className="grid grid-cols-[2fr_0.8fr_0.9fr_1fr] gap-4 px-5 py-4 text-sm transition-colors"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  color: "var(--text-secondary)",
                }}
              >
                <span className="truncate" style={{ color: "var(--text-primary)" }}>
                  {scan.url}
                </span>
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  {scan.overallScore ?? "—"}
                </span>
                <span style={{ color: scan.status === "completed" ? "var(--brand-lime)" : "var(--brand-red)" }}>
                  {scan.status}
                </span>
                <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
