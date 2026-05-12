# TASK LIST — Pricing Restructure
## New tiers: Free | Starter $29 | Pro $49 | Growth $79 | Agency $149 (Contact Us)

---

## 1. Stripe — New Price IDs

- [ ] Create new Stripe product price: **Starter — $29/mo** (monthly) in Stripe dashboard
- [ ] Create new Stripe product price: **Starter — $23/mo** (annual, billed $276/yr) in Stripe dashboard
- [ ] Create new Stripe product price: **Pro — $49/mo** (monthly) in Stripe dashboard
- [ ] Create new Stripe product price: **Pro — $39/mo** (annual, billed $468/yr) in Stripe dashboard
- [ ] Create new Stripe product price: **Growth — $79/mo** (monthly) in Stripe dashboard
- [ ] Create new Stripe product price: **Growth — $63/mo** (annual, billed $756/yr) in Stripe dashboard
- [ ] Note: Agency tier is Contact Us only — no Stripe price needed
- [ ] Add all 6 new price IDs to Vercel environment variables:
  - `STRIPE_PRICE_STARTER` (monthly)
  - `STRIPE_PRICE_STARTER_ANNUAL`
  - `STRIPE_PRICE_PRO` (monthly)
  - `STRIPE_PRICE_PRO_ANNUAL`
  - `STRIPE_PRICE_GROWTH` (monthly)
  - `STRIPE_PRICE_GROWTH_ANNUAL`
- [ ] Archive / deactivate old Stripe prices ($19 Starter, $99 Agency)

---

## 2. Backend — API & Database

- [ ] **`src/app/api/stripe/checkout/route.ts`** — Update `PRICE_MAP` to include `starter`, `pro`, `growth` keys; remove `agency` key
- [ ] **`src/app/api/stripe/checkout/route.ts`** — Add annual billing toggle: accept `{ tier, annual: boolean }` in POST body and select monthly vs. annual price ID accordingly
- [ ] **`src/app/api/stripe/webhook/route.ts`** — Update tier name mapping from Stripe metadata: ensure `growth` tier is stored correctly in `user.subscriptionTier`
- [ ] **`prisma/schema.prisma`** — Confirm `subscriptionTier` enum/string accepts `"growth"` as valid value
- [ ] **`src/lib/auth.ts`** (or wherever tier limits are defined) — Update scan limits per tier:
  - `free`: 3 scans/mo
  - `starter`: 50 scans/mo
  - `pro`: 100 scans/mo
  - `growth`: 500 scans/mo
  - `agency`: unlimited
- [ ] Run `prisma migrate dev` (or `prisma db push`) to apply any schema changes

---

## 3. Pricing Page — `src/app/pricing/page.tsx`

- [ ] Rename old "Agency" plan object → **"Growth"**, price `$79`, period `/mo`, annualNote `$63/mo billed annually`
- [ ] Update Growth features list:
  - "500 scans per month"
  - "Everything in Pro"
  - "Score trend history chart"
  - "Scheduled weekly re-scans"
  - "Email alerts on score drop"
  - "Priority support"
- [ ] Add new **"Agency"** plan object: price `$149`, no `period`, no `annualNote`, description `"For agencies managing client sites"`, `contactOnly: true`
- [ ] Update Agency features list:
  - "Unlimited scans"
  - "Everything in Growth"
  - "Bulk scan (CSV upload)"
  - "REST API access"
  - "Dedicated account manager"
  - "Custom onboarding"
- [ ] Set `popular: true` on the **Pro** card (was Pro at $49 — keep as recommended)
- [ ] Update `comparisonRows` table:
  - Change "Monthly price" row: Free $0 | Starter $29 | Pro $49 | Growth $79 | Agency $149
  - Add Growth column throughout
  - Add row: "Scans per month" — 3 | 50 | 100 | 500 | Unlimited
  - Add row: "Score trend chart" — — | — | — | ✓ | ✓
  - Add row: "Email alerts" — — | — | — | ✓ | ✓
  - Remove rows for features being eliminated (white-label, team seats, etc.)
- [ ] Update page `<title>` metadata description to reflect new prices
- [ ] Update FAQ answer for "Do you offer annual billing discounts?" to remove reference to "$99 Agency"
- [ ] Update JSON-LD structured data `plans.map()` to reflect 5 plans (Free, Starter, Pro, Growth, Agency)

---

## 4. PricingCard Component — `src/components/pricing/pricing-card.tsx`

- [ ] Add `contactOnly?: boolean` prop to `PricingCardProps` interface
- [ ] In `handleSubscribe()`: add `if (name === "Agency" || contactOnly)` branch → `window.location.href = "mailto:benstone@conduitscore.com"` (replace existing `sales@conduitscore.com` check)
- [ ] Update CTA button label for Agency card: **"Contact Us"** (not "Get Started")
- [ ] For Agency card: render button with a distinct style (e.g., outlined/ghost) to visually signal it's not a self-serve purchase
- [ ] Update `PRICE_MAP` tier key reference in `handleSubscribe` if it builds the tier name from `name.toLowerCase()` — ensure `"growth"` maps correctly

---

## 5. Dashboard & Settings — Tier Display

- [ ] **`src/app/(dashboard)/layout.tsx`** or settings page — Update any hardcoded tier label display so `"growth"` renders as **"Growth"** (capitalised, user-facing)
- [ ] **Billing/settings page** — Update plan upgrade CTAs to show correct tier names and prices ($29/$49/$79/$149)
- [ ] Ensure "Upgrade to Pro" prompts inside the app reference the correct tier names

---

## 6. Header Navigation — `src/components/layout/header.tsx`

- [ ] Confirm nav links include **Pricing** (already exists — verify it links to `/pricing`)
- [ ] Per homepage redesign spec: keep only Logo | Pricing | Sign In — remove any other nav links if present

---

## 7. Deploy

- [ ] Run full test suite: `pytest` / `npm run test` — must be 100% passing
- [ ] Run `npm run build` locally — confirm zero TypeScript/ESLint errors
- [ ] Alex agent audit → `CATO_ALEX_AUDIT.md` — Status: APPROVED
- [ ] Kraken agent verification → `CATO_KRAKEN_VERDICT.md` — Status: GO
- [ ] Deploy via `python deploy_to_vercel.py`
- [ ] Verify live at `https://conduitscore.com/pricing` — confirm all 5 cards render correctly
- [ ] Test Agency "Contact Us" button opens `mailto:benstone@conduitscore.com`
- [ ] Test Starter/Pro/Growth "Get Started" buttons launch Stripe checkout with correct price IDs
