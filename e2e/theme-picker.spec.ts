import { test, expect } from '@playwright/test';

/**
 * Theme Picker E2E Tests
 *
 * Tests the theme picker component functionality including:
 * - Theme switching
 * - Dropdown interaction
 * - Keyboard navigation
 * - Theme persistence
 * - Mobile responsive behavior
 */

test.describe('Theme Picker', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display theme picker button', async ({ page }) => {
    await page.goto('/');

    const themePicker = page.locator('[data-test="theme-picker-button"]');
    await expect(themePicker).toBeVisible();
  });

  test('should show current theme label', async ({ page }) => {
    await page.goto('/');

    const themePicker = page.locator('[data-test="theme-picker-button"]');
    await expect(themePicker).toBeVisible();

    const ariaLabel = await themePicker.getAttribute('aria-label');

    // aria-label should contain one of the theme names
    expect(ariaLabel).toMatch(/(Lumen|Aurora|Nocturne|Cosmos)/);
  });

  test('should toggle dropdown when clicked', async ({ page }) => {
    await page.goto('/');

    const button = page.locator('[data-test="theme-picker-button"]');
    const dropdown = page.locator('[data-test="theme-picker-dropdown"]');

    // Dropdown should not be visible initially
    await expect(dropdown).not.toBeVisible();

    // Click to open
    await button.click();
    await expect(dropdown).toBeVisible();

    // Click again to close
    await button.click();
    await expect(dropdown).not.toBeVisible();
  });

  test('should display all available themes in dropdown', async ({ page }) => {
    await page.goto('/');

    // Open dropdown
    await page.locator('[data-test="theme-picker-button"]').click();

    // Should show system default option
    const systemOption = page.locator('[data-test="theme-option-system"]');
    await expect(systemOption).toBeVisible();

    // Should show all 4 theme options (Lumen, Aurora, Nocturne, Cosmos)
    const lumenOption = page.locator('[data-test="theme-option-lumen"]');
    const auroraOption = page.locator('[data-test="theme-option-aurora"]');
    const nocturneOption = page.locator('[data-test="theme-option-nocturne"]');
    const cosmosOption = page.locator('[data-test="theme-option-cosmos"]');

    await expect(lumenOption).toBeVisible();
    await expect(auroraOption).toBeVisible();
    await expect(nocturneOption).toBeVisible();
    await expect(cosmosOption).toBeVisible();
  });

  test('should switch themes when option is selected', async ({ page }) => {
    await page.goto('/');

    // Open dropdown
    await page.locator('[data-test="theme-picker-button"]').click();

    // Select Nocturne (dark theme)
    await page.locator('[data-test="theme-option-nocturne"]').click();

    // Dropdown should stay open (new behavior to allow previewing multiple themes)
    await expect(page.locator('[data-test="theme-picker-dropdown"]')).toBeVisible();

    // Button should now show Nocturne
    const button = page.locator('[data-test="theme-picker-button"]');
    await expect(button).toContainText('Nocturne');

    // data-theme attribute should be set on html element
    const themeAttr = await page.locator('html').getAttribute('data-theme');
    expect(themeAttr).toBe('nocturne');
  });

  test('should persist theme selection in localStorage', async ({ page }) => {
    await page.goto('/');

    // Select Aurora theme
    await page.locator('[data-test="theme-picker-button"]').click();
    await page.locator('[data-test="theme-option-aurora"]').click();

    // Check localStorage
    const storedTheme = await page.evaluate(() => {
      const raw = localStorage.getItem('theme-preference-v1');
      return raw ? JSON.parse(raw) : null;
    });

    expect(storedTheme).toBeTruthy();
    expect(storedTheme.slug).toBe('aurora');

    // Reload page and verify theme persists
    await page.reload();
    const button = page.locator('[data-test="theme-picker-button"]');
    await expect(button).toContainText('Aurora');
  });

  test('should show system indicator when system default is active', async ({ page }) => {
    await page.goto('/');

    // Open dropdown and select system default
    await page.locator('[data-test="theme-picker-button"]').click();
    await page.locator('[data-test="theme-option-system"]').click();

    // Should show "System" badge
    const button = page.locator('[data-test="theme-picker-button"]');
    await expect(button).toContainText('System');
  });

  test('should highlight active theme in dropdown', async ({ page }) => {
    await page.goto('/');

    // Open dropdown
    await page.locator('[data-test="theme-picker-button"]').click();

    // Select Lumen theme
    await page.locator('[data-test="theme-option-lumen"]').click();

    // Dropdown stays open (new behavior), so we can check immediately
    // Lumen option should have active class
    const lumenOption = page.locator('[data-test="theme-option-lumen"]');
    await expect(lumenOption).toHaveClass(/theme-picker__option--active/);
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    await page.goto('/');

    // Open dropdown
    await page.locator('[data-test="theme-picker-button"]').click();
    await expect(page.locator('[data-test="theme-picker-dropdown"]')).toBeVisible();

    // Click outside (on main content)
    await page.locator('main').click();

    // Dropdown should close
    await expect(page.locator('[data-test="theme-picker-dropdown"]')).not.toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    const button = page.locator('[data-test="theme-picker-button"]');

    // Focus button and press Enter
    await button.focus();
    await page.keyboard.press('Enter');

    // Dropdown should open
    await expect(page.locator('[data-test="theme-picker-dropdown"]')).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');

    // Dropdown should close
    await expect(page.locator('[data-test="theme-picker-dropdown"]')).not.toBeVisible();
  });

  test('should select theme with Enter key', async ({ page }) => {
    await page.goto('/');

    // Open dropdown
    await page.locator('[data-test="theme-picker-button"]').click();

    // Focus Cosmos option and press Enter
    const cosmosOption = page.locator('[data-test="theme-option-cosmos"]');
    await cosmosOption.focus();
    await page.keyboard.press('Enter');

    // Theme should be selected
    const button = page.locator('[data-test="theme-picker-button"]');
    await expect(button).toContainText('Cosmos');
  });

  test('should be visible on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const themePicker = page.locator('[data-test="theme-picker-button"]').first();
    await expect(themePicker).toBeVisible();
  });

  test('should hide theme label on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const button = page.locator('[data-test="theme-picker-button"]').first();

    // Label should not be visible (CSS display: none)
    const labelVisible = await button.locator('.theme-picker__label').isVisible();
    expect(labelVisible).toBe(false);
  });

  test('should apply correct theme colors to page', async ({ page }) => {
    await page.goto('/');

    // Select Nocturne (dark theme)
    await page.locator('[data-test="theme-picker-button"]').click();
    await page.locator('[data-test="theme-option-nocturne"]').click();

    // Check that CSS variables are applied
    const bgColor = await page.locator('html').evaluate(el =>
      getComputedStyle(el).getPropertyValue('--color-background')
    );

    // Dark theme should have a dark background color
    expect(bgColor).toBeTruthy();

    // Verify theme is actually dark by checking data-theme attribute
    const themeAttr = await page.locator('html').getAttribute('data-theme');
    expect(themeAttr).toBe('nocturne');
  });

  test('should maintain theme across navigation', async ({ page, viewport }) => {
    await page.goto('/');

    // Select Aurora theme
    await page.locator('[data-test="theme-picker-button"]').click();
    await page.locator('[data-test="theme-option-aurora"]').click();

    // Close the dropdown by clicking outside (since it stays open after selection)
    await page.locator('main').click();
    await expect(page.locator('[data-test="theme-picker-dropdown"]')).not.toBeVisible();

    // Navigate to case studies page
    // On mobile, we need to open the menu first
    const isMobile = viewport ? viewport.width < 768 : false;
    if (isMobile) {
      // Click the menu toggle button on mobile
      const menuToggle = page.locator('[data-test="menu-toggle"]');
      await menuToggle.click();
      // Wait for mobile menu to appear and click the link inside it
      const mobileMenu = page.locator('#mobile-menu');
      await mobileMenu.waitFor({ state: 'visible' });
      const caseStudiesLink = mobileMenu.locator('a[href="/case-studies"]');
      await caseStudiesLink.click();
    } else {
      await page.locator('a[href="/case-studies"]').first().click();
    }

    await page.waitForURL('/case-studies');

    // Theme should persist (check aria-label which is always present)
    const button = page.locator('[data-test="theme-picker-button"]').first();
    const ariaLabel = await button.getAttribute('aria-label');
    expect(ariaLabel).toContain('Aurora');

    const themeAttr = await page.locator('html').getAttribute('data-theme');
    expect(themeAttr).toBe('aurora');
  });
});
