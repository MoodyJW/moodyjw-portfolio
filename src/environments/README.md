# Environment Configuration

This directory contains environment-specific configuration files for the application. Angular uses these files to provide different settings for development and production builds.

## Files

### `environment.ts` (Production)

Production configuration used for GitHub Pages deployment. This is the default configuration used when building with `ng build` or `npm run build`.

**Key Features:**

- Production mode enabled
- Analytics enabled
- Service Worker (PWA) enabled
- Debug logging disabled
- Network latency simulation disabled
- GitHub Pages base URL configured

### `environment.development.ts` (Development)

Development configuration used for local development with `ng serve`.

**Key Features:**

- Production mode disabled
- Analytics disabled
- Service Worker disabled (for hot reload)
- Debug logging enabled
- Network latency simulation enabled (for realistic UX testing)
- Localhost URLs

## Usage

### In Components/Services

Import the environment configuration:

# Environments (brief)

This folder holds environment configuration used by the Angular CLI for builds.

Purpose

- Provide typed configuration objects for `development` and `production` builds.
- Configure base URLs, feature flags, and build-time options used across the app.

Quick usage

```ts
import { environment } from '@environments/environment';
console.log(environment.name, environment.production);
```

Build variants

- Local dev: `ng serve` (uses `environment.development.ts`)
- Production build: `ng build` (uses `environment.ts`)

Notes

- Environment files implement the `Environment` type for safety. See `src/environments/environment.type.ts`.
- Production settings are tuned for GitHub Pages (baseHref and asset paths). Do not commit secrets into these files.

If you need more detail, see the root `README.md` and `src/environments/environment.*` files.
