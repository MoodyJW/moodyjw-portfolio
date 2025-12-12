/**
 * Skill model representing a technical or professional skill
 *
 * Skills are displayed on the About page and can be grouped by category.
 * Proficiency levels help visualize expertise.
 *
 * @example
 * ```typescript
 * const skill: Skill = {
 *   name: 'Angular',
 *   proficiency: 'Expert',
 *   category: 'Frontend',
 *   yearsOfExperience: 5,
 *   icon: 'angular'
 * };
 * ```
 */
export interface Skill {
  /**
   * Skill name
   * @example 'Angular', 'TypeScript', 'Node.js', 'Docker'
   */
  name: string;

  /**
   * Proficiency level
   */
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

  /**
   * Skill category for grouping
   * @example 'Frontend', 'Backend', 'DevOps', 'Database', 'Tools', 'Design'
   */
  category: string;

  /**
   * Years of experience with this skill
   */
  yearsOfExperience: number;

  /**
   * Icon name for visual representation (optional)
   * @example 'angular', 'typescript', 'nodejs'
   */
  icon?: string;

  /**
   * Proficiency percentage (0-100) for progress bars (optional)
   * Derived from proficiency level if not provided
   */
  proficiencyPercentage?: number;

  /**
   * Additional notes or highlights (optional)
   */
  notes?: string;
}

/**
 * Skill category grouping for organized display
 *
 * @example
 * ```typescript
 * const category: SkillCategory = {
 *   name: 'Frontend Development',
 *   description: 'UI/UX and client-side technologies',
 *   skills: [
 *     { name: 'Angular', proficiency: 'Expert', category: 'Frontend', yearsOfExperience: 5 },
 *     { name: 'TypeScript', proficiency: 'Expert', category: 'Frontend', yearsOfExperience: 5 }
 *   ],
 *   icon: 'code'
 * };
 * ```
 */
export interface SkillCategory {
  /**
   * Category name
   */
  name: string;

  /**
   * Category description (optional)
   */
  description?: string;

  /**
   * Skills in this category
   */
  skills: Skill[];

  /**
   * Icon for the category (optional)
   */
  icon?: string;

  /**
   * Display order (optional, lower numbers first)
   */
  order?: number;
}
