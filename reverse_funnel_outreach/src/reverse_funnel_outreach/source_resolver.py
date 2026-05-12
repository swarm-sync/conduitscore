from __future__ import annotations

from dataclasses import dataclass, field
from urllib.parse import urlparse

import httpx

from reverse_funnel_outreach.input_normalizer import normalize_url, strip_www


@dataclass
class RedirectHop:
    status_code: int
    url: str


@dataclass
class RedirectResolution:
    original_url: str
    final_url: str
    hops: list[RedirectHop] = field(default_factory=list)
    error: str = ""


@dataclass
class ResolvedTarget:
    raw_input: str
    start_url: str
    original_domain: str
    final_url: str
    canonical_domain: str
    relationship: str
    resolution: RedirectResolution


def _domain_from_url(url: str) -> str:
    host = urlparse(url).netloc.lower().split(":")[0]
    return strip_www(host)


def classify_domain_relationship(original_domain: str, final_domain: str) -> str:
    if not final_domain:
        return "dead"
    if original_domain == final_domain:
        return "same"
    if original_domain.endswith("." + final_domain) or final_domain.endswith("." + original_domain):
        return "redirect"
    o_parts = original_domain.split(".")
    f_parts = final_domain.split(".")
    if len(o_parts) >= 2 and len(f_parts) >= 2 and ".".join(o_parts[-2:]) == ".".join(f_parts[-2:]):
        return "subsidiary"
    return "possible_acquisition"


def canonical_company_domain(resolved_url: str, original_domain: str) -> str:
    final_domain = _domain_from_url(resolved_url)
    return final_domain or strip_www(original_domain)


def resolve_redirect_chain(url: str, timeout: float, ua: str) -> RedirectResolution:
    try:
        with httpx.Client(
            headers={"User-Agent": ua},
            timeout=timeout,
            follow_redirects=True,
        ) as client:
            resp = client.get(url)
            hops = [RedirectHop(status_code=r.status_code, url=str(r.url)) for r in resp.history]
            return RedirectResolution(
                original_url=url,
                final_url=str(resp.url),
                hops=hops,
            )
    except Exception as exc:
        return RedirectResolution(original_url=url, final_url=url, error=str(exc))


def resolve_start_target(raw_input: str, timeout: float = 20.0, ua: str = "ReverseFunnelOutreach/0.1") -> ResolvedTarget:
    start_url = normalize_url(raw_input)
    original_domain = _domain_from_url(start_url)
    resolution = resolve_redirect_chain(start_url, timeout=timeout, ua=ua)
    canonical_domain = canonical_company_domain(resolution.final_url, original_domain)
    relationship = classify_domain_relationship(original_domain, canonical_domain)
    return ResolvedTarget(
        raw_input=raw_input,
        start_url=start_url,
        original_domain=original_domain,
        final_url=resolution.final_url,
        canonical_domain=canonical_domain,
        relationship=relationship,
        resolution=resolution,
    )
