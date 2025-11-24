/**
 * API endpoint constants for data fetching
 * All API URLs and GraphQL queries are centralized here
 */

/**
 * Base API configuration
 */
export const API_CONFIG = {
  /** Base URL for local mock data (Mockend pattern) */
  MOCK_DATA_BASE: '/assets/data',
  /** Base URL for i18n translations */
  I18N_BASE: '/assets/i18n',
  /** GitHub GraphQL API endpoint (for future GitHub integration) */
  GITHUB_GRAPHQL: 'https://api.github.com/graphql',
  /** GitHub REST API endpoint (for future GitHub integration) */
  GITHUB_REST: 'https://api.github.com',
} as const;

/**
 * Mock data endpoints (Mockend pattern)
 * Used for fetching local JSON files during development
 */
export const MOCK_ENDPOINTS = {
  /** Projects/case studies data */
  PROJECTS: `${API_CONFIG.MOCK_DATA_BASE}/projects.json`,
  /** Blog posts data (placeholder for future) */
  BLOG_POSTS: `${API_CONFIG.MOCK_DATA_BASE}/blog-posts.json`,
  /** Skills/technologies data (placeholder for future) */
  SKILLS: `${API_CONFIG.MOCK_DATA_BASE}/skills.json`,
} as const;

/**
 * GitHub API endpoints (placeholders for Phase 4)
 * Will be used for fetching real-time GitHub data
 */
export const GITHUB_ENDPOINTS = {
  /** User profile endpoint */
  USER_PROFILE: (username: string) => `${API_CONFIG.GITHUB_REST}/users/${username}`,
  /** User repositories endpoint */
  USER_REPOS: (username: string) => `${API_CONFIG.GITHUB_REST}/users/${username}/repos`,
  /** Repository details endpoint */
  REPO_DETAILS: (owner: string, repo: string) => `${API_CONFIG.GITHUB_REST}/repos/${owner}/${repo}`,
} as const;

/**
 * GitHub GraphQL queries (placeholders for Phase 4)
 * Used for fetching contribution data and statistics
 */
export const GITHUB_GRAPHQL_QUERIES = {
  /** Query for user contribution calendar */
  CONTRIBUTION_CALENDAR: `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `,
  /** Query for repository statistics */
  REPOSITORY_STATS: `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        stargazerCount
        forkCount
        issues {
          totalCount
        }
        pullRequests {
          totalCount
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  `,
} as const;

/**
 * HTTP headers configuration
 */
export const HTTP_HEADERS = {
  /** Content type for JSON */
  CONTENT_TYPE_JSON: { 'Content-Type': 'application/json' },
  /** GitHub API authorization header (use with token) */
  GITHUB_AUTH: (token: string) => ({ Authorization: `Bearer ${token}` }),
} as const;

/**
 * API timeout configurations (milliseconds)
 */
export const API_TIMEOUTS = {
  /** Default timeout for API requests */
  DEFAULT: 30000, // 30 seconds
  /** Timeout for file uploads */
  UPLOAD: 60000, // 60 seconds
  /** Timeout for large data fetches */
  LARGE_FETCH: 45000, // 45 seconds
} as const;

/**
 * API retry configuration
 */
export const API_RETRY = {
  /** Maximum number of retry attempts */
  MAX_ATTEMPTS: 3,
  /** Delay between retries (milliseconds) */
  RETRY_DELAY: 1000,
  /** HTTP status codes that should trigger a retry */
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
} as const;
