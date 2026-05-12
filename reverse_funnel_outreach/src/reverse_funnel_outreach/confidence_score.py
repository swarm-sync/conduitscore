"""
Confidence scorer for harvested email candidates.

Scoring is additive/subtractive starting at 50.
Every adjustment appends a reason flag so the output is self-explaining.
"""
from __future__ import annotations

from urllib.parse import urlparse

# ---- Constants ---------------------------------------------------------------

_PLACEHOLDER_SUBSTRINGS = (
    "your@email",
    "name@example",
    "your@domain",
    "test@test",
    "user@user",
    "email@email",
    "someone@",
    "@example.",
    "@domain.",
    "alice@",
    "bob@smith",
    "john@doe",
    "jane@doe",
    "info@example",
    "demo@",
    "sample@",
)

_TEMPLATE_VENDOR_DOMAINS = frozenset(
    {
        "themeforest.net",
        "envato.com",
        "wordpress.com",
        "wix.com",
        "squarespace.com",
        "weebly.com",
        "shopify.com",
        "webflow.io",
        "bootstrap.com",
        "templatemonster.com",
        "gravatar.com",
        "placeholder.com",
    }
)

# Prefixes that suggest a real outreach contact
_HIGH_VALUE_PREFIXES = frozenset(
    {"hello", "hi", "contact", "sales", "founder", "ceo", "cto", "team", "support", "partnerships", "partner"}
)

# Prefixes that are real but lower value for cold outreach
_LEGAL_PREFIXES = frozenset({"legal", "privacy", "abuse", "security", "dmca", "compliance", "copyright"})

# Prefixes that indicate automated/bounce mailboxes
_JUNK_PREFIXES = frozenset({"noreply", "no-reply", "donotreply", "do-not-reply", "bounce", "mailer-daemon", "postmaster"})

# Contact-ish page path fragments
_CONTACT_PATHS = ("/contact",)
_ABOUT_PATHS = ("/about", "/team", "/company", "/people", "/founders", "/leadership", "/staff", "/crew")


# ---- Helpers ----------------------------------------------------------------

def _path_of(url: str) -> str:
    return urlparse(url).path.lower()


# ---- Main scorer ------------------------------------------------------------

def score_email(
    email: str,
    source_url: str,
    root_domain: str,
    found_in: str,
    sighting_count: int = 1,
) -> tuple[int, str, list[str]]:
    """
    Returns (score 0-100, confidence_label, reason_flags).

    score:  numeric 0-100
    label:  "high" | "medium" | "low" | "reject"
    flags:  list of short strings explaining each adjustment
    """
    score = 50
    flags: list[str] = []

    el = email.lower()
    parts = el.split("@", 1)
    local = parts[0]
    em_domain = parts[1] if len(parts) == 2 else ""

    # Normalise root_domain for comparison (strip www)
    rd = root_domain.lower()
    if rd.startswith("www."):
        rd = rd[4:]
    em_rd = em_domain
    if em_rd.startswith("www."):
        em_rd = em_rd[4:]

    # ------------------------------------------------------------------
    # Hard-reject: placeholder patterns
    # ------------------------------------------------------------------
    for p in _PLACEHOLDER_SUBSTRINGS:
        if p in el:
            score -= 40
            flags.append("placeholder_pattern")
            break

    # ------------------------------------------------------------------
    # Domain match signals (most impactful)
    # ------------------------------------------------------------------
    if em_rd and rd:
        if em_rd == rd:
            score += 30
            flags.append("domain_exact_match")
        elif em_domain.endswith("." + rd) or rd.endswith("." + em_domain):
            score += 20
            flags.append("subdomain_match")
        else:
            score -= 35
            flags.append("domain_mismatch")
            # Extra penalty for known template/vendor domains
            if em_domain in _TEMPLATE_VENDOR_DOMAINS:
                score -= 20
                flags.append("template_vendor_domain")

    # ------------------------------------------------------------------
    # Source page path
    # ------------------------------------------------------------------
    path = _path_of(source_url)
    if any(path == p or path.startswith(p + "/") for p in _CONTACT_PATHS):
        score += 15
        flags.append("contact_page")
    elif any(path == p or path.startswith(p + "/") for p in _ABOUT_PATHS):
        score += 12
        flags.append("about_or_team_page")

    # ------------------------------------------------------------------
    # Extraction method signals
    # ------------------------------------------------------------------
    if found_in == "mailto":
        score += 10
        flags.append("mailto_link")
    elif found_in == "jsonld":
        score += 8
        flags.append("jsonld_structured_data")
    elif found_in == "data_attr":
        score += 6
        flags.append("data_attribute")
    elif found_in == "cf_obfuscated":
        score += 5
        flags.append("cf_obfuscated_decoded")

    # ------------------------------------------------------------------
    # Repeat sightings
    # ------------------------------------------------------------------
    if sighting_count > 2:
        score += 10
        flags.append(f"seen_{sighting_count}_pages")
    elif sighting_count == 2:
        score += 5
        flags.append("seen_2_pages")

    # ------------------------------------------------------------------
    # Local-part signals
    # ------------------------------------------------------------------
    if any(local == p or local.startswith(p) for p in _HIGH_VALUE_PREFIXES):
        score += 8
        flags.append("high_value_prefix")

    if any(local == p or local.startswith(p) for p in _JUNK_PREFIXES):
        score -= 15
        flags.append("junk_mailbox_prefix")

    if any(local == p or local.startswith(p) for p in _LEGAL_PREFIXES):
        # Real but bad outreach targets — tag, don't penalise score
        flags.append("legal_or_compliance_mailbox")

    # ------------------------------------------------------------------
    # Clamp and label
    # ------------------------------------------------------------------
    score = max(0, min(100, score))
    label = _label(score)
    return score, label, flags


def _label(score: int) -> str:
    if score >= 80:
        return "high"
    if score >= 60:
        return "medium"
    if score >= 40:
        return "low"
    return "reject"
