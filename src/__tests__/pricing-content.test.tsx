import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PricingContent, type PricingFaq, type PricingPlan } from "@/components/pricing/pricing-content";

const replaceMock = vi.fn();
let searchParamsValue = new URLSearchParams();
let sessionStatus = "authenticated";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/pricing",
  useSearchParams: () => searchParamsValue,
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ status: sessionStatus }),
}));

const PLANS: PricingPlan[] = [
  {
    name: "Diagnose",
    monthlyPrice: "$0",
    description: "See the problem",
    features: ["3 scans/month"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Fix",
    monthlyPrice: "$29",
    annualPrice: "$23",
    annualTotal: "$276",
    period: "/mo",
    description: "Unlock every fix and explanation",
    features: ["50 scans/month"],
    cta: "Choose Fix",
    popular: false,
  },
  {
    name: "Monitor",
    monthlyPrice: "$49",
    annualPrice: "$39",
    annualTotal: "$468",
    period: "/mo",
    description: "Automate tracking across your sites",
    features: ["100 scans/month"],
    cta: "Choose Monitor",
    popular: true,
  },
  {
    name: "Alert",
    monthlyPrice: "$79",
    annualPrice: "$63",
    annualTotal: "$756",
    period: "/mo",
    description: "Get notified when your score slips",
    features: ["500 scans/month"],
    cta: "Choose Alert",
    popular: false,
  },
  {
    name: "Scale",
    monthlyPrice: "$149",
    description: "Integrate ConduitScore into high-volume workflows",
    features: ["Unlimited scans"],
    cta: "Contact Us",
    popular: false,
    contactOnly: true,
  },
];

const FAQS: PricingFaq[] = [
  {
    question: "Can I change plans later?",
    answer: "Yes.",
  },
];

describe("PricingContent", () => {
  beforeEach(() => {
    searchParamsValue = new URLSearchParams();
    sessionStatus = "authenticated";
    replaceMock.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)
    );
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders monthly billing by default", () => {
    render(<PricingContent plans={PLANS} pricingFaqs={FAQS} />);

    expect(screen.getByText("Monthly price")).toBeTruthy();
    expect(screen.getByText("Save 20% with yearly billing on Fix, Monitor, and Alert. Yearly prices are shown as monthly equivalents and billed annually.")).toBeTruthy();
    expect(screen.getAllByText("$29").length).toBeGreaterThan(0);
    expect(screen.getByText("$23/mo billed annually")).toBeTruthy();
  });

  it("switches to yearly billing and sends annual checkout when a paid plan is selected", async () => {
    render(<PricingContent plans={PLANS} pricingFaqs={FAQS} />);

    fireEvent.click(screen.getByRole("button", { name: "Yearly" }));

    expect(replaceMock).toHaveBeenCalledWith("/pricing?billing=yearly", { scroll: false });
    expect(screen.getByText("Yearly billing")).toBeTruthy();
    expect(screen.getByText("$276/yr")).toBeTruthy();
    expect(screen.getByText("$23")).toBeTruthy();
    expect(screen.getByText("$276 billed yearly")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Choose Fix for Fix plan at \$23 with annual billing/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({ tier: "starter", annual: true });
  });

  it("initializes from the yearly billing query param", () => {
    searchParamsValue = new URLSearchParams("billing=yearly");

    render(<PricingContent plans={PLANS} pricingFaqs={FAQS} />);

    expect(screen.getByText("Yearly billing")).toBeTruthy();
    expect(screen.getByText("$276 billed yearly")).toBeTruthy();
  });

  it("sends logged-out users to sign-in with the yearly callback preserved", () => {
    sessionStatus = "unauthenticated";
    searchParamsValue = new URLSearchParams("billing=yearly");
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost/pricing?billing=yearly" },
    });

    render(<PricingContent plans={PLANS} pricingFaqs={FAQS} />);

    fireEvent.click(screen.getByRole("button", { name: /Choose Fix for Fix plan at \$23 with annual billing/i }));

    expect(window.location.href).toBe("/signin?callbackUrl=%2Fpricing%3Fbilling%3Dyearly");

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
