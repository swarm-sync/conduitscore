import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E5C8A]">
            <span className="text-sm font-bold text-white">AO</span>
          </div>
          <span className="text-lg font-bold text-[#0A1628]">AgentOptimize</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/pricing" className="text-sm text-[#475569] hover:text-[#2E5C8A] transition-colors">
            Pricing
          </Link>
          <Link href="/signin" className="text-sm text-[#475569] hover:text-[#2E5C8A] transition-colors">
            Sign In
          </Link>
          <Link href="/pricing" className="rounded-lg bg-[#2E5C8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3A5F] transition-colors">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
