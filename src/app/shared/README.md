# Shared Module

The `shared` directory contains reusable components, directives, pipes, and utilities that can be used across multiple features.

## Structure

```
shared/
├── components/       # Reusable UI components
├── directives/       # Custom directives
├── pipes/            # Custom pipes
└── utils/            # Utility functions and helpers
```

## Components

Reusable, presentational components:

- Button with variants (primary, secondary, etc.)
- Card component
- Modal/Dialog
- Form inputs
- Loading indicators
- Toast notifications
- Badge/Tag components

### Component Characteristics

- **Standalone**: All components are standalone
- **OnPush**: Use OnPush change detection
- **Signals**: Accept inputs via signal inputs
- **Typed**: Strongly typed with TypeScript
- **Accessible**: ARIA attributes included
- **Themeable**: Use CSS variables

## Directives

Custom attribute directives for DOM manipulation:

- Tooltip directive
- Click outside directive
- Lazy load directive
- Auto-focus directive

## Pipes

Transform data in templates:

- Date formatting
- Number formatting
- Text truncation
- Sanitization
- Filter/Sort helpers

## Utils

Pure utility functions:

- String manipulation
- Date helpers
- Array operations
- Object utilities
- Validation helpers
- Type guards

## Best Practices

1. Keep components small and focused
2. Accept inputs via signal inputs
3. Emit events via signal outputs
4. Make components theme-aware
5. Document component APIs
6. Write tests for utilities
7. Avoid business logic in shared components
8. Keep directives side-effect free where possible
