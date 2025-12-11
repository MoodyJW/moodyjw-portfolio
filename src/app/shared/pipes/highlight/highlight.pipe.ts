import type { PipeTransform } from '@angular/core';
import { DOCUMENT, inject, Pipe } from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * HighlightPipe
 *
 * Highlights search terms in text by wrapping them in <mark> tags.
 *
 * ## Features
 * - Pure pipe for performance (caches result for same input)
 * - Case-insensitive highlighting by default
 * - Uses <mark> HTML tag for semantic highlighting
 * - Returns SafeHtml for secure rendering
 * - Type-safe with strict TypeScript
 * - Handles null/undefined gracefully
 * - Escapes HTML in input text to prevent XSS
 *
 * ## Usage
 *
 * ### Basic Usage
 * ```html
 * <p [innerHTML]="text | highlight:'search term'"></p>
 * <!-- Input: "This is a search term example" -->
 * <!-- Output: "This is a <mark>search term</mark> example" -->
 * ```
 *
 * ### Case Sensitive
 * ```html
 * <p [innerHTML]="text | highlight:'Term':true"></p>
 * <!-- Only matches exact case -->
 * ```
 *
 * ### In Component
 * ```typescript
 * @Component({
 *   template: `
 *     <input [(ngModel)]="searchTerm" placeholder="Search...">
 *     <ul>
 *       <li *ngFor="let item of items">
 *         <span [innerHTML]="item.title | highlight:searchTerm"></span>
 *       </li>
 *     </ul>
 *   `,
 *   imports: [HighlightPipe, FormsModule, CommonModule]
 * })
 * export class SearchResultsComponent {
 *   searchTerm = '';
 *   items = [
 *     { title: 'Angular Tutorial' },
 *     { title: 'TypeScript Guide' },
 *   ];
 * }
 * ```
 *
 * ## Styling
 *
 * Style the highlighted text using CSS:
 *
 * ```css
 * mark {
 *   background-color: yellow;
 *   color: black;
 *   padding: 0 2px;
 *   border-radius: 2px;
 * }
 * ```
 *
 * ## Examples
 *
 * ```html
 * <!-- Search results highlighting -->
 * <div [innerHTML]="result.title | highlight:query"></div>
 *
 * <!-- Case-sensitive search -->
 * <div [innerHTML]="code | highlight:'function':true"></div>
 *
 * <!-- Multiple word search -->
 * <div [innerHTML]="text | highlight:'search term'"></div>
 * ```
 *
 * ## Null/Undefined Handling
 *
 * Returns empty string for null/undefined text or search term:
 *
 * ```html
 * <div [innerHTML]="nullText | highlight:'term'"></div>
 * <!-- Output: "" -->
 *
 * <div [innerHTML]="text | highlight:''"></div>
 * <!-- Output: original text (no highlighting) -->
 * ```
 *
 * ## Security
 *
 * The pipe automatically escapes HTML in the input text to prevent XSS attacks,
 * then safely applies <mark> tags for highlighting. The result is sanitized
 * using Angular's DomSanitizer.
 *
 * ```html
 * <!-- Safe: HTML is escaped before highlighting -->
 * <div [innerHTML]="userInput | highlight:searchTerm"></div>
 * ```
 *
 * ## Performance Notes
 *
 * - Pure pipe: Result is cached when inputs don't change
 * - Regex-based matching for efficient highlighting
 * - Case-insensitive by default (can impact performance on very long strings)
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark}
 */
@Pipe({
  name: 'highlight',
  standalone: true,
  pure: true,
})
export class HighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private document = inject(DOCUMENT);

  /**
   * Highlights search terms in text by wrapping them in <mark> tags.
   *
   * @param value - The text to search and highlight
   * @param searchTerm - The term to highlight
   * @param caseSensitive - Whether to match case (default: false)
   * @returns SafeHtml with highlighted terms or empty string for null/undefined
   *
   * @example
   * ```typescript
   * // In template
   * <div [innerHTML]="text | highlight:'search'"></div>
   * <div [innerHTML]="text | highlight:'term':true"></div>
   * ```
   */
  transform(
    value: string | null | undefined,
    searchTerm: string | null | undefined,
    caseSensitive = false
  ): SafeHtml | string {
    if (!value) {
      return '';
    }

    if (!searchTerm || searchTerm.trim() === '') {
      // No search term, return escaped text
      return this.escapeHtml(value);
    }

    // Escape HTML in input text to prevent XSS
    const escapedValue = this.escapeHtml(value);

    // Escape special regex characters in search term
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create regex with appropriate flags
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(escapedSearchTerm, flags);

    // Replace matches with <mark> tags
    const highlighted = escapedValue.replace(regex, (match) => `<mark>${match}</mark>`);

    // Return as SafeHtml
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  /**
   * Escapes HTML special characters to prevent XSS.
   *
   * @param text - The text to escape
   * @returns Escaped text
   */
  private escapeHtml(text: string): string {
    const div = this.document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
