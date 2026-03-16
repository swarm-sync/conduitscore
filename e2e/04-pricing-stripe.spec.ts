import { test, expect } from '@playwright/test';

// ============================================================
// 04 — Pricing & Stripe
// Tests real pricing tier display, price values, CTA button
// interception, and Stripe checkout API contract.
// ============================================================

test.describe('Pricing page — tier display', () => {
  test('/pricing loads with h1 "Simple, transparent pricing"', async ({ page }) => {
    await page.goto('/pricing');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text).toMatch(/pricing/i);
  });

  test('all 5 pricing tiers are visible (Free, Starter, Pro, Growth, Agency)', async ({ page }) => {
    await page.goto('/pricing');
    for (const planName of ['Free', 'Starter', 'Pro', 'Growth', 'Agency']) {
      await expect(page.getByRole('heading', { name: planName }).first()).toBeVisible();
    }
  });

  test('Starter tier shows price "$29"', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('$29').first()).toBeVisible();
  });

  test('Pro tier shows price "$49"', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('$49').first()).toBeVisible();
  });

  test('Growth tier shows price "$79"', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('$79').first()).toBeVisible();
  });

  test('Agency tier shows price "$149"', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('$149').first()).toBeVisible();
  });

  test('each paid tier has a CTA button with correct label', async ({ page }) => {
    await page.goto('/pricing');

    // Starter — aria-label contains "Starter plan"
    const starterBtn = page.locator('button[aria-label*="Starter"]');
    await expect(starterBtn).toBeVisible();

    // Pro
    const proBtn = page.locator('button[aria-label*="Pro"]');
    await expect(proBtn).toBeVisible();

    // Agency
    const agencyBtn = page.locator('button[aria-label*="Agency"]');
    await expect(agencyBtn).toBeVisible();
  });
});

test.describe('Pricing page — Stripe checkout interception', () => {
  test('clicking Starter CTA fires POST to /api/stripe/checkout', async ({ page }) => {
    await page.goto('/pricing');

    // Intercept the checkout request before it hits Stripe
    const checkoutRequest = page.waitForRequest(
      (req) => req.url().includes('/api/stripe/checkout') && req.method() === 'POST'
    );

    // Click the Starter CTA button
    const starterBtn = page.locator('button[aria-label*="Starter"]').first();
    await expect(starterBtn).toBeVisible();
    await starterBtn.click();

    // Confirm the request fired
    const req = await checkoutRequest;
    expect(req.method()).toBe('POST');
    expect(req.url()).toContain('/api/stripe/checkout');

    // Verify the request body contains tier: "starter"
    const postData = req.postDataJSON();
    expect(postData).toHaveProperty('tier', 'starter');
  });

  test('clicking Pro CTA fires POST with tier "pro"', async ({ page }) => {
    await page.goto('/pricing');

    const checkoutRequest = page.waitForRequest(
      (req) => req.url().includes('/api/stripe/checkout') && req.method() === 'POST'
    );

    const proBtn = page.locator('button[aria-label*="Pro"]').first();
    await expect(proBtn).toBeVisible();
    await proBtn.click();

    const req = await checkoutRequest;
    const postData = req.postDataJSON();
    expect(postData).toHaveProperty('tier', 'pro');
  });
});

test.describe('Stripe checkout API — contract', () => {
  test('POST /api/stripe/checkout with tier "starter" returns 200 with stripe url', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'starter' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.url).toBe('string');
    expect(body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
  });

  test('POST /api/stripe/checkout with tier "pro" returns 200 with stripe url', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'pro' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
  });

  test('POST /api/stripe/checkout with tier "agency" returns 400 (Contact Us only)', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'agency' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('POST /api/stripe/checkout with invalid tier returns 400', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: { tier: 'invalid' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('POST /api/stripe/checkout with missing tier returns 400', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

test.describe('Pricing page — mobile', () => {
  test('all 5 tiers visible on 375px mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');
    await expect(page.locator('h1')).toBeVisible();

    for (const planName of ['Free', 'Starter', 'Pro', 'Growth', 'Agency']) {
      await expect(page.getByRole('heading', { name: planName }).first()).toBeVisible();
    }
  });

  test('Starter CTA button meets 44px touch target on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');

    const starterBtn = page.locator('button[aria-label*="Starter"]').first();
    await expect(starterBtn).toBeVisible();

    const box = await starterBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
