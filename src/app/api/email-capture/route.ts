import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/email-capture
 *
 * Called after a free scan completes when the user provides their email
 * on the "Your report is ready" interstitial screen.
 *
 * Body: { email: string; scanId?: string; scanUrl?: string; score?: number }
 *
 * - Upserts a LeadEmail record (or User with no password) keyed by email
 * - Sends the Day 0 "here's your report" email immediately
 * - Records the drip state so the cron job can send Day 7 and Day 30 emails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email?: unknown;
      scanId?: unknown;
      scanUrl?: unknown;
      score?: unknown;
    };

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const scanId = typeof body.scanId === "string" ? body.scanId : null;
    const scanUrl = typeof body.scanUrl === "string" ? body.scanUrl : null;
    const score = typeof body.score === "number" ? body.score : null;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Store the lead in the database if available.
    if (process.env.DATABASE_URL) {
      await prisma.scanLead.upsert({
        where: { email },
        create: {
          email,
          scanId: scanId ?? null,
          scanUrl: scanUrl ?? null,
          score: score ?? null,
          dripDay: 0,
          dripSentAt: new Date(),
        },
        update: {
          // Update to latest scan context on repeat visits.
          scanId: scanId ?? undefined,
          scanUrl: scanUrl ?? undefined,
          score: score ?? undefined,
          dripDay: 0,
          dripSentAt: new Date(),
        },
      });
    }

    // Day 0 email — send immediately.
    const reportUrl = scanId
      ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.conduitscore.com"}/scan-result?id=${scanId}`
      : `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.conduitscore.com"}/scan-result`;

    const scoreDisplay = score !== null ? `${score}/100` : "your score";
    const siteName = scanUrl ?? "your site";

    await sendEmail({
      to: email,
      subject: `Your AI visibility report for ${siteName}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#e8e8e8;background:#0c0c0e;padding:32px 24px;border-radius:12px;">
          <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 8px;">Your AI visibility score: ${scoreDisplay}</h1>
          <p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 24px;">
            We scanned <strong style="color:#e8e8e8;">${siteName}</strong> and found issues affecting your visibility to ChatGPT, Claude, Perplexity, and Gemini. Your full report is ready.
          </p>
          <a href="${reportUrl}" style="display:inline-block;background:#FF2D55;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;">View Full Report →</a>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;" />
          <p style="color:#606070;font-size:12px;line-height:1.5;">
            We'll check back in 7 days to see what you've fixed — and surface any remaining issues. No spam, unsubscribe anytime.
          </p>
        </div>
      `,
      text: `Your AI visibility score: ${scoreDisplay}\n\nWe scanned ${siteName} and found issues affecting your visibility to ChatGPT, Claude, Perplexity, and Gemini.\n\nView your full report: ${reportUrl}\n\nWe'll follow up in 7 days to track your progress.`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email capture failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
