import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      subscriptionTier: true,
      scanCountMonth: true,
      scanResetAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ tier: "free", scanCountMonth: 0 });
  }

  return NextResponse.json({
    tier: user.subscriptionTier || "free",
    scanCountMonth: user.scanCountMonth || 0,
    scanResetAt: user.scanResetAt,
  });
}
