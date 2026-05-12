"""
Optional JS-capable harvest via local Conduit (Chromium + crawl).

Set CONDUIT_ROOT to your Conduit repo and USE_CONDUIT_BROWSER=true, or rely on
auto-detect when the default path exists.
"""

from __future__ import annotations

import asyncio
import importlib.util
import json
import sys
import types
from pathlib import Path

from reverse_funnel_outreach.email_extract import extract_emails_from_text

_BOOTSTRAPPED = False


def _default_conduit_root() -> Path:
    return Path(r"C:\Users\Administrator\Desktop\Conduit")


def conduit_root_from_env() -> Path | None:
    import os

    raw = (os.environ.get("CONDUIT_ROOT") or "").strip()
    if raw:
        p = Path(raw)
        return p if p.is_dir() else None
    p = _default_conduit_root()
    return p if p.is_dir() else None


def _install_cato_shim(conduit_root: Path, data_dir: Path) -> None:
    """
    Same wiring as Conduit tests/conftest.py bootstrap_cato(), but with an
    explicit repo path and ~/.cato data dir (not the test session folder).
    """
    global _BOOTSTRAPPED
    if _BOOTSTRAPPED:
        return
    if str(conduit_root) not in sys.path:
        sys.path.insert(0, str(conduit_root))

    cato_pkg = types.ModuleType("cato")
    cato_pkg.__path__ = [str(conduit_root)]
    cato_pkg.__package__ = "cato"
    existing = sys.modules.setdefault("cato", cato_pkg)
    cato_pkg = existing

    if "cato.platform" not in sys.modules:
        platform_mod = types.ModuleType("cato.platform")
        _dd = data_dir
        platform_mod.get_data_dir = lambda: _dd  # type: ignore[attr-defined]
        sys.modules["cato.platform"] = platform_mod
        cato_pkg.platform = platform_mod  # type: ignore[attr-defined]

    if "cato.audit" not in sys.modules:
        spec = importlib.util.spec_from_file_location(
            "cato.audit",
            str(conduit_root / "audit.py"),
            submodule_search_locations=[],
        )
        assert spec and spec.loader
        mod = importlib.util.module_from_spec(spec)
        mod.__package__ = "cato"
        sys.modules["cato.audit"] = mod
        spec.loader.exec_module(mod)  # type: ignore[union-attr]
        cato_pkg.audit = mod  # type: ignore[attr-defined]

    tools_pkg = types.ModuleType("cato.tools")
    tools_pkg.__path__ = [str(conduit_root / "tools")]
    tools_pkg.__package__ = "cato.tools"
    existing_tools = sys.modules.setdefault("cato.tools", tools_pkg)
    tools_pkg = existing_tools
    cato_pkg.tools = tools_pkg  # type: ignore[attr-defined]

    for mod_name, file_name in [
        ("cato.tools.browser", "browser.py"),
        ("cato.tools.conduit_bridge", "conduit_bridge.py"),
        ("cato.tools.conduit_crawl", "conduit_crawl.py"),
        ("cato.tools.conduit_monitor", "conduit_monitor.py"),
        ("cato.tools.conduit_proof", "conduit_proof.py"),
    ]:
        if mod_name not in sys.modules:
            spec = importlib.util.spec_from_file_location(
                mod_name,
                str(conduit_root / "tools" / file_name),
                submodule_search_locations=[],
            )
            assert spec and spec.loader
            mod = importlib.util.module_from_spec(spec)
            mod.__package__ = "cato.tools"
            sys.modules[mod_name] = mod
            spec.loader.exec_module(mod)  # type: ignore[union-attr]

    _BOOTSTRAPPED = True


def _ensure_conduit_bootstrap() -> Path:
    root = conduit_root_from_env()
    if not root:
        raise RuntimeError(
            "Conduit not found. Set CONDUIT_ROOT to your Conduit checkout "
            "(folder containing audit.py and tools/conduit_bridge.py)."
        )
    if not (root / "tools" / "conduit_bridge.py").is_file():
        raise RuntimeError(f"Invalid CONDUIT_ROOT (missing tools/conduit_bridge.py): {root}")
    _install_cato_shim(root, Path.home() / ".cato")
    return root


def _set_windows_asyncio_for_subprocess() -> None:
    """Playwright needs Proactor on Windows so asyncio can spawn browser subprocesses."""
    if sys.platform == "win32":
        try:
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        except Exception:
            pass


async def _harvest_conduit_async(
    url: str,
    *,
    max_depth: int,
    page_limit: int,
) -> list[str]:
    _ensure_conduit_bootstrap()
    from cato.tools.conduit_bridge import ConduitBridge

    b = ConduitBridge("rf_outreach_harvest", budget_cents=99999)
    await b.start()
    try:
        raw = await b.execute(
            {
                "action": "crawl",
                "url": url,
                "max_depth": max_depth,
                "limit": page_limit,
            }
        )
        data = json.loads(raw)
        err = data.get("error")
        if err:
            raise RuntimeError(str(err))
        found: list[str] = []
        for p in data.get("pages", []):
            text = p.get("text") or ""
            title = p.get("title") or ""
            found.extend(extract_emails_from_text(text))
            found.extend(extract_emails_from_text(title))
        return list(dict.fromkeys(found))
    finally:
        await b.stop()


def harvest_conduit_crawl(
    url: str,
    *,
    max_depth: int = 1,
    page_limit: int = 25,
) -> tuple[str, list[str]]:
    """
    Run Conduit Chromium crawl, extract emails from page text.
    Returns ("", emails) — no raw HTML (same shape as harvest_crawl4ai).
    """
    _set_windows_asyncio_for_subprocess()
    emails = asyncio.run(
        _harvest_conduit_async(url, max_depth=max_depth, page_limit=page_limit)
    )
    return "", emails


def conduit_available() -> bool:
    try:
        return conduit_root_from_env() is not None
    except Exception:
        return False
