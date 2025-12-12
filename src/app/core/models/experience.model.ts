/**
 * Experience model representing professional work experience
 *
 * Experience entries are displayed on the About page in a timeline format.
 * Each entry represents a role at a company with key achievements.
 *
 * @example
 * ```typescript
 * const experience: Experience = {
 *   company: 'Tech Corp',
 *   role: 'Senior Frontend Developer',
 *   duration: 'Jan 2020 - Present',
 *   startDate: '2020-01-01',
 *   current: true,
 *   description: 'Lead frontend development for enterprise applications...',
 *   technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
 *   achievements: [
 *     'Reduced bundle size by 40%',
 *     'Implemented design system used across 5 products',
 *     'Mentored 3 junior developers'
 *   ],
 *   logo: '/assets/images/companies/techcorp.png'
 * };
 * ```
 */
export interface Experience {
  /**
   * Company or organization name
   */
  company: string;

  /**
   * Job title or role
   * @example 'Senior Frontend Developer', 'Lead Software Engineer'
   */
  role: string;

  /**
   * Duration in human-readable format
   * @example 'Jan 2020 - Dec 2022', 'Mar 2023 - Present'
   */
  duration: string;

  /**
   * Start date (ISO 8601 format) for sorting
   */
  startDate: string;

  /**
   * End date (ISO 8601 format, optional if current role)
   */
  endDate?: string;

  /**
   * Whether this is the current role
   */
  current?: boolean;

  /**
   * Job description (supports markdown)
   */
  description: string;

  /**
   * Technologies and tools used in this role
   */
  technologies: string[];

  /**
   * Key achievements and contributions
   */
  achievements: string[];

  /**
   * Company logo URL (optional)
   */
  logo?: string;

  /**
   * Company website URL (optional)
   */
  website?: string;

  /**
   * Location (optional)
   * @example 'San Francisco, CA', 'Remote', 'New York, NY (Remote)'
   */
  location?: string;

  /**
   * Employment type (optional)
   * @example 'Full-time', 'Part-time', 'Contract', 'Freelance'
   */
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';

  /**
   * Highlights or notable projects (optional)
   */
  highlights?: Array<{
    /**
     * Highlight title
     */
    title: string;

    /**
     * Highlight description
     */
    description: string;

    /**
     * Link to project or case study (optional)
     */
    link?: string;
  }>;
}
