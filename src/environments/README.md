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

```typescript
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.api.mockDataUrl;

  constructor() {
    if (environment.features.enableLogging) {
      console.log('API Service initialized with URL:', this.apiUrl);
    }
  }
}
```

### Path Alias

The `@environments` path alias is configured in `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

## Build Configurations

The Angular CLI uses different environment files based on the build configuration:

### Development Build
```bash
ng serve
# Uses: environment.development.ts
```

### Production Build
```bash
ng build
# or
npm run build
# Uses: environment.ts
```

## Environment Properties

### Core Properties

- **`name`** - Environment name for identification
- **`production`** - Boolean indicating production mode
- **`baseUrl`** - Base URL for the application

### API Configuration (`api`)

- **`mockDataUrl`** - Base path for mock JSON data files
- **`githubApiUrl`** - GitHub REST API endpoint
- **`githubGraphqlUrl`** - GitHub GraphQL API endpoint

### Feature Flags (`features`)

Control which features are enabled in each environment:

- **`enableGitHubIntegration`** - Phase 4 GitHub API integration
- **`enableAnalytics`** - Google Analytics tracking
- **`enableServiceWorker`** - PWA functionality
- **`enableLogging`** - Console logging for debugging
- **`enableLatencySimulation`** - Network latency simulation (dev only)

### Analytics Configuration (`analytics`)

- **`trackingId`** - Google Analytics tracking ID
- **`enabled`** - Whether analytics is active

### Performance Monitoring (`performance`)

- **`enabled`** - Whether performance monitoring is active
- **`sampleRate`** - Percentage of sessions to monitor (0.0 to 1.0)

### GitHub Settings (`github`)

- **`username`** - GitHub username for API calls
- **`apiToken`** - GitHub personal access token (injected at runtime)
- **`cacheDuration`** - How long to cache GitHub API responses

### Build Information (`build`)

- **`timestamp`** - When the build was created
- **`version`** - Application version from package.json

## GitHub Pages Deployment

For GitHub Pages deployment, the production environment includes:

- **Base URL**: `https://MoodyJW.github.io/moodyjw-portfolio`
- **Mock Data URL**: `/moodyjw-portfolio/assets/data` (includes repo name in path)

The `angular.json` file must be configured with `baseHref` for GitHub Pages:

```json
{
  "configurations": {
    "production": {
      "baseHref": "/moodyjw-portfolio/"
    }
  }
}
```

## Security Considerations

### API Tokens

**NEVER commit API tokens to version control!**

For GitHub integration (Phase 4), API tokens should be:

1. **Development**: Loaded from local environment variables
2. **Production**: Injected at runtime or stored in GitHub Secrets

Example for loading tokens:

```typescript
// In a service
const token = environment.github.apiToken || this.getTokenFromRuntime();
```

### Environment Variables

For sensitive values, use environment variables:

```bash
# .env.local (not committed)
GITHUB_TOKEN=ghp_your_token_here
```

Then access them in Angular using a custom script or build-time replacement.

## Adding New Environments

To add a new environment (e.g., staging):

1. Create `environment.staging.ts`:
```typescript
import type { Environment } from './environment';

export const environment: Environment = {
  // ... configuration
};
```

2. Update `angular.json`:
```json
{
  "configurations": {
    "staging": {
      "fileReplacements": [{
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }]
    }
  }
}
```

3. Build with the configuration:
```bash
ng build --configuration=staging
```

## Type Safety

All environment files implement the `Environment` type for consistency:

```typescript
import type { Environment } from './environment';

export const environment: Environment = {
  // TypeScript ensures all required properties are present
};
```

This prevents configuration mismatches between environments.

## Best Practices

1. **Keep environments in sync** - All environments should have the same structure
2. **Use feature flags** - Control functionality with boolean flags, not missing properties
3. **Document changes** - Update this README when adding new configuration
4. **Don't commit secrets** - Use environment variables or runtime injection
5. **Test both environments** - Ensure the app works in dev and production modes

## Related Documentation

- **Angular Environments**: https://angular.dev/tools/cli/environments
- **GitHub Pages**: https://docs.github.com/en/pages
- **Build Configurations**: See `angular.json` for all available configurations
