import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ContainerComponent } from '@shared/components/container/container.component';
import { GridComponent } from '@shared/components/grid/grid.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { InputComponent } from '@shared/components/input/input.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { StackComponent } from '@shared/components/stack/stack.component';
import { debounce } from '@shared/utilities/debounce-throttle/debounce-throttle.utils';
import { CaseStudiesStore } from '@core/store/case-studies.store';

import { CaseStudyCard } from './case-study-card/case-study-card';

/**
 * Case Studies List Component
 *
 * @remarks
 * Displays a filterable and searchable list of portfolio case studies.
 *
 * Features:
 * - Search case studies by title, description, client, role, or technologies
 * - Filter by technology tags
 * - Responsive grid layout (1/2 columns)
 * - Loading skeletons while data loads
 * - Empty state when no case studies match filters
 * - Click to navigate to case study detail page
 *
 * @example
 * ```html
 * <app-case-studies />
 * ```
 */
@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    StackComponent,
    GridComponent,
    CardComponent,
    SkeletonComponent,
    InputComponent,
    ButtonComponent,
    IconComponent,
    BreadcrumbComponent,
    CaseStudyCard,
  ],
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudiesComponent {
  /** Inject the case studies store */
  protected readonly store = inject(CaseStudiesStore);

  /** Inject the Title service */
  private readonly titleService = inject(Title);

  /** Local search query signal (debounced before updating store) */
  protected readonly localSearchQuery = signal<string>('');

  /** Breadcrumb items for navigation */
  protected readonly breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Case Studies', url: '/case-studies' },
  ];

  /** Computed signal for active filter count */
  protected readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.store.searchQuery().length > 0) count++;
    count += this.store.selectedTags().length;
    return count;
  });

  /** Computed signal for showing empty state */
  protected readonly showEmptyState = computed(
    () => !this.store.isLoading() && this.store.filteredCaseStudies().length === 0
  );

  /** Computed signal for showing case studies grid */
  protected readonly showCaseStudies = computed(
    () => !this.store.isLoading() && this.store.filteredCaseStudies().length > 0
  );

  /** Computed signal for showing clear filters button in empty state */
  protected readonly showClearFiltersButton = computed(() => this.activeFilterCount() > 0);

  constructor() {
    // Set page title
    this.titleService.setTitle('MoodyJW - Case Studies');

    // Load case studies on initialization
    this.store.loadCaseStudies();
  }

  /**
   * Handle search input changes with debouncing
   */
  onSearchChange = debounce((query: unknown) => {
    const searchQuery = String(query);
    this.localSearchQuery.set(searchQuery);
    this.store.setSearchQuery(searchQuery);
  }, 300);

  /**
   * Handle technology tag toggle
   */
  onToggleTag(tag: string): void {
    this.store.toggleTag(tag);
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.store.clearFilters();
    this.localSearchQuery.set('');
  }
}
