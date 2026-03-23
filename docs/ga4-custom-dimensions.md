# GA4: register custom dimensions for ConduitScore events

Do this in the **Google Analytics 4** property that matches your `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

**Why:** The site sends event parameters (`reason`, `http_status`, `source`) on failed scans. GA4 only shows them cleanly in standard reports after you register **event-scoped custom dimensions** with the **exact same parameter names** as in code.

## Steps (GA4 UI)

1. Open [Google Analytics](https://analytics.google.com) → select the **ConduitScore** property.
2. **Admin** (gear) → **Data display** → **Custom definitions**.
3. Click **Create custom dimension** (or **Custom dimensions** → **Create**).
4. Create **three** dimensions using this table:

| Dimension name (friendly label) | Scope | Event parameter | Suggested description |
|--------------------------------|-------|-----------------|------------------------|
| Scan failure reason | Event | `reason` | High-level category: `scan_limit`, `api_error`, or `network`. |
| Scan failure HTTP status | Event | `http_status` | Response status code when the API returned an error (0 if unknown / network). |
| Scan form source | Event | `source` | Where the scan was started: `hero` or `dashboard`. |

5. Save each dimension. New data may take **24–48 hours** to appear in some reports; use **Admin → DebugView** (with GA debug mode) for same-day verification.

## Event names (reference)

| Event | When | Notable parameters |
|-------|------|---------------------|
| `scan_submit_attempt` | User starts a scan | `source` |
| `scan_submit_success` | Scan API succeeded | `source` |
| `scan_submit_failure` | Limit, API error, or network | `source`, `http_status`, `reason` |
| `chip_click` | Sample URL chip fills the field | `domain`, `interaction` |
| `chip_demo_state` | Second chip click opens demo | `domain`, `interaction` |

Optional: register `domain` and `interaction` the same way if you want chip events broken down in reports.

## Code reference

- Client helper: `src/lib/analytics.ts`
- Scan events: `src/components/scan/scan-form.tsx`
- Chip events: `src/components/scan/sample-chip-row.tsx`
