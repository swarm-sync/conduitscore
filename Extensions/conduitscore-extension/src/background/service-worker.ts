// src/background/service-worker.ts

import type {
  ScanRequest,
  ScanResult,
  CacheEntry,
  BadgeState,
  MessageResponse,
  ScoreApiResponse,
} from '../shared/types';
import {
  CONDUITSCORE_API_BASE,
  CACHE_TTL_MS,
  CACHE_KEY_PREFIX,
  BADGE_KEY_PREFIX,
} from '../shared/constants';
import { normalizeDomain } from '../shared/utils';

// ─── Lifecycle: onInstalled ───────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  // Register context menus
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'conduitscore-check-link',
      title: 'Check ConduitScore for this link',
      contexts: ['link'],
    });
    chrome.contextMenus.create({
      id: 'conduitscore-check-page',
      title: 'Check ConduitScore for this page',
      contexts: ['page', 'frame'],
    });
  });

  // Initialize storage schema version
  await chrome.storage.local.set({ __schema_version: 1 });
});

// ─── Context Menu Handler ────────────────────────────────────────────────────

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let rawDomain: string | null = null;

  if (info.menuItemId === 'conduitscore-check-link' && info.linkUrl) {
    try {
      rawDomain = new URL(info.linkUrl).hostname;
    } catch {
      // Malformed URL in linkUrl — do nothing
      return;
    }
  } else if (info.menuItemId === 'conduitscore-check-page' && tab?.url) {
    try {
      rawDomain = new URL(tab.url).hostname;
    } catch {
      return;
    }
  }

  if (!rawDomain) return;

  const domain = normalizeDomain(rawDomain);
  if (!domain) return;

  // Open popup is not possible from context menu in MV3 without user gesture.
  // Instead: perform the scan and update the badge. The user can click the
  // extension icon to see full results in the popup.
  const result = await performScan(domain);
  if (tab?.id != null) {
    await updateBadgeForTab(tab.id, domain, result);
  }
});

// ─── Message Handler ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (
    message: ScanRequest,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (message.type === 'SCAN_DOMAIN') {
      handleScanRequest(message.domain, message.tabId)
        .then(sendResponse)
        .catch(() => {
          sendResponse({
            success: false,
            error: 'server_error',
            message: 'Unexpected error in service worker.',
          });
        });
      // Return true to keep the message channel open for async response
      return true;
    }
    if (message.type === 'GET_ACTIVE_TAB_DOMAIN') {
      getActiveTabDomain().then(sendResponse).catch(() => {
        sendResponse({ success: false, domain: null });
      });
      return true;
    }
    return false;
  }
);

// ─── Tab Event Listeners (badge restoration) ─────────────────────────────────

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await restoreBadgeForTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    await restoreBadgeForTab(tabId);
  }
});

// ─── Core: Scan Handler ───────────────────────────────────────────────────────

async function handleScanRequest(
  rawDomain: string,
  tabId?: number
): Promise<MessageResponse> {
  const domain = normalizeDomain(rawDomain);

  if (!domain) {
    return {
      success: false,
      error: 'invalid_domain',
      message:
        'The domain format is not valid. Enter a hostname like example.com without http:// or a path.',
    };
  }

  const result = await performScan(domain);

  if (tabId != null) {
    await updateBadgeForTab(tabId, domain, result);
  }

  if (result.error) {
    return {
      success: false,
      error: result.error,
      message: result.message ?? 'An error occurred.',
      domain,
    };
  }

  return {
    success: true,
    data: result.data!,
    domain,
    cache_hit: result.cache_hit,
  };
}

// ─── Core: Perform Scan (cache-first) ────────────────────────────────────────

async function performScan(domain: string): Promise<ScanResult> {
  // 1. Check local cache
  const cached = await readCache(domain);
  if (cached) {
    return { data: cached.data, cache_hit: true, error: null };
  }

  // 2. Fetch from API
  const url = `${CONDUITSCORE_API_BASE}/api/public/domain/${encodeURIComponent(domain)}/score`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Extension-Version': chrome.runtime.getManifest().version,
      },
      // No credentials — this is a public unauthenticated endpoint
    });
  } catch (networkError) {
    return {
      data: null,
      cache_hit: false,
      error: 'network_error',
      message:
        'Could not reach ConduitScore. Check your internet connection and try again.',
    };
  }

  // 3. Parse rate limit headers regardless of status code
  const rateLimitResetEpoch = parseInt(
    response.headers.get('X-RateLimit-Reset-IP') ?? '0',
    10
  );

  // 4. Handle non-200 statuses
  if (response.status === 429) {
    const retryAfterSeconds =
      rateLimitResetEpoch > 0
        ? rateLimitResetEpoch - Math.floor(Date.now() / 1000)
        : 60;
    await writeRateLimitState(domain, retryAfterSeconds);
    return {
      data: null,
      cache_hit: false,
      error: 'rate_limited',
      message: `Too many requests. Try again in ${Math.max(retryAfterSeconds, 1)} seconds.`,
      retry_after_seconds: Math.max(retryAfterSeconds, 1),
    };
  }

  if (response.status === 404) {
    return {
      data: null,
      cache_hit: false,
      error: 'domain_not_found',
      message: `No scan results found for ${domain}. This domain may not have been scanned yet.`,
    };
  }

  if (response.status === 400) {
    return {
      data: null,
      cache_hit: false,
      error: 'invalid_domain',
      message: `The domain ${domain} is not recognized as a valid hostname.`,
    };
  }

  if (!response.ok) {
    return {
      data: null,
      cache_hit: false,
      error: 'server_error',
      message: `ConduitScore server returned an unexpected error (HTTP ${response.status}). Try again shortly.`,
    };
  }

  // 5. Parse success response
  let json: ScoreApiResponse;
  try {
    json = await response.json();
  } catch {
    return {
      data: null,
      cache_hit: false,
      error: 'server_error',
      message: 'Received an unreadable response from ConduitScore.',
    };
  }

  // 6. Write to cache
  await writeCache(domain, json);

  return { data: json, cache_hit: false, error: null };
}

// ─── Cache: Read ─────────────────────────────────────────────────────────────

async function readCache(domain: string): Promise<CacheEntry | null> {
  const key = `${CACHE_KEY_PREFIX}${domain}`;
  const result = await chrome.storage.local.get(key);
  const entry: CacheEntry | undefined = result[key];

  if (!entry) return null;

  const now = Date.now();
  if (entry.expires_at < now) {
    // Expired — delete and return null (treat as cache miss)
    await chrome.storage.local.remove(key);
    return null;
  }

  return entry;
}

// ─── Cache: Write ─────────────────────────────────────────────────────────────

async function writeCache(domain: string, data: ScoreApiResponse): Promise<void> {
  const key = `${CACHE_KEY_PREFIX}${domain}`;
  const entry: CacheEntry = {
    domain,
    data,
    cached_at: Date.now(),
    expires_at: Date.now() + CACHE_TTL_MS,
  };
  await chrome.storage.local.set({ [key]: entry });
}

// ─── Rate Limit State ─────────────────────────────────────────────────────────

async function writeRateLimitState(
  domain: string,
  retryAfterSeconds: number
): Promise<void> {
  const key = `rl_state_${domain}`;
  await chrome.storage.local.set({
    [key]: {
      blocked_until: Date.now() + retryAfterSeconds * 1000,
    },
  });
}

// ─── Badge ────────────────────────────────────────────────────────────────────

async function updateBadgeForTab(
  tabId: number,
  domain: string,
  result: ScanResult
): Promise<void> {
  let text = '?';
  let color = '#9CA3AF'; // gray — unknown / error

  if (result.data) {
    const score = result.data.score;
    text = String(score);
    color = badgeColorForScore(score);
  } else if (result.error === 'rate_limited') {
    text = '429';
    color = '#F59E0B'; // amber
  } else if (result.error === 'domain_not_found') {
    text = '—';
    color = '#6B7280'; // medium gray
  }

  await chrome.action.setBadgeText({ text, tabId });
  await chrome.action.setBadgeBackgroundColor({ color, tabId });

  // Persist badge state so it can be restored when the user re-activates this tab
  const badgeKey = `${BADGE_KEY_PREFIX}${tabId}`;
  const badgeState: BadgeState = { domain, text, color, updated_at: Date.now() };
  await chrome.storage.local.set({ [badgeKey]: badgeState });
}

async function restoreBadgeForTab(tabId: number): Promise<void> {
  const badgeKey = `${BADGE_KEY_PREFIX}${tabId}`;
  const result = await chrome.storage.local.get(badgeKey);
  const state: BadgeState | undefined = result[badgeKey];

  if (!state) {
    // No cached badge for this tab — show default (empty badge)
    await chrome.action.setBadgeText({ text: '', tabId });
    return;
  }

  await chrome.action.setBadgeText({ text: state.text, tabId });
  await chrome.action.setBadgeBackgroundColor({ color: state.color, tabId });
}

function badgeColorForScore(score: number): string {
  if (score >= 90) return '#22C55E'; // green — A
  if (score >= 75) return '#84CC16'; // lime — B
  if (score >= 60) return '#EAB308'; // yellow — C
  if (score >= 45) return '#F97316'; // orange — D
  return '#EF4444';                  // red — F
}

// ─── Active Tab Domain ────────────────────────────────────────────────────────

async function getActiveTabDomain(): Promise<{ success: boolean; domain: string | null }> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab?.url) return { success: true, domain: null };

  try {
    const raw = new URL(tab.url).hostname;
    const domain = normalizeDomain(raw);
    return { success: true, domain: domain ?? null };
  } catch {
    return { success: true, domain: null };
  }
}

