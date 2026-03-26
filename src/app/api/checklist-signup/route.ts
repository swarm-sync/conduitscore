import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/checklist-signup
 *
 * Email capture for the 14-Point AI Visibility Checklist lead magnet.
 *
 * Body: { email: string; firstName?: string; company?: string }
 *
 * - Rate-limited: 3 requests per IP per 15 minutes
 * - Sends welcome email with PDF link immediately
 * - Redirects client to /scan after success (handled client-side)
 */

const CHECKLIST_PDF_URL =
  process.env.CHECKLIST_PDF_URL ?? "https://conduitscore.com/resources/ai-visibility-checklist.md";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting — 3 submissions per IP per 15 minutes
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const allowed = checkRateLimit(`checklist:${ip}`, 3, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as {
      email?: unknown;
      firstName?: unknown;
      company?: unknown;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : null;
    const company =
      typeof body.company === "string" ? body.company.trim() : null;

    if (!email || !email.includes("@") || email.length > 254) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Persist lead in DB when available (graceful degradation if DB not configured)
    if (process.env.DATABASE_URL) {
      try {
        // Dynamic import to prevent build error if prisma client hasn't been generated
        const { default: prisma } = await import("@/lib/prisma");
        // Upsert into scan_leads table — reuses existing model with source tag
        await (prisma as unknown as {
          scanLead: {
            upsert: (args: unknown) => Promise<unknown>;
          };
        }).scanLead.upsert({
          where: { email },
          create: {
            email,
            scanUrl: company ? `company:${company}` : null,
            dripDay: 0,
            dripSentAt: new Date(),
          },
          update: {
            scanUrl: company ? `company:${company}` : undefined,
            dripDay: 0,
            dripSentAt: new Date(),
          },
        });
      } catch {
        // Non-fatal — email still sends even if DB write fails
      }
    }

    const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi there,";
    const scanUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "https://www.conduitscore.com";

    await sendEmail({
      to: email,
      subject: "Your 14-Point AI Visibility Checklist is here",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#e8e8e8;background:#0c0c0e;padding:40px 28px;border-radius:14px;">
          <div style="margin-bottom:24px;">
            <span style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FF2D55;">CONDUITSCORE</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 12px;line-height:1.15;">
            Your AI Visibility Checklist
          </h1>
          <p style="color:#a0a0b0;font-size:15px;line-height:1.7;margin:0 0 28px;">
            ${greeting} Thanks for downloading the 14-Point AI Visibility Checklist — the same framework that powers every ConduitScore scan.
          </p>

          <a href="${CHECKLIST_PDF_URL}" style="display:inline-block;background:#FF2D55;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:700;letter-spacing:0.04em;margin-bottom:32px;">
            Download Your Checklist &rarr;
          </a>

          <div style="background:#111115;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:22px 20px;margin-bottom:28px;">
            <p style="font-size:13px;font-weight:700;color:#fff;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.1em;">What's inside</p>
            <ul style="margin:0;padding:0;list-style:none;">
              ${[
                "All 14 signals explained — with point values",
                "How to audit each signal on your site",
                "Copy-paste code fixes (no custom dev needed)",
                "Before &amp; after examples (low score vs. high score)",
                "Priority ranking — which signals to fix first",
              ]
                .map(
                  (item) =>
                    `<li style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:#b0b0c0;line-height:1.5;">
                  <span style="color:#d9ff00;font-weight:700;flex-shrink:0;margin-top:1px;">&#10003;</span>
                  <span>${item}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>

          <p style="color:#a0a0b0;font-size:14px;line-height:1.6;margin:0 0 20px;">
            Once you've run through the checklist, scan your site free at ConduitScore — we'll show you exactly which of the 14 signals you're passing and which need work.
          </p>

          <a href="${scanUrl}/scan" style="display:inline-block;background:transparent;color:#FF2D55;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:700;letter-spacing:0.04em;border:1px solid rgba(255,45,85,0.4);">
            Run a Free Scan &rarr;
          </a>

          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0 20px;" />
          <p style="color:#505060;font-size:11px;line-height:1.6;margin:0;">
            You're receiving this because you downloaded our AI Visibility Checklist.
            We'll send the occasional ConduitScore update — no spam, ever.
            <a href="${scanUrl}/unsubscribe" style="color:#FF2D55;text-decoration:none;">Unsubscribe anytime.</a>
          </p>
        </div>
      `,
      text: `${greeting}

Thanks for downloading the 14-Point AI Visibility Checklist.

Download it here: ${CHECKLIST_PDF_URL}

What's inside:
- All 14 signals explained (with point values)
- How to audit each signal on your site
- Copy-paste code fixes (no custom dev needed)
- Before & after examples
- Priority ranking — which signals to fix first

Once you've worked through the checklist, scan your site free at: ${scanUrl}/scan

-- The ConduitScore team`,
    });

    // Notify owner — fire-and-forget, never blocks user response
    try {
      await sendEmail({
        to: "benstone@conduitscore.com",
        subject: `New checklist signup: ${email}`,
        text: `New checklist signup\n\nSubmitted email: ${email}\nFirst name: ${firstName ?? "not provided"}\nCompany: ${company ?? "not provided"}\nTimestamp: ${new Date().toISOString()}`,
        html: `<p><strong>New checklist signup</strong></p><ul><li>Email: ${escapeHtml(email)}</li><li>First name: ${escapeHtml(firstName ?? "not provided")}</li><li>Company: ${escapeHtml(company ?? "not provided")}</li><li>Timestamp: ${new Date().toISOString()}</li></ul>`,
      });
    } catch (notifyErr) {
      console.error("[checklist-signup] owner notification failed:", notifyErr);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[checklist-signup]", error);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
