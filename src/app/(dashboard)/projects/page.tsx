"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadProjects(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), url: newUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      setProjects((prev) => [data, ...prev]);
      setNewName("");
      setNewUrl("");
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete project");
    }
  }

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="section-label">Monitoring</span>
          <h1 className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Projects
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Track websites over time with weekly auto-rescans.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
          style={{ background: "var(--gradient-primary)", boxShadow: "0 2px 12px rgba(108,59,255,0.3)" }}
        >
          + New Project
        </button>
      </div>

      {/* New project form */}
      {showForm && (
        <form
          onSubmit={(e) => void handleCreate(e)}
          className="rounded-xl p-5 space-y-3"
          style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-default)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            New Project
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Project name (e.g. My Blog)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--surface-base)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
            <input
              type="text"
              placeholder="URL (e.g. myblog.com)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--surface-base)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: saving ? "rgba(108,59,255,0.5)" : "var(--gradient-primary)" }}
            >
              {saving ? "Creating…" : "Create Project"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="text-sm px-1" style={{ color: "var(--error-400)" }}>{error}</p>
      )}

      {/* Projects list */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(108,59,255,0.08)", border: "1px solid rgba(108,59,255,0.18)" }} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="var(--violet-400)" strokeWidth="1.5" />
                <path d="M6 10h8M6 13h5" stroke="var(--violet-400)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>No projects yet</p>
            <p className="text-xs mt-1.5 max-w-xs" style={{ color: "var(--text-tertiary)" }}>
              Create a project to track a website&apos;s AI visibility score over time with weekly auto-rescans.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
              <span>Project</span><span>URL</span><span>Created</span><span />
            </div>
            {projects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 items-center px-5 py-4 text-sm"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)", color: "var(--text-secondary)" }}
              >
                <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{project.name}</span>
                <span className="truncate" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--cyan-400)" }}>
                  {project.url}
                </span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/scan-result?url=${encodeURIComponent(project.url)}`}
                    className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                    style={{ background: "rgba(108,59,255,0.12)", color: "var(--violet-400)", border: "1px solid rgba(108,59,255,0.2)" }}
                  >
                    Scan
                  </Link>
                  <button
                    onClick={() => void handleDelete(project.id)}
                    className="rounded-md p-1 transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Delete project"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5L11 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
