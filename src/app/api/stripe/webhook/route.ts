import { NextRequest, NextResponse } from "next/server";
import { getStripe, getTierFromPriceId } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        if (!email) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price?.id ?? "";
        const tier = getTierFromPriceId(priceId);

        await prisma.user.upsert({
          where: { email },
          update: { subscriptionTier: tier, stripeCustomerId: session.customer as string },
          create: { email, subscriptionTier: tier, stripeCustomerId: session.customer as string },
        });

        await prisma.subscription.upsert({
          where: { userId: (await prisma.user.findUnique({ where: { email } }))!.id },
          update: { stripeSubscriptionId: subscription.id, stripePriceId: priceId, status: "active" },
          create: {
            userId: (await prisma.user.findUnique({ where: { email } }))!.id,
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
        const tier = getTierFromPriceId(priceId);
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { stripePriceId: priceId, status: sub.status, cancelAtPeriodEnd: sub.cancel_at_period_end },
        });
        const dbSub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } });
        if (dbSub) {
          await prisma.user.update({ where: { id: dbSub.userId }, data: { subscriptionTier: tier } });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "canceled" },
        });
        const dbSub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } });
        if (dbSub) {
          await prisma.user.update({ where: { id: dbSub.userId }, data: { subscriptionTier: "free" } });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const user = await prisma.user.findFirst({ where: { stripeCustomerId: invoice.customer as string } });
          if (user) {
            await prisma.payment.create({
              data: { userId: user.id, stripePaymentId: (invoice as unknown as { payment_intent: string }).payment_intent ?? "", amount: invoice.amount_paid, status: "succeeded" },
            });
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const user = await prisma.user.findFirst({ where: { stripeCustomerId: invoice.customer as string } });
          if (user) {
            await prisma.payment.create({
              data: { userId: user.id, stripePaymentId: (invoice as unknown as { payment_intent: string }).payment_intent, amount: invoice.amount_due, status: "failed" },
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
