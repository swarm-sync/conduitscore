import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.subscriptionTier !== "agency") return NextResponse.json({ error: "Agency tier required" }, { status: 403 });
    const keys = await prisma.apiKey.findMany({ where: { userId: user.id }, select: { id: true, name: true, createdAt: true, lastUsed: true } });
    return NextResponse.json(keys);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.subscriptionTier !== "agency") return NextResponse.json({ error: "Agency tier required" }, { status: 403 });
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const key = `ao_${randomBytes(32).toString("hex")}`;
    const apiKey = await prisma.apiKey.create({ data: { userId: user.id, name, key } });
    return NextResponse.json({ id: apiKey.id, name: apiKey.name, key, createdAt: apiKey.createdAt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
