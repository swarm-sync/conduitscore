"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthed = status === "authenticated" && !!session?.user;

  const navLinks = isAuthed
    ? [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/pricing", label: "Pricing" },
    ]
    : [
      { href: "/pricing", label: "Pricing" },
      { href: "/signin", label: "Sign In" },
    ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(8, 8, 9, 0.9)"
          : "rgba(8, 8, 9, 0.72)",
        backdropFilter: "blur(22px) saturate(1.4)",
        WebkitBackdropFilter: "blur(22px) saturate(1.4)",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(255, 255, 255, 0.04)",
        boxShadow: scrolled
          ? "0 12px 36px rgba(0,0,0,0.32)"
          : "none",
      }}
    >
      <div className="container-wide mx-auto flex h-[76px] items-center justify-between">

        <Link href="/" className="group inline-flex items-center" aria-label="ConduitScore home">
          {/* B2-B3: LCP image — priority + fetchpriority="high" for fastest load */}
          <Image
            src="/logo-wide.webp"
            alt="ConduitScore"
            width={180}
            height={120}
            priority
            fetchPriority="high"
            className="transition-opacity duration-200 group-hover:opacity-90"
            style={{ objectFit: "contain", mixBlendMode: "screen", width: "160px", height: "auto" }}
          />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors group"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link.label}
              <span
                className="absolute bottom-1 left-3.5 right-3.5 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                style={{
                  background: "var(--brand-red)",
                  transformOrigin: "left",
                }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-md transition-colors"
          style={{
            color: "var(--text-secondary)",
            background: mobileOpen ? "rgba(255,45,85,0.12)" : "transparent",
            border: "1px solid",
            borderColor: mobileOpen ? "var(--border-default)" : "transparent",
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden px-4 pb-5 pt-2 space-y-0.5"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
