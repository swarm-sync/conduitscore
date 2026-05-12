"""
Extract email candidates from raw HTML with full provenance tracking.

Each hit records *where* the email was found (mailto, jsonld, text, etc.)
so the confidence scorer and CSV export can explain every result.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Literal
from urllib.parse import unquote

from reverse_funnel_outreach.email_extract import _EMAIL_RE, normalize_email

FoundIn = Literal[
    "mailto",
    "jsonld",
    "data_attr",
    "cf_obfuscated",
    "html",
    "text",
    "microdata",
]

# Ordered extraction priority: higher index = prefer over lower when same email seen twice.
_FOUND_IN_PRIORITY: dict[str, int] = {
    "text": 0,
    "html": 1,
    "cf_obfuscated": 2,
    "data_attr": 3,
    "microdata": 4,
    "mailto": 5,
    "jsonld": 6,
}

# Cloudflare email protection pattern
_CF_EMAIL_RE = re.compile(r"/cdn-cgi/l/email-protection#([a-fA-F0-9]+)")

# mailto: href (with possible query string after ?)
_MAILTO_RE = re.compile(r'mailto:([^"\'?\s<>&]+)', re.IGNORECASE)

# data-email / data-mailto attribute
_DATA_ATTR_RE = re.compile(r'data-(?:email|mailto)=["\']([^"\']+)["\']', re.IGNORECASE)

# JSON-LD script block
_JSONLD_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.IGNORECASE | re.DOTALL,
)


@dataclass
class RawEmailHit:
    email: str
    found_in: FoundIn
    context: str = ""  # Short surrounding snippet for audit trail


# ---------------------------------------------------------------------------
# Individual extractors
# ---------------------------------------------------------------------------

def _extract_mailto(html: str) -> list[RawEmailHit]:
    hits: list[RawEmailHit] = []
    for m in _MAILTO_RE.finditer(html):
        raw = unquote(m.group(1)).split("?")[0]
        em = normalize_email(raw)
        if em:
            hits.append(RawEmailHit(email=em, found_in="mailto", context=m.group(0)[:120]))
    return hits


def _decode_cf_email(encoded: str) -> str | None:
    """Decode Cloudflare's XOR-key email obfuscation."""
    try:
        data = bytes.fromhex(encoded)
        key = data[0]
        decoded = "".join(chr(b ^ key) for b in data[1:])
        return decoded if "@" in decoded else None
    except Exception:
        return None


def _extract_cf_obfuscated(html: str) -> list[RawEmailHit]:
    hits: list[RawEmailHit] = []
    for m in _CF_EMAIL_RE.finditer(html):
        decoded = _decode_cf_email(m.group(1))
        if decoded:
            em = normalize_email(decoded)
            if em:
                hits.append(RawEmailHit(email=em, found_in="cf_obfuscated", context="[cloudflare-protected]"))
    return hits


def _extract_data_attrs(html: str) -> list[RawEmailHit]:
    hits: list[RawEmailHit] = []
    for m in _DATA_ATTR_RE.finditer(html):
        em = normalize_email(m.group(1))
        if em:
            hits.append(RawEmailHit(email=em, found_in="data_attr", context=m.group(0)[:120]))
    return hits


def _walk_jsonld(obj: object, results: list[RawEmailHit]) -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k.lower() in ("email", "contactemail", "contactpoint"):
                if isinstance(v, str):
                    em = normalize_email(v)
                    if em:
                        results.append(
                            RawEmailHit(email=em, found_in="jsonld", context=f'{k}="{v}"')
                        )
                elif isinstance(v, dict):
                    _walk_jsonld(v, results)
            else:
                _walk_jsonld(v, results)
    elif isinstance(obj, list):
        for item in obj:
            _walk_jsonld(item, results)


def _extract_jsonld(html: str) -> list[RawEmailHit]:
    hits: list[RawEmailHit] = []
    for m in _JSONLD_RE.finditer(html):
        try:
            data = json.loads(m.group(1))
            _walk_jsonld(data, hits)
        except Exception:
            pass
    return hits


def _deobfuscate_common_text(text: str) -> str:
    """Decode common 'name [at] domain [dot] com' obfuscations."""
    out = text
    for a, b in (
        (" [at] ", "@"),
        (" (at) ", "@"),
        (" [dot] ", "."),
        (" (dot) ", "."),
        ("[at]", "@"),
        ("[dot]", "."),
        (" (at)", "@"),
        (" (dot)", "."),
    ):
        out = out.replace(a, b)
    return out


def _extract_extruct(html: str, page_url: str) -> list[RawEmailHit]:
    hits: list[RawEmailHit] = []
    try:
        import extruct  # type: ignore[import-untyped]

        blob = extruct.extract(html, base_url=page_url, uniform=True)
        text_blob = json.dumps(blob)

        for m in _EMAIL_RE.finditer(text_blob):
            em = normalize_email(m.group(0))
            if em:
                hits.append(
                    RawEmailHit(email=em, found_in="microdata", context="[extruct]")
                )
    except Exception:
        pass
    return hits


def _strip_tags(html: str) -> str:
    """
    Replace HTML tags with a single space.
    This prevents tag boundaries from concatenating adjacent text tokens
    (e.g. <a href="...">email@x.com</a>Follow → 'email@x.com Follow').
    """
    return re.sub(r"<[^>]+>", " ", html)


def _extract_text(text: str, found_in: FoundIn = "text") -> list[RawEmailHit]:
    hits: list[RawEmailHit] = []
    for m in _EMAIL_RE.finditer(text or ""):
        em = normalize_email(m.group(0))
        if em:
            start = max(0, m.start() - 40)
            end = min(len(text), m.end() + 40)
            ctx = text[start:end].replace("\n", " ").replace("\r", "").strip()
            hits.append(RawEmailHit(email=em, found_in=found_in, context=ctx[:120]))
    return hits


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def extract_all_from_html(html: str, page_url: str) -> list[RawEmailHit]:
    """
    Run all extractors against raw HTML for one page.

    Returns one RawEmailHit per unique email, retaining the highest-evidence
    found_in type when the same email is found by multiple methods.
    """
    html = _deobfuscate_common_text(html)
    all_hits: list[RawEmailHit] = []

    all_hits.extend(_extract_mailto(html))
    all_hits.extend(_extract_cf_obfuscated(html))
    all_hits.extend(_extract_data_attrs(html))
    all_hits.extend(_extract_jsonld(html))
    all_hits.extend(_extract_extruct(html, page_url))

    # Visible/clean text via trafilatura (best for prose content)
    try:
        import trafilatura
        text = trafilatura.extract(html, url=page_url, include_comments=False) or ""
        all_hits.extend(_extract_text(text, "text"))
    except Exception:
        pass

    # Scan tag-stripped HTML to catch anything trafilatura strips out.
    # We replace tags with spaces first to prevent adjacent-element concatenation
    # (e.g. <a>email@x.com</a>Follow → 'email@x.com Follow', not 'email@x.comFollow').
    all_hits.extend(_extract_text(_strip_tags(html), "html"))

    # Deduplicate: per email, keep the highest-priority found_in
    best: dict[str, RawEmailHit] = {}
    for hit in all_hits:
        existing = best.get(hit.email)
        if not existing:
            best[hit.email] = hit
        elif _FOUND_IN_PRIORITY.get(hit.found_in, 0) > _FOUND_IN_PRIORITY.get(existing.found_in, 0):
            best[hit.email] = hit

    return list(best.values())
