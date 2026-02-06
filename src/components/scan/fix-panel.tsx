"use client";

import { useState } from "react";
import type { Fix } from "@/lib/scanner/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="rounded px-2 py-1 text-xs font-medium text-[#2E5C8A] hover:bg-[#2E5C8A]/10 transition-colors">
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function FixPanel({ fixes }: { fixes: Fix[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (fixes.length === 0) {
    return <p className="text-sm text-[#475569]">No fixes needed. Great job!</p>;
  }

  return (
    <div className="space-y-3">
      {fixes.map((fix) => (
        <div key={fix.issueId} className="rounded-xl border border-[#E5E7EB] bg-white">
          <button
            onClick={() => setExpandedId(expandedId === fix.issueId ? null : fix.issueId)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <h4 className="text-sm font-medium text-[#0A1628]">{fix.title}</h4>
              <p className="text-xs text-[#475569]">{fix.description}</p>
            </div>
            <span className="text-[#475569]">{expandedId === fix.issueId ? "−" : "+"}</span>
          </button>
          {expandedId === fix.issueId && (
            <div className="border-t border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#475569] uppercase">{fix.language}</span>
                <CopyButton text={fix.code} />
              </div>
              <pre className="overflow-x-auto rounded-lg bg-[#0A1628] p-4 text-sm text-[#00D9FF] font-mono">
                <code>{fix.code}</code>
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
