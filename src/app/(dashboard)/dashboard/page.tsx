export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]">Welcome to AgentOptimize</h1>
        <p className="mt-1 text-sm text-[#475569]">Check how AI agents see your website.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <p className="text-sm text-[#475569]">Total Scans</p>
          <p className="mt-2 text-3xl font-bold text-[#0A1628]">0</p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <p className="text-sm text-[#475569]">Avg Score</p>
          <p className="mt-2 text-3xl font-bold text-[#0A1628]">--</p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <p className="text-sm text-[#475569]">Issues Fixed</p>
          <p className="mt-2 text-3xl font-bold text-[#0A1628]">0</p>
        </div>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0A1628]">Quick Scan</h2>
        <p className="mt-1 text-sm text-[#475569]">Enter a URL to check its AI visibility score.</p>
        <div className="mt-4 flex gap-3">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-1 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-[#0A1628] placeholder:text-[#475569]/50 focus:border-[#2E5C8A] focus:outline-none focus:ring-2 focus:ring-[#4A7DAC]/20"
          />
          <button className="rounded-lg bg-[#2E5C8A] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1E3A5F] transition-colors">
            Scan
          </button>
        </div>
      </div>
    </div>
  );
}
