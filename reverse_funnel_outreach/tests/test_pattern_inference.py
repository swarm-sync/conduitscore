from reverse_funnel_outreach.pattern_inference import (
    generate_inferred_candidates,
    role_email_candidates,
)


def test_role_candidates_not_duplicate():
    c = role_email_candidates("acme.com", {"hello@acme.com"})
    locals_ = {x.email.split("@")[0] for x in c}
    assert "contact" in locals_


def test_generate_inferred_with_observed():
    html = '<script type="application/ld+json">{"@type":"Person","name":"Jane Doe"}</script>'
    out = generate_inferred_candidates(
        "acme.com",
        ["support@acme.com"],
        [html],
    )
    emails = {x.email for x in out}
    assert any("jane" in e and "acme.com" in e for e in emails)
