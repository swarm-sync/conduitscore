import { test, expect } from '@playwright/test';

// ============================================================
// 07 — API Contract & Accessibility
// Full API contract verification (health, scan, auth, stripe),
// rate limiter, score range, and accessibility checks.
//
// Each scan API test uses a unique X-Forwarded-For header so
// tests don't exhaust the shared per-IP rate limit pool that
// the scanner UI tests use.
//
// IMPORTANT: The test environment's Node.js fetch cannot reach
// https:// URLs due to SSL certificate chain issues in this env.
// All scan API tests use http://example.com which IS reachable.
// ============================================================

const uniqueIp = () => `api07-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const SCAN_URL = 'http://example.com';

// ----------------------------------------------------------------
// Health endpoint
// ----------------------------------------------------------------

test.describe('API — /api/health', () => {
  test('GET /api/health returns {"status":"ok"}', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
  });
});

// ----------------------------------------------------------------
// Scan endpoint — full contract
// ----------------------------------------------------------------

test.describe('API — /api/scan contract', () => {
  test('POST /api/scan with valid URL returns 200 with full result shape', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: SCAN_URL },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(typeof body.overallScore).toBe('number');
    expect(Array.isArray(body.categories)).toBe(true);
    expect(Array.isArray(body.issues)).toBe(true);
    expect(Array.isArray(body.fixes)).toBe(true);
    expect(typeof body.scannedAt).toBe('string');
  });

  test('overallScore is between 0 and 100', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: SCAN_URL },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.overallScore).toBeGreaterThanOrEqual(0);
    expect(body.overallScore).toBeLessThanOrEqual(100);
  });

  test('categories array contains at least 7 entries', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: SCAN_URL },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.categories.length).toBeGreaterThanOrEqual(7);
  });

  test('scannedAt is an ISO 8601 date string', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: SCAN_URL },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    const parsed = new Date(body.scannedAt);
    expect(isNaN(parsed.getTime())).toBe(false);
  });

  test('POST /api/scan with "not-a-url" returns 400 with error', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: 'not-a-url' },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(typeof body.error).toBe('string');
  });

  test('POST /api/scan with empty string URL returns 400', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: '' },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/scan with missing URL body returns 400', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: {},
      headers: { 'X-Forwarded-For': uniqueIp() },
    });
    expect(response.status()).toBe(400);
  });
});

// ----------------------------------------------------------------
// Rate limiter
// ----------------------------------------------------------------

test.describe('API — rate limiter', () => {
  test('15 rapid requests from same IP trigger at least one 429', async ({ request }) => {
    // Use a dedicated unique IP so we don't drain the shared test pool.
    // The rate limiter allows 10 requests per 60s per IP.
    const testIp = `ratelimit-test-${Date.now()}`;

    const promises = Array.from({ length: 15 }, () =>
      request.post('/api/scan', {
        data: { url: SCAN_URL },
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': testIp,
        },
      }).catch(() => null)
    );

    const results = await Promise.all(promises);
    const statuses = results
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .map((r) => r.status());

    const has429 = statuses.includes(429);
    expect(has429).toBe(true);
  });
});

// ----------------------------------------------------------------
// Auth API
// ----------------------------------------------------------------

test.describe('API — /api/auth', () => {
  test('GET /api/auth/providers returns google and email providers', async ({ request }) => {
    const response = await request.get('/api/auth/providers');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('google');
    expect(body).toHaveProperty('email');
    expect(body.google).toHaveProperty('id', 'google');
    expect(body.email).toHaveProperty('id', 'email');
  });

  test('GET /api/auth/session returns 200 with object', async ({ request }) => {
    const response = await request.get('/api/auth/session');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body).toBe('object');
  });
});

// ----------------------------------------------------------------
// Stripe API
// ----------------------------------------------------------------

test.describe('API — /api/stripe/checkout', () => {
  test('POST with tier "starter" returns {url} starting with https://checkout.stripe.com', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'starter' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.url).toBe('string');
    expect(body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
  });

  test('POST with tier "pro" returns stripe checkout url', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'pro' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
  });

  test('POST with tier "agency" returns stripe checkout url', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'agency' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
  });

  test('POST with tier "bad" returns 400 with {error: string}', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'bad' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(typeof body.error).toBe('string');
  });

  test('POST with missing tier returns 400', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: {},
    });
    expect(response.status()).toBe(400);
  });
});

// ----------------------------------------------------------------
// Accessibility — structural checks
// ----------------------------------------------------------------

test.describe('Accessibility — heading hierarchy', () => {
  test('homepage has exactly one h1', async ({ page }) => {
    await page.goto('/');
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });

  test('all images on homepage have alt text or are aria-hidden', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaHidden = await img.getAttribute('aria-hidden');
      // Either has alt/aria-label or is marked aria-hidden="true" (decorative)
      expect(alt !== null || ariaLabel !== null || ariaHidden === 'true').toBe(true);
    }
  });

  test('hero scan form input has an accessible label', async ({ page }) => {
    await page.goto('/');
    // Two ScanForm instances exist on the homepage (both share id="hero-url-input")
    // so use .first() to avoid strict mode violations
    const input = page.locator('#hero-url-input').first();
    await expect(input).toBeVisible();

    // Each label is a sr-only element associated via htmlFor="hero-url-input"
    const labelCount = await page.locator('label[for="hero-url-input"]').count();
    expect(labelCount).toBeGreaterThan(0);
  });

  test('keyboard tab order: url input → scan button', async ({ page }) => {
    await page.goto('/');

    // Two inputs exist on page — target the first one (hero scan form)
    const urlInput = page.locator('#hero-url-input').first();
    await urlInput.focus();

    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    // After tabbing from the URL input the scan button should be focused
    expect(focused).toMatch(/Scan website|Scanning/i);
  });
});

test.describe('Accessibility — page load performance', () => {
  test('homepage loads and h1 is visible within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
    await expect(page.locator('h1')).toBeVisible();
  });
});
