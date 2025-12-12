/**
 * Contact form model for user inquiries
 *
 * This interface represents the data structure for the contact form
 * on the Contact page. It includes validation requirements and metadata.
 *
 * @example
 * ```typescript
 * const formData: ContactForm = {
 *   name: 'John Doe',
 *   email: 'john.doe@example.com',
 *   subject: 'Project Inquiry',
 *   message: 'I would like to discuss a potential project...'
 * };
 * ```
 */
export interface ContactForm {
  /**
   * Sender's full name
   * Required, min length: 2, max length: 100
   */
  name: string;

  /**
   * Sender's email address
   * Required, must be valid email format
   */
  email: string;

  /**
   * Message subject or inquiry type
   * Required, min length: 5, max length: 200
   * @example 'Project Inquiry', 'General Question', 'Collaboration Opportunity'
   */
  subject: string;

  /**
   * Message content
   * Required, min length: 10, max length: 2000
   */
  message: string;

  /**
   * Phone number (optional)
   * Format: (123) 456-7890 or +1-123-456-7890
   */
  phone?: string;

  /**
   * Company or organization name (optional)
   */
  company?: string;

  /**
   * Preferred contact method (optional)
   */
  preferredContactMethod?: 'email' | 'phone';

  /**
   * Timestamp when the form was submitted (set automatically)
   */
  submittedAt?: string;

  /**
   * User's consent to privacy policy
   * Required for GDPR compliance
   */
  consentToPrivacyPolicy?: boolean;
}

/**
 * Contact form validation constraints
 *
 * These constants define the validation rules for the contact form.
 */
export const CONTACT_FORM_CONSTRAINTS = {
  name: {
    minLength: 2,
    maxLength: 100,
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  subject: {
    minLength: 5,
    maxLength: 200,
  },
  message: {
    minLength: 10,
    maxLength: 2000,
  },
  phone: {
    pattern: /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/,
  },
} as const;

/**
 * Contact form submission status
 *
 * Represents the state of a form submission for UI feedback.
 */
export interface ContactFormSubmission {
  /**
   * Submission status
   */
  status: 'idle' | 'submitting' | 'success' | 'error';

  /**
   * Success or error message to display to the user
   */
  message?: string;

  /**
   * Error details (for debugging, not shown to user)
   */
  error?: string;

  /**
   * Timestamp of the submission
   */
  timestamp?: string;
}

/**
 * Predefined subject options for the contact form
 *
 * These can be used in a dropdown to help users categorize their inquiry.
 */
export const CONTACT_SUBJECTS = [
  'Project Inquiry',
  'Collaboration Opportunity',
  'Freelance Work',
  'Speaking Engagement',
  'General Question',
  'Other',
] as const;

/**
 * Type-safe subject option
 */
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
