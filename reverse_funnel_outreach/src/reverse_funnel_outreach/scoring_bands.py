"""
Map numeric confidence + verification delivery state into outreach cohort bands.
"""
from __future__ import annotations

from reverse_funnel_outreach.verification import EmailVerification


def confidence_band(
    score: int,
    verification: EmailVerification | None,
    *,
    finding_type: str = "observed",
) -> str:
    """
    Cohort tiers for filtering exports and outreach:
      tier_a — strongest (primary sends)
      tier_b — good (review or lower priority)
      tier_c — weak / test volume only
      tier_d — do not auto-send
    """
    ds = getattr(verification, "delivery_state", None) if verification else "unknown"
    if ds is None:
        ds = "unknown"

    if ds == "invalid":
        return "tier_d"
    if finding_type == "inferred":
        if score >= 72 and ds == "valid":
            return "tier_c"
        return "tier_d" if score < 45 else "tier_c"

    if ds == "risky":
        if score >= 85:
            return "tier_b"
        return "tier_c" if score >= 55 else "tier_d"

    if ds == "unknown":
        if score >= 88:
            return "tier_b"
        if score >= 70:
            return "tier_c"
        return "tier_d"

    # valid
    if score >= 95:
        return "tier_a"
    if score >= 80:
        return "tier_b"
    if score >= 60:
        return "tier_c"
    return "tier_d"


def band_description(band: str) -> str:
    return {
        "tier_a": "primary_outreach",
        "tier_b": "review_or_secondary",
        "tier_c": "risky_test_cohort",
        "tier_d": "suppress_or_manual_only",
    }.get(band, "unknown")
