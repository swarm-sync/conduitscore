"use client";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]">Billing & Plan</h1>
        <p className="mt-1 text-sm text-[#475569]">Manage your subscription and billing details.</p>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0A1628]">Current Plan</h2>
        <div className="mt-4 flex items-center gap-4">
          <span className="inline-flex items-center rounded-full bg-[#2E5C8A]/10 px-3 py-1 text-sm font-medium text-[#2E5C8A]">
            Free
          </span>
          <span className="text-sm text-[#475569]">3 scans/month, 1 page per scan</span>
        </div>
        <div className="mt-6 flex gap-3">
          <a href="/pricing" className="rounded-lg bg-[#2E5C8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3A5F] transition-colors">
            Upgrade Plan
          </a>
          <button
            onClick={async () => {
              const res = await fetch("/api/stripe/portal");
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#0A1628] hover:bg-[#F9FAFB] transition-colors"
          >
            Manage Billing
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0A1628]">Usage</h2>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#475569]">Scans this month</span>
            <span className="font-medium text-[#0A1628]">0 / 3</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[#E5E7EB]">
            <div className="h-2 rounded-full bg-[#2E5C8A]" style={{ width: "0%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
