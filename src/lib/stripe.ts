import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
    });
  }
  return _stripe;
}

export const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  pro: process.env.STRIPE_PRICE_PRO ?? "",
  agency: process.env.STRIPE_PRICE_AGENCY ?? "",
};

export function getTierFromPriceId(priceId: string): string {
  for (const [tier, id] of Object.entries(PRICE_MAP)) {
    if (id === priceId) return tier;
  }
  return "free";
}
