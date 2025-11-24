/**
 * Production environment configuration
 * Used for GitHub Pages deployment
 *
 * This configuration is applied when building with `--configuration production`
 * GitHub Pages serves from: https://MoodyJW.github.io/moodyjw-portfolio/
 */

/** Type definition for environment configuration */
export type Environment = {
  name: string;
  production: boolean;
  baseUrl: string;
  api: {
    mockDataUrl: string;
    githubApiUrl: string;
    githubGraphqlUrl: string;
  };
  features: {
    enableGitHubIntegration: boolean;
    enableAnalytics: boolean;
    enableServiceWorker: boolean;
    enableLogging: boolean;
    enableLatencySimulation: boolean;
  };
  analytics: {
    trackingId: string;
    enabled: boolean;
  };
  performance: {
    enabled: boolean;
    sampleRate: number;
  };
  github: {
    username: string;
    apiToken: string;
    cacheDuration: number;
  };
  build: {
    timestamp: string;
    version: string;
  };
};

export const environment: Environment = {
  /** Environment name for logging and debugging */
  name: 'production',

  /** Whether this is a production build */
  production: true,

  /** Base URL for the application (GitHub Pages deployment) */
  baseUrl: 'https://MoodyJW.github.io/moodyjw-portfolio',

  /** API endpoints configuration */
  api: {
    /** Mock data base URL (relative to deployment) */
    mockDataUrl: '/moodyjw-portfolio/assets/data',
    /** GitHub API URL (for Phase 4 integration) */
    githubApiUrl: 'https://api.github.com',
    /** GitHub GraphQL URL (for Phase 4 integration) */
    githubGraphqlUrl: 'https://api.github.com/graphql',
  },

  /** Feature flags */
  features: {
    /** Enable GitHub integration (Phase 4) */
    enableGitHubIntegration: false,
    /** Enable analytics tracking */
    enableAnalytics: true,
    /** Enable service worker (PWA) */
    enableServiceWorker: true,
    /** Enable debug logging */
    enableLogging: false,
    /** Enable network latency simulation */
    enableLatencySimulation: false,
  },

  /** Analytics configuration */
  analytics: {
    /** Google Analytics tracking ID (update with your actual ID) */
    trackingId: 'G-XXXXXXXXXX',
    /** Enable tracking in production */
    enabled: true,
  },

  /** Performance monitoring */
  performance: {
    /** Enable performance monitoring */
    enabled: true,
    /** Sample rate (0.0 to 1.0) */
    sampleRate: 0.1,
  },

  /** GitHub integration settings (Phase 4) */
  github: {
    /** GitHub username */
    username: 'MoodyJW',
    /** GitHub API token (should be injected at runtime, not committed) */
    apiToken: '',
    /** Cache duration for GitHub data (milliseconds) */
    cacheDuration: 30 * 60 * 1000, // 30 minutes
  },

  /** Build information */
  build: {
    /** Build timestamp (will be replaced during build) */
    timestamp: new Date().toISOString(),
    /** Build version (from package.json) */
    version: '0.1.0',
  },
};
