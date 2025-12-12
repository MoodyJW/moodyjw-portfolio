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

    // Check if we're on mobile viewport (hamburger menu visible)
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // On mobile, open the hamburger menu first
      await page.click('.header__mobile-toggle');
      await page.waitForSelector('.header__mobile-menu', { state: 'visible' });
      // Click the visible mobile link
      await page.click('.header__mobile-link:has-text("Case Studies")');
    } else {
      // On desktop, click the visible desktop link
      await page.click('.header__menu--desktop .header__menu-link:has-text("Case Studies")');
    }

    await expect(page).toHaveURL('/case-studies');
    await expect(page).toHaveTitle('MoodyJW - Case Studies');
  });

  test('should navigate back to home from case studies', async ({ page }) => {
    await page.goto('/case-studies');

    // Check if we're on mobile viewport (hamburger menu visible)
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // On mobile, open the hamburger menu first
      await page.click('.header__mobile-toggle');
      await page.waitForSelector('.header__mobile-menu', { state: 'visible' });
      // Click the visible mobile link
      await page.click('.header__mobile-link:has-text("Home")');
    } else {
      // On desktop, click the visible desktop link
      await page.click('.header__menu--desktop .header__menu-link:has-text("Home")');
    }

    await expect(page).toHaveURL('/home');
    await expect(page).toHaveTitle('MoodyJW - Home');
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      await page.click('.header__mobile-toggle');
      await page.waitForSelector('.header__mobile-menu', { state: 'visible' });
      await page.click('.header__mobile-link:has-text("Projects")');
    } else {
      await page.click('.header__menu--desktop .header__menu-link:has-text("Projects")');
    }

    await expect(page).toHaveURL('/projects');
    await expect(page).toHaveTitle(/Projects/);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      await page.click('.header__mobile-toggle');
      await page.waitForSelector('.header__mobile-menu', { state: 'visible' });
      await page.click('.header__mobile-link:has-text("About")');
    } else {
      await page.click('.header__menu--desktop .header__menu-link:has-text("About")');
    }

    await expect(page).toHaveURL('/about');
    await expect(page).toHaveTitle(/About/);
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      await page.click('.header__mobile-toggle');
      await page.waitForSelector('.header__mobile-menu', { state: 'visible' });
      await page.click('.header__mobile-link:has-text("Contact")');
    } else {
      await page.click('.header__menu--desktop .header__menu-link:has-text("Contact")');
    }

    await expect(page).toHaveURL('/contact');
    await expect(page).toHaveTitle(/Contact/);
  });
});

test.describe('Responsive Navigation', () => {
  test('should render navigation on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if main navigation is visible
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
  });

  test('should render navigation on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
  });

  test('should render navigation on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
  });
});
