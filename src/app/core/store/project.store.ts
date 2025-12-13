import { computed } from '@angular/core';
import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { catchError, of, pipe, switchMap, tap } from 'rxjs';

import { flatten, uniqueBy } from '@shared/utilities/array-object/array-object.utils';

import type { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';

/**
 * Sort options for projects
 */
export type ProjectSortBy = 'recent' | 'popular' | 'name';

/**
 * State interface for the Projects Store
 */
interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTags: string[];
  sortBy: ProjectSortBy;
}

/**
 * Initial state for the Projects Store
 */
const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
  sortBy: 'recent',
};

/**
 * NgRx SignalStore for managing projects state
 *
 * Provides reactive state management with:
 * - Signal-based reactivity for automatic updates
 * - Computed selectors for filtering, sorting, and searching
 * - Methods for state updates and async operations
 * - Type-safe API surface
 *
 * @example
 * ```typescript
 * export class ProjectsListComponent {
 *   readonly store = inject(ProjectStore);
 *
 *   ngOnInit() {
 *     this.store.loadProjects();
 *   }
 *
 *   onSearch(query: string) {
 *     this.store.setSearchQuery(query);
 *   }
 * }
 * ```
 */
export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ projects, selectedProject, searchQuery, selectedTags, sortBy }) => ({
    /**
     * Number of total projects
     */
    projectCount: computed(() => projects().length),

    /**
     * Featured projects only
     */
    featuredProjects: computed(() => projects().filter((p) => p.featured)),

    /**
     * Projects grouped by category
     */
    projectsByCategory: computed(() => {
      const categories = new Map<string, Project[]>();
      for (const project of projects()) {
        const category = project.category;
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category)!.push(project);
      }
      return Object.fromEntries(categories);
    }),

    /**
     * Filtered and sorted projects based on search, tags, and sort order
     */
    filteredProjects: computed(() => {
      let filtered = [...projects()];

      // Apply search filter
      const query = searchQuery().toLowerCase().trim();
      if (query) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            p.technologies.some((tech) => tech.toLowerCase().includes(query)) ||
            p.category.toLowerCase().includes(query)
        );
      }

      // Apply tag filter (technology filter)
      const tags = selectedTags();
      if (tags.length > 0) {
        filtered = filtered.filter((p) => tags.some((tag) => p.technologies.includes(tag)));
      }

      // Apply sorting
      const sort = sortBy();
      filtered.sort((a, b) => {
        switch (sort) {
          case 'recent':
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
          case 'popular':
            return (b.githubStars || 0) - (a.githubStars || 0);
          case 'name':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

      return filtered;
    }),

    /**
     * Projects filtered by specific technology
     */
    projectsByTechnology: computed(() => {
      return (technology: string) => projects().filter((p) => p.technologies.includes(technology));
    }),

    /**
     * Checks if a project is currently selected
     */
    hasSelection: computed(() => selectedProject() !== null),

    /**
     * Gets unique technologies from all projects
     */
    allTechnologies: computed(() => {
      const allTechnologies = flatten(
        projects().map((p) => p.technologies),
        1
      );
      return uniqueBy(allTechnologies).sort();
    }),

    /**
     * Gets unique categories from all projects
     */
    allCategories: computed(() => {
      const categories = projects().map((p) => p.category);
      return uniqueBy(categories).sort();
    }),

    /**
     * Checks if any filters are active
     */
    hasActiveFilters: computed(() => {
      return searchQuery().length > 0 || selectedTags().length > 0;
    }),
  })),
  withMethods((store, projectService = inject(ProjectService)) => ({
    /**
     * Loads all projects from the service
     *
     * @example
     * ```typescript
     * ngOnInit() {
     *   this.store.loadProjects();
     * }
     * ```
     */
    loadProjects: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          projectService.getAll().pipe(
            tap((projects) =>
              patchState(store, {
                projects,
                isLoading: false,
                error: null,
              })
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load projects',
              });
              return of([]);
            })
          )
        )
      )
    ),

    /**
     * Loads a specific project by slug and sets it as selected
     *
     * @param slug - The URL-friendly slug of the project
     *
     * @example
     * ```typescript
     * this.store.selectProject('angular-portfolio');
     * ```
     */
    selectProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((slug) =>
          projectService.getBySlug(slug).pipe(
            tap((project) =>
              patchState(store, {
                selectedProject: project || null,
                isLoading: false,
                error: project ? null : `Project "${slug}" not found`,
              })
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load project',
              });
              return of(undefined);
            })
          )
        )
      )
    ),

    /**
     * Sets the search query for filtering projects
     *
     * @param query - Search string to filter projects
     *
     * @example
     * ```typescript
     * this.store.setSearchQuery('angular');
     * ```
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Toggles a technology tag filter
     * If the tag is selected, it will be removed. If not, it will be added.
     *
     * @param tag - Technology tag to toggle
     *
     * @example
     * ```typescript
     * this.store.toggleTag('Angular');
     * ```
     */
    toggleTag(tag: string): void {
      const currentTags = store.selectedTags();
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      patchState(store, { selectedTags: newTags });
    },

    /**
     * Sets the sort order for projects
     *
     * @param sort - Sort option ('recent', 'popular', or 'name')
     *
     * @example
     * ```typescript
     * this.store.setSortBy('popular');
     * ```
     */
    setSortBy(sort: ProjectSortBy): void {
      patchState(store, { sortBy: sort });
    },

    /**
     * Clears all filters (search query and selected tags)
     *
     * @example
     * ```typescript
     * this.store.clearFilters();
     * ```
     */
    clearFilters(): void {
      patchState(store, { searchQuery: '', selectedTags: [] });
    },

    /**
     * Clears the currently selected project
     */
    clearSelection(): void {
      patchState(store, { selectedProject: null });
    },

    /**
     * Clears any error state
     */
    clearError(): void {
      patchState(store, { error: null });
    },

    /**
     * Resets the store to initial state
     */
    reset(): void {
      patchState(store, initialState);
    },

    /**
     * Legacy method for backward compatibility
     * @deprecated Use selectProject instead
     */
    loadProjectById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          projectService.getProjectById(id).pipe(
            tap((project) =>
              patchState(store, {
                selectedProject: project || null,
                isLoading: false,
                error: project ? null : `Project with ID "${id}" not found`,
              })
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load project',
              });
              return of(undefined);
            })
          )
        )
      )
    ),
  }))
);
