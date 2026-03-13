import { test, expect } from '@playwright/test';

test.describe('Landing Page - Desktop', () => {
  test('should load homepage with all sections', async ({ page }) => {
    await page.goto('/');

    // Hero section — h1 contains "Spectral"
    await expect(page.locator('h1')).toContainText('Spectral');

    // Subtitle text
    await expect(page.getByText('Stop optimizing for keywords alone').first()).toBeVisible();

    // Scanner form
    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();

    // Scan button — use .first() since two ScanForm instances render on the homepage
    await expect(
      page.getByRole('button', { name: 'Scan website for AI visibility' }).first()
    ).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Features heading is split across two spans: "7 categories." and "One decisive score."
    await expect(page.getByText('7 categories.').first()).toBeVisible();
    await expect(page.getByText('One decisive score.').first()).toBeVisible();

    // Category cards
    await expect(page.getByText('Crawler Access').first()).toBeVisible();
    await expect(page.getByText('Structured Data').first()).toBeVisible();
    await expect(page.getByText('Content Structure').first()).toBeVisible();
    await expect(page.getByText('LLMs.txt').first()).toBeVisible();
  });

  test('should display how-it-works section', async ({ page }) => {
    await page.goto('/');

    // Section label span "How It Works"
    await expect(page.getByText('How It Works').first()).toBeVisible();

    // H2 heading
    await expect(page.getByText('From URL to action in under a minute')).toBeVisible();

    // Steps
    await expect(page.getByText('Enter any URL').first()).toBeVisible();
    await expect(page.getByText('Score in 30 seconds').first()).toBeVisible();
    await expect(page.getByText('Copy-paste fixes').first()).toBeVisible();
  });

  test('should have working navigation header', async ({ page }) => {
    await page.goto('/');

    // Logo link has aria-label="ConduitScore home" — use .first() (appears in desktop + mobile nav)
    await expect(page.getByRole('link', { name: 'ConduitScore home' }).first()).toBeVisible();

    // Nav links — use .first() to avoid strict mode violation with mobile nav duplicate
    await expect(page.getByRole('link', { name: 'Scanner' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
  });

  test('should navigate to features section via Scanner link', async ({ page }) => {
    await page.goto('/');

    // "Scanner" nav link points to /#features — desktop nav link (first occurrence)
    await page.getByRole('link', { name: 'Scanner' }).first().click();
    // Should still be on homepage (anchor link)
    await expect(page).toHaveURL(/\//);
    await expect(page.getByText('7 categories.').first()).toBeVisible();
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Pricing' }).first().click();
    await expect(page).toHaveURL('/pricing');
    await expect(page.getByText('Pricing').first()).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Sign In' }).first().click();
    await expect(page).toHaveURL(/\/signin/);
  });
});

test.describe('Landing Page - Mobile', () => {
  test('should be responsive on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Hero headline visible — contains "Spectral"
    await expect(page.locator('h1')).toContainText('Spectral');

    // Scanner form visible and tappable
    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();

    const scanButton = page.getByRole('button', { name: 'Scan website for AI visibility' }).first();
    await expect(scanButton).toBeVisible();
  });

  test('should have readable text on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.locator('main').evaluate(el => el.scrollIntoView());
    await page.waitForTimeout(500);

    await expect(page.getByText('7 categories.').first()).toBeVisible();
    await expect(page.getByText('How It Works').first()).toBeVisible();
  });
});

test.describe('Landing Page - Tablet', () => {
  test('should be responsive on tablet', async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Spectral');

    await expect(page.getByText('Crawler Access').first()).toBeVisible();
  });
});
