# NgRx SignalStore Guide

## Overview

NgRx SignalStore provides a modern, signals-based state management solution that's simpler and more lightweight than traditional NgRx with actions and reducers.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Component                          │
│  - inject(ProjectStore)                                 │
│  - Access signals: store.projects()                     │
│  - Call methods: store.loadProjects()                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   ProjectStore                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  State (Signals)                                 │  │
│  │  - projects: Project[]                           │  │
│  │  - selectedProject: Project | null               │  │
│  │  - isLoading: boolean                            │  │
│  │  - error: string | null                          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Computed Selectors                              │  │
│  │  - projectCount()                                │  │
│  │  - projectsByTag(tag)                            │  │
│  │  - hasSelection()                                │  │
│  │  - allTags()                                     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Methods                                         │  │
│  │  - loadProjects()        → rxMethod              │  │
│  │  - loadProjectById(id)   → rxMethod              │  │
│  │  - selectProject()       → patchState            │  │
│  │  - clearSelection()      → patchState            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   ProjectService                        │
│  - getProjects(): Observable<Project[]>                 │
│  - getProjectById(id): Observable<Project | undefined>  │
└─────────────────────────────────────────────────────────┘
```

## Features

### 1. Reactive Signals

All state is automatically reactive through Angular signals. No need to subscribe manually.

### 2. Computed Selectors

Derived state is automatically recalculated when dependencies change.

### 3. Type Safety

Full TypeScript support with strong typing throughout.

### 4. Automatic Loading States

Built-in loading and error state management.

### 5. rxMethod for Async Operations

Clean handling of observable streams with automatic subscription management.

## Basic Usage

### Inject the Store

```typescript
import { Component, inject } from '@angular/core';
import { ProjectStore } from '@core/store';

@Component({
  selector: 'app-my-component',
  standalone: true,
})
export class MyComponent {
  readonly store = inject(ProjectStore);
}
```

### Access State

```typescript
// In component class
const projects = this.store.projects();
const isLoading = this.store.isLoading();
const error = this.store.error();

// In template
@if (store.isLoading()) {
  <div>Loading...</div>
}

@for (project of store.projects(); track project.id) {
  <div>{{ project.title }}</div>
}
```

### Load Data

```typescript
ngOnInit() {
  // Trigger async data loading
  this.store.loadProjects();
}
```

## Advanced Patterns

### Using Computed Selectors

```typescript
export class FilterComponent {
  readonly store = inject(ProjectStore);

  // Get total count
  get totalProjects() {
    return this.store.projectCount();
  }

  // Filter by tag
  get angularProjects() {
    return this.store.projectsByTag()('Angular');
  }

  // Get all available tags
  get availableTags() {
    return this.store.allTags();
  }
}
```

### Loading Specific Project

```typescript
export class ProjectDetailComponent implements OnInit {
  readonly store = inject(ProjectStore);
  readonly route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.store.loadProjectById(id);
  }

  // Access selected project in template
  // {{ store.selectedProject()?.title }}
}
```

### Manual Project Selection

```typescript
selectProject(project: Project) {
  // Manually set selected project without loading
  this.store.selectProject(project);
}

clearSelection() {
  this.store.clearSelection();
}
```

### Error Handling

```typescript
ngOnInit() {
  this.store.loadProjects();

  // Watch for errors
  effect(() => {
    const error = this.store.error();
    if (error) {
      console.error('Store error:', error);
      // Show toast notification
    }
  });
}

clearError() {
  this.store.clearError();
}
```

### Reset Store

```typescript
ngOnDestroy() {
  // Clean up store state when component is destroyed
  this.store.reset();
}
```

## Template Patterns

### Loading State

```typescript
@if (store.isLoading()) {
  <app-skeleton-loader />
} @else if (store.error()) {
  <app-error-message [error]="store.error()" />
} @else {
  <app-project-list [projects]="store.projects()" />
}
```

### Filtering UI

```typescript
<div class="filters">
  @for (tag of store.allTags(); track tag) {
    <button (click)="filterByTag(tag)">
      {{ tag }}
    </button>
  }
</div>

<div class="results">
  <p>Showing {{ filteredProjects().length }} of {{ store.projectCount() }} projects</p>
</div>
```

### Selection State

```typescript
@if (store.hasSelection()) {
  <app-project-detail [project]="store.selectedProject()!" />
  <button (click)="store.clearSelection()">Close</button>
} @else {
  <app-project-grid [projects]="store.projects()" />
}
```

## Testing

### Unit Test Example

```typescript
import { TestBed } from '@angular/core/testing';
import { ProjectStore } from './project.store';
import { ProjectService } from '../services/project.service';
import { of } from 'rxjs';

describe('MyComponent', () => {
  let store: InstanceType<typeof ProjectStore>;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectStore, ProjectService],
    });

    store = TestBed.inject(ProjectStore);
    projectService = TestBed.inject(ProjectService);
  });

  it('should load projects', () => {
    const mockProjects = [{ id: '1', title: 'Test', description: '', tags: [] }];
    vi.spyOn(projectService, 'getProjects').mockReturnValue(of(mockProjects));

    store.loadProjects();

    expect(store.projects()).toEqual(mockProjects);
    expect(store.isLoading()).toBe(false);
  });
});
```

## Best Practices

### 1. Component Architecture

```typescript
@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Always use OnPush
})
export class ProjectsComponent {
  // Inject store as readonly
  readonly store = inject(ProjectStore);

  // Initialize in ngOnInit
  ngOnInit() {
    this.store.loadProjects();
  }
}
```

### 2. Don't Mutate State Directly

```typescript
// ❌ DON'T
store.projects().push(newProject);

// ✅ DO - Use store methods
// Store handles immutable updates internally
```

### 3. Use Computed Selectors

```typescript
// ❌ DON'T - Compute in template
{
  {
    store.projects().filter((p) => p.tags.includes('Angular'));
  }
}

// ✅ DO - Use computed selector
{
  {
    store.projectsByTag()('Angular');
  }
}
```

### 4. Handle Loading States

```typescript
// ❌ DON'T - Ignore loading states
<div *ngFor="let project of store.projects()">

// ✅ DO - Show appropriate UI
@if (store.isLoading()) {
  <app-loader />
} @else {
  @for (project of store.projects(); track project.id) {
    ...
  }
}
```

### 5. Clean Up When Needed

```typescript
// For singleton stores (providedIn: 'root'), cleanup is optional
// For feature stores, consider resetting on destroy
ngOnDestroy() {
  if (this.shouldReset) {
    this.store.reset();
  }
}
```

## Migration from Service Pattern

### Before (Service + Component State)

```typescript
export class ProjectsComponent {
  private projectService = inject(ProjectService);
  projects = signal<Project[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.isLoading.set(true);
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
```

### After (SignalStore)

```typescript
export class ProjectsComponent {
  readonly store = inject(ProjectStore);

  ngOnInit() {
    this.store.loadProjects();
  }
}
```

## Benefits

1. **Less Boilerplate**: No need to manage state, loading, and error in each component
2. **Centralized State**: Single source of truth for project data
3. **Automatic Reactivity**: Changes propagate automatically through signals
4. **Type Safe**: Full TypeScript support
5. **Testable**: Easy to mock and test
6. **Composable**: Computed selectors can build on each other
7. **Performance**: OnPush compatible, fine-grained updates

## Resources

- [NgRx SignalStore Documentation](https://ngrx.io/guide/signals/signal-store)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Project Store Implementation](./project.store.ts)
- [Project Store Tests](./project.store.spec.ts)

---

For more patterns and examples, see the [Core README](./README.md) and [Main Documentation](../../../README.md).
