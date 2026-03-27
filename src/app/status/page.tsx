import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "System Status — ConduitScore",
  description: "Current operational status of ConduitScore services including the scanner, API, and website.",
  alternates: {
    canonical: `${SITE_URL}/status`,
  },
  robots: {
    index: false,
  },
};

const services = [
  { name: "Scanner", description: "AI visibility scan engine" },
  { name: "Website", description: "conduitscore.com" },
  { name: "API", description: "Public scan API" },
  { name: "Dashboard", description: "User dashboard and reports" },
  { name: "Email", description: "Report delivery and notifications" },
];

export default function StatusPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: "var(--surface-base)", minHeight: "80vh" }}>
        <section
          className="hero-grid"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "96px",
            paddingBottom: "72px",
          }}
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex items-center gap-2 text-xs" aria-label="Breadcrumb">
              <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Status</span>
            </nav>
            <span className="section-label mb-4 block">System Status</span>
            <h1 className="gradient-text">All Systems Operational</h1>
            <p
              className="mt-4 text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              All ConduitScore services are running normally.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(0,229,160,0.06)",
              border: "1px solid rgba(0,229,160,0.20)",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#00E5A0",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#00E5A0", fontWeight: 600, fontSize: "14px" }}>
              All systems operational
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {services.map((service) => (
              <div
                key={service.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <p style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "14px", margin: 0 }}>
                    {service.name}
                  </p>
                  <p style={{ color: "var(--text-tertiary)", fontSize: "12px", margin: "2px 0 0" }}>
                    {service.description}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#00E5A0",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#00E5A0", fontSize: "13px", fontWeight: 500 }}>
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: "13px",
              marginTop: "32px",
            }}
          >
            Experiencing an issue?{" "}
            <Link
              href="/contact"
              style={{ color: "var(--brand-cyan)", textDecoration: "none" }}
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
