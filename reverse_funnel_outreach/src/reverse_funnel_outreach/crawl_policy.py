"""
Per-domain crawl policy: robots.txt awareness, time/page budgets, decision logging.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx


@dataclass
class CrawlPolicyState:
    """Tracks budgets and robots for one domain run."""

    robots: RobotFileParser | None = None
    robots_fetched: bool = False
    robots_error: str = ""
    skipped_robots: list[str] = field(default_factory=list)
    domain_started_at: float = field(default_factory=time.monotonic)
    max_seconds: float = 120.0
    log: list[str] = field(default_factory=list)

    def time_exceeded(self) -> bool:
        return (time.monotonic() - self.domain_started_at) >= self.max_seconds

    def note(self, msg: str) -> None:
        self.log.append(msg)


def fetch_robots_parser(base_url: str, ua: str, timeout: float) -> tuple[RobotFileParser | None, str]:
    """
    Fetch https://host/robots.txt and parse. Returns (parser, error_message).
    On failure, returns (None, reason) — caller may allow-all if not strict.
    """
    try:
        p = urlparse(base_url if base_url.startswith("http") else f"https://{base_url}")
        host = p.netloc or p.path.split("/")[0]
        scheme = p.scheme or "https"
        robots_url = f"{scheme}://{host}/robots.txt"
        with httpx.Client(
            headers={"User-Agent": ua},
            timeout=timeout,
            follow_redirects=True,
        ) as client:
            r = client.get(robots_url)
            if r.status_code == 404:
                rp = RobotFileParser()
                rp.parse([])  # empty = allow all in stdlib behavior
                return rp, ""
            r.raise_for_status()
            lines = r.text.splitlines()
        rp = RobotFileParser()
        rp.parse(lines)
        return rp, ""
    except Exception as exc:
        return None, str(exc)[:200]


def can_fetch_url(
    rp: RobotFileParser | None,
    url: str,
    ua: str,
    *,
    strict: bool = False,
) -> bool:
    """
    If rp is None: allow when not strict; deny when strict (could not load robots).
    If rp loaded: use can_fetch(user_agent, url).
    """
    if rp is None:
        return not strict
    try:
        return rp.can_fetch(ua or "*", url)
    except Exception:
        return True


def init_policy_for_domain(
    start_url: str,
    ua: str,
    timeout: float,
    *,
    respect_robots: bool,
    max_seconds_per_domain: float,
) -> CrawlPolicyState:
    state = CrawlPolicyState(max_seconds=max_seconds_per_domain)
    if not respect_robots:
        state.note("robots_disabled_by_config")
        return state
    rp, err = fetch_robots_parser(start_url, ua, timeout)
    state.robots_fetched = True
    if rp is not None and not err:
        state.robots = rp
        state.note("robots_loaded_ok")
    else:
        state.robots_error = err or "empty"
        state.note(f"robots_fetch_failed:{state.robots_error}")
        # Permissive: allow crawl when robots unavailable (common)
        state.robots = None
    return state
