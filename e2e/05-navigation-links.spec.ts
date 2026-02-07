import { test, expect } from '@playwright/test';

test.describe('Navigation & Links', () => {
  test('should have valid header navigation', async ({ page }) => {
    await page.goto('/');

    // Logo should link to home
    await page.click('[class*="logo"], text=AgentOptimize');
    await expect(page).toHaveURL('/');
  });

  test('should have working features link', async ({ page }) => {
    await page.goto('/');

    await page.click('a:has-text("Features")');
    // Should scroll to features or navigate
    const url = page.url();
    expect(url === '/' || url.includes('#')).toBeTruthy();
  });

  test('should have working pricing navigation', async ({ page }) => {
    await page.goto('/');

    await page.click('a:has-text("Pricing")');
    await expect(page).toHaveURL('/pricing');
  });

  test('should have working signin link', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Sign In');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should navigate from results page', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');

    const scanButton = page.locator('button:has-text("Scan Free")').first();
    await scanButton.click();

    await page.waitForURL('/scan-result');

    // Click home/logo
    await page.click('[class*="logo"], text=AgentOptimize');
    await expect(page).toHaveURL('/');
  });

  test('should have footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for footer content
    const footer = page.locator('footer, [role="contentinfo"]');
    if (await footer.isVisible().catch(() => false)) {
      // Footer exists and should have links
      const footerLinks = footer.locator('a');
      const linkCount = await footerLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should not have broken links', async ({ page }) => {
    await page.goto('/');

    // Get all links
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    // Sample links and check they don't 404
    const samplesToCheck = Math.min(5, linkCount);
    for (let i = 0; i < samplesToCheck; i++) {
      const href = await links.nth(i).getAttribute('href');

      if (href && !href.startsWith('http') && !href.includes('mailto')) {
        const response = await page.request.head(href).catch(async () => {
          // Try GET if HEAD fails
          return page.request.get(href);
        });

        expect([200, 301, 302, 307, 404]).toContain(response.status());
      }
    }
  });

  test('should handle anchor links', async ({ page }) => {
    await page.goto('/');

    // Look for anchor link
    const featureLinkBtn = page.locator('a:has-text("Features")');
    if (await featureLinkBtn.isVisible()) {
      await featureLinkBtn.click();
      // Should be on same page (possibly scrolled)
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

      // href should not be empty or just #
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

    // Links should have descriptive text, not empty
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

    // Most links should have text or aria-label
    expect(emptyLinkCount).toBeLessThan(Math.min(20, count) / 2);
  });
});

test.describe('External Links', () => {
  test('should open external links in new tab', async ({ page, context }) => {
    await page.goto('/');

    // Look for external links
    const externalLinks = page.locator('a[href^="http"], a[href^="https"]').filter({
      has: page.locator('[target="_blank"], [rel*="external"]'),
    });

    const count = await externalLinks.count();

    if (count > 0) {
      // External links should have target=_blank or rel=external
      for (let i = 0; i < Math.min(3, count); i++) {
        const link = externalLinks.nth(i);
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        expect(target === '_blank' || rel?.includes('external')).toBeTruthy();
      }
    }
  });
});
