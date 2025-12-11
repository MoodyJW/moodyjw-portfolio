import type { PipeTransform } from '@angular/core';
import { inject, Pipe } from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * SafeHtmlPipe
 *
 * Sanitizes and marks HTML content as safe for rendering in templates.
 *
 * ## Features
 * - Pure pipe for performance (caches result for same input)
 * - Uses Angular's DomSanitizer for security
 * - Prevents XSS attacks while allowing trusted HTML
 * - Type-safe with strict TypeScript
 * - Handles null/undefined gracefully
 *
 * ## Usage
 *
 * ### Basic Usage
 * ```html
 * <div [innerHTML]="htmlContent | safeHtml"></div>
 * ```
 *
 * ### In Component
 * ```typescript
 * @Component({
 *   template: `
 *     <article>
 *       <h2>{{ post.title }}</h2>
 *       <div [innerHTML]="post.content | safeHtml"></div>
 *     </article>
 *   `,
 *   imports: [SafeHtmlPipe]
 * })
 * export class BlogPostComponent {
 *   post = {
 *     title: 'My Post',
 *     content: '<p>This is <strong>HTML</strong> content.</p>'
 *   };
 * }
 * ```
 *
 * ## Security Warning
 *
 * **IMPORTANT**: Only use this pipe with trusted HTML content that you control.
 * Never use it with user-generated content without proper server-side sanitization.
 *
 * ### Safe Usage
 * ```html
 * <!-- ✅ Safe: Content from your CMS/database -->
 * <div [innerHTML]="article.content | safeHtml"></div>
 *
 * <!-- ✅ Safe: Static content you control -->
 * <div [innerHTML]="staticHtmlContent | safeHtml"></div>
 * ```
 *
 * ### Unsafe Usage
 * ```html
 * <!-- ❌ Unsafe: User input without sanitization -->
 * <div [innerHTML]="userComment | safeHtml"></div>
 *
 * <!-- ❌ Unsafe: External untrusted content -->
 * <div [innerHTML]="externalApiResponse | safeHtml"></div>
 * ```
 *
 * ## Examples
 *
 * ```html
 * <!-- Render rich text from CMS -->
 * <div [innerHTML]="cmsContent | safeHtml"></div>
 *
 * <!-- Display formatted article content -->
 * <article [innerHTML]="articleHtml | safeHtml"></article>
 *
 * <!-- Show markdown-to-HTML converted content -->
 * <div [innerHTML]="markdownHtml | safeHtml"></div>
 * ```
 *
 * ## Null/Undefined Handling
 *
 * Returns empty string for null/undefined:
 *
 * ```html
 * <div [innerHTML]="nullContent | safeHtml"></div>
 * <!-- Renders: <div></div> -->
 * ```
 *
 * ## Alternative: Angular's DomSanitizer
 *
 * If you need more control or different sanitization contexts (URL, style, etc.),
 * use Angular's DomSanitizer directly in your component:
 *
 * ```typescript
 * import { DomSanitizer } from '@angular/platform-browser';
 *
 * constructor(private sanitizer: DomSanitizer) {}
 *
 * getSafeHtml(html: string) {
 *   return this.sanitizer.bypassSecurityTrustHtml(html);
 * }
 * ```
 *
 * @see {@link https://angular.io/api/platform-browser/DomSanitizer}
 */
@Pipe({
  name: 'safeHtml',
  standalone: true,
  pure: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  /**
   * Sanitizes HTML content and marks it as safe for rendering.
   *
   * @param value - The HTML string to sanitize
   * @returns SafeHtml object or empty string for null/undefined
   *
   * @example
   * ```typescript
   * // In template
   * <div [innerHTML]="htmlContent | safeHtml"></div>
   * ```
   */
  transform(value: string | null | undefined): SafeHtml | string {
    if (!value) {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
