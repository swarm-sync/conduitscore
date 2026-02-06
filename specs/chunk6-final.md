# Chunk 6: Final (Reports + Scheduling + Email + Polish)

## Goal
PDF reports, weekly re-scans, email alerts, project management, API keys, analytics, error tracking, production polish.

## Tasks
1. Build PDF report generator using @react-pdf/renderer
2. Create GET /api/scans/[id]/report route for PDF generation
3. Build project CRUD: POST/GET /api/projects, GET/PATCH/DELETE /api/projects/[id]
4. Build project management UI pages
5. Create scheduled scan config: POST /api/projects/[id]/schedule
6. Create cron endpoint: POST /api/cron/weekly-scan
7. Build API key management (Agency tier only):
   - POST/GET /api/keys
   - DELETE /api/keys/[id]
   - API key creation UI with one-time key reveal
8. Set up Resend email templates for scan completion and score changes
9. Integrate PostHog analytics (lib/posthog.ts)
10. Integrate Sentry error tracking
11. Add SEO metadata to all pages
12. Configure vercel.json with cron schedules
13. Final accessibility check
14. Verify full end-to-end flow

## Done Means
- PDF reports generate and download correctly
- Projects can be created, updated, deleted
- API keys work for Agency tier
- All pages have proper SEO metadata
- `npm run typecheck && npm test && npm run build` passes
- Full flow: signup → scan → view results → download report

## Scoreboard
```powershell
npm run typecheck && npm test && npm run build
```
