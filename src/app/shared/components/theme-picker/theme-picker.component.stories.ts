import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { THEMES, ThemeService } from '@core/theme';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { ThemePickerComponent } from './theme-picker.component';

/**
 * Theme Picker Component
 *
 * A dropdown component for selecting and switching between application themes.
 *
 * ## Features
 * - Displays current theme with appropriate icon
 * - Dropdown menu with all available themes
 * - Color swatches showing primary, background, and accent colors for each theme
 * - Menu stays open after selection to allow previewing multiple themes
 * - System default theme option
 * - Visual checkmark indicator for active theme
 * - Keyboard navigation support
 * - WCAG 2.1 AAA compliant
 *
 * ## Usage
 * ```html
 * <app-theme-picker />
 * ```
 */
const meta: Meta<ThemePickerComponent> = {
  title: 'Components/ThemePicker',
  component: ThemePickerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([]), ThemeService],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible theme picker component with dropdown interface for theme selection.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ThemePickerComponent>;

/**
 * Default theme picker state
 */
export const Default: Story = {};

/**
 * Theme picker with dropdown open
 */
export const DropdownOpen: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('[data-test="theme-picker-button"]') as HTMLElement;
    if (button) {
      button.click();
    }
  },
};

/**
 * Theme picker with system default active
 */
export const SystemDefault: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        {
          provide: ThemeService,
          useValue: {
            themes: signal(THEMES),
            activeTheme: signal(THEMES[0]),
            isSystemDefault: signal(true),
            setTheme: () => {},
            resetToSystem: () => {},
          },
        },
      ],
    }),
  ],
};

/**
 * Theme picker with dark theme active
 */
export const DarkTheme: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        {
          provide: ThemeService,
          useValue: {
            themes: signal(THEMES),
            activeTheme: signal(THEMES.find((t) => t.isDark) || THEMES[0]),
            isSystemDefault: signal(false),
            setTheme: () => {},
            resetToSystem: () => {},
          },
        },
      ],
    }),
  ],
};

/**
 * Theme picker with light theme active
 */
export const LightTheme: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        {
          provide: ThemeService,
          useValue: {
            themes: signal(THEMES),
            activeTheme: signal(THEMES.find((t) => !t.isDark) || THEMES[0]),
            isSystemDefault: signal(false),
            setTheme: () => {},
            resetToSystem: () => {},
          },
        },
      ],
    }),
  ],
};

/**
 * Interactive theme picker
 *
 * Try clicking to open the dropdown and selecting different themes.
 * The menu stays open after selection to allow previewing multiple themes.
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click the button to open the dropdown and try selecting different themes. Notice the color swatches showing each theme's primary, background, and accent colors. The menu stays open after selection to allow previewing multiple themes.",
      },
    },
  },
};

/**
 * Color swatches demo
 *
 * Demonstrates the color swatch preview feature for non-selected themes.
 */
export const ColorSwatches: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('[data-test="theme-picker-button"]') as HTMLElement;
    if (button) {
      button.click();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each theme option displays color swatches showing the primary, background, and accent colors. The currently selected theme shows a checkmark instead of swatches. This helps users preview theme colors before switching.',
      },
    },
  },
};

/**
 * Mobile view
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Theme picker optimized for mobile viewports. Theme label is hidden on small screens.',
      },
    },
  },
};

/**
 * Keyboard navigation demo
 */
export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Supports keyboard navigation:\n' +
          '- Enter/Space: Toggle dropdown\n' +
          '- Escape: Close dropdown\n' +
          '- Enter/Space on options: Select theme',
      },
    },
  },
};

/**
 * All themes preview
 */
export const AllThemes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        @for (theme of themes; track theme.slug) {
          <div>
            <p style="margin-bottom: 0.5rem; font-weight: 600;">{{ theme.label }}</p>
            <app-theme-picker />
          </div>
        }
      </div>
    `,
    props: {
      themes: THEMES,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Preview of theme picker with all available themes.',
      },
    },
  },
};
