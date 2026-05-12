# TASK LIST — Free Tier Gate Implementation
## Source: FREE_TIER_GATE_SYNTHESIS.md
## Core principle: "Diagnosis is free. Prescription is paid."

---

## 1. API Layer — Gate fix data at the source

- [ ] **`src/app/api/scan/[id]/route.ts`** (or wherever scan results are served) — For unauthenticated requests OR users on free tier:
  - Strip `fix.code` from all fixes except the first one
  - Strip `fix.description` from all fixes except the first one
  - Return `fix.locked: true` on all locked fixes
  - Return `fix.charCount: number` (character count of the real code) on locked fixes — shows "~340 chars" without revealing content
- [ ] **`src/app/api/scan/[id]/route.ts`** — Identify the "sample fix": select the first fix with lowest severity (info-level), mark it `fix.locked: false`, include full `fix.code` and `fix.description`
- [ ] **`src/app/api/scan/[id]/route.ts`** — Add `fix.sampleLabel: "Free sample"` flag to the one unlocked sample fix
- [ ] Ensure gate logic is enforced server-side — NOT just hidden in the UI (a free user hitting the API directly must not receive full fix data)
- [ ] Add `fix.scoreImpact` field to each fix (estimated points gained if fixed, e.g. `+8`) — served to all tiers including free (fuels desire)
- [ ] Add `fix.effortMinutes` field to each fix (estimated implementation time, e.g. `2`) — served to all tiers including free

---

## 2. Issue Count per Category — Score Header

- [ ] **`src/components/scan/category-breakdown.tsx`** — Add issue count badge to each category row
  - Shows: "3 issues" or "1 critical, 2 warnings" next to each category score bar
  - Visible to all users including free tier (per synthesis: "adds urgency")

---

## 3. Fix Panel — Lock Treatment for Free Users

- [ ] **`src/components/scan/fix-panel.tsx`** — Add tier/auth awareness: accept a `userTier: "free" | "starter" | "pro" | "growth" | "agency"` prop (or read from session context)
- [ ] **`src/components/scan/fix-panel.tsx`** — For locked fixes (`fix.locked === true`), render the **Inline Contextual Gate** instead of the code block:
  ```
  [lock icon]  Code fix available
  See the exact code to fix this.
  Includes [N] more fixes for this scan.
  [ Unlock Code Fixes — $29/mo ]
  No commitment. Cancel anytime.
  ```
  - Use `rgba(108,59,255,0.35)` purple border (existing design token)
  - Do NOT blur code — show nothing or show everything (no partial reveals)
- [ ] **`src/components/scan/fix-panel.tsx`** — Show `fix.charCount` below the lock gate: "~340 characters of code"
- [ ] **`src/components/scan/fix-panel.tsx`** — "Unlock Code Fixes — $29/mo" button calls `/api/stripe/checkout` with `{ tier: "starter" }` OR redirects to `/pricing` if user is not signed in
- [ ] **`src/components/scan/fix-panel.tsx`** — The one sample fix (first info-level): render full code block with label badge: **"Free sample — this is what all fixes look like"** (small badge above code block, cyan color)
- [ ] **`src/components/scan/fix-panel.tsx`** — Show `fix.scoreImpact` on every locked fix card: `"+8 points if fixed"` (visible before upgrade, creates desire)
- [ ] **`src/components/scan/fix-panel.tsx`** — Show `fix.effortMinutes` on every locked fix card: `"~2 min to implement"` (visible before upgrade)
- [ ] Upgrade prompt dynamic text: `"[N] fixes ready for [domain]. You've seen 1. Unlock the remaining [N-1]. — $29/mo, cancel anytime."` — use actual domain and count from scan data

---

## 4. Issue Descriptions — Soft Gate

- [ ] **`src/components/scan/issue-list.tsx`** — For free users, truncate `issue.description` after ~120 characters
- [ ] Append inline cyan link: `"... Upgrade to read"`
- [ ] Clicking "Upgrade to read" → scrolls to or opens the inline upgrade prompt (same `/pricing` or checkout flow)
- [ ] Issue titles remain fully visible to all users — never gate titles

---

## 5. Business Impact Statements per Issue

- [ ] **`src/lib/scan-orchestrator.ts`** (or wherever issues are generated/formatted) — Add `issue.impact` field with plain-English consequence line per issue type. Examples:
  - No structured data: `"Without this fix, your content cannot be cited by ChatGPT, Claude, or Perplexity."`
  - Missing llms.txt: `"AI crawlers cannot access any of your content because of this setting."`
  - No canonical URL: `"AI systems may index duplicate versions of this page, diluting your citation signal."`
- [ ] **`src/components/scan/issue-list.tsx`** — Render `issue.impact` as a small italic line below the issue title — visible FREE (diagnosis, not prescription)

---

## 6. Score Badge for High Scorers

- [ ] **`src/app/(dashboard)/scans/[id]/page.tsx`** — If `scan.overallScore >= 70`, show an embeddable badge option:
  - Badge text: `"ConduitScore Verified: [score]/100 AI-Visible"`
  - One-click copy of embed snippet `<img>` or `<a>` tag
  - Badge links back to `conduitscore.com/?ref=badge`
- [ ] Create badge image endpoint: `src/app/api/badge/[scanId]/route.ts` — returns SVG/PNG badge with score

---

## 7. Shareable Report URL — Confirm Always Public

- [ ] **`src/app/api/scan/[id]/route.ts`** — Confirm public scan reports are accessible without auth (shareable URL must always work)
- [ ] Confirm locked gate still applies on public view for free-tier scans (gate the code, not the URL)

---

## 8. Pricing Page — Update Tier Descriptions to Match Gate Logic

- [ ] **`src/app/pricing/page.tsx`** — Starter features: update to match synthesis spec exactly:
  - "Full issue descriptions"
  - "All fix code — complete, copyable"
  - "Fix prioritization + time estimates"
  - "50 scans per month"
  - "Scan history (last 10 scans)"
- [ ] **`src/app/pricing/page.tsx`** — Free features: add `"1 sample fix (see what fixes look like)"` to make the sample fix explicit in marketing copy
- [ ] **`src/app/pricing/page.tsx`** — Add comparison row: `"Code fixes unlocked"` — Free: "1 sample" | Starter+: ✓
- [ ] **`src/app/pricing/page.tsx`** — Add comparison row: `"Issue descriptions"` — Free: "Titles only" | Starter+: ✓

---

## 9. Deploy

- [ ] Run full test suite — must be 100% passing
- [ ] Run `npm run build` — confirm zero TypeScript/ESLint errors
- [ ] Manually test free-user flow: scan a URL → confirm only 1 fix shows full code → confirm locked fixes show gate UI
- [ ] Manually test signed-in Starter flow: confirm all fix code is visible
- [ ] Manually test API endpoint directly (no auth header) → confirm `fix.code` is absent on locked fixes
- [ ] Alex agent audit → `CATO_ALEX_AUDIT.md` — Status: APPROVED
- [ ] Kraken agent verification → `CATO_KRAKEN_VERDICT.md` — Status: GO
- [ ] Deploy via `python deploy_to_vercel.py`
- [ ] Verify live at `https://conduitscore.com` — test full free-user gate flow end-to-end
