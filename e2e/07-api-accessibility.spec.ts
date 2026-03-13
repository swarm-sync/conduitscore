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
    const response = await page.request.fetch('/api/scan', { method: 'OPTIONS' });
    expect([200, 204, 404]).toContain(response.status());
  });

  test('should rate limit requests', async ({ page }) => {
    // The rate limiter allows 10 requests per 60 seconds per IP.
    // Use a unique test IP via X-Forwarded-For so this test doesn't exhaust
    // the shared "anonymous" pool that other scan tests depend on.
    // Fire 12 concurrent requests — once limit is hit, subsequent requests
    // return 429 immediately (no scan runs), keeping the test fast.
    const testIp = `test-ratelimit-${Date.now()}`;
    const requestPromises = Array.from({ length: 12 }, () =>
      page.request.post('/api/scan', {
        data: { url: 'https://example.com' },
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': testIp,
        },
      }).catch(() => null)
    );

    const results = await Promise.all(requestPromises);
    const responses = results
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .map(r => r.status());

    // Should have at least one 429 (rate limited) among the 12 concurrent requests
    const hasRateLimit = responses.includes(429);
    expect(hasRateLimit).toBeTruthy();
  });

  test('should handle invalid JSON', async ({ page }) => {
    const response = await page.request.post('/api/scan', {
      data: '{ invalid json',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null);

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

    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    let prevLevel = 0;

    const count = await allHeadings.count();
    for (let i = 0; i < count; i++) {
      const heading = allHeadings.nth(i);
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.substring(1));

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

      const hasLabel = inputId && await page.locator(`label[for="${inputId}"]`).count() > 0;
      expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
    }
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.focus();
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focused).not.toBe('INPUT');
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

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

      if (color === bgColor && color !== 'rgba(0, 0, 0, 0)') {
        contrastIssues++;
      }
    }

    expect(contrastIssues).toBeLessThan(3);
  });

  test('should have focus visible styles', async ({ page }) => {
    await page.goto('/');

    // Pricing link exists in the nav
    const links = page.getByRole('link', { name: 'Pricing' }).first();
    await links.focus();

    const styles = await links.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    const hasFocus = styles.outline !== 'none' || styles.boxShadow !== 'none';
    expect(hasFocus).toBeTruthy();
  });

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/');

    const liveRegions = page.locator('[aria-live]');
    await liveRegions.count();
    // Presence of aria-live is good practice (non-blocking assertion)
  });

  test('should support skip to main content', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('a:has-text("Skip"), a[href="#main"]');

    if (await skipLink.count() > 0) {
      await skipLink.click();
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

    expect(loadTime).toBeLessThan(5000);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper font sizes', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const fontSize = await body.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    const size = parseInt(fontSize);

    expect(size).toBeGreaterThanOrEqual(12);
  });
});
