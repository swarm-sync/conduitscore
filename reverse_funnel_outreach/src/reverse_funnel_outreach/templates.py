from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ColdEmailVariant:
    step: str  # e.g. "A1"
    subject_template: str
    body_template: str


_BLOCK = re.compile(
    r"^(A\d)\s*\([^)]+\)\s*$",
    re.MULTILINE,
)


def parse_cold_email_variants(path: Path) -> list[ColdEmailVariant]:
    text = path.read_text(encoding="utf-8")
    variants: list[ColdEmailVariant] = []
    matches = list(_BLOCK.finditer(text))
    for i, m in enumerate(matches):
        step = m.group(1)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        block = text[start:end].strip()
        subject = ""
        body_lines: list[str] = []
        mode: str | None = None
        for line in block.splitlines():
            if line.startswith("Subject:"):
                mode = "subject"
                subject = line[len("Subject:") :].strip()
                continue
            if line.strip() == "Body:":
                mode = "body"
                continue
            if mode == "body":
                body_lines.append(line)
        body = "\n".join(body_lines).strip()
        variants.append(ColdEmailVariant(step=step, subject_template=subject, body_template=body))
    return variants


def variant_by_step(variants: list[ColdEmailVariant], step: str) -> ColdEmailVariant | None:
    for v in variants:
        if v.step == step:
            return v
    return None
