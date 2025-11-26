import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {
      // Use Storybook's Angular builder options. `angularBuilderOptions` maps
      // to the Angular CLI build target defined in `angular.json`.
      angularBuilderOptions: {
        browserTarget: 'moodyjw-portfolio:build:development',
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
