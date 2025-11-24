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
