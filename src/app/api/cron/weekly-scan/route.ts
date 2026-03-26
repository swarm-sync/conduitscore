import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { PLAN_FEATURES } from "@/lib/plan-limits";
import { sendEmail } from "@/lib/email";
import type { InputJsonValue } from "@prisma/client/runtime/library";

export const maxDuration = 300;
const EMAIL_ALERT_DROP_THRESHOLD = 5;

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
      include: {
        project: {
          include: {
            user: {
              select: { id: true, email: true, subscriptionTier: true },
            },
          },
        },
      },
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
        const previousCompletedScan = await prisma.scan.findFirst({
          where: {
            projectId: scheduled.projectId,
            status: "completed",
          },
          orderBy: { completedAt: "desc" },
          select: { overallScore: true, completedAt: true },
        });

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
            categoryScores: result.categories as unknown as InputJsonValue,
            issues: result.issues as unknown as InputJsonValue,
            fixes: result.fixes as unknown as InputJsonValue,
            metadata: {
              ...(result.metadata ?? {}),
              proof: result.proof ?? null,
              source: "cron-weekly",
            } as unknown as InputJsonValue,
            completedAt: new Date(result.scannedAt),
          },
        });

        const user = scheduled.project.user;
        const previousScore = previousCompletedScan?.overallScore;
        const currentScore = result.overallScore;
        const scoreDrop =
          typeof previousScore === "number" ? previousScore - currentScore : 0;

        if (
          user?.email &&
          PLAN_FEATURES.emailAlerts(user.subscriptionTier) &&
          scoreDrop >= EMAIL_ALERT_DROP_THRESHOLD
        ) {
          const subject = `ConduitScore alert: ${scheduled.project.name} dropped ${scoreDrop} points`;
          await sendEmail({
            to: user.email,
            subject,
            html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
              <h1 style="font-size:24px;margin-bottom:8px;color:#111;">Score drop detected</h1>
              <p style="color:#444;line-height:1.6;">${scheduled.project.name} dropped from <strong>${previousScore}</strong> to <strong>${currentScore}</strong> on its latest scheduled ConduitScore scan.</p>
              <p style="color:#444;line-height:1.6;">Review the latest report to see what changed and which fixes to tackle first.</p>
              <p style="margin-top:24px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://www.conduitscore.com"}/projects" style="display:inline-block;background:#6c3bff;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Open Projects</a></p>
            </div>`,
            text: `${scheduled.project.name} dropped from ${previousScore} to ${currentScore} on its latest scheduled ConduitScore scan. Review the latest report in your Projects dashboard.`,
          });
        }

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
