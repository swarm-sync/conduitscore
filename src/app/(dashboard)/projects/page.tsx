"use client";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Projects</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Monitor your websites over time.</p>
        </div>
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
          style={{ background: "var(--gradient-primary)" }}
        >
          New Project
        </button>
      </div>
      <div className="rounded-xl" style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}>
        <div className="p-6 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
          No projects yet. Create one to start monitoring.
        </div>
      </div>
    </div>
  );
}
