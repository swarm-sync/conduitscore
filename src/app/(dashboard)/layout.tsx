import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <aside className="hidden w-64 border-r border-[#E5E7EB] bg-white lg:block">
        <div className="flex h-16 items-center border-b border-[#E5E7EB] px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E5C8A]">
              <span className="text-sm font-bold text-white">AO</span>
            </div>
            <span className="text-lg font-bold text-[#0A1628]">AgentOptimize</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#0A1628] hover:bg-[#F9FAFB] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/scans"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#475569] hover:bg-[#F9FAFB] transition-colors"
          >
            Scan History
          </Link>
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#475569] hover:bg-[#F9FAFB] transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#475569] hover:bg-[#F9FAFB] transition-colors"
          >
            Settings
          </Link>
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
          <h2 className="text-lg font-semibold text-[#0A1628]">Dashboard</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
