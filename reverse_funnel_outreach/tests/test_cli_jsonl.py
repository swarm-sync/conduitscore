"""JSONL export for bulk-emails --with-evidence."""
from __future__ import annotations

import json
from pathlib import Path

from reverse_funnel_outreach.cli import _bulk_emails_with_evidence
from reverse_funnel_outreach.engine import DomainResult, EmailFinding


def test_bulk_emails_with_evidence_writes_matching_jsonl(tmp_path: Path, monkeypatch) -> None:
    csv_path = tmp_path / "out.csv"
    jsonl_path = tmp_path / "out.jsonl"

    def fake_run_batch(domains, **kwargs):
        on = kwargs.get("on_domain_done")
        dr = DomainResult(domain="acme.io", pages_crawled=1)
        dr.findings = [
            EmailFinding(
                domain="acme.io",
                email="hello@acme.io",
                source_url="https://acme.io/contact",
                source_type="httpx",
                source_kind="site_page",
                found_in="mailto",
                crawl_depth=0,
                confidence_score=90,
                confidence_label="high",
                reason_flags=["domain_exact_match"],
                sighting_count=1,
                verification_status="verified",
                deliverability_confidence=80,
                resolved_company_domain="acme.io",
                identity_confidence=0,
                delivery_state="valid",
                confidence_band="tier_a",
                finding_type="observed",
            ),
        ]
        if on:
            on(dr)
        return dr.findings

    monkeypatch.setattr("reverse_funnel_outreach.engine.run_batch", fake_run_batch)

    _bulk_emails_with_evidence(
        domains=["acme.io"],
        out=csv_path,
        one_per_domain=True,
        max_emails_per_domain=3,
        max_depth=1,
        page_limit=5,
        min_confidence=0,
        min_deliverability=0,
        db_out=None,
        jsonl_out=jsonl_path,
    )

    lines = jsonl_path.read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == 1
    obj = json.loads(lines[0])
    assert obj["email"] == "hello@acme.io"
    assert obj["confidence_band"] == "tier_a"
    assert obj["delivery_state"] == "valid"

    import csv

    with csv_path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == 1
    assert rows[0]["email"] == "hello@acme.io"


def test_bulk_emails_with_evidence_caps_rows_per_domain(tmp_path: Path, monkeypatch) -> None:
    csv_path = tmp_path / "out.csv"

    def fake_run_batch(domains, **kwargs):
        on = kwargs.get("on_domain_done")
        dr = DomainResult(domain="acme.io", pages_crawled=1)
        dr.findings = [
            EmailFinding(
                domain="acme.io",
                email=f"user{i}@acme.io",
                source_url=f"https://acme.io/contact/{i}",
                source_type="httpx",
                source_kind="site_page",
                found_in="mailto",
                crawl_depth=0,
                confidence_score=100 - i,
                confidence_label="high",
                reason_flags=["domain_exact_match"],
                sighting_count=1,
                verification_status="verified",
                deliverability_confidence=80,
                resolved_company_domain="acme.io",
                identity_confidence=0,
                delivery_state="valid",
                confidence_band="tier_a",
                finding_type="observed",
            )
            for i in range(6)
        ]
        if on:
            on(dr)
        return dr.findings

    monkeypatch.setattr("reverse_funnel_outreach.engine.run_batch", fake_run_batch)

    _bulk_emails_with_evidence(
        domains=["acme.io"],
        out=csv_path,
        one_per_domain=False,
        max_emails_per_domain=3,
        max_depth=1,
        page_limit=5,
        min_confidence=0,
        min_deliverability=0,
        db_out=None,
        jsonl_out=None,
    )

    import csv

    with csv_path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    assert len(rows) == 3
    assert rows[0]["email"] == "user0@acme.io"
    assert rows[2]["email"] == "user2@acme.io"


def test_bulk_emails_with_evidence_logs_done_counter(tmp_path: Path, monkeypatch) -> None:
    csv_path = tmp_path / "out.csv"
    printed: list[str] = []

    def fake_run_batch(domains, **kwargs):
        on = kwargs.get("on_domain_done")
        dr = DomainResult(domain="acme.io", pages_crawled=1)
        dr.findings = [
            EmailFinding(
                domain="acme.io",
                email="hello@acme.io",
                source_url="https://acme.io/contact",
                source_type="httpx",
                source_kind="site_page",
                found_in="mailto",
                crawl_depth=0,
                confidence_score=90,
                confidence_label="high",
                reason_flags=["domain_exact_match"],
                sighting_count=1,
                verification_status="verified",
                deliverability_confidence=80,
                resolved_company_domain="acme.io",
                identity_confidence=0,
                delivery_state="valid",
                confidence_band="tier_a",
                finding_type="observed",
            ),
        ]
        if on:
            on(dr)
        return dr.findings

    monkeypatch.setattr("reverse_funnel_outreach.engine.run_batch", fake_run_batch)
    monkeypatch.setattr("reverse_funnel_outreach.cli.console.print", lambda msg: printed.append(str(msg)))

    _bulk_emails_with_evidence(
        domains=["acme.io"],
        out=csv_path,
        one_per_domain=True,
        max_emails_per_domain=2,
        max_depth=1,
        page_limit=5,
        min_confidence=0,
        min_deliverability=0,
        db_out=None,
        jsonl_out=None,
    )

    assert any("done 1/1" in line for line in printed)
