import Link from "next/link";
import Image from "next/image";

const BRAND_LOGO_SRC = "/web-app-manifest-512x512%20-%20Edited.png";
const BRAND_LOGO_FILTER =
  "brightness(1.5) saturate(1.28) contrast(1.18) drop-shadow(0 0 18px rgba(255, 45, 85, 0.36))";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer
      style={{
        background: "var(--surface-raised)",
        borderTop: "1px solid var(--border-subtle)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle glow at top */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,45,85,0.45), rgba(99,102,241,0.4), transparent)",
          pointerEvents: "none",
        }}
      />

      <div className="container-wide mx-auto py-16">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="group inline-flex items-center" aria-label="ConduitScore home">
              <span
                className="relative block overflow-hidden transition-opacity duration-200 group-hover:opacity-80"
                style={{ width: "96px", height: "96px" }}
              >
                <Image
                  src={BRAND_LOGO_SRC}
                  alt="ConduitScore"
                  fill
                  sizes="96px"
                  style={{ objectFit: "contain", transform: "scale(1.9)", filter: BRAND_LOGO_FILTER }}
                />
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-tertiary)", maxWidth: "210px" }}>
              AI visibility scoring for the agent economy.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href="https://twitter.com/conduitscore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="footer-social-link flex h-8 w-8 items-center justify-center rounded-md"
                style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/conduitscore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="footer-social-link flex h-8 w-8 items-center justify-center rounded-md"
                style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="https://github.com/conduitscore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="footer-social-link flex h-8 w-8 items-center justify-center rounded-md"
                style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product column */}
          <div>
            <h3 className="section-label mb-4">Product</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Run a Scan", href: "/#scan" },
                { label: "Pricing", href: "/pricing" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="section-label mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Documentation", href: "/docs" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
                { label: "Status", href: "https://status.conduitscore.com" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="section-label mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            &copy; {currentYear} ConduitScore, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="beacon relative inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--brand-lime)" }}
              aria-hidden="true"
            />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Conduit scans operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
