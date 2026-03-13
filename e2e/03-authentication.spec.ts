import { test, expect } from '@playwright/test';

// ============================================================
// 03 — Authentication
// Tests real sign-in page behaviour, form interaction,
// magic link submission feedback, and protected route redirects.
//
// NOTE: Magic link tests mock the NextAuth email signin endpoint
// so they don't hang waiting for an actual email to be sent in
// this test environment (email provider not configured).
// ============================================================

test.describe('Sign-in page — structure', () => {
  test('/signin loads with heading visible', async ({ page }) => {
    await page.goto('/signin');
    const heading = page.locator('#signin-heading');
    await expect(heading).toBeVisible();
    const text = await heading.innerText();
    expect(text).toMatch(/Sign in/i);
  });

  test('email input is present and accepts text', async ({ page }) => {
    await page.goto('/signin');
    const emailInput = page.locator('#email-input');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEditable();

    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('"Send Magic Link" submit button is present and enabled', async ({ page }) => {
    await page.goto('/signin');
    const submitBtn = page.getByRole('button', { name: /Send Magic Link/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('Google OAuth button has aria-label "Sign in with Google"', async ({ page }) => {
    await page.goto('/signin');
    const googleBtn = page.locator('button[aria-label="Sign in with Google"]');
    await expect(googleBtn).toBeVisible();
    const text = await googleBtn.innerText();
    expect(text).toMatch(/Google/i);
  });

  test('"Back to ConduitScore" link is visible with href="/"', async ({ page }) => {
    await page.goto('/signin');
    // The link wraps the text "Back to ConduitScore" with href="/"
    const backLink = page.locator('a[href="/"]').filter({ hasText: 'Back to ConduitScore' });
    await expect(backLink).toBeVisible();
  });
});

test.describe('Sign-in page — magic link form submission', () => {
  test('submitting valid email shows "Magic link sent!" (with mocked auth)', async ({ page }) => {
    // next-auth/react signIn("email") calls:
    //   1. /api/auth/csrf to get a CSRF token
    //   2. /api/auth/signin/email with the token + email
    // We intercept at the fetch level (AbortHandler) to force instant resolution.

    await page.route(/\/api\/auth\/.*/, async (route) => {
      const url = route.request().url();
      if (url.includes('csrf')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ csrfToken: 'e2e-mock-token' }),
        });
      } else if (url.includes('signin')) {
        // next-auth expects a redirect URL or ok:true
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ url: 'http://localhost:3000/api/auth/verify-request?provider=email&type=email', error: null, ok: true, status: 200 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/signin');
    await page.locator('#email-input').fill('test@playwright-e2e.com');
    await page.getByRole('button', { name: /Send Magic Link/i }).click();

    // After signIn() resolves: setSent(true) renders a div with role="alert" that contains text.
    // We target it specifically to avoid matching the Next.js route announcer.
    const successAlert = page.locator('div[role="alert"][aria-live="polite"]');
    await expect(successAlert).toBeVisible({ timeout: 12000 });
    const msgText = await successAlert.innerText();
    expect(msgText).toMatch(/Magic link sent|Check your email/i);
  });

  test('success message contains the submitted email (with mocked auth)', async ({ page }) => {
    const testEmail = 'verify@playwright-e2e.com';

    await page.route(/\/api\/auth\/.*/, async (route) => {
      const url = route.request().url();
      if (url.includes('csrf')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ csrfToken: 'e2e-mock-token' }),
        });
      } else if (url.includes('signin')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ url: 'http://localhost:3000/api/auth/verify-request?provider=email&type=email', error: null, ok: true, status: 200 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/signin');
    await page.locator('#email-input').fill(testEmail);
    await page.getByRole('button', { name: /Send Magic Link/i }).click();

    const successAlert = page.locator('div[role="alert"][aria-live="polite"]');
    await expect(successAlert).toBeVisible({ timeout: 12000 });
    const msgText = await successAlert.innerText();
    expect(msgText).toContain(testEmail);
  });

  test('clicking submit shows loading state (Sending... button)', async ({ page }) => {
    // Intercept auth to keep loading state visible long enough to assert.
    await page.route(/\/api\/auth\/.*/, async (route) => {
      const url = route.request().url();
      if (url.includes('csrf')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ csrfToken: 'e2e-mock-token' }),
        });
      } else if (url.includes('signin')) {
        await new Promise((r) => setTimeout(r, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ url: 'http://localhost:3000/api/auth/verify-request?provider=email&type=email', ok: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/signin');
    await page.locator('#email-input').fill('loading@test.com');
    await page.getByRole('button', { name: /Send Magic Link/i }).click();

    // setLoading(true) fires synchronously — button goes disabled with "Sending..."
    await expect(page.getByRole('button', { name: /Sending/i })).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Protected routes — redirect to /signin', () => {
  test('unauthenticated GET /dashboard redirects to /signin', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/signin/, { timeout: 8000 });
  });

  test('unauthenticated GET /dashboard/projects redirects to /signin', async ({ page }) => {
    await page.goto('/dashboard/projects');
    await expect(page).toHaveURL(/\/signin/, { timeout: 8000 });
  });

  test('unauthenticated GET /dashboard/settings redirects to /signin', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await expect(page).toHaveURL(/\/signin/, { timeout: 8000 });
  });
});

test.describe('Auth API endpoints', () => {
  test('GET /api/auth/providers returns JSON with google and email providers', async ({ request }) => {
    const response = await request.get('/api/auth/providers');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('google');
    expect(body).toHaveProperty('email');
  });

  test('GET /api/auth/session returns 200 with an object', async ({ request }) => {
    const response = await request.get('/api/auth/session');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body).toBe('object');
  });
});

test.describe('Public pages — accessible without auth', () => {
  test('homepage loads without redirect', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    expect(page.url()).not.toMatch(/signin/);
  });

  test('/pricing loads without redirect', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1')).toBeVisible();
    expect(page.url()).not.toMatch(/signin/);
  });
});
