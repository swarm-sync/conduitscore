import { test, expect } from '@playwright/test';

// ============================================================
// 02 — Scanner Functionality
// Tests real scan behaviour: UI flow, result verification,
// invalid URL handling, API contract assertions.
//
// IMPORTANT: This server cannot reach https:// URLs via Node.js
// fetch due to SSL certificate chain issues in the test env.
// All scan tests use http://example.com which is reachable.
//
// Scanner UI tests are serialised so they don't run concurrently
// and exhaust the per-IP rate limit (10 req/60s).
// ============================================================

test.setTimeout(45000);

const SCAN_URL = 'http://example.com';

const scanButtonLocator = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'Scan website for AI visibility' }).first();

// ----------------------------------------------------------------
// Scanner UI — serialised to avoid rate limit exhaustion
// ----------------------------------------------------------------

test.describe.serial('Scanner UI — full scan flow', () => {
  test('typing URL and clicking Start Scan navigates to /scan-result', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });
    await expect(page).toHaveURL(/\/scan-result/);
  });

  test('scan result shows a numeric score (0–100)', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });

    const scorePattern = page.locator('text=/\\d+\\/100/');
    await expect(scorePattern).toBeVisible({ timeout: 10000 });

    const scoreText = await scorePattern.first().textContent();
    const match = scoreText?.match(/(\d+)\/100/);
    expect(match).not.toBeNull();
    const scoreValue = parseInt(match![1], 10);
    expect(scoreValue).toBeGreaterThanOrEqual(0);
    expect(scoreValue).toBeLessThanOrEqual(100);
  });

  test('scan result shows category breakdown (at least 7 categories)', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });

    const expectedCategories = [
      'Crawler Access',
      'Structured Data',
      'Content Structure',
      'LLMs.txt',
      'Technical Health',
      'Citation Signals',
      'Content Quality',
    ];

    for (const category of expectedCategories) {
      await expect(page.getByText(category).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('scan result shows issues and fixes tab labels', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });

    await expect(page.getByRole('tab', { name: /issues/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /fixes/i })).toBeVisible();
  });

  test('tab switching works: overview → issues → fixes → overview', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });

    await page.getByRole('tab', { name: /issues/i }).click();
    await expect(page.locator('#tabpanel-issues')).toBeVisible();

    await page.getByRole('tab', { name: /fixes/i }).click();
    await expect(page.locator('#tabpanel-fixes')).toBeVisible();

    await page.getByRole('tab', { name: /overview/i }).click();
    await expect(page.locator('#tabpanel-overview')).toBeVisible();
    await expect(page.locator('text=/\\d+\\/100/').first()).toBeVisible();
  });

  test('"Scan Another URL" button returns to homepage with empty input', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });

    await page.getByRole('button', { name: /Scan Another URL/i }).click();
    await expect(page).toHaveURL('/');

    const homeInput = page.locator('input[type="url"]').first();
    await expect(homeInput).toBeVisible();
    await expect(homeInput).toHaveValue('');
  });

  test('pressing Enter in scan input triggers the scan', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await urlInput.press('Enter');

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });
    await expect(page).toHaveURL(/\/scan-result/);
  });

  test('button shows "Scanning in progress" aria-label during scan', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);

    await scanButtonLocator(page).click();

    await expect(
      page.getByRole('button', { name: 'Scanning in progress' }).first()
    ).toBeVisible({ timeout: 5000 });

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });
  });
});

// ----------------------------------------------------------------
// Input validation — no network call needed
// ----------------------------------------------------------------

test.describe('Scanner UI — input validation', () => {
  test('empty URL shows "Please enter a URL" and stays on homepage', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('');
    await scanButtonLocator(page).click();

    await expect(page.getByText('Please enter a URL')).toBeVisible();
    await expect(page).toHaveURL('/');
  });
});

// ----------------------------------------------------------------
// API contract tests — unique IPs avoid rate-limit pool exhaustion
// ----------------------------------------------------------------

test.describe('Scanner API — contract', () => {
  const uniqueIp = () => `api02-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  test('POST /api/scan with http://example.com returns 200 with overallScore', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: 'http://example.com' },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.overallScore).toBe('number');
    expect(body.overallScore).toBeGreaterThanOrEqual(0);
    expect(body.overallScore).toBeLessThanOrEqual(100);
  });

  test('POST /api/scan returns categories array with 7+ entries', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: 'http://example.com' },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.categories)).toBe(true);
    expect(body.categories.length).toBeGreaterThanOrEqual(7);
  });

  test('POST /api/scan with "not-a-url" returns 400', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: 'not-a-url' },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('POST /api/scan with missing URL returns 400', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: {},
      headers: { 'X-Forwarded-For': uniqueIp() },
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/scan with empty string URL returns 400', async ({ request }) => {
    const response = await request.post('/api/scan', {
      data: { url: '' },
      headers: { 'X-Forwarded-For': uniqueIp() },
    });
    expect(response.status()).toBe(400);
  });
});

// ----------------------------------------------------------------
// Mobile scanner — serialised
// ----------------------------------------------------------------

test.describe.serial('Scanner — mobile viewport', () => {
  test('scan completes and shows results on 375px viewport', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 38000 });
    await expect(page.getByText('Scan Results').first()).toBeVisible();
  });
});
