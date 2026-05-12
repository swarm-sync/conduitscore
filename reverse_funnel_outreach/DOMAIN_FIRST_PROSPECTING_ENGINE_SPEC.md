# Domain-First Prospecting Engine

Build plan and technical spec for a system that:

1. Starts from a domain or website URL.
2. Crawls the site and selected public sources.
3. Extracts email addresses.
4. Links each email back to the exact source URL where it was found.
5. Scores confidence so junk, placeholders, and third-party addresses fall to the bottom.

---

## Goal

The engine should answer one practical question well:

**"Given this company domain, what real contact emails can we find, how trustworthy are they, and where exactly did we find them?"**

This is the discovery layer for reverse-funnel outreach. It feeds:

- ConduitScore scan + issue analysis
- spreadsheet / CRM ingestion
- message personalization
- retryable outreach workflows later

It is **not** the sending system. It is the **prospect discovery and evidence system**.

---

## Success Criteria

The engine is successful when it can:

- accept a list of domains or URLs
- crawl same-domain pages safely and predictably
- support both static pages and JS-rendered pages
- extract all visible candidate emails
- store the exact page URL that produced each email
- rank likely real business contacts above junk
- filter obvious garbage like placeholders and unrelated third-party addresses
- return results in CSV / JSON / DB form
- be re-run without duplicating work unnecessarily

Nice-to-have later:

- MX checks
- SMTP-level verification
- person-name inference
- role-based routing like `sales@`, `partnerships@`, `hello@`
- organization enrichment

---

## Product Shape

### Input

Supported input forms:

- single domain: `example.com`
- full URL: `https://example.com`
- batch CSV with `domain`
- batch TXT with one domain per line

Optional input fields:

- `company_name`
- `industry_vertical`
- `priority`
- `notes`

### Output

Each candidate email should produce one row with evidence:

| Field | Meaning |
|-------|---------|
| `root_domain` | Target company domain entered by the user |
| `source_url` | Exact page where the email was found |
| `email` | Normalized email address |
| `email_domain` | Domain part after `@` |
| `source_type` | `httpx`, `crawl4ai`, `conduit`, `scrapy`, `search_osint`, etc. |
| `crawl_depth` | How far from the start URL the page was |
| `found_in` | `html`, `text`, `mailto`, `jsonld`, `script`, `visible_text` |
| `confidence_score` | Numeric score, 0-100 |
| `confidence_label` | `high`, `medium`, `low`, `reject` |
| `reason_flags` | Why it got its score |
| `discovered_at` | UTC timestamp |
| `run_id` | Batch run identifier |

---

## Core System Design

The engine should be split into small modules with clear jobs.

### 1. Input Normalizer

Responsibilities:

- normalize bare domains to `https://...`
- strip tracking params
- derive canonical root domain
- reject malformed URLs early

Outputs:

- `normalized_start_url`
- `root_domain`

### 2. Crawl Orchestrator

Responsibilities:

- choose crawl path per target
- coordinate static fetch, JS fetch, and recursive crawl
- enforce per-domain limits
- dedupe visited URLs
- stop infinite crawling loops

Recommended crawl order:

1. `httpx` fetch for homepage
2. text extraction via `trafilatura`
3. browser fetch for JS pages via `Crawl4AI` or `Conduit`
4. same-domain recursive crawl for likely contact pages
5. optional passive source lookup

Suggested page priority:

- `/contact`
- `/about`
- `/team`
- `/company`
- `/support`
- `/legal`
- `/privacy`
- `/terms`
- footer links

### 3. Link Discovery

Responsibilities:

- extract internal links from pages
- keep only same-domain links by default
- prioritize contact-ish paths
- skip known junk paths

Default skip patterns:

- logout
- cart
- checkout
- search results
- tag archives
- calendar pages
- file downloads

### 4. Content Extraction

Responsibilities:

- pull raw HTML
- derive visible text
- inspect `mailto:` links
- inspect JSON-LD and structured data
- inspect inline script content only for explicit email strings

Important rule:

Store enough evidence to explain where every email came from.

### 5. Email Candidate Extractor

Responsibilities:

- regex match candidate emails
- normalize case and punctuation
- decode common obfuscation where legal and practical
- dedupe repeated sightings

Supported candidate sources:

- direct text emails
- `mailto:` links
- Cloudflare obfuscated email patterns
- common JS string assembly patterns
- HTML attributes like `data-email`

Do not attempt invasive bypass work. This should stay within normal public-page extraction.

### 6. Source Linker

Responsibilities:

- bind every email to:
  - the root domain
  - the exact source page
  - the extraction method
- preserve multiple sightings for the same email

Example:

- `hello@example.com` may appear on homepage, footer, and contact page
- final canonical row can retain:
  - best source URL
  - sighting count
  - all source URLs if needed in JSON

### 7. Confidence Scorer

Responsibilities:

- rank likely real contacts
- push placeholders and third-party references down
- turn extraction into something the outreach system can trust

### 8. Persistence Layer

Recommended storage:

- SQLite for local runs and caches
- JSONL exports for audits
- CSV for operator review
- optional Postgres later for shared usage

### 9. Output Adapters

Responsibilities:

- export to CSV
- export to JSONL
- export clean rows to Google Sheet / CRM
- preserve both raw evidence and filtered top result

---

## Confidence Scoring Spec

Start with a score of `50`, then add or subtract.

### Positive signals

- `+30` email domain matches target root domain exactly
- `+20` email domain is a valid subdomain of target
- `+15` found on `/contact`
- `+12` found on `/about` or `/team`
- `+10` found in `mailto:`
- `+10` repeated on multiple same-domain pages
- `+8` local part begins with `hello`, `contact`, `sales`, `support`, `team`, `founder`
- `+5` page title suggests contact or company info

### Negative signals

- `-40` placeholder patterns like `your@email.com`, `name@example.com`
- `-35` email domain clearly unrelated to target domain
- `-30` found inside demo template content
- `-25` known fake names like `alice@work.com`, `bob@smith.com`
- `-20` only found in blog comments or user-generated content
- `-20` page clearly references a theme/template vendor
- `-15` abuse-only or anti-fraud mailbox if goal is sales outreach
- `-10` appears on only one low-trust page with no other support

### Confidence labels

- `80-100` = `high`
- `60-79` = `medium`
- `40-59` = `low`
- `<40` = `reject`

### Special handling

Treat these as valid but separately tagged:

- `legal@`
- `privacy@`
- `abuse@`
- `security@`

They may be real, but are usually bad outreach targets.

---

## Filtering Rules

### Reject outright

- placeholder/test addresses
- clearly unrelated third-party vendor addresses
- malformed emails
- duplicate output rows with no unique evidence

### Keep but tag

- `info@`
- `hello@`
- `team@`
- legal/privacy/security addresses
- freemail addresses when found on the target domain's public site

### Prefer for outreach

- same-domain role accounts
- founder or team addresses
- sales/contact/support addresses on real company pages

---

## Crawl Strategy

### Static-first

Use `httpx` + HTML parsing first because it is:

- faster
- cheaper
- easier to debug

### Browser second

Use `Crawl4AI` or `Conduit` when:

- the page is JS-heavy
- the static fetch is empty or too thin
- important navigation or content is hidden until render

### Recursive crawl rules

Defaults:

- same-domain only
- max depth: `1` to start
- max pages: `25` per domain
- prioritize "contact-ish" URLs first

Scale-up mode:

- max depth: `2`
- max pages: `100`

Stop conditions:

- enough high-confidence emails found
- page limit hit
- repeated low-value pages
- rate limit detected

---

## Recommended Stack

### Foundation

- Python 3.12+
- Scrapy for controlled crawling
- `httpx` for direct fetches
- `trafilatura` for clean text extraction
- `playwright` / `Crawl4AI` for JS sites
- `Conduit` as optional alternate browser/crawl path

### Data + storage

- SQLite
- CSV / JSONL export

### Parsing helpers

- `parsel`
- `beautifulsoup4`
- `lxml`
- `email-validator`

### Why this stack

It matches what is already in the repo, avoids unnecessary platform jumps, and gives you both:

- simple CLI usage now
- product-grade internals later

---

## Suggested File / Module Layout

```text
reverse_funnel_outreach/
  src/reverse_funnel_outreach/
    input_normalizer.py
    crawl_orchestrator.py
    link_discovery.py
    content_extract.py
    email_candidates.py
    source_linker.py
    confidence_score.py
    filters.py
    store.py
    export_csv.py
    export_jsonl.py
    cli.py
```

If building inside the existing outreach code:

- keep harvest logic in `reverse_funnel_outreach`
- keep sheet/send logic in `conduit_outreach_pipeline`
- do not mix those responsibilities again

---

## Database Schema

### `crawl_runs`

| Column | Type | Notes |
|-------|------|------|
| `id` | text | run UUID |
| `started_at` | datetime | UTC |
| `finished_at` | datetime | UTC |
| `input_count` | int | domains requested |
| `status` | text | running/completed/failed |

### `pages`

| Column | Type | Notes |
|-------|------|------|
| `id` | text | page UUID |
| `run_id` | text | FK to crawl run |
| `root_domain` | text | target root domain |
| `url` | text | exact crawled URL |
| `depth` | int | crawl depth |
| `source_type` | text | httpx/crawl4ai/conduit/scrapy |
| `status_code` | int | if known |
| `fetched_at` | datetime | UTC |
| `content_hash` | text | dedupe/debug |

### `email_findings`

| Column | Type | Notes |
|-------|------|------|
| `id` | text | finding UUID |
| `run_id` | text | FK |
| `root_domain` | text | target company |
| `source_url` | text | exact evidence page |
| `email` | text | normalized |
| `email_domain` | text | extracted domain |
| `found_in` | text | mailto/html/text/script/jsonld |
| `source_type` | text | fetch path |
| `raw_context` | text | optional snippet |
| `confidence_score` | int | 0-100 |
| `confidence_label` | text | high/medium/low/reject |
| `flags_json` | text | reasons |
| `created_at` | datetime | UTC |

### `email_canonicals`

One best row per `root_domain + email`.

| Column | Type | Notes |
|-------|------|------|
| `root_domain` | text | target |
| `email` | text | canonical address |
| `best_source_url` | text | best evidence page |
| `best_confidence_score` | int | best score |
| `sighting_count` | int | how many times found |
| `recommended_for_outreach` | int | 0/1 |

---

## CLI Spec

### `bulk-emails`

Purpose:

- input domains
- output all findings with evidence

Suggested flags:

- `--out`
- `--max-depth`
- `--page-limit`
- `--same-domain-only`
- `--one-per-domain`
- `--min-confidence`
- `--use-conduit`
- `--use-crawl4ai`

### `score-emails`

Purpose:

- re-score a prior harvest with updated rules

### `top-emails`

Purpose:

- emit only the best candidate per domain

### `push-prospects`

Purpose:

- convert accepted findings into Sheet / CRM input

---

## Phased Build Plan

## Phase 1: Clean Core Harvester

Goal:

- reliable domain crawl
- source URL retained
- confidence scoring v1

Tasks:

1. Normalize input domain/URL handling.
2. Store every crawled page with source type.
3. Store every email with exact `source_url`.
4. Add confidence scoring and labels.
5. Export CSV with evidence columns.

Target outcome:

- one command that produces trustworthy `domain -> email -> source_url` rows

### Phase 2: Browser Hardening

Goal:

- stronger JS-page coverage

Tasks:

1. Keep `Crawl4AI` path stable on Windows.
2. Keep `Conduit` path optional and cleanly isolated.
3. Add fallback order if one browser path fails.
4. Add timeout and retry rules per target.

Target outcome:

- fewer "no email found" misses on modern marketing sites

### Phase 3: Smarter Ranking

Goal:

- better quality for outreach use

Tasks:

1. Add placeholder and template detection.
2. Add third-party vendor detection.
3. Add stronger same-domain and role-based ranking.
4. Add best-email-per-domain selection.

Target outcome:

- top result is usually the one a human would pick

### Phase 4: Prospect Pipeline Integration

Goal:

- connect discovery to ConduitScore and outreach

Tasks:

1. Convert accepted findings into prospect rows.
2. Trigger ConduitScore scan for accepted domains.
3. Attach top issue and fix snippet.
4. Push curated rows into Sheet / DB.

Target outcome:

- domain-first prospect discovery feeds reverse-funnel messaging automatically

---

## Risks and Failure Modes

### 1. Placeholder garbage

Risk:

- themes, templates, docs, examples produce fake emails

Mitigation:

- hard reject list
- template-content penalty
- require evidence quality

### 2. Third-party contamination

Risk:

- pages mention partner, vendor, support, theme, or author emails

Mitigation:

- penalize non-matching email domains
- detect theme vendor patterns
- prefer same-domain results

### 3. JS crawl instability

Risk:

- Playwright/browser edge cases on Windows

Mitigation:

- static-first architecture
- browser as fallback, not dependency
- optional Conduit path

### 4. Rate limiting

Risk:

- targets return `429`

Mitigation:

- per-domain backoff
- page limits
- cached responses when possible

### 5. False confidence

Risk:

- engine returns junk with a high score

Mitigation:

- keep score reasons visible
- retain source URL always
- make audit output easy to inspect

---

## Minimum Viable Build

If building the fastest useful version first, build this and stop:

1. Input normalizer
2. Static fetch + text extract
3. Same-domain recursive crawl
4. Email extractor
5. Exact source URL storage
6. Confidence scoring
7. CSV export with `domain,email,source_url,confidence_score,flags`

That is enough to make the engine useful.

Everything after that improves coverage, scale, and ranking.

---

## Recommended First Deliverable

The first real deliverable should be:

**`rf-outreach bulk-emails --with-evidence`**

Output columns:

- `domain`
- `email`
- `source_url`
- `source_type`
- `confidence_score`
- `confidence_label`
- `reason_flags`

Why first:

- it directly solves the discovery problem
- it is easy to inspect
- it keeps bad rows explainable
- it plugs into Sheet / CRM / ConduitScore later

---

## Final Recommendation

Use this architecture:

- **Scrapy** as the main crawl engine
- **httpx + trafilatura** for fast first-pass fetch
- **Crawl4AI** and **Conduit** as browser-capable fallbacks
- **SQLite + CSV/JSONL** for evidence and exports
- a **confidence scorer** as a first-class module, not an afterthought

The real product value is not just "find emails."

It is:

**find the right emails, prove where they came from, and rank them well enough that the outreach layer can trust them.**
