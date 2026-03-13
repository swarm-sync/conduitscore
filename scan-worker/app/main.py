import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.conduit.browser_pool import BrowserPool
from app.scanner.orchestrator import run_scan
from app.worker import start_worker

pool = BrowserPool()


@asynccontextmanager
async def lifespan(_: FastAPI):
    await pool.initialize(max_browsers=settings.max_browsers)
    worker_task = asyncio.create_task(start_worker(pool))
    yield
    worker_task.cancel()
    await pool.shutdown()


app = FastAPI(title="AgentOptimize Scan Worker", lifespan=lifespan)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "mode": settings.worker_mode,
        "browsers_available": pool.available_count,
    }


@app.post("/scan")
async def trigger_scan(payload: dict):
    return await run_scan(pool, payload["url"], payload.get("scan_id", "direct"))
