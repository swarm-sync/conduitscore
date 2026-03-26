import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { sendEmail } from "@/lib/email";
import { IMPACT_MAP, SCORE_IMPACT, EFFORT_MINUTES, DEFAULT_SCORE_IMPACT, DEFAULT_EFFORT_MINUTES } from "@/lib/scanner/fix-meta";
import type { Fix, Issue } from "@/lib/scanner/types";

export const maxDuration = 300;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "https://conduitscore.com";

// Drip schedule in days from sign-up.
const DAY_7 = 7;
const DAY_30 = 30;

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

/** Pick the lowest-severity fix to give away as the Day 30 gift. */
function pickGiftFix(fixes: Fix[], issues: Issue[]): Fix | null {
  if (fixes.length === 0) return null;
  const severityOrder: Record<string, number> = { info: 0, warning: 1, critical: 2 };
  const sevById = new Map(issues.map((i) => [i.id, i.severity]));
  let best: Fix | null = null;
  let bestRank = Infinity;
  for (const fix of fixes) {
    const rank = severityOrder[sevById.get(fix.issueId) ?? "critical"] ?? 2;
    if (rank < bestRank) { bestRank = rank; best = fix; }
  }
  return best;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.scanLead.findMany({ where: { dripDay: { lt: 30 } } });

  let day7Sent = 0;
  let day30Sent = 0;

  for (const lead of leads) {
    const age = daysSince(lead.createdAt);

    // Day 7 — rescan and show what's still broken.
    if (lead.dripDay < DAY_7 && age >= DAY_7 && lead.scanUrl) {
      try {
        const result = await runScan(lead.scanUrl, `drip_${lead.id}`);
        const remaining = result.issues.filter((i) => i.severity === "critical").length;
        const reportUrl = lead.scanId
          ? `${APP_URL}/scan-result?id=${lead.scanId}`
          : `${APP_URL}`;

        await sendEmail({
          to: lead.email,
          subject: `7-day check-in: ${remaining > 0 ? `${remaining} critical issue${remaining !== 1 ? "s" : ""} still unresolved` : "your score improved!"} — ${lead.scanUrl}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#e8e8e8;background:#0c0c0e;padding:32px 24px;border-radius:12px;">
              <h1 style="font-size:20px;font-weight:700;color:#fff;margin:0 0 8px;">7-day check-in for ${lead.scanUrl}</h1>
              ${remaining > 0
                ? `<p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 16px;">Your latest score is <strong style="color:#fff;">${result.overallScore}/100</strong>. You still have <strong style="color:#FF2D55;">${remaining} critical issue${remaining !== 1 ? "s" : ""}</strong> affecting AI visibility.</p><p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 24px;">Unlock the exact code fixes for $29/month and clear them today.</p>`
                : `<p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 24px;">Great progress — your score is now <strong style="color:#00E5A0;">${result.overallScore}/100</strong>. View your updated report below.</p>`
              }
              <a href="${reportUrl}" style="display:inline-block;background:#FF2D55;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;">View Updated Report →</a>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;" />
              <p style="color:#606070;font-size:12px;">One more check-in at 30 days. Unsubscribe anytime by replying STOP.</p>
            </div>
          `,
          text: `7-day check-in for ${lead.scanUrl}.\n\nCurrent score: ${result.overallScore}/100. Critical issues remaining: ${remaining}.\n\nView report: ${reportUrl}`,
        });

        await prisma.scanLead.update({
          where: { id: lead.id },
          data: { dripDay: DAY_7, dripSentAt: new Date() },
        });
        day7Sent++;
      } catch {
        // Non-fatal — continue with other leads.
      }
    }

    // Day 30 — gift one complete code fix.
    if (lead.dripDay < DAY_30 && age >= DAY_30 && lead.scanUrl) {
      try {
        const result = await runScan(lead.scanUrl, `drip30_${lead.id}`);
        const enrichedFixes: Fix[] = result.fixes.map((fix) => ({
          ...fix,
          scoreImpact: SCORE_IMPACT[fix.issueId] ?? DEFAULT_SCORE_IMPACT,
          effortMinutes: EFFORT_MINUTES[fix.issueId] ?? DEFAULT_EFFORT_MINUTES,
        }));
        const giftFix = pickGiftFix(enrichedFixes, result.issues);
        const impact = giftFix ? (IMPACT_MAP[giftFix.issueId] ?? "") : "";
        const reportUrl = lead.scanId ? `${APP_URL}/scan-result?id=${lead.scanId}` : APP_URL;

        const codeBlock = giftFix
          ? `<pre style="background:#111;border-left:3px solid #FF2D55;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;color:#D9FF00;font-family:monospace;">${giftFix.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`
          : "";

        await sendEmail({
          to: lead.email,
          subject: `A gift: one free code fix for ${lead.scanUrl}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#e8e8e8;background:#0c0c0e;padding:32px 24px;border-radius:12px;">
              <h1 style="font-size:20px;font-weight:700;color:#fff;margin:0 0 8px;">Here's a free fix — no strings attached</h1>
              <p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 16px;">It's been 30 days since you scanned <strong style="color:#fff;">${lead.scanUrl}</strong>. As a thank-you for checking out ConduitScore, here's one complete code fix, free.</p>
              ${giftFix ? `
                <p style="color:#e8e8e8;font-size:14px;font-weight:600;margin:0 0 6px;">${giftFix.title}</p>
                <p style="color:#a0a0b0;font-size:13px;margin:0 0 12px;">${impact}</p>
                ${codeBlock}
                <p style="color:#a0a0b0;font-size:13px;margin:12px 0 24px;">Paste this into your site and run a free rescan at ConduitScore to see your score improve.</p>
              ` : ""}
              <a href="${reportUrl}" style="display:inline-block;background:#FF2D55;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;">View Full Report + All Fixes →</a>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;" />
              <p style="color:#606070;font-size:12px;">Unlock all remaining fixes for $29/month at <a href="${APP_URL}/pricing" style="color:#FF2D55;">conduitscore.com/pricing</a>. Reply STOP to unsubscribe.</p>
            </div>
          `,
          text: `Here's a free fix for ${lead.scanUrl}.\n\n${giftFix ? `${giftFix.title}\n\n${giftFix.code}\n\n` : ""}View full report: ${reportUrl}\n\nUnlock all fixes at ${APP_URL}/pricing`,
        });

        await prisma.scanLead.update({
          where: { id: lead.id },
          data: { dripDay: DAY_30, dripSentAt: new Date() },
        });
        day30Sent++;
      } catch {
        // Non-fatal.
      }
    }
  }

  return NextResponse.json({ ok: true, day7Sent, day30Sent });
}
