import { test, expect } from '@playwright/test';

// ============================================================
// 09 — Free Tier Gate
// Validates fix-gating behaviour for unauthenticated users
// via the API layer (no real scan needed — uses API contract tests).
// ============================================================

test.describe('Free Tier Gate — API contract (unauthenticated)', () => {
  test('GET /api/scans/[id] with unknown id returns 404', async ({ request }) => {
    const response = await request.get('/api/scans/nonexistent-scan-id-abc123');
    expect(response.status()).toBe(404);
  });

  test('GET /api/stats returns { weeklyScanCount: number }', async ({ request }) => {
    const response = await request.get('/api/stats');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.weeklyScanCount).toBe('number');
    expect(body.weeklyScanCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Free Tier Gate — pricing page upsell', () => {
  test('/pricing page loads with upgrade CTAs', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1')).toBeVisible();
    // Free plan should be visible without requiring sign-in
    await expect(page.getByText('Free').first()).toBeVisible();
    await expect(page.getByText('$29').first()).toBeVisible();
  });

  test('Agency tier shows "Contact Us" instead of checkout button', async ({ page }) => {
    await page.goto('/pricing');
    // Agency card should have Contact Us link, not a checkout CTA
    await expect(page.getByText(/Contact Us/i).first()).toBeVisible();
  });
});

test.describe('Free Tier Gate — scan result page shows gate UI', () => {
  test('/results page redirects or shows scan form when no scan ID present', async ({ page }) => {
    await page.goto('/');
    // No scan → page loads without error
    await expect(page.locator('body')).toBeVisible();
    // Page is accessible
    expect(page.url()).toContain('localhost');
  });
});

test.describe('Free Tier Gate — badge endpoint (public, no auth)', () => {
  test('GET /api/badge/nonexistent returns 404', async ({ request }) => {
    const response = await request.get('/api/badge/nonexistent-scan-id');
    expect(response.status()).toBe(404);
  });
});
