import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import { truncate, type TruncateOptions } from '@shared/utilities/string/string.utils';

/**
 * TruncatePipe
 *
 * Truncates text to a specified length and adds an ellipsis indicator.
 *
 * ## Features
 * - Pure pipe for performance (caches result for same input)
 * - Uses truncate utility for consistent formatting
 * - Customizable options (position, ellipsis, breakWords)
 * - Type-safe with strict TypeScript
 * - Handles null/undefined gracefully
 *
 * ## Usage
 *
 * ### Basic Usage
 * ```html
 * <p>{{ longText | truncate:50 }}</p>
 * <!-- Output: "This is a very long text that will be trunca..." -->
 * ```
 *
 * ### With Options
 * ```html
 * <p>{{ longText | truncate:30:{ position: 'middle' } }}</p>
 * <!-- Output: "This is a...text here" -->
 *
 * <p>{{ longText | truncate:50:{ ellipsis: '…' } }}</p>
 * <!-- Output: "This is a very long text that will be trunca…" -->
 *
 * <p>{{ longText | truncate:50:{ breakWords: false } }}</p>
 * <!-- Output: "This is a very long text that will..." (breaks at word boundary) -->
 * ```
 *
 * ### In Component
 * ```typescript
 * @Component({
 *   template: `
 *     <article *ngFor="let post of posts">
 *       <h2>{{ post.title }}</h2>
 *       <p>{{ post.content | truncate:150:{ wordAware: true } }}</p>
 *     </article>
 *   `,
 *   imports: [TruncatePipe, CommonModule]
 * })
 * export class BlogListComponent {
 *   posts = [
 *     { title: 'Post 1', content: 'Long content here...' },
 *     { title: 'Post 2', content: 'More long content...' },
 *   ];
 * }
 * ```
 *
 * ## Options
 *
 * - `length`: Maximum length before truncation (passed as first parameter to pipe)
 * - `position`: Where to truncate - 'end' (default), 'middle', or 'start'
 * - `ellipsis`: The ellipsis character(s) to use (default: '...')
 * - `breakWords`: Whether to break in the middle of words (default: false). Set to false to break at word boundaries.
 *
 * ## Examples
 *
 * ```html
 * <!-- Truncate at end (default) -->
 * <p>{{ description | truncate:100 }}</p>
 *
 * <!-- Truncate in middle  -->
 * <p>{{ filename | truncate:30:{ position: 'middle' } }}</p>
 *
 * <!-- Break at word boundaries -->
 * <p>{{ article | truncate:200:{ breakWords: false } }}</p>
 *
 * <!-- Custom ellipsis -->
 * <p>{{ text | truncate:50:{ ellipsis: '…' } }}</p>
 *
 * <!-- Combined options -->
 * <p>{{ content | truncate:150:{ position: 'end', ellipsis: '...', breakWords: false } }}</p>
 * ```
 *
 * ## Null/Undefined Handling
 *
 * Returns empty string for null/undefined:
 *
 * ```html
 * <p>{{ nullText | truncate:50 }}</p>
 * <!-- Output: "" -->
 * ```
 *
 * ## Short Text Handling
 *
 * Returns original text if already shorter than max length:
 *
 * ```html
 * <p>{{ 'Short text' | truncate:50 }}</p>
 * <!-- Output: "Short text" (no ellipsis added) -->
 * ```
 *
 * @see {@link truncate} for implementation details
 */
@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates text to a specified length with an ellipsis.
   *
   * @param value - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @param options - Optional configuration for truncation
   * @returns Truncated text or empty string for null/undefined
   *
   * @example
   * ```typescript
   * // In template
   * {{ text | truncate:50 }}
   * {{ text | truncate:30:{ position: 'middle' } }}
   * {{ text | truncate:100:{ breakWords: false, ellipsis: '…' } }}
   * ```
   */
  transform(
    value: string | null | undefined,
    maxLength: number,
    options?: Omit<TruncateOptions, 'length'>
  ): string {
    if (!value) {
      return '';
    }

    if (maxLength === undefined || maxLength === null) {
      return value;
    }

    return truncate(value, { ...options, length: maxLength });
  }
}
