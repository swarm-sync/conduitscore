import asyncio

from app.queue.redis_client import get_redis_url


async def start_worker(pool):
    redis_url = await get_redis_url()
    if not redis_url:
        return

    while True:
        await asyncio.sleep(5)
