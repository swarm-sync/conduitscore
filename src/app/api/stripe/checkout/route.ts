import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStripe, PRICE_MAP } from "@/lib/stripe";

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

    const origin = request.headers.get("origin") || "https://conduitscore.com";
    const billing = annual ? "annual" : "monthly";

    // Idempotency key prevents double-charges if the client retries the request.
    const idempotencyKey = `checkout-${session.user.email}-${key}-${Date.now()}`;

    const checkoutSession = await getStripe().checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        // Pre-fill customer email from the authenticated session.
        customer_email: session.user.email,
        // Metadata is read by the webhook handler to set subscriptionTier in the DB.
        // tier is the canonical base name (starter / pro / growth).
        // billing distinguishes monthly from annual for analytics and audit trails.
        metadata: { tier, billing },
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing`,
      },
      { idempotencyKey }
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
