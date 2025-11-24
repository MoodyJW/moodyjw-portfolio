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
  /** Case studies list page route */
  CASE_STUDIES: 'case-studies',
  /** Case study detail page route (use with :id parameter) */
  CASE_STUDY_DETAIL: 'case-studies/:id',
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
  CASE_STUDIES: '/case-studies',
} as const;

/**
 * Helper function to generate case study detail route
 * @param id - The case study ID
 * @returns The full route path for the case study detail
 *
 * @example
 * ```typescript
 * const route = getCaseStudyRoute('project-1');
 * // Returns: '/case-studies/project-1'
 * ```
 */
export function getCaseStudyRoute(id: string): string {
  return `/case-studies/${id}`;
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
    label: 'Case Studies',
    path: ROUTE_PATHS.CASE_STUDIES,
    ariaLabel: 'Navigate to case studies page',
  },
] as const;
