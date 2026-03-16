/**
 * Section 4: Badge & Stats API Tests
 * Tests for:
 *   - src/app/api/badge/[scanId]/route.ts
 *   - src/app/api/stats/route.ts
 *
 * Prisma is fully mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock Prisma ───────────────────────────────────────────────────────────────
const mockScanFindUnique = vi.fn();
const mockScanCount      = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    scan: {
      findUnique: mockScanFindUnique,
      count:      mockScanCount,
    },
  },
}));

// Import route handlers AFTER mocks are in place.
const { GET: badgeGET } = await import("@/app/api/badge/[scanId]/route");
const { GET: statsGET } = await import("@/app/api/stats/route");

// ── Helper: build a request with dynamic route params ────────────────────────
function makeBadgeRequest(scanId: string) {
  return new NextRequest(`http://localhost/api/badge/${scanId}`);
}

// ── Badge tests ───────────────────────────────────────────────────────────────

describe("GET /api/badge/[scanId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valid completed scan → 200, Content-Type: image/svg+xml", async () => {
    mockScanFindUnique.mockResolvedValue({
      id: "scan-1",
      status: "completed",
      overallScore: 74,
      updatedAt: new Date(),
    });

    const req = makeBadgeRequest("scan-1");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "scan-1" }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("image/svg+xml");
  });

  it("valid scan → SVG body contains score and '/100 AI-Visible'", async () => {
    mockScanFindUnique.mockResolvedValue({
      status: "completed",
      overallScore: 82,
      updatedAt: new Date(),
    });

    const req = makeBadgeRequest("scan-2");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "scan-2" }) });
    const body = await res.text();

    expect(body).toContain("82");
    expect(body).toContain("/100 AI-Visible");
  });

  it("score of 0 → SVG still renders '0/100 AI-Visible'", async () => {
    mockScanFindUnique.mockResolvedValue({
      status: "completed",
      overallScore: 0,
      updatedAt: new Date(),
    });

    const req = makeBadgeRequest("scan-zero");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "scan-zero" }) });
    const body = await res.text();

    expect(res.status).toBe(200);
    expect(body).toContain("0/100");
  });

  it("scan not found → 404", async () => {
    mockScanFindUnique.mockResolvedValue(null);

    const req = makeBadgeRequest("nonexistent");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "nonexistent" }) });

    expect(res.status).toBe(404);
  });

  it("scan with status='running' → 404 (not completed)", async () => {
    mockScanFindUnique.mockResolvedValue({
      status: "running",
      overallScore: 50,
      updatedAt: new Date(),
    });

    const req = makeBadgeRequest("scan-running");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "scan-running" }) });

    expect(res.status).toBe(404);
  });

  it("scan with status='failed' → 404", async () => {
    mockScanFindUnique.mockResolvedValue({
      status: "failed",
      overallScore: null,
      updatedAt: new Date(),
    });

    const req = makeBadgeRequest("scan-failed");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "scan-failed" }) });

    expect(res.status).toBe(404);
  });

  it("response has Cache-Control: public header", async () => {
    mockScanFindUnique.mockResolvedValue({
      status: "completed",
      overallScore: 60,
      updatedAt: new Date(),
    });

    const req = makeBadgeRequest("scan-cache");
    const res = await badgeGET(req, { params: Promise.resolve({ scanId: "scan-cache" }) });

    const cc = res.headers.get("Cache-Control");
    expect(cc).toContain("public");
  });
});

// ── Stats tests ───────────────────────────────────────────────────────────────

describe("GET /api/stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns JSON with weeklyScanCount as a number", async () => {
    mockScanCount.mockResolvedValue(42);

    const req = new NextRequest("http://localhost/api/stats");
    const res = await statsGET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(typeof data.weeklyScanCount).toBe("number");
    expect(data.weeklyScanCount).toBe(42);
  });

  it("weeklyScanCount is non-negative", async () => {
    mockScanCount.mockResolvedValue(0);

    const req = new NextRequest("http://localhost/api/stats");
    const res = await statsGET(req);
    const data = await res.json();

    expect(data.weeklyScanCount).toBeGreaterThanOrEqual(0);
  });

  it("response has Cache-Control with s-maxage", async () => {
    mockScanCount.mockResolvedValue(10);

    const req = new NextRequest("http://localhost/api/stats");
    const res = await statsGET(req);

    const cc = res.headers.get("Cache-Control");
    expect(cc).toContain("s-maxage");
  });

  it("returns integer count, not a float", async () => {
    mockScanCount.mockResolvedValue(7);

    const req = new NextRequest("http://localhost/api/stats");
    const res = await statsGET(req);
    const data = await res.json();

    expect(Number.isInteger(data.weeklyScanCount)).toBe(true);
  });
});
