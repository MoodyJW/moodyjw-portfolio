import { ActivatedRoute } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';

import { CaseStudyDetailComponent } from './case-study-detail.component';

const meta: Meta<CaseStudyDetailComponent> = {
  title: 'Features/Case Studies/CaseStudyDetail',
  component: CaseStudyDetailComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Case study detail page component. Placeholder for Phase 4 Part 3 implementation.',
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
                get: () => 'example-case-study',
              },
            },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<CaseStudyDetailComponent>;

/**
 * Default placeholder state of the case study detail page
 */
export const Default: Story = {};
