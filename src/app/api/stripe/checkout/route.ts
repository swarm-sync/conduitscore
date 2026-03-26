import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/**
 * Maps tier + billing-cycle keys to Stripe price IDs via environment variables.
 *
 * Lookup key is built as:
 *   annual === true  → `${tier}_annual`
 *   annual === false → `${tier}`
 *
 * agency is intentionally absent — Agency is Contact Us only; any request with
 * tier === "agency" receives a 400 before this map is consulted.
 */
const PRICE_MAP: Record<string, string> = {
  starter:        process.env.STRIPE_PRICE_STARTER         ?? "",
  starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL  ?? "",
  pro:            process.env.STRIPE_PRICE_PRO             ?? "",
  pro_annual:     process.env.STRIPE_PRICE_PRO_ANNUAL      ?? "",
  growth:         process.env.STRIPE_PRICE_GROWTH          ?? "",
  growth_annual:  process.env.STRIPE_PRICE_GROWTH_ANNUAL   ?? "",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, annual = false }: { tier: string; annual?: boolean } = body;

    // Require an authenticated session before creating a checkout.
    // Unauthenticated requests are redirected to sign-in with a callback to
    // /pricing so the user lands back on the pricing page after authentication.
    const session = await getSession();
    if (!session?.user?.email) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", annual ? "/pricing?billing=yearly" : "/pricing");
      return NextResponse.redirect(signInUrl, { status: 302 });
    }

    // Agency is Contact Us only — no Stripe checkout flow exists for this tier.
    if (tier === "agency") {
      return NextResponse.json(
        { error: "Agency plan requires direct contact — see benstone@conduitscore.com" },
        { status: 400 }
      );
    }

    // Build the lookup key: e.g. "starter" (monthly) or "starter_annual".
    const key = annual ? `${tier}_annual` : tier;
    const priceId = PRICE_MAP[key];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan tier" }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
    const origin = request.headers.get("origin") || "https://conduitscore.com";
    const billing = annual ? "annual" : "monthly";

    // Use native fetch instead of Stripe SDK (SDK's http module blocked on Vercel edge).
    const params = new URLSearchParams({
      mode: "subscription",
      "payment_method_types[0]": "card",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      // Pre-fill customer email from the authenticated session.
      customer_email: session.user.email,
      // Metadata is read by the webhook handler to set subscriptionTier in the DB.
      // tier is the canonical base name (starter / pro / growth).
      // billing distinguishes monthly from annual for analytics and audit trails.
      "metadata[tier]": tier,
      "metadata[billing]": billing,
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "Stripe error" },
        { status: res.status }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
