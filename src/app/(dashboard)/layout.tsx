import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "@/components/layout/user-menu";

export const dynamic = "force-dynamic";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/scans",
    label: "Scan History",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v3.5l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.5 1.5H13A1.5 1.5 0 0 1 14.5 6v6A1.5 1.5 0 0 1 13 13.5H3.5A1.5 1.5 0 0 1 2 12V4.5z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/settings/billing",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.5v1.25M8 13.25V14.5M1.5 8h1.25M13.25 8H14.5M3.41 3.41l.884.884M11.706 11.706l.884.884M3.41 12.59l.884-.884M11.706 4.294l.884-.884" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--surface-base)" }}
    >
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0"
        style={{
          background: "var(--surface-raised)",
          borderRight: "1px solid var(--border-subtle)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
        aria-label="Dashboard navigation"
      >
        {/* Logo */}
        <div
          className="flex h-[60px] items-center px-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <Link href="/" aria-label="ConduitScore home">
            <Image
              src="/conduitscore_horizontal_logo.svg"
              alt="ConduitScore"
              width={170}
              height={44}
              style={{ display: "block", height: "44px", width: "auto" }}
            />
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
              aria-label={item.label}
            >
              <span className="flex-shrink-0" style={{ color: "inherit" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom upgrade nudge */}
        <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div
            className="rounded-lg p-3"
            style={{
              background: "rgba(124,58,237,0.08)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              Free Plan
            </p>
            <p className="text-xs mb-2.5" style={{ color: "var(--text-tertiary)" }}>
              3 scans/month remaining
            </p>
            <Link
              href="/pricing"
              className="block w-full text-center rounded-md py-1.5 text-xs font-semibold transition-all"
              style={{
                background: "var(--gradient-primary)",
                color: "#fff",
                fontFamily: "var(--font-body)",
              }}
            >
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header
          className="flex h-[60px] items-center justify-between px-6"
          style={{
            background: "rgba(18,21,28,0.9)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <div />
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: "rgba(124,58,237,0.1)",
                color: "var(--violet-300)",
                border: "1px solid var(--border-default)",
                fontFamily: "var(--font-body)",
              }}
            >
              Upgrade Plan
            </Link>
            <UserMenu />
          </div>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
