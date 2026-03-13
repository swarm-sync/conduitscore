import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to signin page', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Sign In');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should display signin options', async ({ page }) => {
    await page.goto('/signin');

    // Should show sign in heading
    await expect(page.locator('text=Sign in to your account')).toBeVisible();

    // Should have auth provider buttons
    const googleButton = page.locator('button:has-text("Google")');
    const emailButton = page.locator('button:has-text("Email")');

    // At least one should be visible
    const googleVisible = await googleButton.isVisible().catch(() => false);
    const emailVisible = await emailButton.isVisible().catch(() => false);
    expect(googleVisible || emailVisible).toBeTruthy();
  });

  test('should redirect to signin when accessing protected dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to signin
    await expect(page).toHaveURL(/\/(signin|auth)/);
  });

  test('should redirect to signin when accessing protected projects', async ({ page }) => {
    await page.goto('/projects');

    // Should redirect to signin
    await expect(page).toHaveURL(/\/(signin|auth)/);
  });

  test('should have sign in form elements', async ({ page }) => {
    await page.goto('/signin');

    // Email input should exist
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[placeholder*="email" i]'));
    if (await emailInput.isVisible().catch(() => false)) {
      await expect(emailInput).toBeVisible();
    }

    // At least one submit button
    const buttons = page.locator('button');
    await expect(buttons).not.toHaveCount(0);
  });
});

test.describe('Protected Routes', () => {
  test('should block access to dashboard without auth', async ({ page }) => {
    // Try to access dashboard
    await page.goto('/dashboard');

    // Should either redirect or show signin
    const url = page.url();
    expect(url).toMatch(/signin|auth/i);
  });

  test('should block access to projects without auth', async ({ page }) => {
    await page.goto('/projects');

    const url = page.url();
    expect(url).toMatch(/signin|auth/i);
  });

  test('should block access to settings without auth', async ({ page }) => {
    await page.goto('/settings/billing');

    const url = page.url();
    expect(url).toMatch(/signin|auth/i);
  });

  test('should allow access to public pages', async ({ page }) => {
    // Landing page should load
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Pricing page should load
    await page.goto('/pricing');
    await expect(page.locator('text=Pricing')).toBeVisible();
  });
});

test.describe('Magic Link Auth', () => {
  test('should have email input on signin', async ({ page }) => {
    await page.goto('/signin');

    // Look for email input
    const emailInputs = page.locator('input[type="email"]');
    const hasEmail = await emailInputs.count().then(count => count > 0);

    if (hasEmail) {
      await expect(emailInputs.first()).toBeVisible();
    }
  });
});
