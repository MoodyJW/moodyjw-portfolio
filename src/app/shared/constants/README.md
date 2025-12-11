# Constants Directory

This directory contains all application-wide constants organized by category. Constants are used to avoid magic strings and numbers throughout the codebase, making the application more maintainable and reducing the risk of typos.

## Files Overview

### `routes.constants.ts`

Route path constants for type-safe navigation.

**Key Exports:**

- `ROUTES` - Route path segments (without leading slash)
- `ROUTE_PATHS` - Full route paths (with leading slash) for use in templates
- `NAV_ITEMS` - Navigation menu configuration with 5 items (Home, Projects, Case Studies, About, Contact)
- `getProjectRoute(slug)` - Helper function to generate project detail routes
- `getCaseStudyRoute(slug)` - Helper function to generate case study detail routes

**Example Usage:**

```typescript
// In TypeScript
import { ROUTES, ROUTE_PATHS, getProjectRoute, getCaseStudyRoute } from '@shared/constants';

// Navigate programmatically
this.router.navigate([ROUTES.PROJECTS]);
this.router.navigate([ROUTES.CASE_STUDIES]);

// Generate dynamic routes with slugs
const projectRoute = getProjectRoute('e-commerce-platform'); // '/projects/e-commerce-platform'
const caseStudyRoute = getCaseStudyRoute('mobile-app-redesign'); // '/case-studies/mobile-app-redesign'
```

```html
<!-- In templates -->
<a [routerLink]="ROUTE_PATHS.HOME">Home</a>
<a [routerLink]="ROUTE_PATHS.PROJECTS">Projects</a>
<a [routerLink]="ROUTE_PATHS.CASE_STUDIES">Case Studies</a>
<a [routerLink]="ROUTE_PATHS.ABOUT">About</a>
<a [routerLink]="ROUTE_PATHS.CONTACT">Contact</a>
```

### `api.constants.ts`

API endpoints and configuration for data fetching.

**Key Exports:**

- `API_CONFIG` - Base URLs for different API types
- `MOCK_ENDPOINTS` - Local JSON file paths (Mockend pattern)
- `GITHUB_ENDPOINTS` - GitHub REST API endpoints (Phase 4)
- `GITHUB_GRAPHQL_QUERIES` - GraphQL query templates (Phase 4)
- `HTTP_HEADERS` - Common HTTP header configurations
- `API_TIMEOUTS` - Request timeout values
- `API_RETRY` - Retry configuration for failed requests

**Example Usage:**

```typescript
import { MOCK_ENDPOINTS, API_CONFIG } from '@shared/constants';

// Fetch mock data
this.http.get<Project[]>(MOCK_ENDPOINTS.PROJECTS);

// GitHub API (Phase 4)
const url = GITHUB_ENDPOINTS.USER_REPOS('MoodyJW');
```

### `config.constants.ts`

Application-wide configuration values.

**Key Exports:**

- `LATENCY_CONFIG` - Network simulation settings
- `CACHE_CONFIG` - Cache TTL and size settings
- `PAGINATION_CONFIG` - Page size defaults
- `ANIMATION_DURATIONS` - Animation timing values
- `DEBOUNCE_DELAYS` - Input debounce timings
- `STORAGE_KEYS` - LocalStorage key names
- `BREAKPOINTS` - Responsive design breakpoints
- `EXTERNAL_LINKS` - Social media and contact URLs
- `SEO_CONFIG` - Default SEO metadata
- `PERFORMANCE_BUDGETS` - Lighthouse thresholds
- `FEATURE_FLAGS` - Toggle features on/off

**Example Usage:**

```typescript
import { LATENCY_CONFIG, STORAGE_KEYS, FEATURE_FLAGS } from '@shared/constants';

// Check feature flag
if (FEATURE_FLAGS.ENABLE_DARK_MODE) {
  // Show theme toggle
}

// Use storage key
localStorage.setItem(STORAGE_KEYS.THEME, 'dark');

// Use animation duration
setTimeout(() => {
  /* ... */
}, ANIMATION_DURATIONS.NORMAL);
```

### `app.constants.ts`

General application constants including validation patterns, labels, and limits.

**Key Exports:**

- `REGEX_PATTERNS` - Validation regex patterns
- `INPUT_LIMITS` - Min/max length constraints
- `DATE_FORMATS` - Date formatting patterns
- `HTTP_STATUS` - HTTP status code constants
- `TOAST_DURATIONS` - Toast notification timings
- `TOAST_TYPES` - Toast notification types
- `KEYBOARD_KEYS` - Keyboard key constants for accessibility
- `ARIA_LABELS` - Common ARIA label text
- `LABELS` - UI text labels (empty states, loading, errors, buttons)
- `LANGUAGES` - Supported language codes
- `THEMES` - Available theme options
- `ALLOWED_IMAGE_TYPES` - Valid image MIME types
- `ALLOWED_DOCUMENT_TYPES` - Valid document MIME types
- `COPYRIGHT_YEAR` - Current year (dynamically calculated)
- `APP_VERSION` - Application version
- `APP_NAME` - Application name

**Example Usage:**

```typescript
import { LABELS, REGEX_PATTERNS, KEYBOARD_KEYS } from '@shared/constants';

// Use labels in templates
<p>{{ LABELS.EMPTY_STATES.NO_RESULTS }}</p>
<button>{{ LABELS.BUTTONS.SUBMIT }}</button>

// Validate email
const isValid = REGEX_PATTERNS.EMAIL.test(email);

// Keyboard event handling
if (event.key === KEYBOARD_KEYS.ESCAPE) {
  this.closeModal();
}
```

## Import Best Practices

### Barrel Import (Recommended)

Import all constants from the barrel export:

```typescript
import { ROUTES, API_CONFIG, LABELS } from '@shared/constants';
```

### Selective Import

Import specific constants when you need just a few:

```typescript
import { ROUTES } from '@shared/constants/routes.constants';
import { LABELS } from '@shared/constants/app.constants';
```

## Usage in Components

### TypeScript Files

```typescript
import { Component } from '@angular/core';
import { ROUTE_PATHS, LABELS } from '@shared/constants';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  // Expose constants to template
  protected readonly ROUTE_PATHS = ROUTE_PATHS;
  protected readonly LABELS = LABELS;

  // Use in methods
  navigateToCaseStudies() {
    this.router.navigate([ROUTE_PATHS.CASE_STUDIES]);
  }
}
```

### Template Files

```html
<!-- Use exposed constants -->
<a [routerLink]="ROUTE_PATHS.HOME">{{ LABELS.BUTTONS.BACK }}</a>

<!-- Empty state -->
@if (items().length === 0) {
<p>{{ LABELS.EMPTY_STATES.NO_RESULTS }}</p>
}

<!-- Loading state -->
@if (isLoading()) {
<p>{{ LABELS.LOADING.DEFAULT }}</p>
}
```

## Adding New Constants

When adding new constants:

1. **Choose the right file** based on the constant's purpose
2. **Use SCREAMING_SNAKE_CASE** for constant names
3. **Add JSDoc comments** explaining the constant's purpose
4. **Use `as const`** for type safety (creates readonly literal types)
5. **Group related constants** in objects
6. **Update this README** with new exports and examples

**Example:**

```typescript
/**
 * Social media platform names
 */
export const SOCIAL_PLATFORMS = {
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'Twitter',
} as const;
```

## Type Safety Benefits

Using `as const` makes constants truly immutable and provides better TypeScript inference:

```typescript
// Without 'as const'
const ROUTES = { HOME: 'home' };
type HomeRoute = typeof ROUTES.HOME; // type: string

// With 'as const'
const ROUTES = { HOME: 'home' } as const;
type HomeRoute = typeof ROUTES.HOME; // type: 'home' (literal type)
```

## Placeholder Values

Some constants have placeholder values and will be updated in future phases:

- **External Links**: Update with real social media URLs
- **SEO Config**: Update with actual Open Graph images
- **GitHub Endpoints**: Will be used in Phase 4
- **GraphQL Queries**: Will be used in Phase 4 for GitHub integration
- **Feature Flags**: Enable features as they're implemented

## Testing

When testing components that use constants, you can:

1. **Import the same constants** in tests (preferred)
2. **Mock constants** if testing error scenarios
3. **Test with constant values** to ensure they match expectations

```typescript
import { ROUTES } from '@shared/constants';

it('should navigate to case studies', () => {
  component.navigateToCaseStudies();
  expect(router.navigate).toHaveBeenCalledWith([ROUTES.CASE_STUDIES]);
});
```

## Related Documentation

- **Path Aliases**: Constants use `@shared/*` alias (configured in `tsconfig.json`)
- **Copilot Instructions**: See `.github/copilot-instructions.md` for usage guidelines
- **Implementation Plan**: See `IMPLEMENTATION_PLAN.md` Phase 1 for context
