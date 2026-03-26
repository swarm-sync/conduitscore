import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "Terms of Service — ConduitScore",
  description:
    "ConduitScore's Terms of Service govern your use of our AI visibility audit platform. Please read them carefully before using the Service.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: "Terms of Service — ConduitScore",
    description: "The terms that govern your use of ConduitScore.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

const LAST_UPDATED = "March 15, 2026";
const COMPANY = "ConduitScore, Inc.";
const EMAIL = "legal@conduitscore.com";

export default function TermsPage() {
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
                Terms of Service
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
            <LegalSection title="1. Acceptance of Terms">
              <p>
                By accessing or using the ConduitScore platform (the &ldquo;Service&rdquo;) operated by{" "}
                {COMPANY} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service
                (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Service.
              </p>
            </LegalSection>

            <LegalSection title="2. Description of Service">
              <p>
                ConduitScore provides an AI visibility audit platform that analyzes websites for
                discoverability by AI agents, answer engines, and machine crawlers. Features include
                spectral audits, score tracking, fix recommendations, and reporting tools.
              </p>
            </LegalSection>

            <LegalSection title="3. Accounts and Registration">
              <ul>
                <li>You must provide a valid email address to create an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must be at least 13 years old (or the age of digital consent in your jurisdiction) to use the Service.</li>
                <li>One person or entity may not maintain more than one free account.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Acceptable Use">
              <p>You agree not to:</p>
              <ul>
                <li>Submit URLs you do not own or have authorization to scan</li>
                <li>Use the Service to scan websites for malicious purposes</li>
                <li>Attempt to reverse-engineer, decompile, or extract the source code of the Service</li>
                <li>Use automated means to access the Service beyond the provided API</li>
                <li>Resell or redistribute the Service without written permission</li>
                <li>Violate any applicable law or regulation</li>
              </ul>
            </LegalSection>

            <LegalSection title="5. Subscription Plans and Billing">
              <ul>
                <li><strong>Free Plan:</strong> 3 scans per month, no credit card required.</li>
                <li><strong>Paid Plans:</strong> Billed monthly or annually via Stripe. Prices are shown on the <Link href="/pricing" style={{ color: "var(--brand-red)" }}>Pricing</Link> page.</li>
                <li><strong>Upgrades/Downgrades:</strong> Take effect at the start of the next billing cycle.</li>
                <li><strong>Refunds:</strong> We offer a 7-day refund for new paid subscriptions. Contact us at {EMAIL}.</li>
                <li><strong>Failed payments:</strong> If a payment fails, the account will be downgraded to the free tier after a grace period.</li>
              </ul>
            </LegalSection>

            <LegalSection title="6. Intellectual Property">
              <p>
                All content, features, and functionality of the Service (including but not limited to
                the ConduitScore brand, algorithms, and reports) are owned by {COMPANY} and are
                protected by intellectual property laws.
              </p>
              <p>
                Scan results and reports generated for your websites are yours to use for your own
                business purposes.
              </p>
            </LegalSection>

            <LegalSection title="7. Privacy">
              <p>
                Your use of the Service is subject to our{" "}
                <Link href="/privacy" style={{ color: "var(--brand-red)" }}>Privacy Policy</Link>,
                which is incorporated into these Terms.
              </p>
            </LegalSection>

            <LegalSection title="8. Third-Party Services">
              <p>
                The Service integrates with third-party services (including Stripe for payments, Google
                for OAuth, and Resend for email). Your use of those services is governed by their
                respective terms of service.
              </p>
            </LegalSection>

            <LegalSection title="9. Disclaimers">
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE
                THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT AI VISIBILITY SCORES
                WILL RESULT IN IMPROVED RANKINGS OR CITATIONS IN AI SYSTEMS.
              </p>
            </LegalSection>

            <LegalSection title="10. Limitation of Liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, {COMPANY.toUpperCase()} SHALL NOT BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU
                PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </LegalSection>

            <LegalSection title="11. Indemnification">
              <p>
                You agree to indemnify and hold harmless {COMPANY} and its officers, directors,
                employees, and agents from any claims, damages, or expenses arising from your use of
                the Service or violation of these Terms.
              </p>
            </LegalSection>

            <LegalSection title="12. Termination">
              <p>
                We may suspend or terminate your account at any time for violation of these Terms.
                You may cancel your account at any time from your account settings. Upon termination,
                your right to use the Service ceases immediately.
              </p>
            </LegalSection>

            <LegalSection title="13. Changes to Terms">
              <p>
                We may revise these Terms at any time. We will provide notice of material changes via
                email or prominent notice on the Service. Continued use after the effective date
                constitutes acceptance.
              </p>
            </LegalSection>

            <LegalSection title="14. Governing Law">
              <p>
                These Terms are governed by the laws of the State of Delaware, United States, without
                regard to conflict of law principles. Disputes shall be resolved in the courts of
                Delaware.
              </p>
            </LegalSection>

            <LegalSection title="15. Contact">
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
                  Questions about our Terms?
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Email{" "}
                  <a href={`mailto:${EMAIL}`} style={{ color: "var(--brand-red)" }}>{EMAIL}</a>
                  {" "}and we&apos;ll respond within 2 business days.
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
