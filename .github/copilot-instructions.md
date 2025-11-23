# GitHub Copilot Instructions for MoodyJW Portfolio

## Project Overview

This is a modern Angular portfolio application built with standalone components, signals, and a feature-based architecture. The application demonstrates enterprise-grade patterns and best practices for scalable frontend development.

## Architecture Principles

### Folder Structure

- **Core**: Application-wide services, guards, interceptors, and layouts
- **Shared**: Reusable components, directives, pipes, and utilities
- **Features**: Feature modules (Home, Case Studies) with their own components and services

### Angular Standards

1. **Standalone Components**: All components MUST be standalone
2. **Signals**: Use signals for reactive state management
3. **Change Detection**: ALWAYS use `ChangeDetectionStrategy.OnPush` for all components
4. **Lazy Loading**: Feature routes MUST be lazy-loaded using dynamic imports

### Routing

- Routes are defined in `app.routes.ts`
- Use the `MainLayoutComponent` as a shell for all feature routes
- All feature components are lazy-loaded for optimal performance

## Code Style Guidelines

### TypeScript

- Use strict type checking
- Prefer `const` over `let`
- Use readonly signals for data that shouldn't be mutated directly
- Avoid `any` types - use proper typing

### Component Structure

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-feature-name',
  standalone: true,
  imports: [],
  templateUrl: './feature-name.component.html',
  styleUrl: './feature-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureNameComponent {
  protected readonly data = signal<Type>(initialValue);
}
```

### Template Syntax

- Use Angular control flow (`@if`, `@for`, `@switch`) instead of structural directives
- Access signals with parentheses: `{{ mySignal() }}`
- Use `track` in `@for` loops for performance

### SCSS Styling

#### BEM Methodology

Use BEM (Block Element Modifier) naming convention:

```scss
.component-name {
  &__element {
    // element styles
  }

  &__element--modifier {
    // modifier styles
  }
}
```

#### CSS Variables

ALWAYS use CSS variables from the theme system:

**Colors**

- `--color-primary`, `--color-primary-hover`, `--color-primary-active`
- `--color-background`, `--color-surface`, `--color-surface-hover`
- `--color-text`, `--color-text-secondary`, `--color-text-tertiary`
- `--color-border`, `--color-border-hover`

**Spacing**

- `--spacing-xs` through `--spacing-4xl`

**Typography**

- `--font-size-xs` through `--font-size-5xl`
- `--font-weight-light` through `--font-weight-bold`
- `--font-family-base`, `--font-family-mono`

**Border Radius**

- `--border-radius`, `--border-radius-sm`, `--border-radius-lg`, `--border-radius-xl`

**Transitions**

- `--transition-duration`, `--transition-timing`

### File Organization

```
src/app/
├── core/
│   ├── layout/
│   ├── services/
│   ├── guards/
│   ├── interceptors/
│   └── models/
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── utils/
└── features/
    ├── home/
    │   ├── components/
    │   ├── services/
    │   └── home.component.ts
    └── case-studies/
        ├── components/
        ├── services/
        └── case-studies.component.ts
```

## Development Workflow

### Adding a New Feature

1. Create feature folder under `features/`
2. Create main component with OnPush change detection
3. Add lazy route in `app.routes.ts`
4. Use signals for state management
5. Follow BEM naming for styles
6. Use CSS variables for theming

### Adding a Shared Component

1. Create in `shared/components/`
2. Make it standalone
3. Use OnPush change detection
4. Accept inputs via `input()` signal
5. Emit outputs via `output()` signal

### Adding a Service

1. Place in appropriate folder (core/services or feature/services)
2. Use `providedIn: 'root'` or provide in component
3. Use signals or RxJS observables for state

## Performance Considerations

- All components use OnPush change detection
- Routes are lazy-loaded
- Use signals for fine-grained reactivity
- Avoid unnecessary subscriptions
- Use `trackBy` functions in loops

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper color contrast ratios

## Testing

### Unit Testing

- Write unit tests for components and services
- Test signal updates and component reactions
- Mock dependencies properly
- Use Angular testing utilities

### E2E Testing with Playwright

- Use Playwright for end-to-end tests
- Test critical user flows and navigation
- Run visual regression tests on Desktop (1920x1080), Laptop (1440x1024), Tablet (768x1024), and Mobile (375x667) viewports
- Screenshot tests ensure CSS Grid layouts don't break on smaller screens
- Store baseline screenshots in `e2e/screenshots-baseline/`
- Run E2E tests: `npm run test:e2e`
- Update visual baselines: `npm run test:e2e:update-snapshots`

## Build and Deploy

- Build: `npm run build`
- Dev server: `npm start`
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Update visual baselines: `npm run test:e2e:update-snapshots`
- Production builds are optimized and tree-shaken

## Do's and Don'ts

### Do's

✅ Use signals for state management
✅ Use OnPush change detection everywhere
✅ Lazy load all feature routes
✅ Use CSS variables for all styling values
✅ Follow BEM naming convention
✅ Make all components standalone
✅ Use modern Angular control flow
✅ Type everything properly

### Don'ts

❌ Don't use NgModules (use standalone)
❌ Don't use structural directives (*ngIf, *ngFor)
❌ Don't hardcode colors or spacing values
❌ Don't skip change detection strategy
❌ Don't eagerly load feature routes
❌ Don't use `any` type
❌ Don't create global styles without CSS variables
❌ Don't use Angular Material (custom design system)
