from reverse_funnel_outreach.osint_sources import search_query_variants, extract_emails_from_search_snippets


def test_query_variants_include_domain():
    q = search_query_variants("acme.com")
    assert any("acme.com" in x for x in q)


def test_extract_emails_from_snippet():
    text = "Contact us at hello@acme.com for support."
    hits = extract_emails_from_search_snippets(text, "https://example.org", "acme.com")
    assert hits
    assert hits[0].email == "hello@acme.com"
