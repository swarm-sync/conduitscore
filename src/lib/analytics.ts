/**
 * Client-side analytics helper. When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
 * and gtag is loaded (see `layout.tsx`), events go to GA4. Otherwise, in
 * development only, events are logged to the console.
 *
 * GA4 custom dimensions for `scan_submit_failure`: register event parameters
 * `reason`, `http_status`, and `source` in the GA4 UI — see `docs/ga4-custom-dimensions.md`.
 */
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined | null>
) {
  if (typeof window === "undefined") return;

  const payload: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        payload[key] = value;
      }
    }
  }

  if (typeof window.gtag === "function" && GA_ID) {
    window.gtag("event", eventName, payload);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[ConduitScore analytics]", eventName, payload);
  }
}
