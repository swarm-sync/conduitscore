from app.scanner.analyzers.common import build_category
from app.types import ConduitScanData


def analyze_llms_txt(data: ConduitScanData):
    llms_txt = (data.robots or {}).get("llms_txt")
    score = 10 if llms_txt else 4
    return build_category(
        "llms.txt",
        10,
        score,
        "Publish a useful llms.txt",
        "A concise llms.txt helps public AI systems understand your preferred entry points and policy.",
    )
