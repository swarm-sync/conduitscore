from reverse_funnel_outreach.score_v2 import AggregatedCandidate, score_candidate_v2
from reverse_funnel_outreach.source_resolver import ResolvedTarget, RedirectResolution
from reverse_funnel_outreach.verification import EmailVerification


def _target() -> ResolvedTarget:
    return ResolvedTarget(
        raw_input="acme.com",
        start_url="https://acme.com/",
        original_domain="acme.com",
        final_url="https://acme.com/",
        canonical_domain="acme.com",
        relationship="same",
        resolution=RedirectResolution(original_url="https://acme.com/", final_url="https://acme.com/"),
    )


def test_score_candidate_v2_high_for_good_match():
    candidate = AggregatedCandidate(
        email="hello@acme.com",
        source_url="https://acme.com/contact",
        source_kind="site_page",
        found_in="mailto",
        sighting_count=2,
        verification=EmailVerification(
            syntax_ok=True,
            mx_status="mx_valid",
            catch_all_status="unknown",
            verification_status="verified",
            deliverability_confidence=80,
            delivery_state="valid",
        ),
    )
    res = score_candidate_v2(candidate, _target())
    assert res.score >= 60
