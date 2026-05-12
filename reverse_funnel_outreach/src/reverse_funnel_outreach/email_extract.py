from __future__ import annotations

import re
from urllib.parse import urlparse

# Practical RFC 5322–ish pattern (not full RFC); good for harvesting from HTML.
# TLD capped at 10 chars: catches HTML-concatenation artifacts like ".comtechnical" (12 chars)
# while keeping the longest commonly-used new gTLDs like .technology (10 chars).
# Very rare TLDs > 10 chars (.photography=11, .cancerresearch=14) are an acceptable loss
# for a business-email harvester where noise-reduction matters more than total recall.
_EMAIL_RE = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}\b",
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


# TLD prefixes used to detect HTML-concatenation artifacts like "hello@x.comfollow".
# Only include prefixes ≥4 chars to avoid false-positives (e.g. "co" would match "com").
# Pattern: if extracted TLD starts with one of these AND has extra letters → reject.
_TLD_CONCAT_PREFIXES = ("com",)  # "net" would reject real .network TLD; expand carefully


def _tld_looks_like_concat(domain_part: str) -> bool:
    """Return True if the TLD portion appears to be a word concatenated with a real TLD."""
    # Split on last dot to get the TLD
    if "." not in domain_part:
        return False
    tld = domain_part.rsplit(".", 1)[-1].lower()
    for prefix in _TLD_CONCAT_PREFIXES:
        if tld.startswith(prefix) and len(tld) > len(prefix):
            return True
    return False


def normalize_email(raw: str) -> str | None:
    e = raw.strip().strip("<>\"'")
    if not e or "@" not in e:
        return None
    el = e.lower()
    if any(s in el for s in _SKIP_SUBSTR):
        return None
    if not _EMAIL_RE.fullmatch(e):
        return None
    # Reject TLD concatenation artifacts like "hello@x.comfollow"
    _, domain_part = el.split("@", 1)
    if _tld_looks_like_concat(domain_part):
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
    """Return True if email domain is equal/subdomain/sibling under same registrable root."""
    try:
        _, dom = email.split("@", 1)
    except ValueError:
        return False
    dom = dom.lower().strip()
    host = urlparse(site_host if "://" in site_host else f"https://{site_host}").netloc or site_host
    host = host.lower().split(":")[0]
    dom_nw = dom[4:] if dom.startswith("www.") else dom
    host_nw = host[4:] if host.startswith("www.") else host
    if dom_nw == host_nw:
        return True
    if dom == host:
        return True
    if host.endswith("." + dom) or dom.endswith("." + host):
        return True
    # Handle sibling subdomains: mail.example.com vs www.example.com.
    dom_parts = dom_nw.split(".")
    host_parts = host_nw.split(".")
    if len(dom_parts) >= 2 and len(host_parts) >= 2:
        return ".".join(dom_parts[-2:]) == ".".join(host_parts[-2:])
    return False


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
