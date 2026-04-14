# Reverse Funnel outreach (Python)

Standalone pipeline:

1. **Harvest** emails from a domain using **httpx + Trafilatura**, optional **Crawl4AI** (headless), optional **Scrapy** (same-domain links).
2. **Scan** domains with **ConduitScore** `POST /api/scan` (Agency API key).
3. **Render** cold emails from `cold-email-variants.md` (Jinja-style `{{placeholders}}`).

**Plain-English walkthrough:** [`REVERSE_FUNNEL_OUTREACH_GUIDE.md`](REVERSE_FUNNEL_OUTREACH_GUIDE.md)

**Full production pipeline** (Google Sheet columns, Gmail sender, A/B/C×5, snippets, caching): see [`../conduit_outreach_pipeline/`](../conduit_outreach_pipeline/) and `conduit-op`.

## Setup

1. Use Python 3.10+ (3.13 supported).
2. From this folder:

   ```bash
   pip install -e .
   ```

3. Copy environment variables from the reverse-funnel-scanner skill or use this project’s `.env.example` as a template. At minimum set:

   - `CONDUITSCORE_API_KEY` — Agency tier key for the REST API.
   - Optionally `REVERSE_FUNNEL_ENV_DIR` pointing at `...\.claude\skills\reverse-funnel-scanner` so your existing `.env` loads.

4. Crawl4AI uses Playwright. After install, run (use UTF-8 on Windows so the console doesn’t crash on symbols):

   ```powershell
   $env:PYTHONIOENCODING='utf-8'; crawl4ai-setup
   ```

   If you see **`Install-WindowsFeature Server-Media-Foundation`** permission errors, they come from Playwright’s optional media stack: Chromium still downloaded successfully in most cases; run PowerShell **as Administrator** only if video/media features fail later.

   More detail: [Crawl4AI](https://github.com/unclecode/crawl4ai).

## Commands

```bash
rf-outreach harvest https://example.com
rf-outreach harvest https://example.com --no-crawl4ai --no-scrapy
rf-outreach scan https://example.com -o scan.json
rf-outreach render A1 example.com -f Jane
rf-outreach run prospects.csv -o outreach_out.csv --steps A1,A2,A3
```

`run` expects CSV columns including `domain`, and optionally `email`, `first_name`. It can re-harvest the first contact email unless `--skip-harvest` is set.

## Cold email templates

Bundled at `src/reverse_funnel_outreach/data/cold-email-variants.md`. Override with `COLD_EMAIL_VARIANTS_PATH` or place `cold-email-variants.md` in the reverse-funnel-scanner skill folder (auto-detected).

## Legal

Respect each site’s terms, `robots.txt`, and anti-spam law. This tool is for opt-in / compliant outreach only.
