import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12 | 'auto';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * Responsive grid component for creating flexible, consistent layouts.
 * Supports responsive column configurations, gap spacing, and alignment options.
 *
 * @example
 * ```html
 * <!-- Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop -->
 * <app-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </app-grid>
 *
 * <!-- Auto-fit columns with minimum width -->
 * <app-grid cols="auto" [minColWidth]="'250px'" gap="md">
 *   <div>Auto-sized item</div>
 *   <div>Auto-sized item</div>
 * </app-grid>
 *
 * <!-- 12-column layout system -->
 * <app-grid [cols]="12" gap="md">
 *   <div class="col-span-6">Half width</div>
 *   <div class="col-span-6">Half width</div>
 * </app-grid>
 * ```
 */
@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  /**
   * Number of columns (mobile-first, base)
   * - 1-12: Fixed column count
   * - auto: Auto-fit columns with minColWidth
   */
  readonly cols = input<GridColumns>(1);

  /**
   * Number of columns at tablet breakpoint (≥768px)
   * If not specified, uses cols value
   */
  readonly colsMd = input<GridColumns | undefined>(undefined);

  /**
   * Number of columns at desktop breakpoint (≥1024px)
   * If not specified, uses colsMd or cols value
   */
  readonly colsLg = input<GridColumns | undefined>(undefined);

  /**
   * Number of columns at large desktop breakpoint (≥1280px)
   * If not specified, uses colsLg, colsMd, or cols value
   */
  readonly colsXl = input<GridColumns | undefined>(undefined);

  /**
   * Gap spacing between grid items
   * - none: 0
   * - xs: 4px
   * - sm: 8px
   * - md: 16px (default)
   * - lg: 24px
   * - xl: 32px
   * - 2xl: 48px
   */
  readonly gap = input<GridGap>('md');

  /**
   * Horizontal gap spacing (overrides gap for columns)
   * Useful when you want different horizontal vs vertical spacing
   */
  readonly gapX = input<GridGap | undefined>(undefined);

  /**
   * Vertical gap spacing (overrides gap for rows)
   * Useful when you want different horizontal vs vertical spacing
   */
  readonly gapY = input<GridGap | undefined>(undefined);

  /**
   * Minimum column width for auto-fit columns
   * Only applies when cols="auto"
   * Examples: '200px', '15rem', '20ch'
   */
  readonly minColWidth = input<string>('200px');

  /**
   * Vertical alignment of items within grid cells
   * - start: Align to top
   * - center: Center vertically
   * - end: Align to bottom
   * - stretch: Fill cell height (default)
   */
  readonly alignItems = input<GridAlign>('stretch');

  /**
   * Horizontal distribution of items
   * - start: Pack items to start
   * - center: Center items
   * - end: Pack items to end
   * - space-between: Distribute with space between
   * - space-around: Distribute with space around
   * - space-evenly: Distribute with even space
   */
  readonly justifyItems = input<GridJustify | undefined>(undefined);

  /**
   * Whether grid should take full width of container
   */
  readonly fullWidth = input<boolean>(true);

  /**
   * ARIA role for the grid
   * Defaults to generic 'list' for semantic grouping
   */
  readonly role = input<string>('list');

  /**
   * ARIA label for the grid
   * Recommended for grids that represent distinct regions
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * ID of element that labels the grid
   */
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  /**
   * Computed CSS classes for the grid
   */
  readonly gridClasses = computed(() => this._getGridClasses());

  /**
   * Computed inline styles for the grid
   * Used for responsive column counts and auto-fit
   */
  readonly gridStyles = computed(() => this._getGridStyles());

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getGridClasses(): string {
    const classes = ['grid'];

    // Gap classes
    const gapX = this.gapX();
    const gapY = this.gapY();
    const gap = this.gap();

    if (gapX !== undefined || gapY !== undefined) {
      // Use specific gap values
      if (gapX !== undefined) {
        classes.push(`grid--gap-x-${gapX}`);
      }
      if (gapY !== undefined) {
        classes.push(`grid--gap-y-${gapY}`);
      }
    } else {
      // Use uniform gap
      classes.push(`grid--gap-${gap}`);
    }

    // Alignment classes
    classes.push(`grid--align-${this.alignItems()}`);

    if (this.justifyItems() !== undefined) {
      classes.push(`grid--justify-${this.justifyItems()}`);
    }

    // Full width
    if (this.fullWidth()) {
      classes.push('grid--full-width');
    }

    return classes.join(' ');
  }

  /**
   * Generate inline styles for responsive columns
   */
  private _getGridStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    const cols = this.cols();

    // Base columns (mobile-first)
    if (cols === 'auto') {
      styles['--grid-cols'] = `repeat(auto-fit, minmax(min(${this.minColWidth()}, 100%), 1fr))`;
    } else {
      styles['--grid-cols'] = `repeat(${cols}, 1fr)`;
    }

    // Tablet breakpoint
    const colsMd = this.colsMd();
    if (colsMd !== undefined) {
      if (colsMd === 'auto') {
        styles['--grid-cols-md'] = `repeat(auto-fit, minmax(min(${this.minColWidth()}, 100%), 1fr))`;
      } else {
        styles['--grid-cols-md'] = `repeat(${colsMd}, 1fr)`;
      }
    }

    // Desktop breakpoint
    const colsLg = this.colsLg();
    if (colsLg !== undefined) {
      if (colsLg === 'auto') {
        styles['--grid-cols-lg'] = `repeat(auto-fit, minmax(min(${this.minColWidth()}, 100%), 1fr))`;
      } else {
        styles['--grid-cols-lg'] = `repeat(${colsLg}, 1fr)`;
      }
    }

    // Large desktop breakpoint
    const colsXl = this.colsXl();
    if (colsXl !== undefined) {
      if (colsXl === 'auto') {
        styles['--grid-cols-xl'] = `repeat(auto-fit, minmax(min(${this.minColWidth()}, 100%), 1fr))`;
      } else {
        styles['--grid-cols-xl'] = `repeat(${colsXl}, 1fr)`;
      }
    }

    return styles;
  }
}
