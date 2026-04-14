from __future__ import annotations

from typing import Any
from urllib.parse import quote_plus

from jinja2 import Environment, BaseLoader, StrictUndefined

from reverse_funnel_outreach import config
from reverse_funnel_outreach.templates import ColdEmailVariant, parse_cold_email_variants


def build_context(
    *,
    domain: str,
    first_name: str,
    scan: dict[str, Any],
    top_issue: str,
    code_snippet: str,
    email_step: str = "A1",
) -> dict[str, Any]:
    score = int(scan.get("overallScore", 0))
    base = config.rescan_link_base()
    sep = "&" if "?" in base else "?"
    rescan = f"{base}{sep}url={quote_plus('https://' + domain.lstrip('/')) if not domain.startswith('http') else quote_plus(domain)}"
    ctx = {
        "score": score,
        "ai_visibility_score": score,
        "first_name": first_name or "there",
        "domain": domain,
        "top_issue": top_issue,
        "code_snippet": code_snippet or "(no snippet — see scan)",
        "rescan_link": rescan,
        "benchmark_link": config.benchmark_link(),
        "sender_name": config.get_str("SENDER_NAME", "Ben"),
    }
    return ctx


def render_variant(variant: ColdEmailVariant, context: dict[str, Any]) -> tuple[str, str]:
    env = Environment(loader=BaseLoader(), undefined=StrictUndefined, autoescape=False)
    subj = env.from_string(variant.subject_template).render(**context)
    body = env.from_string(variant.body_template).render(**context)
    return subj.strip(), body.strip()


def load_variants_file() -> list[ColdEmailVariant]:
    path = config.cold_email_variants_path()
    if not path.is_file():
        raise FileNotFoundError(f"Cold email variants not found: {path}")
    return parse_cold_email_variants(path)
