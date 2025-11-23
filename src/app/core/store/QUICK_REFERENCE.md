# NgRx SignalStore Quick Reference

## Installation

```bash
npm install @ngrx/signals --legacy-peer-deps
```

## Basic Usage

### Inject Store

```typescript
readonly store = inject(ProjectStore);
```

### Access State

```typescript
store.projects(); // Array<Project>
store.selectedProject(); // Project | null
store.isLoading(); // boolean
store.error(); // string | null
```

### Computed Selectors

```typescript
store.projectCount(); // number
store.projectsByTag()(tag); // Array<Project>
store.hasSelection(); // boolean
store.allTags(); // string[]
```

### Methods

```typescript
store.loadProjects(); // Load all projects
store.loadProjectById(id); // Load specific project
store.selectProject(project); // Set selected project
store.clearSelection(); // Clear selection
store.clearError(); // Clear error
store.reset(); // Reset to initial state
```

## Template Examples

### Loading State

```html
@if (store.isLoading()) {
<app-loader />
} @else if (store.error()) {
<app-error [message]="store.error()" />
} @else {
<!-- Content -->
}
```

### Project List

```html
@for (project of store.projects(); track project.id) {
<app-project-card [project]="project" />
}
```

### Filtered List

```html
@for (project of store.projectsByTag()('Angular'); track project.id) {
<app-project-card [project]="project" />
}
```

### Tags Filter

```html
@for (tag of store.allTags(); track tag) {
<button (click)="filterByTag(tag)">{{ tag }}</button>
}
```

## Component Setup

```typescript
@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  readonly store = inject(ProjectStore);

  ngOnInit() {
    this.store.loadProjects();
  }
}
```

## Testing

```typescript
describe('ProjectStore', () => {
  let store: InstanceType<typeof ProjectStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectStore, ProjectService],
    });
    store = TestBed.inject(ProjectStore);
  });

  it('should load projects', () => {
    vi.spyOn(projectService, 'getProjects').mockReturnValue(of(mockProjects));

    store.loadProjects();

    expect(store.projects()).toEqual(mockProjects);
  });
});
```

## File Locations

- **Store**: `src/app/core/store/project.store.ts`
- **Tests**: `src/app/core/store/project.store.spec.ts`
- **Service**: `src/app/core/services/project.service.ts`
- **Model**: `src/app/core/models/project.model.ts`
- **Data**: `src/assets/data/projects.json`

## Documentation

- [Full Guide](./SIGNAL_STORE_GUIDE.md)
- [Integration Example](../STORE_SERVICE_INTEGRATION.md)
- [Core README](../README.md)

## Tips

✅ Always use `readonly` when injecting store
✅ Use `ChangeDetectionStrategy.OnPush` with signals
✅ Call methods in `ngOnInit`, not in constructor
✅ Use `track` in `@for` loops for performance
✅ Handle loading and error states in templates
✅ Use computed selectors instead of filtering in templates
