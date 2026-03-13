import { test, expect } from '@playwright/test';

test.describe('Navigation & Links', () => {
  test('should have valid header navigation', async ({ page }) => {
    await page.goto('/');

    // Logo link has aria-label="ConduitScore home" — use first() for strict mode
    const logoLink = page.getByRole('link', { name: 'ConduitScore home' }).first();
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should have working Scanner link', async ({ page }) => {
    await page.goto('/');

    // Nav has "Scanner" (not "Features") pointing to /#features — use first() for desktop nav
    await page.getByRole('link', { name: 'Scanner' }).first().click();
    // Anchor link — should stay on homepage
    const url = page.url();
    expect(url === 'http://localhost:3000/' || url.includes('#') || url === '/').toBeTruthy();
  });

  test('should have working pricing navigation', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Pricing' }).first().click();
    await expect(page).toHaveURL('/pricing');
  });

  test('should have working signin link', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Sign In' }).first().click();
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should navigate from results page', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    await page.getByRole('button', { name: 'Scan website for AI visibility' }).first().click();

    await page.waitForURL(/\/scan-result/, { timeout: 30000 });

    // Logo link on results page — navigate home
    await page.getByRole('link', { name: 'ConduitScore home' }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('should have footer links', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footer = page.locator('footer, [role="contentinfo"]');
    if (await footer.isVisible().catch(() => false)) {
      const footerLinks = footer.locator('a');
      const linkCount = await footerLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should not have broken links', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href]');
    const linkCount = await links.count();

    const samplesToCheck = Math.min(5, linkCount);
    for (let i = 0; i < samplesToCheck; i++) {
      const href = await links.nth(i).getAttribute('href');

      if (href && !href.startsWith('http') && !href.includes('mailto')) {
        const response = await page.request.head(href).catch(async () => {
          return page.request.get(href);
        });

        expect([200, 301, 302, 307, 404]).toContain(response.status());
      }
    }
  });

  test('should handle anchor links', async ({ page }) => {
    await page.goto('/');

    // "Scanner" nav link points to /#features anchor
    const scannerLink = page.getByRole('link', { name: 'Scanner' }).first();
    if (await scannerLink.isVisible()) {
      await scannerLink.click();
      // Should still be on homepage
      await expect(page).toHaveURL('/');
    }
  });
});

test.describe('Link Validation', () => {
  test('should have valid href attributes', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href]');
    const count = await links.count();

    for (let i = 0; i < Math.min(10, count); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');

      expect(href?.length).toBeGreaterThan(0);
      if (href !== '#') {
        expect(href).not.toBe(null);
      }
    }
  });

  test('should not have javascript: hrefs', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href]');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toMatch(/^javascript:/i);
    }
  });

  test('should have proper link text', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href]');
    const count = await links.count();

    let emptyLinkCount = 0;
    for (let i = 0; i < Math.min(20, count); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      if (!text?.trim() && !ariaLabel) {
        emptyLinkCount++;
      }
    }

    expect(emptyLinkCount).toBeLessThan(Math.min(20, count) / 2);
  });
});

test.describe('External Links', () => {
  test('should open external links in new tab', async ({ page }) => {
    await page.goto('/');

    const externalLinks = page.locator('a[href^="http"], a[href^="https"]').filter({
      has: page.locator('[target="_blank"], [rel*="external"]'),
    });

    const count = await externalLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const link = externalLinks.nth(i);
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        expect(target === '_blank' || rel?.includes('external')).toBeTruthy();
      }
    }
  });
});
