from __future__ import annotations

import re
from urllib.parse import urlparse

# Practical RFC 5322–ish pattern (not full RFC); good for harvesting from HTML.
_EMAIL_RE = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
    re.IGNORECASE,
)

# Common garbage / image CDN false positives (substring match, lowercase)
_SKIP_SUBSTR = (
    "example.com",
    "domain.com",
    "yoursite.com",
    "sentry.io",
    "w3.org",
    "schema.org",
    "@2x.",
    "noreply@",
    "donotreply@",
)


def normalize_email(raw: str) -> str | None:
    e = raw.strip().strip("<>\"'")
    if not e or "@" not in e:
        return None
    el = e.lower()
    if any(s in el for s in _SKIP_SUBSTR):
        return None
    if not _EMAIL_RE.fullmatch(e):
        return None
    return el


def extract_emails_from_text(text: str) -> list[str]:
    found: set[str] = set()
    for m in _EMAIL_RE.finditer(text or ""):
        n = normalize_email(m.group(0))
        if n:
            found.add(n)
    return sorted(found)


def same_domain_or_subdomain(email: str, site_host: str) -> bool:
    """Return True if email domain matches site host (e.g. mail@acme.com vs www.acme.com)."""
    try:
        _, dom = email.split("@", 1)
    except ValueError:
        return False
    dom = dom.lower().strip()
    host = urlparse(site_host if "://" in site_host else f"https://{site_host}").netloc or site_host
    host = host.lower().split(":")[0]
    if dom == host:
        return True
    return host.endswith("." + dom) or dom.endswith("." + host)


def prefer_contact_emails(emails: list[str], site_url: str) -> list[str]:
    """Prioritize same-domain and names like hello@, contact@, founders."""
    if not emails:
        return []
    host = urlparse(site_url if "://" in site_url else f"https://{site_url}").netloc
    same = [e for e in emails if same_domain_or_subdomain(e, host)]
    pool = same if same else emails
    priority_prefixes = ("founder", "hello", "hi", "contact", "team", "support", "sales")
    scored: list[tuple[int, str]] = []
    for e in pool:
        local = e.split("@", 1)[0].lower()
        score = 0
        if any(local.startswith(p) for p in priority_prefixes):
            score += 5
        if e in same:
            score += 3
        if local in ("info", "admin"):
            score += 1
        scored.append((score, e))
    scored.sort(key=lambda x: (-x[0], x[1]))
    return [e for _, e in scored]
