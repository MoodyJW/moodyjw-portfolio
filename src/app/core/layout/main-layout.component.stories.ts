import { provideRouter } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { MainLayoutComponent } from './main-layout.component';

/**
 * MainLayoutComponent provides the primary application shell with:
 * - Responsive navigation (desktop horizontal menu, mobile hamburger drawer)
 * - Skip-to-content link for keyboard accessibility
 * - Active route highlighting
 * - Mobile menu with backdrop and slide-out animation
 * - WCAG 2.1 AAA compliant accessibility features
 *
 * ## Features
 * - **Desktop Navigation**: Horizontal menu bar visible on screens ≥768px
 * - **Mobile Navigation**: Hamburger icon that opens a slide-out drawer on screens <768px
 * - **Keyboard Navigation**: Full keyboard support with Enter, Space, and Escape keys
 * - **Active States**: Visual indication of the current route
 * - **Accessibility**: Proper ARIA attributes, skip links, and focus management
 */
const meta: Meta<MainLayoutComponent> = {
  title: 'Core/MainLayout',
  component: MainLayoutComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: MainLayoutComponent },
          { path: 'case-studies', component: MainLayoutComponent },
        ]),
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The MainLayout component serves as the primary application shell, providing consistent navigation, header, footer, and content areas across all pages. It includes a responsive navigation system that adapts from a horizontal desktop menu to a mobile hamburger menu with slide-out drawer.',
      },
    },
  },
  argTypes: {
    // MainLayout doesn't have inputs, but we can document its features
  },
};

export default meta;
type Story = StoryObj<MainLayoutComponent>;

/**
 * Default layout showing the main navigation in its initial state.
 * The desktop navigation is visible on larger screens, while the
 * mobile hamburger menu appears on smaller viewports.
 *
 * **Try it:**
 * - Resize your viewport to see responsive behavior
 * - Click navigation links to see active state highlighting
 * - Use Tab key to navigate and see focus indicators
 * - Press Tab from the top to see the skip-to-content link
 */
export const Default: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-2xl); text-align: center;">
          <h1>Welcome to the Portfolio</h1>
          <p>This is the main content area. The layout includes a header with navigation and a footer.</p>
          <p style="margin-top: var(--spacing-xl); color: var(--color-text-secondary);">
            <strong>Try these interactions:</strong><br>
            • Resize your browser to see responsive navigation<br>
            • Click the hamburger icon on mobile to open the menu<br>
            • Use keyboard navigation (Tab, Enter, Escape)<br>
            • Press Tab from the top to reveal the skip link
          </p>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The default layout state with all navigation features. Resize your viewport to see how the navigation adapts between desktop and mobile modes.',
      },
    },
  },
};

/**
 * Desktop navigation view showing the horizontal menu bar.
 * This is the layout as it appears on tablets and desktop screens.
 *
 * **Features:**
 * - Horizontal navigation menu in the header
 * - Hover states on navigation links
 * - Active route highlighting
 * - Accessible focus indicators
 */
export const DesktopNavigation: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-2xl);">
          <h1>Desktop Navigation</h1>
          <p>On desktop screens (≥768px), the navigation appears as a horizontal menu bar in the header.</p>
          <ul style="margin-top: var(--spacing-xl); line-height: 1.8;">
            <li>✓ Horizontal menu layout</li>
            <li>✓ Hover and focus states</li>
            <li>✓ Active route indication</li>
            <li>✓ Keyboard navigable</li>
          </ul>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story:
          'Desktop layout showing the horizontal navigation menu. Navigate between items using mouse or keyboard.',
      },
    },
  },
};

/**
 * Mobile navigation view showing the hamburger menu button.
 * Click the hamburger icon to open the slide-out drawer.
 *
 * **Features:**
 * - Hamburger icon button (☰)
 * - Slide-out navigation drawer from the right
 * - Semi-transparent backdrop
 * - Smooth animations
 * - Close on backdrop click or Escape key
 */
export const MobileNavigation: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-xl);">
          <h1>Mobile Navigation</h1>
          <p>On mobile screens (&lt;768px), click the hamburger icon to open the navigation drawer.</p>
          <ul style="margin-top: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
            <li>✓ Hamburger menu button</li>
            <li>✓ Slide-out drawer animation</li>
            <li>✓ Backdrop overlay</li>
            <li>✓ Close on backdrop click</li>
            <li>✓ Close on Escape key</li>
            <li>✓ Close on link selection</li>
          </ul>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile layout showing the hamburger menu. Click the menu icon to see the slide-out navigation drawer with backdrop overlay.',
      },
    },
  },
};

/**
 * Tablet view showing the breakpoint between mobile and desktop navigation.
 * At 768px, the layout transitions from mobile hamburger to desktop menu.
 */
export const TabletNavigation: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-xl);">
          <h1>Tablet Navigation</h1>
          <p>At 768px and above, the navigation switches from mobile drawer to desktop menu.</p>
          <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--border-radius);">
            <strong>Responsive Breakpoints:</strong>
            <ul style="margin-top: var(--spacing-sm); line-height: 1.8;">
              <li>&lt;768px: Mobile hamburger menu</li>
              <li>≥768px: Desktop horizontal menu</li>
            </ul>
          </div>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Tablet viewport showing the transition point between mobile and desktop layouts at 768px.',
      },
    },
  },
};

/**
 * Long content example demonstrating the sticky header behavior.
 * Scroll down to see that the header remains fixed at the top.
 */
export const WithLongContent: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-2xl);">
          <h1>Sticky Header Demonstration</h1>
          <p>Scroll down to see the header stick to the top of the viewport.</p>

          ${Array.from({ length: 10 })
            .map(
              (_, i) => `
            <section style="margin-top: var(--spacing-2xl); padding: var(--spacing-xl); background: var(--color-surface); border-radius: var(--border-radius);">
              <h2>Section ${i + 1}</h2>
              <p>This is section ${i + 1} of the content. The header will remain fixed at the top as you scroll through this long content.</p>
              <p style="color: var(--color-text-secondary);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            </section>
          `
            )
            .join('')}
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the sticky header behavior with scrollable content. The header remains fixed at the top while scrolling.',
      },
    },
  },
};

/**
 * Accessibility features demonstration showing all WCAG 2.1 AAA compliant features.
 *
 * **Key Accessibility Features:**
 * - Skip-to-content link (visible on Tab focus)
 * - Proper ARIA labels and roles
 * - Keyboard navigation support
 * - Focus indicators on all interactive elements
 * - Screen reader friendly navigation structure
 */
export const AccessibilityFeatures: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-2xl); max-width: 800px; margin: 0 auto;">
          <h1>Accessibility Features</h1>
          <p style="margin-bottom: var(--spacing-xl);">
            This layout follows WCAG 2.1 AAA guidelines for maximum accessibility.
          </p>

          <section style="margin-bottom: var(--spacing-2xl);">
            <h2 style="margin-bottom: var(--spacing-md);">Keyboard Navigation</h2>
            <ul style="line-height: 1.8;">
              <li><kbd>Tab</kbd> - Navigate through interactive elements</li>
              <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Activate buttons and links</li>
              <li><kbd>Escape</kbd> - Close mobile menu</li>
              <li><kbd>Tab</kbd> from top - Reveal skip-to-content link</li>
            </ul>
          </section>

          <section style="margin-bottom: var(--spacing-2xl);">
            <h2 style="margin-bottom: var(--spacing-md);">ARIA Attributes</h2>
            <ul style="line-height: 1.8;">
              <li>Navigation landmark with <code>aria-label="Main navigation"</code></li>
              <li>Mobile menu dialog with <code>aria-modal="true"</code></li>
              <li>Menu toggle with <code>aria-expanded</code> and <code>aria-controls</code></li>
              <li>Proper <code>role</code> attributes on menu elements</li>
            </ul>
          </section>

          <section style="margin-bottom: var(--spacing-2xl);">
            <h2 style="margin-bottom: var(--spacing-md);">Visual Indicators</h2>
            <ul style="line-height: 1.8;">
              <li>Focus outlines on all interactive elements</li>
              <li>Active route highlighting</li>
              <li>Hover states for mouse users</li>
              <li>Color contrast ratios meeting AAA standards</li>
            </ul>
          </section>

          <div style="padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--border-radius); border-left: 4px solid var(--color-primary);">
            <strong>💡 Tip:</strong> Try navigating this page using only your keyboard to experience the accessibility features!
          </div>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive demonstration of all accessibility features including keyboard navigation, ARIA attributes, and visual indicators.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
        ],
      },
    },
  },
};

/**
 * Demonstrates the skip-to-content link accessibility feature.
 * Press Tab when focused at the top of the page to see the skip link appear.
 */
export const SkipToContent: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-2xl); max-width: 800px; margin: 0 auto;">
          <h1 id="main-heading">Skip to Content Feature</h1>

          <div style="padding: var(--spacing-xl); background: var(--color-surface); border-radius: var(--border-radius); margin-top: var(--spacing-xl);">
            <h2 style="margin-bottom: var(--spacing-md);">How to See the Skip Link</h2>
            <ol style="line-height: 2;">
              <li>Click in your browser's address bar</li>
              <li>Press <kbd>Tab</kbd> key</li>
              <li>The "Skip to main content" link will appear at the top left</li>
              <li>Press <kbd>Enter</kbd> to skip navigation and jump directly to the main content</li>
            </ol>
          </div>

          <div style="padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--border-radius); margin-top: var(--spacing-xl); border-left: 4px solid var(--color-primary);">
            <strong>Why This Matters:</strong>
            <p style="margin-top: var(--spacing-sm); color: var(--color-text-secondary);">
              Screen reader users and keyboard-only users can skip repetitive navigation and go straight to the main content, significantly improving their browsing experience.
            </p>
          </div>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The skip-to-content link is hidden until focused via keyboard, allowing keyboard and screen reader users to bypass navigation.',
      },
    },
  },
};

/**
 * Interactive example showing all mobile menu interactions:
 * - Open menu with hamburger button
 * - Close with backdrop click
 * - Close with Escape key
 * - Close when clicking a navigation link
 */
export const MobileMenuInteractions: Story = {
  render: () => ({
    template: `
      <app-main-layout>
        <div style="padding: var(--spacing-xl);">
          <h1 style="font-size: var(--font-size-xl);">Mobile Menu Interactions</h1>

          <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--border-radius);">
            <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Ways to Open Menu:</h2>
            <ul style="line-height: 1.8;">
              <li>Click the hamburger icon (☰)</li>
              <li>Focus the icon and press <kbd>Enter</kbd> or <kbd>Space</kbd></li>
            </ul>
          </div>

          <div style="margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--border-radius);">
            <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Ways to Close Menu:</h2>
            <ul style="line-height: 1.8;">
              <li>Click the close icon (×)</li>
              <li>Click the backdrop (dark overlay)</li>
              <li>Press <kbd>Escape</kbd> key</li>
              <li>Click any navigation link</li>
            </ul>
          </div>

          <div style="margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--border-radius);">
            <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Animation Details:</h2>
            <ul style="line-height: 1.8;">
              <li>Drawer slides in from the right</li>
              <li>Backdrop fades in</li>
              <li>Smooth 0.3s transitions</li>
            </ul>
          </div>
        </div>
      </app-main-layout>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Comprehensive demonstration of all mobile menu interaction methods including mouse, touch, and keyboard.',
      },
    },
  },
};
