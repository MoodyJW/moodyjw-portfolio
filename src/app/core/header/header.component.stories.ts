import { provideRouter } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';

import { HeaderComponent } from './header.component';

const meta: Meta<HeaderComponent> = {
  title: 'Core/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application header component with navigation menu, mobile drawer, and theme picker integration. Provides sticky navigation with responsive behavior and keyboard accessibility.',
      },
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      providers: [provideRouter([])],
    }),
  ],
};

export default meta;
type Story = StoryObj<HeaderComponent>;

/**
 * Default header state with desktop navigation
 */
export const Default: Story = {};

/**
 * Header with mobile menu open (simulated)
 *
 * Note: Mobile menu state is managed internally. This story demonstrates
 * the mobile menu in its closed state on desktop viewports.
 */
export const MobileMenuClosed: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Accessibility notes:
 *
 * - Navigation uses semantic `<nav>` element with aria-label
 * - Desktop menu uses menubar/menuitem ARIA roles
 * - Mobile menu is a modal dialog with aria-modal
 * - Keyboard navigation: Enter/Space to toggle menu, Escape to close
 * - Active route highlighting with routerLinkActive
 * - Focus visible styles on all interactive elements
 * - Theme picker integration for user preference
 */
export const AccessibilityFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The header component follows WCAG 2.1 AAA guidelines with full keyboard navigation support and semantic HTML structure.',
      },
    },
  },
};
