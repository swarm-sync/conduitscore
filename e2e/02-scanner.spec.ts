import { test, expect } from '@playwright/test';

test.describe('Scanner Functionality', () => {
  test('should perform full scan on landing page', async ({ page }) => {
    await page.goto('/');

    // Fill in URL
    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    // Click scan button
    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    // Should navigate to results page
    await page.waitForURL('/scan-result', { timeout: 10000 });
    await expect(page).toHaveURL('/scan-result');

    // Results should be displayed
    await expect(page.locator('text=Scan Results')).toBeVisible();
    await expect(page.locator('text=example.com')).toBeVisible();
  });

  test('should display score on results page', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://github.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Score should be visible (0-100)
    const scoreText = page.locator('text=/\\d+\\/100/');
    await expect(scoreText).toBeVisible();
  });

  test('should display category breakdown', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Categories should be visible
    await expect(page.locator('text=Crawler Access')).toBeVisible();
    await expect(page.locator('text=Structured Data')).toBeVisible();
    await expect(page.locator('text=Content Structure')).toBeVisible();
    await expect(page.locator('text=LLMs.txt')).toBeVisible();
  });

  test('should allow switching between tabs', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Click issues tab
    await page.click('button:has-text("issues")');
    await expect(page.locator('text=Issues')).toBeVisible();

    // Click fixes tab
    await page.click('button:has-text("fixes")');
    await expect(page.locator('text=Add robots.txt')).toBeVisible();

    // Back to overview
    await page.click('button:has-text("overview")');
    await expect(page.locator('text=AI Visibility Score')).toBeVisible();
  });

  test('should allow scanning another URL', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Click "Scan Another URL"
    await page.click('button:has-text("Scan Another URL")');
    await expect(page).toHaveURL('/');

    // Should be back on homepage with empty form
    const homeUrlInput = page.locator('input[type="url"]').first();
    await expect(homeUrlInput).toHaveValue('');
  });

  test('should handle invalid URL gracefully', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    // Should show error message
    await expect(page.locator('text=Please enter a URL')).toBeVisible();

    // Should NOT navigate away
    await expect(page).toHaveURL('/');
  });

  test('should support Enter key to scan', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    // Press Enter
    await urlInput.press('Enter');

    // Should navigate to results
    await page.waitForURL('/scan-result', { timeout: 10000 });
    await expect(page).toHaveURL('/scan-result');
  });

  test('should show loading state during scan', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();

    // Button should change to "Scanning..."
    await scanButton.click();
    await expect(scanButton).toContainText('Scanning');

    await page.waitForURL('/scan-result');
  });
});

test.describe('Scanner - Mobile', () => {
  test('should scan on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');
    await expect(page.locator('text=Scan Results')).toBeVisible();
  });

  test('should display results tab navigation on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Tabs should be accessible
    const overviewTab = page.locator('button:has-text("overview")');
    const issuesTab = page.locator('button:has-text("issues")');
    const fixesTab = page.locator('button:has-text("fixes")');

    await expect(overviewTab).toBeVisible();
    await expect(issuesTab).toBeVisible();
    await expect(fixesTab).toBeVisible();
  });
});
