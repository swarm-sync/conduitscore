"use client";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">Projects</h1>
          <p className="mt-1 text-sm text-[#475569]">Monitor your websites over time.</p>
        </div>
        <button className="rounded-lg bg-[#2E5C8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3A5F] transition-colors">
          New Project
        </button>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white">
        <div className="p-6 text-center text-sm text-[#475569]">
          No projects yet. Create one to start monitoring.
        </div>
      </div>
    </div>
  );
}
