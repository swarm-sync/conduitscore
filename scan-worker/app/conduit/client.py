from __future__ import annotations

import hashlib
import importlib.util
import json
import sys
import types
from pathlib import Path
from typing import Any

from app.config import settings


STRUCTURED_DATA_EXTRACTION_JS = """
(() => {
  const jsonld = [];
  for (const node of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(node.textContent || "null");
      if (Array.isArray(parsed)) {
        jsonld.push(...parsed);
      } else if (parsed) {
        jsonld.push(parsed);
      }
    } catch {}
  }

  const metaTags = {};
  for (const node of document.querySelectorAll("meta[name][content]")) {
    const name = node.getAttribute("name");
    if (name) {
      metaTags[name] = node.getAttribute("content") || "";
    }
  }

  const ogTags = {};
  for (const node of document.querySelectorAll('meta[property^="og:"][content]')) {
    const property = node.getAttribute("property");
    if (property) {
      ogTags[property] = node.getAttribute("content") || "";
    }
  }

  return {
    jsonld,
    meta_tags: metaTags,
    og_tags: ogTags,
    robots_meta: document.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
  };
})()
"""

ROBOTS_AND_LLMS_JS = """
(async () => {
  const readText = async (pathname) => {
    try {
      const response = await fetch(new URL(pathname, window.location.origin).toString(), {
        credentials: "omit",
        cache: "no-store",
      });
      if (!response.ok) {
        return null;
      }
      return await response.text();
    } catch {
      return null;
    }
  };

  return {
    robots_txt: await readText("/robots.txt"),
    llms_txt: await readText("/llms.txt"),
  };
})()
"""


def bootstrap_cato(conduit_root: Path, data_dir: Path) -> None:
    cato_pkg = types.ModuleType("cato")
    cato_pkg.__path__ = [str(conduit_root)]
    cato_pkg.__package__ = "cato"
    existing = sys.modules.setdefault("cato", cato_pkg)
    cato_pkg = existing

    if "cato.platform" not in sys.modules:
        platform_mod = types.ModuleType("cato.platform")
        platform_mod.get_data_dir = lambda: data_dir  # type: ignore[attr-defined]
        sys.modules["cato.platform"] = platform_mod
        cato_pkg.platform = platform_mod  # type: ignore[attr-defined]

    if "cato.audit" not in sys.modules:
        spec = importlib.util.spec_from_file_location(
            "cato.audit",
            str(conduit_root / "audit.py"),
            submodule_search_locations=[],
        )
        assert spec and spec.loader
        module = importlib.util.module_from_spec(spec)
        module.__package__ = "cato"
        sys.modules["cato.audit"] = module
        spec.loader.exec_module(module)  # type: ignore[union-attr]
        cato_pkg.audit = module  # type: ignore[attr-defined]

    tools_pkg = types.ModuleType("cato.tools")
    tools_pkg.__path__ = [str(conduit_root / "tools")]
    tools_pkg.__package__ = "cato.tools"
    existing_tools = sys.modules.setdefault("cato.tools", tools_pkg)
    tools_pkg = existing_tools
    cato_pkg.tools = tools_pkg  # type: ignore[attr-defined]

    for module_name, file_name in [
        ("cato.tools.browser", "browser.py"),
        ("cato.tools.conduit_bridge", "conduit_bridge.py"),
        ("cato.tools.conduit_crawl", "conduit_crawl.py"),
        ("cato.tools.conduit_monitor", "conduit_monitor.py"),
        ("cato.tools.conduit_proof", "conduit_proof.py"),
    ]:
        if module_name in sys.modules:
            continue

        spec = importlib.util.spec_from_file_location(
            module_name,
            str(conduit_root / "tools" / file_name),
            submodule_search_locations=[],
        )
        assert spec and spec.loader
        module = importlib.util.module_from_spec(spec)
        module.__package__ = "cato.tools"
        sys.modules[module_name] = module
        spec.loader.exec_module(module)  # type: ignore[union-attr]


class ConduitBridgeClient:
    def __init__(self):
        self._mode = settings.worker_mode
        self._url = "https://example.com"
        self._session_id = "agentoptimize_worker"
        self._bridge: Any | None = None
        self._restart_required = False
        self._runtime_dir = Path(settings.conduit_data_dir).resolve()
        self._conduit_root = Path(settings.conduit_root).resolve()

    def reset_session(self, session_id: str):
        if session_id != self._session_id:
            self._session_id = session_id
            self._restart_required = True

    async def ensure_browser(self):
        if self._mode == "mock":
            return None

        if self._bridge is not None and not self._restart_required:
            return None

        if self._bridge is not None:
            await self._bridge.stop()
            self._bridge = None

        if not self._conduit_root.exists():
            self._mode = "mock"
            return None

        self._runtime_dir.mkdir(parents=True, exist_ok=True)
        bootstrap_cato(self._conduit_root, self._runtime_dir)
        conduit_module = sys.modules["cato.tools.conduit_bridge"]
        bridge_cls = conduit_module.ConduitBridge
        self._bridge = bridge_cls(self._session_id, budget_cents=99999, data_dir=self._runtime_dir)
        await self._bridge.start()
        self._restart_required = False
        return None

    async def close(self):
        if self._bridge is not None:
            await self._bridge.stop()
            self._bridge = None

    async def execute(self, payload: dict):
        if self._mode == "mock":
            return await self._execute_mock(payload)

        await self.ensure_browser()
        if self._bridge is None:
            return await self._execute_mock(payload)

        action = payload["action"]
        if action == "navigate":
            result = await self._bridge.navigate(payload["url"])
            self._url = result.get("url", payload["url"])
            return result
        if action == "extract_main":
            return await self._bridge.extract_main(
                max_chars=payload.get("max_chars", 10000),
                fmt=payload.get("fmt", "md"),
            )
        if action == "js_delta":
            return await self._bridge.js_delta()
        if action == "accessibility_snapshot":
            return await self._bridge.accessibility_snapshot()
        if action == "eval":
            js_code = payload.get("js_code", "")
            if js_code == "structured_data_extraction":
                result = await self._bridge.eval(STRUCTURED_DATA_EXTRACTION_JS)
                return result.get("result", {}) if result.get("success") else {}
            if js_code == "robots_and_llms_fetch":
                result = await self._bridge.eval(ROBOTS_AND_LLMS_JS)
                return result.get("result", {}) if result.get("success") else {}

            result = await self._bridge.eval(js_code)
            return result.get("result", {}) if result.get("success") else {}
        if action == "network_requests":
            return await self._bridge.network_requests()
        if action == "console_messages":
            return await self._bridge.console_messages()
        if action == "export_micro":
            return self._bridge.export_micro(
                url=payload.get("url", self._url),
                dom_hash=payload.get("dom_hash", ""),
                scan_origin=payload.get("scan_origin", "agentoptimize_worker"),
            )

        raw = await self._bridge.execute(dict(payload))
        return json.loads(raw)

    async def _execute_mock(self, payload: dict):
        action = payload["action"]
        if action == "navigate":
            self._url = payload["url"]
            return {
                "title": "AgentOptimize mock page",
                "url": self._url,
                "text": "AgentOptimize audits AI visibility with proof artifacts.",
                "elements": ["h1", "h2", "a"],
            }
        if action == "extract_main":
            return {
                "text": "Rendered page content " * 80,
                "content_hash": hashlib.sha256(self._url.encode()).hexdigest(),
                "http_status": 200,
                "links_found": 9,
            }
        if action == "js_delta":
            return {
                "js_dependency_ratio": 0.46,
                "static_hash": hashlib.sha256(f"static:{self._url}".encode()).hexdigest(),
                "rendered_hash": hashlib.sha256(f"rendered:{self._url}".encode()).hexdigest(),
            }
        if action == "accessibility_snapshot":
            return {
                "tree": "heading -> heading -> link",
                "headings": ["Hero", "Pipeline", "Proof"],
                "url": self._url,
                "title": "AgentOptimize mock page",
            }
        if action == "eval":
            js_code = payload.get("js_code", "")
            if "robots" in js_code or "llms" in js_code:
                return {
                    "robots_txt": "User-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /",
                    "llms_txt": "AgentOptimize prefers rendered markdown excerpts for indexing.",
                }
            return {
                "jsonld": [{"@type": "Organization"}, {"@type": "FAQPage"}],
                "meta_tags": {"description": "AI visibility audits"},
                "og_tags": {"og:title": "AgentOptimize"},
                "robots_meta": "index,follow",
            }
        if action == "network_requests":
            return {"requests": [{"status": 200}, {"status": 200}], "count": 2, "error_count": 0}
        if action == "console_messages":
            return {"messages": [], "count": 0}
        if action == "export_micro":
            return {
                "micro_proof": {
                    "url": self._url,
                    "dom_hash": payload.get("dom_hash", ""),
                    "timestamp": "2026-03-12T00:00:00Z",
                    "signature": "mock_signature",
                    "scanner_version_hash": "mock_worker_v1",
                    "scan_origin": "agentoptimize_worker",
                },
                "success": True,
            }
        raise ValueError(f"Unsupported action: {action}")


class MockConduitBridge(ConduitBridgeClient):
    def __init__(self):
        super().__init__()
        self._mode = "mock"
