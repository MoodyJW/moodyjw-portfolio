import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { catchError, of, pipe, switchMap, tap } from 'rxjs';

import { flatten, uniqueBy } from '@shared/utilities/array-object/array-object.utils';

import type { CaseStudy } from '../models/case-study.model';
import { CaseStudiesService } from '../services/case-studies.service';

/**
 * State interface for the Case Studies Store
 */
interface CaseStudiesState {
  caseStudies: CaseStudy[];
  selectedCaseStudy: CaseStudy | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTags: string[];
}

/**
 * Initial state for the Case Studies Store
 */
const initialState: CaseStudiesState = {
  caseStudies: [],
  selectedCaseStudy: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
};

/**
 * NgRx SignalStore for managing case studies state
 *
 * Provides reactive state management with:
 * - Signal-based reactivity for automatic updates
 * - Computed selectors for filtering and searching
 * - Methods for state updates and async operations
 * - Type-safe API surface
 *
 * @example
 * ```typescript
 * export class CaseStudiesComponent {
 *   readonly store = inject(CaseStudiesStore);
 *
 *   ngOnInit() {
 *     this.store.loadCaseStudies();
 *   }
 *
 *   onSearch(query: string) {
 *     this.store.setSearchQuery(query);
 *   }
 * }
 * ```
 */
export const CaseStudiesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ caseStudies, selectedCaseStudy, searchQuery, selectedTags }) => ({
    /**
     * Number of total case studies
     */
    caseStudyCount: computed(() => caseStudies().length),

    /**
     * Filtered case studies based on search and tags
     */
    filteredCaseStudies: computed(() => {
      let filtered = [...caseStudies()];

      // Apply search filter
      const query = searchQuery().toLowerCase().trim();
      if (query) {
        filtered = filtered.filter(
          (cs) =>
            cs.title.toLowerCase().includes(query) ||
            cs.description.toLowerCase().includes(query) ||
            cs.client.toLowerCase().includes(query) ||
            cs.role.toLowerCase().includes(query) ||
            cs.technologies.some((tech) => tech.toLowerCase().includes(query)) ||
            (cs.tags && cs.tags.some((tag) => tag.toLowerCase().includes(query)))
        );
      }

      // Apply tag filter (technology filter)
      const tags = selectedTags();
      if (tags.length > 0) {
        filtered = filtered.filter((cs) =>
          tags.some(
            (tag) => cs.technologies.includes(tag) || (cs.tags && cs.tags.includes(tag))
          )
        );
      }

      // Sort by published date (most recent first)
      filtered.sort(
        (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );

      return filtered;
    }),

    /**
     * Case studies filtered by specific technology
     */
    caseStudiesByTechnology: computed(() => {
      return (technology: string) =>
        caseStudies().filter((cs) => cs.technologies.includes(technology));
    }),

    /**
     * Checks if a case study is currently selected
     */
    hasSelection: computed(() => selectedCaseStudy() !== null),

    /**
     * Gets unique technologies from all case studies
     */
    allTechnologies: computed(() => {
      const allTechnologies = flatten(
        caseStudies().map((cs) => cs.technologies),
        1
      );
      return uniqueBy(allTechnologies).sort();
    }),

    /**
     * Gets unique tags from all case studies
     */
    allTags: computed(() => {
      const allTags = flatten(
        caseStudies()
          .map((cs) => cs.tags || [])
          .filter((tags) => tags.length > 0),
        1
      );
      return uniqueBy(allTags).sort();
    }),

    /**
     * Checks if any filters are active
     */
    hasActiveFilters: computed(() => {
      return searchQuery().length > 0 || selectedTags().length > 0;
    }),
  })),
  withMethods((store, caseStudiesService = inject(CaseStudiesService)) => ({
    /**
     * Loads all case studies from the service
     *
     * @example
     * ```typescript
     * ngOnInit() {
     *   this.store.loadCaseStudies();
     * }
     * ```
     */
    loadCaseStudies: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          caseStudiesService.getAll().pipe(
            tap((caseStudies) =>
              patchState(store, {
                caseStudies,
                isLoading: false,
                error: null,
              })
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load case studies',
              });
              return of([]);
            })
          )
        )
      )
    ),

    /**
     * Loads a specific case study by slug and sets it as selected
     *
     * @param slug - The URL-friendly slug of the case study
     *
     * @example
     * ```typescript
     * this.store.selectCaseStudy('enterprise-dashboard-redesign');
     * ```
     */
    selectCaseStudy: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((slug) =>
          caseStudiesService.getBySlug(slug).pipe(
            tap((caseStudy) =>
              patchState(store, {
                selectedCaseStudy: caseStudy || null,
                isLoading: false,
                error: caseStudy ? null : `Case study "${slug}" not found`,
              })
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load case study',
              });
              return of(undefined);
            })
          )
        )
      )
    ),

    /**
     * Sets the search query for filtering case studies
     *
     * @param query - Search string to filter case studies
     *
     * @example
     * ```typescript
     * this.store.setSearchQuery('dashboard');
     * ```
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Toggles a tag filter (technology or topic tag)
     * If the tag is selected, it will be removed. If not, it will be added.
     *
     * @param tag - Tag to toggle
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
     * Clears the currently selected case study
     */
    clearSelection(): void {
      patchState(store, { selectedCaseStudy: null });
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
  }))
);
