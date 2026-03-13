from app.scanner.analyzers.content_quality import analyze_content_quality
from app.scanner.analyzers.content_structure import analyze_content_structure
from app.scanner.analyzers.citation_signals import analyze_citation_signals
from app.scanner.analyzers.crawler_access import analyze_crawler_access
from app.scanner.analyzers.llms_txt import analyze_llms_txt
from app.scanner.analyzers.structured_data import analyze_structured_data
from app.scanner.analyzers.technical_health import analyze_technical_health
from app.types import ConduitScanData, CategoryScore


def analyze_all(data: ConduitScanData) -> list[CategoryScore]:
    return [
        analyze_crawler_access(data),
        analyze_structured_data(data),
        analyze_content_structure(data),
        analyze_llms_txt(data),
        analyze_technical_health(data),
        analyze_citation_signals(data),
        analyze_content_quality(data),
    ]
