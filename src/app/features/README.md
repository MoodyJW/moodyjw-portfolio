# Features Module

The `features` directory contains feature-specific functionality organized by business domain. Each feature is self-contained with its own components, services, and state.

## Structure

```
features/
├── home/
│   ├── components/       # Feature-specific components
│   ├── services/         # Feature-specific services
│   ├── home.component.ts
│   └── index.ts
└── case-studies/
    ├── components/       # Feature-specific components
    ├── services/         # Feature-specific services
    ├── case-studies.component.ts
    └── index.ts
```

## Current Features

### Home
Landing page showcasing portfolio overview:
- Hero section with introduction
- Core expertise showcase
- Call-to-action buttons
- Responsive design

### Case Studies
Portfolio projects showcase:
- Grid layout of projects
- Project cards with details
- Technology tags
- Hover effects

## Feature Organization

Each feature should have:

1. **Main Component**: Entry point for the feature route
2. **Components Folder**: Feature-specific child components
3. **Services Folder**: Feature-specific business logic
4. **Index File**: Public API exports

## Adding a New Feature

```bash
# Create feature structure
mkdir -p src/app/features/new-feature/{components,services}

# Create main component
ng generate component features/new-feature --standalone --change-detection=OnPush

# Add route in app.routes.ts
{
  path: 'new-feature',
  loadComponent: () => import('./features/new-feature').then(m => m.NewFeatureComponent)
}
```

## Feature Best Practices

1. **Lazy Load**: All features are lazy-loaded
2. **OnPush**: Use OnPush change detection
3. **Signals**: Use signals for state management
4. **Self-Contained**: Minimize dependencies between features
5. **Services**: Provide services at component level if not global
6. **Routing**: Define child routes within feature if needed
7. **Testing**: Test components and services independently

## Feature Communication

Features can communicate via:

- **Shared Services**: For global state (from core)
- **Router**: For navigation and passing data
- **Events**: Via global event bus (if implemented)

Avoid direct feature-to-feature dependencies.

## Naming Conventions

- Feature folders: kebab-case (e.g., `case-studies`)
- Components: PascalCase with suffix (e.g., `CaseStudiesComponent`)
- Services: PascalCase with suffix (e.g., `CaseStudiesService`)
- Files: kebab-case (e.g., `case-studies.component.ts`)

## State Management

Each feature manages its own state:

```typescript
protected readonly items = signal<Item[]>([]);
protected readonly loading = signal(false);
protected readonly error = signal<string | null>(null);
```

For global state, use services from `core/services`.
