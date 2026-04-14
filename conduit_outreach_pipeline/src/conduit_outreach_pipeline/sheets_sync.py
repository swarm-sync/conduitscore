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


def fetch_pending_rows_for_send(limit: int = 50) -> list[tuple[int, dict[str, str]]]:
    """Return (row_number_1based, row_dict) for rows where status is pending/empty."""
    config.load_env()
    sid = config.sheet_id()
    if not sid:
        raise RuntimeError("GOOGLE_SHEET_ID is not set")
    gc = _client()
    ws = gc.open_by_key(sid).worksheet(config.sheet_worksheet_name())
    records = ws.get_all_records()
    out: list[tuple[int, dict[str, str]]] = []
    # row 1 = header; data starts row 2
    for i, rec in enumerate(records, start=2):
        st = str(rec.get("status", "")).strip().lower()
        if st in ("", "pending", "ready"):
            # normalize keys to SHEET_COLUMNS
            row = {k: str(rec.get(k, "") or "") for k in SHEET_COLUMNS}
            out.append((i, row))
        if len(out) >= limit:
            break
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
