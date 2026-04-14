from __future__ import annotations

import time
from typing import Any

import httpx

from reverse_funnel_outreach import config


def scan_domain(url: str) -> dict[str, Any]:
    """
    POST /api/scan with ConduitScore API key (Agency tier).
    Returns JSON including overallScore, issues, fixes, id, metadata.
    """
    config.load_env()
    base = config.conduit_base_url()
    key = config.conduit_api_key()
    if not key:
        raise RuntimeError("CONDUITSCORE_API_KEY is not set in .env")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": config.user_agent(),
        "x-api-key": key,
    }
    rlm = config.get_int("RATE_LIMIT_PER_MINUTE", 20)
    if rlm > 0:
        time.sleep(60.0 / max(rlm, 1))

    with httpx.Client(timeout=120.0) as client:
        r = client.post(f"{base}/api/scan", headers=headers, json={"url": url})
        r.raise_for_status()
        return r.json()


def pick_top_issue(scan: dict[str, Any]) -> tuple[str, str]:
    """(title, description) for highest-severity issue."""
    issues: list[dict[str, Any]] = scan.get("issues") or []
    if not issues:
        return ("No issues returned", "")
    order = {"critical": 0, "warning": 1, "info": 2}

    def key(i: dict[str, Any]) -> tuple[int, str]:
        sev = str(i.get("severity", "info")).lower()
        return (order.get(sev, 3), i.get("title", ""))

    top = min(issues, key=key)
    return (str(top.get("title", "")), str(top.get("description", "")))


def pick_top_fix_code(scan: dict[str, Any], issue_title: str) -> str:
    fixes: list[dict[str, Any]] = scan.get("fixes") or []
    if not fixes:
        return ""
    # Match first fix whose title/issue aligns (or first unlocked with code)
    issues = scan.get("issues") or []
    id_by_title = {str(i.get("title")): str(i.get("id", "")) for i in issues}
    issue_id = id_by_title.get(issue_title)
    for f in fixes:
        if issue_id and f.get("issueId") == issue_id:
            code = str(f.get("code") or "")
            if code and not f.get("locked"):
                return code
    for f in fixes:
        code = str(f.get("code") or "")
        if code and not f.get("locked"):
            return code[:2000]
    return ""
