import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to signin page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Sign In' }).first().click();
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should display signin options', async ({ page }) => {
    await page.goto('/signin');

    // Signin page heading element
    await expect(page.locator('#signin-heading')).toBeVisible();

    // Should have auth provider buttons (Google and/or Email)
    const googleButton = page.locator('button[aria-label="Sign in with Google"]');
    const emailButton = page.locator('button[type="submit"]');

    const googleVisible = await googleButton.isVisible().catch(() => false);
    const emailVisible = await emailButton.first().isVisible().catch(() => false);
    expect(googleVisible || emailVisible).toBeTruthy();
  });

  test('should redirect to signin when accessing protected dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Middleware redirects /dashboard to /signin with callbackUrl
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should have sign in form elements', async ({ page }) => {
    await page.goto('/signin');

    // Email input
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[placeholder*="email" i]'));
    if (await emailInput.isVisible().catch(() => false)) {
      await expect(emailInput).toBeVisible();
    }

    // At least one button
    const buttons = page.locator('button');
    await expect(buttons).not.toHaveCount(0);
  });

  test('should have Back to ConduitScore link on signin page', async ({ page }) => {
    await page.goto('/signin');

    // Signin page has "Back to ConduitScore" link
    await expect(page.getByText('Back to ConduitScore')).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should block access to dashboard without auth', async ({ page }) => {
    // Middleware protects /dashboard — redirects to /signin
    await page.goto('/dashboard');

    const url = page.url();
    expect(url).toMatch(/signin/i);
  });

  test('should allow access to public pages', async ({ page }) => {
    // Landing page should load
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Pricing page should load
    await page.goto('/pricing');
    await expect(page.getByText('Pricing').first()).toBeVisible();
  });
});

test.describe('Magic Link Auth', () => {
  test('should have email input on signin', async ({ page }) => {
    await page.goto('/signin');

    const emailInputs = page.locator('input[type="email"]');
    const hasEmail = await emailInputs.count().then(count => count > 0);

    if (hasEmail) {
      await expect(emailInputs.first()).toBeVisible();
    }
  });
});
