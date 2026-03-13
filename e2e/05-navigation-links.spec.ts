import { test, expect } from '@playwright/test';

// ============================================================
// 05 — Navigation & Links
// Tests that all nav links reach their destinations (no 404s),
// logo goes home, and footer links exist and work.
// ============================================================

test.describe('Header navigation — link destinations', () => {
  test('logo link navigates to homepage', async ({ page }) => {
    await page.goto('/pricing');  // start somewhere other than home

    const logo = page.getByRole('link', { name: 'ConduitScore home' }).first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('Scanner nav link stays on homepage (anchor)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Scanner' }).first().click();
    // Anchor links keep us on the homepage
    expect(page.url()).toMatch(/localhost.*\//);
    await expect(page.getByText('Crawler Access').first()).toBeVisible();
  });

  test('Pricing nav link navigates to /pricing (200)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pricing' }).first().click();
    await expect(page).toHaveURL('/pricing');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Sign In nav link navigates to /signin (200)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign In' }).first().click();
    await expect(page).toHaveURL(/\/signin/);
    await expect(page.locator('#signin-heading')).toBeVisible();
  });
});

test.describe('Key routes — HTTP status 200', () => {
  const publicRoutes = ['/', '/pricing', '/signin'];

  for (const route of publicRoutes) {
    test(`GET ${route} returns 200`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(200);
    });
  }

  test('GET /dashboard returns 200 or redirect (not 404/500)', async ({ request }) => {
    const response = await request.get('/dashboard', { maxRedirects: 0 });
    // 307 to /signin is expected for unauthenticated users
    expect([200, 307, 302, 301]).toContain(response.status());
  });
});

test.describe('Footer links', () => {
  test('footer exists and contains at least one link', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();

    const footerLinks = footer.locator('a[href]');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer links have non-empty, non-javascript: href attributes', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    const footerLinks = footer.locator('a[href]');
    const count = await footerLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      expect(href).not.toBeFalsy();
      expect(href).not.toMatch(/^javascript:/i);
    }
  });

  test('footer internal links do not 404', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    const footerLinks = footer.locator('a[href]');
    const count = await footerLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.includes('mailto')) {
        const resp = await page.request.get(href);
        expect([200, 301, 302, 307]).toContain(resp.status());
      }
    }
  });
});

test.describe('Scan result page — navigation', () => {
  // Serialised because scan involves rate-limited API
  test.setTimeout(45000);

  test('logo link on /scan-result page returns to homepage', async ({ page }) => {
    const uniqueIp = `nav-scan-${Date.now()}`;

    await page.goto('/');

    // Intercept and mock the scan API response so this test doesn't depend on
    // network latency or rate limits — we just need to verify the logo link
    await page.route('/api/scan', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://example.com',
          overallScore: 72,
          categories: [
            { name: 'Crawler Access', score: 10, issues: [], fixes: [] },
            { name: 'Structured Data', score: 10, issues: [], fixes: [] },
            { name: 'Content Structure', score: 10, issues: [], fixes: [] },
            { name: 'LLMs.txt', score: 10, issues: [], fixes: [] },
            { name: 'Technical Health', score: 10, issues: [], fixes: [] },
            { name: 'Citation Signals', score: 10, issues: [], fixes: [] },
            { name: 'Content Quality', score: 12, issues: [], fixes: [] },
          ],
          issues: [],
          fixes: [],
          scannedAt: new Date().toISOString(),
          metadata: {
            scanId: 'test',
            statusCode: 200,
            loadTimeMs: 500,
            finalUrl: 'https://example.com',
            hasRobotsTxt: false,
            hasLlmsTxt: false,
          },
          proof: null,
        }),
      });
    });

    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill('https://example.com');
    await page.getByRole('button', { name: 'Scan website for AI visibility' }).first().click();

    await page.waitForURL(/\/scan-result/, { timeout: 10000 });

    const logo = page.getByRole('link', { name: 'ConduitScore home' }).first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Link quality — no javascript: hrefs', () => {
  test('no links on homepage use "javascript:" protocol', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href]');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toMatch(/^javascript:/i);
    }
  });

  test('no links on /pricing use "javascript:" protocol', async ({ page }) => {
    await page.goto('/pricing');

    const links = page.locator('a[href]');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toMatch(/^javascript:/i);
    }
  });
});
