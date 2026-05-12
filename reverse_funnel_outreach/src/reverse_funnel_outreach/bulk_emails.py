"""Load domain lists and write harvested-email CSVs (no ConduitScore, no sheet)."""

from __future__ import annotations

import csv
from pathlib import Path


def load_domains(path: Path) -> list[str]:
    """
    Accepts:
    - `.csv` with a `domain` column (or `url` fallback)
    - `.txt` / other: one domain or URL per line; `#` starts a comment; blanks skipped
    """
    path = path.resolve()
    if not path.is_file():
        raise FileNotFoundError(str(path))

    out: list[str] = []
    if path.suffix.lower() == ".csv":
        with path.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            if not reader.fieldnames:
                return []
            fields = {h.lower(): h for h in reader.fieldnames}
            key = None
            for candidate in ("domain", "url", "website", "site"):
                if candidate in fields:
                    key = fields[candidate]
                    break
            if not key:
                raise ValueError(
                    "CSV needs a column named domain, url, website, or site (any case)."
                )
            for row in reader:
                raw = (row.get(key) or "").strip()
                if raw and not raw.startswith("#"):
                    out.append(raw)
    else:
        text = path.read_text(encoding="utf-8", errors="replace")
        for line in text.splitlines():
            raw = line.strip()
            if not raw or raw.startswith("#"):
                continue
            out.append(raw)

    # Dedupe, preserve order
    seen: set[str] = set()
    uniq: list[str] = []
    for d in out:
        if d not in seen:
            seen.add(d)
            uniq.append(d)
    return uniq
