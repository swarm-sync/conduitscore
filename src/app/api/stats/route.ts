import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/stats
 *
 * Returns aggregate scan statistics for public display (e.g. homepage live count).
 *
 * Response shape:
 *   { weeklyScanCount: number }
 *
 * Response headers:
 *   Cache-Control: public, s-maxage=300
 *     — 5-minute shared cache prevents hammering the DB on every homepage load.
 */
export async function GET() {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const weeklyScanCount = await prisma.scan.count({
      where: {
        status: "completed",
        completedAt: { gte: since },
      },
    });

    return NextResponse.json(
      { weeklyScanCount },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stats error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
