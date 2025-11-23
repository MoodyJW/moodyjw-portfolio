import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y', // Accessibility testing addon
    // Note: addon-essentials and addon-interactions are bundled with storybook package
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {},
};

export default config;
