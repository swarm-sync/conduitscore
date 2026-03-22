import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { normalizeUrl } from "@/lib/scanner/url-normalizer";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { PLAN_FEATURES } from "@/lib/plan-limits";
import type { InputJsonValue } from "@prisma/client/runtime/library";

type BulkRow = {
  name?: string;
  url: string;
};

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, subscriptionTier: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!PLAN_FEATURES.bulkScan(user.subscriptionTier)) {
      return NextResponse.json({ error: "Bulk CSV upload requires the Agency plan" }, { status: 403 });
    }

    const body = await request.json();
    const rows = Array.isArray(body.rows) ? (body.rows as BulkRow[]) : [];
    const runInitialScans = body.runInitialScans !== false;

    if (rows.length === 0) {
      return NextResponse.json({ error: "No rows provided" }, { status: 400 });
    }
    if (rows.length > 10) {
      return NextResponse.json({ error: "Bulk upload is limited to 10 rows per batch" }, { status: 400 });
    }

    const results: Array<{
      url: string;
      projectId?: string;
      scanId?: string;
      created: boolean;
      error?: string;
    }> = [];

    for (const row of rows) {
      try {
        const normalizedUrl = normalizeUrl(row.url);
        const name =
          row.name?.trim() ||
          new URL(normalizedUrl).hostname.replace(/^www\./, "");

        let project = await prisma.project.findFirst({
          where: { userId: user.id, url: normalizedUrl },
        });

        let created = false;
        if (!project) {
          project = await prisma.project.create({
            data: { userId: user.id, name, url: normalizedUrl },
          });
          created = true;
        }

        let scanId: string | undefined;
        if (runInitialScans) {
          const scan = await prisma.scan.create({
            data: {
              url: normalizedUrl,
              status: "running",
              userId: user.id,
              projectId: project.id,
            },
            select: { id: true },
          });
          scanId = scan.id;

          try {
            const result = await runScan(normalizedUrl, scan.id);
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
                  source: "bulk-csv",
                } as unknown as InputJsonValue,
                completedAt: new Date(result.scannedAt),
              },
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Scan failed";
            await prisma.scan.update({
              where: { id: scan.id },
              data: {
                status: "failed",
                metadata: { error: message, source: "bulk-csv" } as unknown as InputJsonValue,
              },
            });
            throw error;
          }
        }

        results.push({
          url: normalizedUrl,
          projectId: project.id,
          scanId,
          created,
        });
      } catch (error) {
        results.push({
          url: row.url,
          created: false,
          error: error instanceof Error ? error.message : "Failed",
        });
      }
    }

    return NextResponse.json({
      processed: results.length,
      created: results.filter((result) => result.created).length,
      scanned: results.filter((result) => result.scanId).length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bulk upload failed" },
      { status: 500 }
    );
  }
}
