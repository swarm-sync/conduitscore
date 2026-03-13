from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_crawler_access(data: ConduitScanData):
    robots_txt = (data.robots or {}).get("robots_txt") or ""
    score = 15 if "GPTBot" in robots_txt or "ClaudeBot" in robots_txt else 9
    return build_category(
        "Crawler Access",
        15,
        score,
        "Add AI crawler directives to robots.txt",
        "Robots rules should explicitly communicate how AI crawlers may access your site.",
    )
