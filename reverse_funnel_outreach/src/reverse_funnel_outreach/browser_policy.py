"""
Decide when to run a JS/browser enrichment pass after static httpx crawl.
"""
from __future__ import annotations

from reverse_funnel_outreach import config


def site_backed_sighting_count(
    sightings: dict[str, list[tuple]],
) -> int:
    """Count unique emails that have at least one site_page / httpx sighting."""
    n = 0
    for _email, rows in sightings.items():
        for row in rows:
            # (url, found_in, depth, source_type, context, source_kind)
            if len(row) >= 6:
                sk = row[5]
                st = row[3]
                if sk == "site_page" and st == "httpx":
                    n += 1
                    break
    return n


def should_use_browser_fallback(
    sightings: dict[str, list[tuple]],
    pages_crawled: int,
    *,
    page_limit: int,
) -> bool:
    """
    Run browser pass when static crawl found no site-backed emails but we did crawl
    at least min_pages — i.e. thin DOM / JS-heavy site.
    """
    config.load_env()
    if not config.get_bool("BROWSER_FALLBACK_ENABLED", True):
        return False
    if site_backed_sighting_count(sightings) > 0:
        return False
    min_pages = max(1, config.get_int("BROWSER_FALLBACK_MIN_PAGES", 2))
    if pages_crawled < min_pages:
        return False
    # Do not trigger if we never successfully fetched (pages_crawled 0)
    if pages_crawled < 1:
        return False
    return True


def harvest_js_fallback(start_url: str) -> tuple[list[str], str]:
    """
    Crawl4AI (+ optional Conduit) only. Returns (emails, sources_joined).
    """
    from reverse_funnel_outreach.harvest import harvest_crawl4ai, _normalize_start_url

    config.load_env()
    url = _normalize_start_url(start_url)
    sources: list[str] = []
    out: list[str] = []

    if config.get_bool("USE_CRAWL4AI", True):
        try:
            _, c4 = harvest_crawl4ai(url)
            out.extend(c4)
            if c4:
                sources.append("crawl4ai")
        except Exception as e:
            sources.append(f"crawl4ai_error:{e!s}")

    if config.use_conduit_browser():
        try:
            from reverse_funnel_outreach.harvest_conduit import harvest_conduit_crawl

            _, cond = harvest_conduit_crawl(
                url,
                max_depth=min(1, config.conduit_harvest_max_depth()),
                page_limit=min(10, config.conduit_harvest_page_limit()),
            )
            if cond:
                for e in cond:
                    if e not in out:
                        out.append(e)
                sources.append("conduit")
        except Exception as e:
            sources.append(f"conduit_error:{e!s}")

    return list(dict.fromkeys(out)), ";".join(sources)
