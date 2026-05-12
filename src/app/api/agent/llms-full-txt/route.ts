import { NextResponse } from "next/server";

export async function GET() {
  const llmsFullContent = `# ConduitScore — Detailed Specification

## API Reference

### POST /api/scan
Initiate an AI visibility scan on any URL.

**Auth**: Not required for free tier (3 scans/mo), API key required for paid tiers.

**Request**:
\`\`\`json
{
  "url": "https://example.com"
}
\`\`\`

**Response**:
\`\`\`json
{
  "scanId": "scan_abc123",
  "url": "https://example.com",
  "status": "completed",
  "overallScore": 72,
  "categoryScores": {
    "crawlerAccess": 85,
    "structuredData": 65,
    "llmsText": 50,
    "contentStructure": 78,
    "technicalHealth": 88,
    "citationSignals": 72,
    "contentQuality": 75
  },
  "issues": [...],
  "fixes": [...]
}
\`\`\`

### GET /api/scans?limit=10
Retrieve scan history for authenticated user.

**Auth**: Required (session or API key).

**Response**: Array of scan objects with history.

### GET /api/scans/{id}
Retrieve detailed scan result by ID.

**Auth**: Optional (public if not scan owner).

**Response**: Complete scan object with all analysis.

### GET /api/scans/{id}/report
Retrieve publicly shareable scan report.

**Auth**: Not required (public endpoint).

**Response**: HTML scan report or JSON (depends on Accept header).

## Subscription Tiers

| Tier | Price | Scans/mo | Full Fixes | API Access |
|------|-------|----------|-----------|-----------|
| Diagnose | $0 | 3 | No (1 sample) | No |
| Fix | $29 | 50 | Yes | No |
| Monitor | $49 | 100 | Yes | No |
| Alert | $79 | 500 | Yes | No |
| Scale | $149 | Unlimited | Yes | Yes |

## Authentication

### API Keys (Scale tier)
Use API keys in the Authorization header:
\`\`\`
Authorization: Bearer sk_live_xxxxxxxxxxxxxxxxxxxx
\`\`\`

### OAuth / Magic Link
Use NextAuth.js for user authentication:
- Google OAuth: \`/api/auth/signin\`
- Magic link: Send email to \`/api/auth/callback/email\`

## Rate Limiting

- **Free tier**: 1 scan per minute, 3 per month
- **Paid tiers**: Per-tier scan limits, hourly burst limits
- **Scale tier**: Custom rate limits available

## Support & Resources

- **Docs**: https://conduitscore.com/docs
- **Blog**: https://conduitscore.com/blog
- **Email**: benstone@conduitscore.com
- **Status**: https://conduitscore.com/status

## Upcoming Features

- Scheduled weekly rescans
- Email alerts on score drops
- Bulk CSV upload
- Integration with popular CMS platforms
- Advanced custom rules and scoring
`;

  return new NextResponse(llmsFullContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export const runtime = "nodejs";
