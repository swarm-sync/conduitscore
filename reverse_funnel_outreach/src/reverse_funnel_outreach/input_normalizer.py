"""Normalize raw domain/URL inputs into a canonical start URL + root domain."""
from __future__ import annotations

import re
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

# Query parameters that carry no structural meaning and should be stripped.
_TRACKING_PARAMS = frozenset(
    {
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "fbclid", "gclid", "msclkid", "_ga", "ref", "referrer", "source",
    }
)

# Simple check: looks like a bare domain (no slashes, has a dot)
_BARE_DOMAIN_RE = re.compile(r"^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


def normalize_url(raw: str) -> str:
    """Prepend https://, strip tracking params, return canonical URL string."""
    raw = raw.strip()
    if not raw:
        raise ValueError("Empty URL input")
    # Scheme check must be case-insensitive (e.g. HTTPS://example.com).
    if not raw.lower().startswith(("http://", "https://")):
        raw = "https://" + raw
    parsed = urlparse(raw)
    # Remove tracking params but keep any real query params
    qs_clean = {
        k: v[0]
        for k, v in parse_qs(parsed.query, keep_blank_values=False).items()
        if k.lower() not in _TRACKING_PARAMS
    }
    clean_query = urlencode(qs_clean) if qs_clean else ""
    # Normalize path: keep trailing slash only on root
    path = parsed.path or "/"
    return urlunparse(
        (parsed.scheme, parsed.netloc.lower(), path, parsed.params, clean_query, "")
    )


def root_domain(url: str) -> str:
    """Extract the hostname without port. Does not strip www."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    host = urlparse(url).netloc or url
    host = host.split(":")[0].lower()
    return host


def strip_www(domain: str) -> str:
    """Remove leading www. prefix for canonical comparison."""
    return domain[4:] if domain.startswith("www.") else domain


def canonical_root(raw: str) -> tuple[str, str]:
    """
    Returns (normalized_start_url, root_domain_no_www).
    Convenience wrapper combining normalize_url + root_domain + strip_www.
    """
    start = normalize_url(raw)
    rd = strip_www(root_domain(start))
    return start, rd
