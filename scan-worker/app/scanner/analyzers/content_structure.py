from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_content_structure(data: ConduitScanData):
    headings = (data.accessibility or {}).get("headings", [])
    score = 15 if len(headings) >= 4 else 10
    return build_category(
        "Content Structure",
        15,
        score,
        "Tighten heading structure",
        "Answer extraction works better when rendered headings describe the document clearly.",
    )
