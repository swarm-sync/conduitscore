import { describe, expect, it } from "vitest";
import { getStripeEnv } from "@/lib/stripe";

describe("getStripeEnv()", () => {
  it("trims whitespace and surrounding quotes from env values", () => {
    process.env.STRIPE_PRICE_TEST = "\"price_123\\r\\n\"";

    expect(getStripeEnv("STRIPE_PRICE_TEST")).toBe("price_123");
  });

  it("returns an empty string when the env var is missing", () => {
    delete process.env.STRIPE_PRICE_MISSING;

    expect(getStripeEnv("STRIPE_PRICE_MISSING")).toBe("");
  });
});
