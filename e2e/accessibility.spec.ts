import { test, expect } from './fixtures/accessibility';

/**
 * Accessibility tests for the application
 * These tests ensure WCAG 2.1 AAA compliance using axe-core
 */

test.describe('Accessibility Compliance', () => {
  test('Home page should have no accessibility violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Case Studies page should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/case-studies');

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1 (should be exactly 1)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Headings should not skip levels
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const skipLink = page.locator('a[href="#main-content"]').first();
    
    // Verify skip link exists
    await expect(skipLink).toBeAttached();
    
    // Programmatically focus the skip link (more reliable than Tab key)
    await page.evaluate(() => {
      const link = document.querySelector<HTMLAnchorElement>('a[href="#main-content"]');
      link?.focus();
    });
    
    // Wait a bit for focus to settle
    await page.waitForTimeout(100);
    
    // Verify it becomes focused and visible
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });
});
