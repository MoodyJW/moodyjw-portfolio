import { test, expect } from './fixtures/accessibility';
import { THEMES } from '../src/app/core/theme/themes.constants';
import { addThemeInitScript } from './helpers/theme-init';

/**
 * Accessibility tests for the application
 * These tests ensure WCAG 2.1 AAA compliance using axe-core
 */

test.describe('Accessibility Compliance', () => {
  for (const theme of THEMES) {
    test.describe(`${theme.slug} theme`, () => {
      test.beforeEach(async ({ context }) => {
        // inject theme before any page is created in this context
        await context.addInitScript(addThemeInitScript(theme.slug));
      });

      test('Home page should have no accessibility violations', async ({ page, makeAxeBuilder }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('h1', { state: 'visible' });

        const accessibilityScanResults = await makeAxeBuilder().analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('Case Studies page should have no accessibility violations', async ({
        page,
        makeAxeBuilder,
      }) => {
        await page.goto('/case-studies');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('h1', { state: 'visible' });

        const accessibilityScanResults = await makeAxeBuilder().analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.waitForSelector('h1', { state: 'visible' });

        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1);

        const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
        expect(headings.length).toBeGreaterThan(0);
      });

      test('should have skip navigation link', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const skipLink = page.locator('a[href="#main-content"]').first();

        await expect(skipLink).toBeAttached();

        await page.evaluate(() => {
          const link = document.querySelector<HTMLAnchorElement>('a[href="#main-content"]');
          link?.focus();
        });

        await page.waitForTimeout(100);

        await expect(skipLink).toBeFocused();
        await expect(skipLink).toBeVisible();
      });
    });
  }
});
