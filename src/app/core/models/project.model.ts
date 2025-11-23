/**
 * Project model representing a case study or portfolio project
 */
export interface Project {
  /**
   * Unique identifier for the project
   */
  id: string;

  /**
   * Display title of the project
   */
  title: string;

  /**
   * Detailed description of the project
   */
  description: string;

  /**
   * Technology tags associated with the project
   */
  tags: string[];
}
