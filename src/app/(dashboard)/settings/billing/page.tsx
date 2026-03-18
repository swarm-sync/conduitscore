"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PLAN_FEATURES, PLAN_LIMITS } from "@/lib/plan-limits";

type ApiKeyRecord = {
  id: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
};

type CreatedApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
};

const PLAN_DETAILS: Record<string, { label: string }> = {
  free: { label: "Free" },
  starter: { label: "Starter" },
  pro: { label: "Pro" },
  growth: { label: "Growth" },
  agency: { label: "Agency" },
};

const FEATURE_ROWS = [
  {
    name: "AI visibility score",
    value: () => "Included",
  },
  {
    name: "Code fixes unlocked",
    value: (tier: string) => (PLAN_FEATURES.unlockedFixes(tier) ? "Full access" : "1 sample"),
  },
  {
    name: "Issue descriptions",
    value: (tier: string) => (PLAN_FEATURES.issueDescriptions(tier) ? "Full descriptions" : "Titles only"),
  },
  {
    name: "Dashboard & history",
    value: (tier: string) => (PLAN_FEATURES.dashboardHistory(tier) ? "Included" : "Not included"),
  },
  {
    name: "Score trend chart",
    value: (tier: string) => (PLAN_FEATURES.scoreTrendChart(tier) ? "Included" : "Growth+"),
  },
  {
    name: "Scheduled re-scans",
    value: (tier: string) => (PLAN_FEATURES.scheduledRescans(tier) ? "Included" : "Pro+"),
  },
  {
    name: "Email alerts",
    value: (tier: string) => (PLAN_FEATURES.emailAlerts(tier) ? "Included" : "Growth+"),
  },
  {
    name: "Bulk scan",
    value: (tier: string) => (PLAN_FEATURES.bulkScan(tier) ? "CSV upload" : "Agency"),
  },
  {
    name: "REST API access",
    value: (tier: string) => (PLAN_FEATURES.restApi(tier) ? "Included" : "Agency"),
  },
] as const;

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [tier, setTier] = useState("free");
  const [scanCount, setScanCount] = useState(0);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [apiKeyName, setApiKeyName] = useState("");
  const [newApiKey, setNewApiKey] = useState<CreatedApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [keysLoading, setKeysLoading] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const limits = PLAN_LIMITS[tier] ?? PLAN_LIMITS.free;
  const plan = PLAN_DETAILS[tier] || PLAN_DETAILS.free;
  const scanLimit = Number.isFinite(limits.scansPerMonth) ? limits.scansPerMonth : null;
  const usagePct = scanLimit ? Math.min((scanCount / scanLimit) * 100, 100) : 0;
  const isAgency = PLAN_FEATURES.restApi(tier);

  async function loadApiKeys() {
    setKeysLoading(true);
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load API keys");
      setApiKeys(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load API keys");
    } finally {
      setKeysLoading(false);
    }
  }

  useEffect(() => {
    async function fetchBilling() {
      setLoading(true);
      try {
        const res = await fetch("/api/user/billing", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load billing");
        const data = await res.json();
        const nextTier = data.tier || "free";
        setTier(nextTier);
        setScanCount(data.scanCountMonth || 0);

        if (PLAN_FEATURES.restApi(nextTier)) {
          await loadApiKeys();
        } else {
          setApiKeys([]);
        }
      } catch {
        setTier("free");
        setScanCount(0);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      void fetchBilling();
    }
  }, [session]);

  async function handleCreateKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!apiKeyName.trim()) return;

    setCreatingKey(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: apiKeyName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create API key");
      setApiKeyName("");
      setNewApiKey(data);
      await loadApiKeys();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: string) {
    setDeletingKeyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete API key");
      setApiKeys((current) => current.filter((key) => key.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete API key");
    } finally {
      setDeletingKeyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          Billing & Plan
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
          Manage your plan, usage, monitoring access, and API credentials.
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.22)", color: "var(--brand-red)" }}
        >
          {error}
        </div>
      )}

      <div
        className="rounded-xl p-6"
        style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}
      >
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          Current plan
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{ background: "rgba(99,102,241,0.12)", color: "var(--brand-purple)" }}
          >
            {plan.label}
          </span>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {scanLimit ? `${scanLimit} scans/month` : "Unlimited scans/month"}
            {" · "}
            {limits.pagesPerScan === -1 ? "Unlimited pages per scan" : `${limits.pagesPerScan} ${limits.pagesPerScan === 1 ? "page" : "pages"} per scan`}
          </span>
        </div>
        <div className="mt-6 flex gap-3">
          <a
            href="/pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
            style={{ background: "var(--gradient-primary)" }}
          >
            {tier === "free" ? "Upgrade Plan" : "Change Plan"}
          </a>
          {tier !== "free" && (
            <button
              onClick={async () => {
                const res = await fetch("/api/stripe/portal");
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
              style={{
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
                background: "transparent",
              }}
            >
              Manage Billing
            </button>
          )}
        </div>
      </div>

      <div
        className="rounded-xl p-6"
        style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}
      >
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          Usage
        </h2>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-tertiary)" }}>Scans this month</span>
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            >
              {scanCount} / {scanLimit ?? "Unlimited"}
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                transformOrigin: "left",
                transform: `scaleX(${usagePct / 100})`,
                background: "var(--brand-purple)",
                willChange: "transform",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}
      >
        <div
          className="grid grid-cols-[minmax(0,1fr)_180px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-widest"
          style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}
        >
          <span>Feature availability</span>
          <span>Your access</span>
        </div>
        {FEATURE_ROWS.map((feature) => (
          <div
            key={feature.name}
            className="grid grid-cols-[minmax(0,1fr)_180px] gap-4 px-5 py-4 text-sm"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span style={{ color: "var(--text-primary)" }}>{feature.name}</span>
            <span style={{ color: "var(--text-secondary)" }}>{feature.value(tier)}</span>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-6"
        style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-raised)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              REST API access
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
              Agency plans can authenticate scans and scan history requests with API keys.
            </p>
          </div>
          <a
            href="/docs"
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
          >
            View API docs
          </a>
        </div>

        {isAgency ? (
          <div className="mt-6 space-y-5">
            {newApiKey && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(217,255,0,0.06)", border: "1px solid rgba(217,255,0,0.18)" }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  New API key created
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Copy this key now. It will not be shown in full again.
                </p>
                <code
                  className="mt-3 block overflow-x-auto rounded-lg px-3 py-3 text-xs"
                  style={{ background: "rgba(0,0,0,0.24)", color: "var(--brand-lime)" }}
                >
                  {newApiKey.key}
                </code>
              </div>
            )}

            <form onSubmit={(event) => void handleCreateKey(event)} className="space-y-3">
              <label className="block text-sm" style={{ color: "var(--text-secondary)" }}>
                API key name
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={apiKeyName}
                  onChange={(event) => setApiKeyName(event.target.value)}
                  placeholder="Production integration"
                  className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--surface-base)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="submit"
                  disabled={creatingKey}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "var(--brand-red)" }}
                >
                  {creatingKey ? "Creating…" : "Create API key"}
                </button>
              </div>
            </form>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="grid grid-cols-[minmax(0,1fr)_160px_160px_auto] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-widest"
                style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}
              >
                <span>Name</span>
                <span>Created</span>
                <span>Last used</span>
                <span />
              </div>
              {keysLoading ? (
                <div className="px-4 py-5 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Loading API keys…
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="px-4 py-5 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  No API keys created yet.
                </div>
              ) : (
                apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="grid grid-cols-[minmax(0,1fr)_160px_160px_auto] gap-4 px-4 py-4 text-sm"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span style={{ color: "var(--text-primary)" }}>{key.name}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{formatDate(key.createdAt)}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{formatDate(key.lastUsed)}</span>
                    <button
                      type="button"
                      onClick={() => void handleDeleteKey(key.id)}
                      disabled={deletingKeyId === key.id}
                      className="rounded-lg px-3 py-2 text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)" }}
                    >
                      {deletingKeyId === key.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Example requests
              </p>
              <pre
                className="overflow-x-auto rounded-xl p-4 text-xs"
                style={{ background: "rgba(0,0,0,0.24)", color: "var(--text-secondary)" }}
              >
                {`curl -X POST https://conduitscore.com/api/scan \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}'

curl https://conduitscore.com/api/scans \\
  -H "x-api-key: YOUR_API_KEY"

curl https://conduitscore.com/api/scans/SCAN_ID \\
  -H "x-api-key: YOUR_API_KEY"`}
              </pre>
            </div>
          </div>
        ) : (
          <div
            className="mt-6 rounded-xl p-5 text-sm"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            Upgrade to Agency to create API keys, run authenticated scans, list scans over the API, and connect ConduitScore to your own tooling.
          </div>
        )}
      </div>

      {loading && (
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Refreshing billing details…
        </p>
      )}
    </div>
  );
}
