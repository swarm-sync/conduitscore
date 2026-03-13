from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_content_quality(data: ConduitScanData):
    text = (data.main_content or {}).get("text") or ""
    score = 10 if len(text) >= 800 else 6
    return build_category(
        "Content Quality",
        10,
        score,
        "Deepen the primary answer surface",
        "Pages need enough specific, fresh content to answer AI retrieval queries directly.",
    )
