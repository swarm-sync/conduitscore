from __future__ import annotations

from datetime import datetime, UTC

from app.scanner.analyzers import analyze_all
from app.types import ConduitScanData, ScanResult


STRUCTURED_DATA_EXTRACTION_JS = "structured_data_extraction"
ROBOTS_AND_LLMS_JS = "robots_and_llms_fetch"


async def run_scan(pool, url: str, scan_id: str) -> dict:
    bridge = await pool.acquire()
    started_at = datetime.now(UTC)
    try:
        bridge.reset_session(session_id=f"scan_{scan_id}")

        nav_result = await bridge.execute({"action": "navigate", "url": url})
        main_content = await bridge.execute({"action": "extract_main", "max_chars": 10000, "fmt": "md"})
        js_delta = await bridge.execute({"action": "js_delta"})
        accessibility = await bridge.execute({"action": "accessibility_snapshot"})
        structured_data = await bridge.execute({"action": "eval", "js_code": STRUCTURED_DATA_EXTRACTION_JS})
        robots = await bridge.execute({"action": "eval", "js_code": ROBOTS_AND_LLMS_JS})
        network = await bridge.execute({"action": "network_requests"})
        console = await bridge.execute({"action": "console_messages"})

        raw_data = ConduitScanData(
            url=url,
            nav=nav_result,
            main_content=main_content,
            js_delta=js_delta,
            accessibility=accessibility,
            structured_data=structured_data,
            robots=robots,
            network=network,
            console=console,
        )

        categories = analyze_all(raw_data)
        issues = [issue for category in categories for issue in category.issues]
        fixes = [fix for category in categories for fix in category.fixes]
        overall_score = round(
            sum(category.score for category in categories) / sum(category.max_score for category in categories) * 100
        )

        micro_proof = await bridge.execute(
            {
                "action": "export_micro",
                "url": url,
                "dom_hash": raw_data.main_content.get("content_hash", ""),
                "scan_origin": "agentoptimize_worker",
            }
        )

        duration_ms = int((datetime.now(UTC) - started_at).total_seconds() * 1000)
        result = ScanResult(
            url=url,
            overall_score=overall_score,
            categories=categories,
            issues=issues,
            fixes=fixes,
            scanned_at=datetime.now(UTC).isoformat(),
            metadata={
                "loadTimeMs": 900,
                "htmlLength": len(raw_data.main_content.get("text", "")),
                "jsDependencyRatio": raw_data.js_delta.get("js_dependency_ratio"),
                "contentHash": raw_data.main_content.get("content_hash"),
                "staticHash": raw_data.js_delta.get("static_hash"),
                "renderedHash": raw_data.js_delta.get("rendered_hash"),
                "consoleErrorCount": raw_data.console.get("count", 0),
                "networkErrorCount": raw_data.network.get("error_count", 0),
                "scanDurationMs": duration_ms,
                "proof": micro_proof.get("micro_proof"),
            },
            proof=micro_proof.get("micro_proof"),
        )

        return result.model_dump()
    finally:
        await pool.release(bridge)
