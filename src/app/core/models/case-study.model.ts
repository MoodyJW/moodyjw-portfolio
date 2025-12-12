/**
 * Case study model representing a detailed project case study
 *
 * Case studies provide in-depth analysis of real projects including
 * challenges, solutions, results, and lessons learned.
 *
 * @example
 * ```typescript
 * const caseStudy: CaseStudy = {
 *   id: '1',
 *   slug: 'mobile-app-redesign',
 *   title: 'Mobile App Redesign',
 *   description: 'Complete redesign of mobile banking app...',
 *   client: 'Tech Bank Inc.',
 *   role: 'Lead Frontend Developer',
 *   duration: '6 months',
 *   challenge: 'The existing app had poor UX...',
 *   solution: 'We redesigned the entire user flow...',
 *   results: {
 *     metrics: [
 *       { label: 'User Satisfaction', value: '+45%' },
 *       { label: 'Task Completion', value: '+60%' }
 *     ],
 *     impact: 'Significantly improved user engagement...'
 *   },
 *   technologies: ['Angular', 'Ionic', 'Firebase'],
 *   images: {
 *     thumbnail: '/assets/images/case-studies/bank-thumb.jpg',
 *     hero: '/assets/images/case-studies/bank-hero.jpg',
 *     gallery: ['/assets/images/case-studies/bank-1.jpg']
 *   },
 *   testimonial: {
 *     quote: 'Outstanding work...',
 *     author: 'John Doe',
 *     title: 'CTO, Tech Bank Inc.'
 *   }
 * };
 * ```
 */
export interface CaseStudy {
  /**
   * Unique identifier for the case study
   */
  id: string;

  /**
   * URL-friendly slug for routing (e.g., 'mobile-app-redesign')
   */
  slug: string;

  /**
   * Display title of the case study
   */
  title: string;

  /**
   * Detailed description/overview of the case study (supports markdown)
   */
  description: string;

  /**
   * Client or company name
   */
  client: string;

  /**
   * Your role in the project
   * @example 'Lead Developer', 'Frontend Engineer', 'Full-Stack Developer'
   */
  role: string;

  /**
   * Project duration
   * @example '3 months', '6 months', 'Q1 2024'
   */
  duration: string;

  /**
   * The problem or challenge to solve (supports markdown)
   */
  challenge: string;

  /**
   * The solution and approach taken (supports markdown)
   */
  solution: string;

  /**
   * Results and impact of the project
   */
  results: {
    /**
     * Measurable metrics showing success
     */
    metrics: Array<{
      /**
       * Metric label (e.g., 'User Satisfaction', 'Performance Improvement')
       */
      label: string;

      /**
       * Metric value (e.g., '+45%', '3x faster', '2M+ users')
       */
      value: string;

      /**
       * Optional icon name for the metric
       */
      icon?: string;
    }>;

    /**
     * Overall impact summary (supports markdown)
     */
    impact: string;
  };

  /**
   * Technology stack used in the project
   */
  technologies: string[];

  /**
   * Case study images
   */
  images: {
    /**
     * Thumbnail image for cards (recommended: 400x300)
     */
    thumbnail: string;

    /**
     * Hero image for detail page (recommended: 1200x600)
     */
    hero: string;

    /**
     * Gallery images showing different aspects of the project
     */
    gallery: string[];

    /**
     * Before/after comparison images (optional)
     */
    beforeAfter?: {
      before: string;
      after: string;
      caption?: string;
    }[];
  };

  /**
   * Client testimonial (optional)
   */
  testimonial?: {
    /**
     * Testimonial quote
     */
    quote: string;

    /**
     * Author name
     */
    author: string;

    /**
     * Author title/position
     */
    title: string;

    /**
     * Author avatar image URL (optional)
     */
    avatar?: string;
  };

  /**
   * Lessons learned section (optional, supports markdown)
   */
  lessonsLearned?: string;

  /**
   * Next steps or future plans (optional, supports markdown)
   */
  nextSteps?: string;

  /**
   * Date the case study was published (ISO 8601 format)
   */
  publishedDate: string;

  /**
   * Date the case study was last updated (ISO 8601 format, optional)
   */
  updatedDate?: string;

  /**
   * Tags for filtering and categorization
   */
  tags?: string[];
}
