import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('should be readable on iPhone 12', async ({ page }) => {
    page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    const h1 = page.locator('h1');
    const box = await h1.boundingBox();
    expect(box?.width).toBeGreaterThan(100);
  });

  test('should be readable on Pixel 5', async ({ page }) => {
    page.setViewportSize({ width: 393, height: 851 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should be readable on small phone', async ({ page }) => {
    page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('should have mobile-friendly form on small screen', async ({ page }) => {
    page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    // Use .first() to avoid strict mode violation (two ScanForm instances on page)
    const button = page.getByRole('button', { name: 'Scan website for AI visibility' }).first();

    await expect(urlInput).toBeVisible();
    await expect(button).toBeVisible();

    const inputBox = await urlInput.boundingBox();
    const buttonBox = await button.boundingBox();

    if (inputBox && buttonBox) {
      const verticalLayout = inputBox.y < buttonBox.y;
      const horizontalWithSpacing = buttonBox.x > inputBox.x + inputBox.width;

      expect(verticalLayout || horizontalWithSpacing).toBeTruthy();
    }
  });

  test('should not have text overflow on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const texts = page.locator('p, h1, h2, h3, h4, h5, h6, button, a');
    const count = await texts.count();

    let overflowCount = 0;
    for (let i = 0; i < Math.min(20, count); i++) {
      const element = texts.nth(i);
      const scrollWidth = await element.evaluate(el => el.scrollWidth);
      const clientWidth = await element.evaluate(el => el.clientWidth);

      if (scrollWidth > clientWidth) {
        overflowCount++;
      }
    }

    expect(overflowCount).toBeLessThan(5);
  });
});

test.describe('Tablet Responsiveness', () => {
  test('should display properly on iPad', async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const mainContent = page.locator('main');
    const box = await mainContent.boundingBox();
    expect(box?.width).toBeGreaterThan(500);
  });

  test('should display features grid on tablet', async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const featureText = page.getByText('Crawler Access').first();
    await expect(featureText).toBeVisible();
  });

  test('should have usable navigation on tablet', async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const pricingLink = page.getByRole('link', { name: 'Pricing' }).first();
    const scannerLink = page.getByRole('link', { name: 'Scanner' }).first();
    const signinLink = page.getByRole('link', { name: 'Sign In' }).first();

    const pricingVisible = await pricingLink.isVisible().catch(() => false);
    const scannerVisible = await scannerLink.isVisible().catch(() => false);
    const signinVisible = await signinLink.isVisible().catch(() => false);

    expect(pricingVisible || scannerVisible || signinVisible).toBeTruthy();
  });
});

test.describe('Desktop Responsiveness', () => {
  test('should display nicely on large desktop', async ({ page }) => {
    page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const maxWidth = page.locator('[class*="max-w"]').first();
    if (await maxWidth.isVisible().catch(() => false)) {
      const box = await maxWidth.boundingBox();
      expect(box?.width).toBeLessThan(1400);
    }
  });

  test('should use full width appropriately', async ({ page }) => {
    page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const main = page.locator('main');
    const box = await main.boundingBox();
    expect(box?.width).toBeGreaterThan(1000);
  });
});

test.describe('Orientation Changes', () => {
  test('should adapt to landscape orientation', async ({ page }) => {
    page.setViewportSize({ width: 812, height: 375 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('should adapt to portrait orientation', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

test.describe('Touch Targets', () => {
  test('should have adequate touch targets on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check the primary CTA button (scan button) has adequate size
    // Use the hero scan form button specifically
    const scanButton = page.getByRole('button', { name: 'Scan website for AI visibility' }).first();
    const box = await scanButton.boundingBox();

    if (box) {
      // The scan button should be large enough to tap
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });

  test('should have adequate spacing between touch targets', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const links = page.locator('a[href]');
    const count = await links.count();

    if (count >= 2) {
      const link1 = links.nth(0);
      const link2 = links.nth(1);

      const box1 = await link1.boundingBox();
      const box2 = await link2.boundingBox();

      if (box1 && box2 && box1.y === box2.y) {
        const gap = Math.abs(box2.x - (box1.x + box1.width));
        expect(gap).toBeGreaterThan(0);
      }
    }
  });
});
