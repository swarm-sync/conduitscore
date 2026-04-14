from __future__ import annotations

from urllib.parse import quote_plus

from conduit_outreach_pipeline import config


def prospect_url(domain: str) -> str:
    d = domain.strip().lower()
    if d.startswith("http://") or d.startswith("https://"):
        return d
    return f"https://{d}"


def build_tracking_links(domain: str, scan_id: str | None = None) -> tuple[str, str]:
    """
    rescan_link, verify_link — same destination pattern, different utm_campaign for analytics.
    Optional scan_id query param preserved for future product support (harmless if ignored).
    """
    config.load_env()
    base = config.conduit_base_url()
    u = prospect_url(domain)
    q = quote_plus(u)
    rid = (scan_id or "").strip()
    sid = f"&scan_id={quote_plus(rid)}" if rid else ""
    rescan = f"{base}/?url={q}&utm_source=outreach&utm_medium=email&utm_campaign=rescan{sid}"
    verify = f"{base}/?url={q}&utm_source=outreach&utm_medium=email&utm_campaign=verify{sid}"
    return rescan, verify
