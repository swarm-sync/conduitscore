from __future__ import annotations

import re

import httpx
import trafilatura

from conduit_outreach_pipeline import config


_EMAIL = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")


def harvest_email_from_domain(domain: str) -> str | None:
    """Best-effort single contact email from homepage (published only)."""
    config.load_env()
    url = domain if "://" in domain else f"https://{domain}"
    try:
        with httpx.Client(
            timeout=20.0,
            follow_redirects=True,
            headers={"User-Agent": config.http_user_agent()},
        ) as client:
            r = client.get(url)
            r.raise_for_status()
            html = r.text
    except Exception:
        return None
    found: set[str] = set()
    for m in _EMAIL.finditer(html):
        e = m.group(0).lower()
        if "example.com" in e or "w3.org" in e or "schema.org" in e:
            continue
        found.add(e)
    text = trafilatura.extract(html, url=url) or ""
    for m in _EMAIL.finditer(text):
        found.add(m.group(0).lower())
    if not found:
        return None
    # prefer hello@ contact@ on same domain
    host = domain.lower().split("//")[-1].split("/")[0].split(":")[0]
    def score(em: str) -> int:
        local, _, d = em.partition("@")
        s = 0
        if d == host or host.endswith("." + d):
            s += 10
        for p in ("hello", "hi", "contact", "founder"):
            if local.startswith(p):
                s += 5
        return s
    return max(found, key=score)
