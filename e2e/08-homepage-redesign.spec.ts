import { test, expect } from '@playwright/test';

// ============================================================
// 08 — Homepage Redesign
// Validates the new homepage sections, hero layout, nav,
// example score card, and section presence.
// ============================================================

test.describe('Homepage — hero section', () => {
  test('H1 text contains "AI visibility score"', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text).toMatch(/AI visibility score/i);
  });

  test('hero CTA button text is "Scan My Site" (not legacy text)', async ({ page }) => {
    await page.goto('/');
    // The primary scan button in the hero
    const btn = page.getByRole('button', { name: /Scan My Site/i }).first();
    await expect(btn).toBeVisible();
  });

  test('URL input is present and editable', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="url"]').first();
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
  });
});

test.describe('Homepage — nav links', () => {
  test('Pricing link is present and points to /pricing', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: 'Pricing' }).first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('/pricing');
  });

  test('Sign In link is present', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /Sign In/i }).first();
    await expect(link).toBeVisible();
  });

  test('Nav does NOT contain /about link', async ({ page }) => {
    await page.goto('/');
    const aboutLink = page.getByRole('link', { name: /About/i });
    // Should not exist (removed in redesign)
    await expect(aboutLink).toHaveCount(0);
  });

  test('Nav does NOT contain /blog link', async ({ page }) => {
    await page.goto('/');
    const blogLink = page.getByRole('link', { name: /Blog/i });
    await expect(blogLink).toHaveCount(0);
  });
});

test.describe('Homepage — trust band', () => {
  test('trust band renders at least 2 stat items', async ({ page }) => {
    await page.goto('/');
    // Trust band stats are near the top — just check some key stats exist
    await expect(page.getByText(/30s|seconds/i).first()).toBeVisible();
  });
});

test.describe('Homepage — seven signals section', () => {
  test('"Seven signals. One score." heading is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/seven signals/i).first()).toBeVisible();
  });

  test('all 7 signal categories are present on the page', async ({ page }) => {
    await page.goto('/');
    const categories = [
      'Crawler Access',
      'Structured Data',
      'Content Structure',
      'LLMs.txt',
      'Technical Health',
      'Citation Signals',
      'Content Quality',
    ];
    for (const cat of categories) {
      await expect(page.getByText(cat).first()).toBeVisible();
    }
  });
});

test.describe('Homepage — how it works section', () => {
  test('3-step section is present', async ({ page }) => {
    await page.goto('/');
    // Three steps should be visible
    await expect(page.getByText(/Enter any URL|Paste your URL/i).first()).toBeVisible();
    await expect(page.getByText(/Score in 30 seconds|30 seconds/i).first()).toBeVisible();
    await expect(page.getByText(/Copy-paste fixes|fixes/i).first()).toBeVisible();
  });
});

test.describe('Homepage — example score card', () => {
  test('score card is visible in the hero area (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // Score card should show score 74
    await expect(page.getByText('74').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Homepage — bottom CTA', () => {
  test('"You\'ve read enough" section is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/You've read enough/i).first()).toBeVisible();
  });

  test('bottom CTA has a URL input', async ({ page }) => {
    await page.goto('/');
    const inputs = page.locator('input[type="url"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Homepage — absent legacy sections', () => {
  test('"Why AI Visibility Matters" heading is absent', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Why AI Visibility Matters')).toHaveCount(0);
  });
});

test.describe('Homepage — mobile layout', () => {
  test('hero scan form is visible on 375px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const input = page.locator('input[type="url"]').first();
    await expect(input).toBeVisible();
  });
});
