# Dynamic templating & snippet logic

## Layers

1. **Sequence (A / B / C)** — `classify.py` picks a track from `company_name`, `icp_tag`, `industry_vertical`, or `sequence_override` column.
2. **Step (1–5)** — Each prospect becomes **five Sheet rows** (one per step) with different `subject` + `body_html` / `body_text`.
3. **Subject lines** — Defined in `render_engine.SUBJECTS` as Jinja2 strings (short, mobile-safe).
4. **Bodies** — `templates/sequences/{A|B|C}/{1–5}.html.j2` with `{% include "partials/signature_ben.html.j2" %}`.
5. **Dynamic snippet** — `snippets.select_dynamic_snippet(top_issue, stack, api_fix_code)`:
   - If API returns short unlocked `fix.code`, use first **4 lines** + stack suffix.
   - Else if `top_issue` matches `schema|json-ld|structured data` → Organization / Product / WebSite JSON-LD stub (4 lines max).
   - `llms.txt` / `canonical` branches for those keywords.
   - Else generic4-line guidance.
6. **Stack flavor** — `stack_detect.detect_stack` does a light homepage fetch for Shopify / WordPress strings; appends a one-line implementation hint.

## Context variables (Jinja)

Populated in `render_engine.build_context`: `greeting_name`, `domain`, `ai_visibility_score`, `top_issue`, `issue_description`, `recommended_fix`, `code_snippet`, `benchmark_note`, `score_gap`, `industry_avg`, `rescan_link`, `verify_link`, `sender_name`, `sender_email`, `estimated_ai_traffic_impact`, `template_version`, etc.

## Benchmarks

Hardcoded in `classify.SEQUENCE_BENCHMARKS` (tune to your ICP). `benchmark_note` explains gap vs average in plain English.

## Versioning

`templates/VERSION` (e.g. `1.1`) is copied into every Sheet row as `template_version` for auditability.

## HTML → plain text

`render_engine._html_to_plain` strips tags for `body_text` (Gmail multipart).
