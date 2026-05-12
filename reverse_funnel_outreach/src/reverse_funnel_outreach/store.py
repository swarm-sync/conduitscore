"""
SQLite persistence layer for domain-first prospecting runs.

Tables:
  crawl_runs       — one row per CLI invocation
  pages            — one row per fetched URL
  email_findings   — one row per (run_id, page, email) occurrence
  email_canonicals — one best row per (root_domain, email), including delivery_state / confidence_band
"""
from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

_SCHEMA = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS crawl_runs (
    id            TEXT PRIMARY KEY,
    started_at    TEXT NOT NULL,
    finished_at   TEXT,
    input_count   INTEGER DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'running',
    engine_version TEXT,
    settings_json TEXT
);

CREATE TABLE IF NOT EXISTS pages (
    id            TEXT PRIMARY KEY,
    run_id        TEXT NOT NULL,
    root_domain   TEXT NOT NULL,
    url           TEXT NOT NULL,
    depth         INTEGER NOT NULL DEFAULT 0,
    source_type   TEXT NOT NULL DEFAULT 'httpx',
    status_code   INTEGER,
    fetched_at    TEXT NOT NULL,
    content_hash  TEXT,
    resolved_domain TEXT,
    relationship_type TEXT,
    final_url     TEXT
);
CREATE INDEX IF NOT EXISTS idx_pages_run ON pages(run_id);

CREATE TABLE IF NOT EXISTS email_findings (
    id                TEXT PRIMARY KEY,
    run_id            TEXT NOT NULL,
    root_domain       TEXT NOT NULL,
    source_url        TEXT NOT NULL,
    email             TEXT NOT NULL,
    email_domain      TEXT NOT NULL,
    found_in          TEXT NOT NULL,
    source_type       TEXT NOT NULL DEFAULT 'httpx',
    raw_context       TEXT,
    confidence_score  INTEGER NOT NULL DEFAULT 0,
    confidence_label  TEXT NOT NULL DEFAULT 'low',
    flags_json        TEXT,
    created_at        TEXT NOT NULL,
    finding_type      TEXT DEFAULT 'observed',
    source_kind       TEXT DEFAULT 'site_page',
    verification_status TEXT DEFAULT 'unknown',
    deliverability_confidence INTEGER DEFAULT 0,
    reason_flags_v2_json TEXT,
    resolved_company_domain TEXT,
    identity_confidence INTEGER DEFAULT 0,
    delivery_state TEXT DEFAULT 'unknown',
    confidence_band TEXT DEFAULT 'tier_d'
);
CREATE INDEX IF NOT EXISTS idx_findings_run     ON email_findings(run_id);
CREATE INDEX IF NOT EXISTS idx_findings_domain  ON email_findings(root_domain);
CREATE INDEX IF NOT EXISTS idx_findings_email   ON email_findings(email);

CREATE TABLE IF NOT EXISTS email_canonicals (
    root_domain               TEXT NOT NULL,
    email                     TEXT NOT NULL,
    best_source_url           TEXT,
    best_confidence_score     INTEGER NOT NULL DEFAULT 0,
    sighting_count            INTEGER NOT NULL DEFAULT 1,
    recommended_for_outreach  INTEGER NOT NULL DEFAULT 0,
    best_source_kind          TEXT DEFAULT 'site_page',
    verification_status       TEXT DEFAULT 'unknown',
    deliverability_confidence INTEGER DEFAULT 0,
    resolved_company_domain   TEXT,
    identity_confidence       INTEGER DEFAULT 0,
    finding_type              TEXT DEFAULT 'observed',
    delivery_state            TEXT DEFAULT 'unknown',
    confidence_band           TEXT DEFAULT 'tier_d',
    PRIMARY KEY (root_domain, email)
);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _uid() -> str:
    return str(uuid.uuid4())


def open_db(path: Path | str = "rf_outreach.db") -> sqlite3.Connection:
    """Open (or create) the SQLite database and ensure the schema exists."""
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    conn.executescript(_SCHEMA)
    _migrate(conn)
    conn.commit()
    return conn


def _has_col(conn: sqlite3.Connection, table: str, col: str) -> bool:
    rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
    return any(r["name"] == col for r in rows)


def _migrate(conn: sqlite3.Connection) -> None:
    migrations: list[tuple[str, str, str]] = [
        ("crawl_runs", "engine_version", "ALTER TABLE crawl_runs ADD COLUMN engine_version TEXT"),
        ("crawl_runs", "settings_json", "ALTER TABLE crawl_runs ADD COLUMN settings_json TEXT"),
        ("pages", "resolved_domain", "ALTER TABLE pages ADD COLUMN resolved_domain TEXT"),
        ("pages", "relationship_type", "ALTER TABLE pages ADD COLUMN relationship_type TEXT"),
        ("pages", "final_url", "ALTER TABLE pages ADD COLUMN final_url TEXT"),
        ("email_findings", "finding_type", "ALTER TABLE email_findings ADD COLUMN finding_type TEXT DEFAULT 'observed'"),
        ("email_findings", "source_kind", "ALTER TABLE email_findings ADD COLUMN source_kind TEXT DEFAULT 'site_page'"),
        ("email_findings", "verification_status", "ALTER TABLE email_findings ADD COLUMN verification_status TEXT DEFAULT 'unknown'"),
        ("email_findings", "deliverability_confidence", "ALTER TABLE email_findings ADD COLUMN deliverability_confidence INTEGER DEFAULT 0"),
        ("email_findings", "reason_flags_v2_json", "ALTER TABLE email_findings ADD COLUMN reason_flags_v2_json TEXT"),
        ("email_findings", "resolved_company_domain", "ALTER TABLE email_findings ADD COLUMN resolved_company_domain TEXT"),
        ("email_findings", "identity_confidence", "ALTER TABLE email_findings ADD COLUMN identity_confidence INTEGER DEFAULT 0"),
        ("email_canonicals", "best_source_kind", "ALTER TABLE email_canonicals ADD COLUMN best_source_kind TEXT DEFAULT 'site_page'"),
        ("email_canonicals", "verification_status", "ALTER TABLE email_canonicals ADD COLUMN verification_status TEXT DEFAULT 'unknown'"),
        ("email_canonicals", "deliverability_confidence", "ALTER TABLE email_canonicals ADD COLUMN deliverability_confidence INTEGER DEFAULT 0"),
        ("email_canonicals", "resolved_company_domain", "ALTER TABLE email_canonicals ADD COLUMN resolved_company_domain TEXT"),
        ("email_canonicals", "identity_confidence", "ALTER TABLE email_canonicals ADD COLUMN identity_confidence INTEGER DEFAULT 0"),
        ("email_canonicals", "finding_type", "ALTER TABLE email_canonicals ADD COLUMN finding_type TEXT DEFAULT 'observed'"),
        ("email_findings", "delivery_state", "ALTER TABLE email_findings ADD COLUMN delivery_state TEXT DEFAULT 'unknown'"),
        ("email_findings", "confidence_band", "ALTER TABLE email_findings ADD COLUMN confidence_band TEXT DEFAULT 'tier_d'"),
        ("email_canonicals", "delivery_state", "ALTER TABLE email_canonicals ADD COLUMN delivery_state TEXT DEFAULT 'unknown'"),
        ("email_canonicals", "confidence_band", "ALTER TABLE email_canonicals ADD COLUMN confidence_band TEXT DEFAULT 'tier_d'"),
    ]
    for table, col, sql in migrations:
        if not _has_col(conn, table, col):
            conn.execute(sql)


# ---------------------------------------------------------------------------
# Run management
# ---------------------------------------------------------------------------

def create_run(conn: sqlite3.Connection, input_count: int, engine_version: str = "v2", settings_json: str = "") -> str:
    run_id = _uid()
    conn.execute(
        "INSERT INTO crawl_runs (id, started_at, input_count, status, engine_version, settings_json) VALUES (?,?,?,?,?,?)",
        (run_id, _now(), input_count, "running", engine_version, settings_json),
    )
    conn.commit()
    return run_id


def finish_run(conn: sqlite3.Connection, run_id: str, status: str = "completed") -> None:
    conn.execute(
        "UPDATE crawl_runs SET finished_at=?, status=? WHERE id=?",
        (_now(), status, run_id),
    )
    conn.commit()


# ---------------------------------------------------------------------------
# Page records
# ---------------------------------------------------------------------------

def save_page(
    conn: sqlite3.Connection,
    *,
    run_id: str,
    root_domain: str,
    url: str,
    depth: int,
    source_type: str = "httpx",
    status_code: int | None = None,
    content_hash: str = "",
    resolved_domain: str = "",
    relationship_type: str = "",
    final_url: str = "",
) -> str:
    pid = _uid()
    conn.execute(
        "INSERT OR IGNORE INTO pages VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        (
            pid, run_id, root_domain, url, depth, source_type, status_code, _now(), content_hash,
            resolved_domain, relationship_type, final_url,
        ),
    )
    conn.commit()
    return pid


# ---------------------------------------------------------------------------
# Email findings
# ---------------------------------------------------------------------------

def save_finding(
    conn: sqlite3.Connection,
    *,
    run_id: str,
    root_domain: str,
    source_url: str,
    email: str,
    found_in: str,
    source_type: str = "httpx",
    context: str = "",
    confidence_score: int,
    confidence_label: str,
    flags: list[str],
    finding_type: str = "observed",
    source_kind: str = "site_page",
    verification_status: str = "unknown",
    deliverability_confidence: int = 0,
    reason_flags_v2: list[str] | None = None,
    resolved_company_domain: str = "",
    identity_confidence: int = 0,
    delivery_state: str = "unknown",
    confidence_band: str = "tier_d",
) -> str:
    fid = _uid()
    email_domain = email.split("@", 1)[1] if "@" in email else ""
    conn.execute(
        "INSERT INTO email_findings VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (
            fid, run_id, root_domain, source_url, email, email_domain,
            found_in, source_type, context[:500],
            confidence_score, confidence_label,
            json.dumps(flags), _now(),
            finding_type, source_kind, verification_status, deliverability_confidence,
            json.dumps(reason_flags_v2 or []), resolved_company_domain, identity_confidence,
            delivery_state, confidence_band,
        ),
    )
    conn.commit()
    return fid


def upsert_canonical(
    conn: sqlite3.Connection,
    *,
    root_domain: str,
    email: str,
    source_url: str,
    confidence_score: int,
    recommended: bool,
    source_kind: str = "site_page",
    verification_status: str = "unknown",
    deliverability_confidence: int = 0,
    resolved_company_domain: str = "",
    identity_confidence: int = 0,
    finding_type: str = "observed",
    delivery_state: str = "unknown",
    confidence_band: str = "tier_d",
) -> None:
    """Merge this finding into the canonical (best-row-per-email) table."""
    row = conn.execute(
        "SELECT best_confidence_score, sighting_count FROM email_canonicals "
        "WHERE root_domain=? AND email=?",
        (root_domain, email),
    ).fetchone()

    if row:
        new_count = row["sighting_count"] + 1
        if confidence_score > row["best_confidence_score"]:
            conn.execute(
                "UPDATE email_canonicals SET best_source_url=?, best_confidence_score=?, "
                "sighting_count=?, recommended_for_outreach=?, best_source_kind=?, verification_status=?, "
                "deliverability_confidence=?, resolved_company_domain=?, identity_confidence=?, finding_type=?, "
                "delivery_state=?, confidence_band=? "
                "WHERE root_domain=? AND email=?",
                (
                    source_url, confidence_score, new_count, int(recommended), source_kind, verification_status,
                    deliverability_confidence, resolved_company_domain, identity_confidence, finding_type,
                    delivery_state, confidence_band,
                    root_domain, email,
                ),
            )
        else:
            conn.execute(
                "UPDATE email_canonicals SET sighting_count=? WHERE root_domain=? AND email=?",
                (new_count, root_domain, email),
            )
    else:
        conn.execute(
            "INSERT INTO email_canonicals VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                root_domain, email, source_url, confidence_score, 1, int(recommended),
                source_kind, verification_status, deliverability_confidence,
                resolved_company_domain, identity_confidence, finding_type,
                delivery_state, confidence_band,
            ),
        )
    conn.commit()
