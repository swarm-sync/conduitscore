from __future__ import annotations

import hashlib
import json
import secrets

from conduit_outreach_pipeline import config, db
from conduit_outreach_pipeline.classify import classify_sequence
from conduit_outreach_pipeline.conduit_cached import (
    pick_top_fix,
    pick_top_issue,
    scan_domain_cached,
    score_category,
)
from conduit_outreach_pipeline.render_engine import build_context, render_bodies, render_subject
from conduit_outreach_pipeline.sheet_schema import SHEET_COLUMNS
from conduit_outreach_pipeline.snippets import select_dynamic_snippet
from conduit_outreach_pipeline.stack_detect import detect_stack


def _short(s: str, n: int) -> str:
    s = (s or "").strip()
    return s if len(s) <= n else s[: n - 1] + "…"


def build_sheet_rows_for_prospect(
    *,
    domain: str,
    receiver_email: str,
    first_name: str,
    company_name: str,
    industry_vertical: str = "",
    icp_tag: str = "",
    sequence_override: str = "",
    notes: str = "",
    scrape_source: str = "csv",
    batch_group: str = "",
    send_priority: str = "1",
    last_rescan_score: str = "",
    force_refresh_scan: bool = False,
    steps: tuple[int, ...] = (1, 2, 3, 4, 5),
) -> list[dict[str, str]]:
    scan = scan_domain_cached(domain, force_refresh=force_refresh_scan)
    top_title, top_desc = pick_top_issue(scan)
    fix_title, fix_desc, fix_code = pick_top_fix(scan, top_title)
    seq = classify_sequence(
        company_name or domain,
        icp_tag=icp_tag,
        industry_vertical=industry_vertical,
        manual_override=sequence_override,
    )
    stack = detect_stack(domain)
    snippet = select_dynamic_snippet(top_title, stack, fix_code)
    score = int(scan.get("overallScore", 0))

    dyn = {
        "scan_id": scan.get("id"),
        "categories": scan.get("categories"),
        "metadata": scan.get("metadata"),
        "stack_guess": stack,
    }
    dyn_json = json.dumps(dyn, default=str)[:50_000]

    ctx_base = build_context(
        scan=scan,
        domain=domain.split("//")[-1].split("/")[0].split(":")[0],
        company_name=company_name,
        first_name=first_name,
        sequence_type=seq,
        top_issue=top_title,
        issue_description=top_desc,
        recommended_fix_short=_short(fix_desc or fix_title, 400),
        code_snippet=snippet,
        industry_vertical=industry_vertical,
        icp_tag=icp_tag,
        last_rescan_score=last_rescan_score,
        notes=notes,
        scrape_source=scrape_source,
        batch_group=batch_group,
        send_priority=send_priority,
        dynamic_fields_json=dyn_json,
    )

    rows: list[dict[str, str]] = []
    dom_key = ctx_base["domain"]
    for step in steps:
        ctx = {**ctx_base, "email_step": step}
        subj = render_subject(seq, step, ctx)
        html, text = render_bodies(seq, step, ctx)
        preview = _short(text.replace("\n", " "), 500)
        token = secrets.token_urlsafe(24)
        db.unsub_store(token, receiver_email.lower(), dom_key)

        row = {col: "" for col in SHEET_COLUMNS}
        row.update(
            {
                "receiver_email": receiver_email,
                "first_name": first_name,
                "company_name": company_name,
                "domain": dom_key,
                "ai_visibility_score": str(score),
                "top_issue": top_title,
                "issue_description": top_desc,
                "recommended_fix": _short(fix_desc or fix_title, 500),
                "code_snippet": snippet,
                "score_category": score_category(score),
                "sequence_type": seq,
                "email_step": str(step),
                "subject": subj,
                "body_html": html,
                "body_text": text,
                "sender_name": ctx_base["sender_name"],
                "sender_email": ctx_base["sender_email"],
                "rescan_link": ctx_base["rescan_link"],
                "verify_link": ctx_base["verify_link"],
                "benchmark_note": ctx_base["benchmark_note"],
                "status": "pending",
                "sent_timestamp": "",
                "unsubscribe_token": token,
                "scrape_source": scrape_source,
                "notes": notes,
                "industry_vertical": industry_vertical,
                "icp_tag": icp_tag,
                "estimated_ai_traffic_impact": ctx_base["estimated_ai_traffic_impact"],
                "last_rescan_score": last_rescan_score,
                "dynamic_fields_json": dyn_json,
                "rendered_email_preview": preview,
                "send_priority": send_priority,
                "batch_group": batch_group,
                "template_version": config.template_version(),
            }
        )
        rows.append(row)
    return rows


def dedupe_key_row(row: dict[str, str]) -> str:
    raw = "|".join(
        [
            row.get("receiver_email", ""),
            row.get("domain", ""),
            row.get("email_step", ""),
            row.get("template_version", ""),
        ]
    )
    return hashlib.sha256(raw.encode()).hexdigest()[:32]
