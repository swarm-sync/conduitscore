"use client";

/* ---------------------------------------------------------------
   HomePageCards — Client component containing all interactive
   card sections for the homepage (hover effects require event
   handlers, so they must be "use client").
--------------------------------------------------------------- */

import Link from "next/link";

const categoryData = [
  {
    title: "Crawler Access",
    desc: "Verifies GPTBot, ClaudeBot, PerplexityBot permissions in robots.txt.",
    pts: "15",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L18 6v8l-8 4-8-4V6l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    accentColor: "var(--violet-400)",
    accentGlow: "rgba(108,59,255,0.15)",
  },
  {
    title: "Structured Data",
    desc: "Validates JSON-LD schema markup and FAQ detection for machine parsing.",
    pts: "20",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="3" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="11" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    accentColor: "var(--cyan-400)",
    accentGlow: "rgba(0,217,255,0.12)",
  },
  {
    title: "Content Structure",
    desc: "Heading hierarchy, semantic HTML, and answer-ready sections.",
    pts: "15",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 5h14M3 9h10M3 13h12M3 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accentColor: "var(--success-400)",
    accentGlow: "rgba(0,229,160,0.12)",
  },
  {
    title: "LLMs.txt",
    desc: "Machine-readable site summary standard adopted by AI-first companies.",
    pts: "10",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        <path d="M7 8h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accentColor: "var(--cyan-300)",
    accentGlow: "rgba(102,232,255,0.10)",
  },
  {
    title: "Technical Health",
    desc: "Meta tags, Open Graph, load times, and rendering signals.",
    pts: "15",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 10h2l2-5 3 10 2-7 2 2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accentColor: "var(--warning-400)",
    accentGlow: "rgba(255,184,0,0.12)",
  },
  {
    title: "Citation Signals",
    desc: "External link authority and citation-worthiness for AI answers.",
    pts: "10",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 10a5 5 0 0 0 9.9 1M15 10a5 5 0 0 0-9.9-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7l3 3-3 3M8 7L5 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accentColor: "var(--error-400)",
    accentGlow: "rgba(255,71,87,0.12)",
  },
  {
    title: "Content Quality",
    desc: "Word count, freshness, and depth — the authority signals AI prefers.",
    pts: "15",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2l2.4 4.8 5.3.8-3.85 3.75.91 5.3L10 14.25 5.2 16.65l.91-5.3L2.26 7.6l5.3-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accentColor: "var(--violet-300)",
    accentGlow: "rgba(176,159,255,0.12)",
  },
];

const useCases = [
  {
    title: "SaaS Companies",
    desc: "Ensure your product pages, docs, and pricing are visible when prospects ask AI assistants for software recommendations.",
    link: "/use-cases/saas",
    icon: "⚡",
  },
  {
    title: "E-Commerce",
    desc: "Make your catalog machine-readable so AI shopping assistants can find, compare, and recommend your products.",
    link: "/use-cases/ecommerce",
    icon: "🛒",
  },
  {
    title: "Agencies",
    desc: "Offer AI visibility auditing as a premium service. White-label our scanner under your brand.",
    link: "/use-cases/agencies",
    icon: "🏢",
  },
];

/* ---- Category card ---- */
function CategoryCard({ f }: { f: typeof categoryData[0] }) {
  return (
    <article
      className="rounded-xl p-5"
      style={{
        background: "var(--surface-overlay)",
        border: "1px solid var(--border-subtle)",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(108,59,255,0.38)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 40px ${f.accentGlow}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-subtle)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
          style={{
            background: f.accentGlow,
            border: `1px solid ${f.accentColor}30`,
            color: f.accentColor,
          }}
        >
          {f.icon}
        </div>
        <span
          className="text-xs font-bold tabular-nums"
          style={{
            fontFamily: "var(--font-mono)",
            color: f.accentColor,
            background: f.accentGlow,
            border: `1px solid ${f.accentColor}30`,
            borderRadius: "var(--radius-full)",
            padding: "2px 8px",
          }}
        >
          {f.pts}pts
        </span>
      </div>
      <h3
        className="text-sm font-semibold mb-1.5"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
      >
        {f.title}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
        {f.desc}
      </p>
    </article>
  );
}

/* ---- How It Works step ---- */
const steps = [
  {
    n: "01",
    title: "Enter any URL",
    desc: "Paste any website URL. No account needed, no extensions to install.",
    accentColor: "var(--violet-500)",
    accentGlow: "rgba(108,59,255,0.15)",
  },
  {
    n: "02",
    title: "Score in 30 seconds",
    desc: "Our engine runs 7 parallel analyses covering every dimension AI crawlers evaluate.",
    accentColor: "var(--cyan-400)",
    accentGlow: "rgba(0,217,255,0.12)",
  },
  {
    n: "03",
    title: "Copy-paste fixes",
    desc: "Ranked code snippets — from JSON-LD schemas to robots.txt rules — ready to drop in.",
    accentColor: "var(--success-400)",
    accentGlow: "rgba(0,229,160,0.12)",
  },
];

/* ---- Use case card ---- */
function UseCaseCard({ uc }: { uc: typeof useCases[0] }) {
  return (
    <div
      className="rounded-xl p-8"
      style={{
        background: "var(--surface-overlay)",
        border: "1px solid var(--border-subtle)",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(108,59,255,0.35)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3), 0 0 30px rgba(108,59,255,0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-subtle)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div
        className="mb-4 text-2xl w-10 h-10 flex items-center justify-center rounded-lg"
        style={{ background: "rgba(108,59,255,0.08)", border: "1px solid var(--border-subtle)" }}
        aria-hidden="true"
      >
        {uc.icon}
      </div>
      <h3
        className="text-lg font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        {uc.title}
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-tertiary)" }}>
        {uc.desc}
      </p>
      <Link
        href={uc.link}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-all"
        style={{ color: "var(--cyan-400)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cyan-300)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cyan-400)"; }}
      >
        Learn more
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

/* ---- Step card ---- */
function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <div
      className="relative flex flex-col rounded-xl p-8"
      style={{
        background: "var(--surface-overlay)",
        border: "1px solid var(--border-subtle)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(108,59,255,0.35)";
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 40px ${step.accentGlow}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-subtle)";
        el.style.boxShadow = "none";
      }}
    >
      {index < 2 && (
        <div
          className="absolute top-1/2 -right-3 hidden md:block w-6 h-px"
          style={{ background: "linear-gradient(90deg, var(--border-default), transparent)" }}
          aria-hidden="true"
        />
      )}
      <span
        className="mb-6 inline-block text-5xl font-extrabold leading-none"
        style={{
          fontFamily: "var(--font-display)",
          color: step.accentColor,
          opacity: 0.18,
          letterSpacing: "-0.04em",
        }}
      >
        {step.n}
      </span>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-5 flex-shrink-0"
        style={{ background: step.accentGlow, border: `1px solid ${step.accentColor}30` }}
        aria-hidden="true"
      >
        <div className="w-2 h-2 rounded-full" style={{ background: step.accentColor }} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        {step.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
        {step.desc}
      </p>
    </div>
  );
}

export function HomePageCards() {
  return (
    <>
      {/* ===== 7 CATEGORIES ===== */}
      <section
        id="features"
        className="py-28"
        style={{ background: "var(--surface-base)" }}
        aria-labelledby="features-heading"
      >
        <div className="container-wide mx-auto">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <span className="section-label">Analysis Engine</span>
            <h2
              id="features-heading"
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontWeight: 700 }}
            >
              7 categories.{" "}
              <span
                style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                One decisive score.
              </span>
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              Every signal AI agents evaluate when crawling, indexing, and citing your site.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            {categoryData.slice(0, 4).map((f) => (
              <CategoryCard key={f.title} f={f} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryData.slice(4).map((f) => (
              <CategoryCard key={f.title} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        id="how-it-works"
        className="py-28"
        style={{
          background: "var(--surface-raised)",
          borderTop: "1px solid var(--border-subtle)",
        }}
        aria-labelledby="how-heading"
      >
        <div className="container-wide mx-auto">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <span className="section-label">How It Works</span>
            <h2
              id="how-heading"
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontWeight: 700 }}
            >
              From URL to action in under a minute
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <StepCard key={step.n} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section
        id="use-cases"
        className="py-20"
        style={{
          background: "var(--surface-base)",
          borderTop: "1px solid var(--border-subtle)",
        }}
        aria-labelledby="trust-heading"
      >
        <div className="container-wide mx-auto">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="section-label">Who Uses ConduitScore</span>
            <h2
              id="trust-heading"
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontWeight: 700 }}
            >
              Built for the AI search era
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              AI agents are the new gatekeepers — regardless of your industry.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {useCases.map((uc) => (
              <UseCaseCard key={uc.title} uc={uc} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
