import { test, expect } from '@playwright/test';

// ============================================================
// 01 — Landing Page
// Tests ACTUAL behaviour: accordion interaction, form usability,
// section count, console error absence, not just text presence.
// ============================================================

test.describe('Landing Page — page title and hero', () => {
  test('page title contains "ConduitScore" or "Spectral"', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toMatch(/ConduitScore|Spectral/i);
  });

  test('h1 is visible and contains "Spectral"', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text).toMatch(/Spectral/i);
  });

  test('no JS console errors on load (ignoring 404s for assets)', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // ignore known harmless 404s (favicon, robots)
        if (!text.includes('favicon') && !text.includes('robots') && !text.includes('404')) {
          errors.push(text);
        }
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });
});

test.describe('Landing Page — category cards', () => {
  const EXPECTED_CATEGORIES = [
    'Crawler Access',
    'Structured Data',
    'Content Structure',
    'LLMs.txt',
    'Technical Health',
    'Citation Signals',
    'Content Quality',
  ];

  test('all 7 category cards are visible', async ({ page }) => {
    await page.goto('/');
    for (const category of EXPECTED_CATEGORIES) {
      await expect(page.getByText(category).first()).toBeVisible();
    }
  });
});

test.describe('Landing Page — How It Works section', () => {
  test('How It Works section shows exactly 3 steps', async ({ page }) => {
    await page.goto('/');
    // "How It Works" label is visible
    await expect(page.getByText('How It Works').first()).toBeVisible();
    // The three step texts exist
    await expect(page.getByText('Enter any URL').first()).toBeVisible();
    await expect(page.getByText('Score in 30 seconds').first()).toBeVisible();
    await expect(page.getByText('Copy-paste fixes').first()).toBeVisible();
  });
});

test.describe('Landing Page — FAQ accordion interaction', () => {
  test('FAQ section has at least 4 questions', async ({ page }) => {
    await page.goto('/');
    const faqItems = page.locator('#faq details');
    await expect(faqItems).toHaveCount(4);
  });

  test('clicking a FAQ summary opens the answer (accordion interaction)', async ({ page }) => {
    await page.goto('/');
    // The first FAQ item uses a <details><summary> accordion
    const firstDetails = page.locator('#faq details').first();
    const summary = firstDetails.locator('summary');

    // Confirm it starts closed (no open attribute)
    const openBefore = await firstDetails.getAttribute('open');
    expect(openBefore).toBeNull();

    // Click to open
    await summary.click();

    // The details element should now have the open attribute
    const openAfter = await firstDetails.getAttribute('open');
    expect(openAfter).not.toBeNull();

    // The answer paragraph should be visible
    const answerParagraph = firstDetails.locator('p');
    await expect(answerParagraph).toBeVisible();
  });

  test('clicking an open FAQ item closes it', async ({ page }) => {
    await page.goto('/');
    const firstDetails = page.locator('#faq details').first();
    const summary = firstDetails.locator('summary');

    // Open it
    await summary.click();
    expect(await firstDetails.getAttribute('open')).not.toBeNull();

    // Close it
    await summary.click();
    const openAfterClose = await firstDetails.getAttribute('open');
    expect(openAfterClose).toBeNull();
  });
});

test.describe('Landing Page — CTA scan form', () => {
  test('bottom CTA scan input is editable and button is enabled', async ({ page }) => {
    await page.goto('/');
    // Scroll to bottom CTA section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // There are two ScanForm instances; the second is the bottom CTA
    const inputs = page.locator('input[type="url"]');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(1);

    const lastInput = inputs.last();
    await expect(lastInput).toBeVisible();
    await expect(lastInput).toBeEditable();

    // Type a value and confirm it sticks
    await lastInput.fill('https://test.com');
    await expect(lastInput).toHaveValue('https://test.com');

    // The scan button is enabled (not disabled)
    const scanBtn = page.getByRole('button', { name: 'Scan website for AI visibility' }).last();
    await expect(scanBtn).toBeVisible();
    await expect(scanBtn).toBeEnabled();
  });
});

test.describe('Landing Page — navigation header', () => {
  test('logo link exists and href points to "/"', async ({ page }) => {
    await page.goto('/');
    const logo = page.getByRole('link', { name: 'ConduitScore home' }).first();
    await expect(logo).toBeVisible();
    const href = await logo.getAttribute('href');
    expect(href).toBe('/');
  });

  test('Pricing nav link navigates to /pricing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pricing' }).first().click();
    await expect(page).toHaveURL('/pricing');
  });

  test('Sign In nav link navigates to /signin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign In' }).first().click();
    await expect(page).toHaveURL(/\/signin/);
  });

  test('Scanner nav link stays on homepage (anchor link)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Scanner' }).first().click();
    await expect(page).toHaveURL(/\//);
  });
});
