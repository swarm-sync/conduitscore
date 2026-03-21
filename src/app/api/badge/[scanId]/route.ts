import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/badge/[scanId]
 *
 * Returns an SVG badge showing the ConduitScore for the given scan.
 * Public endpoint — no authentication required (for embedding on third-party sites).
 *
 * Response headers:
 *   Content-Type:  image/svg+xml
 *   Cache-Control: public, max-age=86400
 *
 * The embed snippet should append ?v=[scan.updatedAt.getTime()] for cache-busting
 * when the user re-scans their site.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const { scanId } = await params;

    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      select: { status: true, overallScore: true, updatedAt: true },
    });

    if (!scan || scan.status !== "completed") {
      return new NextResponse("Not Found", { status: 404 });
    }

    const score = scan.overallScore ?? 0;
    const svg = buildBadgeSvg(score);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
        // Allow browser caching and CDN caching
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Badge error";
    return new NextResponse(message, { status: 500 });
  }
}

/**
 * Builds the ConduitScore badge SVG.
 *
 * Design spec:
 *   - Dark background (#0a0a0f) with purple border (#6c3bff)
 *   - Left section: "ConduitScore" label in small white text
 *   - Right section: "[score]/100 AI-Visible" in cyan (#00d9ff) bold text
 *   - Width: 280px, Height: 28px
 */
function escapeSvg(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildBadgeSvg(score: number): string {
  // Clamp score to a safe integer in [0, 100] before rendering into SVG.
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const totalWidth = 280;
  const height = 28;
  const radius = 5;
  const borderWidth = 1;

  // Left section width (label)
  const leftWidth = 115;
  // Right section fills the rest
  const rightWidth = totalWidth - leftWidth;

  const labelText = escapeSvg("ConduitScore");
  const scoreText = escapeSvg(`${safeScore}/100 AI-Visible`);

  // Label text: centered in left section
  const labelX = leftWidth / 2;
  const labelY = height / 2 + 1; // +1 for optical centering

  // Score text: centered in right section
  const scoreX = leftWidth + rightWidth / 2;
  const scoreY = height / 2 + 1;

  const ariaLabel = escapeSvg(`ConduitScore Verified: ${safeScore}/100 AI-Visible`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${ariaLabel}">
  <title>${ariaLabel}</title>
  <defs>
    <linearGradient id="cs-bg-left" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#131320"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>
    <linearGradient id="cs-bg-right" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1030"/>
      <stop offset="100%" stop-color="#0d0a1a"/>
    </linearGradient>
    <clipPath id="cs-clip">
      <rect width="${totalWidth}" height="${height}" rx="${radius}" ry="${radius}"/>
    </clipPath>
  </defs>

  <!-- Outer border -->
  <rect
    x="${borderWidth / 2}"
    y="${borderWidth / 2}"
    width="${totalWidth - borderWidth}"
    height="${height - borderWidth}"
    rx="${radius}"
    ry="${radius}"
    fill="none"
    stroke="#6c3bff"
    stroke-width="${borderWidth}"
  />

  <!-- Background -->
  <g clip-path="url(#cs-clip)">
    <!-- Left section background -->
    <rect x="0" y="0" width="${leftWidth}" height="${height}" fill="url(#cs-bg-left)"/>
    <!-- Divider -->
    <rect x="${leftWidth}" y="4" width="1" height="${height - 8}" fill="#6c3bff" opacity="0.5"/>
    <!-- Right section background -->
    <rect x="${leftWidth + 1}" y="0" width="${rightWidth - 1}" height="${height}" fill="url(#cs-bg-right)"/>
  </g>

  <!-- Label text -->
  <text
    x="${labelX}"
    y="${labelY}"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    font-size="11"
    font-weight="500"
    fill="#e2e2f0"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="0.3"
  >${labelText}</text>

  <!-- Score text -->
  <text
    x="${scoreX}"
    y="${scoreY}"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    font-size="12"
    font-weight="700"
    fill="#00d9ff"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="0.2"
  >${scoreText}</text>
</svg>`;
}
