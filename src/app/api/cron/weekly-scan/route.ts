import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const now = new Date();
    const dueScans = await prisma.scheduledScan.findMany({
      where: { enabled: true, nextRun: { lte: now } },
      include: { project: true },
    });

    const results = [];
    for (const scheduled of dueScans) {
      await prisma.scheduledScan.update({
        where: { id: scheduled.id },
        data: { lastRun: now, nextRun: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      });
      results.push({ projectId: scheduled.projectId, url: scheduled.project.url });
    }

    return NextResponse.json({ processed: results.length, scans: results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cron failed" }, { status: 500 });
  }
}
