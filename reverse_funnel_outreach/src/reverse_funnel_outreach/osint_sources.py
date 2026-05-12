from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import quote_plus

import httpx

from reverse_funnel_outreach.email_extract import extract_emails_from_text


@dataclass
class OsintEmailHit:
    email: str
    source_kind: str
    source_url: str
    observed_domain: str
    discovery_method: str
    context: str = ""


def search_query_variants(domain: str) -> list[str]:
    return [
        f'site:{domain} "@{domain}"',
        f'"@{domain}" "contact"',
        f'"{domain}" "email"',
    ]


def extract_emails_from_search_snippets(text: str, source_url: str, domain: str) -> list[OsintEmailHit]:
    out: list[OsintEmailHit] = []
    for em in extract_emails_from_text(text):
        out.append(
            OsintEmailHit(
                email=em,
                source_kind="search_snippet",
                source_url=source_url,
                observed_domain=domain,
                discovery_method="snippet_regex",
                context=text[:200],
            )
        )
    return out


def extract_emails_from_archive_pages(text: str, source_url: str, domain: str) -> list[OsintEmailHit]:
    out: list[OsintEmailHit] = []
    for em in extract_emails_from_text(text):
        out.append(
            OsintEmailHit(
                email=em,
                source_kind="archive",
                source_url=source_url,
                observed_domain=domain,
                discovery_method="archive_regex",
                context=text[:200],
            )
        )
    return out


def run_passive_osint(domain: str, canonical_domain: str, limit: int = 20) -> list[OsintEmailHit]:
    hits: list[OsintEmailHit] = []
    queries = search_query_variants(canonical_domain or domain)[: max(1, min(limit, 5))]
    with httpx.Client(timeout=12.0, follow_redirects=True) as client:
        for q in queries:
            url = f"https://duckduckgo.com/html/?q={quote_plus(q)}"
            try:
                resp = client.get(url)
            except Exception:
                continue
            text = resp.text or ""
            hits.extend(extract_emails_from_search_snippets(text, url, canonical_domain or domain))
    deduped: dict[tuple[str, str], OsintEmailHit] = {}
    for h in hits:
        deduped[(h.email.lower(), h.source_url)] = h
    return list(deduped.values())
