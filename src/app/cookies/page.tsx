import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "Cookie Policy — ConduitScore",
  description:
    "ConduitScore's Cookie Policy explains the cookies and tracking technologies we use and how you can control them.",
  alternates: { canonical: `${SITE_URL}/cookies` },
  openGraph: {
    title: "Cookie Policy — ConduitScore",
    description: "How ConduitScore uses cookies and how to control them.",
    url: `${SITE_URL}/cookies`,
    type: "website",
  },
};

const LAST_UPDATED = "March 23, 2026";
const EMAIL = "privacy@conduitscore.com";

const cookies = [
  {
    name: "next-auth.session-token",
    type: "Essential",
    purpose: "Maintains your authenticated session so you stay signed in.",
    duration: "30 days",
  },
  {
    name: "next-auth.csrf-token",
    type: "Essential",
    purpose: "Prevents cross-site request forgery attacks.",
    duration: "Session",
  },
  {
    name: "__stripe_mid / __stripe_sid",
    type: "Functional",
    purpose: "Stripe payment fraud prevention and session tracking.",
    duration: "1 year / 30 min",
  },
  {
    name: "_vercel_no_cache",
    type: "Performance",
    purpose: "Controls Vercel edge caching behavior.",
    duration: "Session",
  },
  {
    name: "conduitscore_prefs",
    type: "Functional",
    purpose: "Stores your UI preferences (e.g. theme, table column settings).",
    duration: "1 year",
  },
  {
    name: "_ga",
    type: "Performance",
    purpose:
      "Google Analytics 4 — distinguishes visitors and powers product analytics (including scan success/failure summaries with category labels such as plan limit, API error, or network).",
    duration: "2 years",
  },
  {
    name: "_ga_*",
    type: "Performance",
    purpose: "Google Analytics 4 — session state for measurement (pattern matches GA4 cookie names on your domain).",
    duration: "2 years",
  },
];

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-18"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="container-wide mx-auto py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="section-label">Legal</span>
              <h1
                className="mt-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
              >
                Cookie Policy
              </h1>
              <p className="mt-4 text-base" style={{ color: "var(--text-tertiary)" }}>
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container-wide mx-auto py-16 md:py-20">
          <div className="max-w-3xl">
            <LegalSection title="1. What Are Cookies?">
              <p>
                Cookies are small text files stored on your device when you visit a website. They help
                websites remember information about your visit, making it easier to use the site on
                subsequent visits and making the site more useful to you.
              </p>
            </LegalSection>

            <LegalSection title="2. How We Use Cookies">
              <p>ConduitScore uses cookies to:</p>
              <ul>
                <li>Keep you signed in across sessions (essential)</li>
                <li>Prevent security attacks (essential)</li>
                <li>Process payments via Stripe (functional)</li>
                <li>Remember your preferences (functional)</li>
                <li>Analyze site performance (performance)</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Types of Cookies We Use">
              <p className="mb-5">The table below lists the specific cookies used on conduitscore.com:</p>
              {/* Cookie table */}
              <div
                className="overflow-x-auto rounded-xl"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-raised)", borderBottom: "1px solid var(--border-subtle)" }}>
                      {["Name", "Type", "Purpose", "Duration"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left font-semibold"
                          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cookies.map((c, i) => (
                      <tr
                        key={c.name}
                        style={{
                          borderBottom: i < cookies.length - 1 ? "1px solid var(--border-subtle)" : "none",
                          background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                        }}
                      >
                        <td
                          className="px-4 py-3 font-mono"
                          style={{ color: "var(--text-primary)", fontSize: "0.7rem" }}
                        >
                          {c.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              background:
                                c.type === "Essential"
                                  ? "rgba(255,45,85,0.1)"
                                  : c.type === "Functional"
                                  ? "rgba(0,217,255,0.1)"
                                  : "rgba(217,255,0,0.1)",
                              color:
                                c.type === "Essential"
                                  ? "var(--brand-red)"
                                  : c.type === "Functional"
                                  ? "var(--cyan-400)"
                                  : "var(--brand-lime)",
                              border: "1px solid currentColor",
                            }}
                          >
                            {c.type}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                          {c.purpose}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>
                          {c.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </LegalSection>

            <LegalSection title="4. Third-Party Cookies">
              <p>
                Some third-party services embedded in ConduitScore may set their own cookies. These
                include:
              </p>
              <ul>
                <li>
                  <strong>Stripe</strong> — for payment processing. See{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--brand-red)" }}
                  >
                    Stripe&apos;s Privacy Policy
                  </a>.
                </li>
                <li>
                  <strong>Google</strong> — if you use Google OAuth sign-in. See{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--brand-red)" }}
                  >
                    Google&apos;s Privacy Policy
                  </a>.
                </li>
                <li>
                  <strong>Google Analytics 4</strong> — when enabled, measures how the site and scanner are used.
                  See our{" "}
                  <Link href="/privacy#ga4-analytics" style={{ color: "var(--brand-red)" }}>
                    Privacy Policy (Google Analytics 4)
                  </Link>
                  {" "}for scan-related events and failure categories.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="5. Managing Cookies">
              <p>
                You can control and manage cookies in several ways:
              </p>
              <ul>
                <li>
                  <strong>Browser settings:</strong> Most browsers allow you to refuse or delete
                  cookies. Check your browser&apos;s help documentation for instructions.
                </li>
                <li>
                  <strong>Essential cookies:</strong> Cannot be disabled as they are required for the
                  Service to function (e.g., authentication).
                </li>
                <li>
                  <strong>Third-party opt-outs:</strong> Visit the relevant third party&apos;s
                  privacy settings to opt out of their tracking.
                </li>
              </ul>
              <p>
                Note: Disabling cookies may affect the functionality of ConduitScore, particularly
                sign-in and payment features.
              </p>
            </LegalSection>

            <LegalSection title="6. Do Not Track">
              <p>
                Some browsers include a Do Not Track (DNT) signal. We currently do not respond to DNT
                signals as there is no agreed-upon standard for how websites should respond.
              </p>
            </LegalSection>

            <LegalSection title="7. Changes to This Policy">
              <p>
                We may update this Cookie Policy from time to time. Changes will be posted on this
                page with an updated date.
              </p>
            </LegalSection>

            <LegalSection title="8. Contact">
              <p>
                For questions about our use of cookies, contact us at:{" "}
                <a href={`mailto:${EMAIL}`} style={{ color: "var(--brand-red)" }}>{EMAIL}</a>
              </p>
            </LegalSection>

            <div
              className="mt-12 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Questions about cookies?
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Also see our{" "}
                  <Link href="/privacy" style={{ color: "var(--brand-red)" }}>Privacy Policy</Link>
                  {" "}for the full picture on how we handle your data.
                </p>
              </div>
              <Link href="/contact" className="btn btn-secondary btn-sm whitespace-nowrap">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {children}
      </div>
    </div>
  );
}
