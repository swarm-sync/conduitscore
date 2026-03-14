import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeUrl } from "@/lib/scanner/url-normalizer";

async function getOptionalSession() {
  try {
    const [{ getServerSession }, { authOptions }] = await Promise.all([
      import("next-auth"),
      import("@/lib/auth"),
    ]);
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}

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

    const session = await getOptionalSession();

    let userId: string | undefined;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
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
