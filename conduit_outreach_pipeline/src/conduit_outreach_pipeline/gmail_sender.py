from __future__ import annotations

import base64
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from conduit_outreach_pipeline import config, db
from conduit_outreach_pipeline.row_builder import dedupe_key_row
from conduit_outreach_pipeline.sheets_sync import fetch_pending_rows_for_send, update_row_status

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

_service_cache: dict[str, object] = {}
_sender_email_cache: dict[str, str] = {}


def _cache_key(credentials_path: Path, token_path: Path) -> str:
    return f"{credentials_path.resolve()}|{token_path.resolve()}"


def _service_for_profile(credentials_path: Path, token_path: Path):
    key = _cache_key(credentials_path, token_path)
    if key in _service_cache:
        return _service_cache[key]
    if not credentials_path.is_file():
        raise RuntimeError(
            "Gmail OAuth client JSON missing: "
            f"{credentials_path} (check GMAIL_OAUTH_CREDENTIALS_JSON or rotation file)"
        )
    token_path.parent.mkdir(parents=True, exist_ok=True)
    creds = None
    if token_path.is_file():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(credentials_path), SCOPES)
            creds = flow.run_local_server(port=0)
        token_path.write_text(creds.to_json(), encoding="utf-8")
    svc = build("gmail", "v1", credentials=creds)
    _service_cache[key] = svc
    return svc


def _from_address_for_profile(
    svc,
    credentials_path: Path,
    token_path: Path,
    *,
    sender_override: str,
) -> str:
    if sender_override.strip():
        return sender_override.strip()
    key = _cache_key(credentials_path, token_path)
    if key in _sender_email_cache:
        return _sender_email_cache[key]
    prof = svc.users().getProfile(userId="me").execute()
    em = str(prof.get("emailAddress") or "").strip()
    if not em:
        raise RuntimeError("Gmail API did not return emailAddress for this token")
    _sender_email_cache[key] = em
    return em


def _mime_message(
    row: dict[str, str],
    *,
    from_email: str,
) -> dict[str, str]:
    sender = from_email
    if not sender:
        raise RuntimeError("sender address empty (SENDER_EMAIL / SENDER_EMAILS or Gmail profile)")
    to = row["receiver_email"]
    subject = row["subject"]
    html = row.get("body_html", "")
    text = row.get("body_text", "")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{row.get('sender_name', 'Ben')} <{sender}>"
    msg["To"] = to
    base = config.get_str("UNSUBSCRIBE_BASE_URL", "").rstrip("/")
    token = row.get("unsubscribe_token", "")
    if base and token:
        msg["List-Unsubscribe"] = f"<{base}?token={token}>"
        msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return {"raw": raw}


def send_one(
    row: dict[str, str],
    *,
    dry_run: bool = False,
    sender_index: int = 0,
) -> str | None:
    config.load_env()
    profiles = config.gmail_sender_profiles()
    if not profiles:
        raise RuntimeError(
            "GMAIL_OAUTH_CREDENTIALS_JSON must point to Google Cloud OAuth client JSON (Desktop app), "
            "or use GMAIL_SENDER_ROTATION_FILE for multiple inboxes."
        )
    cred_path, tok_path = profiles[sender_index % len(profiles)]
    rotation_emails = config.sender_emails_rotation()
    if rotation_emails:
        sender_override = rotation_emails[sender_index % len(rotation_emails)]
    else:
        sender_override = row.get("sender_email", "") or config.get_str("SENDER_EMAIL", "")

    key = dedupe_key_row(row)
    if db.send_already(key):
        return "skipped_duplicate"
    if dry_run:
        return "dry_run"
    svc = _service_for_profile(cred_path, tok_path)
    from_email = _from_address_for_profile(
        svc, cred_path, tok_path, sender_override=sender_override
    )
    body = _mime_message(row, from_email=from_email)
    sent = (
        svc.users()
        .messages()
        .send(userId="me", body=body)
        .execute()
    )
    mid = sent.get("id", "")
    db.send_record(key, mid, "sent")
    return mid


def send_batch_from_sheet(
    *,
    max_messages: int | None = None,
    daily_cap: int | None = None,
    dry_run: bool = False,
    sleep_seconds: float | None = None,
) -> None:
    config.load_env()
    cap = daily_cap if daily_cap is not None else config.get_int("GMAIL_DAILY_CAP", 35)
    pause = (
        sleep_seconds
        if sleep_seconds is not None
        else config.get_float("GMAIL_SEND_PAUSE_SECONDS", 2.0)
    )
    pending = fetch_pending_rows_for_send(limit=max_messages or cap)
    n = 0
    for i, (row_num, row) in enumerate(pending):
        if n >= cap:
            break
        key = dedupe_key_row(row)
        if db.send_already(key):
            continue
        try:
            send_one(row, dry_run=dry_run, sender_index=i)
        except Exception as e:
            db.send_record(key, "", f"error:{e!s}")
            continue
        if not dry_run:
            import datetime as _dt

            update_row_status(
                row_num,
                status="sent",
                sent_timestamp=_dt.datetime.now(_dt.timezone.utc)
                .replace(microsecond=0)
                .isoformat(),
            )
        n += 1
        time.sleep(max(pause, 0.5))
