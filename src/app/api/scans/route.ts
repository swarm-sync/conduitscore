import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const page = Number(request.nextUrl.searchParams.get("page") || "1");
    const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          url: true,
          overallScore: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.scan.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({ scans, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch scans";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
