/**
 * Public domain scoring endpoint — no auth required.
 * Used by reverse-funnel-scanner to check AI visibility score for a domain.
 *
 * GET /api/public/domain/{domain}/score
 *
 * Response:
 *   { domain, score, grade, scanned_at }
 *
 * Rate limited to 20 req/60s per IP (matches reverse-funnel-scanner's token bucket).
 */
import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner/scan-orchestrator";
import { normalizeUrl } from "@/lib/scanner/url-normalizer";
import { checkRateLimit } from "@/lib/rate-limit";

function scoreToGrade(score: number): string {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  // Rate limit: 20 requests per 60 seconds per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous";
  if (!checkRateLimit(ip, 20, 60000)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 20 requests per 60 seconds." },
      { status: 429 }
    );
  }

  // Normalize domain to full URL for scanner
  let normalizedUrl: string;
  try {
    normalizedUrl = normalizeUrl(domain);
  } catch {
    return NextResponse.json({ error: `Invalid domain: ${domain}` }, { status: 400 });
  }

  try {
    const result = await runScan(normalizedUrl, `public_${Date.now()}`);

    return NextResponse.json({
      domain,
      score: result.overallScore,
      grade: scoreToGrade(result.overallScore),
      scanned_at: result.scannedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
