from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_structured_data(data: ConduitScanData):
    jsonld = (data.structured_data or {}).get("jsonld") or []
    score = 20 if len(jsonld) >= 2 else 12
    return build_category(
        "Structured Data",
        20,
        score,
        "Expand JSON-LD coverage",
        "Rendered JSON-LD should cover core entities, not just a sparse organization node.",
    )
