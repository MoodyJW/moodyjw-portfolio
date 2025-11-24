/**
 * Application-wide configuration constants
 * These values control various application behaviors and settings
 */

/**
 * Network latency simulation configuration (for Mockend pattern)
 */
export const LATENCY_CONFIG = {
  /** Minimum simulated delay in milliseconds */
  MIN_DELAY: 500,
  /** Maximum simulated delay in milliseconds */
  MAX_DELAY: 1000,
  /** Whether latency simulation is enabled */
  ENABLED: true,
} as const;

/**
 * Cache configuration for API responses
 */
export const CACHE_CONFIG = {
  /** Default cache duration in milliseconds (1 hour) */
  DEFAULT_TTL: 60 * 60 * 1000,
  /** Cache duration for GitHub data (30 minutes) */
  GITHUB_DATA_TTL: 30 * 60 * 1000,
  /** Cache duration for static content (24 hours) */
  STATIC_CONTENT_TTL: 24 * 60 * 60 * 1000,
  /** Maximum cache size (number of entries) */
  MAX_SIZE: 100,
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
  /** Default page size for lists */
  DEFAULT_PAGE_SIZE: 12,
  /** Available page size options */
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
  /** Maximum items to load at once */
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Animation and transition durations (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  /** Fast animations (tooltips, dropdowns) */
  FAST: 150,
  /** Normal animations (modals, page transitions) */
  NORMAL: 300,
  /** Slow animations (complex transitions) */
  SLOW: 500,
  /** Extra slow animations (emphasis, attention-grabbing) */
  EXTRA_SLOW: 800,
} as const;

/**
 * Debounce delays for user input (milliseconds)
 */
export const DEBOUNCE_DELAYS = {
  /** Search input debounce */
  SEARCH: 300,
  /** Filter selection debounce */
  FILTER: 200,
  /** Window resize events */
  RESIZE: 150,
  /** Scroll events */
  SCROLL: 100,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  /** User theme preference (light/dark) */
  THEME: 'moodyjw-theme',
  /** User language preference */
  LANGUAGE: 'moodyjw-language',
  /** API cache prefix */
  CACHE_PREFIX: 'moodyjw-cache-',
  /** User preferences */
  USER_PREFERENCES: 'moodyjw-preferences',
} as const;

/**
 * Breakpoint values for responsive design (pixels)
 * These match the viewport sizes used in E2E visual regression tests
 */
export const BREAKPOINTS = {
  /** Mobile devices (375x667) */
  MOBILE: 375,
  /** Tablets (768x1024) */
  TABLET: 768,
  /** Laptops (1440x1024) */
  LAPTOP: 1440,
  /** Desktops (1920x1080) */
  DESKTOP: 1920,
} as const;

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  /** GitHub profile URL */
  GITHUB_PROFILE: 'https://github.com/MoodyJW',
  /** LinkedIn profile URL (placeholder) */
  LINKEDIN_PROFILE: 'https://linkedin.com/in/placeholder',
  /** Twitter/X profile URL (placeholder) */
  TWITTER_PROFILE: 'https://twitter.com/placeholder',
  /** Email contact (placeholder) */
  EMAIL: 'mailto:contact@placeholder.com',
} as const;

/**
 * SEO configuration
 */
export const SEO_CONFIG = {
  /** Default page title */
  DEFAULT_TITLE: 'MoodyJW | Lead Frontend Developer',
  /** Title separator */
  TITLE_SEPARATOR: ' | ',
  /** Site name */
  SITE_NAME: 'MoodyJW Portfolio',
  /** Default meta description */
  DEFAULT_DESCRIPTION:
    'Lead Frontend Developer portfolio showcasing modern Angular development with enterprise-grade architecture, scalable design systems, and high-performance UI patterns.',
  /** Default keywords */
  DEFAULT_KEYWORDS: [
    'Angular',
    'Frontend Developer',
    'TypeScript',
    'Web Development',
    'UI/UX',
    'Design Systems',
    'NgRx',
    'Signals',
  ],
  /** Open Graph image (placeholder) */
  OG_IMAGE: '/assets/images/og-image.png',
  /** Twitter card type */
  TWITTER_CARD: 'summary_large_image',
} as const;

/**
 * Performance budgets (matching Lighthouse CI configuration)
 */
export const PERFORMANCE_BUDGETS = {
  /** Performance score threshold */
  PERFORMANCE_SCORE: 95,
  /** Accessibility score threshold */
  ACCESSIBILITY_SCORE: 100,
  /** Best practices score threshold */
  BEST_PRACTICES_SCORE: 100,
  /** SEO score threshold */
  SEO_SCORE: 90,
  /** Core Web Vitals thresholds */
  CORE_WEB_VITALS: {
    /** First Contentful Paint (ms) */
    FCP: 1500,
    /** Largest Contentful Paint (ms) */
    LCP: 2500,
    /** Cumulative Layout Shift (score) */
    CLS: 0.1,
    /** Total Blocking Time (ms) */
    TBT: 300,
    /** Speed Index (ms) */
    SI: 3000,
  },
} as const;

/**
 * Feature flags for enabling/disabling features
 */
export const FEATURE_FLAGS = {
  /** Enable GitHub integration (Phase 4) */
  ENABLE_GITHUB_INTEGRATION: false,
  /** Enable dark mode toggle */
  ENABLE_DARK_MODE: true,
  /** Enable internationalization */
  ENABLE_I18N: true,
  /** Enable analytics tracking */
  ENABLE_ANALYTICS: false,
  /** Enable blog section */
  ENABLE_BLOG: false,
  /** Enable contact form */
  ENABLE_CONTACT_FORM: false,
} as const;
