import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { scanRecordToResult } from "@/lib/scanner/scan-record";

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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getOptionalSession();

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    if (scan.userId && session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user?.id !== scan.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(scanRecordToResult(scan));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getOptionalSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const scan = await prisma.scan.findUnique({ where: { id } });
    if (!scan || scan.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.scan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
