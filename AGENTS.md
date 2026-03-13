# ConduitScore - Agents

## Project
ConduitScore — AI Visibility Score scanner with copy-paste fixes

## Stack
Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, Neon PostgreSQL, NextAuth.js, Stripe, Playwright (scanner), Vitest, Vercel

## Architecture
- App Router with route groups: (auth), (dashboard), (marketing)
- Server Components by default, Client Components for interactivity
- API routes for scanner, auth, Stripe, CRUD
- Prisma ORM with Neon PostgreSQL
- JWT sessions via NextAuth.js v5

## Rules
1. Suspense boundary on every useSearchParams
2. Lazy client initialization (no top-level clients)
3. Stripe apiVersion always explicit
4. No N+1 queries — use Prisma include/select
5. try/catch on all API routes with structured errors
6. Scoreboard: npm run typecheck && npm test && npm run build
