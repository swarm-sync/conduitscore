import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const metadata: Metadata = {
  title: "Privacy Policy — ConduitScore",
  description:
    "ConduitScore's Privacy Policy explains how we collect, use, and protect your personal data when you use our AI visibility audit platform.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy — ConduitScore",
    description: "How ConduitScore collects, uses, and protects your data.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
};

const LAST_UPDATED = "March 15, 2026";
const COMPANY = "ConduitScore, Inc.";
const EMAIL = "privacy@conduitscore.com";

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="mt-4 text-base" style={{ color: "var(--text-tertiary)" }}>
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container-wide mx-auto py-16 md:py-20">
          <div className="max-w-3xl prose-legal">
            <LegalSection title="1. Introduction">
              <p>
                {COMPANY} (&ldquo;ConduitScore,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website{" "}
                <Link href="/" style={{ color: "var(--brand-red)" }}>conduitscore.com</Link> and
                the ConduitScore AI visibility audit platform (collectively, the &ldquo;Service&rdquo;). This
                Privacy Policy explains what personal data we collect, why we collect it, how we use
                it, and your rights regarding that data.
              </p>
              <p>
                By using the Service, you agree to the practices described in this Privacy Policy. If
                you do not agree, please discontinue use of the Service.
              </p>
            </LegalSection>

            <LegalSection title="2. Information We Collect">
              <h3>2.1 Information You Provide</h3>
              <ul>
                <li><strong>Account data:</strong> Email address when you register or sign in via magic link or Google OAuth.</li>
                <li><strong>Payment data:</strong> Billing information is processed by Stripe. We do not store full card numbers.</li>
                <li><strong>URLs you scan:</strong> Website URLs you submit for AI visibility audits.</li>
                <li><strong>Support communications:</strong> Any messages you send us.</li>
              </ul>
              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li><strong>Usage data:</strong> Pages visited, features used, scan frequency, and interaction logs.</li>
                <li><strong>Technical data:</strong> IP address, browser type, operating system, referral URLs, and device identifiers.</li>
                <li><strong>Cookies and tracking technologies:</strong> See our <Link href="/cookies" style={{ color: "var(--brand-red)" }}>Cookie Policy</Link>.</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. How We Use Your Information">
              <p>We use your personal data to:</p>
              <ul>
                <li>Provide, operate, and improve the Service</li>
                <li>Process payments and manage your subscription</li>
                <li>Send transactional emails (magic links, receipts, scan notifications)</li>
                <li>Send product updates and marketing communications (with your consent, opt-out available)</li>
                <li>Analyze usage to improve features and performance</li>
                <li>Prevent fraud, abuse, and security incidents</li>
                <li>Comply with legal obligations</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Legal Bases for Processing (GDPR)">
              <p>For users in the European Economic Area, we process data under the following legal bases:</p>
              <ul>
                <li><strong>Contract performance:</strong> To deliver the Service you signed up for.</li>
                <li><strong>Legitimate interests:</strong> Analytics, security, and product improvement.</li>
                <li><strong>Consent:</strong> Marketing emails and non-essential cookies.</li>
                <li><strong>Legal obligation:</strong> Tax, fraud prevention, and regulatory compliance.</li>
              </ul>
            </LegalSection>

            <LegalSection title="5. Sharing Your Information">
              <p>We do not sell your personal data. We may share data with:</p>
              <ul>
                <li><strong>Service providers:</strong> Stripe (payments), Resend (email), Vercel (hosting), Neon (database), Supabase (analytics/state).</li>
                <li><strong>Analytics providers:</strong> Aggregated, de-identified usage data.</li>
                <li><strong>Law enforcement:</strong> When required by applicable law or court order.</li>
                <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or asset sale.</li>
              </ul>
            </LegalSection>

            <LegalSection title="6. Data Retention">
              <p>
                We retain your account data for as long as your account is active or as needed to provide
                the Service. Scan results are retained for 12 months on free plans and 24 months on paid
                plans. You may request deletion at any time by contacting us.
              </p>
            </LegalSection>

            <LegalSection title="7. Your Rights">
              <p>Depending on your location, you may have the right to:</p>
              <ul>
                <li>Access, correct, or delete your personal data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
              <p>
                To exercise these rights, email us at{" "}
                <a href={`mailto:${EMAIL}`} style={{ color: "var(--brand-red)" }}>{EMAIL}</a>.
              </p>
            </LegalSection>

            <LegalSection title="8. Cookies">
              <p>
                We use cookies and similar technologies. See our{" "}
                <Link href="/cookies" style={{ color: "var(--brand-red)" }}>Cookie Policy</Link>{" "}
                for details on what cookies we use and how to control them.
              </p>
            </LegalSection>

            <LegalSection title="9. Security">
              <p>
                We implement industry-standard security measures including HTTPS encryption, AES-256
                encryption for sensitive vault data, and regular security reviews. However, no method
                of transmission over the Internet is 100% secure.
              </p>
            </LegalSection>

            <LegalSection title="10. Children's Privacy">
              <p>
                The Service is not directed to children under 13. We do not knowingly collect personal
                data from children. If you believe a child has provided us data, please contact us
                immediately.
              </p>
            </LegalSection>

            <LegalSection title="11. International Transfers">
              <p>
                Your data may be transferred to and processed in countries other than your own. When
                transferring data from the EEA, we use Standard Contractual Clauses or other approved
                mechanisms.
              </p>
            </LegalSection>

            <LegalSection title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material
                changes by email or by posting a notice on the Service. Continued use after the
                effective date constitutes acceptance of the revised policy.
              </p>
            </LegalSection>

            <LegalSection title="13. Contact Us">
              <p>
                For privacy-related questions, contact us at:
              </p>
              <address style={{ fontStyle: "normal" }}>
                {COMPANY}<br />
                <a href={`mailto:${EMAIL}`} style={{ color: "var(--brand-red)" }}>{EMAIL}</a>
              </address>
            </LegalSection>

            <div
              className="mt-12 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Have a privacy question?
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Email us at{" "}
                  <a href={`mailto:${EMAIL}`} style={{ color: "var(--brand-red)" }}>{EMAIL}</a>
                  {" "}and we&apos;ll respond within 48 hours.
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
