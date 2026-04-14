from __future__ import annotations

import httpx

from conduit_outreach_pipeline import config


def detect_stack(domain_or_url: str) -> str:
    """
    Returns: shopify | wordpress | unknown
    """
    config.load_env()
    url = domain_or_url if "://" in domain_or_url else f"https://{domain_or_url}"
    try:
        with httpx.Client(
            timeout=15.0,
            follow_redirects=True,
            headers={"User-Agent": config.http_user_agent()},
        ) as client:
            r = client.get(url)
            text = (r.text or "")[:500_000].lower()
    except Exception:
        return "unknown"

    if "cdn.shopify.com" in text or "shopify" in text and "shopify.theme" in text:
        return "shopify"
    if "wp-content" in text or "wordpress" in text or "/wp-json/" in text:
        return "wordpress"
    return "unknown"
