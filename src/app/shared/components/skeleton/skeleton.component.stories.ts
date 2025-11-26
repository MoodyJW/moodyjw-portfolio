import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, applicationConfig } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  title: 'Shared/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
      description: 'Shape variant of the skeleton',
      table: {
        type: { summary: 'SkeletonVariant' },
        defaultValue: { summary: 'text' },
      },
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type',
      table: {
        type: { summary: 'SkeletonAnimation' },
        defaultValue: { summary: 'wave' },
      },
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton (CSS value)',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton (CSS value)',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    count: {
      control: 'number',
      description: 'Number of skeleton items to render',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    spacing: {
      control: 'number',
      description: 'Spacing between skeleton items in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the skeleton (required for accessibility)',
      table: {
        type: { summary: 'string' },
      },
    },
    rounded: {
      control: 'boolean',
      description: 'Whether rectangular skeleton has rounded corners',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<SkeletonComponent>;

/**
 * Default skeleton - single text line
 */
export const Default: Story = {
  args: {
    ariaLabel: 'Loading content',
  },
  render: (args) => ({
    props: args,
    template: `<app-skeleton ${argsToTemplate(args)} />`,
  }),
};

/**
 * Multiple text lines with default spacing
 */
export const MultipleLines: Story = {
  args: {
    ariaLabel: 'Loading text content',
    count: 5,
  },
  render: (args) => ({
    props: args,
    template: `<app-skeleton ${argsToTemplate(args)} />`,
  }),
};

/**
 * Multiple text lines with custom spacing
 */
export const CustomSpacing: Story = {
  args: {
    ariaLabel: 'Loading content',
    count: 4,
    spacing: 16,
  },
  render: (args) => ({
    props: args,
    template: `<app-skeleton ${argsToTemplate(args)} />`,
  }),
};

/**
 * All animation variants
 */
export const Animations: Story = {
  args: {
    ariaLabel: 'Loading',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0; color: var(--color-text);">Wave Animation (Default)</h4>
          <app-skeleton animation="wave" [count]="3" ariaLabel="Loading with wave animation" />
        </div>
        <div>
          <h4 style="margin: 0 0 0.5rem 0; color: var(--color-text);">Pulse Animation</h4>
          <app-skeleton animation="pulse" [count]="3" ariaLabel="Loading with pulse animation" />
        </div>
        <div>
          <h4 style="margin: 0 0 0.5rem 0; color: var(--color-text);">No Animation</h4>
          <app-skeleton animation="none" [count]="3" ariaLabel="Loading without animation" />
        </div>
      </div>
    `,
  }),
};

/**
 * Circular skeleton for avatars
 */
export const CircularAvatar: Story = {
  args: {
    variant: 'circular',
    width: '48px',
    ariaLabel: 'Loading avatar',
  },
  render: (args) => ({
    props: args,
    template: `<app-skeleton ${argsToTemplate(args)} />`,
  }),
};

/**
 * Different circular sizes
 */
export const CircularSizes: Story = {
  args: {
    ariaLabel: 'Loading',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <app-skeleton variant="circular" width="32px" ariaLabel="Small avatar" />
          <span style="font-size: 0.75rem; color: var(--color-text);">32px</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <app-skeleton variant="circular" width="48px" ariaLabel="Medium avatar" />
          <span style="font-size: 0.75rem; color: var(--color-text);">48px</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <app-skeleton variant="circular" width="64px" ariaLabel="Large avatar" />
          <span style="font-size: 0.75rem; color: var(--color-text);">64px</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <app-skeleton variant="circular" width="96px" ariaLabel="Extra large avatar" />
          <span style="font-size: 0.75rem; color: var(--color-text);">96px</span>
        </div>
      </div>
    `,
  }),
};

/**
 * Rectangular skeleton for images
 */
export const RectangularImage: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    height: '200px',
    ariaLabel: 'Loading image',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-skeleton ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Rectangular with rounded corners
 */
export const RectangularRounded: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    height: '150px',
    rounded: true,
    ariaLabel: 'Loading card',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 300px;">
        <app-skeleton ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Card skeleton with multiple elements
 */
export const CardSkeleton: Story = {
  args: {
    ariaLabel: 'Loading card',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px; padding: 1.5rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface);">
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <app-skeleton variant="circular" width="48px" ariaLabel="Loading avatar" />
          <div style="flex: 1;">
            <app-skeleton variant="text" width="60%" ariaLabel="Loading name" />
            <app-skeleton variant="text" width="40%" ariaLabel="Loading subtitle" />
          </div>
        </div>
        <app-skeleton variant="rectangular" width="100%" height="200px" [rounded]="true" ariaLabel="Loading image" />
        <div style="margin-top: 1rem;">
          <app-skeleton variant="text" [count]="3" ariaLabel="Loading description" />
        </div>
      </div>
    `,
  }),
};

/**
 * List skeleton with avatars
 */
export const ListSkeleton: Story = {
  args: {
    ariaLabel: 'Loading list',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        @for (item of [1, 2, 3, 4]; track item) {
          <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--color-border);">
            <app-skeleton variant="circular" width="40px" ariaLabel="Loading avatar" />
            <div style="flex: 1;">
              <app-skeleton variant="text" width="70%" ariaLabel="Loading title" />
              <app-skeleton variant="text" width="50%" ariaLabel="Loading subtitle" />
            </div>
          </div>
        }
      </div>
    `,
  }),
};

/**
 * Blog post skeleton
 */
export const BlogPostSkeleton: Story = {
  args: {
    ariaLabel: 'Loading blog post',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 700px;">
        <app-skeleton variant="text" width="80%" height="2rem" ariaLabel="Loading title" />
        <div style="display: flex; gap: 1rem; align-items: center; margin: 1rem 0;">
          <app-skeleton variant="circular" width="32px" ariaLabel="Loading author avatar" />
          <app-skeleton variant="text" width="30%" ariaLabel="Loading author" />
          <app-skeleton variant="text" width="20%" ariaLabel="Loading date" />
        </div>
        <app-skeleton variant="rectangular" width="100%" height="300px" [rounded]="true" ariaLabel="Loading featured image" />
        <div style="margin-top: 1.5rem;">
          <app-skeleton variant="text" [count]="8" [spacing]="12" ariaLabel="Loading content" />
        </div>
      </div>
    `,
  }),
};

/**
 * Table skeleton
 */
export const TableSkeleton: Story = {
  args: {
    ariaLabel: 'Loading table',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 800px;">
        <!-- Table header -->
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; padding: 0.75rem; border-bottom: 2px solid var(--color-border); background: var(--color-surface-variant);">
          <app-skeleton variant="text" width="60%" ariaLabel="Loading header" />
          <app-skeleton variant="text" width="50%" ariaLabel="Loading header" />
          <app-skeleton variant="text" width="50%" ariaLabel="Loading header" />
          <app-skeleton variant="text" width="50%" ariaLabel="Loading header" />
        </div>
        <!-- Table rows -->
        @for (row of [1, 2, 3, 4, 5]; track row) {
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--color-border);">
            <app-skeleton variant="text" ariaLabel="Loading cell" />
            <app-skeleton variant="text" ariaLabel="Loading cell" />
            <app-skeleton variant="text" ariaLabel="Loading cell" />
            <app-skeleton variant="text" ariaLabel="Loading cell" />
          </div>
        }
      </div>
    `,
  }),
};

/**
 * Dashboard skeleton
 */
export const DashboardSkeleton: Story = {
  args: {
    ariaLabel: 'Loading dashboard',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 1000px;">
        <!-- Stats cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          @for (card of [1, 2, 3, 4]; track card) {
            <div style="padding: 1.5rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface);">
              <app-skeleton variant="text" width="50%" ariaLabel="Loading stat label" />
              <app-skeleton variant="text" width="70%" height="2rem" ariaLabel="Loading stat value" />
            </div>
          }
        </div>
        <!-- Chart -->
        <div style="padding: 1.5rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface); margin-bottom: 2rem;">
          <app-skeleton variant="text" width="40%" ariaLabel="Loading chart title" />
          <app-skeleton variant="rectangular" width="100%" height="300px" [rounded]="true" ariaLabel="Loading chart" />
        </div>
        <!-- Recent activity -->
        <div style="padding: 1.5rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface);">
          <app-skeleton variant="text" width="40%" ariaLabel="Loading section title" />
          <div style="margin-top: 1rem;">
            @for (item of [1, 2, 3]; track item) {
              <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--color-border);">
                <app-skeleton variant="circular" width="32px" ariaLabel="Loading icon" />
                <div style="flex: 1;">
                  <app-skeleton variant="text" width="80%" ariaLabel="Loading activity" />
                  <app-skeleton variant="text" width="40%" ariaLabel="Loading timestamp" />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    `,
  }),
};

/**
 * Use case: Loading in a button
 */
export const InButton: Story = {
  args: {
    ariaLabel: 'Loading',
  },
  render: (args) => ({
    props: args,
    template: `
      <button style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-surface); color: var(--color-text); font-size: 1rem; cursor: wait;">
        <app-skeleton variant="text" width="80px" ariaLabel="Loading button text" />
      </button>
    `,
  }),
};

/**
 * Accessibility demonstration - with reduced motion
 */
export const ReducedMotion: Story = {
  args: {
    ariaLabel: 'Loading with reduced motion',
    count: 3,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem; background: var(--color-surface); border-radius: 8px;">
        <p style="margin: 0 0 1rem 0; color: var(--color-text); font-size: 0.875rem;">
          This skeleton respects the <code>prefers-reduced-motion</code> setting.
          When reduced motion is enabled, animations are disabled and a static loading state is shown.
        </p>
        <app-skeleton ${argsToTemplate(args)} />
      </div>
    `,
  }),
};
