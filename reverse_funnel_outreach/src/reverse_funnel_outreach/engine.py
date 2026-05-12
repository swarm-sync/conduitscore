"""
Domain-first prospecting engine — crawl, OSINT, optional browser + pattern inference, score v2.
"""
from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass, field
from pathlib import Path

import httpx

from reverse_funnel_outreach import config
from reverse_funnel_outreach.browser_policy import harvest_js_fallback, should_use_browser_fallback
from reverse_funnel_outreach.content_extract import extract_all_from_html
from reverse_funnel_outreach.crawl_policy import can_fetch_url, init_policy_for_domain
from reverse_funnel_outreach.input_normalizer import root_domain, strip_www
from reverse_funnel_outreach.link_discovery import extract_internal_links, url_contact_priority
from reverse_funnel_outreach.osint_sources import run_passive_osint
from reverse_funnel_outreach.pattern_inference import generate_inferred_candidates
from reverse_funnel_outreach.score_v2 import AggregatedCandidate, score_candidate_v2
from reverse_funnel_outreach.scoring_bands import confidence_band
from reverse_funnel_outreach.source_resolver import resolve_start_target
from reverse_funnel_outreach.verification import verify_candidate

# Sighting row: url, found_in, depth, source_type, context, source_kind, finding_type
Sighting = tuple[str, str, int, str, str, str, str]


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------


@dataclass
class EmailFinding:
    domain: str
    email: str
    source_url: str
    source_type: str
    found_in: str
    crawl_depth: int
    confidence_score: int
    confidence_label: str
    reason_flags: list[str]
    source_kind: str = "site_page"
    context: str = ""
    sighting_count: int = 1
    run_id: str = ""
    finding_type: str = "observed"
    verification_status: str = "unknown"
    deliverability_confidence: int = 0
    resolved_company_domain: str = ""
    identity_confidence: int = 0
    delivery_state: str = "unknown"
    confidence_band: str = "tier_d"

    all_source_urls: list[str] = field(default_factory=list)


@dataclass
class DomainResult:
    domain: str
    findings: list[EmailFinding] = field(default_factory=list)
    pages_crawled: int = 0
    errors: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _fetch_httpx(url: str, ua: str, timeout: float) -> tuple[str | None, int | None]:
    try:
        with httpx.Client(
            headers={"User-Agent": ua},
            timeout=timeout,
            follow_redirects=True,
        ) as client:
            resp = client.get(url)
            return resp.text, resp.status_code
    except Exception:
        return None, None


def _content_hash(html: str) -> str:
    return hashlib.md5(html.encode("utf-8", errors="replace")).hexdigest()[:16]


# ---------------------------------------------------------------------------
# Main per-domain function
# ---------------------------------------------------------------------------


def run_domain(
    raw_input: str,
    *,
    max_depth: int = 1,
    page_limit: int = 25,
    run_id: str = "",
    db_conn=None,
    politeness_delay: float = 0.5,
    verbose: bool = False,
) -> DomainResult:
    config.load_env()
    ua = config.user_agent()
    timeout = float(config.get_int("REQUEST_TIMEOUT_SECONDS", 30))
    respect_robots = config.get_bool("RESPECT_ROBOTS", True)
    max_seconds = float(config.get_int("MAX_SECONDS_PER_DOMAIN", 120))
    robots_strict = config.get_bool("ROBOTS_STRICT", False)

    resolved_target = resolve_start_target(raw_input, timeout=timeout, ua=ua)
    start_url = resolved_target.final_url
    rd = root_domain(start_url)

    result = DomainResult(domain=resolved_target.canonical_domain or strip_www(rd))

    policy = init_policy_for_domain(
        start_url,
        ua,
        timeout,
        respect_robots=respect_robots,
        max_seconds_per_domain=max_seconds,
    )

    sightings: dict[str, list[Sighting]] = {}
    html_samples: list[str] = []
    queue: list[tuple[str, int]] = [(start_url, 0)]
    visited: set[str] = set()

    rp = policy.robots

    while queue and result.pages_crawled < page_limit:
        if policy.time_exceeded():
            result.errors.append("policy:time_budget_exceeded")
            break

        queue.sort(key=lambda t: (-url_contact_priority(t[0]), t[1]))
        url, depth = queue.pop(0)

        if url in visited:
            continue
        visited.add(url)

        if not can_fetch_url(rp, url, ua, strict=robots_strict):
            policy.skipped_robots.append(url)
            result.errors.append(f"robots_disallow:{url}")
            continue

        if verbose:
            print(f"  [{depth}] {url}")

        html, status = _fetch_httpx(url, ua, timeout)
        if not html:
            result.errors.append(f"fetch_failed:{url}")
            continue

        result.pages_crawled += 1
        if len(html_samples) < 5:
            html_samples.append(html[:400_000])

        if db_conn and run_id:
            from reverse_funnel_outreach.store import save_page

            save_page(
                db_conn,
                run_id=run_id,
                root_domain=result.domain,
                url=url,
                depth=depth,
                source_type="httpx",
                status_code=status,
                content_hash=_content_hash(html),
                resolved_domain=resolved_target.canonical_domain,
                relationship_type=resolved_target.relationship,
                final_url=resolved_target.final_url,
            )

        hits: list[RawEmailHit] = extract_all_from_html(html, url)
        for hit in hits:
            sightings.setdefault(hit.email, []).append(
                (url, hit.found_in, depth, "httpx", hit.context, "site_page", "observed")
            )

        if depth < max_depth:
            new_links = extract_internal_links(html, url, rd)
            for link in new_links:
                if link not in visited:
                    queue.append((link, depth + 1))

        if politeness_delay > 0:
            time.sleep(politeness_delay)

    if should_use_browser_fallback(sightings, result.pages_crawled, page_limit=page_limit):
        try:
            emails, src = harvest_js_fallback(start_url)
            for em in emails:
                sightings.setdefault(em, []).append(
                    (start_url, "browser_js", 0, src, src, "browser_fallback", "observed")
                )
        except Exception as e:
            result.errors.append(f"browser_fallback:{e!s}")

    for osh in run_passive_osint(result.domain, resolved_target.canonical_domain, limit=config.osint_limit()):
        sightings.setdefault(osh.email, []).append(
            (osh.source_url, osh.discovery_method, 0, "osint", osh.context, osh.source_kind, "observed")
        )

    observed_keys = list(sightings.keys())
    for ic in generate_inferred_candidates(
        resolved_target.canonical_domain or result.domain,
        observed_keys,
        html_samples,
    ):
        sightings.setdefault(ic.email, []).append(
            (
                start_url,
                ic.reason,
                0,
                "inferred",
                ic.reason,
                "pattern_inferred",
                "inferred",
            )
        )

    for email, email_sightings in sightings.items():
        ver = verify_candidate(email, result.domain)
        best_score = -1
        best_label = "reject"
        best_flags: list[str] = []
        best_url = email_sightings[0][0]
        best_found_in = email_sightings[0][1]
        best_depth = email_sightings[0][2]
        best_source_type = email_sightings[0][3]
        best_ctx = email_sightings[0][4]
        best_source_kind = email_sightings[0][5]
        best_finding_type = email_sightings[0][6]
        best_identity = 0

        count = len(email_sightings)
        for s_url, s_found_in, s_depth, s_type, s_ctx, s_kind, ftype in email_sightings:
            res = score_candidate_v2(
                AggregatedCandidate(
                    email=email,
                    source_url=s_url,
                    source_kind=s_kind,
                    found_in=s_found_in,
                    sighting_count=count,
                    verification=ver,
                    finding_type=ftype,
                ),
                resolved_target=resolved_target,
            )
            if res.score > best_score:
                best_score, best_label, best_flags = res.score, res.label, res.flags
                best_url, best_found_in = s_url, s_found_in
                best_depth, best_source_type, best_ctx = s_depth, s_type, s_ctx
                best_source_kind = s_kind
                best_finding_type = ftype
                best_identity = res.identity_confidence

        band = confidence_band(best_score, ver, finding_type=best_finding_type)
        flags_with_band = list(best_flags)
        flags_with_band.append(f"band:{band}")

        if db_conn and run_id:
            from reverse_funnel_outreach.store import save_finding, upsert_canonical

            save_finding(
                db_conn,
                run_id=run_id,
                root_domain=result.domain,
                source_url=best_url,
                email=email,
                found_in=best_found_in,
                source_type=best_source_type,
                context=best_ctx,
                confidence_score=best_score,
                confidence_label=best_label,
                flags=flags_with_band,
                source_kind=best_source_kind,
                verification_status=ver.verification_status,
                deliverability_confidence=ver.deliverability_confidence,
                reason_flags_v2=flags_with_band,
                resolved_company_domain=resolved_target.canonical_domain,
                identity_confidence=best_identity,
                finding_type=best_finding_type,
                delivery_state=getattr(ver, "delivery_state", "unknown"),
                confidence_band=band,
            )
            upsert_canonical(
                db_conn,
                root_domain=result.domain,
                email=email,
                source_url=best_url,
                confidence_score=best_score,
                recommended=best_label not in ("low", "reject") and band not in ("tier_d",),
                source_kind=best_source_kind,
                verification_status=ver.verification_status,
                deliverability_confidence=ver.deliverability_confidence,
                resolved_company_domain=resolved_target.canonical_domain,
                identity_confidence=best_identity,
                finding_type=best_finding_type,
                delivery_state=getattr(ver, "delivery_state", "unknown"),
                confidence_band=band,
            )

        result.findings.append(
            EmailFinding(
                domain=result.domain,
                email=email,
                source_url=best_url,
                source_type=best_source_type,
                source_kind=best_source_kind,
                found_in=best_found_in,
                crawl_depth=best_depth,
                confidence_score=best_score,
                confidence_label=best_label,
                reason_flags=flags_with_band,
                context=best_ctx,
                sighting_count=count,
                run_id=run_id,
                all_source_urls=list({s[0] for s in email_sightings}),
                verification_status=ver.verification_status,
                deliverability_confidence=ver.deliverability_confidence,
                resolved_company_domain=resolved_target.canonical_domain,
                identity_confidence=best_identity,
                finding_type=best_finding_type,
                delivery_state=getattr(ver, "delivery_state", "unknown"),
                confidence_band=band,
            )
        )

    result.findings.sort(key=lambda f: -f.confidence_score)
    return result


def run_batch(
    domains: list[str],
    *,
    max_depth: int = 1,
    page_limit: int = 25,
    db_path: Path | str | None = None,
    verbose: bool = False,
    on_domain_done=None,
) -> list[EmailFinding]:
    from reverse_funnel_outreach.store import open_db, create_run, finish_run

    conn = None
    run_id = ""
    if db_path:
        conn = open_db(db_path)
        run_id = create_run(
            conn,
            input_count=len(domains),
            engine_version="v2.1",
            settings_json=json.dumps({"max_depth": max_depth, "page_limit": page_limit}),
        )

    all_findings: list[EmailFinding] = []

    for raw in domains:
        dr = run_domain(
            raw,
            max_depth=max_depth,
            page_limit=page_limit,
            run_id=run_id,
            db_conn=conn,
            verbose=verbose,
        )
        all_findings.extend(dr.findings)
        if on_domain_done:
            on_domain_done(dr)

    if conn and run_id:
        finish_run(conn, run_id)
        conn.close()

    return all_findings
