import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ContainerComponent } from '@shared/components/container/container.component';
import { GridComponent } from '@shared/components/grid/grid.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { StackComponent } from '@shared/components/stack/stack.component';
import { debounce } from '@shared/utilities/debounce-throttle/debounce-throttle.utils';
import { type ProjectSortBy, ProjectStore } from '@core/store/project.store';

import { ProjectCard } from '../project-card/project-card';

/**
 * Projects List Component
 *
 * @remarks
 * Displays a filterable, searchable, and sortable list of portfolio projects.
 *
 * Features:
 * - Search projects by title, description, or technologies
 * - Filter by category using tabs
 * - Filter by technology tags
 * - Sort by recent, popular (GitHub stars), or alphabetically
 * - Responsive grid layout (1/2/3 columns)
 * - Loading skeletons while data loads
 * - Empty state when no projects match filters
 * - Click to navigate to project detail page
 *
 * Uses the following shared components:
 * - ContainerComponent - page wrapper
 * - StackComponent - vertical spacing
 * - GridComponent - project cards grid
 * - CardComponent - each project card
 * - SkeletonComponent - loading states
 * - InputComponent - search
 * - SelectComponent - sort dropdown
 * - TabsComponent - category filter
 * - BadgeComponent - technology tags, GitHub stars
 * - ButtonComponent - clear filters, view project
 * - IconComponent - search icon, external link, GitHub
 * - BreadcrumbComponent - page navigation
 *
 * @example
 * ```html
 * <app-projects-list />
 * ```
 */
@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    StackComponent,
    GridComponent,
    CardComponent,
    SkeletonComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    IconComponent,
    BreadcrumbComponent,
    ProjectCard,
  ],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList {
  /** Inject the projects store */
  protected readonly store = inject(ProjectStore);

  /** Local search query signal (debounced before updating store) */
  protected readonly localSearchQuery = signal<string>('');

  /** Selected category signal */
  protected readonly selectedCategory = signal<string>('All');

  /** Available categories computed from projects */
  protected readonly categories = computed(() => {
    const allCategories = this.store.allCategories();
    return ['All', ...allCategories];
  });

  /** Breadcrumb items for navigation */
  protected readonly breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Projects', url: '/projects' },
  ];

  /** Sort options for the select dropdown */
  protected readonly sortOptions = [
    { value: 'recent' as ProjectSortBy, label: 'Most Recent' },
    { value: 'popular' as ProjectSortBy, label: 'Most Popular' },
    { value: 'name' as ProjectSortBy, label: 'A-Z' },
  ];

  /** Tab items for category filter */
  protected readonly tabs = computed(() =>
    this.categories().map((category) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      label: category,
      active: this.selectedCategory() === category,
    }))
  );

  /** Active filter count for the clear filters button */
  protected readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.store.searchQuery()) count++;
    if (this.store.selectedTags().length > 0) count += this.store.selectedTags().length;
    if (this.selectedCategory() !== 'All') count++;
    return count;
  });

  /** Filtered projects based on category and store filters */
  protected readonly filteredProjects = computed(() => {
    const projects = this.store.filteredProjects();
    const category = this.selectedCategory();

    if (category === 'All') {
      return projects;
    }

    return projects.filter((p) => p.category === category);
  });

  /** Debounced search handler */
  private readonly debouncedSearch = debounce((...args: unknown[]) => {
    this.store.setSearchQuery(args[0] as string);
  }, 300);

  constructor() {
    // Load projects on init
    this.store.loadProjects();
  }

  /**
   * Handle search input change
   */
  onSearchChange(query: string): void {
    this.localSearchQuery.set(query);
    this.debouncedSearch(query);
  }

  /**
   * Handle category tab selection
   */
  onCategoryChange(tabId: string): void {
    const category = this.categories().find(
      (c) => c.toLowerCase().replace(/\s+/g, '-') === tabId
    );
    if (category) {
      this.selectedCategory.set(category);
    }
  }

  /**
   * Handle sort change from select dropdown
   */
  onSortChange(sort: ProjectSortBy | ProjectSortBy[] | null): void {
    if (sort && !Array.isArray(sort)) {
      this.store.setSortBy(sort);
    }
  }

  /**
   * Toggle a technology tag filter
   */
  onToggleTag(tag: string): void {
    this.store.toggleTag(tag);
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.store.clearFilters();
    this.selectedCategory.set('All');
    this.localSearchQuery.set('');
  }

  /**
   * Get current sort value for the select component
   */
  getCurrentSort(): ProjectSortBy {
    return this.store.sortBy();
  }
}
