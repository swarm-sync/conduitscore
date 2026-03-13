import os
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Settings:
    worker_mode: str = os.getenv("WORKER_MODE", "mock")
    database_url: str = os.getenv("DATABASE_URL", "")
    redis_url: str = os.getenv("REDIS_URL", "")
    next_app_url: str = os.getenv("NEXT_APP_URL", "http://localhost:3000")
    internal_api_key: str = os.getenv("INTERNAL_API_KEY", "sk_internal_change_me")
    max_browsers: int = int(os.getenv("MAX_BROWSERS", "2"))
    scan_timeout_seconds: int = int(os.getenv("SCAN_TIMEOUT_SECONDS", "60"))
    conduit_root: str = os.getenv("CONDUIT_ROOT", str(Path.home() / "Desktop" / "Conduit"))
    conduit_data_dir: str = os.getenv(
        "CONDUIT_DATA_DIR",
        str(Path(__file__).resolve().parents[1] / ".conduit-runtime"),
    )


settings = Settings()
