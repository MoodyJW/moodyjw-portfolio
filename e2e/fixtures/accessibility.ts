import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Extended Playwright test with accessibility scanning capabilities
 * Uses axe-core to scan pages for WCAG 2.1 AAA compliance
 *
 * @example
 * import { test, expect } from './fixtures/accessibility';
 *
 * test('home page should be accessible', async ({ page, makeAxeBuilder }) => {
 *   await page.goto('/');
 *   const accessibilityScanResults = await makeAxeBuilder().analyze();
 *   expect(accessibilityScanResults.violations).toEqual([]);
 * });
 */
export const test = base.extend<{
  makeAxeBuilder: () => AxeBuilder;
}>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa']) // WCAG 2.1 A, AA, AAA
        .exclude('#chromatic-root'); // Exclude Storybook elements if present
    await use(makeAxeBuilder);
  },
});

export { expect } from '@playwright/test';
