import { NextRequest, NextResponse } from "next/server";
import { getStripe, getTierFromPriceId } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";

/**
 * Derives the canonical DB tier from a completed checkout session.
 *
 * Priority order:
 *   1. session.metadata.tier  — set by the checkout route; always the base name
 *      (e.g. "starter", not "starter_annual") regardless of billing cycle.
 *   2. Price ID reverse-lookup via getTierFromPriceId — fallback for sessions
 *      created before metadata was added.  getTierFromPriceId already strips
 *      the _annual suffix, so annual price IDs also yield the base tier name.
 *
 * Returns "free" when neither source yields a recognised tier.
 */
function resolveTierFromSession(
  session: Stripe.Checkout.Session,
  priceId: string
): string {
  const metaTier = session.metadata?.tier?.trim().toLowerCase();
  if (metaTier && metaTier !== "") {
    // Strip _annual suffix defensively in case legacy metadata included it.
    return metaTier.replace(/_annual$/, "");
  }
  return getTierFromPriceId(priceId);
}

/**
 * Derives the canonical DB tier from a subscription object.
 *
 * Priority order:
 *   1. subscription.metadata.tier  — present on subscriptions that were started
 *      via the updated checkout route (metadata propagates from the session).
 *   2. Price ID reverse-lookup via getTierFromPriceId — fallback for older subs.
 *
 * The _annual suffix is stripped in both paths so the DB always stores the
 * base tier name (starter / pro / growth).
 */
function resolveTierFromSubscription(
  sub: Stripe.Subscription,
  priceId: string
): string {
  const metaTier = sub.metadata?.tier?.trim().toLowerCase();
  if (metaTier && metaTier !== "") {
    return metaTier.replace(/_annual$/, "");
  }
  return getTierFromPriceId(priceId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Webhook signature verification — never bypass this check.
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        if (!email) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = subscription.items.data[0]?.price?.id ?? "";

        // Prefer session metadata tier (base name, no _annual); fall back to
        // price ID reverse-lookup.  Both paths produce the canonical tier name.
        const tier = resolveTierFromSession(session, priceId);

        // Upsert returns the full record — capture it to avoid a second round-trip.
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            subscriptionTier: tier,
            stripeCustomerId: session.customer as string,
          },
          create: {
            email,
            subscriptionTier: tier,
            stripeCustomerId: session.customer as string,
          },
        });
        if (!user) break;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            status: "active",
          },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            status: "active",
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id ?? "";

        // Prefer subscription metadata; fall back to price ID reverse-lookup.
        const tier = resolveTierFromSubscription(sub, priceId);

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            stripePriceId: priceId,
            status: sub.status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (dbSub) {
          await prisma.user.update({
            where: { id: dbSub.userId },
            data: { subscriptionTier: tier },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        // Subscription cancelled — downgrade user to free tier.
        const sub = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "canceled" },
        });

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (dbSub) {
          await prisma.user.update({
            where: { id: dbSub.userId },
            data: { subscriptionTier: "free" },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: invoice.customer as string },
          });
          if (user) {
            await prisma.payment.create({
              data: {
                userId: user.id,
                stripePaymentId:
                  (invoice as unknown as { payment_intent: string })
                    .payment_intent ?? "",
                amount: invoice.amount_paid,
                status: "succeeded",
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: invoice.customer as string },
          });
          if (user) {
            await prisma.payment.create({
              data: {
                userId: user.id,
                stripePaymentId: (
                  invoice as unknown as { payment_intent: string }
                ).payment_intent ?? "",
                amount: invoice.amount_due,
                status: "failed",
              },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
