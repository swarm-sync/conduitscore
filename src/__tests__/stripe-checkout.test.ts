/**
 * Section 2: Stripe Checkout Route Tests
 * Tests for src/app/api/stripe/checkout/route.ts
 *
 * All Stripe API calls and session lookups are mocked.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock @/lib/session ────────────────────────────────────────────────────────
vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

import { getSession } from "@/lib/session";

// ── Set env vars so PRICE_MAP is populated ───────────────────────────────────
// These must be set before the route module is imported so the module-level
// PRICE_MAP constant reads them correctly.
const PRICES = {
  STRIPE_PRICE_STARTER:        "price_starter_monthly",
  STRIPE_PRICE_STARTER_ANNUAL: "price_starter_annual",
  STRIPE_PRICE_PRO:            "price_pro_monthly",
  STRIPE_PRICE_PRO_ANNUAL:     "price_pro_annual",
  STRIPE_PRICE_GROWTH:         "price_growth_monthly",
  STRIPE_PRICE_GROWTH_ANNUAL:  "price_growth_annual",
  STRIPE_SECRET_KEY:           "sk_test_mock",
};

Object.entries(PRICES).forEach(([k, v]) => {
  process.env[k] = v;
});

// Import the route handler AFTER env vars and mocks are in place.
const { POST } = await import("@/app/api/stripe/checkout/route");

// ── Helper to build a NextRequest ────────────────────────────────────────────
function makeRequest(body: unknown, origin = "https://conduitscore.com") {
  return new NextRequest("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
    },
    body: JSON.stringify(body),
  });
}

// ── Authenticated session fixture ─────────────────────────────────────────────
const AUTHED_SESSION = { user: { email: "user@example.com" } };

// ── Global fetch mock ─────────────────────────────────────────────────────────
// Replaces the global fetch so we never hit real Stripe.
function mockStripeFetch(url: string, priceId: string) {
  return Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        url: `https://checkout.stripe.com/pay/${priceId}`,
      }),
    status: 200,
  } as Response);
}

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.mocked(getSession).mockResolvedValue(AUTHED_SESSION as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Happy-path tier tests ────────────────────────────────────────────────────

  it("POST { tier: 'starter' } → 200 with checkout URL", async () => {
    const capturedArgs: { url: string; priceId: string }[] = [];
    vi.stubGlobal(
      "fetch",
      async (url: RequestInfo | URL, init?: RequestInit) => {
        const bodyStr = (init?.body as string) ?? "";
        const params = new URLSearchParams(bodyStr);
        capturedArgs.push({
          url: url.toString(),
          priceId: params.get("line_items[0][price]") ?? "",
        });
        return mockStripeFetch(url.toString(), params.get("line_items[0][price]") ?? "");
      }
    );

    const req = makeRequest({ tier: "starter" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toContain("price_starter_monthly");
    expect(capturedArgs[0].priceId).toBe("price_starter_monthly");
  });

  it("POST { tier: 'starter', annual: true } → uses starter_annual price ID", async () => {
    let capturedPriceId = "";
    vi.stubGlobal("fetch", async (_url: RequestInfo | URL, init?: RequestInit) => {
      const params = new URLSearchParams((init?.body as string) ?? "");
      capturedPriceId = params.get("line_items[0][price]") ?? "";
      return {
        ok: true,
        json: () => Promise.resolve({ url: "https://checkout.stripe.com/pay/annual" }),
        status: 200,
      } as Response;
    });

    const req = makeRequest({ tier: "starter", annual: true });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(capturedPriceId).toBe("price_starter_annual");
    expect(data.url).toBeDefined();
  });

  it("POST { tier: 'pro' } → correct pro price ID sent to Stripe", async () => {
    let capturedPriceId = "";
    vi.stubGlobal("fetch", async (_url: RequestInfo | URL, init?: RequestInit) => {
      const params = new URLSearchParams((init?.body as string) ?? "");
      capturedPriceId = params.get("line_items[0][price]") ?? "";
      return {
        ok: true,
        json: () => Promise.resolve({ url: "https://checkout.stripe.com/pay/pro" }),
        status: 200,
      } as Response;
    });

    const req = makeRequest({ tier: "pro" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(capturedPriceId).toBe("price_pro_monthly");
  });

  it("POST { tier: 'growth' } → correct growth price ID sent to Stripe", async () => {
    let capturedPriceId = "";
    vi.stubGlobal("fetch", async (_url: RequestInfo | URL, init?: RequestInit) => {
      const params = new URLSearchParams((init?.body as string) ?? "");
      capturedPriceId = params.get("line_items[0][price]") ?? "";
      return {
        ok: true,
        json: () => Promise.resolve({ url: "https://checkout.stripe.com/pay/growth" }),
        status: 200,
      } as Response;
    });

    const req = makeRequest({ tier: "growth" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(capturedPriceId).toBe("price_growth_monthly");
  });

  // ── Error / rejection tests ─────────────────────────────────────────────────

  it("POST { tier: 'agency' } → 400 (Contact Us only, no Stripe checkout)", async () => {
    // No fetch mock needed — route returns 400 before calling Stripe
    const req = makeRequest({ tier: "agency" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/agency/i);
  });

  it("POST { tier: 'invalid_tier' } → 400 (unrecognised tier)", async () => {
    // The env-based PRICE_MAP has no key for 'invalid_tier', so priceId is ''
    const req = makeRequest({ tier: "invalid_tier" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("POST with missing tier → 400", async () => {
    // When tier is undefined, key lookup produces PRICE_MAP["undefined"] = undefined → 400
    const req = makeRequest({});
    const res = await POST(req);
    await res.json();

    expect(res.status).toBe(400);
  });

  // ── Unauthenticated user → redirect to sign-in ───────────────────────────────

  it("Unauthenticated request → 302 redirect to /signin", async () => {
    vi.mocked(getSession).mockResolvedValue(null as never);

    const req = makeRequest({ tier: "starter" });
    const res = await POST(req);

    // NextResponse.redirect returns a 302
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toContain("/signin");
    expect(location).toContain("callbackUrl=%2Fpricing");
  });

  it("Unauthenticated yearly request → 302 redirect preserves yearly billing callback", async () => {
    vi.mocked(getSession).mockResolvedValue(null as never);

    const req = makeRequest({ tier: "starter", annual: true });
    const res = await POST(req);

    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toContain("/signin");
    expect(location).toContain("callbackUrl=%2Fpricing%3Fbilling%3Dyearly");
  });
});
