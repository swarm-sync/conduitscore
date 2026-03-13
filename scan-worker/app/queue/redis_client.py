from app.config import settings


async def get_redis_url() -> str | None:
    return settings.redis_url or None
