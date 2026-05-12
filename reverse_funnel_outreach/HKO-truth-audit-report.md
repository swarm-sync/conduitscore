# HKO-Truth-Audit Report: Domain-first prospecting engine (`reverse_funnel_outreach`)

**Date:** 2026-04-16  
**Severity threshold:** HIGH  
**OTA mode:** DESIGN-TIME (no agent transcript provided for this workstream)

```
[HKO SCOPE]
target_skill_path: C:\Users\Administrator\.claude\skills\HKO-truth-audit\SKILL.md (procedure); contract source for product work = DOMAIN_FIRST_PROSPECTING_ENGINE_SPEC.md
code_path: c:\Users\Administrator\Desktop\ConduitScore\reverse_funnel_outreach\
transcript_path: MISSING
ota_mode: DESIGN-TIME — no transcript; OTA confidence REDUCED for execution-honesty claims
rio_mode: ENABLED (spec + completed-task reconciliation)
severity_threshold: HIGH
mode: Full (HK manual substitute + OTA design-time + RIO)
output_dir: c:\Users\Administrator\Desktop\ConduitScore\reverse_funnel_outreach\
```

**Banner:** Full three-layer *intent*; **HK coverage is PARTIAL** — Hudson-Kraken was not invoked as an automated sub-skill here; Phase 1 used targeted manual review (SQL parameterization, subprocess/RCE patterns, httpx URL handling) plus the existing test suite.

---

## Findings

Ordered by priority (CAUSAL LINK first — none identified; top HK-style issues next).

| ID | Unified | Source | CAUSAL LINK | Description | Location / evidence |
|----|---------|--------|-------------|-------------|---------------------|
| RIO-1 | MEDIUM | RIO | no | Spec promises **CSV / JSONL** exports; CLI implements CSV evidence paths but **no JSONL export** in `cli.py` (grep: no `jsonl`). | `DOMAIN_FIRST_PROSPECTING_ENGINE_SPEC.md` (e.g. CSV/JSONL, export_jsonl references); `cli.py` (no JSONL) |
| RIO-2 | MEDIUM | RIO | no | **`email_findings`** stores `delivery_state` / `confidence_band`; **`email_canonicals`** does not mirror those fields — readers querying only canonicals miss segmentation fields. | `store.py` schema + `save_finding` vs canonical table |
| HK-1 | MEDIUM | HK | no | **`delivery_state == "risky"`** from catch-all is **unreachable**: `detect_catch_all` always returns `status="unknown"`, so `catch_all.status == "accept_all"` never holds. Dead contract vs future SMTP probe. | `verification.py` (~40–66) |
| RIO-3 | LOW | RIO | no | **`.env.example`** documents `ENABLE_SMTP_CATCH_ALL_PROBE` while verification uses a **stub** `detect_catch_all` — env flag unused; doc/behavior drift. | `.env.example`; `verification.py` |
| OTA-1 | LOW | OTA | no | **No transcript** — cannot verify agent execution order, sub-skill invocations, or “checkpoint” honesty for the Cursor session; design-time only. | N/A (process) |

**At threshold HIGH:** no CRITICAL or HIGH unified findings (MEDIUM and LOW only).

---

## Task Status Table

| Task | Status | Note |
|------|--------|------|
| URL normalization / source resolver | implemented | Covered by tests + `engine` wiring (prior session) |
| Passive OSINT ingestion | implemented | Wired in engine path |
| Verification + persistence | partial | DNS/syntax path works; catch-all “risky” path unused; stub vs `.env.example` |
| score_v2 / ensemble + `confidence_band` | implemented | `scoring_bands.py`, `engine.py`, `store.py` |
| Crawl policy + time budget | implemented | `crawl_policy.py` |
| Browser / JS fallback | implemented | `browser_policy.py`, `harvest.py` |
| Pattern inference | implemented | `pattern_inference.py` |
| CLI evidence columns + adapter handoff | implemented | `cli.py`, `prospect_adapter.py` |
| **JSONL export** | **missing** | Spec + test comment reference JSONL; CLI has no JSONL |
| **Canonical table parity** | **partial** | Bands on `email_findings` only |

---

## Deduplication Log

- No merges — findings are distinct (spec gap vs schema parity vs dead branch vs env doc).

---

## Causal Links

- **CAUSAL_LINK_COVERAGE:** HK layer did not use automated Hudson-Kraken output; treat **0 causal links** as non-proof of absence.
- No normalized file:line overlap between HK-1 (`verification.py`) and RIO-1/RIO-2 (export/schema) — **no multi-layer causal link recorded**.

---

## Crux

**No single structural failure:** the pipeline is test-backed and integrated for CSV/SQLite flows; the main honest gaps are **spec vs JSONL**, **canonical vs finding column parity**, and **stub catch-all vs documented SMTP env**.

---

## Remediation Plan

1. **integration_fix** — Add a **`--format jsonl`** (or dedicated export) path on the same rows as CSV export, or trim the spec to “CSV only” until JSONL ships.  
2. **integration_fix** — Either add `delivery_state` / `confidence_band` to `email_canonicals` + migration, or document that **only `email_findings`** is authoritative for outreach tiers.  
3. **code_fix** — When implementing real catch-all detection, make `detect_catch_all` return `accept_all` when probed; or remove the `accept_all` branch until then to avoid misleading readers.  
4. **contract_fix** — Remove or gate `ENABLE_SMTP_CATCH_ALL_PROBE` in `.env.example` until the probe exists.  
5. **gate_fix** — Optional: CI check that `DOMAIN_FIRST_PROSPECTING_ENGINE_SPEC.md` export bullets match `cli.py` surface.

---

## Verification Summary

| Command | Result | Scope | Note |
|---------|--------|-------|------|
| `python -m pytest tests -q` (from `reverse_funnel_outreach`) | **passed** | in-scope | 177 passed, 2 xpassed (~6s) |

---

## Residual risks (even if PASS at HIGH)

1. **SSRF / abuse:** fetching arbitrary user-supplied URLs is inherent to a crawler; not a logic bug but an operational trust boundary.  
2. **Live DNS / MX:** behavior depends on network and resolver; tests may mock or use constrained cases.  
3. **No agent transcript:** OTA cannot rule out instruction drift or skipped steps during the original implementation session.
