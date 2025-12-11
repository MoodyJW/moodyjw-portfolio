import { ActivatedRoute } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';

import { ProjectDetailComponent } from './project-detail.component';

const meta: Meta<ProjectDetailComponent> = {
  title: 'Features/Projects/ProjectDetail',
  component: ProjectDetailComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Project detail page component. Placeholder for Phase 4 Part 3 implementation.',
      },
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'example-project',
              },
            },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProjectDetailComponent>;

/**
 * Default placeholder state of the project detail page
 */
export const Default: Story = {};
