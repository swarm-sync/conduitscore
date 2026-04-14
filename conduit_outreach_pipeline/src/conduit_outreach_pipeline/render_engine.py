from __future__ import annotations

import html
import re
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

from conduit_outreach_pipeline import config
from conduit_outreach_pipeline.classify import benchmark_for_sequence
from conduit_outreach_pipeline.conduit_cached import score_category, traffic_impact_blurb
from conduit_outreach_pipeline.links import build_tracking_links


def _html_to_plain(html_str: str) -> str:
    t = re.sub(r"(?is)<script.*?>.*?</script>", "", html_str)
    t = re.sub(r"(?is)<style.*?>.*?</style>", "", t)
    t = re.sub(r"(?i)<br\s*/?>", "\n", t)
    t = re.sub(r"(?i)</p>", "\n\n", t)
    t = re.sub(r"<[^>]+>", "", t)
    return html.unescape(re.sub(r"\n{3,}", "\n\n", t)).strip()


# Subject lines — Jinja2 format strings (kept short)
SUBJECTS: dict[str, dict[int, str]] = {
    "A": {
        1: "{{ company_name or domain }} — AI visibility scored {{ ai_visibility_score }}/100",
        2: "Fix for your top AI visibility issue ({{ domain }})",
        3: "{{ ai_visibility_score }}/100 vs industry avg — quick read",
        4: "AI search is a real traffic slice now",
        5: "Last note — re-scan anytime ({{ domain }})",
    },
    "B": {
        1: "{{ company_name or domain }} — client sites & AI visibility",
        2: "Agency playbook: top AI visibility fix",
        3: "Benchmark: {{ ai_visibility_score }}/100 vs agencies",
        4: "Worth a quarterly AI visibility check for retainers",
        5: "Closing the loop — no pressure",
    },
    "C": {
        1: "{{ company_name or domain }} — storefront AI visibility",
        2: "One fix that helps AI pick up your catalog",
        3: "Your score vs typical ecom sites",
        4: "AI shopping answers are growing",
        5: "Final ping — re-scan when you can",
    },
}


def build_context(
    *,
    scan: dict[str, Any],
    domain: str,
    company_name: str,
    first_name: str,
    sequence_type: str,
    top_issue: str,
    issue_description: str,
    recommended_fix_short: str,
    code_snippet: str,
    industry_vertical: str,
    icp_tag: str,
    last_rescan_score: str,
    notes: str,
    scrape_source: str,
    batch_group: str,
    send_priority: str,
    dynamic_fields_json: str,
) -> dict[str, Any]:
    score = int(scan.get("overallScore", 0))
    scan_id = str(scan.get("id") or "")
    avg, label = benchmark_for_sequence(sequence_type)
    gap = avg - score
    rescan_link, verify_link = build_tracking_links(domain, scan_id or None)

    greeting = (first_name or "").strip() or "there"
    return {
        "first_name": first_name,
        "greeting_name": greeting,
        "company_name": company_name,
        "domain": domain,
        "ai_visibility_score": score,
        "score": score,
        "top_issue": top_issue,
        "issue_description": issue_description or "",
        "recommended_fix": recommended_fix_short,
        "code_snippet": code_snippet,
        "score_category": score_category(score),
        "sequence_type": sequence_type,
        "industry_vertical": industry_vertical,
        "icp_tag": icp_tag,
        "industry_avg": avg,
        "benchmark_label": label,
        "score_gap": gap,
        "benchmark_note": f"Industry avg (~{label}): {avg}/100 — you're about {gap:+d} vs that rough benchmark.",
        "rescan_link": rescan_link,
        "verify_link": verify_link,
        "sender_name": config.get_str("SENDER_NAME", "Ben"),
        "sender_email": config.get_str("SENDER_EMAIL", ""),
        "estimated_ai_traffic_impact": traffic_impact_blurb(score),
        "last_rescan_score": last_rescan_score,
        "notes": notes,
        "scrape_source": scrape_source,
        "batch_group": batch_group,
        "send_priority": send_priority,
        "dynamic_fields_json": dynamic_fields_json,
        "template_version": config.template_version(),
    }


def _jinja_env() -> Environment:
    root = config.template_root()
    return Environment(
        loader=FileSystemLoader(str(root)),
        autoescape=select_autoescape(["html", "xml"]),
    )


def render_subject(sequence: str, step: int, ctx: dict[str, Any]) -> str:
    raw = SUBJECTS.get(sequence, SUBJECTS["A"]).get(step, SUBJECTS["A"][1])
    return _jinja_env().from_string(raw).render(**ctx).strip()


def render_bodies(sequence: str, step: int, ctx: dict[str, Any]) -> tuple[str, str]:
    tpl = _jinja_env().get_template(f"sequences/{sequence}/{step}.html.j2")
    html_out = tpl.render(**ctx)
    return html_out.strip(), _html_to_plain(html_out)
