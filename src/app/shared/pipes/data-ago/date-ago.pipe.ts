import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import { type RelativeTimeOptions, timeAgo } from '@shared/utilities/date/date.utils';

/**
 * DateAgoPipe
 *
 * Transforms a date into a relative time string (e.g., "2 hours ago", "3 days ago").
 *
 * ## Features
 * - Pure pipe for performance (caches result for same input)
 * - Uses timeAgo utility for consistent formatting
 * - Customizable options (includeSuffix, maxUnit, short)
 * - Type-safe with strict TypeScript
 * - Handles null/undefined gracefully
 *
 * ## Usage
 *
 * ### Basic Usage
 * ```html
 * <p>{{ publishedDate | dateAgo }}</p>
 * <!-- Output: "2 hours ago" -->
 * ```
 *
 * ### With Options
 * ```html
 * <p>{{ publishedDate | dateAgo:{ short: true } }}</p>
 * <!-- Output: "2h ago" -->
 *
 * <p>{{ publishedDate | dateAgo:{ includeSuffix: false } }}</p>
 * <!-- Output: "2 hours" -->
 *
 * <p>{{ publishedDate | dateAgo:{ maxUnit: 'day' } }}</p>
 * <!-- Output: "7 days ago" (won't show "1 week ago") -->
 * ```
 *
 * ### In Component
 * ```typescript
 * @Component({
 *   template: `
 *     <article>
 *       <h2>{{ article.title }}</h2>
 *       <time>{{ article.publishedAt | dateAgo }}</time>
 *     </article>
 *   `,
 *   imports: [DateAgoPipe]
 * })
 * export class ArticleComponent {
 *   article = {
 *     title: 'My Article',
 *     publishedAt: new Date('2025-12-07T10:00:00Z')
 *   };
 * }
 * ```
 *
 * ## Options
 *
 * - `includeSuffix`: Add " ago" or "in" suffix (default: true)
 * - `maxUnit`: Maximum unit to use - 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year' (default: 'year')
 * - `short`: Use short format like "2h" instead of "2 hours" (default: false)
 *
 * ## Examples
 *
 * ```html
 * <!-- Published 2 hours ago -->
 * <time>{{ article.date | dateAgo }}</time>
 *
 * <!-- Short format -->
 * <time>{{ message.sentAt | dateAgo:{ short: true } }}</time>
 *
 * <!-- Without suffix -->
 * <span>Updated {{ post.updatedAt | dateAgo:{ includeSuffix: false } }}</span>
 *
 * <!-- Max unit as day (won't show weeks/months/years) -->
 * <time>{{ date | dateAgo:{ maxUnit: 'day' } }}</time>
 * ```
 *
 * ## Null/Undefined Handling
 *
 * Returns empty string for null/undefined/invalid dates:
 *
 * ```html
 * <time>{{ nullDate | dateAgo }}</time>
 * <!-- Output: "" -->
 * ```
 *
 * @see {@link timeAgo} for implementation details
 */
@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  /**
   * Transforms a date into a relative time string.
   *
   * @param value - The date to transform (Date, number, or string)
   * @param options - Optional configuration for formatting
   * @returns A relative time string (e.g., "2 hours ago") or empty string for invalid input
   *
   * @example
   * ```typescript
   * // In template
   * {{ publishedDate | dateAgo }}
   * {{ publishedDate | dateAgo:{ short: true } }}
   * {{ publishedDate | dateAgo:{ includeSuffix: false, maxUnit: 'day' } }}
   * ```
   */
  transform(
    value: Date | number | string | null | undefined,
    options?: RelativeTimeOptions
  ): string {
    if (!value) {
      return '';
    }

    try {
      return timeAgo(value, options);
    } catch {
      // Return empty string for invalid dates
      return '';
    }
  }
}
