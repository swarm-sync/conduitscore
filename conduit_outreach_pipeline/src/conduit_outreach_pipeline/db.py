from __future__ import annotations

import sqlite3
import time
import datetime as dt

from conduit_outreach_pipeline import config


def connect() -> sqlite3.Connection:
    config.load_env()
    path = config.db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    _migrate(conn)
    return conn


def _migrate(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS scan_cache (
            domain TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            fetched_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sheet_dedupe (
            dedupe_key TEXT PRIMARY KEY,
            created_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS send_log (
            dedupe_key TEXT PRIMARY KEY,
            message_id TEXT,
            sent_at TEXT NOT NULL,
            status TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS unsubscribe_tokens (
            token TEXT PRIMARY KEY,
            receiver_email TEXT NOT NULL,
            domain TEXT,
            unsubscribed INTEGER NOT NULL DEFAULT 0,
            created_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS smtp_daily_sends (
            account TEXT NOT NULL,
            date_utc TEXT NOT NULL,
            count INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (account, date_utc)
        );
        CREATE TABLE IF NOT EXISTS send_retry (
            dedupe_key TEXT PRIMARY KEY,
            failure_count INTEGER NOT NULL DEFAULT 0,
            next_eligible_at REAL NOT NULL DEFAULT 0,
            last_error TEXT
        );
        """
    )
    conn.commit()


def cache_get(domain: str) -> str | None:
    with connect() as c:
        row = c.execute(
            "SELECT payload, fetched_at FROM scan_cache WHERE domain = ?", (domain,)
        ).fetchone()
        if not row:
            return None
        age_h = (time.time() - row["fetched_at"]) / 3600.0
        if age_h > config.cache_ttl_hours():
            return None
        return str(row["payload"])


def cache_put(domain: str, payload: str) -> None:
    with connect() as c:
        c.execute(
            """INSERT INTO scan_cache(domain, payload, fetched_at) VALUES(?,?,?)
               ON CONFLICT(domain) DO UPDATE SET payload=excluded.payload, fetched_at=excluded.fetched_at""",
            (domain, payload, time.time()),
        )
        c.commit()


def sheet_dedupe_seen(key: str) -> bool:
    with connect() as c:
        r = c.execute("SELECT 1 FROM sheet_dedupe WHERE dedupe_key = ?", (key,)).fetchone()
        return r is not None


def sheet_dedupe_mark(key: str) -> None:
    with connect() as c:
        c.execute(
            "INSERT OR IGNORE INTO sheet_dedupe(dedupe_key, created_at) VALUES(?,?)",
            (key, time.time()),
        )
        c.commit()


def send_already(dedupe_key: str) -> bool:
    with connect() as c:
        r = c.execute(
            "SELECT 1 FROM send_log WHERE dedupe_key = ? AND status = 'sent'",
            (dedupe_key,),
        ).fetchone()
        return r is not None


def send_record(dedupe_key: str, message_id: str, status: str) -> None:
    with connect() as c:
        c.execute(
            """INSERT INTO send_log(dedupe_key, message_id, sent_at, status) VALUES(?,?,?,?)
               ON CONFLICT(dedupe_key) DO UPDATE SET message_id=excluded.message_id,
               sent_at=excluded.sent_at, status=excluded.status""",
            (dedupe_key, message_id, time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), status),
        )
        c.commit()


def unsub_store(token: str, email: str, domain: str) -> None:
    with connect() as c:
        c.execute(
            """INSERT OR IGNORE INTO unsubscribe_tokens(token, receiver_email, domain, created_at)
               VALUES(?,?,?,?)""",
            (token, email.lower(), domain, time.time()),
        )
        c.commit()


def unsub_is_active(token: str) -> bool:
    with connect() as c:
        row = c.execute(
            "SELECT unsubscribed FROM unsubscribe_tokens WHERE token = ?", (token,)
        ).fetchone()
        if not row:
            return False
        return int(row["unsubscribed"]) == 0


def unsub_mark(token: str) -> None:
    with connect() as c:
        c.execute(
            "UPDATE unsubscribe_tokens SET unsubscribed = 1 WHERE token = ?", (token,)
        )
        c.commit()


def _utc_day_key() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")


def smtp_sent_today(account: str) -> int:
    with connect() as c:
        row = c.execute(
            "SELECT count FROM smtp_daily_sends WHERE account = ? AND date_utc = ?",
            (account.lower(), _utc_day_key()),
        ).fetchone()
        return int(row["count"]) if row else 0


def smtp_mark_sent(account: str) -> None:
    with connect() as c:
        c.execute(
            """
            INSERT INTO smtp_daily_sends(account, date_utc, count)
            VALUES(?,?,1)
            ON CONFLICT(account, date_utc) DO UPDATE SET count = count + 1
            """,
            (account.lower(), _utc_day_key()),
        )
        c.commit()


def send_retry_ready(dedupe_key: str) -> bool:
    """True if no backoff row or current time >= next_eligible_at."""
    with connect() as c:
        row = c.execute(
            "SELECT next_eligible_at FROM send_retry WHERE dedupe_key = ?", (dedupe_key,)
        ).fetchone()
        if not row:
            return True
        return time.time() >= float(row["next_eligible_at"])


def send_retry_clear(dedupe_key: str) -> None:
    with connect() as c:
        c.execute("DELETE FROM send_retry WHERE dedupe_key = ?", (dedupe_key,))
        c.commit()


def send_retry_record_failure(dedupe_key: str, err: str) -> str:
    """
    Increment failure count, schedule next_eligible_at from SEND_BACKOFF_SECONDS.
    Returns 'retry' (will try again later) or 'exhausted' (no more attempts).
    """
    max_att = config.send_max_attempts()
    backoffs = config.send_backoff_seconds_list()
    now = time.time()
    err_short = (err or "")[:500]
    with connect() as c:
        row = c.execute(
            "SELECT failure_count FROM send_retry WHERE dedupe_key = ?", (dedupe_key,)
        ).fetchone()
        fc = int(row["failure_count"]) if row else 0
        fc += 1
        if fc >= max_att:
            c.execute("DELETE FROM send_retry WHERE dedupe_key = ?", (dedupe_key,))
            c.commit()
            return "exhausted"
        idx = min(fc - 1, len(backoffs) - 1)
        wait = float(backoffs[idx])
        next_t = now + wait
        c.execute(
            """
            INSERT INTO send_retry(dedupe_key, failure_count, next_eligible_at, last_error)
            VALUES(?,?,?,?)
            ON CONFLICT(dedupe_key) DO UPDATE SET
              failure_count=excluded.failure_count,
              next_eligible_at=excluded.next_eligible_at,
              last_error=excluded.last_error
            """,
            (dedupe_key, fc, next_t, err_short),
        )
        c.commit()
        return "retry"
