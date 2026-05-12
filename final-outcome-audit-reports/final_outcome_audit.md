# Final Outcome Audit: ConduitScore

**Audited:** 2026-05-11
**Target type:** web
**Scope:** C:\Users\Administrator\Desktop\ConduitScore + https://conduitscore.com
**Chain confidence:** HIGH — all three audit phases completed with full code evidence; no fabricated findings

---

## 1. Site Comparison Summary

- Overall match: ~82% (repo and live site largely aligned; critical gaps in missing files)
- Critical site issues: 3 (missing middleware, missing /verify page, opt-in cron guard)
- Top page-level diffs:
  - `/verify` route referenced in auth config but page file does not exist
  - `src/middleware.ts` listed in CLAUDE.md but file absent — no edge-level auth guard
  - Framework version mismatch: CLAUDE.md says "Next.js 15", package.json shows 16.1.6

## 2. Failure Surface Summary

- Process correctness verdict: FLAWED
- Critical risks: 8 (RPN ≥ 200)
- High risks: 11 (RPN 100–199)
- Top systemic risks:
  - F-01 (RPN 648): `src/middleware.ts` absent — all dashboard/settings/scans routes unprotected at edge
  - F-03 (RPN 560): `/verify` page missing — magic link email auth ends on 404/NextAuth fallback
  - F-04 (RPN 392): CRON_SECRET opt-in guard — both cron endpoints publicly triggerable when env var unset
  - F-05 (RPN 392): Null fingerprint + null IP bypasses free scan limit in `checkFreeScanAccess`
  - F-02 (RPN 384): JWT strategy + PrismaAdapter incompatibility — sign-out/session refresh can 500
  - F-23 (RPN 196): `scan-result/page.tsx` ("use client") imports server-only `crypto`/`prisma` modules
  - F-06 (RPN 280): No `functions` config in vercel.json — scan API defaults to 30s, can timeout mid-scan
  - F-07 (RPN 280): Stripe checkout uses raw fetch instead of SDK — no idempotency keys
- Full report: `failure_mode_audit.md`

## 3. Outcome Proof Summary

- Intended outcome: Users scan URLs, get 0-100 AI visibility scores, free tier limits enforced, paid tiers unlock more features, Stripe payments work, cron runs weekly
- Actual proof status: PARTIALLY PROVEN
- Failed or unproven sections:
  - Multi-page scanning: advertised (5/50/100 pages per paid tier on pricing page) but `scan-orchestrator.ts` always fetches 1 page regardless of tier — billing misrepresentation
  - `npm test` exits with 2 failing tests (`fix-meta.test.ts` SCORE_IMPACT + EFFORT_MINUTES zero-value assertions) — CI gate will block deployment
  - Share link route `/scans/[id]` may be auth-gated (middleware.ts unverified)
- Proof-layer verdict: PARTIALLY PROVEN

## 4. Risk-to-Proof Crosswalk

| Risk ID | Failure mode | Proof checked? | Evidence | Residual risk |
|---------|--------------|----------------|----------|---------------|
| F-01 | Missing middleware — no edge auth guard | Yes | `src/middleware.ts` glob: no results | CRITICAL OPEN |
| F-02 | JWT + PrismaAdapter incompatibility | Yes | `auth.ts:44` jwt + line 9 PrismaAdapter | HIGH OPEN |
| F-03 | /verify page missing | Yes | `src/app/verify/page.tsx` glob: no results | CRITICAL OPEN |
| F-04 | CRON_SECRET opt-in — cron endpoints open | Yes | `weekly-scan/route.ts:15` — `&&` guard | CRITICAL OPEN |
| F-05 | Null-hash bypass in free scan check | Yes | `free-tier-abuse.ts:194` explicit return | HIGH OPEN |
| F-06 | Scan API 30s timeout | Yes | `vercel.json` has no `functions` key | HIGH OPEN |
| F-07 | Stripe checkout raw fetch, no idempotency | Yes | `checkout/route.ts:57` raw fetch confirmed | MEDIUM — checkout works but brittle |
| F-08 | Score sum not normalized | Partially | `scan-orchestrator.ts:216` — sum pattern | LOW — currently sums to 100 by contract |
| F-09 | subscription.updated skips period dates | Yes | `webhook/route.ts:122-138` — no period dates | MEDIUM — billing display affected |
| F-10 | Drip cron same open-endpoint vulnerability | Yes | `drip/route.ts:36` — same `&&` guard | HIGH OPEN |
| F-11 | sampleFixIndex naming inversion | Partial | `api/scan/route.ts` — behavior correct | LOW — naming bug only |
| F-12 | No Resend domain verification guard | Yes | Auth flow sends without startup check | MEDIUM — operational dependency |
| F-13 | robots.txt regex crosses agent blocks | Partial | `crawler-access.ts` — greedy regex | MEDIUM — some false positives |
| F-23 | Client component imports server-only modules | Yes | `scan-result/page.tsx` "use client" + crypto import | HIGH OPEN — build risk |
| PROOF-1 | Multi-page scanning not implemented | Yes | `scan-orchestrator.ts` always 1 page | CRITICAL OPEN — misrepresentation |
| PROOF-2 | 2 failing tests block CI | Yes | `fix-meta.test.ts` SCORE_IMPACT/EFFORT_MINUTES | HIGH OPEN |

## 5. Final Launch Gate

**Final verdict:** NOT LAUNCH READY

**Why:**
- Hard fail: `npm test` exits with 2 failures — any CI gate blocks deployment
- Hard fail: Pricing page advertises multi-page scanning (5/50/100 pages per tier) but it is not implemented — paying customers receive the same 1-page scan as free users. This is a billing misrepresentation.
- Critical open: `src/middleware.ts` absent — authenticated routes (`/dashboard`, `/scans/*`, `/settings/*`) are accessible to unauthenticated users by direct URL
- Critical open: `/verify` page missing — magic link email auth flow broken for all users
- Critical open: Both cron endpoints (`/api/cron/weekly-scan`, `/api/cron/drip`) are publicly triggerable when `CRON_SECRET` is not set in Vercel env
- High open: JWT + PrismaAdapter incompatibility can cause runtime 500s on sign-out

**Blockers:**
1. Create `src/middleware.ts` with NextAuth `withAuth` protecting `(dashboard)` routes
2. Create `src/app/verify/page.tsx` — "Check your email" branded page
3. Make `CRON_SECRET` mandatory in both cron routes (remove the `&&` short-circuit)
4. Implement multi-page scanning OR remove the per-tier page count from pricing immediately
5. Fix 2 failing unit tests in `fix-meta.test.ts`
6. Resolve JWT + PrismaAdapter conflict in `auth.ts`

**Resolution path:**
- [Create middleware.ts] — owner: backend-engineer — deadline: before next deploy
- [Create /verify page] — owner: frontend-engineer — deadline: before next deploy
- [Harden cron secret check] — owner: backend-engineer — deadline: before next deploy
- [Fix failing tests] — owner: any — deadline: before next deploy
- [Fix auth.ts strategy conflict] — owner: backend-engineer — deadline: before next deploy
- [Multi-page scan or pricing correction] — owner: product — deadline: before paid marketing spend

**Required next actions:**
- Implement all P0 blockers above before any production traffic push
- Set `CRON_SECRET` in Vercel environment variables immediately
- Verify `conduitscore.com` is verified in Resend dashboard
- After fixes: run `npm test` and confirm 0 failures before deploy
