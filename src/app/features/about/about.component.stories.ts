import type { Meta, StoryObj } from '@storybook/angular';

import { AboutComponent } from './about.component';

const meta: Meta<AboutComponent> = {
  title: 'Features/About',
  component: AboutComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'About page component. Placeholder for Phase 4 Part 4 implementation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<AboutComponent>;

/**
 * Default placeholder state of the about page
 */
export const Default: Story = {};
