import { test, expect } from '@playwright/test';

/**
 * SPA routing tests to ensure GitHub Pages 404.html fallback works.
 * This test opens deep links directly and verifies the app renders.
 */

test.describe('SPA Routing (404 fallback) - Local/Deployed', () => {
  test('direct deep link to case study detail should render app', async ({ page }) => {
    // Use the deployed site base URL if provided, otherwise local dev server
    const base = process.env.DEPLOYED_BASE_URL || 'http://localhost:4200';
    const deepPath = '/case-studies/some-id-that-exists-or-not';

    await page.goto(base + deepPath, { waitUntil: 'networkidle' });

    // The app should render main layout and navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();

    // Optional: assert that route-specific heading exists (tolerant)
    const heading = page.locator('main h1, main h2');
    await expect(heading.first()).toBeVisible();
  });

  test('unknown path should fallback to app and show main page', async ({ page }) => {
    const base = process.env.DEPLOYED_BASE_URL || 'http://localhost:4200';

    await page.goto(base + '/this/path/does/not/exist', { waitUntil: 'networkidle' });

    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});
