import type { Environment } from './environment.type';

/**
 * Development environment configuration
 * Used for local development with `ng serve`
 *
 * This configuration enables debugging features and uses localhost URLs
 */
export const environment: Environment = {
  /** Environment name for logging and debugging */
  name: 'development',

  /** Whether this is a production build */
  production: false,

  /** Base URL for the application (localhost) */
  baseUrl: 'http://localhost:4200',

  /** API endpoints configuration */
  api: {
    /** Mock data base URL (relative to local server) */
    mockDataUrl: '/assets/data',
    /** GitHub API URL (for Phase 4 integration) */
    githubApiUrl: 'https://api.github.com',
    /** GitHub GraphQL URL (for Phase 4 integration) */
    githubGraphqlUrl: 'https://api.github.com/graphql',
  },

  /** Feature flags */
  features: {
    /** Enable GitHub integration (Phase 4) */
    enableGitHubIntegration: false,
    /** Enable analytics tracking (disabled in development) */
    enableAnalytics: false,
    /** Enable service worker (PWA) - disabled in dev for hot reload */
    enableServiceWorker: false,
    /** Enable debug logging */
    enableLogging: true,
    /** Enable network latency simulation for realistic development */
    enableLatencySimulation: true,
  },

  /** Analytics configuration */
  analytics: {
    /** Google Analytics tracking ID (not used in development) */
    trackingId: '',
    /** Disable tracking in development */
    enabled: false,
  },

  /** Performance monitoring */
  performance: {
    /** Enable performance monitoring in development */
    enabled: true,
    /** Sample rate (1.0 = 100% in development for full visibility) */
    sampleRate: 1.0,
  },

  /** GitHub integration settings (Phase 4) */
  github: {
    /** GitHub username */
    username: 'MoodyJW',
    /** GitHub API token (load from local environment variable) */
    apiToken: '',
    /** Cache duration for GitHub data (shorter in development) */
    cacheDuration: 5 * 60 * 1000, // 5 minutes
  },

  /** Build information */
  build: {
    /** Build timestamp */
    timestamp: new Date().toISOString(),
    /** Build version (from package.json) */
    version: '0.2.0-dev',
  },
};
