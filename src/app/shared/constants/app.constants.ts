/**
 * General application constants
 * Regex patterns, limits, common values, and other app-wide constants
 */

/**
 * Regular expression patterns for validation
 */
export const REGEX_PATTERNS = {
  /** Email validation pattern */
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  /** URL validation pattern */
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  /** Phone number validation (flexible format) */
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  /** GitHub username pattern */
  GITHUB_USERNAME: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
  /** Hex color code pattern */
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  /** Alphanumeric with spaces */
  ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/,
  /** Slug pattern (URL-friendly) */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * Input length limits
 */
export const INPUT_LIMITS = {
  /** Minimum password length */
  PASSWORD_MIN: 8,
  /** Maximum password length */
  PASSWORD_MAX: 128,
  /** Maximum username length */
  USERNAME_MAX: 50,
  /** Maximum email length */
  EMAIL_MAX: 254,
  /** Maximum text input length */
  TEXT_MAX: 255,
  /** Maximum textarea length */
  TEXTAREA_MAX: 5000,
  /** Maximum search query length */
  SEARCH_QUERY_MAX: 100,
  /** Maximum file size in bytes (5MB) */
  FILE_SIZE_MAX: 5 * 1024 * 1024,
} as const;

/**
 * Date and time formats
 */
export const DATE_FORMATS = {
  /** Short date format (MM/DD/YYYY) */
  SHORT_DATE: 'MM/dd/yyyy',
  /** Long date format (Month DD, YYYY) */
  LONG_DATE: 'MMMM dd, yyyy',
  /** ISO date format (YYYY-MM-DD) */
  ISO_DATE: 'yyyy-MM-dd',
  /** Time format (HH:MM AM/PM) */
  TIME: 'hh:mm a',
  /** Date and time format */
  DATE_TIME: 'MM/dd/yyyy hh:mm a',
  /** Relative time threshold (24 hours in ms) */
  RELATIVE_TIME_THRESHOLD: 24 * 60 * 60 * 1000,
} as const;

/**
 * HTTP status codes for common scenarios
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Toast notification durations (milliseconds)
 */
export const TOAST_DURATIONS = {
  /** Short duration for simple messages */
  SHORT: 3000,
  /** Normal duration for standard messages */
  NORMAL: 5000,
  /** Long duration for important messages */
  LONG: 8000,
  /** Persistent (manual dismiss only) */
  PERSISTENT: 0,
} as const;

/**
 * Toast notification types
 */
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

/**
 * Keyboard key codes for accessibility
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * ARIA labels for common actions (used when visual text is not available)
 */
export const ARIA_LABELS = {
  CLOSE: 'Close',
  OPEN: 'Open',
  MENU: 'Menu',
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT: 'Sort',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  LOADING: 'Loading',
  ERROR: 'Error',
  SUCCESS: 'Success',
  WARNING: 'Warning',
  INFO: 'Information',
} as const;

/**
 * Content labels for UI elements
 */
export const LABELS = {
  /** Empty state messages */
  EMPTY_STATES: {
    NO_RESULTS: 'No results found',
    NO_DATA: 'No data available',
    NO_PROJECTS: 'No case studies available yet.',
    NO_SEARCH_RESULTS: 'No projects match your search.',
  },
  /** Loading messages */
  LOADING: {
    DEFAULT: 'Loading...',
    PROJECTS: 'Loading projects...',
    DATA: 'Loading data...',
  },
  /** Error messages */
  ERRORS: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
  /** Success messages */
  SUCCESS: {
    SAVED: 'Successfully saved!',
    UPDATED: 'Successfully updated!',
    DELETED: 'Successfully deleted!',
  },
  /** Common button labels */
  BUTTONS: {
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    SAVE: 'Save',
    DELETE: 'Delete',
    EDIT: 'Edit',
    CLOSE: 'Close',
    CONFIRM: 'Confirm',
    BACK: 'Back',
    NEXT: 'Next',
    VIEW_MORE: 'View More',
    LEARN_MORE: 'Learn More',
  },
} as const;

/**
 * Supported languages for i18n
 */
export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
} as const;

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = LANGUAGES.ENGLISH;

/**
 * Supported themes
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

/**
 * Default theme
 */
export const DEFAULT_THEME = THEMES.AUTO;

/**
 * Image file types allowed for upload
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
] as const;

/**
 * Document file types allowed for upload
 */
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/**
 * Copyright year (dynamically calculated)
 */
export const COPYRIGHT_YEAR = new Date().getFullYear();

/**
 * Application version (should match package.json)
 */
export const APP_VERSION = '0.0.0';

/**
 * Application name
 */
export const APP_NAME = 'MoodyJW Portfolio';
