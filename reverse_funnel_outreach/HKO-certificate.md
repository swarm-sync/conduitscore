# HKO-Truth-Audit Certificate: Domain-first prospecting engine (`reverse_funnel_outreach`)

**Date:** 2026-04-16  
**Version audited:** N/A (library + spec; not a versioned SKILL product)

| Layer | Findings | Critical/High |
|-------|----------|----------------|
| HK (Code) | 1 (MEDIUM manual) | 0 / 0 |
| OTA (Contract) | 1 (LOW design-time) | 0 / 0 |
| RIO (Integration) | 3 (2 MEDIUM, 1 LOW) | 0 / 0 |
| MULTI (overlap) | 0 | 0 |
| CAUSAL LINKs | 0 | — |
| HK Coverage | **PARTIAL** | — |

> **CAUSAL LINK detection unreliable — HK layer did not complete via Hudson-Kraken automation.** Do not interpret 0 causal links as proof of a clean cross-layer story. Re-run with full HK tooling if you need HK↔RIO linkage evidence.

**Overall result:** **PASS** (at **HIGH** threshold: no CRITICAL or HIGH unified findings)

**Residual risks**

1. Crawler fetches user-controlled URLs — operational abuse/SSRF class risks remain out of scope for static audit.  
2. OTA in design-time mode — no transcript to verify agent execution honesty.  
3. Third-party DNS/network variance not fully captured by local tests.
