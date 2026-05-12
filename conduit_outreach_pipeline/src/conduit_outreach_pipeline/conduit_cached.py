from __future__ import annotations

import json
import logging
import random
import time
from typing import Any

import httpx

from conduit_outreach_pipeline import config, db

logger = logging.getLogger(__name__)


def _api_error_message(response: httpx.Response | None) -> str:
    """Pull plain-text error from JSON body when the API returns 4xx/5xx."""
    if response is None:
        return ""
    try:
        data = response.json()
        if isinstance(data, dict):
            err = data.get("error")
            if isinstance(err, str) and err.strip():
                out = err.strip()
                hint = data.get("hint")
                if isinstance(hint, str) and hint.strip():
                    out = f"{out} — {hint.strip()}"
                retry = data.get("retryAfterSeconds")
                if isinstance(retry, (int, float)) and retry > 0:
                    out = f"{out} (retry after ~{int(retry)}s)"
                return out[:500]
    except Exception:
        pass
    text = (response.text or "").strip()
    return text[:300] if text else ""


def _normalize_domain(url_or_domain: str) -> str:
    u = url_or_domain.strip()
    if not u.startswith(("http://", "https://")):
        u = "https://" + u
    from urllib.parse import urlparse

    net = urlparse(u).netloc.split("@")[-1]
    return net.split(":")[0].lower()


def scan_domain_raw(url: str) -> dict[str, Any]:
    config.load_env()
    base = config.conduit_base_url()
    key = config.conduit_api_key()
    if not key:
        raise RuntimeError("CONDUITSCORE_API_KEY missing — set in .env or REVERSE_FUNNEL_ENV_DIR skill .env")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": key,
    }
    # Default 8/min (~7.5s between calls) stays under anonymous burst limits when many tools share one IP.
    rlm = config.get_int("RATE_LIMIT_PER_MINUTE", 8)
    jitter = max(0.0, config.get_float("CONDUITSCAN_REQUEST_JITTER_SECONDS", 0.35))
    if rlm > 0:
        time.sleep(60.0 / max(rlm, 1) + random.uniform(0, jitter))

    max_attempts = max(1, config.get_int("CONDUITSCAN_RETRY_ATTEMPTS", 4))
    base_backoff = max(0.5, config.get_float("CONDUITSCAN_RETRY_BACKOFF_SECONDS", 2.0))
    retry_on = {429, 500, 502, 503, 504}

    with httpx.Client(timeout=120.0) as client:
        for attempt in range(max_attempts):
            r = client.post(f"{base}/api/scan", headers=headers, json={"url": url})
            if r.status_code in retry_on and attempt + 1 < max_attempts:
                extra = 0.0
                if r.status_code == 429:
                    try:
                        ra = r.headers.get("Retry-After")
                        if ra and str(ra).isdigit():
                            extra = float(ra)
                    except Exception:
                        extra = 0.0
                wait = base_backoff * (2**attempt) + extra
                logger.warning(
                    "ConduitScore scan retry %s/%s for %s (HTTP %s)",
                    attempt + 1,
                    max_attempts,
                    url,
                    r.status_code,
                )
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.json()


def _failed_scan_placeholder(reason: str) -> dict[str, Any]:
    """Minimal payload when the API errors so sheet rows and emails can still be built."""
    r = (reason or "unknown error").strip()[:500]
    return {
        "overallScore": 0,
        "issues": [
            {
                "severity": "info",
                "title": "Scan temporarily unavailable",
                "description": r,
                "id": "scan_failed",
            }
        ],
        "fixes": [],
        "categories": [],
        "id": None,
        "metadata": {"scan_failed": True},
    }


def scan_domain_cached(url_or_domain: str, *, force_refresh: bool = False) -> dict[str, Any]:
    dom = _normalize_domain(url_or_domain)
    if not force_refresh:
        cached = db.cache_get(dom)
        if cached:
            return json.loads(cached)
    url = url_or_domain if "://" in url_or_domain else f"https://{url_or_domain}"
    try:
        data = scan_domain_raw(url)
    except httpx.HTTPStatusError as e:
        code = e.response.status_code if e.response is not None else "?"
        detail = _api_error_message(e.response) if e.response is not None else ""
        msg = f"HTTP {code} from ConduitScore for {dom}"
        if detail:
            msg = f"{msg}: {detail}"
        logger.warning("%s", msg)
        return _failed_scan_placeholder(msg)
    except httpx.RequestError as e:
        msg = f"{type(e).__name__} for {dom}: {e}"
        logger.warning("%s", msg)
        return _failed_scan_placeholder(msg)
    db.cache_put(dom, json.dumps(data))
    return data


def pick_top_issue(scan: dict[str, Any]) -> tuple[str, str]:
    issues: list[dict[str, Any]] = scan.get("issues") or []
    if not issues:
        return ("No issues returned", "")
    order = {"critical": 0, "warning": 1, "info": 2}

    def k(i: dict[str, Any]) -> tuple[int, str]:
        sev = str(i.get("severity", "info")).lower()
        return (order.get(sev, 3), str(i.get("title", "")))

    top = min(issues, key=k)
    return (str(top.get("title", "")), str(top.get("description", "")))


def pick_top_fix(scan: dict[str, Any], issue_title: str) -> tuple[str, str, str]:
    """(title, description, code) for best-matching fix."""
    fixes: list[dict[str, Any]] = scan.get("fixes") or []
    issues = scan.get("issues") or []
    id_by_title = {str(i.get("title")): str(i.get("id", "")) for i in issues}
    issue_id = id_by_title.get(issue_title)

    def take(f: dict[str, Any]) -> tuple[str, str, str]:
        return (
            str(f.get("title", "")),
            str(f.get("description", "")),
            str(f.get("code", "") or "") if not f.get("locked") else "",
        )

    for f in fixes:
        if issue_id and f.get("issueId") == issue_id:
            return take(f)
    if fixes:
        return take(fixes[0])
    return ("", "", "")


def score_category(score: int) -> str:
    if score < 40:
        return "Poor"
    if score <= 65:
        return "Average"
    return "Good"


def traffic_impact_blurb(score: int) -> str:
    if score < 40:
        return "Potential 10–15% AI-referred lift after core fixes"
    if score < 66:
        return "Potential 6–10% lift with targeted fixes"
    return "Potential 3–6% incremental polish"
