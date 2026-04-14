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
from reverse_funnel_outreach.harvest import harvest_url
from reverse_funnel_outreach.render import build_context, load_variants_file, render_variant

app = typer.Typer(no_args_is_help=True, add_completion=False)
console = Console()


def _domain_from_url(url: str) -> str:
    from urllib.parse import urlparse

    p = urlparse(url if "://" in url else f"https://{url}")
    return p.netloc.split("@")[-1].split(":")[0] or url.strip()


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
