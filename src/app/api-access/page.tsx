import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "ConduitScore API Access",
  description:
    "Learn what ConduitScore's API is for, what Scale customers receive, and how API keys unlock programmatic scans and score lookups.",
  alternates: {
    canonical: `${SITE_URL}/api-access`,
  },
  openGraph: {
    title: "ConduitScore API Access",
    description:
      "A public overview of ConduitScore's API for agencies, automation-heavy teams, and Scale customers.",
    url: `${SITE_URL}/api-access`,
    type: "website",
  },
};

const useCases = [
  "Run scans automatically from your own dashboard or workflow.",
  "Check prospect sites before outreach and personalize recommendations.",
  "Pull ConduitScore results into internal reporting for many client sites.",
  "Monitor domains over time without manually opening the ConduitScore app.",
];

const overviewRows = [
  ["Who gets access", "Scale customers"],
  ["How access works", "API key issued inside Billing"],
  ["Public endpoint", "GET /api/public/domain/{domain}/score"],
  ["Scale endpoints", "Authenticated scan and scan history endpoints"],
  ["What customers do not get", "Source code, database access, or internal systems"],
];

export default function ApiAccessPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b py-20" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto px-6 md:px-0">
            <span className="section-label">Scale API</span>
            <h1 className="mt-4 uppercase">ConduitScore API access, explained simply</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              ConduitScore&apos;s API lets another piece of software use the scoring engine automatically. Scale customers
              receive an API key they can use to run scans, fetch scan history, and connect ConduitScore to their own
              dashboards or workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all"
                style={{
                  background: "var(--brand-red)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                View Scale pricing
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all"
                style={{
                  border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Read product docs
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <span className="section-label">What it means</span>
              <h2 className="mt-4 uppercase">Customers get controlled access, not your backend</h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Scale customers do not receive ConduitScore&apos;s code or infrastructure. They receive an API key. That key
                authorizes specific API requests so their own software can send domains to ConduitScore and get structured
                results back.{" "}
                <Link href="/what-conduit-checks" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                  See every check the API runs across 7 categories
                </Link>.
              </p>
            </div>
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
            >
              {overviewRows.map(([label, value], index) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
                  style={{ borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span style={{ color: "var(--text-primary)" }}>{label}</span>
                  <span style={{ color: "var(--text-secondary)", textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <span className="section-label">Use cases</span>
              <h2 className="mt-4 uppercase">Why customers would want it</h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                API access matters when ConduitScore needs to fit into a workflow, not just be used manually in the browser.{" "}
                <Link href="/use-cases/agencies" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                  See how agencies scale audits across client portfolios
                </Link>.
              </p>
            </div>
            <div className="space-y-3">
              {useCases.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] px-5 py-4 text-sm"
                  style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <span className="section-label">Public example</span>
              <h2 className="mt-4 uppercase">One endpoint anyone can understand</h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                ConduitScore also exposes a simple public score lookup endpoint. This shows what the API returns, while
                keeping Scale-only authenticated access behind API keys. The score reflects signals like{" "}
                <Link href="/blog/structured-data-for-ai" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>
                  structured data
                </Link>{" "}
                and crawler access — see <Link href="/methodology" style={{ color: "var(--brand-cyan)", textDecoration: "none" }}>our methodology</Link> for the full breakdown.
              </p>
            </div>
            <div className="space-y-4">
              <div
                className="rounded-[24px] p-6"
                style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Public endpoint
                </p>
                <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <code>GET /api/public/domain/{"{domain}"}/score</code>
                </p>
              </div>
              <pre
                className="overflow-x-auto rounded-[24px] p-6 text-xs leading-relaxed"
                style={{ background: "rgba(5,10,18,0.92)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
              >
{`curl "https://conduitscore.com/api/public/domain/example.com/score"

{
  "domain": "example.com",
  "score": 67,
  "grade": "B",
  "scanned_at": "2026-03-26T00:00:00.000Z"
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="border-t py-16" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="container-base mx-auto grid gap-10 px-6 md:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <span className="section-label">Full docs</span>
              <h2 className="mt-4 uppercase">Where Scale customers get the real integration details</h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                The public page explains what the API is and why it exists. Scale customers get API keys from Billing, plus
                the authenticated examples and operational details they need to actually connect their systems.
              </p>
            </div>
            <div
              className="rounded-[24px] p-6"
              style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Scale flow
              </p>
              <ol className="mt-4 space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li>1. Upgrade to Scale.</li>
                <li>2. Open Billing and create an API key.</li>
                <li>3. Use that key to authenticate your scan requests.</li>
                <li>4. Manage keys and examples from inside the app.</li>
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: "var(--brand-red)", color: "var(--text-primary)", textDecoration: "none" }}
                >
                  See Scale plan
                </Link>
                <Link
                  href="/settings/billing"
                  className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                  style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)", textDecoration: "none" }}
                >
                  Existing customer? Open Billing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
