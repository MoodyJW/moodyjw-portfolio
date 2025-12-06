# Icon Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible icon component wrapping ng-icons with size variants, color options, and accessibility features.

## Features

- ✅ **Six Sizes**: Extra small (xs) to 2X large (2xl)
- ✅ **Seven Color Options**: Current, Primary, Secondary, Success, Warning, Error, Info
- ✅ **Spin Animation**: Optional rotating animation for loading states
- ✅ **Accessible**: WCAG 2.1 AAA compliant with proper ARIA attributes
- ✅ **Decorative Mode**: Hide icons from screen readers when purely visual
- ✅ **Icon Registry**: Type-safe icon names from centralized registry
- ✅ **Theme Integration**: Uses CSS variables for colors
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { IconComponent } from '@shared/components';
import { ICON_NAMES } from '@shared/constants';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [IconComponent],
  template: `
    <!-- Simple icon -->
    <app-icon [name]="ICON_NAMES.HOME" />

    <!-- Icon with size and color -->
    <app-icon
      [name]="ICON_NAMES.CHECK"
      size="lg"
      color="success"
    />

    <!-- Decorative icon (hidden from screen readers) -->
    <app-icon
      [name]="ICON_NAMES.STAR"
      [decorative]="true"
    />

    <!-- Icon with label (visible to screen readers) -->
    <app-icon
      [name]="ICON_NAMES.USER"
      ariaLabel="User profile"
    />

    <!-- Spinning loading icon -->
    <app-icon
      [name]="ICON_NAMES.ARROW_PATH"
      [spin]="true"
      ariaLabel="Loading"
    />

    <!-- Large colored icon -->
    <app-icon
      [name]="ICON_NAMES.EXCLAMATION_TRIANGLE"
      size="2xl"
      color="warning"
      ariaLabel="Warning message"
    />
  `,
})
export class ExampleComponent {
  readonly ICON_NAMES = ICON_NAMES;
}
```

### In Buttons

```typescript
@Component({
  template: `
    <button>
      <app-icon [name]="ICON_NAMES.TRASH" size="sm" [decorative]="true" />
      <span>Delete</span>
    </button>
  `,
})
export class ButtonExample {
  readonly ICON_NAMES = ICON_NAMES;
}
```

### With Different Colors

```typescript
@Component({
  template: `
    <!-- Success icon -->
    <app-icon
      [name]="ICON_NAMES.CHECK_CIRCLE"
      color="success"
      ariaLabel="Success"
    />

    <!-- Error icon -->
    <app-icon
      [name]="ICON_NAMES.X_CIRCLE"
      color="error"
      ariaLabel="Error"
    />

    <!-- Warning icon -->
    <app-icon
      [name]="ICON_NAMES.EXCLAMATION_TRIANGLE"
      color="warning"
      ariaLabel="Warning"
    />

    <!-- Info icon -->
    <app-icon
      [name]="ICON_NAMES.INFORMATION_CIRCLE"
      color="info"
      ariaLabel="Information"
    />
  `,
})
export class ColorExample {
  readonly ICON_NAMES = ICON_NAMES;
}
```

### Loading Spinner

```typescript
@Component({
  template: `
    <div class="loading-container">
      <app-icon
        [name]="ICON_NAMES.ARROW_PATH"
        size="xl"
        [spin]="true"
        ariaLabel="Loading content"
      />
      <p>Loading...</p>
    </div>
  `,
})
export class LoadingExample {
  readonly ICON_NAMES = ICON_NAMES;
}
```

## Component API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `IconName` | **REQUIRED** | Icon name from the icon registry. Use `ICON_NAMES` constants for type safety |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Size of the icon |
| `color` | `'current' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'current'` | Color of the icon |
| `decorative` | `boolean` | `false` | Whether the icon is purely decorative (hidden from screen readers) |
| `ariaLabel` | `string \| undefined` | `undefined` | ARIA label for the icon (REQUIRED if not decorative) |
| `spin` | `boolean` | `false` | Whether the icon should spin/rotate continuously |

### Size Specifications

| Size | Pixels | Rem |
|------|--------|-----|
| `xs` | 12px | 0.75rem |
| `sm` | 16px | 1rem |
| `md` | 20px | 1.25rem |
| `lg` | 24px | 1.5rem |
| `xl` | 32px | 2rem |
| `2xl` | 40px | 2.5rem |

### Color Options

| Color | Usage | CSS Variable |
|-------|-------|--------------|
| `current` | Inherits current text color | `currentColor` |
| `primary` | Primary theme color | `var(--color-primary)` |
| `secondary` | Secondary theme color | `var(--color-secondary)` |
| `success` | Success/positive states | `var(--color-success)` |
| `warning` | Warning/caution states | `var(--color-warning)` |
| `error` | Error/danger states | `var(--color-error)` |
| `info` | Informational states | `var(--color-info)` |

## Accessibility

### Decorative vs Semantic Icons

Icons fall into two categories:

#### Decorative Icons
Icons that are purely visual and don't convey meaning:
- Set `decorative="true"`
- Icon will have `aria-hidden="true"`
- No `ariaLabel` needed

```html
<!-- Icon next to text label -->
<button>
  <app-icon [name]="ICON_NAMES.TRASH" [decorative]="true" />
  <span>Delete</span>
</button>
```

#### Semantic Icons
Icons that convey meaning or are standalone:
- Set `decorative="false"` (default)
- **MUST** provide `ariaLabel`
- Screen readers will announce the label

```html
<!-- Icon-only button -->
<button>
  <app-icon [name]="ICON_NAMES.TRASH" ariaLabel="Delete item" />
</button>
```

### Best Practices

1. **Icon with text**: Use `decorative="true"` since text provides context
2. **Icon-only**: Use `ariaLabel` to describe the icon's purpose
3. **Loading states**: Use `spin` with descriptive `ariaLabel`
4. **Status indicators**: Use appropriate `color` and `ariaLabel`

### Screen Reader Support

- Decorative icons: Completely hidden from screen readers
- Semantic icons: Announced with the provided `ariaLabel`
- Loading icons: Announced as "Loading [label]"

## Styling

The component uses BEM methodology and integrates with the theme system:

```scss
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // Size variants
  &--xs { width: 0.75rem; height: 0.75rem; }
  &--sm { width: 1rem; height: 1rem; }
  &--md { width: 1.25rem; height: 1.25rem; }
  &--lg { width: 1.5rem; height: 1.5rem; }
  &--xl { width: 2rem; height: 2rem; }
  &--2xl { width: 2.5rem; height: 2.5rem; }

  // Color variants
  &--primary { color: var(--color-primary); }
  &--secondary { color: var(--color-secondary); }
  &--success { color: var(--color-success); }
  &--warning { color: var(--color-warning); }
  &--error { color: var(--color-error); }
  &--info { color: var(--color-info); }

  // Spin animation
  &--spin {
    animation: icon-spin 1s linear infinite;
  }
}

@keyframes icon-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Reduced Motion

The spin animation respects `prefers-reduced-motion`:

```scss
@media (prefers-reduced-motion: reduce) {
  .icon--spin {
    animation: none;
  }
}
```

## Icon Registry

Icons are managed through a centralized registry. Use the `ICON_NAMES` constant for type-safe icon selection:

```typescript
import { ICON_NAMES } from '@shared/constants';

// TypeScript will autocomplete and validate icon names
const iconName = ICON_NAMES.HOME; // Type-safe
```

Available icon sets:
- Heroicons (prefix: `hero`)
- Add more icon sets as needed

## Testing

Comprehensive unit tests are provided in `icon.component.spec.ts`.

Run tests:

```bash
npm test -- icon.component
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Icon` to see all sizes, colors, and examples.

## Architecture

```
icon/
├── icon.component.ts              # Main icon component
├── icon.component.html            # Template
├── icon.component.scss            # Styles
├── icon.component.spec.ts         # Unit tests
├── icon.component.stories.ts      # Storybook stories
├── index.ts                       # Barrel export
└── README.md                      # This file
```

## Dependencies

- `@angular/core`: Core Angular functionality
- `@ng-icons/core`: Icon component library
- `@shared/constants`: Icon registry and names

## Common Patterns

### Alert Messages

```typescript
<div class="alert alert--success">
  <app-icon
    [name]="ICON_NAMES.CHECK_CIRCLE"
    color="success"
    [decorative]="true"
  />
  <span>Operation completed successfully!</span>
</div>
```

### Navigation

```typescript
<a href="/home">
  <app-icon [name]="ICON_NAMES.HOME" size="sm" [decorative]="true" />
  <span>Home</span>
</a>
```

### Loading States

```typescript
<div *ngIf="loading">
  <app-icon
    [name]="ICON_NAMES.ARROW_PATH"
    [spin]="true"
    ariaLabel="Loading data"
  />
</div>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the MoodyJW Portfolio project.
