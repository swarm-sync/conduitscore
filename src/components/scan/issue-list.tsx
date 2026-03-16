"use client";

import type { Issue } from "@/lib/scanner/types";

const severityConfig: Record<string, {
  bg: string;
  color: string;
  border: string;
  label: string;
  icon: React.ReactNode;
}> = {
  critical: {
    bg:     "rgba(255, 71, 87, 0.08)",
    color:  "var(--error-400)",
    border: "rgba(255, 71, 87, 0.22)",
    label:  "Critical",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M6 3.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="6" cy="8.5" r="0.7" fill="currentColor" />
      </svg>
    ),
  },
  warning: {
    bg:     "rgba(255, 184, 0, 0.08)",
    color:  "var(--warning-400)",
    border: "rgba(255, 184, 0, 0.22)",
    label:  "Warning",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 1L11 10H1L6 1z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" fill="none" />
        <path d="M6 4.5v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  info: {
    bg:     "rgba(108, 59, 255, 0.06)",
    color:  "var(--violet-400)",
    border: "rgba(108, 59, 255, 0.18)",
    label:  "Info",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M6 5.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="6" cy="3.5" r="0.7" fill="currentColor" />
      </svg>
    ),
  },
};

const DESCRIPTION_TRUNCATE_LENGTH = 120;

export function IssueList({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-14 rounded-xl"
        style={{
          background: "linear-gradient(145deg, rgba(0,229,160,0.04) 0%, var(--surface-overlay) 100%)",
          border: "1px solid rgba(0,229,160,0.18)",
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full mb-4"
          style={{
            background: "rgba(0,229,160,0.10)",
            border: "1px solid rgba(0,229,160,0.22)",
            boxShadow: "0 0 20px rgba(0,229,160,0.12)",
          }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12l4 4 10-10" stroke="var(--success-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--success-400)", fontFamily: "var(--font-display)" }}>
          No issues found
        </p>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>
          Your site looks great to AI agents!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5" role="list" aria-label="Issues found">
      {issues.map((issue) => {
        const conf = severityConfig[issue.severity] || severityConfig.info;

        // Null/empty description means gated (free tier shows titles only)
        const isDescriptionGated =
          issue.description === null ||
          issue.description === undefined ||
          issue.description === "";

        const descriptionText = issue.description ?? "";
        const isTruncated =
          !isDescriptionGated &&
          descriptionText.length > DESCRIPTION_TRUNCATE_LENGTH;

        const displayDescription = isTruncated
          ? descriptionText.slice(0, DESCRIPTION_TRUNCATE_LENGTH)
          : descriptionText;

        return (
          <div
            key={issue.id}
            className="rounded-xl p-4 transition-all duration-150"
            style={{
              background: "var(--surface-overlay)",
              border: "1px solid var(--border-subtle)",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = conf.border;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
            }}
            role="listitem"
          >
            <div className="flex items-start gap-3">
              {/* Severity badge */}
              <span
                className="mt-0.5 inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  background: conf.bg,
                  color: conf.color,
                  border: `1px solid ${conf.border}`,
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}
              >
                {conf.icon}
                {conf.label}
              </span>

              <div className="min-w-0 flex-1">
                {/* Issue title — always fully visible */}
                <h4
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  {issue.title}
                </h4>

                {/* Impact line — visible to ALL users */}
                {issue.impact && (
                  <p
                    style={{
                      color: "var(--text-tertiary)",
                      fontStyle: "italic",
                      fontSize: "0.8125rem",
                      marginTop: "4px",
                      lineHeight: 1.5,
                    }}
                  >
                    {issue.impact}
                  </p>
                )}

                {/* Description — may be gated or truncated */}
                {!isDescriptionGated && (
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {displayDescription}
                    {isTruncated && (
                      <>
                        {"... "}
                        <a
                          href="/pricing"
                          className="text-xs font-medium"
                          style={{ color: "var(--brand-red)" }}
                          aria-label="Upgrade to read the full issue description"
                        >
                          Upgrade to read
                        </a>
                      </>
                    )}
                  </p>
                )}

                {/* Fully gated description — free tier, show upgrade link only */}
                {isDescriptionGated && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <a
                      href="/pricing"
                      className="text-xs font-medium"
                      style={{ color: "var(--brand-red)" }}
                      aria-label="Upgrade to read the full issue description"
                    >
                      Upgrade to read
                    </a>
                  </p>
                )}

                {/* Category badge */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: "rgba(108,59,255,0.06)",
                      color: "var(--violet-400)",
                      border: "1px solid rgba(108,59,255,0.15)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {issue.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
