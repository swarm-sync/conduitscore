# ZANE_STRIPE_SETUP.md
# ConduitScore — Manual Stripe Dashboard Setup Guide
# Author: Zane (payments architecture)
# Date: 2026-03-16

---

## Overview

The six prices below must be created manually in the Stripe Dashboard.
Stripe does not provide a public API for creating prices programmatically
outside of test mode without additional OAuth, so this is intentional.

After creating each price, copy its `price_xxxx` ID and set it as the
corresponding environment variable in both:

  1. Vercel Dashboard → Your Project → Settings → Environment Variables → Production
  2. `.env.local` in the project root (for local development)

---

## Prices to Create

### 1. Starter Monthly
- **Product name**: ConduitScore Starter
- **Pricing model**: Standard pricing
- **Price**: $29.00 USD
- **Billing period**: Monthly (interval: `month`)
- **Metadata** (add under "Additional options" → "Metadata"):
  - `tier` = `starter`
  - `billing` = `monthly`
- **After creation** → set env var: `STRIPE_PRICE_STARTER=price_xxxx`

---

### 2. Starter Annual
- **Product name**: ConduitScore Starter (Annual)
- **Pricing model**: Standard pricing
- **Price**: $276.00 USD
- **Billing period**: Yearly (interval: `year`)
- **Note**: This is $23/mo equivalent. Stripe amount in cents: `27600`
- **Metadata**:
  - `tier` = `starter`
  - `billing` = `annual`
- **After creation** → set env var: `STRIPE_PRICE_STARTER_ANNUAL=price_xxxx`

---

### 3. Pro Monthly
- **Product name**: ConduitScore Pro
- **Pricing model**: Standard pricing
- **Price**: $49.00 USD
- **Billing period**: Monthly (interval: `month`)
- **Metadata**:
  - `tier` = `pro`
  - `billing` = `monthly`
- **After creation** → set env var: `STRIPE_PRICE_PRO=price_xxxx`
- **Note**: An existing monthly Pro price `price_1TAtIfPQdMywmVkHygVS8A77` is at $49/mo.
  If that price is already at $49 and active, you may reuse it instead of creating a new one.
  Create a new price only if the amount changed.

---

### 4. Pro Annual
- **Product name**: ConduitScore Pro (Annual)
- **Pricing model**: Standard pricing
- **Price**: $468.00 USD
- **Billing period**: Yearly (interval: `year`)
- **Note**: This is $39/mo equivalent. Stripe amount in cents: `46800`
- **Metadata**:
  - `tier` = `pro`
  - `billing` = `annual`
- **After creation** → set env var: `STRIPE_PRICE_PRO_ANNUAL=price_xxxx`

---

### 5. Growth Monthly
- **Product name**: ConduitScore Growth
- **Pricing model**: Standard pricing
- **Price**: $79.00 USD
- **Billing period**: Monthly (interval: `month`)
- **Metadata**:
  - `tier` = `growth`
  - `billing` = `monthly`
- **After creation** → set env var: `STRIPE_PRICE_GROWTH=price_xxxx`

---

### 6. Growth Annual
- **Product name**: ConduitScore Growth (Annual)
- **Pricing model**: Standard pricing
- **Price**: $756.00 USD
- **Billing period**: Yearly (interval: `year`)
- **Note**: This is $63/mo equivalent. Stripe amount in cents: `75600`
- **Metadata**:
  - `tier` = `growth`
  - `billing` = `annual`
- **After creation** → set env var: `STRIPE_PRICE_GROWTH_ANNUAL=price_xxxx`

---

## Prices to Archive (Deactivate)

The following old prices should be set to `active: false` in the Stripe Dashboard
so no new checkouts can use them. Existing subscriptions on these prices continue
to bill until cancelled; archiving only blocks new checkouts.

| Old Price ID | Amount | Action |
|---|---|---|
| `price_1SyDvlPQdMywmVkHIxscjxeM` | Old Starter monthly ($19) | Archive |
| `price_1TAtIoPQdMywmVkHDaGiA9Kd` | Old Agency price ($99) | Archive |

To archive: Stripe Dashboard → Products → find the product → Prices tab → "..." menu → Archive.

---

## Agency Plan — No Stripe Price

Agency ($149/mo) is a "Contact Us" plan only.

- Do NOT create a Stripe price for Agency.
- The checkout API route returns HTTP 400 if `tier === "agency"` is submitted.
- Direct contact email: `benstone@conduitscore.com`

---

## Vercel Environment Variables Checklist

After creating all six prices, add/update these variables in Vercel:

| Variable | Value | Notes |
|---|---|---|
| `STRIPE_PRICE_STARTER` | `price_xxxx` | New $29/mo price |
| `STRIPE_PRICE_STARTER_ANNUAL` | `price_xxxx` | New $276/yr price |
| `STRIPE_PRICE_PRO` | `price_xxxx` | $49/mo (may reuse existing) |
| `STRIPE_PRICE_PRO_ANNUAL` | `price_xxxx` | New $468/yr price |
| `STRIPE_PRICE_GROWTH` | `price_xxxx` | New $79/mo price |
| `STRIPE_PRICE_GROWTH_ANNUAL` | `price_xxxx` | New $756/yr price |
| `STRIPE_SECRET_KEY` | (already set) | Verify still valid |
| `STRIPE_WEBHOOK_SECRET` | (already set) | Verify still valid |
| `STRIPE_PRICE_AGENCY` | — | Remove or leave unset |

---

## Webhook: Confirm Subscribed Events

In Stripe Dashboard → Developers → Webhooks → your endpoint:

Confirm these events are enabled:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## How Tier Metadata Flows

1. Checkout route receives `{ tier: "growth", annual: true }` from the frontend.
2. Checkout route sets `metadata[tier]=growth` and `metadata[billing]=annual` on the Stripe session.
3. Webhook `checkout.session.completed` reads `session.metadata.tier` → writes `subscriptionTier: "growth"` to DB.
4. If metadata is absent (legacy sessions), the webhook falls back to price ID reverse-lookup via `getTierFromPriceId`.
5. `_annual` suffix is stripped at every path so the DB always stores `starter` / `pro` / `growth`, never `starter_annual`.
