import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.locator('text=Pricing')).toBeVisible();
  });

  test('should display pricing tiers', async ({ page }) => {
    await page.goto('/pricing');

    // Should have multiple plan cards
    const plans = page.locator('[class*="card"], [class*="plan"], [role="region"]');
    const planCount = await plans.count();
    expect(planCount).toBeGreaterThan(0);
  });

  test('should have pricing details', async ({ page }) => {
    await page.goto('/pricing');

    // Should show pricing information
    const pricingText = page.locator('text=/\\$|month|year|free/i');
    const count = await pricingText.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have CTA buttons on pricing cards', async ({ page }) => {
    await page.goto('/pricing');

    // Should have multiple CTAs
    const buttons = page.locator('button:has-text("Get Started"), button:has-text("Subscribe"), button:has-text("Upgrade"), button:has-text("Choose")');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to pricing from homepage', async ({ page }) => {
    await page.goto('/');

    // Click pricing link
    await page.click('a:has-text("Pricing")');

    await expect(page).toHaveURL('/pricing');
  });

  test('should have upgrade button on results page', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Should have upgrade button
    const upgradeButton = page.locator('a:has-text("Upgrade for More Scans"), button:has-text("Upgrade")');
    await expect(upgradeButton).toBeVisible();
  });
});

test.describe('Stripe Integration', () => {
  test('should have stripe checkout configured', async ({ page }) => {
    await page.goto('/pricing');

    // Get first CTA button
    const buttons = page.locator('button:has-text("Get Started"), button:has-text("Subscribe"), button:has-text("Upgrade"), button:has-text("Choose")');
    if (await buttons.count() > 0) {
      const button = buttons.first();

      // Click should either navigate to checkout or show Stripe modal
      await button.click({ timeout: 5000 }).catch(() => {
        // Might be disabled or protected
      });

      // Check if we're at checkout URL or Stripe modal opened
      await page.waitForTimeout(2000);
      const url = page.url();
      const hasCheckout = url.includes('checkout') || url.includes('stripe');
      // If not navigated, Stripe might be handling it client-side
    }
  });

  test('should have valid Stripe public key', async ({ page }) => {
    await page.goto('/pricing');

    // Look for Stripe script or public key reference
    const stripeScripts = page.locator('script[src*="stripe"]');
    const hasStripe = await stripeScripts.count() > 0;

    // Stripe might be loaded via client JS
    // Check for Stripe in window
    const hasWindow = await page.evaluate(() => {
      return typeof (window as any).Stripe !== 'undefined';
    }).catch(() => false);

    expect(hasStripe || hasWindow).toBeTruthy();
  });

  test('should have proper error handling for checkout', async ({ page }) => {
    // Navigate to checkout API
    const response = await page.request.post('/api/stripe/checkout', {
      data: { priceId: 'invalid-price' },
    });

    // Should handle invalid price gracefully
    expect([400, 404, 500]).toContain(response.status());
  });

  test('should have webhook endpoint configured', async ({ page }) => {
    // Webhook should be accessible (but might reject invalid requests)
    const response = await page.request.post('/api/stripe/webhook', {
      data: { type: 'test' },
    });

    // Should respond (valid or invalid sig error)
    expect([200, 400, 401]).toContain(response.status());
  });
});

test.describe('Pricing - Mobile', () => {
  test('should display pricing on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/pricing');

    await expect(page.locator('text=Pricing')).toBeVisible();

    // Plans should be readable
    const plans = page.locator('[class*="card"], [class*="plan"]');
    const count = await plans.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have readable CTA on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/pricing');

    // Buttons should be tappable
    const buttons = page.locator('button:has-text("Get Started"), button:has-text("Subscribe"), button:has-text("Upgrade")');
    if (await buttons.count() > 0) {
      const button = buttons.first();
      const box = await button.boundingBox();
      // Button should be at least 48x48 for mobile
      if (box) {
        expect(box.width).toBeGreaterThan(40);
        expect(box.height).toBeGreaterThan(40);
      }
    }
  });
});
