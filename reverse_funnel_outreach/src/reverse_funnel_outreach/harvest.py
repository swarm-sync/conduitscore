from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from urllib.parse import urlparse

import scrapy
import trafilatura
from scrapy.crawler import CrawlerProcess

import httpx

from reverse_funnel_outreach import config
from reverse_funnel_outreach.email_extract import extract_emails_from_text, prefer_contact_emails


def _set_windows_asyncio_for_playwright() -> None:
    """Crawl4AI/Playwright subprocess transport requires Proactor on Windows."""
    import sys

    if sys.platform == "win32":
        try:
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        except Exception:
            pass


@dataclass
class HarvestResult:
    url: str
    emails: list[str] = field(default_factory=list)
    sources: list[str] = field(default_factory=list)


def _normalize_start_url(url: str) -> str:
    u = url.strip()
    if not u.startswith(("http://", "https://")):
        u = "https://" + u
    return u


def harvest_httpx(url: str) -> tuple[str, list[str]]:
    config.load_env()
    ua = config.user_agent()
    timeout = float(config.get_int("REQUEST_TIMEOUT_SECONDS", 30))
    with httpx.Client(headers={"User-Agent": ua}, timeout=timeout, follow_redirects=True) as client:
        r = client.get(url)
        r.raise_for_status()
        html = r.text
    emails = extract_emails_from_text(html)
    text = trafilatura.extract(html, url=url) or ""
    emails.extend(extract_emails_from_text(text))
    return html, list(dict.fromkeys(emails))


async def _harvest_crawl4ai_async(url: str) -> str:
    from crawl4ai import AsyncWebCrawler

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)
        return getattr(result, "html", None) or getattr(result, "cleaned_html", None) or ""


def harvest_crawl4ai(url: str) -> tuple[str, list[str]]:
    _set_windows_asyncio_for_playwright()
    html = asyncio.run(_harvest_crawl4ai_async(url))
    if not html:
        return "", []
    emails = extract_emails_from_text(html)
    text = trafilatura.extract(html, url=url) or ""
    emails.extend(extract_emails_from_text(text))
    return html, list(dict.fromkeys(emails))


def harvest_scrapy(start_url: str, max_depth: int = 1, collected: list[str] | None = None) -> list[str]:
    """Same-domain spider: extracts emails from HTML + trafilatura text; follows internal links up to max_depth."""
    if collected is None:
        collected = []

    url = _normalize_start_url(start_url)
    parsed = urlparse(url)
    host = parsed.netloc.split("@")[-1]
    if ":" in host:
        host = host.split(":")[0]

    class EmailSpider(scrapy.Spider):
        name = "rf_email"
        custom_settings = {
            "USER_AGENT": config.user_agent(),
            "ROBOTSTXT_OBEY": True,
            "LOG_LEVEL": "ERROR",
        }

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.start_urls = [url]
            self._max_depth = max_depth
            self._host = host
            self._seen: set[str] = set()

        def parse(self, response: scrapy.http.Response, depth: int = 0):
            self._drain_response(response)
            if depth >= self._max_depth:
                return
            for href in response.css("a::attr(href)").getall():
                next_url = response.urljoin(href)
                p = urlparse(next_url)
                nh = p.netloc.split(":")[0]
                if nh != self._host:
                    continue
                if next_url in self._seen:
                    continue
                self._seen.add(next_url)
                yield response.follow(
                    next_url,
                    callback=self.parse_depth,
                    cb_kwargs={"depth": depth + 1},
                )

        def parse_depth(self, response: scrapy.http.Response, depth: int):
            yield from self.parse(response, depth)

        def _drain_response(self, response: scrapy.http.Response):
            raw = response.text
            for e in extract_emails_from_text(raw):
                collected.append(e)
            try:
                text = trafilatura.extract(raw, url=response.url) or ""
                for e in extract_emails_from_text(text):
                    collected.append(e)
            except Exception:
                pass

    process = CrawlerProcess()
    process.crawl(EmailSpider)
    process.start()
    return list(dict.fromkeys(collected))


def harvest_url(
    start_url: str,
    *,
    use_crawl4ai: bool | None = None,
    use_scrapy: bool | None = None,
) -> HarvestResult:
    """
    Layered harvest: httpx+trafilatura, then optional Crawl4AI, then optional Scrapy same-domain crawl.
    """
    config.load_env()
    if use_crawl4ai is None:
        use_crawl4ai = config.get_bool("USE_CRAWL4AI", True)
    if use_scrapy is None:
        use_scrapy = config.get_bool("USE_SCRAPY", True)
    url = _normalize_start_url(start_url)
    result = HarvestResult(url=url)

    try:
        _, emails = harvest_httpx(url)
        if emails:
            result.emails.extend(emails)
            result.sources.append("httpx+trafilatura")
    except Exception as e:
        result.sources.append(f"httpx_error:{e!s}")

    if use_crawl4ai:
        try:
            _, c4 = harvest_crawl4ai(url)
            if c4:
                for e in c4:
                    if e not in result.emails:
                        result.emails.append(e)
                result.sources.append("crawl4ai+trafilatura")
        except Exception as e:
            result.sources.append(f"crawl4ai_error:{e!s}")

    if config.use_conduit_browser():
        try:
            from reverse_funnel_outreach.harvest_conduit import harvest_conduit_crawl

            _, cond = harvest_conduit_crawl(
                url,
                max_depth=config.conduit_harvest_max_depth(),
                page_limit=config.conduit_harvest_page_limit(),
            )
            if cond:
                for e in cond:
                    if e not in result.emails:
                        result.emails.append(e)
                result.sources.append("conduit+crawl")
        except Exception as e:
            result.sources.append(f"conduit_error:{e!s}")

    if use_scrapy:
        try:
            depth = config.get_int("HARVEST_MAX_DEPTH", 1)
            merged: list[str] = list(result.emails)
            sy = harvest_scrapy(url, max_depth=depth, collected=merged)
            result.emails = list(dict.fromkeys(sy))
            if any(s == "scrapy" for s in result.sources):
                pass
            elif result.emails:
                result.sources.append("scrapy")
        except Exception as e:
            result.sources.append(f"scrapy_error:{e!s}")

    result.emails = prefer_contact_emails(result.emails, url)
    return result
