import type { Meta, StoryObj } from '@storybook/angular';

import { ButtonContentComponent } from './button-content.component';

const meta: Meta<ButtonContentComponent> = {
  title: 'Components/Button Content',
  component: ButtonContentComponent,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state (shows spinner)',
    },
    iconLeft: {
      control: 'text',
      description: 'Icon identifier for left position',
    },
    iconRight: {
      control: 'text',
      description: 'Icon identifier for right position',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether this is an icon-only button (hides text content)',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonContentComponent>;

export const Default: Story = {
  args: {
    loading: false,
    iconLeft: undefined,
    iconRight: undefined,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--primary btn--md">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Click me
        </app-button-content>
      </div>
    `,
  }),
};

export const WithLeftIcon: Story = {
  args: {
    loading: false,
    iconLeft: '←',
    iconRight: undefined,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--primary btn--md">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Back
        </app-button-content>
      </div>
    `,
  }),
};

export const WithRightIcon: Story = {
  args: {
    loading: false,
    iconLeft: undefined,
    iconRight: '→',
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--secondary btn--md">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Next
        </app-button-content>
      </div>
    `,
  }),
};

export const WithBothIcons: Story = {
  args: {
    loading: false,
    iconLeft: '←',
    iconRight: '→',
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--tertiary btn--md">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Navigate
        </app-button-content>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  args: {
    loading: false,
    iconLeft: '×',
    iconRight: undefined,
    iconOnly: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--ghost btn--md btn--icon-only">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Close
        </app-button-content>
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
    iconLeft: undefined,
    iconRight: undefined,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--primary btn--md btn--loading">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Saving...
        </app-button-content>
      </div>
    `,
  }),
};

export const LoadingWithIcons: Story = {
  args: {
    loading: true,
    iconLeft: '←',
    iconRight: '→',
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--secondary btn--md btn--loading">
        <app-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Loading...
        </app-button-content>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div class="btn btn--primary btn--sm">
          <app-button-content [iconLeft]="'⭐'">
            Small
          </app-button-content>
        </div>
        <div class="btn btn--primary btn--md">
          <app-button-content [iconLeft]="'⭐'">
            Medium
          </app-button-content>
        </div>
        <div class="btn btn--primary btn--lg">
          <app-button-content [iconLeft]="'⭐'">
            Large
          </app-button-content>
        </div>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-direction: column;">
        <div class="btn btn--primary btn--md">
          <app-button-content [iconLeft]="'✓'">
            Primary
          </app-button-content>
        </div>
        <div class="btn btn--secondary btn--md">
          <app-button-content [iconLeft]="'✓'">
            Secondary
          </app-button-content>
        </div>
        <div class="btn btn--tertiary btn--md">
          <app-button-content [iconLeft]="'✓'">
            Tertiary
          </app-button-content>
        </div>
        <div class="btn btn--ghost btn--md">
          <app-button-content [iconLeft]="'✓'">
            Ghost
          </app-button-content>
        </div>
        <div class="btn btn--danger btn--md">
          <app-button-content [iconLeft]="'⚠'">
            Danger
          </app-button-content>
        </div>
      </div>
    `,
  }),
};
