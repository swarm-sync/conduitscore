from app.scanner.orchestrator import run_scan


async def process_job(pool, job: dict) -> dict:
    return await run_scan(pool, job["url"], job["scan_id"])
