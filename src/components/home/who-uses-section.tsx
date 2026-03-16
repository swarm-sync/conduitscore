"use client";

const TILES = [
  {
    dot: "var(--brand-red)",
    title: "SEO Teams",
    body: "Your Google rankings still matter. But prospects are now finding products through AI answers. ConduitScore shows you what you\u2019re missing in that channel.",
  },
  {
    dot: "var(--violet-400)",
    title: "SaaS Founders",
    body: "When someone asks an AI assistant for a recommendation in your category, is your product visible? Find out \u2014 and fix it \u2014 before your competitors do.",
  },
  {
    dot: "var(--brand-lime)",
    title: "Content Teams",
    body: "You\u2019ve done the work. ConduitScore makes sure AI systems can read, understand, and cite it. Structured data gaps are the silent killer of AI-era reach.",
  },
  {
    dot: "var(--warning-400)",
    title: "Agencies",
    body: "Offer AI visibility auditing as a premium service. The score is tangible, the fixes are client-ready, and the gap is real for almost every site you manage.",
  },
];

export function WhoUsesSection() {
  return (
    <section
      aria-labelledby="who-uses-heading"
      style={{
        padding: "80px 0",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface-base)",
      }}
    >
      <div className="container-wide mx-auto">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="section-label">Who Uses ConduitScore</span>
          <h2
            id="who-uses-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              color: "var(--text-primary)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginTop: "12px",
            }}
          >
            Built for the people who care about search.
          </h2>
        </div>

        <div
          style={{
            maxWidth: "800px",
            marginInline: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
          className="who-uses-grid"
        >
          {TILES.map((tile) => (
            <div
              key={tile.title}
              style={{
                background: "var(--surface-overlay)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "28px",
                transition: "border-color 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(108,59,255,0.35)";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3), 0 0 30px rgba(108,59,255,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-subtle)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: tile.dot,
                    marginRight: "10px",
                    flexShrink: 0,
                    position: "relative",
                    top: "1px",
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {tile.title}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                  lineHeight: 1.5,
                }}
              >
                {tile.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a
            href="#scan"
            style={{
              fontSize: "0.9375rem",
              fontFamily: "var(--font-body)",
              color: "var(--violet-400)",
              textDecoration: "none",
            }}
          >
            Find out which of these applies to you &#8212; scan your site
          </a>
        </div>
      </div>
    </section>
  );
}
