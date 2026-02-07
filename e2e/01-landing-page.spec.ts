import { test, expect } from '@playwright/test';

test.describe('Landing Page - Desktop', () => {
  test('should load homepage with all sections', async ({ page }) => {
    await page.goto('/');

    // Hero section
    await expect(page.locator('h1')).toContainText('Your AI Visibility Score in 30 Seconds');
    await expect(page.getByText('SEO was for Google').first()).toBeVisible();

    // Scanner form
    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();
    await expect(page.locator('button:has-text("Scan Free")')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Features
    await expect(page.getByText('7 Categories. One Score.')).toBeVisible();
    await expect(page.getByText('Crawler Access').first()).toBeVisible();
    await expect(page.getByText('Structured Data').first()).toBeVisible();
    await expect(page.getByText('Content Structure').first()).toBeVisible();
    await expect(page.getByText('LLMs.txt')).toBeVisible();
  });

  test('should display how-it-works section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('How It Works')).toBeVisible();
    await expect(page.getByText('Enter Your URL')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Get Your Score' })).toBeVisible();
    await expect(page.getByText('Copy-Paste Fixes')).toBeVisible();
  });

  test('should have working navigation header', async ({ page }) => {
    await page.goto('/');

    // Header links
    await expect(page.getByRole('link', { name: /AgentOptimize/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Features/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Pricing/ })).toBeVisible();
  });

  test('should navigate to features section via link', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Features/ }).click();
    await expect(page.getByText('7 Categories')).toBeInViewport();
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Pricing/ }).click();
    await expect(page).toHaveURL('/pricing');
    await expect(page.getByText('Pricing').first()).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Sign In/ }).click();
    await expect(page).toHaveURL(/\/signin/);
  });
});

test.describe('Landing Page - Mobile', () => {
  test('should be responsive on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Hero headline visible
    await expect(page.locator('h1')).toContainText('Your AI Visibility Score');

    // Scanner form visible and tappable
    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();
    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await expect(scanButton).toBeVisible();
  });

  test('should have readable text on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Scroll to sections
    await page.locator('main').evaluate(el => el.scrollIntoView());
    await page.waitForTimeout(500);

    await expect(page.getByText('7 Categories')).toBeVisible();
    await expect(page.getByText('How It Works')).toBeVisible();
  });
});

test.describe('Landing Page - Tablet', () => {
  test('should be responsive on tablet', async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Your AI Visibility Score');

    // Features grid should be visible
    await expect(page.getByText('Crawler Access').first()).toBeVisible();
  });
});
