# MoodyJW Portfolio - Implementation Plan (Reorganized)

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

**Status**: ✅ Complete

All infrastructure, CI/CD, testing, and deployment foundations are in place.

**Key Achievements**:

- Angular 21.0 with Vite, TypeScript 5.9 strict mode
- Complete CI/CD pipeline (build, test, lint, E2E, Lighthouse, security)
- GitHub Pages deployment automated
- Vitest + Playwright testing infrastructure
- Theme system foundation (4 themes with WCAG AAA compliance)
- Design system with CSS variables and BEM naming
- Storybook + Compodoc documentation

---

## Phase 2: Shared Component Library ✅ COMPLETE

**Status**: ✅ Complete
**Goal**: Build an accessible, well-tested library of reusable components before building features.

### Current Metrics (as of December 6, 2025)

- **Components**: 21 production-ready shared components
- **Unit Tests**: 2,364+ passing (2 skipped) across 51 test files
- **Services**: 7 production-ready services (Modal, Toast, SEO, Analytics, ErrorHandler, Cache, Logger)
- **Utilities**: 5 utility modules (Date: 112 tests, String: 120 tests, Validation: 68 tests, Array/Object: 84 tests, Debounce/Throttle: 37 tests)
- **E2E Tests**: 170 passing (40 skipped) across all browsers/viewports
- **Test Coverage**: >95% statement/line coverage
- **Documentation**: 21 component READMEs + 5 service READMEs + 5 utility READMEs + full Storybook + TSDoc
- **Accessibility**: 100% WCAG 2.1 AAA compliant
- **Linting**: Zero errors

### Components Completed

**Theme System**: ✅

- ThemeService (signal store) with localStorage persistence
- 4 themes (Lumen, Aurora, Nocturne, Cosmos)
- WCAG AAA contrast compliance

**UI Components**: ✅

- ButtonComponent (5 variants, 3 sizes, icon support)
- CardComponent (4 variants, content slots)
- ModalComponent (4 variants, ModalService)
- ToastComponent (4 variants, ToastService, 6 positions)
- LoadingSpinnerComponent (4 sizes, 4 variants, overlay mode)
- SkeletonComponent (3 shapes, 3 animation types)
- BadgeComponent (6 variants, 3 sizes, positioning)
- IconComponent (90+ Heroicons, 6 sizes, 7 colors)
- TabsComponent (4 variants, keyboard nav)
- BreadcrumbComponent (4 variants, router integration)

**Form Components**: ✅

- InputComponent (7 types, validation states, char count)
- TextareaComponent (3 variants, auto-resize)
- SelectComponent (single/multi, searchable, keyboard nav)
- CheckboxComponent (indeterminate support)
- RadioComponent (arrow key navigation)
- FormFieldComponent (error handling, validation)

**Layout Components**: ✅

- ContainerComponent (5 max-widths, responsive padding)
- GridComponent (12-column system, responsive)
- StackComponent (vertical/horizontal spacing)
- DividerComponent (horizontal/vertical, label support)

### Remaining Phase 2 Tasks

**App Shell Updates**:

- [x] Update MainLayout with full navigation menu
  - **Uses**: ButtonComponent, IconComponent, StackComponent
  - [x] Header with logo and primary navigation
  - [x] Mobile hamburger menu with slide-out drawer
  - [x] Active route highlighting
  - [x] Skip-links for accessibility
- [x] Footer component
  - **Uses**: ContainerComponent, DividerComponent, IconComponent (Ionicons)
  - [x] Social media links (GitHub, LinkedIn) with icon-only design
  - [x] Copyright notice
  - [x] Navigation links (hidden on mobile)
  - [x] Responsive layout with CSS Grid and Flexbox
  - [x] Integrated Ionicons package for brand logos
  - [x] Refactored EXTERNAL_LINKS to structured object pattern (url, label, ariaLabel)
  - [x] 43 unit tests passing
  - [x] 8 Storybook stories
- [x] Theme Picker component ✅ Complete
  - **Uses**: IconComponent, BadgeComponent, StackComponent
  - [x] Custom dropdown implementation (accessible)
  - [x] Show current theme with icon (sun/moon)
  - [x] Dropdown with all 4 themes
  - [x] System default indicator and option
  - [x] Keyboard navigation (Enter, Space, Escape)
  - [x] Click-outside-to-close functionality
  - [x] Active theme highlighting
  - [x] WCAG 2.1 AAA compliant (ARIA attributes, keyboard support)
  - [x] 35 unit tests passing
  - [x] Full TSDoc documentation
  - [x] Integrated into MainLayout navbar
  - [x] Storybook stories
  - [x] Playwright E2E test

**Documentation**:

- [x] TSDoc comments on all components (done)
- [x] Storybook stories for all components (done)
- [x] Create component usage guides (21 READMEs created)
- [x] Document component composition patterns (covered in READMEs)

### Phase 2 Complete! 🎉

All shared components built, tested, documented, and production-ready.

---

## Phase 3: Core Services & Utilities ✅ COMPLETE

**Status**: ✅ Complete
**Goal**: Implement essential application services before building feature pages.

### Deliverables

**Application Services**:

- [x] **SeoService** for meta tags and Open Graph ✅ Complete

  - [x] Dynamic title updates
  - [x] Meta description updates
  - [x] Open Graph tags for social sharing (title, description, image, type, url, site_name)
  - [x] Twitter Card tags (card type, title, description, image)
  - [x] Article-specific tags (published_time, modified_time, author, tags)
  - [x] Canonical URL management
  - [x] Structured data (JSON-LD) with add/remove functionality
  - [x] Signal-based reactive state (title, description signals)
  - [x] Reset functionality
  - [x] 57 comprehensive unit tests
  - [x] Full README documentation with examples
  - [x] TypeScript interfaces for type safety (SeoConfig, StructuredDataConfig)

- [x] **AnalyticsService** for usage tracking ✅ Complete

  - [x] Page view tracking with manual control
  - [x] Event tracking (project_view, theme_change, contact_submit, outbound links)
  - [x] Custom dimensions (user properties applied to all events)
  - [x] Privacy-friendly (GA4 with IP anonymization, secure cookies)
  - [x] Consent-aware initialization with dynamic consent updates
  - [x] Event queuing (queue events before initialization/consent)
  - [x] Signal-based reactive state (isInitialized, hasConsent, isEnabled)
  - [x] Predefined event helpers (trackProjectView, trackThemeChange, etc.)
  - [x] 60+ comprehensive unit tests with mocked GA4
  - [x] Full README documentation with examples and best practices
  - [x] TypeScript interfaces for type safety (AnalyticsEvent, PageView, CustomDimensions, ConsentStatus)

- [x] **ErrorHandlerService** with global error handling ✅ Complete

  - [x] HTTP error interception with handleHttpError()
  - [x] Client-side error catching (implements Angular ErrorHandler interface)
  - [x] Error reporting (Sentry integration ready via setupExternalReporting())
  - [x] User-friendly error messages for all HTTP status codes
  - [x] Toast notifications for errors with severity-based behavior
  - [x] Signal-based error storage (up to 50 most recent errors)
  - [x] Error severity classification (low, medium, high, critical)
  - [x] Console logging with formatted output
  - [x] Contextual error information (source, action, data)
  - [x] 49 comprehensive unit tests
  - [x] Full README documentation with examples
  - [x] TypeScript interfaces for type safety (ErrorContext, LoggedError, ErrorSeverity)
  - **Uses**: ToastService

- [x] **CacheService** for API response caching ✅ Complete

  - [x] In-memory caching with TTL (default 5 minutes, customizable)
  - [x] LocalStorage fallback with availability checking
  - [x] Cache invalidation strategies (manual delete, clear all, clear expired)
  - [x] Automatic periodic cleanup of expired entries (every 60 seconds)
  - [x] Signal-based reactive statistics (hits, misses, hit rate)
  - [x] Type-safe generic interface for cached values
  - [x] Cache statistics tracking (size, hits, misses, hit rate)
  - [x] Custom storage key prefixes for localStorage
  - [x] 58 comprehensive unit tests with fake timers
  - [x] Full README documentation with examples and best practices
  - [x] TypeScript interfaces for type safety (CacheOptions, CacheStats)

- [x] **LoggerService** for structured logging ✅ Complete

  - [x] Log levels (debug, info, warn, error) with filtering
  - [x] Production vs development logging (auto-configured based on environment)
  - [x] Performance timing logs (startTimer, endTimer, measure)
  - [x] Console API abstraction (debug, info, warn, error, group, table)
  - [x] Context loggers with automatic tagging
  - [x] Log history storage (development only, last 100 entries)
  - [x] Configurable formatting (timestamps, prefixes, context display)
  - [x] Grouping and table logging support
  - [x] Assertions for debugging
  - [x] 57 comprehensive unit tests
  - [x] Full README documentation with examples and best practices
  - [x] TypeScript interfaces and enums (LogLevel, LoggerConfig, LogEntry, PerformanceEntry)

**Shared Utilities**:

- [x] **Date utilities** ✅ Complete

  - [x] Date formatting functions (ISO, long, medium, short, custom)
  - [x] Time formatting (12/24 hour with optional seconds)
  - [x] Relative time (timeAgo with customizable options)
  - [x] Date validation (isValidDate type guard)
  - [x] Date comparison (isToday, isYesterday, isTomorrow, isPast, isFuture, isSameDay)
  - [x] Date math (addDays, addMonths, addYears, diffInDays, diffInHours)
  - [x] Range checking (isWithinRange)
  - [x] Boundary helpers (startOfDay, endOfDay, startOfMonth, endOfMonth)
  - [x] 112 comprehensive unit tests
  - [x] Full README documentation with examples, best practices, and common patterns
  - [x] TypeScript interfaces (DateFormatOptions, RelativeTimeOptions, DateRange)
  - [x] Locale support for all formatting functions
  - [x] Zero dependencies, immutable functions

- [x] **String utilities** ✅ Complete

  - [x] Truncate with ellipsis (end, middle, start positions, custom ellipsis, word-aware)
  - [x] Slug generation (URL-friendly, custom separators, accent handling, custom replacements)
  - [x] Capitalize, capitalizeFirst, titleCase helpers
  - [x] Case conversion (camelCase, PascalCase, snake_case, kebab-case)
  - [x] Text transformation (reverse, repeat, chunk, initials)
  - [x] Whitespace control (remove, collapse, pad)
  - [x] HTML utilities (escape, unescape, strip tags, escape regex)
  - [x] Validation (isAlpha, isAlphanumeric, isNumeric, isLowerCase, isUpperCase)
  - [x] Search utilities (startsWith, endsWith, contains with case-insensitive options)
  - [x] Name utilities (initials extraction, word count)
  - [x] 120 comprehensive unit tests
  - [x] Full README documentation with examples, best practices, and migration guide
  - [x] TypeScript interfaces (TruncateOptions, SlugOptions)
  - [x] Zero dependencies, immutable functions

- [x] **Validation utilities** ✅ Complete

  - [x] Email validator (RFC-compliant with options for plus signs, IP domains, TLD requirements)
  - [x] URL validator (protocol, TLD, query string, fragment options)
  - [x] Phone number validator (international formats, country-specific rules, extensions)
  - [x] Credit card validator (Luhn algorithm)
  - [x] Password strength validator (configurable requirements)
  - [x] Postal code validator (multi-country: US, UK, CA, DE, FR, JP, AU)
  - [x] IP address validator (IPv4, IPv6, or both)
  - [x] Hex color validator (full and shorthand formats)
  - [x] JSON validator (parse-safe validation)
  - [x] Custom Angular validators (emailValidator, urlValidator, phoneValidator, etc.)
  - [x] Number validators (minValue, maxValue, rangeValidator)
  - [x] Match validator (password confirmation, field matching)
  - [x] 68 comprehensive unit tests
  - [x] Full README documentation with Angular integration examples
  - [x] TypeScript interfaces (EmailValidationOptions, UrlValidationOptions, PhoneValidationOptions, PasswordStrengthOptions)
  - [x] Zero dependencies, fully type-safe

- [x] **Array/Object utilities** ✅ Complete
  - [x] Deep clone (objects, arrays, Date, RegExp, Map, Set with circular reference protection)
  - [x] Group by (property key or function)
  - [x] Unique by key (property key or function)
  - [x] Sort helpers (ascending/descending, case-insensitive, custom comparator)
  - [x] Array utilities (flatten, chunk, compact, arrayDifference)
  - [x] Set operations (intersection, union)
  - [x] Object utilities (pick, omit, deepMerge, isEmpty, invert)
  - [x] Nested property access (getPath, setPath with dot notation)
  - [x] 84 comprehensive unit tests
  - [x] TypeScript interfaces (DeepCloneOptions, SortOptions, ArrayDifference)
  - [x] Zero dependencies, fully type-safe

- [x] **Debounce/Throttle** ✅ Complete
  - [x] Debounce function (leading/trailing edge, maxWait, cancel/flush)
  - [x] Throttle function (leading/trailing edge)
  - [x] RxJS operators (rxDebounce, rxThrottle)
  - [x] Additional utilities (once, rateLimit, delay, memoize)
  - [x] 37 comprehensive unit tests
  - [x] Full TypeScript type safety with generics
  - [x] Angular v21 best practices
  - [x] Extensive documentation with Angular examples

**Custom Pipes**: ✅ Complete

- [x] **DateAgoPipe** (relative dates) - "2 hours ago"
  - [x] Transforms dates into relative time strings
  - [x] Customizable options (includeSuffix, maxUnit, short format)
  - [x] 40 comprehensive unit tests
  - [x] Full README documentation with examples
  - [x] TypeScript interfaces for type safety
- [x] **TruncatePipe** (text truncation with ellipsis)
  - [x] Truncates text to specified length with ellipsis
  - [x] Multiple truncation positions (end, middle, start)
  - [x] Custom ellipsis character support
  - [x] Word-aware truncation option
  - [x] 25 comprehensive unit tests
  - [x] Full README documentation
- [x] **SafeHtmlPipe** (sanitization for trusted HTML)
  - [x] Sanitizes HTML content using Angular's DomSanitizer
  - [x] Returns SafeHtml type for secure rendering
  - [x] Comprehensive security warnings in documentation
  - [x] 28 comprehensive unit tests
  - [x] Full README documentation with security best practices
- [x] **HighlightPipe** (search term highlighting)
  - [x] Highlights search terms with <mark> tags
  - [x] Case-sensitive and case-insensitive modes
  - [x] HTML escaping for XSS prevention
  - [x] Regex special character handling
  - [x] 40 comprehensive unit tests
  - [x] Full README documentation
- [x] **FilterPipe** (array filtering)
  - [x] Filters arrays by predicate function or property matching
  - [x] Case-insensitive string search
  - [x] Impure pipe for array change detection
  - [x] 37 comprehensive unit tests
  - [x] Full README documentation with performance warnings
- [x] **SortPipe** (array sorting)
  - [x] Sorts arrays by property or custom comparator
  - [x] Ascending/descending order support
  - [x] String, number, and Date type support
  - [x] Null/undefined handling (sorts to end)
  - [x] Impure pipe for array change detection
  - [x] 35 comprehensive unit tests
  - [x] Full README documentation with performance warnings

**Total**: 205 tests passing across 6 custom pipes

**Documentation**: ✅ Complete

- [x] Run Compodoc to generate API documentation
- [x] Document all services with TSDoc
- [x] Create architecture decision records (ADRs)
  - [x] Why standalone components (ADR 001)
  - [x] Why NgRx SignalStore (ADR 002)
  - [x] Why Mockend pattern (ADR 003)
  - [x] Why custom design system (ADR 004)
- [x] Document utility functions with examples
- [x] Create testing guide (unit tests, mocking, E2E, coverage)

### Technical Details

- Service injection with inject() function
- Signal-based service state where appropriate
- Global error handler implementation
- HTTP interceptor chain
- LocalStorage abstraction for SSR compatibility
- Pure pipes for performance
- Comprehensive unit tests for utilities

### Success Metrics ✅ All Achieved

- ✅ All services documented with TSDoc and ADRs
- ✅ Utility functions fully tested (>95% coverage)
- ✅ Global error handling operational
- ✅ SEO meta tags implemented
- ✅ Analytics tracking configured
- ✅ All 6 custom pipes implemented (205 tests)
- ✅ Comprehensive testing guide created
- ✅ All documentation generated (Compodoc, ADRs, READMEs)

### Phase 3 Complete! 🎉

All services, utilities, pipes, and documentation are production-ready.

---

## Phase 4: Feature Pages & Content

**Status**: ⏳ Next Up
**Goal**: Implement core feature pages using shared components and services.

### Objectives

- Implement feature stores with mock data (Mockend pattern)
- Build foundational feature pages with shared component library
- Configure routing and navigation
- Create responsive, accessible user experiences
- Add placeholder content for development/testing

### Implementation Order

Phase 4 follows a strict dependency order:

1. **Foundation** (Week 1): Routing → Feature Stores → Data Models
2. **List Pages** (Week 1-2): Projects List → Case Studies List
3. **Detail Pages** (Week 2): Project Detail → Case Study Detail
4. **Info Pages** (Week 2-3): Home Enhancements → About → Contact
5. **Polish** (Week 3): Navigation improvements → Testing → Content refinement

### Deliverables

---

#### Part 1: Foundation (Days 1-3)

**Routing Configuration**:

- [ ] **Configure feature routes in app.routes.ts**
  - [ ] Home route: `/` → HomeComponent (already exists)
  - [ ] Projects list route: `/projects` → ProjectsListComponent
  - [ ] Project detail route: `/projects/:slug` → ProjectDetailComponent
  - [ ] Case studies list route: `/case-studies` → CaseStudiesComponent (already exists)
  - [ ] Case study detail route: `/case-studies/:slug` → CaseStudyDetailComponent
  - [ ] About route: `/about` → AboutComponent
  - [ ] Contact route: `/contact` → ContactComponent
  - [ ] 404 route: `**` → NotFoundComponent (create if needed)
  - [ ] Update navigation links in MainLayout
  - [ ] Test all routes navigate correctly

**Data Models & Interfaces**:

- [ ] **Create shared interfaces** (`src/app/core/models/`)
  - [ ] Project interface (id, slug, title, description, technologies, images, links, category, featured, createdDate, etc.)
  - [ ] CaseStudy interface (id, slug, title, description, client, role, duration, challenge, solution, results, technologies, images, etc.)
  - [ ] Skill interface (name, proficiency, category, yearsOfExperience)
  - [ ] Experience interface (company, role, duration, description, technologies, achievements)
  - [ ] Certification interface (name, issuer, date, status, credentialUrl)
  - [ ] ContactForm interface (name, email, subject, message)

**Feature Stores**:

- [ ] **ProjectsService** (`src/app/core/services/projects/projects.service.ts`)
  - [ ] Injectable service with `providedIn: 'root'`
  - [ ] Create mock data array (5-7 sample projects)
  - [ ] `getAll(): Observable<Project[]>` - returns all projects
  - [ ] `getBySlug(slug: string): Observable<Project | undefined>` - returns single project
  - [ ] `getFeatured(): Observable<Project[]>` - returns featured projects only
  - [ ] Use `of()` with `delay(500)` to simulate async (Mockend pattern from ADR 003)
  - [ ] Unit tests (57+ tests covering all methods)
  - [ ] Full TSDoc documentation

- [ ] **ProjectsStore** (`src/app/core/stores/projects.store.ts`)
  - [ ] Create with `signalStore()` and `providedIn: 'root'`
  - [ ] **State**: `projects`, `selectedProject`, `isLoading`, `error`, `searchQuery`, `selectedTags`, `sortBy`
  - [ ] **Computed signals**:
    - [ ] `filteredProjects()` - applies search, tag filtering, and sorting
    - [ ] `featuredProjects()` - returns featured projects only
    - [ ] `projectsByCategory()` - groups projects by category
  - [ ] **Methods** with `withMethods()`:
    - [ ] `loadProjects()` - rxMethod to load all projects
    - [ ] `selectProject(slug: string)` - rxMethod to load single project
    - [ ] `setSearchQuery(query: string)` - updates search
    - [ ] `toggleTag(tag: string)` - adds/removes tag filter
    - [ ] `setSortBy(sort: 'recent' | 'popular' | 'name')` - updates sort
    - [ ] `clearFilters()` - resets all filters
  - [ ] Unit tests (60+ tests covering all methods and computed signals)
  - [ ] Full TSDoc documentation

- [ ] **CaseStudiesService** (`src/app/core/services/case-studies/case-studies.service.ts`)
  - [ ] Injectable service with `providedIn: 'root'`
  - [ ] Create mock data array (3-5 sample case studies)
  - [ ] `getAll(): Observable<CaseStudy[]>` - returns all case studies
  - [ ] `getBySlug(slug: string): Observable<CaseStudy | undefined>` - returns single case study
  - [ ] Use `of()` with `delay(500)` to simulate async (Mockend pattern)
  - [ ] Unit tests (45+ tests covering all methods)
  - [ ] Full TSDoc documentation

- [ ] **CaseStudiesStore** (`src/app/core/stores/case-studies.store.ts`)
  - [ ] Create with `signalStore()` and `providedIn: 'root'`
  - [ ] **State**: `caseStudies`, `selectedCaseStudy`, `isLoading`, `error`, `searchQuery`, `selectedTags`
  - [ ] **Computed signals**:
    - [ ] `filteredCaseStudies()` - applies search and tag filtering
  - [ ] **Methods** with `withMethods()`:
    - [ ] `loadCaseStudies()` - rxMethod to load all case studies
    - [ ] `selectCaseStudy(slug: string)` - rxMethod to load single case study
    - [ ] `setSearchQuery(query: string)` - updates search
    - [ ] `toggleTag(tag: string)` - adds/removes tag filter
    - [ ] `clearFilters()` - resets all filters
  - [ ] Unit tests (50+ tests covering all methods and computed signals)
  - [ ] Full TSDoc documentation

---

#### Part 2: List Pages (Days 4-7)

**Projects List Page**:

- [ ] **ProjectsListComponent** (create new: `src/app/features/projects/projects-list/projects-list.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper)
  - StackComponent (vertical spacing)
  - GridComponent (project cards grid)
  - CardComponent (each project card)
  - SkeletonComponent (loading states)
  - InputComponent (search)
  - SelectComponent (sort dropdown)
  - TabsComponent (category filter)
  - BadgeComponent (technology tags, GitHub stars)
  - ButtonComponent (clear filters, view project)
  - IconComponent (search icon, external link, GitHub)
  - BreadcrumbComponent (page navigation)

  **Implementation Tasks**:
  - [ ] Generate component: `ng generate component features/projects/projects-list --standalone`
  - [ ] Inject ProjectsStore using `inject()`
  - [ ] Call `store.loadProjects()` in constructor or `ngOnInit`
  - [ ] **Header section**:
    - [ ] BreadcrumbComponent at top
    - [ ] Page title with ContainerComponent
    - [ ] StackComponent for header content spacing
  - [ ] **Filter/Search section** (sticky on scroll):
    - [ ] InputComponent for search with debounce (use debounce utility from Phase 3)
    - [ ] Bind to `store.setSearchQuery()`
    - [ ] SelectComponent for sort order (Most Recent, Most Popular, A-Z)
    - [ ] Bind to `store.setSortBy()`
    - [ ] TabsComponent for category filter (All, Web Apps, Tools, Demos)
    - [ ] ButtonComponent to clear all filters
    - [ ] Show active filter count BadgeComponent
  - [ ] **Projects grid**:
    - [ ] GridComponent with responsive columns (1/2/3)
    - [ ] Loop through `store.filteredProjects()` with `@for`
    - [ ] CardComponent for each project with hover effect
    - [ ] Project thumbnail/image at top
    - [ ] Project title and description
    - [ ] BadgeComponent for each technology
    - [ ] BadgeComponent for GitHub stars (if available)
    - [ ] ButtonComponent "View Details" with router link
    - [ ] IconComponent for external link/GitHub
  - [ ] **Loading state**:
    - [ ] Show SkeletonComponent grid when `store.isLoading()`
    - [ ] Match card layout (6-8 skeleton cards)
  - [ ] **Empty state**:
    - [ ] Show when `store.filteredProjects().length === 0`
    - [ ] StackComponent for centered content
    - [ ] IconComponent for illustration
    - [ ] Message: "No projects found"
    - [ ] ButtonComponent to clear filters
  - [ ] **Mobile responsive**:
    - [ ] Single column on mobile
    - [ ] Horizontal scroll for TabsComponent
    - [ ] Stack filters vertically
  - [ ] **Unit tests** (40+ tests):
    - [ ] Component renders correctly
    - [ ] Store integration works
    - [ ] Search updates store
    - [ ] Sort updates store
    - [ ] Category filter works
    - [ ] Clear filters resets state
    - [ ] Loading state shows skeletons
    - [ ] Empty state shows correctly
    - [ ] Navigation to detail page works
  - [ ] **E2E tests** (8+ tests):
    - [ ] Load projects list
    - [ ] Search for projects
    - [ ] Filter by category
    - [ ] Sort projects
    - [ ] Navigate to project detail
    - [ ] Clear filters
    - [ ] Responsive layout
    - [ ] Accessibility (keyboard nav, ARIA)

**Case Studies List Page**:

- [ ] **CaseStudiesComponent enhancements** (`src/app/features/case-studies/case-studies.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper)
  - StackComponent (vertical spacing)
  - GridComponent (case study cards grid)
  - CardComponent (each case study card)
  - SkeletonComponent (loading states)
  - InputComponent (search)
  - BadgeComponent (technology tags, role)
  - ButtonComponent (clear filters, view case study)
  - IconComponent (search icon, calendar, clock)
  - BreadcrumbComponent (page navigation)

  **Implementation Tasks**:
  - [x] Component scaffolded
  - [ ] Inject CaseStudiesStore using `inject()`
  - [ ] Call `store.loadCaseStudies()` in constructor
  - [ ] **Header section**:
    - [ ] BreadcrumbComponent at top
    - [ ] Page title and description
  - [ ] **Filter/Search section**:
    - [ ] InputComponent for search with debounce
    - [ ] Bind to `store.setSearchQuery()`
    - [ ] Tag filter (clickable BadgeComponent chips or SelectComponent)
    - [ ] Bind to `store.toggleTag()`
    - [ ] ButtonComponent to clear filters
  - [ ] **Case studies grid**:
    - [ ] GridComponent with responsive columns (1/2)
    - [ ] Loop through `store.filteredCaseStudies()` with `@for`
    - [ ] CardComponent for each case study with hover effect
    - [ ] Case study image/thumbnail
    - [ ] Title and client name
    - [ ] Short description (truncate with TruncatePipe from Phase 3)
    - [ ] BadgeComponent for role and technologies
    - [ ] IconComponent with date and duration metadata
    - [ ] ButtonComponent "Read More" with router link
  - [ ] **Loading state**:
    - [ ] Show SkeletonComponent grid when `store.isLoading()`
    - [ ] Match card layout (4-6 skeleton cards)
  - [ ] **Empty state**:
    - [ ] Show when `store.filteredCaseStudies().length === 0`
    - [ ] StackComponent for centered content
    - [ ] Message and clear filters button
  - [ ] **Mobile responsive**:
    - [ ] Single column on mobile
    - [ ] Adjust card layout
  - [ ] **Unit tests** (35+ tests):
    - [ ] Component renders correctly
    - [ ] Store integration works
    - [ ] Search functionality
    - [ ] Tag filtering
    - [ ] Loading and empty states
    - [ ] Navigation works
  - [ ] **E2E tests** (6+ tests):
    - [ ] Load case studies
    - [ ] Search case studies
    - [ ] Filter by tag
    - [ ] Navigate to detail
    - [ ] Accessibility check

---

#### Part 3: Detail Pages (Days 8-10)

**Project Detail Page**:

- [ ] **ProjectDetailComponent** (create new: `src/app/features/projects/project-detail/project-detail.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper)
  - StackComponent (vertical spacing)
  - GridComponent (screenshots, tech cards, related projects)
  - CardComponent (tech cards, metric cards, related projects)
  - TabsComponent (Overview, Features, Tech Stack, Demo)
  - BreadcrumbComponent (page navigation)
  - BadgeComponent (technologies, status)
  - ButtonComponent (View Live, GitHub, Download, Back)
  - IconComponent (checkmarks, external link, GitHub)
  - DividerComponent (section separators)
  - SkeletonComponent (loading state)

  **Implementation Tasks**:
  - [ ] Generate component: `ng generate component features/projects/project-detail --standalone`
  - [ ] Inject ActivatedRoute and ProjectsStore
  - [ ] Get slug from route params: `route.paramMap.pipe(map(p => p.get('slug')))`
  - [ ] Call `store.selectProject(slug)` when slug changes
  - [ ] **Header section**:
    - [ ] BreadcrumbComponent (Home > Projects > [Project Name])
    - [ ] Project title and tagline
    - [ ] Action buttons row:
      - [ ] ButtonComponent "View Live" (primary) with external link
      - [ ] ButtonComponent "View on GitHub" with IconComponent
      - [ ] ButtonComponent "Download" (if applicable)
  - [ ] **TabsComponent** for content sections:
    - [ ] Tab 1: Overview
    - [ ] Tab 2: Features
    - [ ] Tab 3: Tech Stack
    - [ ] Tab 4: Demo/Screenshots
  - [ ] **Overview tab**:
    - [ ] Project description (full)
    - [ ] Project purpose and goals
    - [ ] Key achievements
    - [ ] BadgeComponent for project status (Active, Archived, etc.)
  - [ ] **Features tab**:
    - [ ] StackComponent for feature list
    - [ ] Each feature with IconComponent checkmark
    - [ ] Feature description
  - [ ] **Tech Stack tab**:
    - [ ] GridComponent for technology cards
    - [ ] CardComponent for each technology with:
      - [ ] Technology name and logo/icon
      - [ ] Why it was chosen
      - [ ] IconComponent for tech logo
  - [ ] **Demo/Screenshots tab**:
    - [ ] GridComponent for images (2-3 columns)
    - [ ] Image gallery with captions
    - [ ] Lazy load images
  - [ ] **Metrics/Stats section** (if applicable):
    - [ ] GridComponent for stat cards
    - [ ] CardComponent for each metric (Stars, Forks, Downloads, etc.)
    - [ ] IconComponent for metric icons
  - [ ] **Related Projects section**:
    - [ ] GridComponent (3 columns, responsive)
    - [ ] CardComponent for each related project
    - [ ] Router link to other project details
  - [ ] **Navigation section**:
    - [ ] DividerComponent above
    - [ ] ButtonComponent "Back to Projects"
    - [ ] ButtonComponent "Next Project" (if available in store)
  - [ ] **Loading state**:
    - [ ] Show SkeletonComponent while `store.isLoading()`
    - [ ] Match page layout
  - [ ] **404 handling**:
    - [ ] Check if `store.selectedProject()` is undefined
    - [ ] Show "Project not found" message
    - [ ] ButtonComponent to return to projects list
  - [ ] **Mobile responsive**:
    - [ ] Stack action buttons vertically on mobile
    - [ ] Single column grids
    - [ ] Horizontal scroll for TabsComponent
  - [ ] **SEO Integration**:
    - [ ] Use SeoService to set page title
    - [ ] Set meta description
    - [ ] Set Open Graph tags with project image
  - [ ] **Unit tests** (30+ tests):
    - [ ] Component renders with project data
    - [ ] Route params handled correctly
    - [ ] Store integration works
    - [ ] Tab switching works
    - [ ] Action buttons navigate correctly
    - [ ] 404 state shows correctly
    - [ ] Related projects display
  - [ ] **E2E tests** (5+ tests):
    - [ ] Navigate to project detail
    - [ ] Switch between tabs
    - [ ] Click action buttons
    - [ ] Navigate to related project
    - [ ] Accessibility check

**Case Study Detail Page**:

- [ ] **CaseStudyDetailComponent** (create new: `src/app/features/case-studies/case-study-detail/case-study-detail.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper)
  - StackComponent (vertical spacing, sections)
  - GridComponent (technologies, metrics, images)
  - CardComponent (metric cards, testimonials)
  - BreadcrumbComponent (page navigation)
  - BadgeComponent (technologies, role, client)
  - ButtonComponent (Back, Next, Contact Client)
  - IconComponent (metrics, date, duration)
  - DividerComponent (section separators)
  - SkeletonComponent (loading state)

  **Implementation Tasks**:
  - [ ] Generate component: `ng generate component features/case-studies/case-study-detail --standalone`
  - [ ] Inject ActivatedRoute and CaseStudiesStore
  - [ ] Get slug from route params
  - [ ] Call `store.selectCaseStudy(slug)` when slug changes
  - [ ] **Header section**:
    - [ ] BreadcrumbComponent (Home > Case Studies > [Case Study Title])
    - [ ] Case study title
    - [ ] Client name and role BadgeComponent
    - [ ] Project duration and date with IconComponent
  - [ ] **Hero/Overview section**:
    - [ ] Featured image or hero graphic
    - [ ] Case study tagline/summary
    - [ ] Quick facts (Client, Role, Duration, Team Size)
    - [ ] BadgeComponent for each technology
  - [ ] **Challenge section**:
    - [ ] DividerComponent above
    - [ ] Section heading "The Challenge"
    - [ ] Problem description (multiple paragraphs)
    - [ ] Key pain points as bullet list with IconComponent
  - [ ] **Solution section**:
    - [ ] DividerComponent above
    - [ ] Section heading "The Solution"
    - [ ] Approach and methodology
    - [ ] Key decisions and rationale
    - [ ] Implementation highlights
  - [ ] **Technologies section**:
    - [ ] DividerComponent above
    - [ ] GridComponent for technology badges
    - [ ] BadgeComponent for each tech with description
    - [ ] Why each technology was chosen
  - [ ] **Results/Impact section**:
    - [ ] DividerComponent above
    - [ ] GridComponent for metric cards (2-4 columns)
    - [ ] CardComponent for each key metric:
      - [ ] Metric value (large text)
      - [ ] Metric label
      - [ ] IconComponent for visual indicator
      - [ ] Example: "50% faster load times", "10k+ users", "99.9% uptime"
  - [ ] **Screenshots/Deliverables section**:
    - [ ] GridComponent for images (2 columns)
    - [ ] Image captions
    - [ ] Lazy loading
  - [ ] **Testimonial section** (if available):
    - [ ] CardComponent with quote styling
    - [ ] Client testimonial text
    - [ ] Client name and title
  - [ ] **Navigation section**:
    - [ ] DividerComponent above
    - [ ] ButtonComponent "Back to Case Studies"
    - [ ] ButtonComponent "Next Case Study" (if available)
  - [ ] **Loading state**:
    - [ ] SkeletonComponent while loading
    - [ ] Match page structure
  - [ ] **404 handling**:
    - [ ] Check if `store.selectedCaseStudy()` is undefined
    - [ ] Show "Case study not found" message
    - [ ] ButtonComponent to return to list
  - [ ] **Mobile responsive**:
    - [ ] Single column layout
    - [ ] Stack metric cards vertically
    - [ ] Adjust image grid
  - [ ] **SEO Integration**:
    - [ ] Use SeoService to set page title
    - [ ] Set meta description from case study summary
    - [ ] Set Open Graph tags
    - [ ] Add Article schema with structured data
  - [ ] **Unit tests** (25+ tests):
    - [ ] Component renders with case study data
    - [ ] Route params work
    - [ ] Store integration
    - [ ] Sections display correctly
    - [ ] Navigation buttons work
    - [ ] 404 handling
  - [ ] **E2E tests** (4+ tests):
    - [ ] Navigate to case study detail
    - [ ] Read full content
    - [ ] Navigate to next case study
    - [ ] Accessibility check

---

#### Part 4: Info Pages (Days 11-14)

**Home Page Enhancements**:

- [ ] **HomeComponent enhancements** (`src/app/features/home/home.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper, sections)
  - StackComponent (vertical spacing)
  - GridComponent (featured projects, skills)
  - CardComponent (featured projects)
  - BadgeComponent (skills, technologies)
  - ButtonComponent (CTAs, View More)
  - IconComponent (checkmarks, arrows)

  **Implementation Tasks**:
  - [x] Hero section scaffolded
  - [ ] **Hero section enhancements**:
    - [ ] Professional headline and introduction
    - [ ] Subtitle/tagline
    - [ ] Primary CTA ButtonComponent "View Projects"
    - [ ] Secondary CTA ButtonComponent "Contact Me"
    - [ ] Optional: Animated typing effect for roles
  - [ ] **Professional intro/bio section**:
    - [ ] ContainerComponent with max-width for readability
    - [ ] 2-3 paragraph professional summary
    - [ ] What you do, specialties, approach
    - [ ] Years of experience highlight
  - [ ] **Featured projects showcase**:
    - [ ] Section heading "Featured Work"
    - [ ] GridComponent (1/2/3 columns responsive)
    - [ ] Show 3-4 featured projects from ProjectsStore
    - [ ] Inject ProjectsStore, call `store.loadProjects()`
    - [ ] Use `store.featuredProjects()` computed signal
    - [ ] CardComponent for each project:
      - [ ] Project image
      - [ ] Title and short description
      - [ ] BadgeComponent for 2-3 key technologies
      - [ ] ButtonComponent "Learn More" linking to detail page
    - [ ] ButtonComponent "View All Projects" at bottom
  - [ ] **Skills overview section**:
    - [ ] Section heading "Skills & Technologies"
    - [ ] GridComponent for skill categories (3-4 columns)
    - [ ] Each category as a group:
      - [ ] Category title (Frontend, Backend, DevOps, etc.)
      - [ ] BadgeComponent for each skill in category
    - [ ] Mobile: single column, stacked
  - [ ] **Call-to-action section**:
    - [ ] Background color contrast section
    - [ ] Heading "Let's Work Together"
    - [ ] Short pitch paragraph
    - [ ] ButtonComponent "View Case Studies" (primary)
    - [ ] ButtonComponent "Contact Me" (secondary)
  - [ ] **Smooth scroll navigation**:
    - [ ] Add id attributes to sections
    - [ ] Implement smooth scroll behavior
    - [ ] Optional: animate on scroll (AOS) for sections
  - [ ] **Mobile responsive**:
    - [ ] Single column layout on mobile
    - [ ] Adjust hero text sizing
    - [ ] Stack CTA buttons vertically
  - [ ] **SEO Integration**:
    - [ ] Use SeoService to set home page title
    - [ ] Set comprehensive meta description
    - [ ] Add Person schema for structured data
  - [ ] **Unit tests** (20+ tests):
    - [ ] Component renders all sections
    - [ ] Featured projects load from store
    - [ ] CTAs navigate correctly
    - [ ] Responsive layout works
  - [ ] **E2E tests** (3+ tests):
    - [ ] Home page loads correctly
    - [ ] Navigate to projects from featured
    - [ ] CTA buttons work

**About Page**:

- [ ] **AboutComponent** (create new: `src/app/features/about/about.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper)
  - StackComponent (timeline, sections)
  - GridComponent (skills matrix, certifications)
  - CardComponent (experience cards, certification cards)
  - BadgeComponent (skills, technologies, cert status)
  - ButtonComponent (download resume, social links)
  - IconComponent (social platforms, skill icons)
  - DividerComponent (section separators)
  - TabsComponent (optional: Overview/Experience/Skills tabs)

  **Implementation Tasks**:
  - [ ] Generate component: `ng generate component features/about --standalone`
  - [ ] **Professional bio section**:
    - [ ] ContainerComponent with max-width for readability
    - [ ] Professional headshot/avatar image
    - [ ] Full professional bio (3-4 paragraphs)
    - [ ] Career journey and philosophy
    - [ ] Current focus and interests
  - [ ] **Quick facts/stats section**:
    - [ ] GridComponent (2/4 columns)
    - [ ] Years of experience
    - [ ] Projects completed
    - [ ] Technologies mastered
    - [ ] Companies worked with
  - [ ] **Skills matrix section**:
    - [ ] Section heading "Technical Skills"
    - [ ] GridComponent for skill categories
    - [ ] Each skill with:
      - [ ] BadgeComponent for skill name
      - [ ] Proficiency level indicator (expert, advanced, intermediate)
      - [ ] Years of experience
    - [ ] Group by category (Languages, Frameworks, Tools, etc.)
  - [ ] **Professional timeline/experience**:
    - [ ] Section heading "Experience"
    - [ ] StackComponent for timeline layout
    - [ ] CardComponent for each role/company:
      - [ ] Company name and logo
      - [ ] Role title and duration
      - [ ] Key responsibilities (bullet points)
      - [ ] Technologies used (BadgeComponent)
      - [ ] Notable achievements
    - [ ] DividerComponent between entries
    - [ ] Vertical timeline line visual
  - [ ] **Certifications and education**:
    - [ ] Section heading "Certifications & Education"
    - [ ] GridComponent (2-3 columns)
    - [ ] CardComponent for each certification/degree:
      - [ ] Certification/degree name
      - [ ] Issuing organization
      - [ ] Date earned
      - [ ] BadgeComponent for status (Active, Expired, In Progress)
      - [ ] Optional credential URL link
  - [ ] **Downloadable resume**:
    - [ ] ButtonComponent with download icon
    - [ ] Link to PDF resume in assets folder
    - [ ] Track download event with AnalyticsService
  - [ ] **Social links section**:
    - [ ] Section heading "Connect With Me"
    - [ ] ButtonComponent (ghost variant) for each platform:
      - [ ] GitHub with IconComponent
      - [ ] LinkedIn with IconComponent
      - [ ] Email with IconComponent
      - [ ] Optional: Twitter, Medium, Dev.to
    - [ ] External links with target="_blank"
  - [ ] **Mobile responsive**:
    - [ ] Single column layout
    - [ ] Stack timeline vertically
    - [ ] Adjust grid columns
  - [ ] **SEO Integration**:
    - [ ] Use SeoService to set page title
    - [ ] Set meta description
    - [ ] Add Person schema with full details
  - [ ] **Unit tests** (25+ tests):
    - [ ] Component renders all sections
    - [ ] Skills display correctly
    - [ ] Timeline renders
    - [ ] Social links work
    - [ ] Resume download link works
  - [ ] **E2E tests** (4+ tests):
    - [ ] Navigate to about page
    - [ ] Scroll through all sections
    - [ ] Click social links
    - [ ] Accessibility check

**Contact Page**:

- [ ] **ContactComponent** (create new: `src/app/features/contact/contact.component.ts`)

  **Shared Components Used**:
  - ContainerComponent (page wrapper)
  - StackComponent (form layout, contact info)
  - GridComponent (form + contact info side-by-side)
  - FormFieldComponent (wraps each input)
  - InputComponent (name, email, subject)
  - TextareaComponent (message)
  - ButtonComponent (submit, social links)
  - IconComponent (social platforms, email, phone)
  - CardComponent (contact info cards)
  - LoadingSpinnerComponent (submit state)
  - ToastService (success/error notifications)

  **Implementation Tasks**:
  - [ ] Generate component: `ng generate component features/contact --standalone`
  - [ ] **Page header**:
    - [ ] Page title and description
    - [ ] Encouraging message about getting in touch
  - [ ] **Two-column layout** (form + contact info):
    - [ ] GridComponent (2 columns on desktop, stack on mobile)
    - [ ] Left column: Contact form
    - [ ] Right column: Contact information cards
  - [ ] **Contact form** (left column):
    - [ ] Create reactive form with FormBuilder
    - [ ] Import ReactiveFormsModule
    - [ ] FormFieldComponent for name input:
      - [ ] InputComponent with required validator
      - [ ] Error messages for validation
    - [ ] FormFieldComponent for email input:
      - [ ] InputComponent with required and email validators
      - [ ] Use emailValidator from Phase 3 validation utils
      - [ ] Error messages
    - [ ] FormFieldComponent for subject input:
      - [ ] InputComponent with required validator
      - [ ] Max length 100 characters
    - [ ] FormFieldComponent for message textarea:
      - [ ] TextareaComponent with required validator
      - [ ] Min length 10, max length 1000 characters
      - [ ] Character count enabled
      - [ ] Auto-resize enabled
      - [ ] Error messages
    - [ ] Submit ButtonComponent:
      - [ ] Disabled when form invalid or submitting
      - [ ] Show LoadingSpinnerComponent when submitting
      - [ ] Primary variant
      - [ ] Text: "Send Message" / "Sending..." states
  - [ ] **Contact information cards** (right column):
    - [ ] StackComponent for vertical layout
    - [ ] CardComponent for email:
      - [ ] IconComponent for email icon
      - [ ] Email address (clickable mailto: link)
      - [ ] Description text
    - [ ] CardComponent for LinkedIn:
      - [ ] IconComponent for LinkedIn
      - [ ] Profile link
      - [ ] "Connect with me professionally"
    - [ ] CardComponent for GitHub:
      - [ ] IconComponent for GitHub
      - [ ] Profile link
      - [ ] "Check out my code"
    - [ ] Optional: Phone card if applicable
  - [ ] **Form submission logic**:
    - [ ] **Phase 4**: Mock submission (console log, show success toast)
    - [ ] **Phase 7**: Integrate real email service (EmailJS or serverless)
    - [ ] Validate form before submission
    - [ ] Set submitting state
    - [ ] Call submission service
    - [ ] On success:
      - [ ] Show success ToastService notification
      - [ ] Track event with AnalyticsService (`contact_submit`)
      - [ ] Reset form
    - [ ] On error:
      - [ ] Show error ToastService notification
      - [ ] Keep form data
    - [ ] Clear submitting state
  - [ ] **Form validation**:
    - [ ] Real-time validation feedback
    - [ ] Show errors on touch/dirty
    - [ ] Disable submit when invalid
    - [ ] Custom error messages per field
  - [ ] **Spam protection** (Phase 7):
    - [ ] reCAPTCHA v3 integration (deferred to Phase 7)
    - [ ] Rate limiting on backend
  - [ ] **Mobile responsive**:
    - [ ] Stack columns vertically on mobile
    - [ ] Full-width form fields
    - [ ] Adjust card sizing
  - [ ] **SEO Integration**:
    - [ ] Use SeoService to set page title
    - [ ] Set meta description
    - [ ] Add ContactPage schema
  - [ ] **Accessibility**:
    - [ ] Proper form labels and ARIA attributes
    - [ ] Error announcements for screen readers
    - [ ] Focus management
    - [ ] Keyboard navigation
  - [ ] **Unit tests** (30+ tests):
    - [ ] Component renders form correctly
    - [ ] Form validation works
    - [ ] Required fields validated
    - [ ] Email format validated
    - [ ] Character limits enforced
    - [ ] Submit button disabled when invalid
    - [ ] Form submission calls service
    - [ ] Success toast shown
    - [ ] Error toast shown on failure
    - [ ] Form resets on success
    - [ ] Analytics event tracked
  - [ ] **E2E tests** (6+ tests):
    - [ ] Navigate to contact page
    - [ ] Fill out form with valid data
    - [ ] Submit form successfully
    - [ ] Validate required fields
    - [ ] Validate email format
    - [ ] Accessibility check

---

#### Part 5: Polish & Testing (Days 15-18)

**Navigation & Layout Improvements**:

- [ ] **"Back to top" button** (create new: `src/app/shared/components/back-to-top/back-to-top.component.ts`)
  - [ ] Generate standalone component
  - [ ] ButtonComponent with arrow up IconComponent
  - [ ] Fixed position bottom-right
  - [ ] Show/hide based on scroll position (use fromEvent with scroll)
  - [ ] Smooth scroll to top on click
  - [ ] Fade in/out animation
  - [ ] Add to MainLayout for all pages
  - [ ] Unit tests
  - [ ] Storybook story

- [ ] **Page transitions** (optional enhancement):
  - [ ] Create fade animation in animations.ts
  - [ ] Apply to router-outlet
  - [ ] Test across all routes
  - [ ] Ensure accessibility (respect prefers-reduced-motion)

- [ ] **MainLayout navigation updates**:
  - [ ] Verify all route links are correct
  - [ ] Add active route highlighting (already exists, verify)
  - [ ] Test mobile menu with all new routes
  - [ ] Ensure hamburger menu works on all pages

**Content Creation** (Placeholder/Mock Data):

- [ ] **Mock project data** (in ProjectsService):
  - [ ] Create 5-7 sample projects with realistic data
  - [ ] Include: title, slug, description, technologies, images (placeholder), links, category, featured flag, dates
  - [ ] Variety of categories: Web App, Tool, Demo, Library
  - [ ] Mark 3-4 as featured
  - [ ] Include GitHub star counts for some

- [ ] **Mock case study data** (in CaseStudiesService):
  - [ ] Create 3-5 sample case studies
  - [ ] Include: title, slug, client, role, duration, challenge, solution, results, technologies, images (placeholder), dates
  - [ ] Realistic scenarios and metrics
  - [ ] Variety of industries/domains

- [ ] **Skills and experience data**:
  - [ ] Create skills array with categories
  - [ ] Create experience timeline data
  - [ ] Create certifications array
  - [ ] Store in component or separate data file

- [ ] **Placeholder images**:
  - [ ] Use placeholder image service (placeholder.com or similar)
  - [ ] Or create simple SVG placeholders
  - [ ] Consistent sizing and aspect ratios
  - [ ] Add to assets folder

**Documentation**:

- [ ] **TSDoc comments**:
  - [ ] Add to all new feature components
  - [ ] Add to stores and services
  - [ ] Document public methods and properties
  - [ ] Add usage examples where helpful

- [ ] **README updates**:
  - [ ] Document new features in main README
  - [ ] Update project structure section
  - [ ] Add feature overview
  - [ ] Document mock data approach

- [ ] **Storybook stories** (optional for feature pages):
  - [ ] Consider adding stories for reusable sections
  - [ ] Document component composition patterns
  - [ ] Show different states

**Testing & Quality Assurance**:

- [ ] **Run full test suite**:
  - [ ] Execute: `npm run test`
  - [ ] Verify all unit tests pass
  - [ ] Check coverage meets >85% target
  - [ ] Fix any failing tests

- [ ] **Run E2E tests**:
  - [ ] Execute: `npm run e2e`
  - [ ] Verify all E2E tests pass
  - [ ] Test on all browsers (Chromium, Firefox, WebKit)
  - [ ] Fix any failing tests

- [ ] **Linting**:
  - [ ] Execute: `npm run lint`
  - [ ] Fix all linting errors
  - [ ] Ensure consistent code style

- [ ] **Build verification**:
  - [ ] Execute: `npm run build`
  - [ ] Verify production build succeeds
  - [ ] Check bundle sizes
  - [ ] Test production build locally

- [ ] **Manual testing**:
  - [ ] Test all routes and navigation
  - [ ] Test all interactive features
  - [ ] Test responsive design on multiple viewports
  - [ ] Test keyboard navigation
  - [ ] Test with screen reader (basic check)
  - [ ] Test theme switching across pages
  - [ ] Verify no console errors

- [ ] **Performance check**:
  - [ ] Run Lighthouse audit
  - [ ] Verify scores meet targets
  - [ ] Optimize any issues found

---

### Component Usage Summary

This section maps which shared components are used across Phase 4 feature pages.

**Core Layout Components** (used on every page):
1. **ContainerComponent** - Page wrapper, max-width constraints, responsive padding
2. **StackComponent** - Vertical spacing between sections, timeline layouts
3. **GridComponent** - Card grids (projects, case studies), multi-column layouts, responsive breakpoints

**UI Components** (heavily used):
4. **CardComponent** - Project cards, case study cards, metric cards, experience cards, certification cards
5. **ButtonComponent** - CTAs, navigation, form submit, social links, filters, actions
6. **IconComponent** - Social platforms, metrics, checkmarks, arrows, external links, GitHub, search
7. **BadgeComponent** - Technologies, skills, categories, status, role, client tags

**Form Components** (Contact page + search/filter):
- **FormFieldComponent** - Wraps inputs with labels and error messages
- **InputComponent** - Name, email, subject, search fields
- **TextareaComponent** - Message field with character count and auto-resize
- **SelectComponent** - Sort dropdown on Projects List

**Navigation Components**:
- **BreadcrumbComponent** - All detail pages, helps users navigate hierarchy
- **TabsComponent** - Project Detail (content sections), Projects List (category filter), optional on About

**Feedback & Loading Components**:
- **SkeletonComponent** - Loading states on all data-driven pages (Projects, Case Studies, Details)
- **LoadingSpinnerComponent** - Form submission, async operations
- **ToastService** - Success/error notifications (form submission, data loading errors)
- **DividerComponent** - Section separators on detail pages, About page

**Special Components**:
- **ModalService** - Not used in Phase 4 (reserved for future features)

**Component Usage by Page**:

| Page | Components Used (count) | Most Important |
|------|------------------------|----------------|
| **Home** | 7 components | Container, Grid, Card, Badge, Button |
| **Projects List** | 11 components | Grid, Card, Input, Select, Tabs, Badge, Skeleton |
| **Project Detail** | 10 components | Container, Stack, Tabs, Card, Badge, Breadcrumb, Skeleton |
| **Case Studies List** | 10 components | Grid, Card, Input, Badge, Skeleton, Breadcrumb |
| **Case Study Detail** | 10 components | Container, Stack, Grid, Card, Badge, Divider, Skeleton |
| **About** | 9 components | Container, Stack, Grid, Card, Badge, Divider |
| **Contact** | 9 components | Container, Grid, FormField, Input, Textarea, Button, Card, Toast |

---

### Technical Implementation Details

**State Management**:
- ProjectsStore: Manages projects collection, filtering, sorting, selection
- CaseStudiesStore: Manages case studies collection, filtering, selection
- Signal-based reactive state with computed signals for filtering/sorting
- rxMethod for async data loading operations
- Centralized error and loading states

**Routing**:
- Feature routing with route parameters for detail pages
- Route slugs for SEO-friendly URLs
- 404 handling for invalid slugs
- Active route highlighting in navigation
- Breadcrumb integration with router state

**Control Flow**:
- Use `@if` for conditional rendering (loading, empty states, 404)
- Use `@for` with track expressions for lists (projects, case studies, skills)
- Computed signals for reactive derived state
- Signal-based loading and error states

**SEO Integration**:
- SeoService on every page to set titles and meta descriptions
- Open Graph tags for social sharing
- Structured data (Person schema, Article schema for case studies)
- Semantic HTML throughout

**Form Handling**:
- Reactive Forms with FormBuilder
- Custom validators from Phase 3 utilities
- Real-time validation feedback
- Accessibility-focused error messaging
- Loading states during submission

**Responsive Design**:
- Mobile-first approach
- CSS Grid with responsive breakpoints
- Stack layouts on mobile (GridComponent → single column)
- Horizontal scroll for TabsComponent on mobile
- Touch-friendly button sizes

**Performance Optimizations**:
- Track expressions in `@for` loops for efficient change detection
- Lazy loading of routes (Phase 8)
- Image lazy loading (loading="lazy")
- Debounced search inputs (using Phase 3 debounce utility)
- Computed signals to minimize recalculations

**Accessibility**:
- WCAG 2.1 AAA compliance (carried over from Phase 2)
- Keyboard navigation support
- ARIA attributes on all interactive elements
- Focus management in modals and forms
- Screen reader announcements for dynamic content
- Form error announcements

**Testing Strategy**:
- Unit tests: 40+ per list page, 30+ per detail page, 20-30 per info page
- E2E tests: 6-8 per list page, 4-5 per detail page, 3-4 per info page
- Test store integration thoroughly
- Test responsive layouts
- Test accessibility with axe-core in Playwright
- Coverage target: >85% overall, >90% for feature components

---

### Success Metrics

**Completion Criteria**:
- ✅ All 7 feature pages implemented (Home, Projects List/Detail, Case Studies List/Detail, About, Contact)
- ✅ Routing configured and tested for all pages
- ✅ ProjectsStore and CaseStudiesStore fully integrated
- ✅ All pages use shared component library consistently
- ✅ Mock/placeholder content in place for development
- ✅ Mobile responsive layouts verified across all pages
- ✅ Theme system functional across all pages
- ✅ All pages have comprehensive unit tests
- ✅ All pages have E2E coverage
- ✅ SEO metadata on all pages
- ✅ Accessibility verified (keyboard nav, screen reader basics)
- ✅ No console errors in development or production builds
- ✅ Linting passes with zero errors
- ✅ Build succeeds without warnings
- ✅ Test coverage >85%

**Quality Gates**:
- All unit tests passing (target: 200+ new tests for feature pages)
- All E2E tests passing (target: 40+ new E2E tests)
- Lighthouse score >90 on all pages
- Zero TypeScript errors
- Zero ESLint errors
- Bundle size <500KB (before Phase 4 content)

---

### Phase 4 Estimated Duration

**Total: 2-3 weeks (15-18 working days)**

**Week 1** (Days 1-5):
- Days 1-3: Routing, Data Models, Feature Stores
- Days 4-5: Projects List Page

**Week 2** (Days 6-10):
- Days 6-7: Case Studies List Page
- Days 8-10: Project Detail + Case Study Detail

**Week 3** (Days 11-15):
- Days 11-12: Home Page Enhancements
- Days 13-14: About Page + Contact Page
- Day 15: Navigation improvements, Back-to-top button

**Buffer** (Days 16-18 if needed):
- Testing, bug fixes, polish
- Content refinement
- Documentation
- Performance optimization

---

## Phase 5: GitHub Integration & Data Visualization

**Goal**: Add live GitHub data integration and visual analytics.

### Objectives

- Integrate GitHub GraphQL API
- Display contribution data and repository statistics
- Theme ngx-charts to match design system
- Create interactive data visualizations

### Deliverables

**GitHub Service**:

- [ ] **GitHubService** with GraphQL API integration
  - [ ] Environment variable for GitHub token (read-only)
  - [ ] Fetch user profile data
  - [ ] Fetch contribution data (last 12 months)
  - [ ] Fetch repository statistics
  - [ ] Fetch language usage breakdown
  - [ ] Cache responses (1 hour TTL) with CacheService
  - [ ] Error handling with ErrorHandlerService
  - [ ] Unit tests with mocked GraphQL responses
  - [ ] Document secrets usage in README

**GitHub Stats Component**:

- [ ] **GitHubStatsComponent** (new feature)
  - **Uses**: ContainerComponent, GridComponent, CardComponent, SkeletonComponent, TabsComponent, StackComponent, IconComponent, BadgeComponent, LoadingSpinnerComponent
  - [ ] Contribution heatmap (ngx-charts)
    - Calendar heatmap visualization
    - Tooltip with contribution count
    - Theme-aware colors
  - [ ] Repository statistics cards
    - CardComponent for each stat
    - Total repos, stars, forks
    - IconComponent for GitHub logo
  - [ ] Language breakdown chart
    - Pie or bar chart (ngx-charts)
    - Theme-aware colors
  - [ ] Top repositories showcase
    - GridComponent with CardComponent
    - Repository name, description, stars, language
    - BadgeComponent for language
    - External link IconComponent
  - [ ] TabsComponent for different views (Overview, Contributions, Repositories)
  - [ ] SkeletonComponent while loading
  - [ ] LoadingSpinnerComponent for data refresh
  - [ ] Error handling with retry ButtonComponent
  - [ ] Mobile responsive
  - [ ] Unit tests
  - [ ] E2E tests

**ngx-charts Theming**:

- [ ] Create ngx-charts theme matching design system
  - [ ] Map CSS variables to chart colors
  - [ ] Ensure WCAG AAA contrast compliance
  - [ ] Support all 4 themes
  - [ ] Test with prefers-color-scheme
  - [ ] Document theming approach

**Integration Options**:

- [ ] Add to About page as a section, OR
- [ ] Create dedicated /github route
- [ ] Feature toggle for GitHub section (optional)
- [ ] Loading states with SkeletonComponent
- [ ] Cache strategy to avoid rate limiting

### Technical Details

- GitHub GraphQL API with personal access token
- ngx-charts for data visualization
- CacheService for 1-hour TTL
- Environment variable configuration
- Responsive chart sizing
- Theme-aware chart colors

### Success Metrics

- GitHub integration working with live data
- Charts display correctly in all themes
- Data cached to avoid rate limits
- Mobile responsive visualizations
- Error handling graceful
- Feature documented in README

### Estimated Duration

1 week

---

## Phase 6: Career Chatbot Implementation

**Goal**: Implement client-side AI career chatbot with RAG for answering questions about experience.

### Objectives

- Create chatbot UI components
- Implement LLM service with WebLLM
- Build RAG pipeline for context retrieval
- Generate embeddings for career knowledge base
- Provide accurate, context-aware responses

### Deliverables

**Knowledge Base Preparation**:

- [ ] Prepare career knowledge base content
  - [ ] Collect resume content (work history, achievements, technical skills)
  - [ ] Document leadership experience and team management
  - [ ] Create project summaries with technical details
  - [ ] Organize education and certifications
  - [ ] Compile speaking/writing/contributions
  - [ ] Organize into clean Markdown or plain text sections
  - [ ] Chunk text into ~300-500 token segments
  - [ ] Create `/assets/chatbot/corpus.json` with chunk structure
    - Format: `[{ "id": 1, "text": "...", "metadata": {...} }, ...]`
  - [ ] Review for completeness and accuracy

**Embeddings Generation**:

- [ ] Generate build-time embeddings
  - [ ] Create Python script using `sentence-transformers`
  - [ ] Install `sentence-transformers` and `all-MiniLM-L6-v2` model
  - [ ] Load `corpus.json` and encode each chunk
  - [ ] Write `/assets/chatbot/embeddings.json` with vectors + chunk IDs
    - Format: `[{ "id": 1, "embedding": [...], "text": "..." }, ...]`
  - [ ] Run script manually before deployment
  - [ ] Document script usage in README
  - [ ] Consider automating in CI/CD pipeline (optional)

**Core Services**:

- [ ] **LlmService** for WebLLM integration

  - [ ] Install `@mlc-ai/web-llm` package
  - [ ] Initialize WebLLM worker with Web Worker API
  - [ ] Load small model (Llama-3.1-8B-Instruct-q4f32_1)
  - [ ] Expose `embed(text)` method for query embeddings
  - [ ] Expose `generate(prompt, context)` method for responses
  - [ ] Support streaming token generation for smooth UX
  - [ ] Model loading progress tracking with signals
  - [ ] Cache model in IndexedDB to avoid re-fetching
  - [ ] Error handling for unsupported browsers/hardware
  - [ ] Unit tests with mocked WebLLM worker
  - [ ] TSDoc documentation

- [ ] **RagService** for vector search and retrieval

  - [ ] Load embeddings.json on app startup
  - [ ] Implement cosine similarity function (pure TypeScript)
  - [ ] Query method: compute similarity against all corpus vectors
  - [ ] Return top K most relevant chunks (configurable, default 3-5)
  - [ ] Build final prompt with context injection template
  - [ ] Support for metadata filtering (optional)
  - [ ] Signal-based state for loaded embeddings
  - [ ] Unit tests covering similarity calculations
  - [ ] TSDoc documentation

- [ ] **ChatbotStateService** for conversation management
  - [ ] Signal store for chat messages history
  - [ ] Message interface (role, content, timestamp, id)
  - [ ] Add/remove message methods
  - [ ] Clear conversation method
  - [ ] Persist conversation to LocalStorage (optional)
  - [ ] Track loading/error states
  - [ ] Unit tests covering state mutations

**Chatbot UI Components**:

- [ ] **ChatMessageComponent**

  - **Uses**: StackComponent, BadgeComponent, IconComponent, MarkdownPipe (create), SkeletonComponent
  - [ ] User and assistant message variants
  - [ ] Markdown rendering support for bot responses
  - [ ] Timestamp display
  - [ ] Loading indicator for streaming responses
    - SkeletonComponent for text placeholder
  - [ ] Avatar IconComponent for user/bot
  - [ ] WCAG 2.1 AAA compliant (ARIA live regions, semantic HTML)
  - [ ] Full TypeScript typing with signal-based inputs
  - [ ] Unit tests
  - [ ] Storybook stories

- [ ] **ChatInputComponent**

  - **Uses**: TextareaComponent, ButtonComponent, IconComponent
  - [ ] Multi-line TextareaComponent with auto-expand
  - [ ] Send ButtonComponent with keyboard shortcuts (Enter/Cmd+Enter)
  - [ ] Character limit and validation
  - [ ] Disabled state during message processing
  - [ ] IconComponent for send button
  - [ ] WCAG 2.1 AAA compliant (keyboard navigation, labels)
  - [ ] Unit tests
  - [ ] Storybook stories

- [ ] **ChatContainerComponent**
  - **Uses**: StackComponent, ModalComponent, ButtonComponent, IconComponent, LoadingSpinnerComponent, CardComponent
  - [ ] Message list with auto-scroll to bottom
  - [ ] ChatMessageComponent for each message
  - [ ] Empty state for new conversations
    - IconComponent for illustration
    - Suggested questions as ButtonComponent chips
  - [ ] Loading state while model initializes
    - LoadingSpinnerComponent with progress
  - [ ] Error state with retry functionality
    - CardComponent with error message
    - ButtonComponent to retry
  - [ ] Collapsible/expandable chat window
    - ModalComponent (sidebar variant) OR custom floating widget
  - [ ] Clear chat ButtonComponent
  - [ ] WCAG 2.1 AAA compliant (focus management, ARIA)
  - [ ] Unit tests
  - [ ] Storybook stories

**Chatbot Integration**:

- [ ] **CareerChatbotComponent** feature
  - **Uses**: ChatContainerComponent, ChatMessageComponent, ChatInputComponent, LoadingSpinnerComponent, ToastService
  - [ ] Inject LlmService, RagService, ChatbotStateService
  - [ ] Initialize WebLLM model on component mount (or lazy load)
  - [ ] Display model loading progress to user
    - LoadingSpinnerComponent with percentage
  - [ ] Implement chat message flow:
    - User sends question → embed query → RAG retrieval → build prompt → generate response
  - [ ] Stream response tokens for smooth UX (optional but recommended)
  - [ ] Handle errors gracefully (model load failures, generation errors)
    - ToastService for error notifications
  - [ ] Add "reset chat" functionality (clear conversation)
  - [ ] Suggested questions for first-time users
  - [ ] WCAG 2.1 AAA compliant (keyboard navigation, ARIA, screen reader support)
  - [ ] Unit tests for component logic
  - [ ] E2E tests for chat interaction flow
  - [ ] Storybook stories demonstrating chatbot UI

**Performance & UX**:

- [ ] Performance enhancements
  - [ ] Cache model in IndexedDB to avoid re-downloading
  - [ ] Lazy-load WebLLM when chatbot is opened
  - [ ] Add model loading progress bar
  - [ ] Optimize embeddings file size (consider compression)
  - [ ] Test on different devices/browsers for compatibility
  - [ ] Add browser compatibility check
  - [ ] Fallback message for unsupported browsers

### Component Usage Summary

**Chatbot-Specific**:

- ChatContainerComponent
- ChatMessageComponent
- ChatInputComponent

**Reused Shared Components**:

- TextareaComponent (chat input)
- ButtonComponent (send, retry, clear)
- IconComponent (avatars, actions)
- StackComponent (message layout)
- ModalComponent or custom widget (chat container)
- LoadingSpinnerComponent (model loading, generation)
- SkeletonComponent (message loading)
- CardComponent (error states)
- ToastService (error notifications)

### Technical Details

- WebLLM for client-side LLM inference
- sentence-transformers for embeddings generation
- Pure TypeScript cosine similarity
- IndexedDB for model caching
- Web Worker for LLM processing
- Signal-based state management
- Streaming token generation

### Success Metrics

- Career chatbot operational with accurate RAG responses
- WebLLM model loads and caches efficiently (< 30 seconds initial load)
- Chatbot UI accessible and mobile-responsive
- Embeddings pipeline documented and reproducible
- Browser compatibility documented
- E2E tests passing

### Estimated Duration

2-3 weeks

---

## Phase 7: Analytics, SEO & Contact Integration

**Goal**: Finalize analytics, SEO, and contact form integration.

### Deliverables

**Analytics Finalization**:

- [ ] GA4 integration complete

  - [ ] Environment variable configuration
  - [ ] Init wrapper service (AnalyticsService)
  - [ ] Pageview tracking on route changes
  - [ ] Event tracking (`page_view`, `project_view`, `case_study_view`, `theme_change`, `contact_submit`, `chatbot_query`)
  - [ ] Event naming catalog documented
  - [ ] No PII sent to analytics
  - [ ] Verify events in GA4 dashboard

- [ ] Consent flow (optional but recommended)

  - [ ] Cookie consent banner
    - **Uses**: ModalComponent or custom banner, ButtonComponent, StackComponent
  - [ ] LocalStorage persistence
  - [ ] Analytics init only after consent

- [ ] Looker Studio dashboards
  - [ ] Create dashboard for portfolio analytics
  - [ ] Embed dashboard at `/analytics` route (optional)
  - **Uses**: ContainerComponent, CardComponent for embedding

**SEO Optimization**:

- [ ] SeoService implementation complete

  - [ ] Dynamic title updates (already implemented)
  - [ ] Meta description updates
  - [ ] Open Graph tags for social sharing
  - [ ] Twitter Card tags
  - [ ] Structured data (JSON-LD) for:
    - Person schema
    - WebSite schema
    - Article schema (for case studies)
  - [ ] Canonical URLs
  - [ ] Unit tests

- [ ] sitemap.xml generation

  - [ ] Static routes
  - [ ] Dynamic routes (projects, case studies)

- [ ] robots.txt configuration

**Contact Form Integration**:

- [ ] Contact form backend integration

  - [ ] EmailJS integration OR
  - [ ] Serverless function (Netlify Functions, Vercel Functions) OR
  - [ ] FormSpree integration
  - [ ] Environment variables for API keys
  - [ ] Rate limiting
  - [ ] Spam protection (reCAPTCHA v3)
  - [ ] Success/error handling with ToastService
  - [ ] Email template configuration
  - [ ] Test email delivery

- [ ] Contact form enhancements
  - [ ] Add loading state to submit button
  - [ ] Clear form on success
  - [ ] Prevent double submission
  - [ ] Client-side validation
  - [ ] Server-side validation feedback

### Technical Details

- GA4 with custom events
- JSON-LD for structured data
- EmailJS or serverless functions for contact form
- reCAPTCHA for spam protection
- Environment variables for API keys

### Success Metrics

- Analytics events verified in production
- All pages have proper meta tags and Open Graph
- Contact form delivers emails reliably
- reCAPTCHA prevents spam
- Sitemap generated and accessible

### Estimated Duration

1 week

---

## Phase 8: Performance Optimization & PWA

**Goal**: Optimize performance and implement PWA capabilities.

### Deliverables

**Performance Optimization**:

- [ ] Image optimization

  - [ ] Use modern image formats (WebP, AVIF)
  - [ ] Responsive images with srcset
  - [ ] Lazy loading for below-fold images
  - [ ] Image CDN integration (Cloudinary/similar) - optional
  - [ ] Blur-up loading technique

- [ ] Code optimization
  - [ ] Lazy load images with loading="lazy"
  - [ ] Virtual scrolling for large lists (if needed)
  - [ ] Preload critical resources
  - [ ] Minify and compress assets
  - [ ] Bundle size analysis and reduction (<200KB initial)
  - [ ] Tree shaking verification
  - [ ] Remove unused CSS
  - [ ] Optimize font loading (font-display: swap)

**Progressive Web App**:

- [ ] PWA setup

  - [x] Install @angular/service-worker (already installed)
  - [ ] Configure ngsw-config.json
  - [ ] Service worker for caching strategies
  - [ ] Offline page fallback
  - [ ] App manifest (manifest.json)
    - App name and description
    - Icons (192x192, 512x512)
    - Theme colors
    - Display mode (standalone)
  - [ ] Install prompt for mobile users
  - [ ] Test PWA installability

- [ ] Push notifications (optional)
  - [ ] Service worker push notification support
  - [ ] Notification permission request
  - [ ] Server-side push infrastructure

**Performance Monitoring**:

- [ ] Set performance budgets

  - [ ] First Contentful Paint < 1.5s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Time to Interactive < 3s
  - [ ] Cumulative Layout Shift < 0.1
  - [ ] Total Blocking Time < 300ms

- [ ] Core Web Vitals tracking

  - [ ] Integrate with AnalyticsService
  - [ ] Send to GA4

- [ ] Lighthouse CI verification
  - [x] Lighthouse workflow in CI (already setup)
  - [ ] Ensure all budgets pass
  - [ ] Performance score >95
  - [ ] Accessibility score 100
  - [ ] Best Practices score 100
  - [ ] SEO score >95

### Technical Details

- Angular Service Worker with caching strategies
- Intersection Observer for lazy loading
- Resource hints (preload, prefetch, preconnect)
- HTTP/2 optimization
- Brotli compression
- Lighthouse CI integration

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

## Phase 9: QA, Testing & Accessibility Audit

**Goal**: Comprehensive QA, testing, and accessibility verification.

### Deliverables

**Testing Coverage**:

- [ ] Component tests for all feature pages

  - [ ] Input/output behavior
  - [ ] Signal updates and reactivity
  - [ ] User interactions (click, input)
  - [ ] Conditional rendering (@if/@for)
  - [ ] Store integration

- [ ] Service tests

  - [ ] All Phase 3+ services tested
  - [ ] Mocked dependencies
  - [ ] Error scenarios

- [ ] Integration tests

  - [ ] Feature workflow tests
  - [ ] Route navigation tests
  - [ ] Form submission flows
  - [ ] Store + component integration

- [ ] E2E tests (Playwright)

  - [x] Visual regression tests (4 viewports) - Phase 1
  - [x] Basic navigation tests - Phase 1
  - [ ] User journey tests:
    - Browse projects → view detail → navigate back
    - Filter projects by tag
    - Search functionality
    - Contact form submission
    - Theme switching persists
    - Chatbot interaction
  - [ ] Cross-browser testing (Chromium, Firefox, WebKit)
  - [ ] Mobile interaction testing (tap, swipe)

- [ ] Test coverage goals
  - [ ] Overall coverage >85% (goal), >80% (acceptable)
  - [ ] Feature components >90% coverage
  - [ ] Services >95% coverage

**Accessibility Audit**:

- [ ] Automated testing

  - [x] axe-core in Playwright (already integrated)
  - [ ] Run on all pages
  - [ ] Fix all critical issues

- [ ] Manual testing

  - [ ] Keyboard navigation audit (all pages)
  - [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
  - [ ] Color contrast validation (all themes)
  - [ ] Focus management verification
  - [ ] ARIA attribute validation
  - [ ] Semantic HTML audit

- [ ] WCAG 2.1 AAA compliance certification
  - [ ] Document compliance in README
  - [ ] Create accessibility statement page (optional)

**Performance Testing**:

- [ ] Lighthouse audit on all pages

  - [ ] Home page
  - [ ] Projects list
  - [ ] Project detail
  - [ ] Case studies list
  - [ ] Case study detail
  - [ ] About page
  - [ ] Contact page

- [ ] Performance analysis
  - [ ] Bundle size analysis
  - [ ] Network waterfall analysis
  - [ ] Memory leak detection
  - [ ] Long tasks identification

**Security Review**:

- [ ] Security audit
  - [x] CodeQL and dependency-review passing (Phase 1)
  - [ ] Verify secret scanning enabled
  - [ ] Review all GitHub Secrets usage
  - [ ] XSS protection verification
  - [ ] CSRF protection for contact form
  - [ ] Content Security Policy headers
  - [ ] Dependency vulnerability scan

### Success Metrics

- Test coverage >85% across all modules
- WCAG 2.1 AAA compliance verified
- All E2E user journeys passing
- Cross-browser testing complete
- Accessibility audit passed
- Performance benchmarks met
- Security audit passed

### Estimated Duration

2 weeks

---

## Phase 10: Deployment & Monitoring

**Goal**: Final deployment, monitoring, and production readiness.

### Deliverables

**Production Deployment**:

- [x] GitHub Pages configured (Phase 1)
- [ ] Verify production deployment

  - [ ] Test all routes work correctly
  - [ ] Confirm assets load with correct paths
  - [ ] Test theme persistence
  - [ ] Test analytics tracking
  - [ ] Test contact form
  - [ ] Test chatbot (if available)

- [ ] Optional: Custom domain
  - [ ] Add CNAME record
  - [ ] Update baseHref in angular.json
  - [ ] Configure SSL/TLS (automatic via GitHub Pages)

**Monitoring & Observability**:

- [ ] Error tracking integration (Sentry)

  - [ ] Source map upload for debugging
  - [ ] Error grouping and alerting
  - [ ] Performance monitoring
  - [ ] Release tracking
  - [ ] Test error appears in dashboard

- [ ] Uptime monitoring

  - [ ] UptimeRobot or similar
  - [ ] Monitor homepage and critical routes
  - [ ] Email/Slack alerts

- [ ] Performance monitoring
  - [ ] Lighthouse CI continuous monitoring
  - [ ] Core Web Vitals tracking in GA4
  - [ ] Real User Monitoring (RUM) - optional

**DevOps Automation**:

- [ ] Automated dependency updates (Dependabot)

  - [ ] Configure auto-merge for patch updates
  - [ ] Weekly dependency review

- [ ] Automated changelog generation

  - [ ] Use Conventional Commits
  - [ ] Generate CHANGELOG.md on release

- [ ] Release automation

  - [ ] Semantic versioning
  - [ ] GitHub Releases with changelog
  - [ ] Release PR template

- [ ] Bundle size tracking in CI
  - [ ] Track bundle size over time
  - [ ] Alert on significant increases

**Documentation**:

- [ ] Deployment guide

  - [x] GitHub Pages setup (Phase 1)
  - [ ] Environment variables documentation
  - [ ] Secrets management guide

- [ ] Troubleshooting guide

  - [ ] Common deployment issues
  - [ ] Performance optimization tips
  - [ ] Browser compatibility issues

- [ ] Rollback & recovery
  - [ ] Rollback strategy documentation
  - [ ] Tagged releases for version control
  - [ ] Incident response playbook

### Success Metrics

- Production deployment successful and stable
- All monitoring and alerting configured
- Error tracking operational with source maps
- Analytics tracking validated
- Uptime monitoring active
- Documentation complete

### Estimated Duration

1 week

---

## Phase 11: Final Polish & Documentation

**Goal**: Final polish, comprehensive documentation, and project showcase.

### Deliverables

**Documentation Polish**:

- [ ] Review and update all TSDoc comments
- [ ] Verify Storybook stories are complete
- [ ] Ensure Compodoc is up to date
- [ ] Create system architecture diagrams
- [ ] Create data flow diagrams
- [ ] Create component hierarchy diagrams
- [ ] Final ADR review and updates

**Project Management**:

- [ ] CONTRIBUTING.md

  - [ ] Code style requirements
  - [ ] Branch naming conventions
  - [ ] Commit message format (Conventional Commits)
  - [ ] Pull request process
  - [ ] Code review checklist

- [ ] GitHub templates

  - [ ] Bug report template
  - [ ] Feature request template
  - [ ] Pull request template

- [ ] Definition of Done checklist
- [ ] Automated changelog setup

**README Finalization**:

- [ ] Project overview and mission statement
- [ ] Feature showcase with screenshots
- [ ] Tech stack with badges and links
- [ ] Quick start guide
- [ ] Available scripts documentation
- [ ] Project structure overview
- [ ] Component library documentation
- [ ] Architecture overview
- [ ] License information
- [ ] Links to:
  - Live demo
  - Storybook
  - Compodoc
  - GitHub repository
- [ ] Contact and social links

**Showcase Materials**:

- [ ] Screenshots of all pages
- [ ] GIF demos of key features
- [ ] Video walkthrough (optional)
- [ ] Blog post about the project (optional)
- [ ] Social media posts

### Success Metrics

- All documentation complete and up-to-date
- CONTRIBUTING.md published
- README polished with screenshots
- Issue and PR templates active
- Architecture diagrams created
- Project ready for public showcase
- Portfolio site live and accessible

### Estimated Duration

3-5 days

---

## Continuous Improvements

### Ongoing Tasks

- Monitor and fix bugs
- Update dependencies monthly
- Security patches as needed
- Performance optimization based on RUM data
- Content updates (new projects, case studies)
- SEO improvements based on analytics
- User feedback implementation
- A/B testing new features (optional)

---

## Success Metrics Summary

### Performance

- Lighthouse score > 95
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3s
- Cumulative Layout Shift < 0.1
- Bundle size < 200KB (initial)

### Code Quality

- Test coverage > 85% (goal), > 80% (acceptable)
- No critical accessibility issues
- TypeScript strict mode enabled
- Zero build warnings
- All CI checks passing

### User Experience

- Mobile-first responsive design
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Keyboard navigation support
- WCAG 2.1 AAA compliance
- Fast loading times
- Smooth animations (respects prefers-reduced-motion)

### Content

- 3-5 detailed case studies published
- 3-5 personal projects documented
- Professional bio and resume available
- Contact form functional
- GitHub stats live (if implemented)
- Career chatbot operational (if implemented)

---

## Technology Stack Summary

### Core

- Angular 21.0 (Standalone Components)
- TypeScript 5.9 (Strict Mode)
- RxJS 7.8+
- Signals for state management
- NgRx SignalStore

### Styling

- SCSS with CSS Variables
- BEM naming convention
- Custom design system (20 components)
- 4 themes (WCAG AAA compliant)

### Build & Tools

- Angular CLI with Vite
- ESLint + Prettier
- Husky for git hooks

### Testing

- Vitest 4.0 for unit tests
- Playwright 1.56 for E2E
- Testing Library patterns
- jsdom for browser simulation
- 1,627+ tests passing

### Deployment

- GitHub Actions CI/CD
- GitHub Pages hosting
- Automated deployment
- Lighthouse CI
- Dependency scanning
- Security scanning (CodeQL)

### Optional Integrations

- GitHub GraphQL API
- ngx-charts for visualization
- WebLLM for chatbot
- EmailJS or serverless functions
- Google Analytics 4
- Sentry error tracking

### Icon Libraries

- @ng-icons/heroicons (90+ icons)
- @ng-icons/ionicons (brand logos: GitHub, LinkedIn)

---

## Phase Summary Table

| Phase        | Focus                                | Duration  | Status      |
| ------------ | ------------------------------------ | --------- | ----------- |
| **Phase 1**  | Enterprise Baseline & Infrastructure | 2-3 days  | ✅ Complete |
| **Phase 2**  | Shared Component Library             | 2-3 weeks | ✅ Complete |
| **Phase 3**  | Core Services & Utilities            | 1-2 weeks | ✅ Complete |
| **Phase 4**  | Feature Pages & Content              | 2-3 weeks | ⏳ Next Up  |
| **Phase 5**  | GitHub Integration & Data Viz        | 1 week    | ⏳ Pending  |
| **Phase 6**  | Career Chatbot Implementation        | 2-3 weeks | ⏳ Pending  |
| **Phase 7**  | Analytics, SEO & Contact             | 1 week    | ⏳ Pending  |
| **Phase 8**  | Performance Optimization & PWA       | 1-2 weeks | ⏳ Pending  |
| **Phase 9**  | QA, Testing & Accessibility Audit    | 2 weeks   | ⏳ Pending  |
| **Phase 10** | Deployment & Monitoring              | 1 week    | ⏳ Pending  |
| **Phase 11** | Final Polish & Documentation         | 3-5 days  | ⏳ Pending  |

**Total Estimated Duration**: 14-21 weeks (3.5-5 months)

---

## Next Immediate Actions

### Phase 2 Completion:

1. ~~Update MainLayout with full navigation~~ ✅ Complete
2. ~~Add Footer component~~ ✅ Complete
3. ~~Integrate ThemePicker into navbar~~ ✅ Complete
4. ~~Add Storybook stories for ThemePicker~~ ✅ Complete
5. ~~Add E2E test for ThemePicker~~ ✅ Complete
6. ~~Create component usage guides (21 READMEs)~~ ✅ Complete

**Phase 2 is now 100% complete!**

### Phase 3 Completed! ✅

1. ~~Implement core services (SEO, Analytics, Error, Cache, Logger)~~ ✅ Complete
2. ~~Create shared utilities and pipes~~ ✅ Complete
3. ~~Document services with TSDoc and ADRs~~ ✅ Complete
4. ~~Test all services thoroughly~~ ✅ Complete

### Phase 4 Kickoff (2-3 weeks):

1. Implement ProjectsStore and ProjectsService with mock data
2. Implement CaseStudiesStore and CaseStudiesService with mock data
3. Build feature pages using shared component library
4. Create responsive layouts with Grid, Container, Stack components
5. Add search, filtering, and sorting functionality
6. Prepare content (case studies, projects, bio)
7. Add unit tests and E2E tests for all feature pages

---

**Document Version**: 6.0 (Phase 3 Complete)
**Last Updated**: December 9, 2025
**Status**: Phase 1 ✅ Complete | Phase 2 ✅ Complete | Phase 3 ✅ Complete | Phase 4 Ready to Start
**Approach**: Infrastructure-First Enterprise Development | Component-Driven Architecture | Client-Side AI Career Chatbot | GitHub Pages Deployment

**Phase 3 Key Highlights**:

- 7 production-ready services (Modal, Toast, SEO, Analytics, ErrorHandler, Cache, Logger)
- 5 comprehensive utility modules (Date, String, Validation, Array/Object, Debounce/Throttle)
- 6 custom pipes (DateAgo, Truncate, SafeHtml, Highlight, Filter, Sort)
- 4 Architecture Decision Records documenting key architectural decisions
- Comprehensive testing guide with examples and best practices
- Complete API documentation via Compodoc
- 421 utility tests + 205 pipe tests = 626 new tests
- All services with >95% coverage and full TSDoc documentation
