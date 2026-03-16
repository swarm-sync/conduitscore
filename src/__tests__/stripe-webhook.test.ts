/**
 * Section 2 (continued): Stripe Webhook Route Tests
 * Tests for src/app/api/stripe/webhook/route.ts
 *
 * Prisma and Stripe SDK are fully mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock Prisma ───────────────────────────────────────────────────────────────
const mockPrismaUserUpsert     = vi.fn();
const mockPrismaUserUpdate     = vi.fn();
const mockPrismaUserFindUnique = vi.fn();
const mockPrismaUserFindFirst  = vi.fn();
const mockPrismaSubUpsert      = vi.fn();
const mockPrismaSubUpdateMany  = vi.fn();
const mockPrismaSubFindFirst   = vi.fn();
const mockPrismaPaymentCreate  = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      upsert:     mockPrismaUserUpsert,
      update:     mockPrismaUserUpdate,
      findUnique: mockPrismaUserFindUnique,
      findFirst:  mockPrismaUserFindFirst,
    },
    subscription: {
      upsert:     mockPrismaSubUpsert,
      updateMany: mockPrismaSubUpdateMany,
      findFirst:  mockPrismaSubFindFirst,
    },
    payment: {
      create: mockPrismaPaymentCreate,
    },
  },
}));

// ── Mock @/lib/stripe (Stripe SDK) ────────────────────────────────────────────
// constructEvent is the webhook signature verifier; we control it per-test.
const mockConstructEvent         = vi.fn();
const mockSubscriptionsRetrieve  = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
    subscriptions: {
      retrieve: mockSubscriptionsRetrieve,
    },
  }),
  getTierFromPriceId: (priceId: string) => {
    const map: Record<string, string> = {
      price_starter_monthly: "starter",
      price_starter_annual:  "starter",
      price_pro_monthly:     "pro",
      price_pro_annual:      "pro",
      price_growth_monthly:  "growth",
      price_growth_annual:   "growth",
    };
    return map[priceId] ?? "free";
  },
}));

// Import the route AFTER all mocks are configured.
const { POST } = await import("@/app/api/stripe/webhook/route");

// ── Helper: build a webhook request ─────────────────────────────────────────
function makeWebhookRequest(body = "{}") {
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": "t=123,v1=valid",
    },
    body,
  });
}

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: all Prisma calls resolve successfully
    mockPrismaUserUpsert.mockResolvedValue({ id: "user-1", email: "user@example.com" });
    mockPrismaUserUpdate.mockResolvedValue({});
    mockPrismaUserFindUnique.mockResolvedValue({ id: "user-1", email: "user@example.com" });
    mockPrismaUserFindFirst.mockResolvedValue({ id: "user-1" });
    mockPrismaSubUpsert.mockResolvedValue({});
    mockPrismaSubUpdateMany.mockResolvedValue({});
    mockPrismaSubFindFirst.mockResolvedValue({ userId: "user-1", stripeSubscriptionId: "sub_1" });
    mockPrismaPaymentCreate.mockResolvedValue({});
    mockSubscriptionsRetrieve.mockResolvedValue({
      id: "sub_1",
      items: { data: [{ price: { id: "price_growth_monthly" } }] },
      metadata: { tier: "growth" },
    });
  });

  // ── checkout.session.completed with growth tier ───────────────────────────

  it("checkout.session.completed with metadata.tier='growth' → subscriptionTier set to 'growth'", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          customer_email: "user@example.com",
          customer: "cus_1",
          subscription: "sub_1",
          metadata: { tier: "growth", billing: "monthly" },
          customer_details: null,
        },
      },
    });
    mockSubscriptionsRetrieve.mockResolvedValue({
      id: "sub_1",
      items: { data: [{ price: { id: "price_growth_monthly" } }] },
    });

    const req = makeWebhookRequest();
    const res = await POST(req);

    expect(res.status).toBe(200);
    // The upsert must have been called with subscriptionTier: "growth"
    expect(mockPrismaUserUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ subscriptionTier: "growth" }),
      })
    );
  });

  // ── checkout.session.completed with starter_annual tier ───────────────────

  it("checkout.session.completed with metadata.tier='starter_annual' → subscriptionTier set to 'starter' (suffix stripped)", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          customer_email: "user@example.com",
          customer: "cus_1",
          subscription: "sub_1",
          // Simulate legacy metadata that still has _annual suffix
          metadata: { tier: "starter_annual", billing: "annual" },
          customer_details: null,
        },
      },
    });
    mockSubscriptionsRetrieve.mockResolvedValue({
      id: "sub_1",
      items: { data: [{ price: { id: "price_starter_annual" } }] },
    });

    const req = makeWebhookRequest();
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockPrismaUserUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ subscriptionTier: "starter" }),
      })
    );
  });

  // ── customer.subscription.deleted → free ─────────────────────────────────

  it("customer.subscription.deleted → subscriptionTier reset to 'free'", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_1",
          items: { data: [{ price: { id: "price_growth_monthly" } }] },
          metadata: {},
        },
      },
    });
    mockPrismaSubFindFirst.mockResolvedValue({ userId: "user-1", stripeSubscriptionId: "sub_1" });

    const req = makeWebhookRequest();
    const res = await POST(req);

    expect(res.status).toBe(200);
    // User must have been updated to "free"
    expect(mockPrismaUserUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ subscriptionTier: "free" }),
      })
    );
  });

  // ── Invalid / missing signature → 400 ─────────────────────────────────────

  it("Invalid webhook signature → returns 400", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature for payload");
    });

    const req = new NextRequest("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "t=bad,v1=invalid",
      },
      body: "{}",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("Missing stripe-signature header → returns 400 before constructEvent", async () => {
    const req = new NextRequest("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
