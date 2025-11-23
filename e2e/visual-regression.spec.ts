import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for Home and Case Studies pages
 * Tests ensure CSS Grid layouts don't break on different screen sizes
 */

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080, name: 'desktop' },
  laptop: { width: 1440, height: 1024, name: 'laptop' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  mobile: { width: 375, height: 667, name: 'mobile' },
};

test.describe('Visual Regression Tests - Home Page', () => {
  for (const [key, viewport] of Object.entries(VIEWPORTS)) {
    test(`Home page should match baseline on ${viewport.name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to home page
      await page.goto('/');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take screenshot and compare with baseline
      await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});

test.describe('Visual Regression Tests - Case Studies Page', () => {
  for (const [key, viewport] of Object.entries(VIEWPORTS)) {
    test(`Case Studies page should match baseline on ${viewport.name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to case studies page
      await page.goto('/case-studies');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take screenshot and compare with baseline
      await expect(page).toHaveScreenshot(`case-studies-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
