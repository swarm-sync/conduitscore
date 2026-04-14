from __future__ import annotations

import sqlite3
import time

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
