# I built a tool that scans websites for AI-agent visibility — open to technical feedback on the scoring approach

Hi r/webdev — I built something over the last few months that I'd like technical feedback on.

**What it does:** Scans any URL and returns a 0–100 score measuring how visible the site is to AI crawlers (GPTBot, ClaudeBot, PerplexityBot). Checks 7 signal categories.

**How it works technically:**
- Fetches page HTML + robots.txt + sitemap.xml + llms.txt in parallel
- Runs 7 analyzers concurrently via Promise.all()
- Each analyzer returns CategoryScore with issues and fixes
- Weighted average for overall score
- Results saved to Postgres, shareable via public URL

**Stack:** Next.js 16 (App Router), TypeScript, Prisma + Neon PostgreSQL, NextAuth v4, Stripe, Vercel

**What I'm uncertain about:**

1. **The scoring weights** — currently based on my analysis of ~500 sites, but the weights are informed guesses. Is there a more principled way to validate this?

2. **llms.txt scoring** — I'm scoring presence/absence and format validity. Should I also be scoring content quality within the file?

3. **JavaScript rendering** — the scanner doesn't execute JS. For React/Next.js apps, this means it's checking SSR/SSG output. For CSR-only apps, it would miss a lot. Should I add a headless browser step, or document this as a known limitation?

4. **robots.txt interpretation** — I'm checking for explicit Allow rules for specific AI bots. But some robots.txt files use wildcard rules that would implicitly permit AI crawlers. Am I being too conservative in my scoring?

Live at [conduitscore.com](https://conduitscore.com) — free, no account needed for a scan.

Would appreciate any technical critique of the approach.
