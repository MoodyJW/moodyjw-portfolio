import { provideRouter } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'Core/Layout/Footer',
  component: FooterComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The FooterComponent provides a comprehensive footer for the application with:
- Brand information and description
- Footer navigation links
- Social media links (GitHub, LinkedIn, Email)
- Copyright notice
- Technology credits (Angular, TypeScript)
- Responsive grid layout
- WCAG 2.1 AAA accessibility compliance

## Features
- Responsive design (mobile-first, 768px breakpoint)
- Proper heading hierarchy (h2 for brand, h3 for sections)
- ARIA labels and landmarks
- External link handling with security attributes
- Mailto link handling without target="_blank"
- Focus indicators for keyboard navigation
- Semantic HTML with proper footer element
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FooterComponent>;

/**
 * Default footer appearance with all sections visible
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default footer with brand, navigation, social links, and copyright information.',
      },
    },
  },
};

/**
 * Footer on mobile viewport (375px width)
 */
export const MobileLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Footer layout on mobile devices. Sections stack vertically with full width on screens < 768px.',
      },
    },
  },
};

/**
 * Footer on tablet viewport (768px width)
 */
export const TabletLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Footer layout on tablet devices. Uses 3-column grid at 768px and above (brand takes 2 columns).',
      },
    },
  },
};

/**
 * Footer on desktop viewport (1920px width)
 */
export const DesktopLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Footer layout on desktop devices with full 3-column grid layout.',
      },
    },
  },
};

/**
 * Footer with long page content to demonstrate placement
 */
export const WithLongContent: Story = {
  decorators: [
    (story) => ({
      template: `
        <div style="min-height: 200vh; padding: 2rem; background: var(--color-surface);">
          <h1 style="margin-bottom: 1rem;">Page Content</h1>
          <p style="margin-bottom: 1rem;">Scroll down to see the footer at the bottom of the page.</p>
          <p style="margin-bottom: 1rem;">The footer is designed to stay at the bottom of the page content.</p>
        </div>
        ${story().template}
      `,
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates footer placement at the bottom of long page content. In the main layout, the footer is placed after the main content.',
      },
    },
  },
};

/**
 * Footer with focus on accessibility features
 */
export const AccessibilityFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Accessibility Features

### Semantic HTML
- Uses \`<footer>\` element (implicit contentinfo landmark)
- Proper heading hierarchy (h2 for brand, h3 for sections)
- \`<nav>\` element with aria-label="Footer navigation"

### ARIA Labels
- All navigation links have descriptive aria-labels
- Social links include context (e.g., "Visit GitHub profile (opens in new tab)")
- Footer navigation has aria-label="Footer navigation"

### External Links
- \`target="_blank"\` only for external links (not mailto)
- \`rel="noopener noreferrer"\` for security
- Visual external link icon indicator

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators on all links
- Proper tab order through navigation and social links

### Color Contrast
- All text meets WCAG 2.1 AAA standards (7:1 contrast ratio)
- Link colors tested for accessibility
- Hover states maintain proper contrast
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Focus the first navigation link to demonstrate keyboard navigation
    const canvas = canvasElement as HTMLElement;
    const firstNavLink = canvas.querySelector<HTMLAnchorElement>('.footer__nav-link');
    if (firstNavLink) {
      firstNavLink.focus();
    }
  },
};

/**
 * Footer social links interaction demo
 */
export const SocialLinksInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Social Links

The footer includes three social links:

1. **GitHub** - Links to GitHub profile (opens in new tab)
2. **LinkedIn** - Links to LinkedIn profile (opens in new tab)
3. **Email** - Mailto link (opens in default email client, no new tab)

Each link includes:
- Icon representation
- Descriptive label
- ARIA label with context
- External link icon (for non-mailto links)
- Proper security attributes (rel="noopener noreferrer")

### Link Behavior
- External links open in new tab with \`target="_blank"\`
- Mailto links open in default email client
- All links are keyboard accessible
- Hover states provide visual feedback
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Focus the first social link to demonstrate interaction
    const canvas = canvasElement as HTMLElement;
    const firstSocialLink = canvas.querySelector<HTMLAnchorElement>('.footer__social-link');
    if (firstSocialLink) {
      firstSocialLink.focus();
    }
  },
};

/**
 * Footer navigation links demo
 */
export const NavigationLinks: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Footer Navigation

The footer includes navigation links to all main pages:
- Home
- Case Studies
- (Additional pages as configured in NAV_ITEMS constant)

### Features
- RouterLink integration for SPA navigation
- Descriptive ARIA labels
- Keyboard accessible
- Focus indicators
- Consistent styling with main navigation
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Focus the first navigation link
    const canvas = canvasElement as HTMLElement;
    const firstNavLink = canvas.querySelector<HTMLAnchorElement>('.footer__nav-link');
    if (firstNavLink) {
      firstNavLink.focus();
    }
  },
};

/**
 * Footer technology credits section
 */
export const TechnologyCredits: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Technology Credits

The footer includes a "Built with" section highlighting the main technologies:
- **Angular** - Modern web framework
- **TypeScript** - Type-safe JavaScript

Each technology name is a link to its official website with:
- \`target="_blank"\` for opening in new tab
- \`rel="noopener noreferrer"\` for security
- Accessible link styling with hover states
        `,
      },
    },
  },
};
