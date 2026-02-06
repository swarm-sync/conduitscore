export default function ScansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]">Scan History</h1>
        <p className="mt-1 text-sm text-[#475569]">View all your previous scans.</p>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white">
        <div className="p-6 text-center text-sm text-[#475569]">
          No scans yet. Run your first scan from the dashboard.
        </div>
      </div>
    </div>
  );
}
