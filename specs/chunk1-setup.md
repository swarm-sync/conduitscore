# Chunk 1: Setup (Foundation)

## Goal
Bootable Next.js 15 application with database schema, Tailwind styling, project structure, and all configuration. App must build and display a placeholder landing page.

## Tasks
1. Initialize Next.js 15 with `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` (use src/ directory)
2. Install dependencies: `npm install prisma @prisma/client next-auth @auth/prisma-adapter stripe @tanstack/react-query framer-motion recharts zod lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-tooltip react-hot-toast resend posthog-js @sentry/nextjs vitest @vitejs/plugin-react jsdom`
3. Install dev deps: `npm install -D @types/node playwright`
4. Create Prisma schema at prisma/schema.prisma with ALL tables: users, accounts, sessions, verification_tokens, scans, scan_pages, projects, subscriptions, payments, api_keys, scheduled_scans, scan_reports
5. Configure Tailwind with design tokens from Phase 3 (colors, fonts, spacing)
6. Create root layout (src/app/layout.tsx) with Inter + JetBrains Mono fonts, metadata
7. Build placeholder landing page (src/app/page.tsx) with hero text
8. Create base UI: Button, Card, Input components in src/components/ui/
9. Create Header and Footer shells in src/components/layout/
10. Create lib/prisma.ts with lazy initialization pattern
11. Add vitest.config.ts and a basic passing test
12. Verify scoreboard passes

## Done Means
- `npm run typecheck` passes with zero errors
- `npm run test` passes (at least 1 test)
- `npm run build` completes successfully
- Landing page renders at localhost:3000
- Prisma schema validates (`npx prisma validate`)

## Scoreboard
```powershell
npm run typecheck && npm test && npm run build
```
