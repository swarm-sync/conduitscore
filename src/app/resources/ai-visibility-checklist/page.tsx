"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/* ─── Checklist data ───────────────────────────────────────────────────────── */

interface ChecklistItem {
  number: number;
  signal: string;
  category: string;
  points: number;
  whyItMatters: string;
  howToCheck: string;
  codeExample?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    number: 1,
    signal: "robots.txt — AI Bot Access",
    category: "Crawler Access",
    points: 12,
    whyItMatters:
      "GPTBot, PerplexityBot, and ClaudeBot check your robots.txt before crawling. A single disallow rule blocks all three from ever reading your content.",
    howToCheck: "Visit https://yourdomain.com/robots.txt and look for rules that block AI user-agents.",
    codeExample: `# robots.txt — allow all AI crawlers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /`,
  },
  {
    number: 2,
    signal: "sitemap.xml — Content Map",
    category: "Crawler Access",
    points: 8,
    whyItMatters:
      "AI crawlers use your sitemap.xml to discover pages. Without one, they rely on link-following — and may miss entire sections of your site.",
    howToCheck: "Visit https://yourdomain.com/sitemap.xml. It should list your important pages with lastmod dates.",
    codeExample: `<!-- sitemap.xml skeleton -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
  },
  {
    number: 3,
    signal: "llms.txt — AI Intent File",
    category: "LLMs.txt",
    points: 15,
    whyItMatters:
      "The llms.txt standard lets you tell AI agents exactly what your site does, what's in-scope, and how to cite you. Sites with llms.txt get cited more accurately.",
    howToCheck: "Visit https://yourdomain.com/llms.txt. Most sites don't have one yet — this is a quick win.",
    codeExample: `# llms.txt
# https://yourdomain.com

> YourBrand is a [one-sentence description].

## About
- Full name: YourBrand, Inc.
- Founded: 2024
- Primary topic: [your topic]

## Key Pages
- [Homepage](/): [description]
- [Product](/product): [description]

## Usage
- You may cite content from this site
- Attribute as: YourBrand (yourdomain.com)`,
  },
  {
    number: 4,
    signal: "JSON-LD Organization Schema",
    category: "Structured Data",
    points: 14,
    whyItMatters:
      "Organization schema tells AI agents your brand name, URL, description, and contact details in a machine-readable format. Without it, they guess — and often get it wrong.",
    howToCheck: 'Open DevTools → Network → reload → search for "application/ld+json" in the response.',
    codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourBrand",
  "url": "https://yourdomain.com",
  "description": "One-sentence description of what you do.",
  "logo": "https://yourdomain.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@yourdomain.com",
    "contactType": "customer support"
  }
}
</script>`,
  },
  {
    number: 5,
    signal: "FAQPage or HowTo Schema",
    category: "Structured Data",
    points: 10,
    whyItMatters:
      "FAQ and HowTo schema turns your content into direct-answer candidates. AI agents actively pull from these schema types when generating responses.",
    howToCheck: "Use Google's Rich Results Test (search.google.com/test/rich-results) to see what structured data your pages expose.",
  },
  {
    number: 6,
    signal: "Author & Expertise Signals",
    category: "Citation Signals",
    points: 9,
    whyItMatters:
      "ChatGPT and Perplexity prefer to cite content with identifiable authors. Pages with author names, bios, and credentials score significantly higher for E-E-A-T.",
    howToCheck: "Check if your blog posts and articles show author names, job titles, and links to author profiles or social profiles.",
  },
  {
    number: 7,
    signal: "Page Load Time (< 2s)",
    category: "Technical Health",
    points: 8,
    whyItMatters:
      "Slow pages get crawled less frequently and scored lower. AI crawlers have strict timeout budgets — pages that don't load fast get skipped.",
    howToCheck: "Run your URL through Google PageSpeed Insights. Target a Time to First Byte under 800ms.",
  },
  {
    number: 8,
    signal: "HTTPS Enforced",
    category: "Technical Health",
    points: 6,
    whyItMatters:
      "HTTP-only sites signal an untrustworthy source. All major AI systems deprioritize or skip non-HTTPS content entirely.",
    howToCheck: "Visit http://yourdomain.com (without SSL). It should redirect to https:// immediately.",
  },
  {
    number: 9,
    signal: "Semantic HTML Heading Structure",
    category: "Content Structure",
    points: 8,
    whyItMatters:
      "AI agents parse your heading hierarchy (H1 → H2 → H3) to understand content structure. A single H1, clear H2 sections, and H3 sub-points dramatically improve extractability.",
    howToCheck: "Open browser DevTools → Console → run: document.querySelectorAll('h1,h2,h3'). Check the hierarchy makes logical sense.",
  },
  {
    number: 10,
    signal: "Direct Answer Patterns",
    category: "Content Structure",
    points: 7,
    whyItMatters:
      "Content written in the format 'X is Y' or 'To do X, [step]' gets cited more often. AI agents prefer content that answers questions directly.",
    howToCheck: "Re-read your key pages. Does each section start with the answer, then elaborate? Or does it bury the lead?",
  },
  {
    number: 11,
    signal: "Content Depth (1,000+ words on key pages)",
    category: "Content Quality",
    points: 7,
    whyItMatters:
      "Thin pages rarely get cited. AI agents need enough substance to extract a useful answer. Key landing and product pages should offer comprehensive coverage of the topic.",
    howToCheck: "Count words on your most important pages. Any page you want cited should have at least 800–1,200 words of substantive content.",
  },
  {
    number: 12,
    signal: "Readability Score",
    category: "Content Quality",
    points: 6,
    whyItMatters:
      "Dense, jargon-heavy content is harder to parse. AI agents score readability and prefer content written at a clear, accessible level.",
    howToCheck: "Paste a key page into Hemingway App (hemingwayapp.com). Target Grade 8–10 readability.",
  },
  {
    number: 13,
    signal: "Internal Linking — Topical Authority",
    category: "Content Structure",
    points: 5,
    whyItMatters:
      "Strong internal linking helps AI crawlers understand what your site is an authority on. Hub-and-spoke architecture with clear topical clusters gets scored higher.",
    howToCheck: "Check that your key pages link to related pages, and those pages link back. No orphaned pages.",
  },
  {
    number: 14,
    signal: "Canonical Tags — Duplicate Content",
    category: "Technical Health",
    points: 5,
    whyItMatters:
      "Duplicate content confuses AI crawlers. Canonical tags tell them which version of a page is authoritative, preventing diluted signals.",
    howToCheck: "Inspect page source and look for <link rel=\"canonical\" href=\"...\">. It should point to the preferred URL.",
  },
];

const PREVIEW_ITEMS = CHECKLIST_ITEMS.slice(0, 4);

/* ─── Category colors ────────────────────────────────────────────────────── */
const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
  "Crawler Access": { bg: "rgba(255, 45, 85, 0.12)", text: "var(--brand-red)" },
  "LLMs.txt": { bg: "rgba(99, 102, 241, 0.12)", text: "var(--brand-purple)" },
  "Structured Data": { bg: "rgba(217, 255, 0, 0.12)", text: "var(--brand-lime)" },
  "Citation Signals": { bg: "rgba(255, 154, 40, 0.12)", text: "var(--warning-400)" },
  "Technical Health": { bg: "rgba(99, 102, 241, 0.12)", text: "var(--brand-purple)" },
  "Content Structure": { bg: "rgba(255, 45, 85, 0.12)", text: "var(--brand-red)" },
  "Content Quality": { bg: "rgba(217, 255, 0, 0.12)", text: "var(--brand-lime)" },
};

/* ─── Form state ─────────────────────────────────────────────────────────── */
type FormState = "idle" | "loading" | "success" | "error";

/* ─── Page metadata (exported for Next.js — but page is "use client", so
       metadata must go in a separate layout.tsx for the route group.
       We export the static metadata object here for reference only) ─────── */

export default function AIVisibilityChecklistPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedEmail = email.trim();
      if (!trimmedEmail || !trimmedEmail.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }

      setFormState("loading");
      setErrorMsg("");

      try {
        const res = await fetch("/api/checklist-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedEmail,
            firstName: firstName.trim() || undefined,
            company: company.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Signup failed");
        }

        setFormState("success");

        // Trigger immediate browser download — instant gratification before email arrives
        const anchor = document.createElement("a");
        anchor.href = "/resources/ai-visibility-checklist.md";
        anchor.download = "ai-visibility-checklist.md";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Redirect to free scanner after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (err) {
        setFormState("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    },
    [email, firstName, company, router]
  );

  return (
    <>
      <Header />
      <main>
        {/* ── JSON-LD ────────────────────────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "The 14-Point AI Visibility Checklist",
              description:
                "Audit all 46 signals ChatGPT, Claude, and Perplexity use to discover your site. Free guide with code examples.",
              tool: "ConduitScore",
              step: CHECKLIST_ITEMS.map((item) => ({
                "@type": "HowToStep",
                name: item.signal,
                text: item.howToCheck,
                position: item.number,
              })),
            }),
          }}
        />

        {/* ───────────────────────────────────────────────────────────────
            SECTION 1 — HERO
        ─────────────────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            paddingTop: "clamp(64px, 10vw, 120px)",
            paddingBottom: "clamp(64px, 10vw, 96px)",
          }}
        >
          {/* Mesh background */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.18) 0%, transparent 60%), " +
                "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(255,45,85,0.14) 0%, transparent 58%)",
              pointerEvents: "none",
            }}
          />

          <div className="container-tight mx-auto px-6">
            {/* Label */}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <span className="section-label">Free Resource</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                textAlign: "center",
                fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                color: "var(--text-primary)",
                marginBottom: "20px",
              }}
            >
              The 14-Point{" "}
              <span
                style={{
                  background: "var(--gradient-text)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI Visibility
              </span>{" "}
              Checklist
            </h1>

            {/* Subheadline */}
            <p
              style={{
                textAlign: "center",
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: "640px",
                margin: "0 auto 16px",
              }}
            >
              Every signal ChatGPT, Claude, and Perplexity use to discover your site
            </p>

            {/* Value prop */}
            <p
              style={{
                textAlign: "center",
                fontSize: "0.95rem",
                color: "var(--text-tertiary)",
                marginBottom: "36px",
              }}
            >
              Audit all 46 signals your site needs for AI visibility — free guide with code examples
            </p>

            {/* CTA anchor */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="#get-checklist"
                className="btn btn-primary btn-lg"
                style={{ textDecoration: "none" }}
              >
                Get the Free Checklist
              </a>
              <a
                href="#preview"
                className="btn btn-secondary btn-lg"
                style={{ textDecoration: "none" }}
              >
                See What&apos;s Inside
              </a>
            </div>

            {/* Social proof bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                marginTop: "36px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "46 signals covered" },
                { label: "Copy-paste code fixes" },
                { label: "No signup required" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "0.83rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "rgba(217, 255, 0, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
                      <path
                        d="M1 3.5L3.5 6L8 1"
                        stroke="#d9ff00"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            SECTION 2 — CHECKLIST PREVIEW (items 1–4)
        ─────────────────────────────────────────────────────────────── */}
        <section
          id="preview"
          style={{
            padding: "clamp(56px, 8vw, 96px) 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-base mx-auto px-6">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="section-label" style={{ marginBottom: "12px", display: "block" }}>
                Checklist Preview
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                  margin: "0 0 12px",
                }}
              >
                4 of the 14 Signals
              </h2>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.95rem" }}>
                The full checklist includes 46 signals with point values, audit steps, and code fixes for each.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
              }}
            >
              {PREVIEW_ITEMS.map((item) => {
                const catStyle = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE["Technical Health"];
                return (
                  <div
                    key={item.number}
                    className="card"
                    style={{ padding: "28px 28px 24px" }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      {/* Number badge */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--gradient-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          color: "#fff",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.number}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "4px",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontFamily: "var(--font-display)",
                              color: "var(--text-primary)",
                              fontWeight: 700,
                              margin: 0,
                            }}
                          >
                            {item.signal}
                          </h3>
                          {/* Points badge */}
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "var(--radius-full)",
                              background: "rgba(217,255,0,0.1)",
                              color: "var(--brand-lime)",
                              fontFamily: "var(--font-mono)",
                              letterSpacing: "0.06em",
                              flexShrink: 0,
                            }}
                          >
                            +{item.points} pts
                          </span>
                        </div>
                        {/* Category tag */}
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            background: catStyle.bg,
                            color: catStyle.text,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Why it matters */}
                    <div style={{ marginBottom: "14px" }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--brand-red)",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: "5px",
                        }}
                      >
                        Why it matters
                      </p>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                        {item.whyItMatters}
                      </p>
                    </div>

                    {/* How to check */}
                    <div style={{ marginBottom: item.codeExample ? "16px" : 0 }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--brand-purple)",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: "5px",
                        }}
                      >
                        How to check
                      </p>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                        {item.howToCheck}
                      </p>
                    </div>

                    {/* Code example */}
                    {item.codeExample && (
                      <div
                        className="code-block"
                        style={{
                          marginTop: "16px",
                          fontSize: "0.78rem",
                          lineHeight: 1.7,
                          overflowX: "auto",
                          whiteSpace: "pre",
                        }}
                      >
                        {item.codeExample}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Blur teaser for remaining items */}
            <div
              style={{
                position: "relative",
                marginTop: "20px",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
              }}
            >
              {/* Blurred preview rows */}
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                  filter: "blur(4px)",
                  userSelect: "none",
                  pointerEvents: "none",
                  opacity: 0.5,
                }}
                aria-hidden="true"
              >
                {CHECKLIST_ITEMS.slice(4, 7).map((item) => (
                  <div
                    key={item.number}
                    className="card"
                    style={{ padding: "20px 24px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "var(--gradient-primary)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.signal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlay CTA */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(16,16,20,0.85) 60%, rgba(16,16,20,0.98) 100%)",
                }}
              >
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <p
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "12px",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    10 more signals in the full checklist
                  </p>
                  <a
                    href="#get-checklist"
                    className="btn btn-primary"
                    style={{ padding: "12px 24px", textDecoration: "none" }}
                  >
                    Get All 14 Signals Free
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            SECTION 3 — EMAIL CAPTURE FORM
        ─────────────────────────────────────────────────────────────── */}
        <section
          id="get-checklist"
          style={{
            padding: "clamp(64px, 10vw, 112px) 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow background */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(99,102,241,0.14) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div className="container-tight mx-auto px-6">
            <div
              className="card"
              style={{
                padding: "clamp(36px, 6vw, 60px)",
                maxWidth: "600px",
                margin: "0 auto",
                background:
                  "linear-gradient(145deg, rgba(99,102,241,0.06) 0%, rgba(255,45,85,0.04) 60%, rgba(18,18,20,0.95) 100%)",
                border: "1px solid var(--border-strong)",
                boxShadow:
                  "0 0 0 1px rgba(99,102,241,0.12), 0 24px 64px rgba(0,0,0,0.5)",
              }}
            >
              {formState === "success" ? (
                /* Success state */
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(217,255,0,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
                      <path
                        d="M2 11L10 19L26 3"
                        stroke="#d9ff00"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                      marginBottom: "10px",
                    }}
                  >
                    Your download has started
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                    The checklist is downloading now. We also sent a copy to your inbox.
                  </p>
                  <a
                    href="/resources/ai-visibility-checklist.md"
                    download="ai-visibility-checklist.md"
                    style={{
                      display: "inline-block",
                      marginTop: "18px",
                      marginBottom: "8px",
                      background: "var(--brand-lime, #d9ff00)",
                      color: "#0c0c0e",
                      textDecoration: "none",
                      padding: "11px 22px",
                      borderRadius: "999px",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                    }}
                  >
                    Download again &rarr;
                  </a>
                  <p style={{ marginTop: "12px", fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
                    Taking you to the free scanner in a moment&hellip;
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <span className="section-label" style={{ marginBottom: "10px", display: "block" }}>
                      Free Download
                    </span>
                    <h2
                      style={{
                        fontSize: "clamp(1.4rem, 3vw, 2rem)",
                        fontFamily: "var(--font-display)",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                        lineHeight: 1.1,
                      }}
                    >
                      Get the full 14-point checklist
                    </h2>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      Sent to your inbox instantly. Easy to save, print, or share with your team.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Email — required */}
                    <div style={{ marginBottom: "14px" }}>
                      <label
                        htmlFor="checklist-email"
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "6px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Email address{" "}
                        <span style={{ color: "var(--brand-red)" }} aria-label="required">
                          *
                        </span>
                      </label>
                      <input
                        id="checklist-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        className="input"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg("");
                        }}
                        disabled={formState === "loading"}
                        aria-required="true"
                        aria-describedby={errorMsg ? "form-error" : undefined}
                        style={{
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                    </div>

                    {/* First name — optional */}
                    <div style={{ marginBottom: "14px" }}>
                      <label
                        htmlFor="checklist-name"
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "6px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        First name{" "}
                        <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        id="checklist-name"
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        className="input"
                        placeholder="Alex"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={formState === "loading"}
                        style={{
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                    </div>

                    {/* Company — optional */}
                    <div style={{ marginBottom: "24px" }}>
                      <label
                        htmlFor="checklist-company"
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "6px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Company{" "}
                        <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        id="checklist-company"
                        type="text"
                        name="company"
                        autoComplete="organization"
                        className="input"
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={formState === "loading"}
                        style={{
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                    </div>

                    {/* Error message */}
                    {errorMsg && (
                      <div
                        id="form-error"
                        role="alert"
                        style={{
                          marginBottom: "16px",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          background: "rgba(255, 45, 85, 0.08)",
                          border: "1px solid rgba(255, 45, 85, 0.3)",
                          fontSize: "0.85rem",
                          color: "var(--brand-red)",
                        }}
                      >
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={formState === "loading"}
                      style={{
                        width: "100%",
                        padding: "15px 24px",
                        fontSize: "0.95rem",
                        justifyContent: "center",
                        opacity: formState === "loading" ? 0.7 : 1,
                        cursor: formState === "loading" ? "wait" : "pointer",
                      }}
                      aria-busy={formState === "loading"}
                    >
                      {formState === "loading" ? (
                        <>
                          <span
                            style={{
                              width: "16px",
                              height: "16px",
                              border: "2px solid rgba(255,255,255,0.3)",
                              borderTopColor: "#fff",
                              borderRadius: "50%",
                              display: "inline-block",
                              animation: "spin 0.7s linear infinite",
                            }}
                            aria-hidden="true"
                          />
                          Sending checklist&hellip;
                        </>
                      ) : (
                        "Send me the checklist"
                      )}
                    </button>

                    {/* Privacy note */}
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "0.77rem",
                        color: "var(--text-tertiary)",
                        marginTop: "14px",
                        lineHeight: 1.55,
                      }}
                    >
                      We&apos;ll send your checklist + occasional ConduitScore updates.{" "}
                      <br className="hidden sm:block" />
                      Unsubscribe anytime. No spam, ever.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Inline keyframe for spinner */}
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            SECTION 4 — WHAT YOU GET
        ─────────────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "clamp(56px, 8vw, 96px) 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-base mx-auto px-6">
            <div
              style={{
                display: "grid",
                gap: "clamp(32px, 6vw, 64px)",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
                alignItems: "center",
              }}
            >
              {/* Left — headline */}
              <div>
                <span className="section-label" style={{ marginBottom: "14px", display: "block" }}>
                  What&apos;s inside
                </span>
                <h2
                  style={{
                    fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)",
                    marginBottom: "16px",
                    lineHeight: 1.1,
                  }}
                >
                  Everything you need to audit and fix AI visibility
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  The checklist distills what we&apos;ve learned running thousands of AI visibility scans into a
                  single actionable checklist you can work through in under 30 minutes.
                </p>
              </div>

              {/* Right — checklist items */}
              <div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "16px" }}>
                  {[
                    {
                      text: "All 46 signals explained (with point values)",
                      detail: "Understand exactly how each signal affects your AI visibility score.",
                    },
                    {
                      text: "How to audit each signal on your site",
                      detail: "Step-by-step instructions — no specialist knowledge required.",
                    },
                    {
                      text: "Copy-paste code fixes (no custom dev needed)",
                      detail: "Real code snippets for robots.txt, JSON-LD, llms.txt, and more.",
                    },
                    {
                      text: "Before & after examples (low score vs. high score)",
                      detail: "See exactly what a poorly-optimized site looks like vs. a well-optimized one.",
                    },
                    {
                      text: "Priority ranking — which signals to fix first",
                      detail: "Focus on the highest-impact changes to maximize your score quickly.",
                    },
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "rgba(217,255,0,0.12)",
                          border: "1px solid rgba(217,255,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                        aria-hidden="true"
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.8 7L9 1"
                            stroke="#d9ff00"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <div>
                        <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: "2px" }}>
                          {item.text}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", lineHeight: 1.55 }}>
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            SECTION 5 — USE CASES
        ─────────────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "clamp(56px, 8vw, 96px) 0",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="container-base mx-auto px-6">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="section-label" style={{ marginBottom: "12px", display: "block" }}>
                Who it&apos;s for
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                  marginBottom: "10px",
                }}
              >
                The checklist helps
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              }}
            >
              {[
                {
                  audience: "SaaS Founders",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  quote: "Audit your entire site in 30 minutes",
                  detail:
                    "Know exactly which AI visibility signals you're missing before your next sprint. Fix the highest-impact issues yourself — no agency needed.",
                },
                {
                  audience: "Agencies",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  ),
                  quote: "Give clients a repeatable audit framework",
                  detail:
                    "Differentiate your agency by adding AI visibility audits to your service offering. The checklist gives you a consistent, client-facing deliverable.",
                },
                {
                  audience: "E-commerce",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  ),
                  quote: "Find why AI agents aren't recommending your products",
                  detail:
                    "AI shopping assistants are influencing purchasing decisions. Find and fix the gaps that are costing you product recommendations.",
                },
                {
                  audience: "Enterprise Teams",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  ),
                  quote: "Align technical and marketing teams on AI visibility",
                  detail:
                    "A shared, jargon-free checklist bridges the gap between engineering and marketing — making AI SEO a team sport, not a black box.",
                },
              ].map((item) => (
                <div
                  key={item.audience}
                  className="card"
                  style={{ padding: "28px" }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(255, 45, 85, 0.1)",
                      border: "1px solid rgba(255, 45, 85, 0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      color: "var(--brand-red)",
                    }}
                  >
                    {item.icon}
                  </div>

                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--brand-red)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {item.audience}
                  </p>

                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                      marginBottom: "10px",
                      lineHeight: 1.25,
                    }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", lineHeight: 1.65 }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            SECTION 6 — BOTTOM CTA
        ─────────────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "clamp(64px, 10vw, 104px) 0",
            background: "var(--surface-raised)",
            borderTop: "1px solid var(--border-subtle)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gradient glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,45,85,0.45), rgba(99,102,241,0.4), transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div className="container-tight mx-auto px-6" style={{ textAlign: "center" }}>
            <span className="section-label" style={{ marginBottom: "16px", display: "block" }}>
              Ready to audit your site?
            </span>

            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                marginBottom: "16px",
                lineHeight: 1.08,
              }}
            >
              See your AI visibility score
              <br />
              <span
                style={{
                  background: "var(--gradient-text)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                in 15 seconds
              </span>
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.65,
                maxWidth: "480px",
                margin: "0 auto 36px",
              }}
            >
              Run the free ConduitScore scanner to see exactly which of the 46 checklist signals you&apos;re passing
              and which need work — with copy-paste fixes included.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                className="btn btn-primary btn-lg"
                style={{ textDecoration: "none" }}
              >
                Run a Free Scan
              </Link>
              <a
                href="#get-checklist"
                className="btn btn-secondary btn-lg"
                style={{ textDecoration: "none" }}
              >
                Get the Checklist First
              </a>
            </div>

            <p
              style={{
                marginTop: "20px",
                fontSize: "0.8rem",
                color: "var(--text-tertiary)",
              }}
            >
              Free — no account required. 3 scans per month.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
