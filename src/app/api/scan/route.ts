import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeUrl } from "@/lib/scanner/url-normalizer";
import { getRequestUser } from "@/lib/api-auth";

// Monthly scan limits per tier
const TIER_LIMITS: Record<string, number> = {
  free:    3,
  starter: 50,
  pro:     100,
  growth:  500,
  agency:  Infinity,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize first (prepends https:// if missing), then validate
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeUrl(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
    }
    if (!process.env.DATABASE_URL) {
      const result = await runScan(normalizedUrl, `ephemeral_${Date.now()}`);
      return NextResponse.json({ status: "completed", ...result });
    }

    const auth = await getRequestUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    let userId: string | undefined;
    if (auth.user) {
      userId = auth.user.id;

      // Reset monthly count if new billing period has started
      const now = new Date();
      const resetAt = new Date(auth.user.scanResetAt);
      const monthsElapsed =
        (now.getFullYear() - resetAt.getFullYear()) * 12 +
        (now.getMonth() - resetAt.getMonth());

      let scanCount = auth.user.scanCountMonth;
      if (monthsElapsed >= 1) {
        await prisma.user.update({
          where: { id: auth.user.id },
          data: { scanCountMonth: 0, scanResetAt: now },
        });
        scanCount = 0;
      }

      const tier = auth.user.subscriptionTier ?? "free";
      const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free;

      if (scanCount >= limit) {
        return NextResponse.json(
          {
            error: `You've used all ${limit} scans for this month on the ${tier} plan.`,
            upgradeRequired: true,
            tier,
            limit,
            used: scanCount,
          },
          { status: 402 }
        );
      }

      await prisma.user.update({
        where: { id: auth.user.id },
        data: { scanCountMonth: { increment: 1 } },
      });
    } else {
      // Anonymous users: use IP-based rate limit (already applied above, 10/min)
      // No monthly DB tracking for anonymous — they get 3 free scans via IP rate limit
    }

    const scan = await prisma.scan.create({
      data: {
        url: normalizedUrl,
        status: "running",
        userId,
      },
      select: { id: true },
    });

    try {
      const result = await runScan(normalizedUrl, scan.id);

      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: "completed",
          overallScore: result.overallScore,
          categoryScores: result.categories as unknown as Prisma.InputJsonValue,
          issues: result.issues as unknown as Prisma.InputJsonValue,
          fixes: result.fixes as unknown as Prisma.InputJsonValue,
          metadata: {
            ...(result.metadata ?? {}),
            proof: result.proof ?? null,
          } as Prisma.InputJsonValue,
          completedAt: new Date(result.scannedAt),
        },
      });

      return NextResponse.json({ id: scan.id, status: "completed", ...result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Scan failed";
      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: "failed",
          metadata: { error: message } as Prisma.InputJsonValue,
        },
      });
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
