from __future__ import annotations

import csv
from pathlib import Path

from reverse_funnel_outreach.engine import EmailFinding

_PREFERRED_LOCALPARTS = {
    "hello",
    "contact",
    "hi",
    "founder",
    "ceo",
    "team",
    "sales",
    "partnerships",
    "business",
}

_DEPRIORITIZED_LOCALPARTS = {
    "support",
    "help",
    "info",
    "admin",
    "office",
    "privacy",
    "legal",
    "compliance",
    "billing",
    "security",
    "noreply",
    "no-reply",
    "donotreply",
    "do-not-reply",
}


def _localpart(email: str) -> str:
    return (email.split("@", 1)[0] if "@" in email else email).strip().lower()


def _is_never_allow_email(email: str) -> bool:
    lp = _localpart(email)
    if lp in _DEPRIORITIZED_LOCALPARTS:
        return True
    return any(token in lp for token in ("noreply", "no-reply", "do-not-reply"))


def _contact_fit_score(email: str) -> int:
    """
    Rank how suitable an address is for person-to-person outreach.
    Higher is better.
    """
    lp = _localpart(email)
    if lp in _PREFERRED_LOCALPARTS:
        return 3
    if lp in _DEPRIORITIZED_LOCALPARTS:
        return -3
    if any(token in lp for token in ("noreply", "no-reply", "do-not-reply")):
        return -4
    # Name-like aliases (first.last / firstname) are often best for personal contact.
    if "." in lp or "_" in lp:
        return 2
    if lp.isalpha() and len(lp) >= 4:
        return 1
    return 0


def _rank_key(f: EmailFinding) -> tuple[int, int, int]:
    # Weighted rank: person-contact fit, then confidence score, then deliverability.
    return (
        _contact_fit_score(f.email),
        int(getattr(f, "confidence_score", 0)),
        int(getattr(f, "deliverability_confidence", 0)),
    )


def finding_to_prospect_row(finding: EmailFinding) -> dict[str, str]:
    return {
        "domain": finding.resolved_company_domain or finding.domain,
        "receiver_email": finding.email,
        "email": finding.email,
        "notes": (
            f"score={finding.confidence_score}; band={getattr(finding, 'confidence_band', '')}; "
            f"delivery={getattr(finding, 'delivery_state', '')}; source={finding.source_url}"
        ),
        "scrape_source": finding.source_kind or finding.source_type,
    }


def findings_to_prospect_csv_rows(findings: list[EmailFinding]) -> list[dict[str, str]]:
    return [finding_to_prospect_row(f) for f in findings]


def best_prospect_per_domain(findings: list[EmailFinding]) -> list[EmailFinding]:
    best: dict[str, EmailFinding] = {}
    for f in findings:
        if _is_never_allow_email(f.email):
            # Absolute blocklist for outreach export.
            continue
        key = f.resolved_company_domain or f.domain
        if key not in best or _rank_key(f) > _rank_key(best[key]):
            best[key] = f
    return list(best.values())


def write_prospect_csv(rows: list[dict[str, str]], out_path: Path) -> None:
    fieldnames = ["domain", "receiver_email", "email", "notes", "scrape_source"]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
