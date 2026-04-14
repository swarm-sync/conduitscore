from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


def _project_root() -> Path:
    """reverse_funnel_outreach/ (contains pyproject.toml, .env)."""
    return Path(__file__).resolve().parent.parent.parent


def _default_skill_env_dir() -> Path | None:
    """Best-effort path to reverse-funnel-scanner skill (Claude skills folder)."""
    home = Path.home()
    candidates = [
        home / ".claude" / "skills" / "reverse-funnel-scanner",
        Path(r"C:\Users\Administrator\.claude\skills\reverse-funnel-scanner"),
    ]
    for p in candidates:
        if (p / ".env").is_file() or (p / ".env.example").is_file():
            return p
    return None


def load_env() -> None:
    """
    Load env in order:
    1. Project .env (so REVERSE_FUNNEL_ENV_DIR can point at the skill folder)
    2. Skill .env from REVERSE_FUNNEL_ENV_DIR or default path
    3. Current working directory .env (local overrides)
    """
    proj = _project_root() / ".env"
    if proj.is_file():
        load_dotenv(proj, override=False)

    env_dir = os.environ.get("REVERSE_FUNNEL_ENV_DIR", "").strip()
    if env_dir:
        skill_env = Path(env_dir) / ".env"
        if skill_env.is_file():
            load_dotenv(skill_env, override=False)
    else:
        skill = _default_skill_env_dir()
        if skill and (skill / ".env").is_file():
            load_dotenv(skill / ".env", override=False)

    load_dotenv(override=False)


def package_data_dir() -> Path:
    return Path(__file__).resolve().parent / "data"


def cold_email_variants_path() -> Path:
    p = os.environ.get("COLD_EMAIL_VARIANTS_PATH", "").strip()
    if p:
        return Path(p)
    skill = _default_skill_env_dir()
    if skill and (skill / "cold-email-variants.md").is_file():
        return skill / "cold-email-variants.md"
    return package_data_dir() / "cold-email-variants.md"


def get_str(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


def get_bool(key: str, default: bool = False) -> bool:
    v = os.environ.get(key, "").strip().lower()
    if not v:
        return default
    return v in ("1", "true", "yes", "on")


def get_int(key: str, default: int) -> int:
    v = os.environ.get(key, "").strip()
    if not v:
        return default
    try:
        return int(v)
    except ValueError:
        return default


def conduit_base_url() -> str:
    return get_str("CONDUITSCORE_API_BASE", "https://conduitscore.com").rstrip("/")


def conduit_api_key() -> str:
    return get_str("CONDUITSCORE_API_KEY", "")


def rescan_link_base() -> str:
    return get_str(
        "RESCAN_LINK_BASE",
        "https://conduitscore.com/?utm_source=outreach&utm_medium=email&utm_campaign=rescan",
    )


def benchmark_link() -> str:
    return get_str(
        "BENCHMARK_LINK",
        "https://conduitscore.com/?utm_source=outreach&utm_medium=email&utm_campaign=benchmark",
    )


def user_agent() -> str:
    return get_str(
        "USER_AGENT",
        "ReverseFunnelOutreach/0.1 (+https://conduitscore.com)",
    )
