# Architecture Documentation

## Overview

This Angular portfolio application is built using modern Angular 21+ features with a focus on performance, maintainability, and scalability. The architecture follows enterprise-grade patterns suitable for large-scale applications.

## Core Architectural Decisions

### 1. Standalone Components

**Decision**: Use standalone components exclusively, eliminating NgModules.

**Rationale**:
- Simplified dependency management
- Better tree-shaking and smaller bundles
- Improved developer experience
- Forward-compatible with Angular's direction

**Implementation**:
```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [RouterLink, CommonModule],
  // ...
})
```

### 2. Signal-Based State Management

**Decision**: Use Angular Signals as the primary reactive primitive.

**Rationale**:
- Fine-grained reactivity
- Better performance than zone-based change detection
- Simpler mental model than RxJS for UI state
- Native Angular feature with first-class support

**Implementation**:
```typescript
protected readonly items = signal<Item[]>([]);
protected readonly loading = signal(false);
```

### 3. OnPush Change Detection Strategy

**Decision**: Enforce `ChangeDetectionStrategy.OnPush` on all components.

**Rationale**:
- Significant performance improvements
- Forces immutable data patterns
- Works seamlessly with signals
- Prevents unnecessary re-renders

**Implementation**:
```typescript
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 4. Feature-Based Architecture

**Decision**: Organize code by feature domains rather than technical layers.

**Rationale**:
- Better code organization at scale
- Clear boundaries between features
- Easier to understand and maintain
- Supports team-based development

**Structure**:
```
src/app/
├── core/       # Application-wide singletons
├── shared/     # Reusable components/utilities
└── features/   # Business features
```

### 5. Lazy Loading Routes

**Decision**: Lazy load all feature routes using dynamic imports.

**Rationale**:
- Smaller initial bundle size
- Faster time to interactive
- Better code splitting
- Improved performance metrics

**Implementation**:
```typescript
{
  path: 'feature',
  loadComponent: () => import('./features/feature').then(m => m.FeatureComponent)
}
```

### 6. Custom Design System

**Decision**: Build custom design system with CSS Variables instead of using UI frameworks.

**Rationale**:
- Full control over styling
- Smaller bundle size
- No framework-specific conventions
- Demonstrates frontend expertise
- Theme flexibility

**Implementation**:
- CSS Variables in `_variables.scss`
- BEM naming convention
- Consistent design tokens

## Module Organization

### Core Module

**Purpose**: Application-wide singleton services, guards, interceptors, and layouts.

**Contents**:
- Layout components (MainLayout)
- Global services
- Route guards
- HTTP interceptors
- Shared models/interfaces

**Rules**:
- Should only be imported/used by the root app
- Services should use `providedIn: 'root'`
- No feature-specific logic

### Shared Module

**Purpose**: Reusable presentational components, directives, and pipes.

**Contents**:
- UI components (buttons, cards, modals)
- Utility directives
- Pure pipes
- Helper functions

**Rules**:
- No business logic
- Should be dumb/presentational
- Accept inputs via signals
- Emit outputs via signal outputs
- Must be reusable across features

### Features Module

**Purpose**: Self-contained feature implementations.

**Contents**:
- Feature components
- Feature-specific services
- Feature-specific state

**Rules**:
- Minimize inter-feature dependencies
- Lazy-loaded by default
- Feature-specific services provided at component level
- Each feature is a cohesive unit

## Routing Strategy

### Shell Architecture

The application uses a shell architecture with `MainLayoutComponent`:

```
MainLayout (Shell)
└── Router Outlet
    ├── Home (Lazy)
    ├── Case Studies (Lazy)
    └── Future Features (Lazy)
```

**Benefits**:
- Consistent layout across features
- Single navigation implementation
- Shared header/footer
- Easy to add authentication shells later

### Route Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout').then(m => m.MainLayoutComponent),
    children: [
      // Feature routes here
    ]
  }
];
```

## State Management Strategy

### Component State (Local)

Use signals for component-local state:

```typescript
class MyComponent {
  private readonly items = signal<Item[]>([]);
  
  protected readonly filteredItems = computed(() => 
    this.items().filter(/* logic */)
  );
}
```

### Global State (Future)

For global state, create services in `core/services`:

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<Theme>('light');
  
  readonly theme$ = this.theme.asReadonly();
  
  setTheme(theme: Theme) {
    this.theme.set(theme);
  }
}
```

## Styling Architecture

### CSS Variables

All design tokens are defined as CSS variables:

```scss
:root {
  --color-primary: #2563eb;
  --spacing-lg: 1rem;
  --font-size-base: 1rem;
}
```

### BEM Methodology

All components follow BEM naming:

```scss
.component {
  &__element {
    &--modifier {
      // styles
    }
  }
}
```

### Theme Support

Dark mode via CSS `prefers-color-scheme`:

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b82f6;
    // ...
  }
}
```

## Performance Optimizations

### 1. Bundle Size

- Initial bundle: ~60KB gzipped
- Lazy chunks: ~1-1.5KB each
- No heavy UI frameworks
- Tree-shakeable code

### 2. Runtime Performance

- OnPush change detection
- Signals for fine-grained reactivity
- Minimal DOM manipulations
- Optimized rendering

### 3. Loading Performance

- Lazy-loaded routes
- Code splitting by feature
- Minimal initial JavaScript
- Preconnect hints (future)

## Testing Strategy

### Unit Tests

- Test components in isolation
- Mock dependencies
- Test signal updates
- Use Angular Testing Library

### Integration Tests

- Test feature flows
- Test route navigation
- Test service integration

### E2E Tests

- Test critical user flows
- Test across browsers
- Test responsive behavior

## Security Considerations

### Current Measures

- No hardcoded secrets
- XSS protection via Angular sanitization
- CSRF protection (when backend added)
- Content Security Policy headers (deployment)

### Future Enhancements

- Authentication guards
- Authorization logic
- Input validation
- Rate limiting

## Scalability Considerations

### Code Organization

- Feature-based structure scales to hundreds of features
- Clear boundaries prevent coupling
- Easy to parallelize development

### Performance

- Lazy loading prevents bundle bloat
- OnPush scales to complex UIs
- Signals provide efficient updates

### Team Collaboration

- Feature folders enable team ownership
- Clear separation of concerns
- Consistent patterns across codebase

## Migration Path

### From Current State

The application is designed to grow incrementally:

1. **Phase 1** (Complete): Foundation
2. **Phase 2**: Enhanced features
3. **Phase 3**: State management
4. **Phase 4**: Shared components
5. **Phase 5**: Advanced features
6. **Phase 6**: Testing
7. **Phase 7**: Deployment
8. **Phase 8**: Documentation

### Adding New Features

```bash
# Create feature structure
mkdir -p src/app/features/new-feature/{components,services}

# Generate component
ng generate component features/new-feature --standalone

# Add route
# Update app.routes.ts with lazy-loaded route
```

## Technology Choices

### Angular 21+

- Latest features (signals, control flow)
- Long-term support
- Strong TypeScript integration
- Excellent tooling

### TypeScript 5.9+

- Type safety
- Better IDE support
- Modern JavaScript features
- Improved DX

### SCSS

- Variables and mixins
- Nesting for BEM
- Better organization
- Build-time processing

### Vite (via Angular CLI)

- Fast HMR
- Efficient bundling
- Modern build tool
- Great DX

## Future Considerations

### Potential Additions

- Storybook for component documentation
- Nx for monorepo management
- Playwright for E2E testing
- Husky for git hooks
- Prettier for code formatting
- ESLint for code quality

### Backend Integration

When adding a backend:
- Create API service in `core/services`
- Add HTTP interceptors for auth
- Add error handling
- Add loading states

### State Management Library

If needed at scale:
- NgRx for complex state
- Elf for lightweight solution
- Maintain signal-first approach

## Conclusion

This architecture provides a solid foundation for a scalable, performant Angular application. It follows Angular best practices, uses modern features, and is designed to grow with the application's needs.

The focus on standalone components, signals, and lazy loading ensures the application remains fast and maintainable as it scales. The feature-based organization and clear separation of concerns make it easy for teams to collaborate and extend functionality.
