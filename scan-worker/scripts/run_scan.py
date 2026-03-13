from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path


sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.conduit.browser_pool import BrowserPool
from app.scanner.orchestrator import run_scan


async def _main() -> int:
    parser = argparse.ArgumentParser(description="Run an AgentOptimize Conduit-backed scan")
    parser.add_argument("--url", required=True)
    parser.add_argument("--scan-id", required=True)
    args = parser.parse_args()

    pool = BrowserPool()
    await pool.initialize(max_browsers=1)
    try:
        result = await run_scan(pool, args.url, args.scan_id)
        print(json.dumps(result), end="")
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), end="")
        return 1
    finally:
        await pool.shutdown()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(_main()))
