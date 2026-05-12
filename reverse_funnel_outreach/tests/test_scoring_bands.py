from reverse_funnel_outreach.scoring_bands import confidence_band
from reverse_funnel_outreach.verification import EmailVerification


def test_band_invalid_is_tier_d():
    v = EmailVerification(
        syntax_ok=False,
        mx_status="mx_missing",
        catch_all_status="unknown",
        verification_status="invalid",
        deliverability_confidence=0,
        delivery_state="invalid",
    )
    assert confidence_band(99, v) == "tier_d"


def test_band_valid_high_score_tier_a():
    v = EmailVerification(
        syntax_ok=True,
        mx_status="mx_valid",
        catch_all_status="unknown",
        verification_status="verified",
        deliverability_confidence=90,
        delivery_state="valid",
    )
    assert confidence_band(96, v, finding_type="observed") == "tier_a"
