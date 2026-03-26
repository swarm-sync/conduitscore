import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/scanner/scan-orchestrator", () => ({
  runScan: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

import { runScan } from "@/lib/scanner/scan-orchestrator";
import { checkRateLimit } from "@/lib/rate-limit";

const { GET } = await import("@/app/api/public/domain/[domain]/score/route");

function makeRequest(ip = "203.0.113.10, 198.51.100.7") {
  return new NextRequest("http://localhost/api/public/domain/example.com/score", {
    method: "GET",
    headers: {
      "x-forwarded-for": ip,
    },
  });
}

describe("GET /api/public/domain/[domain]/score", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue(true);
    vi.spyOn(Date, "now").mockReturnValue(1_710_000_000_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns score data with grade and normalized scan input", async () => {
    vi.mocked(runScan).mockResolvedValue({
      overallScore: 67,
      scannedAt: "2026-03-26T00:00:00.000Z",
    } as never);

    const response = await GET(makeRequest(), {
      params: Promise.resolve({ domain: "example.com" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(checkRateLimit).toHaveBeenCalledWith("203.0.113.10", 20, 60000);
    expect(runScan).toHaveBeenCalledWith("https://example.com", "public_1710000000000");
    expect(data).toEqual({
      domain: "example.com",
      score: 67,
      grade: "B",
      scanned_at: "2026-03-26T00:00:00.000Z",
    });
  });

  it("returns 400 when the domain parameter is missing", async () => {
    const response = await GET(makeRequest(), {
      params: Promise.resolve({ domain: "" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Domain is required" });
  });

  it("returns 429 when the client exceeds the rate limit", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false);

    const response = await GET(makeRequest(), {
      params: Promise.resolve({ domain: "example.com" }),
    });
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data).toEqual({ error: "Rate limit exceeded. Max 20 requests per 60 seconds." });
    expect(runScan).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid domain", async () => {
    const response = await GET(makeRequest(), {
      params: Promise.resolve({ domain: "::bad-domain::" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Invalid domain: ::bad-domain::" });
    expect(runScan).not.toHaveBeenCalled();
  });

  it("returns 500 when scanning fails", async () => {
    vi.mocked(runScan).mockRejectedValue(new Error("Scanner offline"));

    const response = await GET(makeRequest(), {
      params: Promise.resolve({ domain: "example.com" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Scanner offline" });
  });
});
