from __future__ import annotations

from typing import Any

import gspread

from conduit_outreach_pipeline import config
from conduit_outreach_pipeline.sheet_schema import SHEET_COLUMNS, row_dict_to_list


def _client() -> gspread.Client:
    config.load_env()
    path = config.google_sa_json_path()
    if not path or not path.is_file():
        raise RuntimeError(
            "Set GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SERVICE_ACCOUNT_FILE, or "
            "GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON file, then share the sheet "
            "with that service account's client_email."
        )
    return gspread.service_account(filename=str(path))


def ensure_header(worksheet: gspread.Worksheet) -> None:
    if config.get_str("SHEET_SKIP_HEADER_CHECK", "").lower() in ("1", "true", "yes"):
        return
    row1 = worksheet.row_values(1)
    if not row1 or not str(row1[0]).strip():
        worksheet.append_row(SHEET_COLUMNS, value_input_option="USER_ENTERED")


def append_rows(rows: list[dict[str, Any]], *, batch_size: int = 100) -> int:
    """Append sheet rows; returns count appended."""
    config.load_env()
    sid = config.sheet_id()
    if not sid:
        raise RuntimeError("GOOGLE_SHEET_ID is not set")

    gc = _client()
    sh = gc.open_by_key(sid)
    ws = sh.worksheet(config.sheet_worksheet_name())
    ensure_header(ws)

    values = [row_dict_to_list(r) for r in rows]
    n = 0
    for i in range(0, len(values), batch_size):
        chunk = values[i : i + batch_size]
        ws.append_rows(chunk, value_input_option="USER_ENTERED")
        n += len(chunk)
    return n


_TERMINAL_SEND_STATUSES = frozenset(
    {
        "sent",
        "failed_max_retries",
        "failed_permanent",
        "unsubscribed",
    }
)


def _status_is_sendable(status_raw: str) -> bool:
    st = str(status_raw or "").strip().lower()
    if st in _TERMINAL_SEND_STATUSES:
        return False
    return st in ("", "pending", "ready", "retry", "queued")


def fetch_pending_rows_for_send(limit: int = 50) -> list[tuple[int, dict[str, str]]]:
    """Return (row_number_1based, row_dict) for rows eligible to send (not terminal)."""
    return fetch_all_sendable_rows()[:limit]


def fetch_all_sendable_rows() -> list[tuple[int, dict[str, str]]]:
    """All rows that are not in a terminal status (for filtering by retry/backoff in the sender)."""
    config.load_env()
    sid = config.sheet_id()
    if not sid:
        raise RuntimeError("GOOGLE_SHEET_ID is not set")
    gc = _client()
    ws = gc.open_by_key(sid).worksheet(config.sheet_worksheet_name())
    records = ws.get_all_records()
    out: list[tuple[int, dict[str, str]]] = []
    for i, rec in enumerate(records, start=2):
        if not _status_is_sendable(rec.get("status", "")):
            continue
        row = {k: str(rec.get(k, "") or "") for k in SHEET_COLUMNS}
        out.append((i, row))
    return out


def update_row_status(row_1based: int, *, status: str, sent_timestamp: str) -> None:
    config.load_env()
    sid = config.sheet_id()
    gc = _client()
    ws = gc.open_by_key(sid).worksheet(config.sheet_worksheet_name())
    try:
        status_col = SHEET_COLUMNS.index("status") + 1
        ts_col = SHEET_COLUMNS.index("sent_timestamp") + 1
    except ValueError:
        return
    ws.update_cell(row_1based, status_col, status)
    ws.update_cell(row_1based, ts_col, sent_timestamp)


def update_row_failed_max_retries(row_1based: int, *, error_summary: str) -> None:
    """Set status to failed_max_retries and append a short note (smart retry exhausted)."""
    import time as _time

    config.load_env()
    sid = config.sheet_id()
    gc = _client()
    ws = gc.open_by_key(sid).worksheet(config.sheet_worksheet_name())
    try:
        status_col = SHEET_COLUMNS.index("status") + 1
        ts_col = SHEET_COLUMNS.index("sent_timestamp") + 1
        notes_col = SHEET_COLUMNS.index("notes") + 1
    except ValueError:
        return
    row_vals = ws.row_values(row_1based)
    while len(row_vals) < len(SHEET_COLUMNS):
        row_vals.append("")
    old_notes = row_vals[notes_col - 1] if len(row_vals) >= notes_col else ""
    stamp = _time.strftime("%Y-%m-%dT%H:%M:%SZ", _time.gmtime())
    snippet = (error_summary or "").replace("\n", " ").strip()[:400]
    line = f"[{stamp}] send failed after max retries: {snippet}"
    new_notes = ((old_notes + " | ") if old_notes else "") + line
    if len(new_notes) > 1900:
        new_notes = new_notes[:1900] + "…"
    ws.update_cell(row_1based, status_col, "failed_max_retries")
    ws.update_cell(row_1based, ts_col, "")
    ws.update_cell(row_1based, notes_col, new_notes)
