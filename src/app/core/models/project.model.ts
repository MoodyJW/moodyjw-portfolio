/**
 * Project model representing a portfolio project
 *
 * Projects are displayed on the projects list page and project detail pages.
 * Each project can be marked as featured to appear on the home page.
 *
 * @example
 * ```typescript
 * const project: Project = {
 *   id: '1',
 *   slug: 'e-commerce-platform',
 *   title: 'E-Commerce Platform',
 *   description: 'A full-stack e-commerce solution...',
 *   shortDescription: 'Modern e-commerce platform',
 *   technologies: ['Angular', 'Node.js', 'PostgreSQL'],
 *   category: 'Web App',
 *   featured: true,
 *   images: {
 *     thumbnail: '/assets/images/projects/ecommerce-thumb.jpg',
 *     hero: '/assets/images/projects/ecommerce-hero.jpg',
 *     gallery: ['/assets/images/projects/ecommerce-1.jpg']
 *   },
 *   links: {
 *     live: 'https://example.com',
 *     github: 'https://github.com/user/repo'
 *   },
 *   createdDate: '2024-01-15',
 *   updatedDate: '2024-03-20',
 *   githubStars: 42
 * };
 * ```
 */
export interface Project {
  /**
   * Unique identifier for the project
   */
  id: string;

  /**
   * URL-friendly slug for routing (e.g., 'e-commerce-platform')
   */
  slug: string;

  /**
   * Display title of the project
   */
  title: string;

  /**
   * Detailed description of the project (supports markdown)
   */
  description: string;

  /**
   * Short description for cards and previews (1-2 sentences)
   */
  shortDescription: string;

  /**
   * Technology stack used in the project
   */
  technologies: string[];

  /**
   * Project category for filtering
   * @example 'Web App', 'Mobile App', 'Library', 'Tool', 'Demo'
   */
  category: string;

  /**
   * Whether this project should be featured on the home page
   */
  featured: boolean;

  /**
   * Project images for different contexts
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
     * Gallery images for detail page
     */
    gallery: string[];
  };

  /**
   * Project links
   */
  links: {
    /**
     * Live demo URL (optional)
     */
    live?: string;

    /**
     * GitHub repository URL (optional)
     */
    github?: string;

    /**
     * Other relevant links (docs, blog post, etc.)
     */
    other?: Record<string, string>;
  };

  /**
   * Date the project was created (ISO 8601 format)
   */
  createdDate: string;

  /**
   * Date the project was last updated (ISO 8601 format, optional)
   */
  updatedDate?: string;

  /**
   * GitHub stars count (optional, for popular open-source projects)
   */
  githubStars?: number;

  /**
   * Additional metadata (optional)
   */
  metadata?: {
    /**
     * Team size (e.g., 'Solo', '2-3', '4+')
     */
    teamSize?: string;

    /**
     * Project duration (e.g., '3 months', '1 year')
     */
    duration?: string;

    /**
     * Current status (e.g., 'Active', 'Completed', 'Archived')
     */
    status?: 'Active' | 'Completed' | 'Archived';
  };
}
