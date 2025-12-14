import { provideLocationMocks } from '@angular/common/testing';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { CaseStudiesComponent } from './case-studies.component';

const meta: Meta<CaseStudiesComponent> = {
  title: 'Features/Case Studies/CaseStudiesList',
  component: CaseStudiesComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideLocationMocks()],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Case Studies List component displays a filterable and searchable list of portfolio case studies.

## Features
- Search case studies by title, description, client, role, or technologies
- Filter by technology tags
- Responsive grid layout (1/2 columns)
- Loading skeletons while data loads
- Empty state when no case studies match filters
- Click to navigate to case study detail page

## Data Management
- Uses CaseStudiesStore for state management
- Supports debounced search (300ms)
- Reactive filtering
- Sorted by published date (most recent first)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<CaseStudiesComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default case studies list with all case studies loaded.',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Case studies list in loading state with skeleton loaders.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          Note: The loading state is automatically shown when the component initializes.
          In a real application, this appears while fetching data from the API.
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Case studies list with search functionality. Try searching for "dashboard" or "Angular".',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          The search input filters case studies by title, description, client, role, and technologies.
          Search is debounced by 300ms for better performance.
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};

export const TechnologyFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click technology badges on case study cards to filter by that technology.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          Click any technology badge to filter case studies. Multiple tags can be selected.
          Selected tags are highlighted across all case study cards.
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty state shown when no case studies match the current filters.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          To see the empty state, search for something that doesn't exist or
          apply filters that exclude all case studies.
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};

export const ResponsiveLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Case studies list adapts to different screen sizes with responsive grid columns.',
      },
    },
  },
  render: () => ({
    template: `
      <div>
        <p style="padding: 1rem; color: #64748b; font-size: 0.875rem;">
          Resize the viewport to see the responsive grid:
          <br>• Mobile: 1 column
          <br>• Tablet/Desktop: 2 columns
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};

export const WithActiveFilters: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the active filters bar with clear filters button when filters are applied.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          Apply some filters (search or tags) to see the active filters indicator.
          The "Clear Filters" button appears when filters are active.
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};

export const AllFeaturesCombined: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all features working together: search and tag filtering.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">Try These Workflows:</h3>
          <ol style="margin: 0; padding-left: 1.5rem; color: #64748b; font-size: 0.875rem; line-height: 1.6;">
            <li>Search for "Angular" to filter case studies</li>
            <li>Click a technology badge to filter by that tech</li>
            <li>Apply multiple technology filters</li>
            <li>Search while filters are active</li>
            <li>Click "Clear Filters" to reset</li>
          </ol>
        </div>
        <app-case-studies />
      </div>
    `,
  }),
};

export const StickyFilters: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Filters section is sticky and stays at the top when scrolling.',
      },
    },
  },
  render: () => ({
    template: `
      <div>
        <p style="padding: 2rem 2rem 1rem; color: #64748b;">
          Scroll down to see the sticky filters bar stay at the top of the viewport.
        </p>
        <app-case-studies />
        <div style="height: 100vh; padding: 2rem; background: #f8fafc;">
          <p style="color: #64748b;">Scroll up to see sticky filters in action</p>
        </div>
      </div>
    `,
  }),
};

export const WithBreadcrumbs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the breadcrumb navigation at the top of the page.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          The breadcrumb navigation helps users understand their location in the site hierarchy.
          Home → Case Studies
        </p>
        <app-case-studies />
      </div>
    `,
  }),
};
