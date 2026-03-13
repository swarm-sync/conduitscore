import pytest

from app.conduit.browser_pool import BrowserPool
from app.scanner.orchestrator import run_scan


@pytest.mark.asyncio
async def test_run_scan_returns_full_result():
    pool = BrowserPool()
    await pool.initialize(max_browsers=1)
    try:
        result = await run_scan(pool, "https://example.com", "scan_123")
    finally:
        await pool.shutdown()

    assert result["overall_score"] > 0
    assert len(result["categories"]) == 7
    assert result["metadata"]["proof"]["scan_origin"] == "agentoptimize_worker"
