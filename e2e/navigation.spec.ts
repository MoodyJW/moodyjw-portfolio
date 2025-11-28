import { test, expect } from '@playwright/test';

/**
 * Navigation and routing tests
 * Tests critical user flows and page navigation
 */

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/home');
    await expect(page).toHaveTitle('MoodyJW - Home');
  });

  test('should navigate to case studies page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Case Studies');
    await expect(page).toHaveURL('/case-studies');
    await expect(page).toHaveTitle('MoodyJW - Case Studies');
  });

  test('should navigate back to home from case studies', async ({ page }) => {
    await page.goto('/case-studies');
    await page.click('text=Home');
    await expect(page).toHaveURL('/home');
    await expect(page).toHaveTitle('MoodyJW - Home');
  });
});

test.describe('Responsive Navigation', () => {
  test('should render navigation on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if navigation is visible (may require hamburger menu interaction)
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should render navigation on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should render navigation on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
