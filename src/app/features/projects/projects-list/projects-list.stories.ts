import { provideLocationMocks } from '@angular/common/testing';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { ProjectsList } from './projects-list';

const meta: Meta<ProjectsList> = {
  title: 'Features/Projects/ProjectsList',
  component: ProjectsList,
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
Projects List component displays a filterable, searchable, and sortable list of portfolio projects.

## Features
- Search projects by title, description, or technologies
- Filter by category using tabs
- Filter by technology tags
- Sort by recent, popular (GitHub stars), or alphabetically
- Responsive grid layout (1/2/3 columns)
- Loading skeletons while data loads
- Empty state when no projects match filters
- Click to navigate to project detail page

## Data Management
- Uses ProjectStore for state management
- Supports debounced search
- Reactive filtering and sorting
- Category-based filtering
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ProjectsList>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default projects list with all projects loaded.',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Projects list in loading state with skeleton loaders.',
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
        <app-projects-list />
      </div>
    `,
  }),
};

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Projects list with search functionality. Try searching for "Angular" or "TypeScript".',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          The search input filters projects by title, description, and technologies.
          Search is debounced by 300ms for better performance.
        </p>
        <app-projects-list />
      </div>
    `,
  }),
};

export const CategoryFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Projects list with category tabs for filtering. Click tabs to filter by category.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          Category tabs are dynamically generated from available project categories.
          The "All" tab shows all projects.
        </p>
        <app-projects-list />
      </div>
    `,
  }),
};

export const TechnologyFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click technology badges on project cards to filter by that technology.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          Click any technology badge to filter projects. Multiple tags can be selected.
          Selected tags are highlighted across all project cards.
        </p>
        <app-projects-list />
      </div>
    `,
  }),
};

export const Sorting: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Projects can be sorted by recent, popular (GitHub stars), or alphabetically.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          Use the sort dropdown to change project order. Options: Most Recent, Most Popular, A-Z.
        </p>
        <app-projects-list />
      </div>
    `,
  }),
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty state shown when no projects match the current filters.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #64748b;">
          To see the empty state, search for something that doesn't exist or
          apply filters that exclude all projects.
        </p>
        <app-projects-list />
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
        story: 'Projects list adapts to different screen sizes with responsive grid columns.',
      },
    },
  },
  render: () => ({
    template: `
      <div>
        <p style="padding: 1rem; color: #64748b; font-size: 0.875rem;">
          Resize the viewport to see the responsive grid:
          <br>• Mobile: 1 column
          <br>• Tablet: 2 columns
          <br>• Desktop: 3 columns
        </p>
        <app-projects-list />
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
          Apply some filters (search, category, or tags) to see the active filters indicator.
          The "Clear Filters" button appears when filters are active.
        </p>
        <app-projects-list />
      </div>
    `,
  }),
};

export const AllFeaturesCombined: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all features working together: search, category filter, tag filter, and sorting.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">Try These Workflows:</h3>
          <ol style="margin: 0; padding-left: 1.5rem; color: #64748b; font-size: 0.875rem; line-height: 1.6;">
            <li>Search for "Angular" to filter projects</li>
            <li>Select "Web Development" category</li>
            <li>Click a technology badge to filter by that tech</li>
            <li>Change sort order to "Most Popular"</li>
            <li>Click "Clear Filters" to reset</li>
          </ol>
        </div>
        <app-projects-list />
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
        <app-projects-list />
        <div style="height: 100vh; padding: 2rem; background: #f8fafc;">
          <p style="color: #64748b;">Scroll up to see sticky filters in action</p>
        </div>
      </div>
    `,
  }),
};
