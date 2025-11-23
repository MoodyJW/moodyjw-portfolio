# End-to-End Testing with Playwright

This directory contains Playwright end-to-end tests for the MoodyJW Portfolio application, including visual regression tests to ensure CSS Grid layouts don't break on different screen sizes.

## Test Structure

```
e2e/
├── navigation.spec.ts          # Navigation and routing tests
├── visual-regression.spec.ts   # Visual regression tests with screenshots
├── screenshots-baseline/       # Baseline screenshots for comparison
└── .gitignore                  # Ignore test artifacts
```

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

### Generate Test Report

```bash
npm run test:e2e:report
```

## Visual Regression Tests

Visual regression tests capture screenshots of the Home and Case Studies pages across four viewports:

- **Desktop**: 1920x1080
- **Laptop**: 1440x1024
- **Tablet**: 768x1024
- **Mobile**: 375x667

### Updating Baseline Screenshots

When you intentionally make visual changes to the application, you'll need to update the baseline screenshots:

```bash
npm run test:e2e:update-snapshots
```

This will:

1. Run all visual regression tests
2. Update baseline screenshots in `screenshots-baseline/`
3. Save the new screenshots as the new baseline for future comparisons

### Screenshot Comparison

Playwright automatically compares screenshots pixel-by-pixel:

- ✅ **Pass**: Screenshot matches baseline (within threshold)
- ❌ **Fail**: Screenshot differs from baseline
- 📊 **Diff**: Visual diff image is generated showing differences

## Test Projects

The tests run across multiple browser configurations:

### Visual Regression (4 viewports)

- `chromium-desktop` - Desktop Chrome (1920x1080)
- `chromium-laptop` - Laptop Chrome (1440x1024)
- `chromium-tablet` - Tablet Chrome (768x1024)
- `chromium-mobile` - Mobile Chrome (375x667)

### Cross-Browser (Desktop only)

- `firefox-desktop` - Desktop Firefox (1920x1080)
- `webkit-desktop` - Desktop Safari/WebKit (1920x1080)

## Best Practices

1. **Wait for Stability**: Tests wait for `networkidle` state before taking screenshots
2. **Disable Animations**: Screenshots are taken with animations disabled for consistency
3. **Full Page**: Tests capture full-page screenshots to catch layout issues
4. **Parallel Execution**: Tests run in parallel for faster execution
5. **CI/CD Ready**: Configuration includes CI-specific settings (retries, workers)

## Troubleshooting

### Flaky Tests

If tests are inconsistent:

- Check network timing issues
- Ensure animations are disabled
- Increase wait times if needed
- Use `page.waitForLoadState('networkidle')`

### Screenshot Differences

If screenshots don't match:

1. Review the diff image in `test-results/`
2. Determine if the change is intentional
3. If intentional, update baselines: `npm run test:e2e:update-snapshots`
4. If unintentional, fix the CSS/layout issue

### CI/CD Integration

The tests are configured to:

- Retry failed tests 2x on CI
- Run serially on CI (workers: 1)
- Fail on `.only` to prevent accidental test skipping

## Configuration

Test configuration is in `playwright.config.ts`:

- Base URL: `http://localhost:4200`
- Test timeout: 30 seconds (default)
- Web server timeout: 120 seconds
- Trace on first retry for debugging

## Writing New Tests

### Navigation Test Example

```typescript
test('should navigate to new page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=New Page');
  await expect(page).toHaveURL('/new-page');
});
```

### Visual Regression Test Example

```typescript
test('should match baseline', async ({ page }) => {
  await page.goto('/new-page');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('new-page-desktop.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Visual Comparisons Guide](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
