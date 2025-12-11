# Core Module

The `core` directory contains application-wide functionality that should only be instantiated once and shared across the entire application.

## Structure

```
core/
├── layout/           # Shell layouts and main layout components
├── header/           # Application header with navigation
├── footer/           # Application footer
├── services/         # Global singleton services
├── store/            # NgRx SignalStore state management
├── guards/           # Route guards for navigation control
├── interceptors/     # HTTP interceptors
└── models/           # Shared data models and interfaces
```

## Layout

The `layout` folder contains shell components that compose the application structure:

- **MainLayoutComponent**: Application shell that orchestrates the overall page structure (header, main content with router outlet, footer)
- **HeaderComponent**: Responsive navigation bar with desktop menu, mobile drawer, brand logo, and theme picker
- **FooterComponent**: Application footer with copyright information and external links
- Future layouts: AdminLayout, AuthLayout, PrintLayout, etc.

### Header Component

The HeaderComponent provides:
- Responsive navigation with 5 main routes (Home, Projects, Case Studies, About, Contact)
- Mobile hamburger menu with slide-out drawer animation
- Active route highlighting using `routerLinkActive`
- Theme picker integration for light/dark mode switching
- Full keyboard accessibility (Enter/Space to toggle, Escape to close)
- WCAG 2.1 AAA compliant with proper ARIA labels and semantic HTML

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
