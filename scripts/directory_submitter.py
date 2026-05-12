#!/usr/bin/env python3
"""
directory_submitter.py — ConduitScore
Playwright-based directory submission worker.

Usage:
  python directory_submitter.py --batch 1          # submit batch 1
  python directory_submitter.py --batch 2          # submit batch 2
  python directory_submitter.py --batch 1 --dry-run  # preview only
  python directory_submitter.py --health           # check site health

Run select_directories.py first to generate selected_directories.json.
"""

import argparse
import json
import logging
import sys
import time
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Business info — what we submit everywhere
# ---------------------------------------------------------------------------
BUSINESS = {
    "name":        "ConduitScore",
    "url":         "https://conduitscore.com",
    "email":       "hello@conduitscore.com",
    "tagline":     "AI Visibility Score for Your Website",
    "description": (
        "ConduitScore scans any website and gives it a 0-100 AI Visibility Score "
        "— showing how visible your site is to AI agents like ChatGPT, Claude, and Perplexity. "
        "Get a full breakdown by category, a prioritized list of issues, and exact code fixes "
        "you can implement today to get discovered by AI."
    ),
    "short_description": (
        "Free AI visibility scanner that scores your website 0-100 based on how well "
        "AI agents like ChatGPT and Claude can find and read it."
    ),
    "category":    "SaaS / AI Tools",
    "keywords":    "AI visibility, AI SEO, llms.txt, robots.txt, website scanner, ChatGPT visibility",
    "twitter":     "",
    "linkedin":    "",
}

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR     = Path(r"C:\Users\Administrator\Desktop\ConduitScore\scripts")
DATA_FILE    = BASE_DIR / "selected_directories.json"
LOG_DIR      = BASE_DIR / "logs"
RESULTS_DIR  = BASE_DIR / "results"
SCREENSHOT_DIR = BASE_DIR / "screenshots"

LOG_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
def setup_logging(batch_num: int) -> logging.Logger:
    date_str = datetime.now().strftime("%Y-%m-%d")
    log_file = LOG_DIR / f"batch{batch_num}_{date_str}.log"
    logger = logging.getLogger(f"batch{batch_num}")
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        fh = logging.FileHandler(log_file, encoding="utf-8")
        fh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
        sh = logging.StreamHandler(sys.stdout)
        sh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
        logger.addHandler(fh)
        logger.addHandler(sh)
    return logger


# ---------------------------------------------------------------------------
# Form field filling helpers
# ---------------------------------------------------------------------------
FIELD_MAP = {
    # Common form field name/id/placeholder variations → our value
    "url":         BUSINESS["url"],
    "website":     BUSINESS["url"],
    "site":        BUSINESS["url"],
    "link":        BUSINESS["url"],
    "siteurl":     BUSINESS["url"],
    "websiteurl":  BUSINESS["url"],
    "webpage":     BUSINESS["url"],

    "name":        BUSINESS["name"],
    "title":       BUSINESS["name"],
    "business":    BUSINESS["name"],
    "sitename":    BUSINESS["name"],
    "businessname":BUSINESS["name"],
    "companyname": BUSINESS["name"],

    "email":       BUSINESS["email"],
    "mail":        BUSINESS["email"],

    "description": BUSINESS["description"],
    "desc":        BUSINESS["description"],
    "summary":     BUSINESS["short_description"],
    "about":       BUSINESS["short_description"],
    "excerpt":     BUSINESS["short_description"],
    "brief":       BUSINESS["short_description"],

    "tagline":     BUSINESS["tagline"],
    "slogan":      BUSINESS["tagline"],
    "headline":    BUSINESS["tagline"],

    "category":    BUSINESS["category"],
    "keywords":    BUSINESS["keywords"],
    "tags":        BUSINESS["keywords"],
}


def get_field_value(label: str) -> str:
    """Map a form field label/name to our business value."""
    key = label.lower().strip().replace("-", "").replace("_", "").replace(" ", "")
    return FIELD_MAP.get(key, "")


# ---------------------------------------------------------------------------
# Playwright submission
# ---------------------------------------------------------------------------
def try_fill_form(page, logger) -> bool:
    """
    Attempt to fill a generic submission form using common selector patterns.
    Returns True if at least one field was filled.
    """
    filled = 0

    # Try each input/textarea on the page
    inputs = page.query_selector_all("input[type='text'], input[type='url'], input[type='email'], textarea, input:not([type])")
    for el in inputs:
        try:
            # Check if visible
            if not el.is_visible():
                continue

            # Try to infer what field this is
            name  = (el.get_attribute("name") or "").lower()
            id_   = (el.get_attribute("id") or "").lower()
            ph    = (el.get_attribute("placeholder") or "").lower()
            label = name or id_ or ph

            value = get_field_value(label)
            if value:
                el.fill(value)
                logger.debug(f"  Filled [{label}] = {value[:60]}")
                filled += 1
                time.sleep(0.3)
        except Exception as e:
            logger.debug(f"  Field error: {e}")
            continue

    return filled > 0


def submit_directory(directory: dict, dry_run: bool, logger) -> dict:
    """Submit to one directory. Returns result dict."""
    name   = directory.get("name", "Unknown")
    url    = directory.get("submission_url") or directory.get("website", "")
    result = {
        "id":      directory.get("id"),
        "name":    name,
        "url":     url,
        "status":  "pending",
        "error":   None,
        "ts":      datetime.now().isoformat(),
    }

    if not url:
        result["status"] = "skipped_no_url"
        return result

    if dry_run:
        logger.info(f"  [DRY-RUN] Would submit to: {name} ({url})")
        result["status"] = "dry_run"
        return result

    try:
        from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            ctx = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                )
            )
            page = ctx.new_page()

            try:
                page.goto(url, timeout=30_000, wait_until="domcontentloaded")
                time.sleep(1.5)

                filled = try_fill_form(page, logger)

                if not filled:
                    result["status"] = "skipped_no_form"
                    logger.info(f"  [{name}] No fillable form found — skipped")
                else:
                    # Look for submit button
                    submit_selectors = [
                        "button[type='submit']",
                        "input[type='submit']",
                        "button:has-text('Submit')",
                        "button:has-text('Add')",
                        "button:has-text('List')",
                        "button:has-text('Send')",
                        "button:has-text('Register')",
                        ".submit", "#submit",
                    ]
                    submitted = False
                    for sel in submit_selectors:
                        btn = page.query_selector(sel)
                        if btn and btn.is_visible():
                            btn.click()
                            time.sleep(2)
                            submitted = True
                            break

                    if submitted:
                        # Take screenshot as evidence
                        shot_path = SCREENSHOT_DIR / f"{directory['id']}.png"
                        page.screenshot(path=str(shot_path))
                        result["status"] = "submitted"
                        result["screenshot"] = str(shot_path)
                        logger.info(f"  [{name}] Submitted")
                    else:
                        result["status"] = "no_submit_button"
                        logger.info(f"  [{name}] Form filled but no submit button found")

            except PWTimeout:
                result["status"] = "timeout"
                result["error"] = "Page load timeout"
                logger.warning(f"  [{name}] Timeout loading {url}")
            except Exception as e:
                result["status"] = "error"
                result["error"] = str(e)
                logger.warning(f"  [{name}] Error: {e}")
            finally:
                browser.close()

    except ImportError:
        logger.error("Playwright not installed. Run: pip install playwright && playwright install chromium")
        result["status"] = "error"
        result["error"] = "playwright not installed"

    return result


# ---------------------------------------------------------------------------
# Batch runner
# ---------------------------------------------------------------------------
def run_batch(batch_num: int, dry_run: bool = False):
    logger = setup_logging(batch_num)

    logger.info("=" * 60)
    logger.info(f"ConduitScore Directory Submitter — Batch {batch_num}")
    logger.info(f"Dry-run: {dry_run}")
    logger.info("=" * 60)

    if not DATA_FILE.exists():
        logger.error(f"Data file not found: {DATA_FILE}")
        logger.error("Run select_directories.py first.")
        sys.exit(1)

    with open(DATA_FILE, encoding="utf-8") as f:
        data = json.load(f)

    batch_key = str(batch_num)
    directories = data.get("batches", {}).get(batch_key, [])

    if not directories:
        logger.error(f"Batch {batch_num} not found in {DATA_FILE}")
        sys.exit(1)

    logger.info(f"Batch {batch_num}: {len(directories)} directories to process")

    results = []
    stats = {"submitted": 0, "skipped": 0, "error": 0, "dry_run": 0}

    for i, directory in enumerate(directories, 1):
        logger.info(f"[{i}/{len(directories)}] {directory['name']}")
        result = submit_directory(directory, dry_run=dry_run, logger=logger)
        results.append(result)

        s = result["status"]
        if s == "submitted":
            stats["submitted"] += 1
        elif s == "dry_run":
            stats["dry_run"] += 1
        elif s in ("error", "timeout"):
            stats["error"] += 1
        else:
            stats["skipped"] += 1

        # Rate limit — be polite
        time.sleep(3)

    # Save results
    date_str = datetime.now().strftime("%Y-%m-%d")
    result_file = RESULTS_DIR / f"batch{batch_num}_{date_str}.json"
    with open(result_file, "w", encoding="utf-8") as f:
        json.dump({"batch": batch_num, "stats": stats, "results": results}, f, indent=2)

    logger.info("")
    logger.info("=" * 60)
    logger.info(f"Batch {batch_num} complete")
    logger.info(f"  Submitted:  {stats['submitted']}")
    logger.info(f"  Skipped:    {stats['skipped']}")
    logger.info(f"  Errors:     {stats['error']}")
    if dry_run:
        logger.info(f"  Dry-run:    {stats['dry_run']}")
    logger.info(f"  Results:    {result_file}")
    logger.info("=" * 60)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
def run_health():
    import urllib.request
    endpoints = [
        "https://conduitscore.com",
        "https://conduitscore.com/api/health",
    ]
    print("ConduitScore Health Check")
    for ep in endpoints:
        try:
            with urllib.request.urlopen(ep, timeout=10) as r:
                code = r.getcode()
                print(f"  [{code}] {ep}")
        except Exception as e:
            print(f"  [ERR] {ep} — {e}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ConduitScore Directory Submitter")
    parser.add_argument("--batch",   type=int, choices=[1,2,3,4,5,6], help="Batch number to run")
    parser.add_argument("--dry-run", action="store_true", help="Preview only — no actual submissions")
    parser.add_argument("--health",  action="store_true", help="Run site health check")
    args = parser.parse_args()

    if args.health:
        run_health()
    elif args.batch:
        run_batch(args.batch, dry_run=args.dry_run)
    else:
        parser.print_help()
