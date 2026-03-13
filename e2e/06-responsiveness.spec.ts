import { test, expect } from '@playwright/test';

// ============================================================
// 06 — Responsiveness
// Tests layout at 375px (mobile), 768px (tablet), 1280px (desktop).
// Verifies mobile menu visibility, scan form usability, heading
// readability, and touch target sizes.
// ============================================================

test.describe('Mobile — 375px viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('h1 is visible and not overflowing on mobile', async ({ page }) => {
    await page.goto('/');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    const scrollWidth = await h1.evaluate((el) => el.scrollWidth);
    const clientWidth = await h1.evaluate((el) => el.clientWidth);
    // Allow 1px tolerance for sub-pixel rendering
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('scan form is visible and usable on mobile', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toBeEditable();

    await urlInput.fill('https://mobile-test.com');
    await expect(urlInput).toHaveValue('https://mobile-test.com');

    const scanBtn = page.getByRole('button', { name: 'Scan website for AI visibility' }).first();
    await expect(scanBtn).toBeVisible();
    await expect(scanBtn).toBeEnabled();
  });

  test('scan button meets 44px touch target on mobile', async ({ page }) => {
    await page.goto('/');

    const scanBtn = page.getByRole('button', { name: 'Scan website for AI visibility' }).first();
    const box = await scanBtn.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('document does not overflow horizontally on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    // Allow 2px tolerance
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test('key content sections are visible on mobile', async ({ page }) => {
    await page.goto('/');

    // Hero
    await expect(page.locator('h1')).toBeVisible();

    // Features (category cards section)
    await expect(page.getByText('Crawler Access').first()).toBeVisible();

    // How It Works
    await expect(page.getByText('How It Works').first()).toBeVisible();
  });
});

test.describe('Tablet — 768px viewport', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('h1 is visible on tablet', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('scan form is visible on tablet', async ({ page }) => {
    await page.goto('/');
    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();
  });

  test('category cards are visible on tablet', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Crawler Access').first()).toBeVisible();
    await expect(page.getByText('Structured Data').first()).toBeVisible();
  });

  test('at least one nav link is visible on tablet', async ({ page }) => {
    await page.goto('/');

    const pricingLink = page.getByRole('link', { name: 'Pricing' }).first();
    const signinLink = page.getByRole('link', { name: 'Sign In' }).first();
    const scannerLink = page.getByRole('link', { name: 'Scanner' }).first();

    const anyVisible =
      (await pricingLink.isVisible().catch(() => false)) ||
      (await signinLink.isVisible().catch(() => false)) ||
      (await scannerLink.isVisible().catch(() => false));

    expect(anyVisible).toBe(true);
  });

  test('document does not overflow horizontally on tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });
});

test.describe('Desktop — 1280px viewport', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('full nav links are all visible on desktop', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Scanner' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
  });

  test('h1 is visible and large on desktop', async ({ page }) => {
    await page.goto('/');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    const box = await h1.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
  });

  test('scan form is fully visible and wide on desktop', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();

    const box = await urlInput.boundingBox();
    // On desktop, input should have reasonable width
    expect(box!.width).toBeGreaterThan(200);
  });
});

test.describe('Orientation — landscape mobile', () => {
  test.use({ viewport: { width: 812, height: 375 } });

  test('h1 visible in landscape and document not overflowing', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });
});

test.describe('Pricing page — responsiveness', () => {
  test('pricing page cards are visible on 375px mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');

    await expect(page.locator('h1')).toBeVisible();
    // At least one plan heading should be visible
    for (const name of ['Starter', 'Pro']) {
      await expect(page.getByRole('heading', { name }).first()).toBeVisible();
    }
  });
});
