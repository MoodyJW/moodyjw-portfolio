# Theme Picker Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

A dropdown component for switching between application themes with full keyboard navigation and accessibility support.

## Features

- ✅ **Multiple Themes**: Supports Lumen (light), Aurora (light), Nocturne (dark), and Cosmos (dark) themes
- ✅ **System Default**: Option to use system preference for theme selection
- ✅ **Visual Indicators**: Icons for light/dark themes, badge for system default
- ✅ **Keyboard Navigation**: Full support for Enter, Space, and Escape keys
- ✅ **Click Outside**: Automatically closes when clicking outside the dropdown
- ✅ **Accessible**: WCAG 2.1 AAA compliant with proper ARIA attributes
- ✅ **Theme Persistence**: Selected theme is saved to localStorage
- ✅ **Responsive**: Label hidden on mobile viewports (< 640px)
- ✅ **Standalone**: No external dependencies beyond Angular and shared components

## Usage

### Basic Usage

Add the theme picker to your application's navbar or header:

```html
<app-theme-picker />
```

### Prerequisites

The ThemePickerComponent requires the `ThemeService` to be available. The service is automatically provided at the root level and handles theme management across the application.

## Features in Detail

### Theme Selection

The component displays all available themes in a dropdown menu:
- **Lumen**: Light theme with blue primary color
- **Aurora**: Light theme with teal primary color
- **Nocturne**: Dark theme with light blue primary color
- **Cosmos**: Dark theme with pink primary color

### System Default

Users can choose "System Default" which automatically selects the light or dark theme based on their operating system preference using `prefers-color-scheme` media query.

When system default is active:
- A "System" badge appears next to the current theme name
- The actual theme (light/dark) is determined by the OS setting
- Theme changes automatically if the OS preference changes

### Keyboard Navigation

- **Click or Space/Enter**: Opens the dropdown
- **Escape**: Closes the dropdown
- **Tab**: Navigates through theme options when dropdown is open
- **Enter/Space**: Selects the focused theme option

### Mobile Responsiveness

On viewports smaller than 640px:
- Theme label text is hidden
- Only the theme icon and chevron are shown
- Dropdown functionality remains fully accessible

## Component API

### Inputs

This component has no inputs - it's a self-contained theme switcher.

### Outputs

This component has no outputs - theme changes are handled internally via the `ThemeService`.

## Service Integration

The component integrates with `ThemeService`:

```typescript
import { ThemeService } from '@shared/services';

// Inject the service anywhere in your app
export class MyComponent {
  private themeService = inject(ThemeService);

  // Access current theme
  currentTheme = this.themeService.activeTheme();

  // Check if system default is active
  isSystemDefault = this.themeService.isSystemDefault();

  // Programmatically change theme
  setTheme() {
    this.themeService.setTheme('nocturne');
  }

  // Use system default
  useSystemDefault() {
    this.themeService.useSystemDefault();
  }
}
```

## Accessibility

### ARIA Attributes

- `aria-haspopup="true"`: Indicates button opens a menu
- `aria-expanded`: Indicates current state of dropdown
- `aria-label`: Describes the button and current theme
- `role="menu"`: Identifies dropdown as a menu
- `role="menuitem"`: Identifies each theme option

### Keyboard Support

All interactions are fully keyboard accessible:
- Button is focusable and activatable with keyboard
- All theme options are keyboard navigable
- Escape key closes dropdown from any focused element

### Color Contrast

All color combinations meet WCAG 2.1 AAA contrast requirements (7:1 minimum):
- Button text and icons on surface background
- Active theme highlighting
- Dropdown menu text

## Styling

The component uses BEM methodology and integrates with the theme system:

```scss
.theme-picker {
  // Button styling with theme variables
  &__button {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }

  // Label hidden on mobile
  &__label {
    @media (max-width: 640px) {
      display: none;
    }
  }

  // Dropdown styling
  &__dropdown {
    background-color: var(--color-surface);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

## Examples

### In a Navbar

```html
<nav class="navbar">
  <a routerLink="/">Home</a>
  <a routerLink="/about">About</a>

  <!-- Theme picker in navbar -->
  <app-theme-picker />
</nav>
```

### With Layout Integration

```html
<header class="main-header">
  <div class="main-header__logo">
    <img src="logo.svg" alt="Logo" />
  </div>

  <nav class="main-header__nav">
    <ul class="main-header__menu">
      <li><a routerLink="/">Home</a></li>
      <li><a routerLink="/projects">Projects</a></li>
    </ul>
  </nav>

  <!-- Theme picker in header -->
  <app-theme-picker class="main-header__theme-picker" />
</header>
```

## Testing

Comprehensive unit tests and E2E tests are provided:

- **Unit Tests**: 35 tests covering all functionality
- **E2E Tests**: 14 tests across multiple viewports and browsers

Run tests:

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Test Coverage

- ✅ Component creation and rendering
- ✅ Theme selection and switching
- ✅ System default option
- ✅ Dropdown open/close behavior
- ✅ Keyboard navigation
- ✅ Click outside to close
- ✅ Theme persistence in localStorage
- ✅ Mobile responsive behavior
- ✅ Accessibility attributes
- ✅ Theme color application

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/ThemePicker` to see all variants and states.

## Architecture

```
theme-picker/
├── theme-picker.component.ts           # Main component
├── theme-picker.component.html         # Template
├── theme-picker.component.scss         # Styles (BEM)
├── theme-picker.component.spec.ts      # Unit tests (35 tests)
├── theme-picker.component.stories.ts   # Storybook stories
├── index.ts                            # Barrel export
└── README.md                           # This file

Related:
services/
├── theme.service.ts                    # Theme management service
└── theme.service.spec.ts               # Service tests
```

## Dependencies

### Angular Components
- `IconComponent` - For theme icons (sun/moon) and chevron
- `BadgeComponent` - For "System" indicator badge
- `StackComponent` - For dropdown menu layout

### Services
- `ThemeService` - Core theme management and persistence

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **OnPush Change Detection**: Optimized for performance
- **Standalone Component**: Tree-shakeable
- **Computed Signals**: Efficient reactive state management
- **Event Listener Cleanup**: Proper cleanup on component destroy

## License

Part of the MoodyJW Portfolio project.
