from __future__ import annotations

from dataclasses import dataclass, field

from reverse_funnel_outreach.source_resolver import ResolvedTarget
from reverse_funnel_outreach.verification import EmailVerification


@dataclass
class AggregatedCandidate:
    email: str
    source_url: str
    source_kind: str
    found_in: str
    sighting_count: int
    verification: EmailVerification | None = None
    finding_type: str = "observed"


@dataclass
class ScoreResult:
    score: int
    label: str
    flags: list[str] = field(default_factory=list)
    identity_confidence: int = 0


def score_source_trust(source_kind: str, source_url: str) -> tuple[int, list[str]]:
    base = 10
    flags: list[str] = []
    if source_kind in ("httpx", "site_page"):
        base += 18
        flags.append("site_source")
    if source_kind in ("search_snippet", "archive"):
        base += 8
        flags.append("osint_source")
    if "/contact" in source_url.lower():
        base += 8
        flags.append("contact_page")
    return base, flags


def score_mailbox_usefulness(local_part: str) -> tuple[int, list[str]]:
    lp = local_part.lower()
    if lp.startswith(("hello", "contact", "team", "sales", "support", "founder")):
        return 15, ["useful_mailbox"]
    if lp in ("info", "admin"):
        return 8, ["generic_mailbox"]
    return 5, ["untyped_mailbox"]


def score_verification(verification: EmailVerification | None) -> tuple[int, list[str]]:
    if not verification:
        return 0, ["unverified"]
    base = verification.deliverability_confidence // 2
    flags = [verification.verification_status]
    ds = getattr(verification, "delivery_state", None) or "unknown"
    if ds == "risky":
        base = max(0, base - 18)
        flags.append("delivery_risky")
    elif ds == "invalid":
        base = max(0, base - 35)
        flags.append("delivery_invalid")
    elif ds == "unknown":
        base = max(0, base - 8)
        flags.append("delivery_unknown")
    return base, flags


def score_candidate_v2(candidate: AggregatedCandidate, resolved_target: ResolvedTarget) -> ScoreResult:
    score = 0
    flags: list[str] = []
    local = candidate.email.split("@", 1)[0] if "@" in candidate.email else ""
    email_domain = candidate.email.split("@", 1)[1] if "@" in candidate.email else ""

    if candidate.finding_type == "inferred":
        score -= 22
        flags.append("inferred_candidate")

    st, sf = score_source_trust(candidate.source_kind, candidate.source_url)
    score += st
    flags.extend(sf)

    um, uf = score_mailbox_usefulness(local)
    score += um
    flags.extend(uf)

    if email_domain == resolved_target.canonical_domain:
        score += 25
        flags.append("domain_match_exact")
        identity = 90
    elif email_domain.endswith("." + resolved_target.canonical_domain) or resolved_target.canonical_domain.endswith("." + email_domain):
        score += 18
        flags.append("domain_match_related")
        identity = 75
    else:
        identity = 40
        flags.append("domain_mismatch")

    score += min(20, candidate.sighting_count * 4)
    flags.append(f"sightings_{candidate.sighting_count}")

    vs, vf = score_verification(candidate.verification)
    score += vs
    flags.extend(vf)

    score = max(0, min(100, score))
    label = "high" if score >= 75 else ("medium" if score >= 50 else ("low" if score >= 25 else "reject"))
    return ScoreResult(score=score, label=label, flags=flags, identity_confidence=identity)
