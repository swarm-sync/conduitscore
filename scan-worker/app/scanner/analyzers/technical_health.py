from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_technical_health(data: ConduitScanData):
    js_ratio = float((data.js_delta or {}).get("js_dependency_ratio", 0.0))
    console_count = int((data.console or {}).get("count", 0))
    network_count = int((data.network or {}).get("error_count", 0))
    score = 15 - int(js_ratio * 7) - min(console_count + network_count, 4)
    return build_category(
        "Technical Health",
        15,
        max(score, 5),
        "Reduce JS dependency and runtime errors",
        "Console noise, broken assets, and heavy JS reduce visibility for both users and AI crawlers.",
    )
