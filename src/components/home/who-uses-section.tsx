"use client";

const TILES = [
  {
    dot: "var(--brand-red)",
    title: "SEO teams and agencies",
    body: "Show clients what is stopping AI tools from reading and recommending their content.",
  },
  {
    dot: "var(--violet-400)",
    title: "SaaS marketers",
    body: "Find the technical and content issues that make your site harder for AI tools to surface.",
  },
  {
    dot: "var(--brand-lime)",
    title: "E-commerce brands",
    body: "Make product and category pages easier for AI systems to understand and recommend.",
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
            Who this is for
          </h2>
        </div>

        <div
          style={{
            maxWidth: "800px",
            marginInline: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
              color: "var(--cyan-400)",
              textDecoration: "none",
            }}
          >
            How visible is your site to AI systems?
          </a>
        </div>
      </div>
    </section>
  );
}
