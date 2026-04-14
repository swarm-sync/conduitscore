from __future__ import annotations

import re


def _four_lines(s: str) -> str:
    lines = [ln.strip() for ln in s.strip().splitlines() if ln.strip()]
    return "\n".join(lines[:4])


# Max 4 lines each — copy-paste helpers (not full production schema advice)
SNIPPETS: dict[str, str] = {
    "organization": """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Organization","name":"Your Company","url":"https://YOUR-DOMAIN.com"}
</script>""",
    "product": """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"Your product","description":"One clear sentence"}
</script>""",
    "website": """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Your site","url":"https://YOUR-DOMAIN.com"}
</script>""",
    "llms_txt": """Create /llms.txt at your site root with 5–10 lines: what you sell, who it’s for, and 3 canonical URLs.""",
    "canonical": """<link rel="canonical" href="https://YOUR-DOMAIN.com/this-page" />""",
    "generic": """Add clear H1 + one short summary paragraph so AI tools can quote you accurately.""",
}


def stack_suffix(stack: str) -> str:
    if stack == "shopify":
        return " (Shopify: Online Store → Themes → Edit code → add snippet in theme.liquid layout.)"
    if stack == "wordpress":
        return " (WordPress: use a vetted schema plugin or your theme’s JSON-LD hook.)"
    return ""


def select_dynamic_snippet(top_issue: str, stack: str, api_code: str) -> str:
    """
    Prefer API fix code when short enough; else keyword-route to 4-line canned snippet + stack note.
    """
    blob = f"{top_issue}".lower()
    api_stripped = (api_code or "").strip()
    if api_stripped and len(api_stripped) <= 800:
        return _four_lines(api_stripped) + stack_suffix(stack)

    if re.search(r"structured data|schema|json-ld|json ld", blob):
        if "product" in blob:
            base = SNIPPETS["product"]
        elif "organization" in blob or "org" in blob:
            base = SNIPPETS["organization"]
        else:
            base = SNIPPETS["website"]
        return _four_lines(base) + stack_suffix(stack)

    if re.search(r"llms\.txt|llms txt", blob):
        return _four_lines(SNIPPETS["llms_txt"])

    if "canonical" in blob:
        return _four_lines(SNIPPETS["canonical"])

    return _four_lines(SNIPPETS["generic"]) + stack_suffix(stack)
