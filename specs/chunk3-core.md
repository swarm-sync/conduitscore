# Chunk 3: Core Feature (Scanner + Scoring Engine + Fix Generator)

## Goal
Users submit a URL, system scans it, calculates 7-category AI visibility score (0-100), generates copy-paste fixes, stores results.

## The 7 Scoring Categories
1. Crawler Access (15pts) — robots.txt allows GPTBot, ClaudeBot, PerplexityBot
2. Structured Data (20pts) — JSON-LD schema.org markup detection
3. Content Structure (15pts) — H-tag hierarchy, FAQ sections, answer capsules
4. LLMs.txt (10pts) — /llms.txt file presence and quality
5. Technical Health (15pts) — Page load time, SSR detection, viewport meta
6. Citation Signals (15pts) — External links, about/contact pages, authority
7. Content Quality (10pts) — Content length, date freshness, uniqueness

## Tasks
1. Create lib/scanner/types.ts with ScanResult, CategoryScore, Issue, Fix interfaces
2. Create lib/scanner/url-normalizer.ts for URL validation and normalization
3. Create lib/scanner/browser.ts — Playwright browser manager (lazy init, headless)
4. Create 7 analyzer files in lib/scanner/analyzers/:
   - crawler-access.ts: fetch robots.txt, parse User-Agent rules
   - structured-data.ts: extract JSON-LD from HTML
   - content-structure.ts: analyze H-tags, detect FAQ sections
   - llms-txt.ts: fetch /llms.txt, validate format
   - technical-health.ts: measure load time, check SSR, viewport
   - citation-signals.ts: count external links, authority indicators
   - content-quality.ts: assess content length, freshness
5. Create lib/scanner/fix-generator.ts — generate code snippets for each issue
6. Create lib/scanner/scan-orchestrator.ts — coordinate browser + analyzers + fixes
7. Create src/app/api/scan/route.ts (POST) — accepts URL, runs scan, returns results
8. Create src/app/api/scans/route.ts (GET) — list user's scans with pagination
9. Create src/app/api/scans/[id]/route.ts (GET, DELETE) — get/delete scan details
10. Create src/app/api/health/route.ts (GET) — health check endpoint
11. Create lib/rate-limit.ts — rate limiter (in-memory for MVP, Upstash later)
12. Create lib/plan-limits.ts — enforce scan limits per plan
13. Create lib/validations/scan.ts — Zod schema for scan input
14. Add unit tests for at least 3 analyzers
15. Verify scoreboard passes

## Fix Generator Output Examples
For missing robots.txt GPTBot access:
```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

For missing FAQ schema:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Your question here",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Your answer here"
    }
  }]
}
```

## Done Means
- POST /api/scan accepts URL and returns score + issues + fixes
- All 7 categories produce scores within their point range
- Fixes are generated for detected issues with copy-paste code
- GET /api/scans returns paginated list
- GET /api/health returns { status: "ok" }
- `npm run typecheck && npm test && npm run build` passes

## Scoreboard
```powershell
npm run typecheck && npm test && npm run build
```
