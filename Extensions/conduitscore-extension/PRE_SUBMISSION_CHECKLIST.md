# ConduitScore Extension — Pre-Submission Checklist

**Task:** task-013
**Date:** 2026-04-16
**Prepared by:** Automated CI (task-013)

---

## ZIP Package

- **Path:** `Extensions/conduitscore-extension/conduitscore-extension-v1.0.0.zip`
- **Size:** 63.48 KB (well under 1 MB CWS hard limit)
- **File count:** 10 entries

### ZIP Contents (all at archive root — no nested dist/ directory)

| Entry | Size |
|---|---|
| `manifest.json` | 1,494 bytes |
| `popup.html` | 341 bytes |
| `popup.js` | 166,366 bytes |
| `popup.js.LICENSE.txt` | 971 bytes (webpack legal notice — harmless) |
| `service-worker.js` | 4,657 bytes |
| `content-script.js` | 140 bytes |
| `icons/icon-16.png` | 214 bytes |
| `icons/icon-32.png` | 544 bytes |
| `icons/icon-48.png` | 1,146 bytes |
| `icons/icon-128.png` | 6,786 bytes |

---

## Step 1: dist/ Cleanliness

| Check | Result |
|---|---|
| No `.ts` / `.tsx` files | PASS — none found |
| No `.map` files | PASS — none found |
| No `node_modules/` | PASS — not present |
| No `.env*` files | PASS — not present |
| No `package.json` / `tsconfig.json` / `webpack.config.js` | PASS — not present |
| No `src/` directory | PASS — not present |
| Required 9 files + LICENSE.txt present | PASS |

---

## §4.1 Metadata

| Item | Requirement | Status | Evidence |
|---|---|---|---|
| Extension Name | "ConduitScore" | PASS | manifest.json `"name": "ConduitScore"` |
| Short Name | "ConduitScore" (≤12 chars, is 12) | PASS | manifest.json `"short_name": "ConduitScore"` |
| Version | "1.0.0" | PASS | manifest.json `"version": "1.0.0"` |
| Description (short) | ≤132 chars | PASS | manifest.json description = 130 chars |
| Homepage URL | https://conduitscore.com | PASS | manifest.json `"homepage_url": "https://conduitscore.com"` |
| Manifest Version | 3 (MV3) | PASS | `"manifest_version": 3` |
| CSP | script-src 'self'; object-src 'self' | PASS | Present in manifest.json |
| Minimum Chrome version | 109 | PASS | `"minimum_chrome_version": "109"` |

---

## §4.4 Icons

| Icon | Required Size | Actual Size | Format | Status |
|---|---|---|---|---|
| icon-16.png | 16×16 | 16×16 RGBA PNG | PNG | PASS |
| icon-32.png | 32×32 | 32×32 RGBA PNG | PNG | PASS |
| icon-48.png | 48×48 | 48×48 RGBA PNG | PNG | PASS |
| icon-128.png | 128×128 | 128×128 RGBA PNG | PNG | PASS |

All icons verified via `file` command — exact pixel dimensions confirmed.

---

## §4.5 Screenshots

| Item | Status |
|---|---|
| `store-assets/screenshots/` directory | NOT PRESENT — directory does not exist |
| Screenshots available | ASSET PENDING (task-011 not yet completed) |

**Note:** At least 1 screenshot (1280×720 PNG) required before CWS submission. task-011 must complete first.

---

## §4.7 Additional CWS Requirements

| Item | Status |
|---|---|
| Verified Developer Account | N/A — requires human action at CWS console |
| Payment method on file ($5 fee) | N/A — requires human action |
| Accepted CWS Program Policies | N/A — requires human action |
| Category Selection (Productivity / Developer Tools) | N/A — set during CWS form fill |
| Language: English | N/A — set during CWS form fill |
| Availability: Worldwide | N/A — set during CWS form fill |

---

## Warnings

1. `host_permissions` includes `https://staging.conduitscore.com/*` and `https://*.conduitscore.com/*` in addition to the production domain. CWS reviewers may flag the wildcard subdomain entry (`https://*.conduitscore.com/*`) as broader than necessary. Consider restricting to `https://conduitscore.com/*` only before submission if the staging endpoint is not required at runtime.

2. Screenshots are missing (task-011 pending). CWS requires at least 1 screenshot — **do not submit until screenshots are ready**.

3. Privacy policy page at `https://conduitscore.com/privacy-policy` must be live and accessible before submission (task-012 completed, but verify it is deployed).

---

## Final Verdict

**READY-TO-SUBMIT: NO — BLOCKED on screenshots (task-011)**

Once task-011 delivers screenshots, all remaining blockers are cleared and the package is submission-ready.

| Requirement | Status |
|---|---|
| ZIP created, correct structure | PASS |
| ZIP size < 1 MB | PASS (63.48 KB) |
| No forbidden files | PASS |
| All 4 icons correct dimensions | PASS |
| manifest.json valid MV3 | PASS |
| Screenshots ≥1 available | BLOCKED |
| Privacy policy URL live | VERIFY before submit |
| CWS developer account | Human action required |
