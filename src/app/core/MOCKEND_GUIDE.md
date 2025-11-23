# Mockend Data Layer Quick Reference

## Overview

The Mockend pattern provides a mock backend using local JSON files and HttpClient, enabling realistic development without a real API.

## Files Structure

```
src/
├── app/
│   └── core/
│       ├── models/
│       │   └── project.model.ts          # Project interface
│       ├── services/
│       │   └── project.service.ts        # Data fetching service
│       ├── interceptors/
│       │   └── latency.interceptor.ts    # Network simulation
│       └── app.config.ts                 # HTTP client setup
└── assets/
    └── data/
        └── projects.json                 # Mock data
```

## Project Model

```typescript
interface Project {
  id: string;           // Unique identifier
  title: string;        // Display title
  description: string;  // Detailed description
  tags: string[];       // Technology tags
}
```

## Using the ProjectService

### Inject the Service

```typescript
import { inject } from '@angular/core';
import { ProjectService } from '@core/services';

export class MyComponent {
  private projectService = inject(ProjectService);
}
```

### Get All Projects

```typescript
this.projectService.getProjects().subscribe({
  next: (projects) => console.log(projects),
  error: (err) => console.error(err)
});
```

### Get Single Project by ID

```typescript
this.projectService.getProjectById('enterprise-dashboard').subscribe({
  next: (project) => console.log(project),
  error: (err) => console.error(err)
});
```

## Latency Interceptor

The `latencyInterceptor` automatically adds a random delay (500-1000ms) to all HTTP requests.

**Benefits:**
- Test loading states and spinners
- Simulate real network conditions
- Identify race conditions
- Improve UX during slow connections

**Configuration** (already set up in `app.config.ts`):
```typescript
provideHttpClient(
  withInterceptors([latencyInterceptor])
)
```

## Adding New Mock Data

### 1. Create JSON File

Create `src/assets/data/your-data.json`:
```json
[
  { "id": "1", "name": "Item 1" },
  { "id": "2", "name": "Item 2" }
]
```

### 2. Create Model

Create `src/app/core/models/your-model.model.ts`:
```typescript
export interface YourModel {
  id: string;
  name: string;
}
```

### 3. Create Service

Create `src/app/core/services/your-data.service.ts`:
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YourModel } from '../models/your-model.model';

@Injectable({
  providedIn: 'root',
})
export class YourDataService {
  private readonly http = inject(HttpClient);
  private readonly dataUrl = '/assets/data/your-data.json';

  getData(): Observable<YourModel[]> {
    return this.http.get<YourModel[]>(this.dataUrl);
  }
}
```

## Transitioning to Real API

When ready to connect to a real backend:

### 1. Update Service URL

```typescript
// Before (Mockend)
private readonly projectsUrl = '/assets/data/projects.json';

// After (Real API)
private readonly projectsUrl = 'https://api.example.com/projects';
```

### 2. Optionally Disable Latency Interceptor

In `app.config.ts`:
```typescript
// Remove or comment out for production
provideHttpClient(
  // withInterceptors([latencyInterceptor])  // Disabled
)
```

### 3. Add Error Handling

```typescript
this.projectService.getProjects().pipe(
  catchError(error => {
    // Handle API errors
    return of([]);
  })
).subscribe(projects => {
  // Handle data
});
```

## Best Practices

1. ✅ **Use HttpClient**: Enables easy transition to real APIs
2. ✅ **Strong Typing**: Define models for all data structures
3. ✅ **inject() Function**: Use modern dependency injection
4. ✅ **Observables**: Return Observables for async operations
5. ✅ **Error Handling**: Always handle potential errors
6. ✅ **Loading States**: Use the simulated latency to test UX
7. ✅ **Consistent Structure**: Follow the established patterns

## Testing

The latency interceptor is perfect for testing:
- Loading indicators and spinners
- Skeleton screens
- Error states
- User feedback during data fetching
- Race condition handling

## Tips

- **Development**: Keep latency interceptor enabled for realistic testing
- **Production**: Remove or disable the latency interceptor
- **E2E Tests**: Consider disabling latency for faster test execution
- **Unit Tests**: Mock the service to avoid HTTP calls

---

For more details, see:
- [Core README](./README.md)
- [Project Documentation](../../../README.md)
- [Copilot Instructions](../../../.github/copilot-instructions.md)
