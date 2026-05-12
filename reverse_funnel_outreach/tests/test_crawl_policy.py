from reverse_funnel_outreach.crawl_policy import can_fetch_url, fetch_robots_parser


def test_can_fetch_when_no_robots_not_strict():
    assert can_fetch_url(None, "https://example.com/", "TestBot", strict=False) is True


def test_fetch_robots_returns_tuple():
    rp, err = fetch_robots_parser("https://example.com", "TestBot", 5.0)
    assert err == "" or isinstance(err, str)
