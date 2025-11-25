# Phase 2: Theme System Foundation – Implementation Plan

## Overview

This plan details the step-by-step implementation of the theme system foundation as described in Phase 2 of the project implementation plan. The goal is to deliver a robust, accessible, and extensible theming system with full WCAG AAA compliance, developer documentation, and test coverage.

---

## Objectives

- Build a theme registry with at least four themes (two light, two dark)
- Validate theme structure and contrast ratios with Zod
- Implement a ThemeService (signal store) for theme management and persistence
- Integrate system theme detection and user preference storage
- Apply themes via CSS variables and SCSS partials
- Ensure all themes meet WCAG AAA contrast
- Document theme contribution and usage
- Provide unit tests for all logic and edge cases

---

## Deliverables Checklist

- [x] Theme definitions registry (`THEMES` constant or `ThemeRegistry` service)
  - [x] Four themes: Lumen (light), Aurora (light), Nocturne (dark), Cosmos (dark)
  - [x] Each theme: slug, label, color tokens, contrast ratios
  - [x] Zod schema for validation
  - [x] Registry documents WCAG AAA contrast data
  - [x] Contribution checklist for new themes
- [x] ThemeService (signal store)
  - [x] Read/write preference from LocalStorage
  - [x] Detect `prefers-color-scheme` and OS changes
  - [x] Apply theme via `data-theme` and CSS variables
  - [x] Expose signals: `activeTheme`, `availableThemes`, `isSystemDefault`, `isDarkMode`
  - [x] Store user selection with timestamp/version
  - [x] Provide `resetToSystem()`
  - [x] Unit tests for all scenarios (to be implemented)
- [x] Styling implementation
  - [x] SCSS partials for theme maps
  - [x] CSS variable injection
  - [x] All themes meet WCAG AAA
  - [x] Support `prefers-reduced-motion`
  - [x] Animation tokens in CSS variables
- [x] Documentation
  - [x] Theme contribution guide
  - [x] Usage in README (to be added in main README)
  - [x] TSDoc for all APIs
- [ ] Tests
  - [ ] Unit tests for ThemeService
  - [ ] Zod schema validation tests
  - [ ] Edge case tests (corrupt storage, fallback)

---

## Implementation Steps

### 1. Theme Registry & Schema

- Define `THEMES` constant with four themes
- Each theme: slug, label, color tokens (primary, background, surface, text, border, etc.), contrast ratios
- Create Zod schema for theme validation
- Validate all themes at runtime (fail fast if invalid)
- Document contrast ratios for each theme
- Add checklist for contributing new themes

### 2. ThemeService (Signal Store)

- Create `ThemeService` as a signal store
- On init: detect system theme (`prefers-color-scheme`), read LocalStorage
- Expose signals: `activeTheme`, `availableThemes`, `isSystemDefault`, `isDarkMode`
- Apply theme by setting `data-theme` and injecting CSS variables
- Listen for OS theme changes and update if user is in system mode
- Store user selection with timestamp/version for future migrations
- Provide `resetToSystem()` method
- Handle corrupt storage gracefully (fallback to system)
- Unit tests for all logic

### 3. Styling Implementation

- Create SCSS partial for theme maps (one per theme)
- Use CSS variables for all color/spacing/animation tokens
- Ensure all color combinations meet WCAG AAA (≥7:1 for text, 4.5:1 for large)
- Support `prefers-reduced-motion` for transitions
- Isolate animation tokens in CSS variables

### 4. Documentation

- Write theme contribution guide (how to add a new theme, required tokens, contrast validation)
- Add usage section to README
- TSDoc for all public APIs in ThemeService and registry

### 5. Testing

- Unit tests for ThemeService (preference read/write, system detection, fallback)
- Zod schema validation tests (valid/invalid theme objects)
- Edge case tests (corrupt storage, missing tokens)

---

## Timeline & Milestones

- **Day 1:** Theme registry, Zod schema, and validation
- **Day 2:** ThemeService implementation and unit tests
- **Day 3:** SCSS/CSS variable theming, contrast validation, and documentation
- **Day 4:** Finalize tests, polish docs, and review

---

## Acceptance Criteria

- Four themes defined, validated, and documented
- ThemeService manages theme state, persistence, and system detection
- All themes meet WCAG AAA contrast
- All logic covered by unit tests
- Contribution and usage docs complete

---

## Next Steps

1. Implement the theme registry and Zod schema
2. Build ThemeService with signals and persistence
3. Create SCSS partials and CSS variable system
4. Write documentation and tests
5. Review and iterate
