"""Discover same-domain links from raw HTML, prioritizing contact-ish pages."""
from __future__ import annotations

import re
from urllib.parse import urlparse, urljoin

# Pages most likely to contain contact emails — ordered by priority (index 0 = best).
_CONTACT_PRIORITY_PATHS = (
    "/contact",
    "/about",
    "/team",
    "/company",
    "/support",
    "/people",
    "/founders",
    "/leadership",
    "/staff",
    "/crew",
    "/us",
    "/legal",
    "/privacy",
    "/terms",
)

# URL patterns to skip — they're unlikely to contain useful emails and waste crawl budget.
_SKIP_PATH_RE = re.compile(
    r"/(logout|login|signin|sign-in|cart|checkout|search|tags?|category|categories"
    r"|calendar|archive|archives|download|wp-login|wp-admin|admin|feed|rss|sitemap)",
    re.IGNORECASE,
)

# Skip URLs ending in binary/media/asset extensions.
_SKIP_EXT_RE = re.compile(
    r"\.(pdf|zip|tar|gz|png|jpe?g|gif|svg|ico|css|js|woff2?|ttf|eot|mp4|mp3|webm|avi|mov)(\?.*)?$",
    re.IGNORECASE,
)

# Extract href values from anchor tags (covers both single and double quotes, unquoted).
_HREF_RE = re.compile(r'<a\b[^>]+\bhref=(["\'])([^"\']+)\1', re.IGNORECASE)
_HREF_NOQUOTE_RE = re.compile(r"<a\b[^>]+\bhref=([^\s>'\"]+)", re.IGNORECASE)


def should_skip_url(url: str) -> bool:
    """Return True if this URL should be excluded from the crawl queue."""
    parsed = urlparse(url)
    path = parsed.path or "/"
    if _SKIP_EXT_RE.search(path):
        return True
    if _SKIP_PATH_RE.search(url):
        return True
    # Skip fragment-only or empty paths that would double-crawl the same page.
    if parsed.fragment and not parsed.path:
        return True
    return False


def url_contact_priority(url: str) -> int:
    """
    Higher number = crawl sooner.
    Contact/about/team pages score highest.
    """
    path = urlparse(url).path.lower().rstrip("/")
    for i, p in enumerate(_CONTACT_PRIORITY_PATHS):
        if path == p or path.startswith(p + "/") or path.startswith(p + "-") or path.startswith(p + "_"):
            return len(_CONTACT_PRIORITY_PATHS) - i
    return 0


def extract_internal_links(html: str, base_url: str, root_host: str) -> list[str]:
    """
    Extract all same-domain internal links from raw HTML.
    Returns deduplicated absolute URLs; fragment and skip-pattern URLs are excluded.
    root_host should be bare hostname (no scheme, no port), e.g. 'example.com'.
    """
    raw_hrefs: list[str] = []
    for m in _HREF_RE.finditer(html):
        raw_hrefs.append(m.group(2))
    for m in _HREF_NOQUOTE_RE.finditer(html):
        candidate = m.group(1)
        if not any(candidate == h for h in raw_hrefs):
            raw_hrefs.append(candidate)

    seen: set[str] = set()
    links: list[str] = []

    for href in raw_hrefs:
        href = href.strip()
        if not href:
            continue
        # Skip known non-crawlable schemes
        if href.startswith(("javascript:", "mailto:", "tel:", "data:", "#")):
            continue

        full = urljoin(base_url, href)
        # Strip fragment for deduplication
        parsed = urlparse(full)
        full_no_frag = parsed._replace(fragment="").geturl()

        host = parsed.netloc.split(":")[0].lower()
        # Allow same domain or subdomains
        if host != root_host and not host.endswith("." + root_host):
            continue
        if full_no_frag in seen:
            continue
        if should_skip_url(full_no_frag):
            continue

        seen.add(full_no_frag)
        links.append(full_no_frag)

    return links
