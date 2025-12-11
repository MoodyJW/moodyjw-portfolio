/**
 * Route path constants for type-safe navigation
 * All application routes are defined here to avoid magic strings
 *
 * @example
 * ```typescript
 * // In components
 * routerLink="/{{ ROUTES.CASE_STUDIES }}"
 *
 * // In navigation
 * this.router.navigate([ROUTES.HOME]);
 * ```
 */
export const ROUTES = {
  /** Root path (empty string) */
  ROOT: '',
  /** Home page route */
  HOME: 'home',
  /** Projects list page route */
  PROJECTS: 'projects',
  /** Project detail page route (use with :slug parameter) */
  PROJECT_DETAIL: 'projects/:slug',
  /** Case studies list page route */
  CASE_STUDIES: 'case-studies',
  /** Case study detail page route (use with :slug parameter) */
  CASE_STUDY_DETAIL: 'case-studies/:slug',
  /** About page route */
  ABOUT: 'about',
  /** Contact page route */
  CONTACT: 'contact',
} as const;

/**
 * Full route paths including leading slash for routerLink
 * Use these for navigation links in templates
 *
 * @example
 * ```html
 * <a [routerLink]="ROUTE_PATHS.HOME">Home</a>
 * ```
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  HOME: '/home',
  PROJECTS: '/projects',
  CASE_STUDIES: '/case-studies',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

/**
 * Helper function to generate project detail route
 * @param slug - The project slug
 * @returns The full route path for the project detail
 *
 * @example
 * ```typescript
 * const route = getProjectRoute('e-commerce-platform');
 * // Returns: '/projects/e-commerce-platform'
 * ```
 */
export function getProjectRoute(slug: string): string {
  return `/projects/${slug}`;
}

/**
 * Helper function to generate case study detail route
 * @param slug - The case study slug
 * @returns The full route path for the case study detail
 *
 * @example
 * ```typescript
 * const route = getCaseStudyRoute('mobile-app-redesign');
 * // Returns: '/case-studies/mobile-app-redesign'
 * ```
 */
export function getCaseStudyRoute(slug: string): string {
  return `/case-studies/${slug}`;
}

/**
 * Navigation menu items configuration
 * Used for generating navigation menus consistently
 */
export const NAV_ITEMS = [
  {
    label: 'Home',
    path: ROUTE_PATHS.HOME,
    ariaLabel: 'Navigate to home page',
  },
  {
    label: 'Projects',
    path: ROUTE_PATHS.PROJECTS,
    ariaLabel: 'Navigate to projects page',
  },
  {
    label: 'Case Studies',
    path: ROUTE_PATHS.CASE_STUDIES,
    ariaLabel: 'Navigate to case studies page',
  },
  {
    label: 'About',
    path: ROUTE_PATHS.ABOUT,
    ariaLabel: 'Navigate to about page',
  },
  {
    label: 'Contact',
    path: ROUTE_PATHS.CONTACT,
    ariaLabel: 'Navigate to contact page',
  },
] as const;
