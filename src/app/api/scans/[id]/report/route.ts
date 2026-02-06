import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const scan = await prisma.scan.findUnique({ where: { id }, include: { report: true } });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    const reportData = {
      url: scan.url,
      overallScore: scan.overallScore,
      categories: scan.categoryScores,
      issues: scan.issues,
      fixes: scan.fixes,
      scannedAt: scan.createdAt.toISOString(),
    };

    return NextResponse.json(reportData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
