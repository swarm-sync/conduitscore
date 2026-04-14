# Conduit Outreach Pipeline (full stack)

This is the **complete** pipeline the lightweight `reverse_funnel_outreach` CLI was meant to grow into:

| Stage | What |
|-------|------|
| Ingest | CSV with `domain`, optional `receiver_email`, names, ICP fields |
| Harvest | If email missing, best-effort homepage scrape (published addresses only) |
| Scan | ConduitScore `POST /api/scan` with **SQLite cache** + rate limit |
| Classify | Sequence **A** (SaaS) / **B** (Agency) / **C** (E-com) |
| Snippets | Schema / llms / canonical / API code (max 4 lines) + Shopify/WP hint |
| Render | **Jinja2** HTML templates per sequence ×5 steps + subjects |
| Sheet | **gspread** batch append → your Google Sheet ([template ID in `.env.example`](.env.example)) |
| Send | **Gmail API** (OAuth), ~35/day default, `List-Unsubscribe`, updates Sheet `status` |

## Docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — Mermaid diagram + scaling notes
- [TEMPLATING.md](TEMPLATING.md) — Snippet + Jinja behavior
- [ETHICS_AND_COMPLIANCE.md](ETHICS_AND_COMPLIANCE.md) — CAN-SPAM / unsubscribe  

## Setup (short)

1. `pip install -e .`
2. Copy `.env.example` → `.env` and fill `GOOGLE_SERVICE_ACCOUNT_JSON`, share the Sheet with the service account email.
3. ConduitScore **Agency** API key (via `CONDUITSCORE_API_KEY` or skill `.env` + `REVERSE_FUNNEL_ENV_DIR`).
4. Gmail: create OAuth **Desktop** client → `GMAIL_OAUTH_CREDENTIALS_JSON`; first `conduit-op send --dry-run` will open browser for consent (writes token file).
5. `conduit-op init-headers` once if the Sheet’s row 1 is empty.

## Commands

```bash
conduit-op init-headers
conduit-op process-csv examples/prospects.csv --push --jsonl-out data/audit.jsonl
conduit-op send --max 35
```

**Hundreds of rows / day:** split input CSV, run multiple `process-csv` workers with the same DB + Sheet (cache avoids duplicate scans). Gmail caps are per mailbox—use several senders or an ESP for bulk.

## Honest limits

- **Email volume** from crawling alone won’t hit “hundreds/day” unless you feed **lists** (CSV) with addresses; the harvester only picks up **published** emails.
- **Verify URL:** real links are `conduitscore.com/?url=…&utm_*` (see `links.py`); there is no private `/verify/domain` product route yet.
