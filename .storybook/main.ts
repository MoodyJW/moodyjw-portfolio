import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {
      builder: {
        buildOptimizer: false,
        aot: false,
      },
    },
  },
  docs: {},
  typescript: {
    check: false,
  },
  core: {
    builder: '@storybook/builder-webpack5',
  },
};

export default config;
