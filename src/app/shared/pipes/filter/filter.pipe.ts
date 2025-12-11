import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

/**
 * FilterPipe
 *
 * Filters an array based on a predicate function or property matching.
 *
 * ## Features
 * - **IMPURE PIPE**: Runs on every change detection cycle to detect array mutations
 * - Supports custom predicate functions for flexible filtering
 * - Supports simple property-value matching
 * - Type-safe with strict TypeScript
 * - Handles null/undefined gracefully
 * - Returns empty array for invalid inputs
 *
 * ## ⚠️ Performance Warning
 *
 * This is an **impure pipe** (pure: false), meaning it runs on every change detection
 * cycle. Use sparingly and consider these alternatives:
 *
 * - **Preferred**: Filter in component using computed signals or methods
 * - **Alternative**: Use *ngFor with trackBy and filter in component
 * - **Acceptable**: Use this pipe for small arrays or infrequent filtering
 *
 * ```typescript
 * // ✅ PREFERRED: Filter in component with computed signal
 * filteredItems = computed(() => {
 *   return this.items().filter(item => item.active);
 * });
 *
 * // ❌ AVOID: Impure pipe runs on every change detection
 * <div *ngFor="let item of items | filter:predicate">
 * ```
 *
 * ## Usage
 *
 * ### With Predicate Function
 * ```html
 * <div *ngFor="let item of items | filter:isActive">
 *   {{ item.name }}
 * </div>
 * ```
 *
 * ```typescript
 * @Component({
 *   template: `...`,
 *   imports: [FilterPipe, CommonModule]
 * })
 * export class MyComponent {
 *   items = [
 *     { name: 'Item 1', active: true },
 *     { name: 'Item 2', active: false },
 *   ];
 *
 *   isActive = (item: any) => item.active;
 * }
 * ```
 *
 * ### With Property Matching
 * ```html
 * <div *ngFor="let user of users | filter:'status':'active'">
 *   {{ user.name }}
 * </div>
 * ```
 *
 * ### With Search Text
 * ```html
 * <input [(ngModel)]="searchText" placeholder="Search...">
 * <div *ngFor="let item of items | filter:'name':searchText">
 *   {{ item.name }}
 * </div>
 * ```
 *
 * ## Type Safety
 *
 * ```typescript
 * interface User {
 *   name: string;
 *   active: boolean;
 * }
 *
 * // Type-safe predicate
 * filterActive = (user: User) => user.active;
 *
 * // In template
 * <div *ngFor="let user of users | filter:filterActive">
 * ```
 *
 * ## Examples
 *
 * ```html
 * <!-- Filter by boolean property -->
 * <div *ngFor="let item of items | filter:'active':true">
 *
 * <!-- Filter by string match (case-insensitive) -->
 * <div *ngFor="let item of items | filter:'category':'electronics'">
 *
 * <!-- Filter with custom function -->
 * <div *ngFor="let item of items | filter:customFilter">
 *
 * <!-- Filter with search text -->
 * <input [(ngModel)]="query">
 * <div *ngFor="let item of items | filter:'title':query">
 * ```
 *
 * ## Null/Undefined Handling
 *
 * Returns empty array for null/undefined:
 *
 * ```html
 * <div *ngFor="let item of nullArray | filter:predicate">
 * <!-- No items rendered -->
 * </div>
 * ```
 *
 * ## Best Practices
 *
 * ### ✅ DO: Use for small, static arrays
 * ```typescript
 * const categories = ['all', 'active', 'archived'];
 * filteredCategories = categories.filter(...);
 * ```
 *
 * ### ✅ DO: Combine with trackBy for better performance
 * ```html
 * <div *ngFor="let item of items | filter:predicate; trackBy: trackById">
 * ```
 *
 * ### ❌ AVOID: Large arrays or frequent updates
 * ```html
 * <!-- Avoid: 1000+ items filtered on every change -->
 * <div *ngFor="let item of largeArray | filter:predicate">
 * ```
 *
 * ### ❌ AVOID: Complex filtering logic in templates
 * ```html
 * <!-- Avoid: Move complex logic to component -->
 * <div *ngFor="let item of items | filter:complexPredicate">
 * ```
 *
 * ## Alternative: Filter in Component
 *
 * For better performance, filter in your component:
 *
 * ```typescript
 * @Component({
 *   template: `
 *     <div *ngFor="let item of filteredItems()">
 *       {{ item.name }}
 *     </div>
 *   `
 * })
 * export class MyComponent {
 *   items = signal([...]);
 *   searchTerm = signal('');
 *
 *   filteredItems = computed(() => {
 *     const term = this.searchTerm().toLowerCase();
 *     return this.items().filter(item =>
 *       item.name.toLowerCase().includes(term)
 *     );
 *   });
 * }
 * ```
 *
 * @see {@link https://angular.dev/guide/pipes}
 */
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false, // Impure pipe to detect array changes
})
export class FilterPipe implements PipeTransform {
  /**
   * Filters an array based on a predicate or property matching.
   *
   * @param array - The array to filter
   * @param predicateOrProperty - Predicate function or property name to filter by
   * @param value - Value to match (when predicateOrProperty is a property name)
   * @returns Filtered array or empty array for null/undefined
   *
   * @example
   * ```typescript
   * // With predicate function
   * {{ items | filter:isActive }}
   *
   * // With property matching
   * {{ items | filter:'status':'active' }}
   *
   * // With search text
   * {{ items | filter:'name':searchQuery }}
   * ```
   */
  transform<T>(
    array: T[] | null | undefined,
    predicateOrProperty?: ((item: T) => boolean) | string,
    value?: unknown,
  ): T[] {
    if (!array || !Array.isArray(array)) {
      return [];
    }

    if (!predicateOrProperty) {
      return array;
    }

    // If predicateOrProperty is a function, use it as predicate
    if (typeof predicateOrProperty === 'function') {
      return array.filter(predicateOrProperty);
    }

    // If predicateOrProperty is a string, filter by property value
    if (typeof predicateOrProperty === 'string') {
      const property = predicateOrProperty as keyof T;

      // If no value provided, filter by truthy property values
      if (value === undefined || value === null) {
        return array.filter((item) => !!item[property]);
      }

      // If value is a string, do case-insensitive partial match
      if (typeof value === 'string') {
        const searchValue = value.toLowerCase();
        return array.filter((item) => {
          const itemValue = item[property];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(searchValue);
          }
          return String(itemValue).toLowerCase().includes(searchValue);
        });
      }

      // Exact match for non-string values
      return array.filter((item) => item[property] === value);
    }

    return array;
  }
}
