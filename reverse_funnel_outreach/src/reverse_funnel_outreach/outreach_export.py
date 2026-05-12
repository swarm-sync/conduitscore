"""Merge evidence CSVs → one best row per domain for conduit_outreach_pipeline."""
from __future__ import annotations

import csv
from pathlib import Path
from urllib.parse import urlparse

from reverse_funnel_outreach.engine import EmailFinding
from reverse_funnel_outreach.prospect_adapter import (
    best_prospect_per_domain,
    findings_to_prospect_csv_rows,
    write_prospect_csv,
)


def _row_to_finding(row: dict[str, str]) -> EmailFinding | None:
    email = (row.get("email") or "").strip()
    if not email:
        return None
    return EmailFinding(
        domain=(row.get("domain") or "").strip(),
        email=email,
        source_url=(row.get("source_url") or "").strip(),
        source_type=(row.get("source_type") or "").strip() or "httpx",
        source_kind=(row.get("source_kind") or "").strip() or "site_page",
        found_in=(row.get("found_in") or "").strip(),
        crawl_depth=int((row.get("crawl_depth") or "0").strip() or 0),
        confidence_score=int((row.get("confidence_score") or "0").strip() or 0),
        confidence_label=(row.get("confidence_label") or "").strip() or "low",
        reason_flags=[x for x in (row.get("reason_flags") or "").split("|") if x],
        sighting_count=int((row.get("sighting_count") or "1").strip() or 1),
        verification_status=(row.get("verification_status") or "unknown").strip(),
        deliverability_confidence=int((row.get("deliverability_confidence") or "0").strip() or 0),
        resolved_company_domain=(row.get("resolved_company_domain") or "").strip(),
        identity_confidence=int((row.get("identity_confidence") or "0").strip() or 0),
        delivery_state=(row.get("delivery_state") or "unknown").strip(),
        confidence_band=(row.get("confidence_band") or "tier_d").strip(),
        finding_type=(row.get("finding_type") or "observed").strip(),
    )


def _norm_domain(v: str) -> str:
    v = (v or "").strip()
    if not v:
        return ""
    if "://" in v:
        v = urlparse(v).netloc or v
    v = v.split("@")[-1].split(":")[0].strip("/").lower()
    if v.startswith("www."):
        v = v[4:]
    return v


def load_allowed_domains_from_sheet_csv(path: Path) -> set[str]:
    """Load unique hosts from ODS-export or similar (Website / domain / url column)."""
    allowed: set[str] = set()
    if not path.is_file():
        return allowed
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            return allowed
        fields = {h.lower(): h for h in reader.fieldnames}
        key = None
        for candidate in ("domain", "url", "website", "site"):
            if candidate in fields:
                key = fields[candidate]
                break
        if not key:
            return allowed
        for row in reader:
            d = _norm_domain(row.get(key) or "")
            if d:
                allowed.add(d)
    return allowed


def load_findings_from_evidence_csv(path: Path) -> list[EmailFinding]:
    out: list[EmailFinding] = []
    with path.open(newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            fnd = _row_to_finding(row)
            if fnd:
                out.append(fnd)
    return out


def merge_evidence_for_outreach(
    paths: list[Path],
    *,
    one_per_domain: bool = True,
    allowed_domains: set[str] | None = None,
) -> list[EmailFinding]:
    """Load multiple harvest CSVs and pick best prospect per domain (never-allow + ranking)."""
    all_f: list[EmailFinding] = []
    for p in paths:
        if p.is_file():
            all_f.extend(load_findings_from_evidence_csv(p))
    if allowed_domains:
        filtered: list[EmailFinding] = []
        for f in all_f:
            d1 = _norm_domain(f.domain)
            d2 = _norm_domain(f.resolved_company_domain)
            if d1 in allowed_domains or d2 in allowed_domains:
                filtered.append(f)
        all_f = filtered
    if one_per_domain:
        return best_prospect_per_domain(all_f)
    return all_f


def export_prospect_csv_for_pipeline(
    paths: list[Path],
    out_path: Path,
    *,
    one_per_domain: bool = True,
    restrict_to_sheet_csv: Path | None = None,
) -> int:
    allowed = (
        load_allowed_domains_from_sheet_csv(restrict_to_sheet_csv)
        if restrict_to_sheet_csv
        else None
    )
    if restrict_to_sheet_csv and restrict_to_sheet_csv.is_file() and not allowed:
        allowed = None
    findings = merge_evidence_for_outreach(
        paths, one_per_domain=one_per_domain, allowed_domains=allowed
    )
    rows = findings_to_prospect_csv_rows(findings)
    write_prospect_csv(rows, out_path)
    return len(rows)
