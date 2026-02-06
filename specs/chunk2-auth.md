# Chunk 2: Auth (Authentication)

## Goal
Users can sign in with Google OAuth or Magic Link, access protected dashboard routes, and have sessions persisted via JWT.

## Tasks
1. Create lib/auth.ts with NextAuth.js v5 config (Google + Email providers, Prisma adapter, JWT strategy)
2. Create src/app/api/auth/[...nextauth]/route.ts
3. Build sign-in page at src/app/(auth)/signin/page.tsx with Google button + email input
4. Build magic link verification page at src/app/(auth)/verify/page.tsx
5. Create middleware.ts to protect /dashboard/* routes
6. Build dashboard layout at src/app/(dashboard)/layout.tsx with sidebar
7. Build placeholder dashboard page at src/app/(dashboard)/dashboard/page.tsx
8. Create UserMenu component with avatar and sign-out
9. Create lib/session.ts helper for getServerSession
10. Create lib/email.ts for Resend client (lazy init)
11. Verify: auth flow works, protected routes redirect, scoreboard passes

## Done Means
- Sign-in page renders with Google + email options
- Protected routes redirect to sign-in when not authenticated
- Dashboard layout renders for authenticated users
- `npm run typecheck && npm test && npm run build` passes

## Scoreboard
```powershell
npm run typecheck && npm test && npm run build
```
