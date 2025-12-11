import type { Meta, StoryObj } from '@storybook/angular';

import { ProjectsListComponent } from './projects-list.component';

const meta: Meta<ProjectsListComponent> = {
  title: 'Features/Projects/ProjectsList',
  component: ProjectsListComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Projects list page component. Placeholder for Phase 4 Part 2 implementation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ProjectsListComponent>;

/**
 * Default placeholder state of the projects list page
 */
export const Default: Story = {};
