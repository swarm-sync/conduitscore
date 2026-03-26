import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripeEnv(name: string): string {
  const raw = process.env[name] ?? "";
  return raw
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/(?:\\r\\n|\\n|\\r)+$/g, "")
    .trim();
}

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getStripeEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
    });
  }
  return _stripe;
}

/**
 * Maps price-map keys to Stripe price IDs via environment variables.
 *
 * Keys follow the pattern <tier> and <tier>_annual.
 * Annual keys are kept so the webhook can reverse-lookup by price ID.
 * getTierFromPriceId() always strips the _annual suffix before returning
 * so the database always stores the canonical tier name (starter / pro / growth).
 *
 * agency is intentionally omitted — Agency is Contact Us only; no Stripe price exists.
 */
export const PRICE_MAP: Record<string, string> = {
  starter:        getStripeEnv("STRIPE_PRICE_STARTER"),
  starter_annual: getStripeEnv("STRIPE_PRICE_STARTER_ANNUAL"),
  pro:            getStripeEnv("STRIPE_PRICE_PRO"),
  pro_annual:     getStripeEnv("STRIPE_PRICE_PRO_ANNUAL"),
  growth:         getStripeEnv("STRIPE_PRICE_GROWTH"),
  growth_annual:  getStripeEnv("STRIPE_PRICE_GROWTH_ANNUAL"),
};

/**
 * Reverse-lookup: given a Stripe price ID, return the canonical DB tier name.
 *
 * Annual price IDs map to the same tier as their monthly counterpart
 * (e.g. price ID for starter_annual → "starter").
 *
 * Returns "free" when the price ID is unrecognised.
 */
export function getTierFromPriceId(priceId: string): string {
  for (const [key, id] of Object.entries(PRICE_MAP)) {
    if (id && id === priceId) {
      // Strip _annual suffix so the DB always stores the base tier name.
      return key.replace(/_annual$/, "");
    }
  }
  return "free";
}
