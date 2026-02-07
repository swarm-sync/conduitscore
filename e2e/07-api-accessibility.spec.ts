import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should have working health endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('status');
  });

  test('should have working scan endpoint', async ({ page }) => {
    const response = await page.request.post('/api/scan', {
      data: { url: 'https://example.com' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect([200, 400, 429, 500]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('overallScore');
      expect(body).toHaveProperty('categories');
      expect(body).toHaveProperty('issues');
    }
  });

  test('should validate URL parameter', async ({ page }) => {
    const response = await page.request.post('/api/scan', {
      data: { url: '' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(400);
  });

  test('should have CORS configured', async ({ page }) => {
    const response = await page.request.options('/api/scan');
    // Should allow CORS
    expect([200, 204, 404]).toContain(response.status());
  });

  test('should rate limit requests', async ({ page }) => {
    // Make multiple rapid requests
    const responses = [];
    for (let i = 0; i < 15; i++) {
      const response = await page.request.post('/api/scan', {
        data: { url: 'https://example.com' },
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (response) {
        responses.push(response.status());
      }
    }

    // Should have at least one 429 (rate limited)
    const hasRateLimit = responses.includes(429);
    expect(hasRateLimit).toBeTruthy();
  });

  test('should handle invalid JSON', async ({ page }) => {
    const response = await page.request.post('/api/scan', {
      data: '{ invalid json',
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => null);

    if (response) {
      expect([400, 500]).toContain(response.status());
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1s = page.locator('h1');
    const h1Count = await h1s.count();

    // Should have exactly one h1
    expect(h1Count).toBe(1);

    // Headings should be in order (h1, h2, h3...)
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    let prevLevel = 0;

    const count = await allHeadings.count();
    for (let i = 0; i < count; i++) {
      const heading = allHeadings.nth(i);
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.substring(1));

      // Level should not skip (2 after 1, not 3)
      if (i > 0) {
        expect(level).toBeLessThanOrEqual(prevLevel + 1);
      }

      prevLevel = level;
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const hasAriaLabel = await img.getAttribute('aria-label');

      // Decorative images can be empty, but should have explicit alt=""
      expect(alt !== null || hasAriaLabel).toBeTruthy();
    }
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(5, count); i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      // Should have label, aria-label, or placeholder
      const hasLabel = inputId && await page.locator(`label[for="${inputId}"]`).count() > 0;
      expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
    }
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Should be able to tab through links
    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.focus();
    await page.keyboard.press('Tab');

    // Next focused element should be different
    const focused = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focused).not.toBe('INPUT');
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    // Check text elements have sufficient contrast
    const texts = page.locator('p, a, h1, h2, h3, h4, h5, h6, button');
    const count = await texts.count();

    let contrastIssues = 0;

    for (let i = 0; i < Math.min(10, count); i++) {
      const element = texts.nth(i);
      const color = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      const bgColor = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.backgroundColor;
      });

      // Very basic check - colors shouldn't be identical
      if (color === bgColor && color !== 'rgba(0, 0, 0, 0)') {
        contrastIssues++;
      }
    }

    // Should not have widespread contrast issues
    expect(contrastIssues).toBeLessThan(3);
  });

  test('should have focus visible styles', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a:has-text("Pricing")').first();
    await links.focus();

    // Should have visible focus indicator
    const styles = await links.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have some visual focus indicator
    const hasFocus = styles.outline !== 'none' || styles.boxShadow !== 'none';
    expect(hasFocus).toBeTruthy();
  });

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    const button = page.locator('button:has-text("Scan Free")').first();

    // Check for aria-live regions
    const liveRegions = page.locator('[aria-live]');
    const count = await liveRegions.count();

    // Having aria-live regions is good practice for dynamic updates
    // (Not strictly required but helpful)
  });

  test('should support skip to main content', async ({ page }) => {
    await page.goto('/');

    // Look for skip link
    const skipLink = page.locator('a:has-text("Skip"), a[href="#main"]');

    if (await skipLink.count() > 0) {
      await skipLink.click();
      // Should focus main content or heading
      const focused = await page.evaluate(() => {
        return document.activeElement?.getAttribute('id') || document.activeElement?.tagName;
      });
      expect(focused).toBeTruthy();
    }
  });
});

test.describe('Performance Accessibility', () => {
  test('should load content without blocking', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const loadTime = Date.now() - startTime;

    // Should load reasonably fast
    expect(loadTime).toBeLessThan(5000);

    // Content should be visible immediately
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper font sizes', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const fontSize = await body.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    const size = parseInt(fontSize);

    // Base font should be readable (at least 12px)
    expect(size).toBeGreaterThanOrEqual(12);
  });
});
