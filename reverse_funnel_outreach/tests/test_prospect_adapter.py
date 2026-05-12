from reverse_funnel_outreach.engine import EmailFinding
from reverse_funnel_outreach.prospect_adapter import finding_to_prospect_row, best_prospect_per_domain


def _f(score: int, email: str = "hello@acme.com") -> EmailFinding:
    return EmailFinding(
        domain="acme.com",
        email=email,
        source_url="https://acme.com/contact",
        source_type="httpx",
        source_kind="site_page",
        found_in="mailto",
        crawl_depth=0,
        confidence_score=score,
        confidence_label="high",
        reason_flags=[],
        resolved_company_domain="acme.com",
    )


def test_finding_to_prospect_row_shape():
    row = finding_to_prospect_row(_f(80))
    assert row["domain"] == "acme.com"
    assert row["receiver_email"] == "hello@acme.com"


def test_best_prospect_per_domain():
    out = best_prospect_per_domain([_f(10), _f(90)])
    assert len(out) == 1
    assert out[0].confidence_score == 90


def test_best_prospect_prefers_contact_fit_over_generic_support():
    # support should be down-ranked even with slightly higher confidence.
    out = best_prospect_per_domain(
        [
            _f(95, "support@acme.com"),
            _f(90, "hello@acme.com"),
        ]
    )
    assert len(out) == 1
    assert out[0].email == "hello@acme.com"


def test_best_prospect_prefers_name_like_email():
    out = best_prospect_per_domain(
        [
            _f(88, "info@acme.com"),
            _f(84, "jane.doe@acme.com"),
        ]
    )
    assert len(out) == 1
    assert out[0].email == "jane.doe@acme.com"


def test_best_prospect_never_allow_drops_disallowed_only_domain():
    out = best_prospect_per_domain([_f(90, "support@acme.com"), _f(92, "noreply@acme.com")])
    assert out == []
