from app.scanner.analyzers import analyze_all
from app.types import ConduitScanData


def build_data():
    return ConduitScanData(
        url="https://example.com",
        nav={},
        main_content={"text": "hello " * 200, "links_found": 9, "content_hash": "abc"},
        js_delta={"js_dependency_ratio": 0.45, "static_hash": "one", "rendered_hash": "two"},
        accessibility={"headings": ["Hero", "Why", "Pricing", "FAQ"]},
        structured_data={"jsonld": [{"@type": "Organization"}, {"@type": "FAQPage"}]},
        robots={"robots_txt": "User-agent: GPTBot\nAllow: /", "llms_txt": "Allowed"},
        network={"count": 2, "error_count": 0},
        console={"count": 0},
    )


def test_analyze_all_returns_seven_categories():
    categories = analyze_all(build_data())
    assert len(categories) == 7


def test_technical_health_penalizes_high_js_dependency():
    data = build_data()
    data.js_delta["js_dependency_ratio"] = 0.9
    technical = analyze_all(data)[4]
    assert technical.score < technical.max_score
