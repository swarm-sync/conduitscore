import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLAN_FEATURES } from "@/lib/plan-limits";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!PLAN_FEATURES.scheduledRescans(user.subscriptionTier)) {
      return NextResponse.json({ error: "Scheduled re-scans require the Pro plan or higher" }, { status: 403 });
    }

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      include: { scheduledScans: true },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const enabled = Boolean(body.enabled);
    const existing = project.scheduledScans[0];

    if (!existing && enabled) {
      const schedule = await prisma.scheduledScan.create({
        data: {
          projectId: project.id,
          enabled: true,
          frequency: "weekly",
          nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return NextResponse.json(schedule);
    }

    if (!existing) {
      return NextResponse.json({ success: true, enabled: false });
    }

    const schedule = await prisma.scheduledScan.update({
      where: { id: existing.id },
      data: {
        enabled,
        nextRun: enabled ? existing.nextRun ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
