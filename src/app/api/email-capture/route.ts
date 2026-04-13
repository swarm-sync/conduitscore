import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/email-capture
 *
 * Captures email from the benchmark report CTA on the scan results page.
 * Sends a benchmark comparison email showing the user's score vs. the
 * average across all completed ConduitScore scans.
 *
 * Body: { email: string; scanId?: string; score?: number; url?: string }
 */
export async function POST(request: NextRequest) {
  // Rate limit: 5 submissions per IP per hour
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`email-capture:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      email?: unknown;
      scanId?: unknown;
      score?: unknown;
      url?: unknown;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const scanId = typeof body.scanId === "string" ? body.scanId : null;
    const score = typeof body.score === "number" ? body.score : null;
    const url = typeof body.url === "string" ? body.url : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 },
      );
    }

    // Upsert the lead record — always do this first so the lead is captured
    // even if the email send subsequently fails.
    await prisma.scanLead.upsert({
      where: { email },
      create: {
        email,
        scanId: scanId ?? null,
        scanUrl: url ?? null,
        score: score ?? null,
        dripDay: 0,
        dripSentAt: new Date(),
      },
      update: {
        scanId: scanId ?? undefined,
        scanUrl: url ?? undefined,
        score: score ?? undefined,
        dripDay: 0,
        dripSentAt: new Date(),
      },
    });

    // Compute average score across all completed scans.
    const agg = await prisma.scan.aggregate({
      _avg: { overallScore: true },
      where: { status: "completed" },
    });
    const avgScore = Math.round(agg._avg.overallScore ?? 50);

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ?? "https://conduitscore.com"
    ).trim();

    // Build score-aware email copy. Only include score line if we have a real score.
    const hasScore = typeof score === "number" && score > 0;
    const diff = hasScore ? score - avgScore : null;
    const comparison =
      diff === null
        ? ""
        : diff > 0
          ? `That's ${diff} points above the average.`
          : diff < 0
            ? `That's ${Math.abs(diff)} points below the average.`
            : "That's right at the average.";

    const scoreBlock = hasScore
      ? `<div style="background:rgba(108,59,255,0.08);border:1px solid rgba(108,59,255,0.25);border-radius:8px;padding:20px;margin-bottom:20px;">
            <p style="color:#a0a0b0;font-size:13px;margin:0 0 4px;">Your score</p>
            <p style="font-size:36px;font-weight:800;color:#fff;margin:0;">${score}<span style="font-size:16px;color:#a0a0b0;">/100</span></p>
          </div>`
      : "";

    const scoreText = hasScore
      ? `You scored ${score}/100.\n\nThe average across all ConduitScore scans is ${avgScore}/100. ${comparison}\n\n`
      : `The average AI visibility score across all ConduitScore scans is ${avgScore}/100.\n\n`;

    // Send the email — failure is non-fatal (lead is already saved above).
    try {
      await sendEmail({
        to: email,
        subject: "Your AI visibility score vs. the benchmark",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#e8e8e8;background:#0c0c0e;padding:32px 24px;border-radius:12px;">
            <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 16px;">Your AI Visibility Benchmark</h1>

            ${scoreBlock}

            <p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 8px;">
              The average score across all ConduitScore scans is <strong style="color:#e8e8e8;">${avgScore}/100</strong>.
            </p>
            ${comparison ? `<p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 24px;">${comparison} Upgrading unlocks the exact code fixes to improve your score.</p>` : `<p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 24px;">Upgrading unlocks the exact code fixes to improve your score.</p>`}

            <a href="${appUrl}/pricing" style="display:inline-block;background:#FF2D55;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;">
              Unlock Your Fixes &rarr;
            </a>

            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;" />
            <p style="color:#606070;font-size:12px;line-height:1.5;">
              ConduitScore &mdash; AI Visibility Scanner. Unsubscribe anytime.
            </p>
          </div>
        `,
        text: `Your AI Visibility Benchmark\n\n${scoreText}Upgrading unlocks the exact code fixes to improve your score.\n\nUpgrade: ${appUrl}/pricing`,
      });
    } catch (emailErr) {
      // Log but don't fail — lead is already captured in the DB.
      console.error("[email-capture] sendEmail failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Email capture failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
