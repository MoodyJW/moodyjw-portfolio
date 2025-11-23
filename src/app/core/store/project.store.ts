import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, catchError, of } from 'rxjs';
import type { Project } from '../models/project.model';
import { inject } from '@angular/core';
import { ProjectService } from '../services/project.service';

/**
 * State interface for the Project Store
 */
interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state for the Project Store
 */
const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
};

/**
 * NgRx SignalStore for managing project/case study state
 *
 * Provides reactive state management with:
 * - Automatic signal-based reactivity
 * - Computed selectors for derived state
 * - Methods for state updates and async operations
 * - Type-safe API surface
 *
 * @example
 * ```typescript
 * export class CaseStudiesComponent {
 *   readonly store = inject(ProjectStore);
 *
 *   ngOnInit() {
 *     this.store.loadProjects();
 *   }
 * }
 * ```
 */
export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ projects, selectedProject }) => ({
    /**
     * Number of total projects
     */
    projectCount: computed(() => projects().length),

    /**
     * Projects filtered by specific tags
     */
    projectsByTag: computed(() => {
      return (tag: string) => projects().filter((p) => p.tags.includes(tag));
    }),

    /**
     * Checks if a project is currently selected
     */
    hasSelection: computed(() => selectedProject() !== null),

    /**
     * Gets unique tags from all projects
     */
    allTags: computed(() => {
      const tags = new Set<string>();
      projects().forEach((project) => {
        project.tags.forEach((tag) => tags.add(tag));
      });
      return Array.from(tags).sort();
    }),
  })),
  withMethods((store, projectService = inject(ProjectService)) => ({
    /**
     * Loads all projects from the service
     */
    loadProjects: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          projectService.getProjects().pipe(
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
     * Loads a specific project by ID and sets it as selected
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

    /**
     * Clears the currently selected project
     */
    clearSelection(): void {
      patchState(store, { selectedProject: null });
    },

    /**
     * Manually sets the selected project
     */
    selectProject(project: Project): void {
      patchState(store, { selectedProject: project });
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
