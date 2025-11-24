import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for Home and Case Studies pages
 * Tests ensure CSS Grid layouts don't break on different screen sizes
 *
 * NOTE: Only runs on chromium-desktop project to avoid duplicate snapshots
 * The test manually sets viewports to test all screen sizes
 */

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080, name: 'desktop' },
  laptop: { width: 1440, height: 1024, name: 'laptop' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  mobile: { width: 375, height: 667, name: 'mobile' },
};

test.describe('Visual Regression Tests - Home Page', () => {
  for (const [_key, viewport] of Object.entries(VIEWPORTS)) {
    test(`Home page should match baseline on ${viewport.name}`, async ({ page }, testInfo) => {
      // Skip visual regression in CI due to platform-specific rendering differences
      test.skip(!!process.env.CI, 'Visual regression tests skipped in CI');

      // Only run visual regression tests on chromium-desktop
      test.skip(
        testInfo.project.name !== 'chromium-desktop',
        'Visual regression only runs on chromium-desktop'
      );

      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to home page
      await page.goto('/');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take screenshot and compare with baseline
      // Allow slight differences for cross-platform font rendering
      await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.05, // Allow 5% difference for font rendering across platforms
      });
    });
  }
});

test.describe('Visual Regression Tests - Case Studies Page', () => {
  for (const [_key, viewport] of Object.entries(VIEWPORTS)) {
    test(`Case Studies page should match baseline on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      // Skip visual regression in CI due to platform-specific rendering differences
      test.skip(!!process.env.CI, 'Visual regression tests skipped in CI');

      // Only run visual regression tests on chromium-desktop
      test.skip(
        testInfo.project.name !== 'chromium-desktop',
        'Visual regression only runs on chromium-desktop'
      );

      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to case studies page
      await page.goto('/case-studies');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take screenshot and compare with baseline
      // Allow slight differences for cross-platform font rendering
      await expect(page).toHaveScreenshot(`case-studies-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.05, // Allow 5% difference for font rendering across platforms
      });
    });
  }
});
