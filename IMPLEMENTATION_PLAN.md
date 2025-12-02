# MoodyJW Portfolio - Implementation Plan

An infrastructure-first, enterprise-standard implementation plan following a phased approach from foundation to production deployment.

## Project Decisions (Recorded)

1. **Analytics**: GA4 only for Phase 1. Looker Studio for dashboard embedding demos.
2. **Auth**: Prioritize **Ory (Kratos + Hydra)** as recommended open-source provider; Keycloak as alternate.
3. **Tests**: Required before merge. TDD preferred; test-after acceptable. Coverage: 85% goal, 80% acceptable.
4. **Storybook**: Static build hosted under `/storybook` on GH Pages; PR preview artifacts attached in CI.
5. **Coverage & Angular Signals**: V8 coverage tool counts Angular signal initialization (`input()`, `computed()`, `signal()`) as branches, which can lower branch coverage to 70-75% even when all executable code is tested. **Statement and line coverage are the primary metrics** for signal-heavy components. Branch coverage below 80% is acceptable if statement/line coverage is ≥95%.
6. **Career Chatbot**: Client-side AI chatbot using WebLLM (Llama-3.1-8B) with RAG (Retrieval-Augmented Generation) for answering questions about career/experience. Build-time embeddings using `sentence-transformers` (all-MiniLM-L6-v2). Pure TypeScript vector search. All processing happens in-browser, no backend required. Model cached in IndexedDB.

---

## Phase 1: Enterprise Baseline & Project Infrastructure ✅ COMPLETE

**Goal**: Establish a production-quality foundation so development can proceed without major refactors.

### Objectives

- Establish complete project infrastructure before feature development
- Install and configure all required dependencies
- Set up development tooling and quality gates
- Create architectural foundation and design system
- Implement CI/CD pipeline with all quality gates
- Configure testing infrastructure (unit, E2E, visual regression)
- Ensure WCAG 2.1 AAA compliance through automated tooling
- Set up monitoring, analytics, and error tracking infrastructure

### Deliverables

**Project Setup:**

- [x] Angular 21.0 project with Vite
- [x] TypeScript 5.9 with strict mode
- [x] npm overrides for backward compatibility packages
- [x] Feature-based folder structure (Core, Shared, Features)
- [x] GitHub Copilot instructions file
- [x] EditorConfig and VS Code settings

**Dependencies Installed:**

- [x] Core: @angular/core, @angular/common, @angular/router, zone.js
- [x] State Management: @ngrx/signals
- [x] HTTP: @angular/common/http
- [x] Forms: @angular/forms
- [x] Testing: vitest, @playwright/test
- [x] Data Visualization: @swimlane/ngx-charts
- [x] Animations: @angular/animations
- [x] PWA: @angular/service-worker
- [x] i18n: @jsverse/transloco (configured with loader)
- [x] Icons: @ng-icons/core
- [x] Validation: zod
- [x] Documentation: @storybook/angular (configured), @compodoc/compodoc
- [x] Code Quality: eslint, @angular-eslint/eslint-plugin, @angular-eslint/template-parser (configured)
- [x] Accessibility: @angular-eslint/template/accessibility, @storybook/addon-a11y, @axe-core/playwright

**Architecture Foundation:**

- [x] Standalone components with signals
- [x] OnPush change detection strategy
- [x] Lazy-loaded routing in app.routes.ts
- [x] MainLayout shell component
- [x] NgRx SignalStore for state management
- [x] Mockend data layer with ProjectService
- [x] HTTP interceptor infrastructure (latency simulator)
- [x] Project model and TypeScript interfaces
- [x] Transloco i18n configuration with HttpClient loader
- [x] Storybook configuration with accessibility addon

**Design System:**

- [x] Custom SCSS theming with CSS variables
- [x] BEM naming convention standards
- [x] Comprehensive variable system (colors, spacing, typography)
- [x] Global styles (reset, utilities)
- [x] Responsive layout system
- [x] Ensure all accessibility tests pass

**Testing Infrastructure:**

- [x] Vitest configuration for unit tests
- [x] Vitest test setup with zone.js
- [x] Playwright configuration for E2E tests
- [x] Visual regression testing on 4 viewports (Desktop, Laptop, Tablet, Mobile)
- [x] Test coverage reporting with thresholds (80%)
- [x] Path aliases configured (@core, @shared, @features)
- [x] ESLint configuration with Angular ESLint
- [x] Accessibility linting (@angular-eslint/template/accessibility)
- [x] Playwright accessibility testing (@axe-core/playwright)
- [x] Storybook accessibility addon (@storybook/addon-a11y)

**CI/CD Pipeline:**

- [x] `.github/workflows/ci.yml` - Build, lint, test, coverage
  - [x] Matrix testing across Node versions (20.x, 22.x)
  - [x] Dependency caching for faster builds
  - [x] ESLint checks (including accessibility rules)
  - [x] Upload coverage reports as artifacts
  - [x] PR comments with coverage breakdown
  - [x] Fail on coverage below threshold (80%)
  - [x] Fail on accessibility linting errors
  - [x] Reusable coverage utility scripts
  - [x] Build artifact uploads
  - [x] Environment variables for maintainability
- [x] `.github/workflows/e2e.yml` - Playwright tests with artifacts
  - [x] Matrix testing across browsers (chromium, firefox, webkit)
  - [x] Upload test results and screenshots as artifacts
  - [x] Run on main branch and pull requests
  - [x] Separate visual regression test job for all viewports
  - [x] E2E status check job to aggregate results
- [x] `.github/workflows/lighthouse.yml` - Performance monitoring
  - [x] Run on PRs and main branch
  - [x] Performance budget enforcement (≥95 performance, 100 accessibility, 100 best practices, ≥95 SEO)
  - [x] Comment PR with Lighthouse scores and Core Web Vitals
  - [x] Desktop preset with 3 runs for accuracy
  - [x] Assert on Core Web Vitals (FCP <1.5s, LCP <2.5s, CLS <0.1, TBT <300ms, SI <3s)
  - [x] Upload Lighthouse reports as artifacts
  - [x] Status check job to aggregate results
- [x] `.github/workflows/dependency-review.yml` - Security checks
  - [x] Scan for vulnerabilities in dependencies on PRs
  - [x] Block high-severity vulnerabilities (critical, high)
  - [x] License compliance checks (deny GPL/LGPL/AGPL)
  - [x] Automated PR comments with vulnerability summary
  - [x] Upload review results as artifacts
- [x] GitHub's built-in CodeQL scanning enabled
  - [x] Static code security analysis for TypeScript/JavaScript
  - [x] Automatic scanning on push and pull requests
  - [x] Results visible in GitHub Security tab
  - [x] Simpler than custom workflow, automatically maintained by GitHub
- [x] Branch protection rules configured
  - [x] Require status checks to pass
  - [x] Require up-to-date branches
  - [x] Require signed commits (recommended)
  - [x] Enable linear history (no merge commits)
- [x] Required status checks enabled
  - [x] CI build passes
  - [x] Tests pass with coverage
  - [x] E2E tests pass
  - [x] Lighthouse meets budget

**Configuration Management:**

- [x] Create `shared/constants/` directory structure
  - [x] `routes.constants.ts` - All route paths with type safety
  - [x] `api.constants.ts` - API endpoints and GraphQL queries
  - [x] `config.constants.ts` - App-wide configuration values
  - [x] `app.constants.ts` - General constants (regex, limits, etc.)
  - [x] Barrel export in `index.ts`
  - [x] README documentation for constants usage
  - [x] Updated all existing code to use constants
- [x] Create environment files (demonstration purposes)
  - [x] `src/environments/environment.development.ts` - Local development
  - [x] `src/environments/environment.ts` - GitHub Pages production
  - [x] Environment type definitions
  - [x] Feature flags and API configuration
  - [x] README documentation for environments
- [x] Update angular.json with configurations
  - [x] Development: source maps, no optimization
  - [x] Production: minification, tree-shaking, baseHref for GitHub Pages
  - [x] File replacements for environment switching
  - [x] GitHub Pages configuration with proper base path

**Deployment & Documentation:**

- [x] `.github/workflows/deploy-pages.yml` - Automated GitHub Pages deployment
  - [x] Build with production configuration
  - [x] 404.html for SPA routing support
  - [x] Manual deployment trigger
- [x] Test GitHub Pages deployment workflow
  - [x] Merge configuration to main branch
  - [x] Verify workflow triggers correctly
  - [x] Confirm site deploys to `https://MoodyJW.github.io/moodyjw-portfolio/`
  - [x] Test SPA routing with 404.html fallback
  - [x] Verify all assets load with correct baseHref
  - [x] Confirm CI/CD pipeline runs successfully
- [x] Storybook build pipeline (`npm run build-storybook`) working and static output verified
- [x] Documentation generation (Compodoc) runs and publishes artifacts (docs/compodoc)
- [x] Create `.env.example` file (documentation purposes)
- [x] Document deployment process in README

**Observability & Monitoring Infrastructure:**

- [x] Analytics plan documented (`docs/ANALYTICS.md`)
  - [x] GA4 property structure defined
  - [x] Event naming catalog
  - [x] Consent flow defined
  - [x] Looker Studio demo report plan
- [x] Error tracking plan documented (`docs/ERROR_TRACKING.md`)
  - [x] Sentry configuration guidance
  - [x] Source map upload strategy
  - [x] Release tagging approach
- [x] Auth research documented (`docs/AUTH.md`)
  - [x] Ory vs Keycloak comparison
  - [x] Implementation recommendations
  - [x] Migration strategy
- [x] Secrets management and environment files (`.env.example`, GitHub Secrets) in place
- [x] Release & versioning policy documented (`docs/RELEASE_VERSIONING.md` - trunk-based development, semantic versioning, conventional commits)
- [x] Local dev reproducibility confirmed (README dev steps, `npm install`, `npm start`, `npm test`)

**Documentation & Standards:**

- All new components and features MUST include:
  - TSDoc for public APIs
  - At least one Storybook story demonstrating primary states
  - Unit tests covering component logic
- Exceptions: small demo-only components can be added without stories/tests if marked in `STORYBOOK_EXCEPTIONS.md` manifest; these should be migrated to full coverage before Phase 7.
- Compodoc runs in CI but documentation work is expected to be done alongside feature development (not at project end).

### Technical Details

- Angular CLI with Vite for fast builds
- Standalone components (no NgModules)
- Signal-based reactivity
- Functional interceptors (HttpInterceptorFn)
- NgRx SignalStore with computed selectors and rxMethod
- Mockend pattern for realistic API development
- Transloco for i18n with custom HttpClient loader
- Storybook 10 for component documentation with a11y addon
- Vitest for unit tests with 80% coverage threshold
- ESLint with Angular ESLint for code quality
- Accessibility linting enforcing WCAG 2.1 AAA standards
- axe-core integration in Playwright for automated a11y testing
- GitHub Actions for automated quality gates
- Playwright for cross-browser testing (Chromium, Firefox, WebKit)
- Visual regression with 4 viewports (Desktop, Laptop, Tablet, Mobile)
- Compodoc for API documentation generation

### Success Metrics

- All CI checks pass on PRs and main
- Test coverage ≥80% enforced
- Lighthouse score ≥95 on all metrics
- WCAG 2.1 AAA compliance verified
- Storybook preview available for PRs
- GitHub Pages deployment automated
- All documentation infrastructure in place

### Estimated Duration

2-3 days

---

## Phase 2: Shared Component Library ⏳ NEXT UP

**Goal**: Build an accessible, well-tested library of reusable components and scaffolding to use across the app before building features.

### Objectives

- Build enterprise-grade reusable component library
- Ensure consistency across application
- Implement accessibility standards (WCAG 2.1 AAA)
- Create comprehensive component documentation
- Establish theme system foundation

### Deliverables

**Theme System Foundation:**

- [x] Theme definitions registry (`THEMES` constant or `ThemeRegistry` service)
  - [x] At least four options at launch: two light (`Lumen`, `Aurora`) and two dark (`Nocturne`, `Cosmos`)
  - [x] Describe each theme's slug, human label, color tokens, contrast ratios
  - [x] Validate registry structure with Zod
  - [x] Ensure every theme documents WCAG AAA contrast data (≥7:1 for text, 4.5:1 for large display)
  - [x] Document contribution checklist for adding future themes
- [x] `ThemeService` (signal store) responsible for:
  - [x] Reading persisted preference from LocalStorage with graceful fallback
  - [x] Detecting `prefers-color-scheme` on first load and OS theme changes
  - [x] Applying active theme via `data-theme` attribute and CSS variable injection
  - [x] Exposing signals/computed values (`activeTheme`, `availableThemes`, `isSystemDefault`, `isDarkMode`)
  - [x] Store explicit user selection with timestamp/version for migrations
  - [x] Provide `resetToSystem()` helper
  - [x] Unit tests covering read/write scenarios and corrupt storage recovery
- [x] Styling implementation:
  - [x] Derive each theme from existing CSS variable system
  - [x] Create SCSS partial defining per-theme maps
  - [x] Ensure all combinations meet WCAG AAA contrast
  - [x] Support smooth but optional transitions (`prefers-reduced-motion` respected)
  - [x] Isolate animation tokens in CSS variables for reuse

**UI Components:**

- [x] ButtonComponent with variants (primary, secondary, tertiary, ghost, danger)
  - [x] 5 variants with full theme integration
  - [x] 3 sizes (sm, md, lg) with responsive touch targets
  - [x] Icon support (left, right, icon-only)
  - [x] Loading and disabled states
  - [x] WCAG 2.1 AAA compliant (color contrast, focus management, keyboard navigation)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (55 tests, 100% stmt/line/func coverage, 75.8% branch - signal artifacts)
  - [x] 13 Storybook stories with accessibility documentation
  - [x] BEM CSS with CSS variables for theming
- [x] CardComponent with header, body, footer slots
  - [x] 4 variants (default, elevated, outlined, filled) with full theme integration
  - [x] 4 padding options (none, sm, md, lg)
  - [x] Content projection slots (header, media, body, footer)
  - [x] Clickable and hoverable states
  - [x] WCAG 2.1 AAA compliant (semantic HTML, ARIA, keyboard navigation)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (48 tests, 98.24% stmt, 100% line, 90.9% func, 74% branch - signal artifacts)
  - [x] 13 Storybook stories with real-world examples
  - [x] BEM CSS with CSS variables, helper classes for common patterns
- [x] ModalComponent/DialogComponent with backdrop
  - [x] 4 variants (default, fullscreen, dialog, sidebar) with full theme integration
  - [x] 4 sizes (sm, md, lg, xl) for non-fullscreen variants
  - [x] Content projection slots (header, body, footer)
  - [x] Angular CDK A11y focus trapping and keyboard navigation
  - [x] WCAG 2.1 AAA compliant (focus management, ARIA, keyboard support)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (49 tests, >95% stmt/line coverage, >80% branch)
  - [x] 10 Storybook stories with accessibility demonstrations
  - [x] BEM CSS with CSS variables, animations respect prefers-reduced-motion
  - [x] ModalService for programmatic usage
  - [x] Body scroll lock, backdrop click handling, ESC key support
  - [x] Mobile responsive (auto fullscreen on small screens)
- [x] ToastNotificationComponent with auto-dismiss
  - [x] 4 variants (success, error, warning, info) with full theme integration
  - [x] Auto-dismiss with configurable duration (0 = no auto-dismiss)
  - [x] Manual dismiss with optional close button
  - [x] 6 position options (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
  - [x] WCAG 2.1 AAA compliant (ARIA live regions, keyboard navigation, color contrast)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Service-based toast management (ToastService)
  - [x] Toast container component for rendering toasts
  - [x] Comprehensive unit tests (93 tests total: 45 component, 29 service, 19 container)
  - [x] 10 Storybook stories with service integration demo
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] Complete documentation (README.md)
- [x] LoadingSpinnerComponent with sizes
  - [x] 4 sizes (sm, md, lg, xl) with customizable dimensions
  - [x] 4 variants (primary, secondary, light, dark) with full theme integration
  - [x] Optional message display below spinner
  - [x] Center and overlay modes for different use cases
  - [x] WCAG 2.1 AAA compliant (ARIA live regions, role, labels)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (44 tests, 100% stmt/line/func coverage, 72.41% branch - signal artifacts)
  - [x] 13 Storybook stories with usage examples
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] SVG-based circular spinner animation
- [x] SkeletonComponent for loading states
  - [x] 3 shape variants (text, circular, rectangular) with full theme integration
  - [x] 3 animation types (wave, pulse, none) with reduced motion support
  - [x] Customizable width and height with CSS value support
  - [x] Multiple skeleton items with configurable count and spacing
  - [x] Dynamic text width generation for natural-looking placeholders
  - [x] Rounded corners option for rectangular variant
  - [x] WCAG 2.1 AAA compliant (ARIA live regions, role, busy, labels)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (63 tests, 100% stmt/line/func coverage, 77.58% branch - signal artifacts)
  - [x] 16 Storybook stories including complex layouts (cards, lists, tables, dashboards)
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] Theme-aware styling for light and dark themes
- [x] BadgeComponent for tags and status
  - [x] 6 variants (primary, secondary, success, warning, error, info) with full theme integration
  - [x] 3 sizes (sm, md, lg)
  - [x] 4 position options (top-right, top-left, bottom-right, bottom-left)
  - [x] Numeric and string content support with max number display (e.g., "99+")
  - [x] Dot mode for simple notification indicators
  - [x] Hide when zero option for conditional visibility
  - [x] WCAG 2.1 AAA compliant (ARIA labels, live regions, color contrast)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (57 tests, 100% coverage)
  - [x] 11 Storybook stories with real-world examples
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] Attaches to any element (buttons, text, icons, avatars)
- [x] IconComponent system (ng-icons with Heroicons)
  - [x] Installed @ng-icons/heroicons package
  - [x] Created comprehensive icon registry with 90+ icons organized by category
  - [x] Type-safe ICON_NAMES constants for all available icons
  - [x] 6 size variants (xs, sm, md, lg, xl, 2xl) from 12px to 40px
  - [x] 7 color variants (current, primary, secondary, success, warning, error, info)
  - [x] Decorative mode for accessibility (aria-hidden when appropriate)
  - [x] Spin animation for loading indicators with reduced motion support
  - [x] WCAG 2.1 AAA compliant (ARIA labels, role="img", color contrast)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (41 tests, 100% coverage)
  - [x] 11 Storybook stories with real-world examples
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] Wraps ng-icon component with enhanced functionality
  - [x] Icons organized in categories: Navigation, User, Communication, Work, Feedback, Actions, Theme, Time, Organization, Media, Data, Tech, Engagement, Location
- [x] TabsComponent with keyboard navigation
  - [x] 4 visual variants (default, pills, underline, boxed) with full theme integration
  - [x] 3 size variants (sm, md, lg) with proper touch target sizes (36px, 44px, 52px)
  - [x] Horizontal and vertical orientation support
  - [x] Full keyboard navigation (Arrow keys, Home, End, Enter, Space)
  - [x] Optional icon support per tab via IconComponent
  - [x] Disabled tab state support
  - [x] Full-width mode for evenly distributed tabs
  - [x] Two-way binding with [(activeTabId)]
  - [x] WAI-ARIA tabs pattern (role="tablist", role="tab", role="tabpanel")
  - [x] WCAG 2.1 AAA compliant (ARIA labels, keyboard navigation, focus management)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (60 tests for TabsComponent and TabComponent)
  - [x] 10+ Storybook stories covering all variants and orientations
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] Content projection pattern for tab content via contentChildren()
  - [x] Automatic focus management and tab state synchronization
- [x] BreadcrumbComponent for navigation
  - [x] 4 visual variants (default, slash, chevron, arrow) with full theme integration
  - [x] 3 size variants (sm, md, lg) with proper touch target sizes
  - [x] Full Angular Router integration with query params and fragments
  - [x] Optional icon support per breadcrumb item via IconComponent
  - [x] Automatic ellipsis collapsing for deep hierarchies (maxItems option)
  - [x] WAI-ARIA breadcrumb pattern (role="navigation", aria-label, aria-current)
  - [x] WCAG 2.1 AAA compliant (ARIA labels, keyboard navigation, focus management)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] Comprehensive unit tests (54 tests covering all functionality)
  - [x] 15 Storybook stories with real-world examples and accessibility documentation
  - [x] BEM CSS with CSS variables, respects prefers-reduced-motion
  - [x] Complete documentation with TSDoc comments

**Form Components:**

- [x] InputComponent with validation states
  - [x] Standalone `InputComponent` with signal-based `input()` properties and `output()` events
  - [x] Supports `type` variants (`text`, `email`, `password`, `tel`, `url`, `search`, `number`)
  - [x] Validation states: `default`, `success`, `warning`, `error` with visual styling and ARIA (`aria-invalid`)
  - [x] Prefix and suffix slots (text or icons) with appropriate `aria-hidden` handling
  - [x] Character count support with `showCharCount` + `maxLength` and live `charCountText()` computed signal
  - [x] Helper text with computed ID linking via `aria-describedby` and helper CSS classes
  - [x] Full keyboard and focus handling (focus, blur, enter key events) and public focus/blur/select methods
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Computed helpers for wrapper/input classes, aria attributes, and footer visibility
  - [x] Unit tests: comprehensive spec file covering behavior (input handling, ARIA, computed values, events)
  - [x] Storybook stories: documented primary state with helper text and character-count demonstrated
  - [x] Accessibility: required `aria-label` enforced in tests; helper linked with `aria-describedby`; color contrast validated
  - [x] Notes: Footer markup extracted into a small `InputFooterComponent` to reduce template cyclomatic complexity and improve testability
- [x] TextareaComponent
  - [x] Standalone `TextareaComponent` with signal-based `input()` properties and `output()` events
  - [x] Supports 3 visual variants (`default`, `filled`, `outlined`) and 3 size options (`sm`, `md`, `lg`)
  - [x] Validation states: `default`, `success`, `warning`, `error` with visual styling and ARIA (`aria-invalid`)
  - [x] Configurable rows, minRows, maxRows with auto-resize functionality
  - [x] Resize options: `none`, `vertical`, `horizontal`, `both` for manual resizing
  - [x] Character count support with `showCharCount` + `maxLength` and live `charCountText()` computed signal
  - [x] Helper text with computed ID linking via `aria-describedby` and helper CSS classes
  - [x] Full keyboard and focus handling (focus, blur events) and public focus/blur/select methods
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Reuses `InputFooterComponent` for consistent footer styling
  - [x] Unit tests: 79 comprehensive tests covering all functionality (100% pass rate)
  - [x] Storybook stories: 22 stories covering all variants, sizes, states, and use cases
  - [x] Accessibility: required `aria-label` enforced; helper linked with `aria-describedby`; WCAG 2.1 AAA compliant
- [x] SelectComponent/DropdownComponent
  - [x] Standalone `SelectComponent<T>` with generic type support for option values
  - [x] Single and multiple selection modes with `multiple` input
  - [x] 3 visual variants (`default`, `filled`, `outlined`) and 3 size options (`sm`, `md`, `lg`)
  - [x] Validation states: `default`, `success`, `warning`, `error` with visual styling and ARIA (`aria-invalid`)
  - [x] Searchable dropdown with filter functionality via `searchable` input
  - [x] Clearable selections with optional clear button via `clearable` input
  - [x] Support for disabled options and option descriptions
  - [x] Full keyboard navigation (Arrow keys, Home, End, Enter, Space, Escape, Tab)
  - [x] Accessible listbox pattern with proper ARIA attributes (`aria-expanded`, `aria-selected`, `aria-multiselectable`)
  - [x] Helper text with computed ID linking via `aria-describedby`
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Unit tests: 100+ comprehensive tests covering all functionality (single/multiple modes, keyboard nav, search, validation)
  - [x] Storybook stories: 25+ stories covering all variants, sizes, states, and real-world use cases
  - [x] Accessibility: required `aria-label` enforced; full keyboard support; WCAG 2.1 AAA compliant
  - [x] Notes: Kept separate from autocomplete component following best practices (different interaction patterns)
- [x] CheckboxComponent
  - [x] 3 size variants (sm, md, lg) with proper touch target sizes (16px, 20px, 24px)
  - [x] 4 validation states (default, success, warning, error) with visual styling and ARIA
  - [x] Checked, unchecked, and indeterminate states for "select all" scenarios
  - [x] Full keyboard navigation (Space to toggle, Tab to focus)
  - [x] Optional label with required indicator (asterisk)
  - [x] Helper text with computed ID linking via `aria-describedby`
  - [x] Custom value and name attributes for form integration
  - [x] WAI-ARIA checkbox pattern (proper ARIA labels, invalid, describedby)
  - [x] WCAG 2.1 AAA compliant (ARIA labels, keyboard navigation, focus management, color contrast)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Comprehensive unit tests (72 tests covering all functionality, 100% pass rate)
  - [x] 15 Storybook stories covering all variants, states, and real-world examples
  - [x] Public methods: `focus()`, `blur()`, `toggle()`
  - [x] Complete accessibility documentation and keyboard navigation demo
  - [x] UniqueIdService for generating accessible element IDs
- [x] RadioComponent
  - [x] 3 size variants (sm, md, lg) with proper touch target sizes (36px, 40px, 44px, 48px)
  - [x] 4 validation states (default, success, warning, error) with visual styling and ARIA
  - [x] Checked and unchecked states with smooth transitions
  - [x] Full keyboard navigation (Arrow keys, Space to select)
  - [x] Optional label with required indicator (asterisk)
  - [x] Helper text with computed ID linking via `aria-describedby`
  - [x] Custom value and name attributes for radio groups
  - [x] WAI-ARIA radio pattern (proper ARIA labels, invalid, describedby)
  - [x] WCAG 2.1 AAA compliant (ARIA labels, keyboard navigation, focus management, color contrast)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Comprehensive unit tests (72 tests covering all functionality, 100% pass rate)
  - [x] 15 Storybook stories covering all variants, states, and real-world examples
  - [x] Public methods: `focus()`, `blur()`, `select()`
  - [x] Complete accessibility documentation and keyboard navigation demo
  - [x] Two outputs: `checkedChange` for two-way binding and `selected` for value emission
- [x] FormFieldComponent wrapper with label/error display
  - [x] Standalone component with signal-based inputs
  - [x] Automatic error detection from Angular FormControl
  - [x] Manual error message input (string or array of strings)
  - [x] Automatic validation state detection from FormControl
  - [x] Manual validation state override (default, success, warning, error)
  - [x] Reuses InputLabelComponent and InputFooterComponent
  - [x] Custom error messages with placeholder replacement (e.g., {requiredLength})
  - [x] Default error messages for common validators (required, email, minlength, etc.)
  - [x] Configurable showErrorsOnTouched behavior
  - [x] Content projection for wrapping any form control
  - [x] WCAG 2.1 AAA compliant (ARIA associations, labels, describedby)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Comprehensive unit tests (57 tests covering all functionality, 100% pass rate)
  - [x] 16 Storybook stories with standalone usage, Reactive Forms integration, and complete form examples
  - [x] Complete TSDoc documentation with usage examples
  - [x] Can be used independently or integrated with existing form components

**Layout Components:**

- [x] ContainerComponent with max-width variants
  - [x] 5 max-width variants (sm: 600px, md: 900px, lg: 1200px, xl: 1400px, full: 100%)
  - [x] 4 padding options (none, sm, md, lg) with responsive mobile adjustments
  - [x] Optional horizontal centering with `centerContent` input
  - [x] WCAG 2.1 AAA compliant (ARIA roles, labels, semantic structure)
  - [x] Full TypeScript typing with signal-based inputs
  - [x] OnPush change detection, BEM CSS with CSS variables, respects `prefers-reduced-motion`
  - [x] Comprehensive unit tests (35 tests, 100% pass rate)
  - [x] 11 Storybook stories with real-world layout examples
  - [x] Complete TSDoc documentation with usage examples
- [ ] GridComponent for responsive layouts
- [ ] StackComponent for vertical spacing
- [ ] DividerComponent

**Chatbot UI Components:**

- [ ] ChatMessageComponent for displaying user/bot messages
  - [ ] User and assistant message variants
  - [ ] Markdown rendering support for bot responses
  - [ ] Timestamp display
  - [ ] Loading indicator for streaming responses
  - [ ] WCAG 2.1 AAA compliant (ARIA live regions, semantic HTML)
  - [ ] Full TypeScript typing with signal-based inputs
  - [ ] Unit tests and Storybook stories
- [ ] ChatInputComponent for message composition
  - [ ] Multi-line textarea with auto-expand
  - [ ] Send button with keyboard shortcuts (Enter/Cmd+Enter)
  - [ ] Character limit and validation
  - [ ] Disabled state during message processing
  - [ ] WCAG 2.1 AAA compliant (keyboard navigation, labels)
  - [ ] Unit tests and Storybook stories
- [ ] ChatContainerComponent for chat UI shell
  - [ ] Message list with auto-scroll to bottom
  - [ ] Empty state for new conversations
  - [ ] Loading state while model initializes
  - [ ] Error state with retry functionality
  - [ ] Collapsible/expandable chat window
  - [ ] WCAG 2.1 AAA compliant (focus management, ARIA)
  - [ ] Unit tests and Storybook stories

**App Shell:**

- [ ] Update MainLayout with navigation menu
- [ ] Active route highlighting
- [ ] Mobile responsive navigation (hamburger menu)
- [ ] Footer with social links and copyright
- [ ] Skip-links for accessibility
- [ ] Wire ThemePicker into navbar

**Theme Picker:**

- [ ] Surface in MainLayout navbar as accessible dropdown
- [ ] Keyboard navigation, ARIA labelling, a11y-friendly focus management
- [ ] Use Transloco keys for labels/descriptions
- [ ] Show current selection plus system-default indicator
- [ ] Storybook stories (default, keyboard navigation demo, reduced-motion)
- [ ] Playwright smoke test verifying dropdown interaction

**Documentation (Phase 2):**

- [ ] Create stories for all shared components
  - [ ] Props/inputs documentation
  - [ ] Usage examples and code snippets
  - [ ] Accessibility notes (ARIA, keyboard nav)
  - [ ] Visual variants and states
- [ ] Add TSDoc comments to all component APIs
- [ ] Create component usage guide in README

### Technical Details

- Standalone components with signal inputs
- output() for events, input() for properties
- OnPush change detection for performance
- ARIA attributes and roles for accessibility
- Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Focus management and focus trapping
- Theme-aware using CSS variables
- Comprehensive unit tests (>90% coverage)
- Storybook stories for interactive documentation
- Lazy-loaded feature routes with route guards
- Route-level code splitting

### Acceptance Criteria

- Components are used by sample pages
- Storybook documents component variants
- Each component has test coverage and accessibility notes
- Theme picker meets WCAG 2.1 AAA
- Theme picker supports keyboard-only usage
- Theme persists preference, defaults to system scheme when unset
- New themes can be added by extending registry without touching component logic

### Estimated Duration

2-3 weeks

---

## Phase 3: Core Services & Utilities

**Goal**: Implement essential application services before building feature pages so they're available throughout development.

### Objectives

- Implement essential application services
- Create reusable utility functions
- Add error handling and logging
- Optimize performance and caching
- Set up SEO and analytics services

### Deliverables

**Application Services:**

- [x] ProjectService (data fetching) - completed in Phase 1
- [x] HTTP interceptors (latency) - completed in Phase 1
- [ ] ThemeService (completed in Phase 2, test coverage here)
- [ ] SeoService for meta tags and Open Graph
  - [ ] Dynamic title updates
  - [ ] Meta description updates
  - [ ] Open Graph tags for social sharing
  - [ ] Structured data (JSON-LD)
- [ ] AnalyticsService for usage tracking
  - [ ] Page view tracking
  - [ ] Event tracking
  - [ ] Custom dimensions
  - [ ] Privacy-friendly (GA4)
  - [ ] Consent-aware initialization
- [ ] ErrorHandlerService with global error handling
  - [ ] HTTP error interception
  - [ ] Client-side error catching
  - [ ] Error reporting (Sentry integration)
  - [ ] User-friendly error messages
- [ ] CacheService for API response caching
  - [ ] In-memory caching with TTL
  - [ ] LocalStorage fallback
  - [ ] Cache invalidation strategies
- [ ] LoggerService for structured logging
  - [ ] Log levels (debug, info, warn, error)
  - [ ] Production vs development logging
  - [ ] Performance timing logs

**Shared Utilities:**

- [ ] Date formatting utilities
- [ ] String manipulation helpers
- [ ] Custom validators (email, URL, etc.)
- [ ] Array and object utilities
- [ ] Debounce and throttle functions
- [ ] Regex patterns library

**Career Chatbot Core Services:**

- [ ] LlmService for WebLLM integration
  - [ ] Install `@mlc-ai/web-llm` package
  - [ ] Initialize WebLLM worker with Web Worker API
  - [ ] Load small model (Llama-3.1-8B-Instruct-q4f32_1 or similar)
  - [ ] Expose `embed(text)` method for query embeddings
  - [ ] Expose `generate(prompt, context)` method for response generation
  - [ ] Support streaming token generation for smooth UX
  - [ ] Model loading progress tracking with signals
  - [ ] Cache model in IndexedDB to avoid re-fetching
  - [ ] Error handling for unsupported browsers/hardware
  - [ ] Unit tests with mocked WebLLM worker
  - [ ] TSDoc documentation
- [ ] RagService for vector search and retrieval
  - [ ] Load embeddings.json on app startup
  - [ ] Implement cosine similarity function (pure TypeScript)
  - [ ] Query method: compute similarity against all corpus vectors
  - [ ] Return top K most relevant chunks (configurable, default 3-5)
  - [ ] Build final prompt with context injection template
  - [ ] Support for metadata filtering (optional)
  - [ ] Signal-based state for loaded embeddings
  - [ ] Unit tests covering similarity calculations
  - [ ] TSDoc documentation
- [ ] ChatbotStateService for conversation management
  - [ ] Signal store for chat messages history
  - [ ] Message interface (role, content, timestamp, id)
  - [ ] Add/remove message methods
  - [ ] Clear conversation method
  - [ ] Persist conversation to LocalStorage (optional)
  - [ ] Track loading/error states
  - [ ] Unit tests covering state mutations

**Custom Pipes:**

- [ ] DateAgoPipe (relative dates)
- [ ] TruncatePipe (text truncation)
- [ ] SafeHtmlPipe (sanitization)
- [ ] HighlightPipe (search term highlighting)
- [ ] FilterPipe (array filtering)
- [ ] SortPipe (array sorting)

**Documentation (Phase 3):**

- [ ] Run Compodoc to generate API documentation
- [ ] Document all services with TSDoc
- [ ] Create architecture decision records (ADRs)
  - [ ] Why standalone components
  - [ ] Why NgRx SignalStore
  - [ ] Why Mockend pattern
  - [ ] Why custom design system
- [ ] Document utility functions with examples
- [ ] Create testing guide (unit tests, mocking)

### Technical Details

- Service injection with inject() function
- Signal-based service state where appropriate
- Global error handler implementation
- HTTP interceptor chain
- LocalStorage abstraction for SSR compatibility
- Pure pipes for performance
- Comprehensive unit tests for utilities
- Compodoc for API documentation generation

### Success Metrics

- All services documented with TSDoc and ADRs
- Utility functions fully tested
- Global error handling operational
- SEO meta tags implemented
- Analytics tracking configured
- Compodoc documentation generated and published

### Estimated Duration

1-2 weeks

---

## Phase 4: Pages, Stores, and Feature Implementation

**Goal**: Implement feature pages and state management using the shared components and services.

### Objectives

- Build foundational feature pages
- Implement dedicated stores for feature domains
- Integrate state management with UI
- Implement routing and navigation
- Add initial content and portfolio pieces

### Deliverables

**Feature Stores:**

- [ ] Implement dedicated stores/services for feature domains:
  - [ ] `ProjectsStore` & `ProjectsService` — manages personal projects (small apps, demos, code samples)
  - [ ] `CaseStudiesStore` & `CaseStudiesService` — manages detailed case studies (work engagements, challenges, solutions, metrics)
  - [ ] Ensure stores follow signals-based patterns with `rxMethod` for async loads
  - [ ] Expose `isLoading`/`error` signals

**Home Page:**

- [x] HomeComponent with hero section (scaffolded in Phase 1)
- [ ] Professional introduction/bio section
- [ ] Featured projects showcase (3-4 highlights)
- [ ] Call-to-action buttons (View Projects, Contact)
- [ ] Smooth scroll navigation

**Case Studies Page:**

- [x] CaseStudiesComponent scaffolded (Phase 1)
- [ ] **Connect ProjectStore/CaseStudiesStore to component**
  - [ ] Inject store using inject()
  - [ ] Replace hardcoded data array with store.projects()
  - [ ] Call store.loadProjects() in ngOnInit
  - [ ] Use store.isLoading() for loading state
  - [ ] Use store.error() for error handling
- [ ] Project grid/list layout with filtering
- [ ] Tag-based filtering using store.projectsByTag()
- [ ] Search functionality across projects
- [ ] Loading skeletons for better UX
- [ ] Empty state when no projects match

**Case Study Detail Page:**

- [ ] Create CaseStudyDetailComponent
- [ ] Route parameter handling (/case-studies/:id)
- [ ] Use store.selectProject() and store.selectedProject()
- [ ] Project header with title, description, tags
- [ ] Challenge & Solution sections
- [ ] Technologies used section
- [ ] Results/metrics section
- [ ] Image gallery or screenshots
- [ ] "Back to projects" and "Next project" navigation
- [ ] Breadcrumb navigation

**Projects List & Detail:**

- [ ] ProjectsListComponent for personal projects
- [ ] ProjectDetailComponent with routing
- [ ] Filter and sort capabilities
- [ ] Connect to ProjectsStore

**Navigation & Layout:**

- [ ] Smooth page transitions with Angular animations

**Content:**

- [ ] Write 3-5 detailed case studies
- [ ] Write 3-5 personal project descriptions
- [ ] Professional headshot/avatar
- [ ] Bio and elevator pitch
- [ ] Skills and technologies list
- [ ] GitHub profile link
- [ ] LinkedIn profile link

**Career Chatbot Knowledge Base:**

- [ ] Prepare career knowledge base content
  - [ ] Collect resume content (work history, achievements, technical skills)
  - [ ] Document leadership experience and team management
  - [ ] Create project summaries with technical details
  - [ ] Organize education and certifications
  - [ ] Compile speaking/writing/contributions
  - [ ] Organize into clean Markdown or plain text sections
  - [ ] Chunk text into ~300-500 token segments
  - [ ] Create `/assets/chatbot/corpus.json` with chunk structure
  - [ ] Format: `[{ "id": 1, "text": "...", "metadata": {...} }, ...]`
  - [ ] Review for completeness and accuracy

**Documentation (Phase 4):**

- [ ] TSDoc comments on all component public APIs
- [ ] Storybook stories for feature components (where applicable)
- [ ] README updates for project structure
- [ ] Inline code comments for complex logic

### Technical Details

- ProjectStore/CaseStudiesStore fully integrated with all components
- Use @if/@for control flow with store signals
- Track expressions in loops for performance
- Route guards for detail page validation
- Lazy loading for optimal bundle size
- Angular animations for page transitions
- Responsive CSS Grid layouts

### Acceptance Criteria

- All pages built use shared components and their own service/store
- Unit + E2E checks pass for critical flows
- Theme picker persists selection and applies across pages
- Replace hard-coded arrays with appropriate store data
- Add load/error/loading states and skeletons

### Success Metrics

- All Phase 4 components have TSDoc, Storybook stories, and unit tests
- Stores fully integrated with UI
- Navigation and routing working smoothly
- Initial content published (3-5 case studies, 3-5 projects)
- Mobile responsive layouts verified
- Theme system functional across all pages

### Estimated Duration

2-3 weeks

---

## Phase 5: Integrations & Extended Functionality

**Goal**: Add external integrations, client-side career chatbot with RAG, optional auth, and advanced UX features.

### Objectives

- Add professional sections to showcase expertise
- Implement client-side career chatbot with WebLLM and RAG
- Integrate live data from GitHub
- Implement interactive features
- Add contact functionality
- Finalize analytics integration

### Deliverables

**About Section:**

- [ ] AboutComponent feature page
- [ ] Professional bio with personality
- [ ] Skills matrix with proficiency levels
- [ ] Professional timeline/experience
- [ ] Certifications and education
- [ ] Downloadable resume (PDF)

**Career Chatbot Integration & RAG Pipeline:**

- [ ] Generate build-time embeddings
  - [ ] Create Python script using `sentence-transformers`
  - [ ] Install `sentence-transformers` and `all-MiniLM-L6-v2` model
  - [ ] Load `corpus.json` and encode each chunk
  - [ ] Write `/assets/chatbot/embeddings.json` with vectors + chunk IDs
  - [ ] Format: `[{ "id": 1, "embedding": [...], "text": "..." }, ...]`
  - [ ] Run script manually before deployment
  - [ ] Document script usage in README
  - [ ] Consider automating in CI/CD pipeline (optional)
- [ ] Implement CareerChatbotComponent feature
  - [ ] Inject LlmService, RagService, ChatbotStateService
  - [ ] Initialize WebLLM model on component mount (or lazy load)
  - [ ] Display model loading progress to user
  - [ ] Implement chat message flow:
    - [ ] User sends question → embed query → RAG retrieval → build prompt → generate response
  - [ ] Stream response tokens for smooth UX (optional but recommended)
  - [ ] Handle errors gracefully (model load failures, generation errors)
  - [ ] Add "reset chat" functionality
  - [ ] WCAG 2.1 AAA compliant (keyboard navigation, ARIA, screen reader support)
  - [ ] Unit tests for component logic
  - [ ] E2E tests for chat interaction flow
  - [ ] Storybook stories demonstrating chatbot UI
- [ ] Performance & UX enhancements
  - [ ] Cache model in IndexedDB to avoid re-downloading
  - [ ] Lazy-load WebLLM when chatbot is opened
  - [ ] Add model loading progress bar
  - [ ] Optimize embeddings file size (consider compression)
  - [ ] Test on different devices/browsers for compatibility

**GitHub Integration & Data Visualization:**

- [ ] Create GitHubService with GraphQL API integration
  - [ ] Fetch user profile data
  - [ ] Fetch contribution data
  - [ ] Fetch repository statistics
  - [ ] Fetch language usage breakdown
  - [ ] Cache responses (1 hour TTL)
  - [ ] Document secrets usage
- [ ] Create GitHubStatsComponent
  - [ ] Contribution heatmap (ngx-charts)
  - [ ] Repository statistics cards
  - [ ] Language breakdown chart
  - [ ] Top repositories showcase
  - [ ] Loading states and error handling
- [ ] Theme ngx-charts to match design system
- [ ] Add feature toggle for GitHub section

**Contact & Interaction:**

- [ ] ContactComponent with reactive form
- [ ] Form validation with custom validators
- [ ] Email integration (EmailJS or serverless function)
- [ ] Success/error toast notifications
- [ ] reCAPTCHA integration for spam protection
- [ ] Social media links component
- [ ] No PII sent to analytics

**Analytics Finalization:**

- [ ] GA4 integration complete
  - [ ] Environment variable configuration
  - [ ] Init wrapper service
  - [ ] Pageview tracking
  - [ ] Key events tracked (`page_view`, `project_open`, `theme_change`, `contact_submit`)
  - [ ] Event naming catalog documented
- [ ] Consent flow implemented
- [ ] Looker Studio dashboards embedded for demo
- [ ] Dashboard embeddable and reachable from `/analytics` route

**Enhanced User Experience:**

- [ ] Search functionality across all content
- [ ] Filter/sort capabilities for projects
- [ ] "Back to top" button on long pages
- [ ] Smooth scroll with scroll spy navigation

**Auth (Optional):**

- [ ] Implement chosen auth provider (Ory/Keycloak) in sandboxed/optional manner
- [ ] Support demo profiles to persist user theme
- [ ] Document auth flow

### Technical Details

- GitHub GraphQL API with personal access token
- ngx-charts for data visualization
- Reactive forms with cross-field validation
- LocalStorage for theme and cache persistence
- CSS custom properties for dynamic theming
- Intersection Observer for scroll effects
- EmailJS or serverless function for contact form

### Acceptance Criteria

- Career chatbot functional with RAG-powered responses
- Chatbot provides accurate information about career/experience
- Model loads efficiently and caches properly
- Integrations documented
- Dashboards show expected data
- Optional auth flow demonstrable without blocking features

### Success Metrics

- Career chatbot operational with accurate RAG responses
- WebLLM model loads and caches efficiently (< 30 seconds initial load)
- Chatbot UI accessible and mobile-responsive
- GitHub integration working with live data
- Contact form functional with spam protection
- About section published with professional content
- Theme switcher working with persistence
- Search and filter functionality operational
- All features mobile-responsive
- Analytics events verified in GA4

### Estimated Duration

3-4 weeks (includes chatbot implementation)

---

## Phase 6: Performance Verification & PWA

**Goal**: Verify and finalize PWA and performance optimizations; implement ongoing checks as part of CI.

### Objectives

- Optimize application performance
- Implement Progressive Web App capabilities
- Add offline support
- Meet enterprise performance standards

### Deliverables

**Performance Optimization:**

- [ ] Lazy load images with loading="lazy"
- [ ] Implement virtual scrolling for large lists
- [ ] Code splitting and lazy loading optimization (verify earlier implementation)
- [ ] Preload critical resources
- [ ] Minify and compress assets
- [ ] Bundle size analysis and reduction (<200KB initial)
- [ ] Tree shaking verification
- [ ] Remove unused CSS
- [ ] Optimize font loading (font-display: swap)

**Progressive Web App:**

- [ ] Install @angular/service-worker
- [ ] Configure ngsw-config.json
- [ ] Service worker for caching strategies
- [ ] Offline page fallback
- [ ] App manifest (manifest.json)
  - [ ] App name and description
  - [ ] Icons (192x192, 512x512)
  - [ ] Theme colors
  - [ ] Display mode (standalone)
- [ ] Install prompt for mobile users
- [ ] Push notification infrastructure (optional)

**Image Optimization:**

- [ ] Use modern image formats (WebP, AVIF)
- [ ] Responsive images with srcset
- [ ] Lazy loading for below-fold images
- [ ] Image CDN integration (Cloudinary/similar)
- [ ] Blur-up loading technique

**Performance Monitoring:**

- [ ] Set performance budgets
  - [ ] First Contentful Paint < 1.5s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Time to Interactive < 3s
  - [ ] Cumulative Layout Shift < 0.1
- [ ] Core Web Vitals tracking
- [ ] Real User Monitoring (RUM) setup
- [ ] CI Lighthouse reports passing budgets

### Technical Details

- Angular Service Worker with caching strategies
- Intersection Observer for lazy loading
- Resource hints (preload, prefetch, preconnect)
- HTTP/2 push optimization
- Brotli compression
- Lighthouse CI integration

### Acceptance Criteria

- Performance budgets met
- PWA passes basic offline/installation tests
- Ensure lazy loading and route-level code splitting implemented
- Verify bundles per route are small

### Success Metrics

- Lighthouse score >95 on all metrics
- PWA installable on mobile devices
- Offline functionality working
- Bundle size <200KB initial load
- Core Web Vitals targets met
- Service worker caching optimized

### Estimated Duration

1-2 weeks

---

## Phase 7: QA, Accessibility, & Release Readiness

**Goal**: Final verification, audits, and production release readiness.

### Objectives

- Achieve comprehensive test coverage (>85%)
- Ensure accessibility compliance (WCAG 2.1 AAA)
- Validate cross-browser compatibility
- Meet performance benchmarks

### Deliverables

**Unit Testing:**

- [ ] Component tests for all features
  - [ ] Input/output behavior
  - [ ] Signal updates and reactivity
  - [ ] User interactions (click, input)
  - [ ] Conditional rendering (@if/@for)
- [ ] Service tests with mocked dependencies
- [ ] Store tests (verify Phase 1/4 stores)
- [ ] Pipe and directive tests
- [ ] Utility function tests
- [ ] Test coverage >85% across all modules (goal), >80% (acceptable)
- [ ] Mutation testing for critical paths

**Integration Testing:**

- [ ] Feature workflow tests
- [ ] Route navigation tests
- [ ] Form submission flows
- [ ] API integration tests with mock server
- [ ] Store + component integration

**E2E Testing (Playwright):**

- [x] Visual regression tests (4 viewports) - completed in Phase 1
- [x] Basic navigation tests - completed in Phase 1
- [ ] User journey tests
  - [ ] Browse projects → view detail → navigate back
  - [ ] Filter projects by tag
  - [ ] Search functionality
  - [ ] Contact form submission
  - [ ] Theme switching
- [ ] Cross-browser testing (Chromium, Firefox, WebKit)
- [ ] Mobile interaction testing (tap, swipe)
- [ ] Performance testing in E2E

**Accessibility Testing:**

- [ ] Automated axe-core testing (verify CI implementation)
- [ ] Keyboard navigation audit
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color contrast validation
- [ ] Focus management verification
- [ ] ARIA attribute validation
- [ ] Semantic HTML audit
- [ ] WCAG 2.1 AAA compliance certification

**Performance Testing:**

- [ ] Lighthouse audit (target >95)
  - [ ] Performance score >95
  - [ ] Accessibility score 100
  - [ ] Best Practices score 100
  - [ ] SEO score >95
- [ ] Core Web Vitals monitoring
- [ ] Bundle size analysis
- [ ] Network waterfall analysis
- [ ] Memory leak detection

**Security Review:**

- [ ] Security review and final CI green state
- [ ] Verify CodeQL and dependency-review passing
- [ ] Verify secret scanning enabled
- [ ] Review all GitHub Secrets usage

### Technical Details

- Vitest for unit/integration tests
- Testing Library for component testing
- Playwright for E2E with test artifacts
- axe-core for automated accessibility
- Lighthouse CI in pipeline
- Test parallelization for speed
- Snapshot testing for visual components
- Code coverage reporting with thresholds

### Acceptance Criteria

- Full unit/integration coverage threshold enforced (85% goal, 80% acceptable)
- Playwright E2E across browsers + visual regression baseline green
- axe-core checks in CI show no critical accessibility violations
- All checks green

### Success Metrics

- Test coverage >85% across all modules
- WCAG 2.1 AAA compliance verified
- All E2E user journeys passing
- Cross-browser testing complete (Chromium, Firefox, WebKit)
- Accessibility audit passed (automated + manual)
- Performance benchmarks met

### Estimated Duration

2 weeks

---

## Phase 8: Deployment, Monitoring & DevOps

**Goal**: Verify production deployment, finalize monitoring and alerting, ensure release readiness.

### Objectives

- Verify production deployment pipeline
- Set up monitoring and alerting
- Finalize analytics and error tracking
- Create release process

### Deliverables

**Hosting & Deployment:**

- [x] GitHub Pages configured (Phase 1)
  - [x] Automated deployment workflow
  - [x] Production builds with baseHref
  - [x] SPA routing support (404.html)
- [ ] Automated release workflow (version tagging, changelog generation, GitHub Releases)
- [ ] Verify production deployment
  - [ ] Test deployment workflow end-to-end
  - [ ] Validate all routes work correctly
  - [ ] Confirm assets load with correct paths
- [ ] Optional: Configure custom domain
  - [ ] Add CNAME record for custom domain
  - [ ] Update baseHref in angular.json
  - [ ] Configure SSL/TLS (automatic via GitHub Pages)

**CI/CD Workflows (Verification):**

- [x] `.github/workflows/ci.yml` - Active (Phase 1)
- [x] `.github/workflows/e2e.yml` - Active (Phase 1)
- [x] `.github/workflows/lighthouse.yml` - Active (Phase 1)
- [x] `.github/workflows/dependency-review.yml` - Active (Phase 1)
- [x] `.github/workflows/deploy-pages.yml` - Created in Phase 1
- [x] Branch protection rules configured (Phase 1)
- [x] Required status checks enforced (Phase 1)
- [ ] Verify all workflows pass on main branch after deployment
- [ ] Monitor deployment workflow for issues
- [ ] Document any workflow optimizations needed

**Monitoring & Analytics:**

- [ ] Error tracking integration (Sentry)
  - [ ] Source map upload for debugging
  - [ ] Error grouping and alerting
  - [ ] Performance monitoring
  - [ ] Release tracking
  - [ ] Test error appears in dashboard
- [ ] GA4 verification
  - [ ] Verify events in production
  - [ ] Confirm consent flow working
  - [ ] Validate Looker Studio dashboard
- [ ] Uptime monitoring (UptimeRobot or similar)
- [ ] Performance monitoring (Lighthouse CI, Web Vitals)

**DevOps Automation:**

- [x] Security vulnerability scanning (GitHub CodeQL + Dependency Review) - Phase 1
- [ ] Automated dependency updates (Dependabot)
- [ ] Automated changelog generation
- [ ] Semantic versioning and releases
- [ ] Release PR template
- [ ] Bundle size tracking in CI
- [ ] Deploy notifications (GitHub Actions status)

**Rollback & Recovery:**

- [ ] Rollback strategy documentation
- [ ] Tagged releases for version control
- [ ] Backup strategy for data/content
- [ ] Incident response playbook

**Documentation (Phase 8):**

- [x] Deployment guide (GitHub Pages) - in README.md (Phase 1)
- [x] Environment setup documentation - src/environments/README.md (Phase 1)
- [x] CI/CD pipeline documentation - in IMPLEMENTATION_PLAN.md (Phase 1)
- [ ] Troubleshooting guide for deployment issues
- [ ] Performance optimization guide

### Technical Details

- GitHub Actions for CI/CD automation
- GitHub Pages for static site hosting
- GitHub Secrets for sensitive data (API tokens)
- Automated deployment on push to main
- Lighthouse CI for performance budgets
- Matrix builds for parallel testing (Node 20.x, 22.x)
- Cross-browser E2E testing (Chromium, Firefox, WebKit)

### Acceptance Criteria

- Release PR approved and tagged
- Production site smoke tests pass

### Success Metrics

- Production deployment successful and stable
- All monitoring and alerting configured
- Error tracking operational with source maps
- Analytics tracking validated
- Deployment automation working
- Uptime monitoring active

### Estimated Duration

1 week

---

## Phase 9: Final Polish & Project Management

**Goal**: Consolidate and polish all documentation, set up project management infrastructure, create contribution guidelines.

### Objectives

- Consolidate and polish all documentation
- Set up project management infrastructure
- Create contribution and maintenance guidelines
- Final README and marketing content

### Deliverables

**Final Documentation Polish:**

- [ ] Review and update all TSDoc comments
- [ ] Verify Storybook stories are complete
- [ ] Ensure Compodoc is up to date
- [ ] Create system architecture diagrams
- [ ] Create data flow diagrams
- [ ] Create component hierarchy diagrams
- [ ] Final ADR review and updates

**Contribution Guidelines:**

- [ ] CONTRIBUTING.md
  - [ ] Code style requirements
  - [ ] Branch naming conventions
  - [ ] Commit message format (Conventional Commits)
  - [ ] Pull request process
  - [ ] Code review checklist
- [ ] Local development setup guide
- [ ] Troubleshooting guide

**Project Management Templates:**

- [ ] GitHub issue templates
  - [ ] Bug report template
  - [ ] Feature request template
- [ ] Pull request template
- [ ] Definition of Done checklist
- [ ] Automated changelog setup (CHANGELOG.md)

**Final README:**

- [ ] Project overview and mission statement
- [ ] Feature showcase with screenshots
- [ ] Tech stack with badges and links
- [ ] Quick start guide
- [ ] Available scripts documentation
- [ ] Project structure overview
- [ ] License information
- [ ] Links to live demo and Storybook
- [ ] Contact and social links

### Technical Details

- Mermaid diagrams in markdown
- Conventional Commits for changelog automation
- GitHub issue and PR templates
- Shields.io badges for README

### Success Metrics

- All documentation complete and up-to-date
- CONTRIBUTING.md published with clear guidelines
- README polished with project overview
- Issue and PR templates active
- Architecture diagrams created
- Project ready for public showcase

### Estimated Duration

3-5 days

---

## Continuous Improvements

### Ongoing Tasks

- Monitor and fix bugs
- Update dependencies
- Security patches
- Performance optimization
- A/B testing new features
- User feedback implementation
- Content updates
- SEO improvements

---

## Success Metrics

### Performance

- Lighthouse score > 95
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 200KB (initial)

### Code Quality

- Test coverage > 85% (goal), > 80% (acceptable)
- No critical accessibility issues
- TypeScript strict mode enabled
- Zero build warnings

### User Experience

- Mobile-first responsive design
- Cross-browser compatibility
- Keyboard navigation support
- Fast loading times

---

## Technology Stack Summary

### Core

- Angular 21.0 (Standalone Components)
- TypeScript 5.9
- npm overrides for package compatibility
- RxJS 7.8+
- Signals for state management

### Styling

- SCSS with CSS Variables
- BEM naming convention
- Custom design system (no frameworks)

### Build & Tools

- Angular CLI
- Vite (via Angular 21+)
- ESLint for linting
- Prettier for formatting

### Testing

- Vitest 4.0 for unit tests with coverage
- jsdom for browser environment simulation
- Playwright 1.56 for E2E and visual regression
- Testing Library patterns for component tests

### Deployment

- GitHub Actions
- GitHub Pages
- Automated previews for PRs

---

## Risk Mitigation

### Technical Risks

- **Browser compatibility**: Test early and often
- **Performance**: Monitor bundle size, lazy load aggressively
- **Breaking changes**: Pin major versions, update incrementally

### Project Risks

- **Scope creep**: Stick to phase objectives
- **Time estimation**: Buffer 20% for unknowns
- **Quality vs speed**: Never skip testing phase

---

## Next Steps

1. ✅ Complete Phase 1 (Infrastructure)
2. Begin Phase 2 (Shared Component Library)
3. Set up project board for tracking
4. Schedule weekly reviews
5. Document decisions in ADRs

---

## Phase Summary

| Phase       | Focus                                                   | Duration  | Status      |
| ----------- | ------------------------------------------------------- | --------- | ----------- |
| **Phase 1** | Enterprise Baseline & Infrastructure                    | 2-3 days  | ✅ Complete |
| **Phase 2** | Shared Component Library (includes chatbot UI)          | 2-3 weeks | ⏳ Next Up  |
| **Phase 3** | Core Services & Utilities (includes LLM/RAG services)   | 1-2 weeks | ⏳ Pending  |
| **Phase 4** | Pages, Stores, and Feature Implementation (+ corpus)    | 2-3 weeks | ⏳ Pending  |
| **Phase 5** | Integrations & Extended Functionality (+ chatbot setup) | 3-4 weeks | ⏳ Pending  |
| **Phase 6** | Performance Verification & PWA                          | 1-2 weeks | ⏳ Pending  |
| **Phase 7** | QA, Accessibility, & Release Readiness                  | 2 weeks   | ⏳ Pending  |
| **Phase 8** | Deployment, Monitoring & DevOps                         | 1 week    | ⏳ Pending  |
| **Phase 9** | Final Polish & Project Management                       | 3-5 days  | ⏳ Pending  |

**Total Estimated Duration**: 14-21 weeks (3.5-5 months)

---

## Next Immediate Actions

### Phase 2 Kickoff Tasks:

1. Build theme system foundation (ThemeService, registry, SCSS)
2. Create shared UI components (Button, Card, Modal, Toast, etc.)
3. Create form components (Input, Select, Checkbox, etc.)
4. Create layout components (Container, Grid, Stack)
5. Build ThemePickerComponent and integrate into MainLayout
6. Update MainLayout with full navigation
7. Document all components in Storybook with accessibility notes

---

**Document Version**: 3.6 (Career Chatbot Integration)
**Last Updated**: December 1, 2025
**Status**: Phase 1 ✅ Complete | Phase 2 Next Up
**Approach**: Infrastructure-First Enterprise Development | Client-Side AI Career Chatbot | GitHub Pages Deployment
