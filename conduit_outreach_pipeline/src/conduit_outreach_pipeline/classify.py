from __future__ import annotations

import re

# Industry average scores (hardcoded benchmark table — tune from your data)
SEQUENCE_BENCHMARKS: dict[str, tuple[int, str]] = {
    "A": (48, "B2B SaaS / general software"),
    "B": (44, "Agencies & services"),
    "C": (46, "E-commerce / DTC"),
}


def classify_sequence(
    company_name: str,
    *,
    icp_tag: str = "",
    industry_vertical: str = "",
    manual_override: str = "",
) -> str:
    """
    A = SaaS / general default
    B = Agency (keywords)
    C = E-commerce / Shopify-ish (keywords)
    """
    o = manual_override.strip().upper()
    if o in ("A", "B", "C"):
        return o

    blob = f"{company_name} {icp_tag} {industry_vertical}".lower()

    agency = r"\b(agency|agencies|marketing agency|digital agency|seo agency|consultancy|consulting)\b"
    if re.search(agency, blob):
        return "B"

    ecommerce = r"\b(shopify|e-?commerce|ecom|dtc|store|retail|woocommerce|amazon seller)\b"
    if re.search(ecommerce, blob):
        return "C"

    return "A"


def benchmark_for_sequence(seq: str) -> tuple[int, str]:
    return SEQUENCE_BENCHMARKS.get(seq, SEQUENCE_BENCHMARKS["A"])
