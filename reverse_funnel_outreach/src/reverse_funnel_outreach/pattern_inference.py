"""
Generate inferred email candidates from observed site-backed addresses + JSON-LD names.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass

from reverse_funnel_outreach.email_extract import normalize_email
from reverse_funnel_outreach.input_normalizer import strip_www

# Same as content_extract JSON-LD block pattern
_JSONLD_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.IGNORECASE | re.DOTALL,
)

_ROLE_PREFIXES = ("hello", "contact", "sales", "support", "info", "team", "hi", "media", "press")


@dataclass
class InferredCandidate:
    email: str
    reason: str  # e.g. "role_probe", "pattern_first_last"


def _walk_jsonld_names(obj: object, out: list[str]) -> None:
    if isinstance(obj, dict):
        t = str(obj.get("@type", "")).lower()
        if "person" in t or obj.get("name") and "email" not in str(obj.keys()).lower():
            name = obj.get("name")
            if isinstance(name, str) and len(name.split()) >= 2:
                out.append(name.strip())
        for v in obj.values():
            _walk_jsonld_names(v, out)
    elif isinstance(obj, list):
        for item in obj:
            _walk_jsonld_names(item, out)


def extract_person_names_from_html(html: str) -> list[str]:
    names: list[str] = []
    for m in _JSONLD_RE.finditer(html):
        try:
            data = json.loads(m.group(1))
            _walk_jsonld_names(data, names)
        except Exception:
            continue
    # Dedupe preserve order
    seen: set[str] = set()
    uniq: list[str] = []
    for n in names:
        k = n.lower()
        if k not in seen:
            seen.add(k)
            uniq.append(n)
    return uniq[:30]


def role_email_candidates(domain: str, existing_lower: set[str]) -> list[InferredCandidate]:
    """Standard role inboxes not already observed."""
    dom = domain.lower().strip().lstrip("www.")
    out: list[InferredCandidate] = []
    for prefix in _ROLE_PREFIXES:
        em = f"{prefix}@{dom}"
        if em not in existing_lower:
            out.append(InferredCandidate(email=em, reason="role_probe"))
    return out


def pattern_from_observed_email(email: str) -> str | None:
    """
    If email looks like first.last@domain, return 'first_dot_last'.
    """
    if "@" not in email:
        return None
    local = email.split("@", 1)[0].lower()
    if "." in local and local.replace(".", "").isalnum():
        parts = local.split(".")
        if len(parts) == 2 and all(p.isalpha() for p in parts):
            return "first_dot_last"
    return None


def name_to_email_candidates(name: str, domain: str, existing_lower: set[str]) -> list[InferredCandidate]:
    parts = name.strip().split()
    if len(parts) < 2:
        return []
    first = re.sub(r"[^a-zA-Z]", "", parts[0]).lower()
    last = re.sub(r"[^a-zA-Z]", "", parts[-1]).lower()
    if not first or not last:
        return []
    out: list[InferredCandidate] = []
    for local, reason in (
        (f"{first}.{last}", "pattern_first_dot_last"),
        (f"{first}{last}", "pattern_concat"),
        (f"{first[0]}{last}", "pattern_f_initial"),
    ):
        em = f"{local}@{domain.lower().lstrip('www.')}"
        if normalize_email(em) and em.lower() not in existing_lower:
            out.append(InferredCandidate(email=em.lower(), reason=reason))
    return out


def generate_inferred_candidates(
    canonical_domain: str,
    observed_emails: list[str],
    html_samples: list[str],
) -> list[InferredCandidate]:
    """
    Combine role probes + name-pattern guesses from JSON-LD Person names.
    Role probes run only when we already have at least one observed address (avoids
    guessing blindly on dead domains).
    """
    existing = {e.lower().strip() for e in observed_emails}
    dom = strip_www(canonical_domain)
    candidates: list[InferredCandidate] = []

    if observed_emails:
        for c in role_email_candidates(dom, existing):
            candidates.append(c)
            existing.add(c.email.lower())

    names: list[str] = []
    for html in html_samples:
        names.extend(extract_person_names_from_html(html))
    for name in names:
        for c in name_to_email_candidates(name, dom, existing):
            candidates.append(c)
            existing.add(c.email.lower())

    return candidates[:40]
