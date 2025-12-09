import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

type SortOrder = 'asc' | 'desc';

/**
 * SortPipe
 *
 * Sorts an array by a property or using a custom comparator function.
 *
 * ## Features
 * - **IMPURE PIPE**: Runs on every change detection cycle to detect array mutations
 * - Supports ascending and descending sort
 * - Supports sorting by property name
 * - Supports custom comparator functions
 * - Type-safe with strict TypeScript
 * - Handles null/undefined gracefully
 * - Returns empty array for invalid inputs
 *
 * ## ⚠️ Performance Warning
 *
 * This is an **impure pipe** (pure: false), meaning it runs on every change detection
 * cycle. Use sparingly and consider these alternatives:
 *
 * - **Preferred**: Sort in component using computed signals or methods
 * - **Alternative**: Use *ngFor with trackBy and sort in component
 * - **Acceptable**: Use this pipe for small arrays or infrequent sorting
 *
 * ```typescript
 * // ✅ PREFERRED: Sort in component with computed signal
 * sortedItems = computed(() => {
 *   return [...this.items()].sort((a, b) => a.name.localeCompare(b.name));
 * });
 *
 * // ❌ AVOID: Impure pipe runs on every change detection
 * <div *ngFor="let item of items | sort:'name'">
 * ```
 *
 * ## Usage
 *
 * ### Sort by Property (Ascending)
 * ```html
 * <div *ngFor="let user of users | sort:'name'">
 *   {{ user.name }}
 * </div>
 * ```
 *
 * ### Sort by Property (Descending)
 * ```html
 * <div *ngFor="let user of users | sort:'name':'desc'">
 *   {{ user.name }}
 * </div>
 * ```
 *
 * ### Sort with Custom Comparator
 * ```html
 * <div *ngFor="let item of items | sort:customComparator">
 *   {{ item.title }}
 * </div>
 * ```
 *
 * ```typescript
 * @Component({
 *   template: `...`,
 *   imports: [SortPipe, CommonModule]
 * })
 * export class MyComponent {
 *   items = [
 *     { title: 'B', priority: 1 },
 *     { title: 'A', priority: 2 },
 *   ];
 *
 *   customComparator = (a: any, b: any) => a.priority - b.priority;
 * }
 * ```
 *
 * ## Type Safety
 *
 * ```typescript
 * interface User {
 *   name: string;
 *   age: number;
 * }
 *
 * // Type-safe comparator
 * sortByAge = (a: User, b: User) => a.age - b.age;
 *
 * // In template
 * <div *ngFor="let user of users | sort:sortByAge">
 * ```
 *
 * ## Examples
 *
 * ```html
 * <!-- Sort strings alphabetically -->
 * <div *ngFor="let item of items | sort:'title'">
 *
 * <!-- Sort numbers descending -->
 * <div *ngFor="let item of items | sort:'price':'desc'">
 *
 * <!-- Sort dates (newest first) -->
 * <div *ngFor="let item of items | sort:'createdAt':'desc'">
 *
 * <!-- Sort with custom logic -->
 * <div *ngFor="let item of items | sort:customSort">
 * ```
 *
 * ## Null/Undefined Handling
 *
 * Returns empty array for null/undefined:
 *
 * ```html
 * <div *ngFor="let item of nullArray | sort:'name'">
 * <!-- No items rendered -->
 * </div>
 * ```
 *
 * Null/undefined property values are sorted to the end:
 *
 * ```typescript
 * // Items with null 'name' will appear at the end
 * {{ items | sort:'name' }}
 * ```
 *
 * ## Best Practices
 *
 * ### ✅ DO: Use for small, static arrays
 * ```typescript
 * const categories = ['zebra', 'apple', 'banana'];
 * sortedCategories = categories.sort();
 * ```
 *
 * ### ✅ DO: Combine with trackBy for better performance
 * ```html
 * <div *ngFor="let item of items | sort:'name'; trackBy: trackById">
 * ```
 *
 * ### ❌ AVOID: Large arrays or frequent updates
 * ```html
 * <!-- Avoid: 1000+ items sorted on every change -->
 * <div *ngFor="let item of largeArray | sort:'name'">
 * ```
 *
 * ### ❌ AVOID: Complex sorting logic in templates
 * ```html
 * <!-- Avoid: Move complex logic to component -->
 * <div *ngFor="let item of items | sort:complexComparator">
 * ```
 *
 * ## Alternative: Sort in Component
 *
 * For better performance, sort in your component:
 *
 * ```typescript
 * @Component({
 *   template: `
 *     <div *ngFor="let item of sortedItems()">
 *       {{ item.name }}
 *     </div>
 *   `
 * })
 * export class MyComponent {
 *   items = signal([...]);
 *   sortBy = signal<'name' | 'date'>('name');
 *
 *   sortedItems = computed(() => {
 *     const items = [...this.items()];
 *     const key = this.sortBy();
 *     return items.sort((a, b) => {
 *       if (a[key] < b[key]) return -1;
 *       if (a[key] > b[key]) return 1;
 *       return 0;
 *     });
 *   });
 * }
 * ```
 *
 * @see {@link https://angular.dev/guide/pipes}
 */
@Pipe({
  name: 'sort',
  standalone: true,
  pure: false, // Impure pipe to detect array changes
})
export class SortPipe implements PipeTransform {
  /**
   * Sorts an array by a property or using a custom comparator.
   *
   * @param array - The array to sort
   * @param propertyOrComparator - Property name or comparator function to sort by
   * @param order - Sort order: 'asc' (default) or 'desc'
   * @returns Sorted array or empty array for null/undefined
   *
   * @example
   * ```typescript
   * // Sort by property
   * {{ items | sort:'name' }}
   * {{ items | sort:'price':'desc' }}
   *
   * // Sort with comparator
   * {{ items | sort:customComparator }}
   * ```
   */
  transform<T>(
    array: T[] | null | undefined,
    propertyOrComparator?: ((a: T, b: T) => number) | string,
    order: SortOrder = 'asc',
  ): T[] {
    if (!array || !Array.isArray(array)) {
      return [];
    }

    if (!propertyOrComparator) {
      return array;
    }

    // Create a shallow copy to avoid mutating the original array
    const sortedArray = [...array];

    // If propertyOrComparator is a function, use it as comparator
    if (typeof propertyOrComparator === 'function') {
      return sortedArray.sort(propertyOrComparator);
    }

    // If propertyOrComparator is a string, sort by property
    if (typeof propertyOrComparator === 'string') {
      const property = propertyOrComparator as keyof T;

      sortedArray.sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];

        // Handle null/undefined values (sort them to the end)
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Compare values
        let comparison = 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Use localeCompare for string comparison
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          // Numeric comparison
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          // Date comparison
          comparison = aValue.getTime() - bValue.getTime();
        } else {
          // Fallback: convert to string and compare
          comparison = String(aValue).localeCompare(String(bValue));
        }

        // Apply sort order
        return order === 'desc' ? -comparison : comparison;
      });
    }

    return sortedArray;
  }
}
