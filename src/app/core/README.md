# Core Module

The `core` directory contains application-wide functionality that should only be instantiated once and shared across the entire application.

## Structure

```
core/
├── layout/           # Shell layouts and main layout components
├── services/         # Global singleton services
├── store/            # NgRx SignalStore state management
├── guards/           # Route guards for navigation control
├── interceptors/     # HTTP interceptors
└── models/           # Shared data models and interfaces
```

## Layout

The `layout` folder contains shell components that wrap feature content:

- **MainLayoutComponent**: Primary layout with header, navigation, content area, and footer
- Future layouts: AdminLayout, AuthLayout, etc.

## Store

NgRx SignalStore for reactive state management:

- **ProjectStore**: Manages project/case study state with computed selectors and async methods
- Reactive signals-based state with automatic change detection
- Computed selectors for derived state (projectCount, allTags, etc.)
- Type-safe methods for state updates and async operations
- Built-in loading and error state management

## Services

Application-wide services that should be provided in root:

- **ProjectService**: Fetches project/case study data from mock JSON files
- Theme service (light/dark mode)
- Analytics service
- SEO service
- API services

## Guards

Route guards for access control:

- Authentication guards
- Authorization guards
- Unsaved changes guards
- Feature flags guards

## Interceptors

HTTP interceptors for cross-cutting concerns:

- **latencyInterceptor** (functional): Simulates network latency (500-1000ms) for development testing
- Auth token injection
- Error handling
- Loading state management
- Request/response logging

## Models

Shared TypeScript interfaces and types:

- **Project**: Case study/portfolio project model (id, title, description, tags)
- API response models
- Business domain models
- Configuration interfaces

## Best Practices

1. Services should be provided in root: `providedIn: 'root'`
2. Layout components use OnPush change detection
3. Guards return Observable/Promise for async checks
4. Interceptors should handle errors gracefully
5. Models should be strongly typed
