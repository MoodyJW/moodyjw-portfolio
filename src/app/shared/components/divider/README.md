# Divider Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Visual divider component for separating content sections with multiple styles and orientations.

## Features

- ✅ **Two Orientations**: Horizontal and Vertical
- ✅ **Three Variants**: Solid, Dashed, Dotted
- ✅ **Seven Spacing Options**: None, XS, SM, MD, LG, XL, 2XL
- ✅ **Three Thickness Options**: Thin, Medium, Thick
- ✅ **Optional Label**: Centered text within horizontal dividers
- ✅ **Inset Mode**: Padding from edges
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA separator role
- ✅ **Reduced Motion**: Respects prefers-reduced-motion
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { DividerComponent } from '@shared/components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DividerComponent],
  template: `
    <!-- Basic horizontal divider -->
    <div>Content above</div>
    <app-divider />
    <div>Content below</div>

    <!-- Divider with label -->
    <div>Login form</div>
    <app-divider label="Or continue with" />
    <div>Social login buttons</div>

    <!-- Vertical divider -->
    <div style="display: flex; align-items: center; gap: 1rem;">
      <button>Left</button>
      <app-divider orientation="vertical" />
      <button>Right</button>
    </div>

    <!-- Dashed divider -->
    <app-divider variant="dashed" />

    <!-- Dotted divider -->
    <app-divider variant="dotted" />

    <!-- Custom spacing -->
    <app-divider spacing="2xl" />

    <!-- Thick divider -->
    <app-divider thickness="thick" />

    <!-- Inset divider -->
    <app-divider [inset]="true" />
  `,
})
export class ExampleComponent {}
```

### Variants

```typescript
@Component({
  template: `
    <div>Section 1</div>
    <app-divider variant="solid" />

    <div>Section 2</div>
    <app-divider variant="dashed" />

    <div>Section 3</div>
    <app-divider variant="dotted" />

    <div>Section 4</div>
  `,
})
export class VariantsExample {}
```

### With Labels

```typescript
@Component({
  template: `
    <!-- "Or" separator -->
    <app-divider label="OR" spacing="lg" />

    <!-- Section separator -->
    <app-divider label="Featured Products" spacing="xl" />

    <!-- Date separator -->
    <app-divider label="January 2024" variant="dashed" />

    <!-- Custom label -->
    <app-divider label="⭐ Premium Features ⭐" />
  `,
})
export class LabelsExample {}
```

### Vertical Dividers

```typescript
@Component({
  template: `
    <!-- Button group with dividers -->
    <div class="button-group">
      <button>Edit</button>
      <app-divider orientation="vertical" spacing="sm" />
      <button>Delete</button>
      <app-divider orientation="vertical" spacing="sm" />
      <button>Share</button>
    </div>

    <!-- Sidebar layout -->
    <div style="display: flex; height: 100vh;">
      <nav style="width: 200px;">Navigation</nav>
      <app-divider orientation="vertical" />
      <main style="flex: 1;">Content</main>
    </div>
  `,
  styles: [`
    .button-group {
      display: flex;
      align-items: center;
    }
  `],
})
export class VerticalExample {}
```

### Spacing Options

```typescript
@Component({
  template: `
    <div>No spacing</div>
    <app-divider spacing="none" />
    <div>XS spacing</div>
    <app-divider spacing="xs" />
    <div>Small spacing</div>
    <app-divider spacing="sm" />
    <div>Medium spacing (default)</div>
    <app-divider spacing="md" />
    <div>Large spacing</div>
    <app-divider spacing="lg" />
    <div>XL spacing</div>
    <app-divider spacing="xl" />
    <div>2XL spacing</div>
    <app-divider spacing="2xl" />
    <div>Content</div>
  `,
})
export class SpacingExample {}
```

### Thickness Options

```typescript
@Component({
  template: `
    <p>Thin divider (default - 1px)</p>
    <app-divider thickness="thin" />

    <p>Medium divider (2px)</p>
    <app-divider thickness="medium" />

    <p>Thick divider (4px)</p>
    <app-divider thickness="thick" />
  `,
})
export class ThicknessExample {}
```

## Component API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of the divider |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Visual variant |
| `spacing` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Spacing around divider |
| `thickness` | `'thin' \| 'medium' \| 'thick'` | `'thin'` | Thickness of the line |
| `label` | `string \| undefined` | `undefined` | Optional label text (horizontal only) |
| `inset` | `boolean` | `false` | Whether divider should be inset from edges |
| `ariaRole` | `string` | `'separator'` | ARIA role for the divider |
| `ariaLabel` | `string \| undefined` | `undefined` | ARIA label (auto-generated if not provided) |

### Spacing Specifications

| Size | Spacing (margin) |
|------|------------------|
| `none` | 0 |
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |

### Thickness Specifications

| Thickness | Line Width |
|-----------|------------|
| `thin` | 1px |
| `medium` | 2px |
| `thick` | 4px |

## Accessibility

### ARIA Role

The component uses `role="separator"` by default, which is the semantic role for visual dividers.

### ARIA Label

Automatically generated based on orientation:
- Horizontal: "Horizontal divider"
- Vertical: "Vertical divider"

Override with custom `ariaLabel` if needed.

### Screen Readers

Dividers are presentational and typically ignored by screen readers unless they have meaningful labels.

## Styling

Uses BEM methodology with theme integration:

```scss
.divider {
  &--horizontal {
    width: 100%;
    height: var(--thickness);
    margin: var(--spacing) 0;
  }

  &--vertical {
    width: var(--thickness);
    height: 100%;
    margin: 0 var(--spacing);
  }

  &--solid {
    border-style: solid;
  }

  &--dashed {
    border-style: dashed;
  }

  &--dotted {
    border-style: dotted;
  }

  &--inset {
    &.divider--horizontal {
      margin-left: var(--spacing-lg);
      margin-right: var(--spacing-lg);
    }
  }

  &--with-label {
    display: flex;
    align-items: center;
    text-align: center;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-top: var(--thickness) var(--variant) var(--color-border);
    }

    span {
      padding: 0 var(--spacing-md);
      color: var(--color-text-secondary);
    }
  }
}
```

## Common Use Cases

### Section Separator

```html
<section>
  <h2>Section Title</h2>
  <p>Content...</p>
</section>

<app-divider spacing="2xl" />

<section>
  <h2>Next Section</h2>
  <p>Content...</p>
</section>
```

### Login Form

```html
<form>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button>Sign In</button>
</form>

<app-divider label="Or continue with" spacing="lg" />

<div class="social-buttons">
  <button>Google</button>
  <button>Facebook</button>
</div>
```

### List Items

```html
<div class="list">
  <div class="item">Item 1</div>
  <app-divider spacing="sm" />
  <div class="item">Item 2</div>
  <app-divider spacing="sm" />
  <div class="item">Item 3</div>
</div>
```

### Toolbar

```html
<div class="toolbar">
  <button>Bold</button>
  <button>Italic</button>
  <app-divider orientation="vertical" spacing="xs" />
  <button>Link</button>
  <button>Image</button>
</div>
```

## Testing

Run tests:

```bash
npm test -- divider.component
```

## Architecture

```
divider/
├── divider.component.ts
├── divider.component.html
├── divider.component.scss
├── divider.component.spec.ts
├── divider.component.stories.ts
├── index.ts
└── README.md
```

## Best Practices

1. **Use appropriate spacing**: Match divider spacing to surrounding content
2. **Horizontal by default**: Most dividers are horizontal
3. **Labels sparingly**: Use labels only when they add meaning
4. **Vertical height**: Ensure parent has defined height for vertical dividers
5. **Semantic separation**: Use dividers to indicate logical content boundaries

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
