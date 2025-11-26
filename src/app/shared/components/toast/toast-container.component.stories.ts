import type { Meta, StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from '../../services/toast.service';
import { moduleMetadata } from '@storybook/angular';

/**
 * Storybook stories for the ToastContainerComponent.
 *
 * Demonstrates the container which renders active toast notifications.
 * This component is typically added once in the app shell (e.g. MainLayout).
 */
const meta: Meta<ToastContainerComponent> = {
  title: 'Shared/Toast/ToastContainer',
  component: ToastContainerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [ToastService, provideAnimations()],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Container component that renders toast notifications at predefined positions. Place a single instance in your application root to enable toasts globally.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<ToastContainerComponent>;

export const Default: Story = {
  render: () => ({
    template: `<app-toast-container></app-toast-container>`,
  }),
  parameters: {
    docs: {
      story:
        'Renders the toast container. Use `ToastService` to trigger toasts in this demo environment.',
    },
  },
};
