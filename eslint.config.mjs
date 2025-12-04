// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [// Base ESLint recommended rules
eslint.configs.recommended, // TypeScript files
{
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.spec.json'],
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    '@angular-eslint': angular,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    // Import sorting: Angular, third-party, path-aliases, relative
    'simple-import-sort/imports': ['error', {
      groups: [
        // Side effect imports
        ['^\\u0000'],
        // Angular packages first
        ['^@angular(?=/|$)', '^@ng'],
        // Third party packages (no leading @ or .)
        ['^[^@./]'],
        // Aliased imports: @shared, @app, @core, then other @ aliases (excluding @angular and @ng)
        ['^@shared(/.*|$)', '^@app(/.*|$)', '^@core(/.*|$)', '^@(?!angular)(?!ng).+'],
        // Parent imports
          ['^[.]{2}(?!/?$)', '^[.]{2}/?$'],
        // Same-folder imports
          ['^[.]/(?=.*/)(?!/?$)', '^[.](?!/?$)'],
      ],
    }],
    // TypeScript core rules
    '@typescript-eslint/no-explicit-any': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Angular specific rules
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: 'app',
        style: 'camelCase',
      },
    ],
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: 'app',
        style: 'kebab-case',
      },
    ],
    '@angular-eslint/no-output-on-prefix': 'error',
    '@angular-eslint/use-lifecycle-interface': 'error',
    '@angular-eslint/use-pipe-transform-interface': 'error',
  },
}, // HTML template files
{
  files: ['**/*.html'],
  languageOptions: {
    parser: angularTemplateParser,
  },
  plugins: {
    '@angular-eslint/template': angularTemplate,
  },
  rules: {
    // Angular template recommended and accessibility rules (manually defined)
    '@angular-eslint/template/banana-in-box': 'error',
    '@angular-eslint/template/conditional-complexity': 'error',
    '@angular-eslint/template/cyclomatic-complexity': 'error',
    '@angular-eslint/template/eqeqeq': 'error',
    '@angular-eslint/template/no-any': 'error',
    '@angular-eslint/template/no-duplicate-attributes': 'error',
    '@angular-eslint/template/no-negated-async': 'error',

    // WCAG 2.1 AAA accessibility rules
    '@angular-eslint/template/alt-text': 'error',
    '@angular-eslint/template/elements-content': 'error',
    '@angular-eslint/template/label-has-associated-control': 'error',
    '@angular-eslint/template/table-scope': 'error',
    '@angular-eslint/template/valid-aria': 'error',
    '@angular-eslint/template/click-events-have-key-events': 'error',
    '@angular-eslint/template/mouse-events-have-key-events': 'error',
    '@angular-eslint/template/no-autofocus': 'error',
    '@angular-eslint/template/no-distracting-elements': 'error',
    '@angular-eslint/template/no-positive-tabindex': 'error',

    // Template best practices
    '@angular-eslint/template/use-track-by-function': 'error',
    '@angular-eslint/template/prefer-control-flow': 'error',
    '@angular-eslint/template/prefer-self-closing-tags': 'warn',
  },
}, // Test files with globals (excluding e2e)
{
  files: ['**/*.spec.ts', 'src/test-setup.ts'],
  languageOptions: {
    globals: {
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
      vi: 'readonly',
      jest: 'readonly',
      document: 'readonly',
      window: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
    },
  },
}, // Main.ts with console
{
  files: ['src/main.ts'],
  languageOptions: {
    globals: {
      console: 'readonly',
    },
  },
}, // Browser environment for components that need DOM access
{
  files: ['src/app/**/*.component.ts'],
  languageOptions: {
    globals: {
      document: 'readonly',
      window: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
    },
  },
}, // Ignore patterns
{
  ignores: [
    'dist/**',
    'node_modules/**',
    '.angular/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'docs/**',
    '.storybook/**',
    '.storybook-backup/**',
    'storybook-static/**',
    'vitest.config.ts',
    'playwright.config.ts',
    'e2e/**',
    'scripts/**',
  ],
}, ...storybook.configs["flat/recommended"]];
