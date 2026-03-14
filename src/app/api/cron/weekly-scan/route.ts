import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { Prisma } from "@prisma/client";

// Vercel Cron invokes GET — runs every Monday at 9am UTC
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const dueScans = await prisma.scheduledScan.findMany({
      where: { enabled: true, nextRun: { lte: now } },
      include: { project: { include: { user: { select: { id: true } } } } },
    });

    const results: { projectId: string; url: string; scanId?: string; error?: string }[] = [];

    for (const scheduled of dueScans) {
      // Update next run time immediately to prevent duplicate runs
      await prisma.scheduledScan.update({
        where: { id: scheduled.id },
        data: {
          lastRun: now,
          nextRun: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      try {
        // Create a scan record
        const scan = await prisma.scan.create({
          data: {
            url: scheduled.project.url,
            status: "running",
            userId: scheduled.project.user?.id,
            projectId: scheduled.projectId,
          },
          select: { id: true },
        });

        // Run the scan
        const result = await runScan(scheduled.project.url, scan.id);

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
              source: "cron-weekly",
            } as Prisma.InputJsonValue,
            completedAt: new Date(result.scannedAt),
          },
        });

        results.push({ projectId: scheduled.projectId, url: scheduled.project.url, scanId: scan.id });
      } catch (scanError) {
        const msg = scanError instanceof Error ? scanError.message : "Scan failed";
        results.push({ projectId: scheduled.projectId, url: scheduled.project.url, error: msg });
      }
    }

    return NextResponse.json({ processed: results.length, scans: results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Cron failed" },
      { status: 500 }
    );
  }
}
