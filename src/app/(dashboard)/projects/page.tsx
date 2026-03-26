"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectTrendChartLazy } from "@/components/dashboard/project-trend-chart-lazy";
import { PLAN_FEATURES } from "@/lib/plan-limits";

interface Project {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

interface ScanSummary {
  id: string;
  overallScore: number | null;
  createdAt: string;
  status: string;
}

interface ScheduledScan {
  id: string;
  enabled: boolean;
  nextRun: string | null;
}

interface ProjectDetail extends Project {
  scans: ScanSummary[];
  scheduledScans: ScheduledScan[];
}

function parseCsvRows(input: string): Array<{ name?: string; url: string }> {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes("url");
  const rows = hasHeader ? lines.slice(1) : lines;

  return rows
    .map((line) => line.split(",").map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean))
    .map((cells) => {
      if (cells.length === 1) {
        return { url: cells[0] };
      }
      return {
        name: cells[0] || undefined,
        url: cells[1] ?? cells[0],
      };
    })
    .filter((row) => row.url);
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  const canSchedule = PLAN_FEATURES.scheduledRescans(tier);
  const canSeeTrendChart = PLAN_FEATURES.scoreTrendChart(tier);
  const canReceiveAlerts = PLAN_FEATURES.emailAlerts(tier);
  const canBulkUpload = PLAN_FEATURES.bulkScan(tier);

  async function loadProjects() {
    try {
      const [projectsRes, billingRes] = await Promise.all([
        fetch("/api/projects", { cache: "no-store" }),
        fetch("/api/user/billing", { cache: "no-store" }),
      ]);

      const projectsData = await projectsRes.json();
      if (!projectsRes.ok) throw new Error(projectsData.error || "Failed to load projects");
      setProjects(projectsData);

      if (billingRes.ok) {
        const billingData = await billingRes.json();
        setTier(billingData.tier || "free");
      }

      setSelectedProjectId((current) => current ?? projectsData[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectDetail(projectId: string) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load project");
      setSelectedProject(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load project");
      setSelectedProject(null);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setSelectedProject(null);
      return;
    }
    void loadProjectDetail(selectedProjectId);
  }, [selectedProjectId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), url: newUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      setProjects((prev) => [data, ...prev]);
      setSelectedProjectId(data.id);
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
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      const nextProjects = projects.filter((project) => project.id !== id);
      setProjects(nextProjects);
      setSelectedProjectId((current) =>
        current === id ? nextProjects[0]?.id ?? null : current
      );
    } catch {
      setError("Failed to delete project");
    }
  }

  async function handleScheduleToggle(enabled: boolean) {
    if (!selectedProject) return;
    setScheduleSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/schedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update schedule");
      setSelectedProject((current) =>
        current
          ? {
              ...current,
              scheduledScans: data.id ? [data] : [],
            }
          : current
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update schedule");
    } finally {
      setScheduleSaving(false);
    }
  }

  async function handleBulkFile(file: File) {
    setBulkRunning(true);
    setBulkResult(null);
    setError(null);
    try {
      const text = await file.text();
      const rows = parseCsvRows(text);
      if (rows.length === 0) {
        throw new Error("No valid rows found. Use CSV columns `name,url` or `url`.");
      }

      const res = await fetch("/api/projects/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, runInitialScans: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk upload failed");

      setBulkResult(
        `Processed ${data.processed} rows. Created ${data.created} projects and started ${data.scanned} scans.`
      );
      await loadProjects();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk upload failed");
    } finally {
      setBulkRunning(false);
    }
  }

  const chartPoints = useMemo(() => {
    if (!selectedProject) return [];
    return [...selectedProject.scans]
      .filter((scan) => typeof scan.overallScore === "number")
      .reverse()
      .map((scan) => ({
        date: new Date(scan.createdAt).toLocaleDateString(),
        score: scan.overallScore as number,
      }));
  }, [selectedProject]);

  const schedule = selectedProject?.scheduledScans[0] ?? null;

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="section-label">Monitoring</span>
          <h1 className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Projects
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Track site history, monitor trend lines, and automate rescans.
          </p>
        </div>
        <button
          onClick={() => setShowForm((value) => !value)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
          style={{ background: "var(--gradient-primary)", boxShadow: "0 2px 12px rgba(108,59,255,0.3)" }}
        >
          + New Project
        </button>
      </div>

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
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--surface-base)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            />
            <input
              type="text"
              placeholder="https://example.com"
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

      {canBulkUpload && (
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                Agency bulk scan
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                Upload a CSV with `name,url` or just `url` to create projects and launch initial scans.
              </p>
            </div>
            <label
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white cursor-pointer"
              style={{ background: "var(--brand-red)" }}
            >
              {bulkRunning ? "Processing…" : "Upload CSV"}
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                disabled={bulkRunning}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleBulkFile(file);
                  }
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>
          {bulkResult && (
            <p className="mt-3 text-sm" style={{ color: "var(--success-400)" }}>
              {bulkResult}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm px-1" style={{ color: "var(--error-400)" }}>{error}</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
        >
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>Loading projects…</div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>No projects yet</p>
              <p className="text-xs mt-1.5 max-w-xs" style={{ color: "var(--text-tertiary)" }}>
                Create a project to start building score history and scheduled monitoring.
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
                Your projects
              </div>
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className="w-full px-5 py-4 text-left transition-colors"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    background:
                      selectedProjectId === project.id
                        ? "rgba(108,59,255,0.08)"
                        : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>{project.name}</p>
                      <p className="mt-1 truncate text-xs" style={{ color: "var(--cyan-400)", fontFamily: "var(--font-mono)" }}>{project.url}</p>
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="space-y-5">
          {detailLoading ? (
            <div className="rounded-xl p-8 text-center text-sm" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
              Loading project details…
            </div>
          ) : !selectedProject ? (
            <div className="rounded-xl p-8 text-center text-sm" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
              Select a project to view its scan history and monitoring controls.
            </div>
          ) : (
            <>
              <div className="rounded-xl p-5" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                      {selectedProject.name}
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: "var(--cyan-400)", fontFamily: "var(--font-mono)" }}>
                      {selectedProject.url}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleDelete(selectedProject.id)}
                      className="rounded-lg px-3 py-2 text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>History</p>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                      {selectedProject.scans.length}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>Recent scans stored</p>
                  </div>
                  <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>Scheduled re-scan</p>
                    {canSchedule ? (
                      <>
                        <p className="mt-2 text-sm font-semibold" style={{ color: schedule?.enabled ? "var(--success-400)" : "var(--text-primary)" }}>
                          {schedule?.enabled ? "Weekly monitoring on" : "Weekly monitoring off"}
                        </p>
                        <button
                          type="button"
                          disabled={scheduleSaving}
                          onClick={() => void handleScheduleToggle(!schedule?.enabled)}
                          className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold text-white"
                          style={{ background: "var(--brand-red)" }}
                        >
                          {scheduleSaving
                            ? "Saving…"
                            : schedule?.enabled
                            ? "Disable rescans"
                            : "Enable rescans"}
                        </button>
                      </>
                    ) : (
                      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        Upgrade to Monitor to enable scheduled rescans.
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>Email alerts</p>
                    {canReceiveAlerts ? (
                      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        Alert and Scale projects receive an email if a scheduled scan drops by 5+ points.
                      </p>
                    ) : (
                      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        Upgrade to Growth to receive automatic score-drop alerts.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-5" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                      Score trend
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                      Visual history of this project&apos;s AI visibility score.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {canSeeTrendChart ? (
                    <ProjectTrendChartLazy points={chartPoints} />
                  ) : (
                    <div className="rounded-xl p-6 text-sm" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                      Upgrade to Monitor to unlock the score trend chart.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}>
                <div className="px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}>
                  Recent scans
                </div>
                {selectedProject.scans.length === 0 ? (
                  <div className="p-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
                    No scans recorded for this project yet.
                  </div>
                ) : (
                  selectedProject.scans.map((scan) => (
                    <div
                      key={scan.id}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-sm"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        {new Date(scan.createdAt).toLocaleString()}
                      </span>
                      <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                        {scan.overallScore ?? "—"}
                      </span>
                      <span style={{ color: "var(--text-tertiary)" }}>{scan.status}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
