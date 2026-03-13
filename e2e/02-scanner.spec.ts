import { test, expect } from '@playwright/test';

// Helper: locate the scan button by aria-label (two exist on page — use first)
const scanButtonLocator = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'Scan website for AI visibility' }).first();

test.describe('Scanner Functionality', () => {
  test('should perform full scan on landing page', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });
    await expect(page).toHaveURL(/\/scan-result/);

    // Results page shows "Scan Results" section label and scanned URL
    await expect(page.getByText('Scan Results').first()).toBeVisible();
    await expect(page.getByText('example.com').first()).toBeVisible();
  });

  test('should display score on results page', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://github.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });

    await expect(page.getByText('AI Visibility Score').first()).toBeVisible();
    const scorePattern = page.locator('text=/\\d+\\/100/');
    await expect(scorePattern).toBeVisible();
  });

  test('should display category breakdown', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });

    await expect(page.getByText('Crawler Access').first()).toBeVisible();
    await expect(page.getByText('Structured Data').first()).toBeVisible();
    await expect(page.getByText('Content Structure').first()).toBeVisible();
    await expect(page.getByText('LLMs.txt').first()).toBeVisible();
  });

  test('should allow switching between tabs', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });

    // Tabs use role="tab"
    const issuesTab = page.getByRole('tab', { name: /issues/i });
    await issuesTab.click();
    await expect(page.locator('[role="tabpanel"]').first()).toBeVisible();

    const fixesTab = page.getByRole('tab', { name: /fixes/i });
    await fixesTab.click();
    await expect(page.locator('[role="tabpanel"]').first()).toBeVisible();

    const overviewTab = page.getByRole('tab', { name: /overview/i });
    await overviewTab.click();
    await expect(page.getByText('AI Visibility Score').first()).toBeVisible();
  });

  test('should allow scanning another URL', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });

    // "Scan Another URL" button navigates back to homepage
    await page.getByRole('button', { name: /Scan Another URL/i }).click();
    await expect(page).toHaveURL('/');

    const homeUrlInput = page.locator('input[type="url"]').first();
    await expect(homeUrlInput).toBeVisible();
    await expect(homeUrlInput).toHaveValue('');
  });

  test('should handle invalid URL gracefully', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('');

    await scanButtonLocator(page).click();

    await expect(page.getByText('Please enter a URL')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('should support Enter key to scan', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await urlInput.press('Enter');

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });
    await expect(page).toHaveURL(/\/scan-result/);
  });

  test('should show loading state during scan', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    // Click and immediately check for loading state
    await scanButtonLocator(page).click();

    // Button aria-label changes to "Scanning in progress" during load
    await expect(
      page.getByRole('button', { name: 'Scanning in progress' }).first()
    ).toBeVisible({ timeout: 5000 });

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });
  });
});

test.describe('Scanner - Mobile', () => {
  test('should scan on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });
    await expect(page.getByText('Scan Results').first()).toBeVisible();
  });

  test('should display results tab navigation on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await scanButtonLocator(page).click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });

    const overviewTab = page.getByRole('tab', { name: /overview/i });
    const issuesTab = page.getByRole('tab', { name: /issues/i });
    const fixesTab = page.getByRole('tab', { name: /fixes/i });

    await expect(overviewTab).toBeVisible();
    await expect(issuesTab).toBeVisible();
    await expect(fixesTab).toBeVisible();
  });
});
