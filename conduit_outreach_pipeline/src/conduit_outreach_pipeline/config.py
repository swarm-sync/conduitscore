from __future__ import annotations

import os
import sys
import json
from pathlib import Path

from dotenv import load_dotenv


def _package_root() -> Path:
    """Directory that contains pyproject.toml (conduit_outreach_pipeline/)."""
    return Path(__file__).resolve().parent.parent.parent


def _repo_root() -> Path:
    """ConduitScore repo root (parent of conduit_outreach_pipeline/)."""
    return _package_root().parent


def _project_root() -> Path:
    """Alias for package root (historical name)."""
    return _package_root()


def _skill_env_dir() -> Path | None:
    home = Path.home()
    for p in (
        home / ".claude" / "skills" / "reverse-funnel-scanner",
        Path(r"C:\Users\Administrator\.claude\skills\reverse-funnel-scanner"),
    ):
        if (p / ".env").is_file():
            return p
    return None


def load_env() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    repo = _repo_root() / ".env"
    if repo.is_file():
        load_dotenv(repo, override=False)

    pkg = _package_root() / ".env"
    if pkg.is_file():
        load_dotenv(pkg, override=True)

    # Reverse-funnel skill .env (or REVERSE_FUNNEL_ENV_DIR) should win for ConduitScore keys
    # and other harvest/outreach vars — load last with override so empty values in pkg/.env
    # do not block CONDUITSCORE_API_KEY from the skill.
    env_dir = os.environ.get("REVERSE_FUNNEL_ENV_DIR", "").strip()
    if env_dir:
        p = Path(env_dir) / ".env"
        if p.is_file():
            load_dotenv(p, override=True)
    else:
        sk = _skill_env_dir()
        if sk and (sk / ".env").is_file():
            load_dotenv(sk / ".env", override=True)

    load_dotenv(override=False)


def get_str(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


def get_int(key: str, default: int) -> int:
    v = os.environ.get(key, "").strip()
    if not v:
        return default
    try:
        return int(v)
    except ValueError:
        return default


def get_float(key: str, default: float) -> float:
    v = os.environ.get(key, "").strip()
    if not v:
        return default
    try:
        return float(v)
    except ValueError:
        return default


def conduit_base_url() -> str:
    return get_str("CONDUITSCORE_API_BASE", "https://conduitscore.com").rstrip("/")


def conduit_api_key() -> str:
    return get_str("CONDUITSCORE_API_KEY", "")


def sheet_id() -> str:
    return get_str("GOOGLE_SHEET_ID", "")


def sheet_worksheet_name() -> str:
    return get_str("GOOGLE_SHEET_WORKSHEET", "Sheet1")


def google_sa_json_path() -> Path | None:
    """First existing file among JSON path, SERVICE_ACCOUNT_FILE, APPLICATION_CREDENTIALS."""
    for key in (
        "GOOGLE_SERVICE_ACCOUNT_JSON",
        "GOOGLE_SERVICE_ACCOUNT_FILE",
        "GOOGLE_APPLICATION_CREDENTIALS",
    ):
        raw = get_str(key, "")
        if not raw:
            continue
        path = Path(raw)
        if path.is_file():
            return path
    return None


def gmail_sender_profiles() -> list[tuple[Path, Path]]:
    """
    (OAuth client secrets JSON, token JSON) per inbox.
    Single inbox: GMAIL_OAUTH_CREDENTIALS_JSON + GMAIL_OAUTH_TOKEN_JSON.
    Multiple (rotate): comma-separated parallel lists, or GMAIL_SENDER_ROTATION_FILE JSON:
    [{"credentials": "c1.json", "token": "t1.json"}, ...]
    """
    rot_file = get_str("GMAIL_SENDER_ROTATION_FILE", "")
    if rot_file:
        import json

        p = Path(rot_file)
        if not p.is_file():
            raise RuntimeError(f"GMAIL_SENDER_ROTATION_FILE not found: {p}")
        data = json.loads(p.read_text(encoding="utf-8"))
        out: list[tuple[Path, Path]] = []
        for item in data:
            c = Path(str(item["credentials"]))
            t = Path(str(item["token"]))
            out.append((c, t))
        if not out:
            raise RuntimeError("GMAIL_SENDER_ROTATION_FILE must list at least one sender")
        return out

    cred_raw = get_str("GMAIL_OAUTH_CREDENTIALS_JSON", "")
    tok_raw = get_str("GMAIL_OAUTH_TOKEN_JSON", str(_package_root() / "data" / "gmail_token.json"))
    if not cred_raw:
        return []
    if "," in cred_raw:
        creds = [Path(x.strip()) for x in cred_raw.split(",") if x.strip()]
        if "," in tok_raw:
            toks = [Path(x.strip()) for x in tok_raw.split(",") if x.strip()]
        else:
            toks = []
        if len(toks) != len(creds):
            raise RuntimeError(
                "Multi-inbox: GMAIL_OAUTH_CREDENTIALS_JSON and GMAIL_OAUTH_TOKEN_JSON "
                "must be comma-separated lists of the same length (one token file per inbox)."
            )
        return list(zip(creds, toks))
    return [(Path(cred_raw), Path(tok_raw))]


def gmail_credentials_path() -> Path | None:
    profiles = gmail_sender_profiles()
    return profiles[0][0] if profiles else None


def gmail_token_path() -> Path:
    profiles = gmail_sender_profiles()
    if profiles:
        return profiles[0][1]
    return Path(str(_package_root() / "data" / "gmail_token.json"))


def sender_emails_rotation() -> list[str]:
    """Optional comma list aligned with Gmail profiles; if empty, From is taken from each Gmail account."""
    raw = get_str("SENDER_EMAILS", "")
    if not raw:
        return []
    return [x.strip() for x in raw.split(",") if x.strip()]


def smtp_accounts_rotation() -> list[dict[str, str]]:
    """
    SMTP account rotation from JSON in SMTP_ACCOUNTS.
    Example:
    [{"user":"a@gmail.com","password":"app-pass","from_name":"Ben","from_email":"a@gmail.com","daily_limit":200}]
    """
    raw = get_str("SMTP_ACCOUNTS", "")
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
    except Exception as exc:
        raise RuntimeError("SMTP_ACCOUNTS must be valid JSON array") from exc
    if not isinstance(parsed, list):
        raise RuntimeError("SMTP_ACCOUNTS must be a JSON array")
    out: list[dict[str, str]] = []
    for item in parsed:
        if not isinstance(item, dict):
            continue
        user = str(item.get("user", "")).strip()
        password = str(item.get("password", "")).strip()
        if not user or not password:
            continue
        out.append(
            {
                "user": user,
                "password": password,
                "from_name": str(item.get("from_name", "")).strip(),
                "from_email": str(item.get("from_email", "")).strip() or user,
                "daily_limit": str(item.get("daily_limit", "")).strip(),
            }
        )
    return out


def smtp_safety_ratio() -> float:
    """
    Safety multiplier for hard per-account send cap.
    Example: allowed 40/day with ratio 0.75 => hard cap 30/day.
    """
    v = get_float("SMTP_DAILY_SAFETY_RATIO", 0.75)
    if v <= 0:
        return 0.75
    return min(v, 1.0)


def smtp_default_allowed_daily() -> int:
    """
    Fallback allowed daily limit when account JSON has no daily_limit.
    """
    return get_int("SMTP_DEFAULT_ALLOWED_DAILY", 40)


def template_root() -> Path:
    return Path(__file__).resolve().parent / "templates"


def db_path() -> Path:
    return Path(get_str("OUTREACH_DB_PATH", str(_project_root() / "data" / "outreach.db")))


def cache_ttl_hours() -> float:
    return get_float("SCAN_CACHE_TTL_HOURS", 24.0)


def http_user_agent() -> str:
    return get_str("HTTP_USER_AGENT", "ConduitOutreach/1.1")


def template_version() -> str:
    vfile = template_root() / "VERSION"
    if vfile.is_file():
        return vfile.read_text(encoding="utf-8").strip() or "1.1"
    return get_str("TEMPLATE_VERSION", "1.1")


def send_max_attempts() -> int:
    """Max failed send attempts per dedupe key before sheet status becomes failed_max_retries."""
    return max(1, get_int("SEND_MAX_ATTEMPTS", 5))


def send_backoff_seconds_list() -> list[int]:
    """
    Comma-separated backoff seconds after each failure (stages repeat last value if more failures).
    Default: 5m, 15m, 1h, 4h, 24h.
    """
    raw = get_str("SEND_BACKOFF_SECONDS", "300,900,3600,14400,86400")
    out: list[int] = []
    for part in raw.split(","):
        p = part.strip()
        if p.isdigit():
            out.append(int(p))
    return out if out else [300, 900, 3600, 14400, 86400]
