# Theme Contribution Guide

This guide explains how to add a new theme to the MoodyJW Portfolio theme system and ensure it meets all accessibility and code standards.

## 1. Add Theme to Registry
- Open `src/shared/constants/themes.constants.ts`.
- Add a new object to the `THEMES` array with:
  - `slug`: unique string identifier (e.g., 'solarized')
  - `label`: human-readable name
  - `isDark`: `true` or `false`
  - `tokens`: all required color tokens (see below)
  - `contrast`: measured contrast ratios for key color pairs
  - `description`: short description of the theme’s intent/style

### Required Color Tokens
- `primary`, `background`, `surface`, `text`, `textSecondary`, `border`, `borderHover`, `accent`, `error`, `success`, `warning`, `info`

## 2. Validate Theme
- Ensure all color tokens are present.
- Use the Zod schema (`ThemeRegistrySchema`) for validation (auto-run at runtime).
- Manually check that all text/background and accent/background combinations meet WCAG AAA:
  - Normal text: ≥7:1
  - Large text: ≥4.5:1
  - UI components: ≥3:1
- Document measured contrast ratios in the `contrast` field.

## 3. Add SCSS Map
- Open `src/styles/_themes.scss`.
- Add a new SCSS map for your theme (e.g., `$theme-solarized`).
- Ensure all keys match the tokens in the registry.
- Add a `[data-theme='your-slug']` block with `@include theme-vars($theme-your-slug);`

## 4. Test Theme
- Switch to your theme using the ThemeService or UI.
- Verify all UI elements render correctly and are accessible.
- Check for color contrast using browser dev tools or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
- Test in both light and dark modes if applicable.

## 5. Document
- Update the theme’s `description` and `contrast` fields.
- Add any special notes or intended use cases.

## 6. Submit
- Ensure all tests pass (unit, lint, E2E).
- Open a pull request with your changes and a summary of the new theme.

---

## Example Theme Object
```ts
{
  slug: 'solarized',
  label: 'Solarized (Light)',
  isDark: false,
  tokens: {
    primary: '#268bd2',
    background: '#fdf6e3',
    surface: '#eee8d5',
    text: '#657b83',
    textSecondary: '#93a1a1',
    border: '#eee8d5',
    borderHover: '#93a1a1',
    accent: '#b58900',
    error: '#dc322f',
    success: '#859900',
    warning: '#cb4b16',
    info: '#268bd2',
  },
  contrast: {
    textOnBackground: 10.5,
    textOnSurface: 9.2,
    accentOnBackground: 7.1,
  },
  description: 'Solarized palette for low-contrast, eye-friendly light mode.'
}
```

---

## See Also
- `src/shared/services/theme.service.ts` (ThemeService API)
- `src/styles/_themes.scss` (SCSS theme maps)
- `src/shared/constants/themes.constants.ts` (Theme registry)
