# ConduitScore — CLAUDE.md

## Project Overview

**ConduitScore** — AI Visibility Score Scanner. A Next.js 15 SaaS that crawls any website and scores it for visibility to AI agents and LLMs (ChatGPT, Claude, Perplexity, etc.). Users get a 0–100 score, category breakdowns, issue lists, and actionable fixes.

- **Live URL**: https://conduitscore.com
- **GitHub**: https://github.com/bkauto3/conduitscore-website (branch: `master`)
- **Vercel project**: `bens-projects-4026/conduitscore`
- **Deploy**: `npx vercel --prod` from `phase_5_output/` OR push to `master` (auto-deploy)

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Language | TypeScript 5, React 19 |
| Auth | NextAuth.js v4 — Google OAuth + Resend magic link |
| Database | Neon PostgreSQL via Prisma ORM |
| Payments | Stripe (checkout + webhooks + customer portal) |
| Email | Resend API (direct fetch, not SDK) |
| Styling | Tailwind CSS v4 + CSS variables (design tokens) |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deployment | Vercel (sfo1 region, 30s function timeout, 300s for cron) |

---

## Directory Structure

```
phase_5_output/               ← project root (always cd here)
  src/
    app/
      (dashboard)/            ← authenticated layout
        dashboard/            ← real DB stats (total scans, avg score, last score)
        projects/             ← CRUD project management
        scans/[id]/           ← scan detail + Share button
        settings/             ← billing, API keys
      api/
        auth/[...nextauth]/   ← NextAuth handler
        scan/                 ← POST: run scan + enforce tier limits
        scans/                ← GET: paginated scan history
        scans/[id]/           ← GET: single scan result
        scans/[id]/report/    ← GET: public report endpoint
        projects/             ← GET/POST/DELETE projects
        keys/                 ← API key management
        stripe/               ← checkout, portal, webhook
        cron/weekly-scan/     ← GET: Vercel cron (Mondays 9am UTC)
        health/               ← GET: health check
      scan-result/            ← public scan result page (Share button)
      pricing/                ← plan comparison ($0/$29/$79/$199)
      signin/                 ← auth page
    lib/
      auth.ts                 ← NextAuth config (Google + Resend email)
      stripe.ts               ← lazy Stripe client + PRICE_MAP
      prisma.ts               ← singleton Prisma client
      plan-limits.ts          ← PLAN_LIMITS per tier
      rate-limit.ts           ← IP-based rate limiter
      email.ts                ← Resend email helpers
      session.ts              ← session helpers
      scanner/
        scan-orchestrator.ts  ← main scan runner
        url-normalizer.ts     ← prepends https://, handles bare domains
        types.ts              ← ScanResult, Category, Issue, Fix types
        analyzers/            ← 7 analysis modules (see below)
    components/
      layout/header.tsx       ← ConduitScore logo (Image, not text)
      scan/scan-form.tsx      ← scan input (hero + dashboard variants)
      scan/score-gauge.tsx    ← circular score visualization
      scan/category-breakdown.tsx
      scan/issue-list.tsx
      scan/fix-panel.tsx
    middleware.ts             ← route protection
  prisma/schema.prisma        ← DB schema
  vercel.json                 ← cron schedule + function timeouts
  .env                        ← local env vars (never commit secrets)
```

---

## Scanner Analyzers (7 modules)

Each analyzer returns category scores, issues, and fixes:

| Analyzer | What it checks |
|----------|---------------|
| `citation-signals.ts` | Author info, expertise signals, E-E-A-T |
| `content-quality.ts` | Content depth, readability, AI-parseable text |
| `content-structure.ts` | Headings, semantic HTML, clear answer patterns |
| `crawler-access.ts` | robots.txt, sitemap.xml, crawl permissions |
| `llms-txt.ts` | `/llms.txt` file presence and format |
| `structured-data.ts` | JSON-LD, schema.org markup |
| `technical-health.ts` | Load time, HTTPS, Core Web Vitals signals |

---

## Pricing Tiers

| Tier | Price | Scans/mo | Pages/scan |
|------|-------|----------|------------|
| free | $0 | 3 | 1 |
| starter | $29/mo | 50 | 5 |
| pro | $79/mo | 500 | 50 |
| agency | $199/mo | Unlimited | Unlimited |

**Stripe Price IDs** (live):
- Starter: `STRIPE_PRICE_STARTER` env var
- Pro: `price_1TAtIfPQdMywmVkHygVS8A77`
- Agency: `price_1TAtIoPQdMywmVkHDaGiA9Kd`

---

## Required Environment Variables

All must be set in Vercel **without trailing newlines** — use `printf` not `echo` when setting via CLI.

```
# Database
DATABASE_URL              # Neon PostgreSQL connection string

# Auth
NEXTAUTH_URL=https://conduitscore.com
NEXTAUTH_SECRET           # random 32-char secret (openssl rand -base64 32)
GOOGLE_CLIENT_ID          # from Google Cloud Console (project 570826241894)
GOOGLE_CLIENT_SECRET      # from Google Cloud Console

# Email (magic link)
RESEND_API_KEY            # from resend.com
EMAIL_FROM=noreply@conduitscore.com  # domain must be verified in Resend

# Payments
STRIPE_SECRET_KEY         # sk_live_... from Stripe dashboard
STRIPE_WEBHOOK_SECRET     # whsec_... from Stripe webhook endpoint
STRIPE_PRICE_STARTER      # Stripe price ID for $29 plan
STRIPE_PRICE_PRO          # price_1TAtIfPQdMywmVkHygVS8A77
STRIPE_PRICE_AGENCY       # price_1TAtIoPQdMywmVkHDaGiA9Kd

# App
NEXT_PUBLIC_APP_URL=https://conduitscore.com

# Cron (optional — protects cron endpoint)
CRON_SECRET               # any random string
```

---

## Critical Implementation Rules

### 1. URL Normalization — Always normalize BEFORE validating
```typescript
// CORRECT (current implementation in api/scan/route.ts)
const normalizedUrl = normalizeUrl(url);  // prepends https:// if missing
new URL(normalizedUrl);                   // now safe to validate

// WRONG — breaks bare domains like "swarmsync.ai"
new URL(url);             // throws on bare domains
const normalizedUrl = normalizeUrl(url);
```

### 2. Auth — Trim ALL credentials at read time
```typescript
// auth.ts — prevents trailing-newline OAuth failures
clientId: (process.env.GOOGLE_CLIENT_ID ?? "").trim(),
clientSecret: (process.env.GOOGLE_CLIENT_SECRET ?? "").trim(),
```

### 3. Stripe — Always use lazy getter, never top-level init
```typescript
// CORRECT (current implementation in lib/stripe.ts)
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(key, { apiVersion: "2024-12-18.acacia" });
  return _stripe;
}

// WRONG — breaks Vercel serverless cold starts
export const stripe = new Stripe(key);
```

### 4. Scan Limit Enforcement (api/scan/route.ts)
- Free=3, Starter=50, Pro=500, Agency=Infinity per month
- Monthly counter resets automatically when `scanResetAt` is >1 month old
- Returns HTTP 402 with `{ upgradeRequired: true, tier, limit, used }` when limit hit
- `scan-form.tsx` shows "Upgrade Plan →" link on 402 response

### 5. Google OAuth — Required Google Cloud Console settings
- **Authorized JavaScript Origins**: `https://conduitscore.com`
- **Authorized Redirect URIs**: `https://conduitscore.com/api/auth/callback/google`
- OAuth client ID: `570826241894-k3lbes64hilarh6svtvgfcd5v6jjvs7l.apps.googleusercontent.com`
- Project number: `570826241894` (account: GenesisCantabo)

### 6. Resend Domain Verification (required for magic link)
- Must verify `conduitscore.com` at resend.com/domains
- Add SPF, DKIM, DMARC records at GoDaddy DNS
- Until verified: set `EMAIL_FROM=onboarding@resend.dev` for testing only

### 7. Suspense Boundaries — Required for useSearchParams
```tsx
// CORRECT
<Suspense fallback={<Loading />}>
  <ComponentUsingSearchParams />
</Suspense>
```

---

## Database Schema (key models)

```prisma
User {
  subscriptionTier  String  @default("free")   // free|starter|pro|agency
  scanCountMonth    Int     @default(0)          // resets monthly
  scanResetAt       DateTime                     // last reset timestamp
  stripeCustomerId  String?
}

Scan {
  userId        String?   // null = anonymous
  projectId     String?   // linked to Project
  url           String
  status        String    // pending|running|completed|failed
  overallScore  Int?      // 0-100
  categoryScores Json?    // per-analyzer scores
  issues        Json?
  fixes         Json?
}

Project {
  userId  String
  name    String
  url     String
  scheduledScans  ScheduledScan[]
}

ScheduledScan {
  projectId  String
  frequency  String    @default("weekly")
  nextRun    DateTime?
  enabled    Boolean   @default(true)
}
```

---

## Common Commands

```powershell
# Local dev
cd "C:\Users\Administrator\Desktop\ConduitScore\phase_5_output"
npm run dev                     # start dev server (http://localhost:3000)
npm run build                   # production build
npm run typecheck               # TypeScript check

# Database
npx prisma generate             # regenerate Prisma client
npx prisma db push              # push schema changes to Neon (no migration file)
npx prisma studio               # open DB GUI

# Testing
npm run test                    # Vitest unit tests
npm run test:e2e                # Playwright E2E (must have dev server running)
npm run test:e2e:headed         # E2E with visible browser

# Deployment
npx vercel --prod               # deploy to production
npx vercel env ls               # list all Vercel env vars
npx vercel logs conduitscore    # tail production logs

# Git
git add -A && git commit -m "..." && git push origin master
```

---

## Share Links

Every scan result has a shareable URL:
- **Public endpoint**: `GET /api/scans/[id]/report` — no auth required
- **Shareable URL format**: `https://conduitscore.com/scans/[id]`
- Share button on: `/scan-result?id=...` page and dashboard `/scans/[id]` page
- Copies URL to clipboard with green "Link copied!" confirmation

---

## Vercel Cron

- **Schedule**: every Monday at 9:00 AM UTC (`0 9 * * 1`)
- **Endpoint**: `GET /api/cron/weekly-scan`
- **Auth**: `Authorization: Bearer <CRON_SECRET>` header (Vercel sends automatically)
- **What it does**: finds all enabled `ScheduledScan` records with `nextRun <= now`, runs a full scan for each project URL, saves results to DB, advances `nextRun` by 7 days
- **Timeout**: 300 seconds (configured in `vercel.json`)

---

## Known Issues & Fixes Applied

| Issue | Fix |
|-------|-----|
| Google 401 invalid_client | Trailing `\n` in env vars — use `.trim()` on all credentials |
| Magic link not sending | `conduitscore.com` must be verified in Resend dashboard |
| Bare domains rejected ("swarmsync.ai") | `normalizeUrl()` now runs BEFORE `new URL()` validation |
| Dashboard stats showing 0 | Rewritten to fetch `/api/scans?limit=5` from real DB |
| Projects page stub | Full CRUD with API-backed create/delete |
| Pricing too steep ($29→$199→$499) | Updated to $0/$29/$79/$199 with new Stripe prices |

---

## DNS (GoDaddy → Vercel)

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
