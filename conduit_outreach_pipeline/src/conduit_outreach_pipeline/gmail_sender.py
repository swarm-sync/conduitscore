from __future__ import annotations

import base64
import smtplib
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
from conduit_outreach_pipeline.sheets_sync import (
    fetch_all_sendable_rows,
    update_row_failed_max_retries,
    update_row_status,
)

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

_service_cache: dict[str, object] = {}
_sender_email_cache: dict[str, str] = {}


def row_notes_say_delivery_valid(row: dict[str, str]) -> bool:
    """True when Sheet/row notes include harvest tag delivery=valid (best-quality emails)."""
    notes = (row.get("notes") or "").lower()
    return "delivery=valid" in notes


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


def _mime_for_smtp(
    row: dict[str, str],
    *,
    from_name: str,
    from_email: str,
) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = row["subject"]
    msg["From"] = f"{from_name or row.get('sender_name', 'Ben')} <{from_email}>"
    msg["To"] = row["receiver_email"]
    base = config.get_str("UNSUBSCRIBE_BASE_URL", "").rstrip("/")
    token = row.get("unsubscribe_token", "")
    if base and token:
        msg["List-Unsubscribe"] = f"<{base}?token={token}>"
        msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    msg.attach(MIMEText(row.get("body_text", ""), "plain", "utf-8"))
    msg.attach(MIMEText(row.get("body_html", ""), "html", "utf-8"))
    return msg


def _smtp_hard_cap_for_account(acct: dict[str, str]) -> int:
    raw_allowed = str(acct.get("daily_limit", "")).strip()
    try:
        allowed = int(raw_allowed) if raw_allowed else config.smtp_default_allowed_daily()
    except ValueError:
        allowed = config.smtp_default_allowed_daily()
    ratio = config.smtp_safety_ratio()
    # Enforce conservative floor safety cap, minimum 1.
    return max(1, int(allowed * ratio))


def send_one(
    row: dict[str, str],
    *,
    dry_run: bool = False,
    sender_index: int = 0,
) -> str | None:
    config.load_env()
    smtp_accounts = config.smtp_accounts_rotation()
    if smtp_accounts:
        acct = smtp_accounts[sender_index % len(smtp_accounts)]
        from_email = acct.get("from_email", "") or acct["user"]
        from_name = acct.get("from_name", "") or row.get("sender_name", "Ben")
        key = dedupe_key_row(row)
        if db.send_already(key):
            return "skipped_duplicate"
        if not db.send_retry_ready(key):
            return "skipped_retry_wait"
        if dry_run:
            return "dry_run"
        host = config.get_str("SMTP_HOST", "smtp.gmail.com")
        port = config.get_int("SMTP_PORT", 587)
        hard_cap = _smtp_hard_cap_for_account(acct)
        already_sent = db.smtp_sent_today(acct["user"])
        if already_sent >= hard_cap:
            return "skipped_cap"
        msg = _mime_for_smtp(row, from_name=from_name, from_email=from_email)
        with smtplib.SMTP(host, port, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.login(acct["user"], acct["password"])
            server.sendmail(from_email, [row["receiver_email"]], msg.as_string())
        db.send_retry_clear(key)
        # Keep same schema as Gmail API path.
        db.send_record(key, f"smtp:{int(time.time())}", "sent")
        db.smtp_mark_sent(acct["user"])
        return "sent_smtp"

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
    if not db.send_retry_ready(key):
        return "skipped_retry_wait"
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
    db.send_retry_clear(key)
    db.send_record(key, mid, "sent")
    return mid


def send_batch_from_sheet(
    *,
    max_messages: int | None = None,
    daily_cap: int | None = None,
    dry_run: bool = False,
    sleep_seconds: float | None = None,
    delivery_valid_only: bool = False,
) -> int:
    """Send up to cap pending rows; returns count of messages sent (or dry-run simulated)."""
    config.load_env()
    dvo = delivery_valid_only or config.get_str("SEND_ONLY_DELIVERY_VALID", "").lower() in (
        "1",
        "true",
        "yes",
    )
    cap = daily_cap if daily_cap is not None else config.get_int("GMAIL_DAILY_CAP", 35)
    pause = (
        sleep_seconds
        if sleep_seconds is not None
        else config.get_float("GMAIL_SEND_PAUSE_SECONDS", 2.0)
    )
    all_rows = fetch_all_sendable_rows()
    pending: list[tuple[int, dict[str, str]]] = []
    for row_num, row in all_rows:
        if dvo and not row_notes_say_delivery_valid(row):
            continue
        key = dedupe_key_row(row)
        if db.send_already(key):
            continue
        if not db.send_retry_ready(key):
            continue
        pending.append((row_num, row))
        if len(pending) >= (max_messages or cap):
            break
    n = 0
    smtp_accounts = config.smtp_accounts_rotation()
    for i, (row_num, row) in enumerate(pending):
        if n >= cap:
            break
        key = dedupe_key_row(row)
        sender_index = i
        if smtp_accounts:
            chosen = None
            for k in range(len(smtp_accounts)):
                idx = (i + k) % len(smtp_accounts)
                acct = smtp_accounts[idx]
                if db.smtp_sent_today(acct["user"]) < _smtp_hard_cap_for_account(acct):
                    chosen = idx
                    break
            if chosen is None:
                # No account has remaining safe quota for today.
                break
            sender_index = chosen
        try:
            result = send_one(row, dry_run=dry_run, sender_index=sender_index)
            if result in ("skipped_cap", "skipped_retry_wait", "skipped_duplicate"):
                continue
        except Exception as e:
            err_s = str(e)
            outcome = db.send_retry_record_failure(key, err_s)
            if outcome == "exhausted":
                if not dry_run:
                    update_row_failed_max_retries(row_num, error_summary=err_s)
                db.send_record(key, "", "failed_max_retries")
            continue
        sent_ok = result == "sent_smtp" or (
            isinstance(result, str) and bool(result) and result not in ("dry_run",)
        )
        if not dry_run and sent_ok and result != "dry_run":
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
    return n
