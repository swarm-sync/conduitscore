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

test.setTimeout(20000);

const SCAN_URL = 'https://example.com';

const scanButtonLocator = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'Scan website for AI visibility' }).first();

// Mocked scan result — used by all UI flow tests so they are fast
// and not dependent on external network availability.
const MOCK_SCAN_RESULT = {
  id: 'mock-scan-123',
  status: 'completed',
  url: SCAN_URL,
  overallScore: 72,
  categories: [
    { name: 'Crawler Access', score: 15, maxScore: 15, issues: [], fixes: [] },
    { name: 'Structured Data', score: 12, maxScore: 20, issues: [{ id: 'sd-1', category: 'Structured Data', severity: 'warning', title: 'No JSON-LD found', description: 'Add JSON-LD schema markup.' }], fixes: [{ issueId: 'sd-1', title: 'Add JSON-LD', description: 'Add schema markup', code: '<script type="application/ld+json">{}</script>', language: 'html' }] },
    { name: 'Content Structure', score: 10, maxScore: 15, issues: [], fixes: [] },
    { name: 'LLMs.txt', score: 0, maxScore: 10, issues: [{ id: 'llm-1', category: 'LLMs.txt', severity: 'info', title: 'No llms.txt found', description: 'Consider adding llms.txt' }], fixes: [] },
    { name: 'Technical Health', score: 15, maxScore: 15, issues: [], fixes: [] },
    { name: 'Citation Signals', score: 10, maxScore: 15, issues: [], fixes: [] },
    { name: 'Content Quality', score: 10, maxScore: 10, issues: [], fixes: [] },
  ],
  issues: [
    { id: 'sd-1', category: 'Structured Data', severity: 'warning', title: 'No JSON-LD found', description: 'Add JSON-LD schema markup.' },
    { id: 'llm-1', category: 'LLMs.txt', severity: 'info', title: 'No llms.txt found', description: 'Consider adding llms.txt' },
  ],
  fixes: [
    { issueId: 'sd-1', title: 'Add JSON-LD', description: 'Add schema markup', code: '<script type="application/ld+json">{}</script>', language: 'html' },
  ],
  scannedAt: new Date().toISOString(),
  metadata: { scanId: 'mock-scan-123', statusCode: 200, loadTimeMs: 500, finalUrl: SCAN_URL, hasRobotsTxt: true, hasLlmsTxt: false },
  proof: null,
};

async function mockScanApi(page: import('@playwright/test').Page) {
  await page.route('**/api/scan', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SCAN_RESULT),
    });
  });
  // Also mock the scans/{id} endpoint for the result page to load
  await page.route('**/api/scans/mock-scan-123', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SCAN_RESULT),
    });
  });
}

// ----------------------------------------------------------------
// Scanner UI — uses mocked API for speed and reliability
// ----------------------------------------------------------------

test.describe('Scanner UI — full scan flow', () => {
  test('typing URL and clicking Start Scan navigates to /scan-result', async ({ page }) => {
    await mockScanApi(page);
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/scan-result/);
  });

  test('scan result shows a numeric score (0–100)', async ({ page }) => {
    await mockScanApi(page);
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });

    // Score should appear as a number or "72/100" style pattern
    const scoreEl = page.locator('text=/\\d+\\/100/').first();
    await expect(scoreEl).toBeVisible({ timeout: 8000 });

    const scoreText = await scoreEl.textContent();
    const match = scoreText?.match(/(\d+)\/100/);
    expect(match).not.toBeNull();
    const scoreValue = parseInt(match![1], 10);
    expect(scoreValue).toBeGreaterThanOrEqual(0);
    expect(scoreValue).toBeLessThanOrEqual(100);
  });

  test('scan result shows category breakdown (all 7 categories)', async ({ page }) => {
    await mockScanApi(page);
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });

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
      await expect(page.getByText(category).first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('scan result shows issues and fixes tab labels', async ({ page }) => {
    await mockScanApi(page);
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });

    await expect(page.getByRole('tab', { name: /issues/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /fixes/i })).toBeVisible();
  });

  test('tab switching works: overview → issues → fixes → overview', async ({ page }) => {
    await mockScanApi(page);
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });

    await page.getByRole('tab', { name: /issues/i }).click();
    await expect(page.locator('#tabpanel-issues')).toBeVisible();

    await page.getByRole('tab', { name: /fixes/i }).click();
    await expect(page.locator('#tabpanel-fixes')).toBeVisible();

    await page.getByRole('tab', { name: /overview/i }).click();
    await expect(page.locator('#tabpanel-overview')).toBeVisible();
    await expect(page.locator('text=/\\d+\\/100/').first()).toBeVisible();
  });

  test('pressing Enter in scan input triggers the scan', async ({ page }) => {
    await mockScanApi(page);
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await urlInput.press('Enter');

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/scan-result/);
  });

  test('button shows loading state ("Scanning..." text) during scan', async ({ page }) => {
    // Use a slow mock to catch the loading state
    await page.route('**/api/scan', async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SCAN_RESULT),
      });
    });
    await page.route('**/api/scans/mock-scan-123', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SCAN_RESULT) });
    });

    await page.goto('/');
    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    // During the 800ms delay the button should show loading
    await expect(page.getByText('Scanning...').first()).toBeVisible({ timeout: 3000 });

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });
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
// Mobile scanner — uses mock API
// ----------------------------------------------------------------

test.describe('Scanner — mobile viewport', () => {
  test('scan completes and shows results on 375px viewport', async ({ page }) => {
    await mockScanApi(page);
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill(SCAN_URL);
    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });
    // Score or category should be visible
    await expect(page.locator('text=/\\d+\\/100/').first()).toBeVisible({ timeout: 8000 });
  });
});
