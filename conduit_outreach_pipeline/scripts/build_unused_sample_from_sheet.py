"""
Compare the master outreach CSV to what's already on the Google Sheet.

1) If some master-list domains are NOT on the sheet yet → write those (up to 10).

2) If every master-list domain is already on the sheet → write up to 10 domains that
   still look like they need a fresh scan (placeholder / failed scan text, or score 0).

Run from the conduit_outreach_pipeline folder:

  set PYTHONPATH=src
  python scripts/build_unused_sample_from_sheet.py

Env: same as process-csv (GOOGLE_SHEET_ID, service-account JSON, etc.).
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[2]
_SRC = _REPO_ROOT / "conduit_outreach_pipeline" / "src"
if str(_SRC) not in sys.path:
    sys.path.insert(0, str(_SRC))

import gspread  # noqa: E402

from conduit_outreach_pipeline import config  # noqa: E402


def _norm_domain(s: str) -> str:
    s = (s or "").strip().lower()
    if s.startswith("www."):
        s = s[4:]
    return s


def _rescan_candidates_from_records(records: list[dict], *, limit: int) -> list[dict[str, str]]:
    """Domains that likely need a new scan: placeholder issue text or score stuck at 0."""
    out: list[dict[str, str]] = []
    got: set[str] = set()

    def push_from_row(r: dict[str, str]) -> None:
        dom_raw = str(r.get("domain") or "").strip()
        dom = _norm_domain(dom_raw)
        if not dom or dom in got:
            return
        got.add(dom)
        em = str(r.get("receiver_email") or "").strip()
        out.append(
            {
                "domain": dom_raw,
                "receiver_email": em,
                "email": em,
                "notes": "rescan_sample picked from Google Sheet (placeholder or low score)",
                "scrape_source": "sheet_rescan_sample",
            }
        )

    for r in records:
        if len(out) >= limit:
            break
        top = str(r.get("top_issue") or "")
        tl = top.lower()
        if "temporarily unavailable" in tl or "scan temporarily" in tl:
            push_from_row({k: str(v or "") for k, v in r.items()})

    if len(out) < limit:
        for r in records:
            if len(out) >= limit:
                break
            score = str(r.get("ai_visibility_score") or "").strip()
            if score == "0":
                push_from_row({k: str(v or "") for k, v in r.items()})

    return out[:limit]


def main() -> int:
    merged = _REPO_ROOT / "reverse_funnel_outreach" / "data" / "outreach_merged_for_sheet.csv"
    out_csv = _REPO_ROOT / "reverse_funnel_outreach" / "data" / "outreach_unused_from_sheet_check.csv"
    out_rescan = _REPO_ROOT / "reverse_funnel_outreach" / "data" / "outreach_rescan_sample_from_sheet.csv"
    sample_size = 10

    config.load_env()
    sa = config.google_sa_json_path()
    if not sa or not sa.is_file():
        print("ERROR: Google service account file not found. Set GOOGLE_SERVICE_ACCOUNT_JSON (or similar).", file=sys.stderr)
        return 1
    sid = config.sheet_id()
    if not sid:
        print("ERROR: GOOGLE_SHEET_ID is not set.", file=sys.stderr)
        return 1

    gc = gspread.service_account(filename=str(sa))
    ws = gc.open_by_key(sid).worksheet(config.sheet_worksheet_name())
    records = ws.get_all_records()
    seen: set[str] = set()
    for r in records:
        d = _norm_domain(str(r.get("domain") or ""))
        if d:
            seen.add(d)

    print(f"On the Google Sheet: {len(records)} rows total, {len(seen)} unique website addresses (domains).", flush=True)

    if not merged.is_file():
        print(f"ERROR: master CSV not found: {merged}", file=sys.stderr)
        return 1

    unused: list[dict[str, str]] = []
    fieldnames: list[str] = []
    with merged.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        for raw in reader:
            d = _norm_domain(raw.get("domain") or "")
            if not d:
                continue
            if d in seen:
                continue
            unused.append({k: (raw.get(k) or "").strip() for k in fieldnames})
            if len(unused) >= sample_size:
                break

    if not fieldnames:
        print("ERROR: master CSV has no header row.", file=sys.stderr)
        return 1

    if unused:
        out_csv.parent.mkdir(parents=True, exist_ok=True)
        with out_csv.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            w.writeheader()
            for row in unused:
                w.writerow(row)

        print(f"Wrote {len(unused)} NEW prospect(s) (not on sheet yet) to:\n  {out_csv}", flush=True)
        for row in unused:
            print(f"  - {row.get('domain', '').strip()}", flush=True)
        return 0

    print(
        "Every domain from the master list already appears on the Google Sheet — "
        "nothing 'unused' left. Picking people who likely need a re-scan instead…",
        flush=True,
    )
    rescan = _rescan_candidates_from_records(
        [{k: str(v or "") for k, v in r.items()} for r in records],
        limit=sample_size,
    )
    if not rescan:
        print("Could not find placeholder or score-0 rows to re-scan. No file written.", flush=True)
        return 0

    res_fields = ["domain", "receiver_email", "email", "notes", "scrape_source"]
    out_rescan.parent.mkdir(parents=True, exist_ok=True)
    with out_rescan.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=res_fields, extrasaction="ignore")
        w.writeheader()
        for row in rescan:
            w.writerow({k: row.get(k, "") for k in res_fields})

    print(f"Wrote {len(rescan)} re-scan prospect(s) to:\n  {out_rescan}", flush=True)
    for row in rescan:
        print(f"  - {row.get('domain', '').strip()}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
