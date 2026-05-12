from __future__ import annotations

import csv
import json
import sys
import time
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console

from conduit_outreach_pipeline import config, db
from conduit_outreach_pipeline.harvest_light import harvest_email_from_domain
from conduit_outreach_pipeline.row_builder import build_sheet_rows_for_prospect, dedupe_key_row
from conduit_outreach_pipeline.sheet_schema import SHEET_COLUMNS
from conduit_outreach_pipeline.sheets_sync import append_rows

app = typer.Typer(no_args_is_help=True, add_completion=False)
console = Console()


@app.command("init-headers")
def init_headers() -> None:
    """Write header row to the Google Sheet if row 1 is empty."""
    config.load_env()
    import gspread

    path = config.google_sa_json_path()
    if not path or not path.is_file():
        raise typer.BadParameter(
            "Service account JSON not found — set GOOGLE_SERVICE_ACCOUNT_JSON, "
            "GOOGLE_SERVICE_ACCOUNT_FILE, or GOOGLE_APPLICATION_CREDENTIALS"
        )
    gc = gspread.service_account(filename=str(path))
    ws = gc.open_by_key(config.sheet_id()).worksheet(config.sheet_worksheet_name())
    if ws.row_values(1):
        console.print("[yellow]Row 1 already has data — not overwriting.[/yellow]")
        raise typer.Exit(0)
    ws.append_row(SHEET_COLUMNS, value_input_option="USER_ENTERED")
    console.print("[green]Header row written.[/green]")


@app.command("process-csv")
def process_csv(
    csv_path: Path = typer.Argument(..., exists=True, dir_okay=False),
    push: bool = typer.Option(False, "--push", help="Append rows to Google Sheet"),
    use_dedupe: bool = typer.Option(True, "--dedupe/--no-dedupe"),
    harvest_missing: bool = typer.Option(
        True,
        "--harvest-missing/--no-harvest-missing",
        help="If receiver_email empty, try homepage harvest",
    ),
    force_scan: bool = typer.Option(False, "--force-scan"),
    jsonl_out: Optional[Path] = typer.Option(None, "--jsonl-out", help="Also write all rows as JSON lines"),
    steps: str = typer.Option("1,2,3,4,5", "--steps", help="Comma-separated step numbers"),
) -> None:
    """Ingest CSV → ConduitScore (cached) → classify → render → optional Sheet push."""
    config.load_env()
    step_tuple = tuple(int(x.strip()) for x in steps.split(",") if x.strip())
    all_rows: list[dict[str, str]] = []

    with csv_path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            domain = (raw.get("domain") or "").strip()
            if not domain:
                continue
            email = (raw.get("receiver_email") or raw.get("email") or "").strip()
            if not email and harvest_missing:
                email = harvest_email_from_domain(domain) or ""
            if not email:
                console.print(f"[yellow]Skip (no email): {domain}[/yellow]")
                continue

            rows = build_sheet_rows_for_prospect(
                domain=domain,
                receiver_email=email,
                first_name=(raw.get("first_name") or raw.get("first") or "").strip(),
                company_name=(raw.get("company_name") or raw.get("company") or "").strip(),
                industry_vertical=(raw.get("industry_vertical") or "").strip(),
                icp_tag=(raw.get("icp_tag") or "").strip(),
                sequence_override=(raw.get("sequence_override") or raw.get("sequence_type") or "").strip(),
                notes=(raw.get("notes") or "").strip(),
                scrape_source=(raw.get("scrape_source") or "csv").strip(),
                batch_group=(raw.get("batch_group") or "").strip(),
                send_priority=(raw.get("send_priority") or "1").strip(),
                last_rescan_score=(raw.get("last_rescan_score") or "").strip(),
                force_refresh_scan=force_scan,
                steps=step_tuple,
            )
            all_rows.extend(rows)

    if jsonl_out:
        jsonl_out.parent.mkdir(parents=True, exist_ok=True)
        with jsonl_out.open("w", encoding="utf-8") as out:
            for r in all_rows:
                out.write(json.dumps(r, ensure_ascii=False) + "\n")
        console.print(f"[green]Wrote {len(all_rows)} rows to {jsonl_out}[/green]")

    if push:
        to_push: list[dict[str, str]] = []
        for r in all_rows:
            if use_dedupe:
                dk = dedupe_key_row(r)
                if db.sheet_dedupe_seen(dk):
                    continue
            to_push.append(r)
        n = append_rows(to_push)
        if use_dedupe:
            for r in to_push:
                db.sheet_dedupe_mark(dedupe_key_row(r))
        console.print(f"[green]Appended {n} rows to Google Sheet[/green]")
    else:
        console.print(f"[cyan]Built {len(all_rows)} row(s). Use --push to send to Sheet.[/cyan]")


@app.command("send")
def send(
    dry_run: bool = typer.Option(False, "--dry-run"),
    max_n: int = typer.Option(35, "--max", help="Max messages this run"),
    delivery_valid_only: bool = typer.Option(
        False,
        "--delivery-valid-only",
        help="Only rows whose notes contain delivery=valid (best harvest tier)",
    ),
    yes: bool = typer.Option(
        False,
        "--yes",
        help="Skip approval prompt and send immediately (use with caution).",
    ),
) -> None:
    """Send pending rows via Gmail API; updates Sheet status + SQLite send log."""
    from conduit_outreach_pipeline.gmail_sender import send_batch_from_sheet

    config.load_env()
    if not dry_run and not yes:
        console.print(
            "[yellow]Human approval required before live send.[/yellow]\n"
            "Review your Google Sheet first, then come back and confirm."
        )
        approval = typer.prompt("Type SEND to approve sending")
        if approval.strip().upper() != "SEND":
            console.print("[red]Send cancelled. No emails were sent.[/red]")
            raise typer.Exit(1)

    send_batch_from_sheet(max_messages=max_n, dry_run=dry_run, delivery_valid_only=delivery_valid_only)
    console.print("[green]Send batch finished.[/green]")


@app.command("send-slow")
def send_slow(
    max_n: int = typer.Option(
        5,
        "--max",
        help="Max messages this invocation (keep small; run repeatedly or schedule)",
    ),
    pause: float = typer.Option(
        90.0,
        "--pause",
        help="Seconds between sends (rotation spreads across your Gmail accounts)",
    ),
    delivery_valid_only: bool = typer.Option(
        False,
        "--delivery-valid-only",
        help="Only rows whose notes contain delivery=valid",
    ),
    dry_run: bool = typer.Option(False, "--dry-run"),
    yes: bool = typer.Option(
        False,
        "--yes",
        help="Required for live send (skips SEND prompt)",
    ),
) -> None:
    """Send a small batch with long pauses — use with multi-inbox rotation (SENDER_EMAILS / rotation file)."""
    from conduit_outreach_pipeline.gmail_sender import send_batch_from_sheet

    config.load_env()
    if not dry_run and not yes:
        console.print(
            "[yellow]Live send needs --yes (after you reviewed the Sheet).[/yellow] "
            "Use --dry-run to validate only."
        )
        raise typer.Exit(1)

    send_batch_from_sheet(
        max_messages=max_n,
        daily_cap=max(max_n, 1),
        dry_run=dry_run,
        sleep_seconds=pause,
        delivery_valid_only=delivery_valid_only,
    )
    console.print("[green]Slow send batch finished.[/green]")


@app.command("send-campaign")
def send_campaign(
    delivery_valid_only: bool = typer.Option(
        True,
        "--delivery-valid-only/--all-rows",
        help="Only mail rows with delivery=valid in notes (recommended)",
    ),
    max_per_run: int = typer.Option(
        35,
        "--max-per-run",
        help="Max messages per batch (each batch runs until this many sends or daily cap)",
    ),
    pause: float = typer.Option(
        90.0,
        "--pause",
        help="Seconds between individual sends inside each batch",
    ),
    max_rounds: int = typer.Option(
        120,
        "--max-rounds",
        help="Safety stop after this many batches (re-run later if needed)",
    ),
    sleep_between_batches: float = typer.Option(
        3.0,
        "--sleep-between-batches",
        help="Seconds to pause between batch rounds",
    ),
    dry_run: bool = typer.Option(False, "--dry-run"),
    yes: bool = typer.Option(False, "--yes", help="Required for live send"),
) -> None:
    """Repeat send batches until no pending rows remain (or cap hits). For full valid-list sends."""
    from conduit_outreach_pipeline.gmail_sender import send_batch_from_sheet

    config.load_env()
    if not dry_run and not yes:
        console.print("[yellow]Live send requires --yes. Use --dry-run to simulate.[/yellow]")
        raise typer.Exit(1)

    mode = "delivery=valid rows only" if delivery_valid_only else "all pending rows"
    console.print(
        f"[cyan]send-campaign[/cyan] starting ({mode}), "
        f"up to [cyan]{max_per_run}[/cyan] sends per batch, [cyan]{pause}s[/cyan] between sends…"
    )
    sys.stdout.flush()
    total = 0
    for r in range(max_rounds):
        sent = send_batch_from_sheet(
            max_messages=max_per_run,
            daily_cap=max_per_run,
            dry_run=dry_run,
            sleep_seconds=pause,
            delivery_valid_only=delivery_valid_only,
        )
        total += sent
        console.print(f"[cyan]Batch {r + 1}:[/cyan] sent {sent} this round, [cyan]{total}[/cyan] total")
        if sent == 0:
            console.print("[green]Campaign complete (nothing left to send, or quota/cap).[/green]")
            break
        time.sleep(max(sleep_between_batches, 0.0))
    else:
        console.print(f"[yellow]Stopped after {max_rounds} batches (see --max-rounds).[/yellow]")


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    app()


if __name__ == "__main__":
    main()
