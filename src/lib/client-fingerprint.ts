"use client";

// Shared constant — must stay in this client-safe file so scan-result/page.tsx
// can import it without pulling in server-only crypto/prisma from free-tier-abuse.ts.
export const FINGERPRINT_HEADER = "x-conduitscore-fingerprint";

const STORAGE_KEY = "conduitscore_device_fingerprint_v1";

let fingerprintPromise: Promise<string> | null = null;

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStableDeviceId(): string {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const next = randomId();
  window.localStorage.setItem(STORAGE_KEY, next);
  return next;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function getClientFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "";
  if (fingerprintPromise) return fingerprintPromise;

  fingerprintPromise = (async () => {
    const deviceId = getStableDeviceId();
    const payload = [
      deviceId,
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      String(window.screen.width),
      String(window.screen.height),
      String(window.screen.colorDepth),
      String(navigator.hardwareConcurrency ?? 0),
      String(navigator.maxTouchPoints ?? 0),
    ].join("|");

    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
    return toHex(digest);
  })();

  return fingerprintPromise;
}
