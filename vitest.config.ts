import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        'src/main.ts',
        'src/environments/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  plugins: [
    ((): Plugin => {
      return {
        name: 'ng-control-flow-preprocess',
        enforce: 'pre',
        transform(code: string, id: string) {
          // Only run for spec/test TypeScript files
          if (!/\.spec\.ts$/.test(id) && !/\.test\.ts$/.test(id)) return null;

          // Replace @for="..." / @for='...' / @for=`...` with *ngFor="..."
          const forRe = /@for\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
          // Replace @if="..." / @if='...' / @if=`...` with *ngIf="..."
          const ifRe = /@if\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;

          const transformed = code
            .replace(forRe, (_m, a, b, c) => `*ngFor="${a || b || c}"`)
            .replace(ifRe, (_m, a, b, c) => `*ngIf="${a || b || c}"`);

          if (transformed === code) return null;
          return { code: transformed, map: null };
        },
      };
    })(),
  ],
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/app/core', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/app/shared', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/app/features', import.meta.url)),
    },
  },
});
