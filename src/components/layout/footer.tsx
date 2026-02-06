import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#0A1628]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E5C8A]">
                <span className="text-sm font-bold text-white">AO</span>
              </div>
              <span className="text-lg font-bold text-white">AgentOptimize</span>
            </div>
            <p className="mt-4 text-sm text-[#4A7DAC]">
              SEO was for Google. AgentOptimize is for the agent economy.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/pricing" className="text-sm text-[#4A7DAC] hover:text-[#00D9FF] transition-colors">Pricing</Link></li>
              <li><Link href="/#features" className="text-sm text-[#4A7DAC] hover:text-[#00D9FF] transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/blog" className="text-sm text-[#4A7DAC] hover:text-[#00D9FF] transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="text-sm text-[#4A7DAC] hover:text-[#00D9FF] transition-colors">Docs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-[#4A7DAC] hover:text-[#00D9FF] transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-[#4A7DAC] hover:text-[#00D9FF] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[#1E3A5F] pt-8">
          <p className="text-center text-sm text-[#4A7DAC]">&copy; 2026 AgentOptimize. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
