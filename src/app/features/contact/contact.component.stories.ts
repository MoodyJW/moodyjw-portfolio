import type { Meta, StoryObj } from '@storybook/angular';

import { ContactComponent } from './contact.component';

const meta: Meta<ContactComponent> = {
  title: 'Features/Contact',
  component: ContactComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Contact page component. Placeholder for Phase 4 Part 4 implementation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ContactComponent>;

/**
 * Default placeholder state of the contact page
 */
export const Default: Story = {};
