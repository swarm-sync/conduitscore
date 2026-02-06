# Chunk 5: Payments (Stripe Integration)

## Goal
Users subscribe to Starter/Pro/Agency via Stripe Checkout. Subscription management via Customer Portal. Plan limits enforced.

## CRITICAL: Stripe Product Names (Business-Specific)
All Stripe products MUST use the AgentOptimize_ prefix:
- AgentOptimize_Starter ($29/month)
- AgentOptimize_Pro ($79/month)
- AgentOptimize_Agency ($149/month)

## Stripe API Commands (run these to create products)
```bash
# Create Starter product
curl https://api.stripe.com/v1/products -u "$STRIPE_SECRET_KEY:" \
  -d "name=AgentOptimize_Starter" -d "description=Starter Plan - 5 pages, dashboard, PDF reports"

# Create Starter price
curl https://api.stripe.com/v1/prices -u "$STRIPE_SECRET_KEY:" \
  -d "product={starter_product_id}" -d "unit_amount=2900" -d "currency=usd" \
  -d "recurring[interval]=month" -d "nickname=AgentOptimize_Price_Starter"

# Create Pro product
curl https://api.stripe.com/v1/products -u "$STRIPE_SECRET_KEY:" \
  -d "name=AgentOptimize_Pro" -d "description=Pro Plan - 50 pages, monitoring, alerts"

# Create Pro price
curl https://api.stripe.com/v1/prices -u "$STRIPE_SECRET_KEY:" \
  -d "product={pro_product_id}" -d "unit_amount=7900" -d "currency=usd" \
  -d "recurring[interval]=month" -d "nickname=AgentOptimize_Price_Pro"

# Create Agency product
curl https://api.stripe.com/v1/products -u "$STRIPE_SECRET_KEY:" \
  -d "name=AgentOptimize_Agency" -d "description=Agency Plan - Unlimited, white-label, API"

# Create Agency price
curl https://api.stripe.com/v1/prices -u "$STRIPE_SECRET_KEY:" \
  -d "product={agency_product_id}" -d "unit_amount=14900" -d "currency=usd" \
  -d "recurring[interval]=month" -d "nickname=AgentOptimize_Price_Agency"
```

## Required Environment Variables
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_PRICE_STARTER (price_xxx from created price)
- STRIPE_PRICE_PRO (price_xxx from created price)
- STRIPE_PRICE_AGENCY (price_xxx from created price)
- STRIPE_WEBHOOK_SECRET (whsec_xxx from webhook)

## Tasks
1. Create lib/stripe.ts with lazy Stripe client (explicit apiVersion: '2024-12-18.acacia')
2. Create lib/stripe-helpers.ts with price mapping and plan lookup
3. Create POST /api/stripe/checkout — create checkout session (NO login wall!)
4. Create POST /api/stripe/webhook — handle 5 event types
5. Create GET /api/stripe/portal — customer portal session
6. Build CheckoutButton component — calls checkout API, redirects to Stripe
7. Build ManageSubscription component — links to portal
8. Build PlanBadge and UsageBar components
9. Create settings/billing page showing plan, usage, payment history
10. Implement plan enforcement in scan API
11. Verify: checkout redirects to Stripe, webhook processes, limits enforced

## CRITICAL UX: Subscribe → Stripe (NO Login Wall)
Subscribe button goes DIRECTLY to Stripe Checkout. No login required first.
Stripe collects email during checkout. Account created via webhook after payment.

```tsx
async function handleSubscribe(tier: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ priceId: tier }),
  })
  const { url } = await res.json()
  window.location.href = url  // Direct to Stripe
}
```

## Done Means
- Subscribe button redirects to Stripe Checkout (not login)
- Stripe Checkout shows correct price
- Webhook processes checkout.session.completed
- User tier updates in database
- Plan limits enforced on scan API
- Customer Portal accessible
- `npm run typecheck && npm test && npm run build` passes

## Scoreboard
```powershell
npm run typecheck && npm test && npm run build
```
