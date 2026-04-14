# Reverse Funnel Outreach — What This Is (Plain English)

This document explains the **`rf-outreach`** tool in everyday language. You do not need to be a programmer to understand what it does or how the pieces fit together.

---

## The big picture

**Goal:** Help you reach out to businesses (for example, startups or agencies) with emails that mention **real data** about their website—especially their **AI visibility score** from **ConduitScore**—instead of sending the same generic message to everyone.

**What this tool is:** A small program that runs on **your computer**. It can:

1. **Find email addresses** on a company’s website (when those addresses are published on pages the tool is allowed to load).
2. **Ask ConduitScore to scan** that company’s site and return a **score**, **issues**, and **suggested fixes**.
3. **Fill in email templates** (like “Hi {{first_name}}, your score is…”) so you get ready-to-review subject lines and email bodies.

**What this tool is not:** It is not ConduitScore’s main website. It is not automatic sending of email from your inbox (that would be a separate step). It does not bypass paywalls or log into private sites.

---

## The name “reverse funnel” (simple explanation)

A normal **sales funnel** is wide at the top (many strangers) and narrow at the bottom (few buyers).

A **reverse funnel** idea here means: you start from **specific targets** (companies you already chose), pull **real signals** (scores, top problems), then **personalize** outreach so the first contact is relevant—not random spam.

---

## What happens step by step

### Step 1 — You install the tool once

On your machine you run a standard “install this package” step so the command **`rf-outreach`** becomes available. That’s like adding a new app to your computer’s command line.

### Step 2 — You tell it where your secrets live

The tool needs permission to call **ConduitScore’s API** (a secure channel on the internet that returns scan results). That permission is usually a **long secret key** stored in a file named **`.env`** on your computer.

This repo’s **`reverse_funnel_outreach/.env`** can say:

- **`REVERSE_FUNNEL_ENV_DIR`** = the folder where your **reverse-funnel-scanner** skill already keeps **its** `.env` file.

Then the tool **loads your API key from that skill folder** automatically. You don’t have to copy the key into two places.

*(Never share your `.env` file or commit it to public GitHub.)*

### Step 3 — Optional: prepare the “browser robot” for JavaScript sites

Some websites only show their full content after **JavaScript** runs in a browser. **Crawl4AI** uses a real browser engine (via **Playwright**) to load those pages so the tool can **see** the same text a human would.

You run a **one-time setup** command (for example **`crawl4ai-setup`**) so that browser piece is installed. If you skip this, you can still use the tool for simpler sites, or turn off the browser step with flags (see the README).

On **Windows**, if setup prints a weird error about “charmap,” run it with UTF-8 output enabled (the root **`CLAUDE.md`** mentions this).

### Step 4 — Harvest: “find emails on this website”

When you run **`harvest`** with a company’s URL, the tool:

1. **Downloads the page** like a normal visitor (polite **user agent**, respects **robots.txt** when using the crawler).
2. **Reads the text** out of the page (using **Trafilatura**—think “extract the article, not the ads”).
3. **Looks for email-shaped text** (like `name@company.com`) with simple, strict rules so obvious junk is dropped.
4. Optionally uses **Crawl4AI** (browser) if you enabled it.
5. Optionally uses **Scrapy** to open a **few internal links on the same website** (for example `/contact`, `/about`) to find an address that wasn’t on the home page.

It then **ranks** what it finds—for example, it may prefer addresses on the **same domain** as the company.

**Important:** If a company does not publish an email, **the tool cannot invent one.** That’s expected.

### Step 5 — Scan: “what’s their ConduitScore?”

When you run **`scan`** (or when **`run`** does it for you), the tool sends the website address to **ConduitScore** and gets back JSON data. In plain terms, that includes:

- A **score** from 0–100 (how “visible” the site is to AI-style tools in their model).
- A list of **issues** (things that hurt the score).
- **Fixes** (sometimes including copy-paste suggestions).

Your **Agency-tier API key** is required here—the same kind of access the product uses for automated scans.

### Step 6 — Render: “turn templates into real emails”

The file **`cold-email-variants.md`** holds several **sequences** (labeled **A1** through **A5**). Each has:

- A **subject line pattern**
- A **body pattern**
- Placeholders like **`{{first_name}}`**, **`{{ai_visibility_score}}`**, **`{{top_issue}}`**, **`{{rescan_link}}`**, etc.

The tool **fills in** those placeholders using:

- The **scan results**
- The **domain**
- A **first name** you supplied (or a friendly default like “there”)
- Links you configured (for example, a **re-scan** link on ConduitScore with tracking parameters)

You get **plain text** email bodies you can paste into Gmail, a mail merge tool, or a sending system.

### Step 7 — Batch mode: **`run`** on a spreadsheet

**`run`** reads a **CSV file** (a simple table—openable in Excel or Google Sheets). Each row is usually one company.

For each row it can:

1. Optionally **re-harvest** the “best guess” email from the domain.
2. **Scan** the domain with ConduitScore.
3. **Render** one or more steps (**A1**, **A2**, …) into new columns (subject + body per step).

You end up with a new CSV you can **review** before anything is sent.

---

## Commands (what to type, in human terms)

| Command | Plain meaning |
|--------|----------------|
| **`rf-outreach harvest <url>`** | “Go to this website and try to find published emails.” |
| **`rf-outreach scan <url>`** | “Run a ConduitScore scan and show (or save) the raw result.” |
| **`rf-outreach render A1 <domain> -f Pat`** | “Build the **A1** email for this domain, calling the API unless you pass a saved scan file.” |
| **`rf-outreach run input.csv -o output.csv --steps A1,A2`** | “Process every row: harvest (unless skipped), scan, render those steps into columns.” |

Use **`--help`** on any command for the full list of options.

---

## How the tech stack maps to those steps (still non-technical)

| Piece | Analogy |
|--------|---------|
| **httpx** | A fast way to **download a web page** as text. |
| **Trafilatura** | **Strips clutter** so you’re reading the real page content, not navigation noise. |
| **Crawl4AI + Playwright** | Opens a **headless browser**—like an invisible Chrome—to see pages that need JavaScript. |
| **Scrapy** | A disciplined **crawler**: follows a few **same-site links** to hunt for a contact page. |
| **ConduitScore API** | The **official score engine** you already use in production—same rules, same tiers. |
| **Jinja-style templates** | **Mad Libs** for email: slots that get filled from real data. |

---

## Ethics and compliance (short and practical)

- **Robots.txt and site terms:** The crawler is built to be **polite** (for example, Scrapy can obey robots rules). You are still responsible for **how** you use data you collect.
- **Email law (e.g. CAN-SPAM):** Sending bulk email has rules about **identity**, **unsubscribe**, and **honest subject lines**. This tool **does not** replace legal advice.
- **Don’t use this to harass** or to scrape data you’re not allowed to use.

---

## Where to read more in this repo

- **Developer setup:** [`README.md`](README.md) in this folder.
- **Repo-wide pointer:** root [`CLAUDE.md`](../CLAUDE.md) under **“Reverse funnel outreach (Python CLI).”**

---

## If something goes wrong

| Symptom | Likely cause |
|--------|----------------|
| “API key not set” | `.env` missing **`CONDUITSCORE_API_KEY`**, or **`REVERSE_FUNNEL_ENV_DIR`** points to the wrong folder. |
| No emails found | The site doesn’t publish emails on crawled pages, or pages are blocked. |
| Crawl4AI errors | Playwright browsers not installed—run **`crawl4ai-setup`** (with UTF-8 on Windows if needed). |
| Windows “charmap” / Unicode errors | Run commands with **`PYTHONIOENCODING=utf-8`** (the CLI also tries to fix console encoding on startup). |
| Red errors about **`Install-WindowsFeature Server-Media-Foundation`** during setup | Playwright tried to enable an optional Windows media component; **setup can still finish OK** (Chromium downloaded). Use **Run as administrator** only if video or media capture inside the browser actually fails. |

---

*Last updated to match the `reverse_funnel_outreach` package layout in this repository.*
