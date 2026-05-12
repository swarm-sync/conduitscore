from __future__ import annotations

import sys

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import csv
import json
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from reverse_funnel_outreach import config
from reverse_funnel_outreach.conduit_client import pick_top_fix_code, pick_top_issue, scan_domain
from reverse_funnel_outreach.bulk_emails import load_domains
from reverse_funnel_outreach.harvest import harvest_url
from reverse_funnel_outreach.render import build_context, load_variants_file, render_variant

app = typer.Typer(no_args_is_help=True, add_completion=False)
console = Console()


def _domain_from_url(url: str) -> str:
    from urllib.parse import urlparse

    p = urlparse(url if "://" in url else f"https://{url}")
    return p.netloc.split("@")[-1].split(":")[0] or url.strip()


@app.command("bulk-emails")
def bulk_emails(
    input_path: Path = typer.Argument(
        ...,
        exists=True,
        dir_okay=False,
        help="CSV (domain column) or .txt with one domain per line",
    ),
    out: Path = typer.Option(
        Path("harvested_emails.csv"),
        "--out",
        "-o",
        help="Output CSV: one row per email found",
    ),
    one_per_domain: bool = typer.Option(
        False,
        "--one-per-domain",
        help="Only write the top-ranked email per site (smaller file)",
    ),
    max_emails_per_domain: int = typer.Option(
        2,
        "--max-emails-per-domain",
        min=1,
        help="[--with-evidence] Cap email rows per domain (default 2)",
    ),
    dedupe_globally: bool = typer.Option(
        True,
        "--dedupe/--no-dedupe",
        help="Skip an email if it already appeared on an earlier row",
    ),
    legacy: bool = typer.Option(
        False,
        "--legacy",
        help="Use the old harvest path (domain,email,sources,note) instead of the evidence engine.",
    ),
    no_crawl4ai: bool = typer.Option(False, "--no-crawl4ai", help="Skip headless browser"),
    no_scrapy: bool = typer.Option(False, "--no-scrapy", help="Skip same-domain crawl"),
    with_evidence: bool = typer.Option(
        True,
        "--with-evidence",
        help=(
            "Use the domain-first engine (default): outputs source_url, source_type, "
            "confidence_score, confidence_label, reason_flags per email."
        ),
    ),
    max_depth: int = typer.Option(
        1,
        "--max-depth",
        help="[--with-evidence] Max crawl depth from homepage (default 1)",
    ),
    page_limit: int = typer.Option(
        25,
        "--page-limit",
        help="[--with-evidence] Max pages crawled per domain (default 25)",
    ),
    min_confidence: int = typer.Option(
        0,
        "--min-confidence",
        help="[--with-evidence] Drop rows below this confidence score",
    ),
    min_deliverability: int = typer.Option(
        0,
        "--min-deliverability",
        help="[--with-evidence] Drop rows below deliverability confidence",
    ),
    db_out: Optional[Path] = typer.Option(
        None,
        "--db",
        help="[--with-evidence] Write SQLite evidence DB to this path (optional)",
    ),
    jsonl: bool = typer.Option(
        False,
        "--jsonl/--no-jsonl",
        help="[--with-evidence] Also write JSON Lines next to the CSV (same stem, .jsonl)",
    ),
    jsonl_out: Optional[Path] = typer.Option(
        None,
        "--jsonl-out",
        help="[--with-evidence] Explicit JSONL path (overrides --jsonl stem)",
    ),
):
    """Harvest emails for many domains → CSV (and optional JSONL). No scans, no templates, no Google Sheet.

    Default mode uses the domain-first evidence engine.
    Add --legacy to use the original simpler output path.
    """
    config.load_env()
    domains = load_domains(input_path)
    if not domains:
        console.print("[red]No domains in input file.[/red]")
        raise typer.Exit(1)

    out.parent.mkdir(parents=True, exist_ok=True)

    # ------------------------------------------------------------------
    # Evidence-rich mode (new domain-first engine)
    # ------------------------------------------------------------------
    if with_evidence and not legacy:
        jl_path: Optional[Path] = None
        if jsonl_out is not None:
            jl_path = jsonl_out
        elif jsonl:
            jl_path = out.with_suffix(".jsonl")

        _bulk_emails_with_evidence(
            domains=domains,
            out=out,
            one_per_domain=one_per_domain,
            max_emails_per_domain=max_emails_per_domain,
            max_depth=max_depth,
            page_limit=page_limit,
            min_confidence=min_confidence,
            min_deliverability=min_deliverability,
            db_out=db_out,
            jsonl_out=jl_path,
        )
        return

    # ------------------------------------------------------------------
    # Legacy mode (original behaviour — unchanged)
    # ------------------------------------------------------------------
    fieldnames = ["domain", "email", "sources", "note"]
    rows_written = 0
    seen_email: set[str] = set()

    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()

        for i, raw in enumerate(domains, start=1):
            url = raw if "://" in raw else f"https://{raw}"
            dom_display = _domain_from_url(url)
            console.print(f"[cyan]({i}/{len(domains)})[/cyan] {dom_display} …")
            try:
                r = harvest_url(
                    url,
                    use_crawl4ai=not no_crawl4ai,
                    use_scrapy=not no_scrapy,
                )
            except Exception as e:
                note = f"harvest_error:{e!s}"
                w.writerow(
                    {
                        "domain": dom_display,
                        "email": "",
                        "sources": "",
                        "note": note[:500],
                    }
                )
                rows_written += 1
                continue

            src = ";".join(r.sources) if r.sources else ""
            emails = r.emails[:1] if one_per_domain else list(r.emails)
            if not emails:
                w.writerow(
                    {
                        "domain": dom_display,
                        "email": "",
                        "sources": src,
                        "note": "no_emails_found",
                    }
                )
                rows_written += 1
                continue

            for em in emails:
                el = em.strip().lower()
                if dedupe_globally and el in seen_email:
                    continue
                if dedupe_globally:
                    seen_email.add(el)
                w.writerow(
                    {
                        "domain": dom_display,
                        "email": em,
                        "sources": src,
                        "note": "",
                    }
                )
                rows_written += 1

    console.print(f"[green]Wrote {rows_written} row(s) to {out}[/green]")


def _finding_to_evidence_row(ef: "EmailFinding | None", dr: "DomainResult") -> dict[str, object]:
    """Build one export row dict (CSV + JSONL) for evidence mode."""
    if ef is None:
        return {
            "domain": dr.domain,
            "email": "",
            "source_url": "",
            "source_type": "",
            "source_kind": "",
            "found_in": "",
            "crawl_depth": "",
            "confidence_score": 0,
            "confidence_label": "reject",
            "reason_flags": "no_emails_found",
            "sighting_count": 0,
            "verification_status": "unknown",
            "deliverability_confidence": 0,
            "resolved_company_domain": dr.domain,
            "identity_confidence": 0,
            "delivery_state": "unknown",
            "confidence_band": "tier_d",
            "finding_type": "",
        }
    return {
        "domain": ef.domain,
        "email": ef.email,
        "source_url": ef.source_url,
        "source_type": ef.source_type,
        "source_kind": ef.source_kind,
        "found_in": ef.found_in,
        "crawl_depth": ef.crawl_depth,
        "confidence_score": ef.confidence_score,
        "confidence_label": ef.confidence_label,
        "reason_flags": "|".join(ef.reason_flags),
        "sighting_count": ef.sighting_count,
        "verification_status": ef.verification_status,
        "deliverability_confidence": ef.deliverability_confidence,
        "resolved_company_domain": ef.resolved_company_domain or ef.domain,
        "identity_confidence": ef.identity_confidence,
        "delivery_state": getattr(ef, "delivery_state", "unknown"),
        "confidence_band": getattr(ef, "confidence_band", "tier_d"),
        "finding_type": getattr(ef, "finding_type", "observed"),
    }


def _bulk_emails_with_evidence(
    *,
    domains: list[str],
    out: Path,
    one_per_domain: bool,
    max_emails_per_domain: int,
    max_depth: int,
    page_limit: int,
    min_confidence: int,
    min_deliverability: int,
    db_out: Optional[Path],
    jsonl_out: Optional[Path] = None,
) -> None:
    """Inner implementation for --with-evidence mode."""
    from reverse_funnel_outreach.engine import run_batch, EmailFinding, DomainResult

    evidence_fields = [
        "domain",
        "email",
        "source_url",
        "source_type",
        "source_kind",
        "found_in",
        "crawl_depth",
        "confidence_score",
        "confidence_label",
        "reason_flags",
        "sighting_count",
        "verification_status",
        "deliverability_confidence",
        "resolved_company_domain",
        "identity_confidence",
        "delivery_state",
        "confidence_band",
        "finding_type",
    ]

    rows_written = 0
    seen_rows: set[tuple[str, str]] = set()
    domains_done = 0
    total_domains = len(domains)

    def _on_domain_done(dr: DomainResult) -> None:
        nonlocal domains_done
        domains_done += 1
        summary = (
            f"[cyan]done {domains_done}/{total_domains}[/cyan] · "
            f"[green]{len(dr.findings)} email(s)[/green] found · {dr.pages_crawled} pages crawled"
        )
        if dr.errors:
            summary += f" · [yellow]{len(dr.errors)} fetch error(s)[/yellow]"
        console.print(summary)

    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=evidence_fields)
        w.writeheader()

        jsonl_f = jsonl_out.open("w", encoding="utf-8") if jsonl_out else None
        try:
            if jsonl_f:
                jsonl_out.parent.mkdir(parents=True, exist_ok=True)

            indexed_domains = list(enumerate(domains, start=1))

            def _emit_for_domain(dr: DomainResult) -> None:
                nonlocal rows_written
                findings: list[EmailFinding] = dr.findings
                if min_confidence > 0:
                    findings = [f for f in findings if f.confidence_score >= min_confidence]
                if min_deliverability > 0:
                    findings = [f for f in findings if f.deliverability_confidence >= min_deliverability]

                if not findings:
                    row = _finding_to_evidence_row(None, dr)
                    w.writerow(row)
                    if jsonl_f:
                        jsonl_f.write(json.dumps(row, ensure_ascii=False) + "\n")
                    rows_written += 1
                    _on_domain_done(dr)
                    return

                if one_per_domain:
                    emit = findings[:1]
                else:
                    emit = findings[:max_emails_per_domain]
                for ef in emit:
                    row_key = (ef.domain, ef.email.lower())
                    if row_key in seen_rows:
                        continue
                    seen_rows.add(row_key)
                    row = _finding_to_evidence_row(ef, dr)
                    w.writerow(row)
                    if jsonl_f:
                        jsonl_f.write(json.dumps(row, ensure_ascii=False) + "\n")
                    rows_written += 1

                _on_domain_done(dr)

            for i, raw in indexed_domains:
                dom_display = raw.strip().replace("https://", "").replace("http://", "").split("/")[0]
                console.print(f"[cyan]({i}/{len(domains)})[/cyan] {dom_display} …")

            # run_batch owns optional DB lifecycle; use callback for per-domain summaries.
            run_batch(
                domains,
                max_depth=max_depth,
                page_limit=page_limit,
                db_path=db_out,
                verbose=False,
                on_domain_done=_emit_for_domain,
            )
        finally:
            if jsonl_f:
                jsonl_f.close()

    console.print(f"[green]Wrote {rows_written} row(s) to {out}[/green]")
    if jsonl_out:
        console.print(f"[green]Wrote JSONL to {jsonl_out}[/green]")
    if db_out:
        console.print(f"[dim]Evidence DB: {db_out}[/dim]")


@app.command("export-for-outreach")
def export_for_outreach(
    out: Path = typer.Option(
        Path("data/outreach_merged_for_sheet.csv"),
        "--out",
        "-o",
        help="Prospect CSV for conduit-op process-csv (domain, receiver_email, …)",
    ),
    restrict_to: Optional[Path] = typer.Option(
        Path("data/574Websites_from_ods.csv"),
        "--restrict-to",
        help="Only rows whose domain matches this source list (original ODS export)",
    ),
    evidence_a: Path = typer.Argument(
        Path("data/harvest_573_evidence.csv"),
        exists=False,
        help="First evidence CSV (e.g. main harvest)",
    ),
    evidence_b: Path = typer.Argument(
        Path("data/harvest_missing_evidence.csv"),
        exists=False,
        help="Second evidence CSV (e.g. missing-domain retry); skipped if absent",
    ),
) -> None:
    """Merge harvest evidence → one best email per domain → CSV for Google Sheet pipeline."""
    from reverse_funnel_outreach.outreach_export import (
        export_prospect_csv_for_pipeline,
        load_allowed_domains_from_sheet_csv,
    )

    inputs = [p for p in (evidence_a, evidence_b) if p.is_file()]
    if not inputs:
        console.print("[red]No evidence CSVs found — pass paths that exist.[/red]")
        raise typer.Exit(1)
    restrict_path = restrict_to if (restrict_to and restrict_to.is_file()) else None
    if restrict_to and restrict_to.is_file():
        n_allowed = len(load_allowed_domains_from_sheet_csv(restrict_to))
        if n_allowed == 0:
            console.print(f"[red]No domains parsed from {restrict_to} — check columns.[/red]")
            raise typer.Exit(1)
        console.print(f"[dim]Restricting to {n_allowed} domain(s) from {restrict_to.name}[/dim]")
    n = export_prospect_csv_for_pipeline(
        inputs, out, one_per_domain=True, restrict_to_sheet_csv=restrict_path
    )
    console.print(f"[green]Wrote {n} prospect row(s) to {out}[/green] (from {len(inputs)} file(s))")
    console.print(
        "[dim]Next: cd conduit_outreach_pipeline && python -m conduit_outreach_pipeline.cli "
        f"process-csv {out.resolve()} --push --no-harvest-missing[/dim]"
    )


@app.command("prepare-prospects")
def prepare_prospects(
    evidence_csv: Path = typer.Argument(..., exists=True, dir_okay=False, help="Evidence CSV from bulk-emails"),
    out: Path = typer.Option(Path("prospects_prepared.csv"), "--out", "-o"),
    one_per_domain: bool = typer.Option(True, "--one-per-domain/--all"),
    min_confidence: int = typer.Option(0, "--min-confidence"),
    min_deliverability: int = typer.Option(0, "--min-deliverability"),
) -> None:
    from reverse_funnel_outreach.engine import EmailFinding
    from reverse_funnel_outreach.prospect_adapter import (
        best_prospect_per_domain,
        findings_to_prospect_csv_rows,
        write_prospect_csv,
    )

    findings: list[EmailFinding] = []
    with evidence_csv.open(newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            email = (row.get("email") or "").strip()
            if not email:
                continue
            score = int((row.get("confidence_score") or "0").strip() or 0)
            deliverability = int((row.get("deliverability_confidence") or "0").strip() or 0)
            if score < min_confidence or deliverability < min_deliverability:
                continue
            findings.append(
                EmailFinding(
                    domain=(row.get("domain") or "").strip(),
                    email=email,
                    source_url=(row.get("source_url") or "").strip(),
                    source_type=(row.get("source_type") or "").strip() or "httpx",
                    source_kind=(row.get("source_kind") or "").strip() or "site_page",
                    found_in=(row.get("found_in") or "").strip(),
                    crawl_depth=int((row.get("crawl_depth") or "0").strip() or 0),
                    confidence_score=score,
                    confidence_label=(row.get("confidence_label") or "").strip() or "low",
                    reason_flags=[x for x in (row.get("reason_flags") or "").split("|") if x],
                    sighting_count=int((row.get("sighting_count") or "1").strip() or 1),
                    verification_status=(row.get("verification_status") or "unknown").strip(),
                    deliverability_confidence=deliverability,
                    resolved_company_domain=(row.get("resolved_company_domain") or "").strip(),
                    identity_confidence=int((row.get("identity_confidence") or "0").strip() or 0),
                    delivery_state=(row.get("delivery_state") or "unknown").strip(),
                    confidence_band=(row.get("confidence_band") or "tier_d").strip(),
                    finding_type=(row.get("finding_type") or "observed").strip(),
                )
            )
    if one_per_domain:
        findings = best_prospect_per_domain(findings)
    rows = findings_to_prospect_csv_rows(findings)
    write_prospect_csv(rows, out)
    console.print(f"[green]Prepared {len(rows)} prospect row(s) to {out}[/green]")


@app.command()
def harvest(
    url: str = typer.Argument(..., help="Homepage URL or domain to crawl for emails"),
    no_crawl4ai: bool = typer.Option(False, "--no-crawl4ai", help="Skip headless browser fetch"),
    no_scrapy: bool = typer.Option(False, "--no-scrapy", help="Skip Scrapy same-domain crawl"),
):
    """Fetch page(s) with httpx + Trafilatura, optional Crawl4AI + Scrapy; print ranked emails."""
    config.load_env()
    r = harvest_url(
        url,
        use_crawl4ai=not no_crawl4ai,
        use_scrapy=not no_scrapy,
    )
    console.print("[bold]Sources:[/bold]", ", ".join(r.sources) or "(none)")
    if not r.emails:
        console.print("[yellow]No emails found.[/yellow]")
        raise typer.Exit(1)
    for e in r.emails:
        console.print(e)


@app.command()
def scan(
    url: str = typer.Argument(..., help="URL to send to ConduitScore /api/scan"),
    out: Optional[Path] = typer.Option(None, "--out", "-o", help="Write JSON to file"),
):
    """Run a single ConduitScore scan (requires CONDUITSCORE_API_KEY)."""
    config.load_env()
    data = scan_domain(url if "://" in url else f"https://{url}")
    text = json.dumps(data, indent=2)
    if out:
        out.write_text(text, encoding="utf-8")
        console.print(f"Wrote [green]{out}[/green]")
    else:
        console.print(text)


@app.command()
def render(
    step: str = typer.Argument(..., help="Variant id: A1 … A5"),
    domain: str = typer.Argument(..., help="Prospect domain"),
    first_name: str = typer.Option("there", "--first-name", "-f"),
    scan_json: Optional[Path] = typer.Option(
        None,
        "--scan-json",
        help="Path to prior scan JSON; if omitted, calls /api/scan",
    ),
):
    """Render subject + body for one cold email variant."""
    config.load_env()
    variants = load_variants_file()
    from reverse_funnel_outreach.templates import variant_by_step

    v = variant_by_step(variants, step)
    if not v:
        console.print(f"[red]Unknown step {step}[/red]")
        raise typer.Exit(1)

    url = domain if "://" in domain else f"https://{domain}"
    if scan_json and scan_json.is_file():
        scan = json.loads(scan_json.read_text(encoding="utf-8"))
    else:
        scan = scan_domain(url)

    top, _desc = pick_top_issue(scan)
    code = pick_top_fix_code(scan, top)
    dom = _domain_from_url(url)
    ctx = build_context(
        domain=dom,
        first_name=first_name,
        scan=scan,
        top_issue=top,
        code_snippet=code,
        email_step=step,
    )
    subj, body = render_variant(v, ctx)
    console.print("[bold]Subject:[/bold]", subj)
    console.print()
    console.print(body)


@app.command("run")
def run_pipeline(
    input_csv: Path = typer.Argument(..., help="CSV with columns: domain, email, first_name (optional)"),
    out_csv: Path = typer.Option(Path("outreach_out.csv"), "--out", "-o"),
    steps: str = typer.Option(
        "A1",
        "--steps",
        help="Comma-separated variants to render per row (e.g. A1,A2,A3)",
    ),
    skip_harvest: bool = typer.Option(
        False,
        "--skip-harvest",
        help="Do not re-harvest email from domain (use email column as-is)",
    ),
):
    """CSV in: optional harvest, ConduitScore scan, render columns for each step."""
    config.load_env()
    variants = load_variants_file()
    from reverse_funnel_outreach.templates import variant_by_step

    step_list = [s.strip() for s in steps.split(",") if s.strip()]
    rows_out: list[dict[str, str]] = []

    with input_csv.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            domain = (row.get("domain") or "").strip()
            email = (row.get("email") or "").strip()
            first = (row.get("first_name") or row.get("first") or "").strip() or "there"
            url = domain if "://" in domain else f"https://{domain}"

            if not skip_harvest and domain:
                try:
                    hr = harvest_url(url)
                    if hr.emails:
                        email = hr.emails[0]
                except Exception as e:
                    console.print(f"[yellow]Harvest warning {domain}: {e}[/yellow]")

            scan = scan_domain(url)
            top, _ = pick_top_issue(scan)
            code = pick_top_fix_code(scan, top)
            dom = _domain_from_url(url)
            ctx = build_context(
                domain=dom,
                first_name=first,
                scan=scan,
                top_issue=top,
                code_snippet=code,
            )
            out_row = {**row, "email": email}
            for st in step_list:
                v = variant_by_step(variants, st)
                if not v:
                    continue
                subj, body = render_variant(v, ctx)
                out_row[f"subject_{st}"] = subj
                out_row[f"body_{st}"] = body
            rows_out.append(out_row)

    all_keys: list[str] = []
    seen_k: set[str] = set()
    for r in rows_out:
        for k in r:
            if k not in seen_k:
                seen_k.add(k)
                all_keys.append(k)

    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=all_keys, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows_out)
    console.print(f"[green]Wrote {len(rows_out)} rows to {out_csv}[/green]")


def main() -> None:
    app()


if __name__ == "__main__":
    main()
