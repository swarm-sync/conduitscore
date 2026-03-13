import asyncio

from app.conduit.client import ConduitBridgeClient


class BrowserPool:
    def __init__(self):
        self._browsers: asyncio.Queue[ConduitBridgeClient] = asyncio.Queue()
        self._max = 0

    async def initialize(self, max_browsers: int = 2):
        self._max = max_browsers
        for _ in range(max_browsers):
            bridge = ConduitBridgeClient()
            await bridge.ensure_browser()
            self._browsers.put_nowait(bridge)

    async def acquire(self) -> ConduitBridgeClient:
        return await self._browsers.get()

    async def release(self, bridge: ConduitBridgeClient):
        self._browsers.put_nowait(bridge)

    @property
    def available_count(self) -> int:
        return self._browsers.qsize()

    async def shutdown(self):
        while not self._browsers.empty():
            bridge = self._browsers.get_nowait()
            await bridge.close()
