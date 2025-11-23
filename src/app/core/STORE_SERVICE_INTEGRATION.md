# Store + Service Integration Example

This document demonstrates how the ProjectStore and ProjectService work together to provide a complete data management solution.

## Architecture Flow

```
Component
    ↓ inject(ProjectStore)
    ↓ store.loadProjects()
    ↓
ProjectStore (NgRx SignalStore)
    ↓ rxMethod triggers
    ↓ inject(ProjectService)
    ↓ projectService.getProjects()
    ↓
ProjectService
    ↓ HttpClient.get()
    ↓
HttpClient + Interceptors
    ↓ latencyInterceptor (500-1000ms delay)
    ↓
assets/data/projects.json
    ↓
Data flows back up through Observable stream
    ↓
Store updates state via patchState
    ↓
Component template automatically updates (signals reactivity)
```

## Complete Implementation Example

### 1. Store (State Management Layer)

```typescript
// src/app/core/store/project.store.ts
export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ projects }) => ({
    projectCount: computed(() => projects().length),
  })),
  withMethods((store, projectService = inject(ProjectService)) => ({
    loadProjects: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          projectService
            .getProjects()
            .pipe(tap((projects) => patchState(store, { projects, isLoading: false })))
        )
      )
    ),
  }))
);
```

### 2. Service (Data Layer)

```typescript
// src/app/core/services/project.service.ts
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/assets/data/projects.json');
  }
}
```

### 3. Component (Presentation Layer)

```typescript
// src/app/features/case-studies/case-studies.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '@core/store';

@Component({
  selector: 'app-case-studies',
  standalone: true,
  template: `
    <div class="case-studies">
      @if (store.isLoading()) {
      <div class="loading">
        <p>Loading projects...</p>
      </div>
      } @else if (store.error()) {
      <div class="error">
        <p>{{ store.error() }}</p>
        <button (click)="retry()">Retry</button>
      </div>
      } @else {
      <header>
        <h1>Case Studies</h1>
        <p>{{ store.projectCount() }} projects</p>
      </header>

      <div class="filters">
        @for (tag of store.allTags(); track tag) {
        <button (click)="filterByTag(tag)">{{ tag }}</button>
        }
      </div>

      <div class="projects-grid">
        @for (project of filteredProjects(); track project.id) {
        <article class="project-card">
          <h2>{{ project.title }}</h2>
          <p>{{ project.description }}</p>
          <div class="tags">
            @for (tag of project.tags; track tag) {
            <span class="tag">{{ tag }}</span>
            }
          </div>
        </article>
        }
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudiesComponent implements OnInit {
  readonly store = inject(ProjectStore);

  // Local component state for filtering
  selectedTag = signal<string | null>(null);

  // Computed filtered projects
  filteredProjects = computed(() => {
    const tag = this.selectedTag();
    return tag ? this.store.projectsByTag()(tag) : this.store.projects();
  });

  ngOnInit() {
    // Load projects on component initialization
    this.store.loadProjects();
  }

  filterByTag(tag: string) {
    this.selectedTag.set(tag);
  }

  retry() {
    this.store.clearError();
    this.store.loadProjects();
  }
}
```

## Benefits of This Architecture

### 1. Separation of Concerns

- **Store**: Manages state and business logic
- **Service**: Handles data fetching
- **Component**: Presents UI and handles user interaction

### 2. Single Source of Truth

All components can access the same ProjectStore instance for consistent state.

### 3. Automatic Reactivity

Changes to store state automatically propagate to all subscribed components via signals.

### 4. Testability

**Test the Service:**

```typescript
it('should fetch projects', () => {
  service.getProjects().subscribe((projects) => {
    expect(projects.length).toBeGreaterThan(0);
  });
});
```

**Test the Store:**

```typescript
it('should load projects into state', () => {
  store.loadProjects();
  expect(store.projects()).toEqual(mockProjects);
});
```

**Test the Component:**

```typescript
it('should display projects', () => {
  component.ngOnInit();
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Case Studies');
});
```

### 5. Easy to Extend

Add new computed selectors:

```typescript
withComputed(({ projects }) => ({
  featuredProjects: computed(() => projects().filter((p) => p.tags.includes('Featured'))),
  projectsByYear: computed(() => {
    // Group projects by year logic
  }),
}));
```

Add new methods:

```typescript
withMethods((store) => ({
  searchProjects(query: string): void {
    const filtered = store
      .projects()
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    patchState(store, { filteredProjects: filtered });
  },
}));
```

## Advanced Patterns

### Multi-Component State Sharing

```typescript
// Component A - Loads data
export class ProjectListComponent {
  readonly store = inject(ProjectStore);

  ngOnInit() {
    this.store.loadProjects();
  }
}

// Component B - Uses same data (no reload needed)
export class ProjectFiltersComponent {
  readonly store = inject(ProjectStore);

  get availableTags() {
    return this.store.allTags(); // Computed from already loaded data
  }
}
```

### Optimistic Updates

```typescript
addProject(project: Project): void {
  // Immediately update UI
  patchState(store, {
    projects: [...store.projects(), project]
  });

  // Then sync with backend
  projectService.createProject(project).subscribe({
    error: () => {
      // Rollback on error
      patchState(store, {
        projects: store.projects().filter(p => p.id !== project.id)
      });
    }
  });
}
```

### Derived Stores

```typescript
// Create a feature-specific store that uses ProjectStore
export const FeaturedProjectsStore = signalStore(
  withState({ featuredIds: ['id1', 'id2'] }),
  withMethods((store) => {
    const projectStore = inject(ProjectStore);

    return {
      getFeaturedProjects: computed(() =>
        projectStore.projects().filter((p) => store.featuredIds().includes(p.id))
      ),
    };
  })
);
```

## Performance Considerations

### 1. OnPush Change Detection

Store signals work perfectly with OnPush, triggering updates only when data changes.

### 2. Computed Selectors Cache

Computed selectors only recalculate when their dependencies change.

### 3. Fine-Grained Reactivity

Only components that read a specific signal will update when it changes.

### 4. Lazy Loading

Store can be lazy-loaded with feature modules if not using `providedIn: 'root'`.

## Migration Path

### Phase 1: Keep Both (Current State)

- Service continues to work independently
- Store provides enhanced state management
- Components can use either

### Phase 2: Prefer Store

- New components use store by default
- Existing components gradually migrate

### Phase 3: Store-First

- All components use store
- Service becomes pure data layer (no state)
- Full reactive architecture

## Summary

The combination of ProjectService + ProjectStore provides:

- ✅ Clean separation of data fetching and state management
- ✅ Reactive UI updates through signals
- ✅ Type-safe API with full IntelliSense
- ✅ Built-in loading and error states
- ✅ Computed selectors for derived data
- ✅ Testable architecture
- ✅ Easy to extend and maintain

This pattern scales well as the application grows and makes it easy to add features like caching, optimistic updates, and real-time data synchronization.
