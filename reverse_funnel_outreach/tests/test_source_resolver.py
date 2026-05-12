from reverse_funnel_outreach.source_resolver import classify_domain_relationship, canonical_company_domain


def test_classify_same():
    assert classify_domain_relationship("acme.com", "acme.com") == "same"


def test_classify_redirect_related():
    assert classify_domain_relationship("www.acme.com", "acme.com") in ("redirect", "subsidiary")


def test_canonical_uses_final_domain():
    assert canonical_company_domain("https://www.acme.com/contact", "old.com") == "acme.com"
