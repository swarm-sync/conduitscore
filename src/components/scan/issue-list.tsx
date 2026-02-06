"use client";

import type { Issue } from "@/lib/scanner/types";

const severityStyles: Record<string, string> = {
  critical: "bg-[#EF4444]/10 text-[#EF4444]",
  warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
  info: "bg-[#2E5C8A]/10 text-[#2E5C8A]",
};

export function IssueList({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return <p className="text-sm text-[#475569]">No issues found. Your site looks great!</p>;
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <div key={issue.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start gap-3">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[issue.severity]}`}>
              {issue.severity}
            </span>
            <div>
              <h4 className="text-sm font-medium text-[#0A1628]">{issue.title}</h4>
              <p className="mt-1 text-xs text-[#475569]">{issue.description}</p>
              <span className="mt-1 inline-block text-xs text-[#4A7DAC]">{issue.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
