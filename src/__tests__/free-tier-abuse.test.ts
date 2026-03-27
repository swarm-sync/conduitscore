import { describe, expect, it } from "vitest";
import {
  extractRootDomain,
  getEmailDomain,
  isDisposableEmailDomain,
  normalizeEmailIdentity,
} from "@/lib/free-tier-abuse";

describe("normalizeEmailIdentity()", () => {
  it("normalizes gmail aliases", () => {
    expect(normalizeEmailIdentity("John.Smith+promo@googlemail.com")).toBe("johnsmith@gmail.com");
  });

  it("removes plus aliases for non-gmail domains", () => {
    expect(normalizeEmailIdentity("Founder+test@company.com")).toBe("founder@company.com");
  });
});

describe("getEmailDomain()", () => {
  it("returns the normalized email domain", () => {
    expect(getEmailDomain("John.Smith+promo@googlemail.com")).toBe("gmail.com");
  });
});

describe("isDisposableEmailDomain()", () => {
  it("flags common disposable providers", () => {
    expect(isDisposableEmailDomain("mailinator.com")).toBe(true);
  });

  it("does not flag normal business domains", () => {
    expect(isDisposableEmailDomain("conduitscore.com")).toBe(false);
  });
});

describe("extractRootDomain()", () => {
  it("extracts the root domain from standard hosts", () => {
    expect(extractRootDomain("https://www.docs.conduitscore.com/pricing")).toBe("conduitscore.com");
  });

  it("handles common compound country-code TLDs", () => {
    expect(extractRootDomain("https://shop.example.co.uk/products")).toBe("example.co.uk");
  });
});
