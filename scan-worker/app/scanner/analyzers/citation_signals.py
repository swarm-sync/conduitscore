from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_citation_signals(data: ConduitScanData):
    links_found = int((data.main_content or {}).get("links_found", 0))
    score = 15 if links_found >= 8 else 11
    return build_category(
        "Citation Signals",
        15,
        score,
        "Increase authoritative references",
        "AI systems trust pages with clear sourcing, attribution, and outbound references.",
    )
