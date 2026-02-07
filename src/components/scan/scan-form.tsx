"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ScanFormProps {
  variant?: "hero" | "dashboard";
}

export function ScanForm({ variant = "hero" }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed");
        return;
      }

      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("lastScanResult", JSON.stringify(data));
      router.push("/scan-result");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "hero") {
    return (
      <div>
        <div className="flex w-full max-w-md overflow-hidden rounded-lg border border-[#1E3A5F] bg-[#0A1628]">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="Enter your website URL..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-[#4A7DAC]/50 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="bg-[#2E5C8A] px-6 py-3 font-medium text-white hover:bg-[#1E3A5F] transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan Free"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="https://example.com"
          className="flex-1 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-[#0A1628] placeholder:text-[#475569]/50 focus:border-[#2E5C8A] focus:outline-none focus:ring-2 focus:ring-[#4A7DAC]/20"
          disabled={loading}
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="rounded-lg bg-[#2E5C8A] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1E3A5F] transition-colors disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
