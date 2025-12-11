# Testing Guide

Comprehensive guide to testing in the MoodyJW Portfolio project.

## Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Test Organization](#test-organization)
4. [Unit Testing](#unit-testing)
5. [E2E Testing](#e2e-testing)
6. [Coverage Requirements](#coverage-requirements)
7. [Best Practices](#best-practices)
8. [Mocking Strategies](#mocking-strategies)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This project follows Test-Driven Development (TDD) principles and maintains high test coverage standards. All code must be tested before merge.

### Testing Philosophy

- **TDD Preferred**: Write tests first when possible
- **Test-After Acceptable**: Tests can be written after implementation
- **Coverage Goals**: 85% overall, 80% minimum
- **Quality Over Quantity**: Focus on meaningful tests

### Current Metrics

- **Unit Tests**: 2,569+ passing (2 skipped)
- **E2E Tests**: 170 passing (40 skipped)
- **Test Coverage**: >95% statement/line coverage
- **Test Files**: 51+ spec files

---

## Testing Stack

### Unit Testing

- **Framework**: Vitest 4.0.14
- **DOM Simulation**: jsdom
- **Angular Testing**: @angular/core/testing
- **Utilities**: Testing Library patterns

### E2E Testing

- **Framework**: Playwright 1.56.0
- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Mobile, Tablet, Desktop, 4K
- **Accessibility**: axe-core integration

### Code Coverage

- **Tool**: Vitest coverage (v8 provider)
- **Reporters**: HTML, JSON, text-summary
- **Thresholds**: Configured in vitest.config.ts

---

## Test Organization

### Directory Structure

```
src/
├── app/
│   ├── core/
│   │   └── theme/
│   │       ├── theme.service.ts
│   │       └── theme.service.spec.ts
│   ├── shared/
│   │   ├── components/
│   │   │   └── button/
│   │   │       ├── button.component.ts
│   │   │       └── button.component.spec.ts
│   │   ├── services/
│   │   │   └── analytics/
│   │   │       ├── analytics.service.ts
│   │   │       └── analytics.service.spec.ts
│   │   └── utilities/
│   │       └── date/
│   │           ├── date.utils.ts
│   │           └── date.utils.spec.ts
│   └── features/
│       └── home/
│           ├── home.component.ts
│           └── home.component.spec.ts
└── e2e/
    ├── home.spec.ts
    ├── theme.spec.ts
    └── accessibility.spec.ts
```

### Naming Conventions

- **Unit Tests**: `*.spec.ts` (colocated with source)
- **E2E Tests**: `*.spec.ts` (in `e2e/` directory)
- **Test Utilities**: `*.test-utils.ts`
- **Mocks**: `*.mock.ts`

---

## Unit Testing

### Component Testing

#### Basic Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent], // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should emit click event', () => {
    let clicked = false;
    component.clicked.subscribe(() => (clicked = true));

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(clicked).toBe(true);
  });
});
```

#### Testing Signal-Based Components

```typescript
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
  });

  it('should increment count signal', () => {
    expect(component.count()).toBe(0);
    component.increment();
    expect(component.count()).toBe(1);
  });

  it('should update computed value', () => {
    component.count.set(5);
    expect(component.doubled()).toBe(10);
  });
});
```

### Service Testing

#### Basic Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track page view', () => {
    const spy = vi.spyOn(service, 'trackPageView');
    service.trackPageView('/home', 'Home');
    expect(spy).toHaveBeenCalledWith('/home', 'Home');
  });
});
```

#### Testing Services with Dependencies

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch projects', (done) => {
    const mockProjects = [{ id: '1', title: 'Test' }];

    service.getAll().subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
      done();
    });

    const req = httpMock.expectOne('/api/projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });
});
```

### Utility Function Testing

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, timeAgo } from './date.utils';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date as ISO string', () => {
      const date = new Date('2025-01-01T00:00:00Z');
      expect(formatDate(date, 'iso')).toBe('2025-01-01');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(new Date('invalid'), 'iso')).toBe('');
    });
  });

  describe('timeAgo', () => {
    it('should return "just now" for recent dates', () => {
      const now = new Date();
      expect(timeAgo(now)).toBe('just now');
    });

    it('should return hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(timeAgo(twoHoursAgo)).toBe('2 hours ago');
    });
  });
});
```

### Pipe Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DateAgoPipe } from './date-ago.pipe';

describe('DateAgoPipe', () => {
  let pipe: DateAgoPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateAgoPipe],
    });
    pipe = TestBed.inject(DateAgoPipe);
  });

  it('should transform date to relative time', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(pipe.transform(twoHoursAgo)).toBe('2 hours ago');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
```

---

## E2E Testing

### Basic E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /jason moody/i })).toBeVisible();
  });

  test('should navigate to projects', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL(/\/projects/);
  });
});
```

### Accessibility Testing

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Visual Regression Testing

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });
});
```

---

## Coverage Requirements

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### Coverage Goals

- **Overall**: 85% (goal), 80% (minimum)
- **Components**: >90%
- **Services**: >95%
- **Utilities**: >95%
- **Pipes**: >90%

### Signal Coverage Note

Angular signals (`input()`, `computed()`, `signal()`) create branches that may lower branch coverage to 70-75% even with complete test coverage. **Statement and line coverage are the primary metrics** for signal-heavy components.

---

## Best Practices

### DO: Write Focused Tests

```typescript
// ✅ Good: Focused, single assertion
it('should set theme to dark', () => {
  service.setTheme('nocturne');
  expect(service.currentTheme()).toBe('nocturne');
});

// ❌ Bad: Multiple unrelated assertions
it('should handle themes', () => {
  service.setTheme('nocturne');
  expect(service.currentTheme()).toBe('nocturne');
  service.setTheme('lumen');
  expect(service.currentTheme()).toBe('lumen');
  expect(localStorage.getItem('theme')).toBe('lumen');
});
```

### DO: Use Descriptive Test Names

```typescript
// ✅ Good: Clear what is being tested
it('should return empty string when input is null', () => {});

// ❌ Bad: Vague test name
it('should work', () => {});
```

### DO: Test Edge Cases

```typescript
describe('truncate', () => {
  it('should handle null input', () => {
    expect(truncate(null, 10)).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncate(undefined, 10)).toBe('');
  });

  it('should handle empty string', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('should handle text shorter than max length', () => {
    expect(truncate('short', 10)).toBe('short');
  });
});
```

### DON'T: Test Implementation Details

```typescript
// ❌ Bad: Testing private implementation
it('should call private method', () => {
  const spy = vi.spyOn(component as any, 'privateMethod');
  component.publicMethod();
  expect(spy).toHaveBeenCalled();
});

// ✅ Good: Testing public behavior
it('should update count when button is clicked', () => {
  component.increment();
  expect(component.count()).toBe(1);
});
```

### DON'T: Use Real Timers

```typescript
// ❌ Bad: Real timers make tests slow
it('should debounce calls', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // ...
});

// ✅ Good: Use fake timers
it('should debounce calls', () => {
  vi.useFakeTimers();
  // Test debounce logic
  vi.advanceTimersByTime(500);
  vi.useRealTimers();
});
```

---

## Mocking Strategies

### Mocking Services

```typescript
import { vi } from 'vitest';

const mockAnalyticsService = {
  trackPageView: vi.fn(),
  trackEvent: vi.fn(),
};

TestBed.configureTestingModule({
  providers: [{ provide: AnalyticsService, useValue: mockAnalyticsService }],
});
```

### Mocking HTTP Calls

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});

const httpMock = TestBed.inject(HttpTestingController);

// Make request
service.getData().subscribe();

// Verify and respond
const req = httpMock.expectOne('/api/data');
req.flush({ data: 'test' });

// Verify no outstanding requests
httpMock.verify();
```

### Mocking LocalStorage

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

---

## Common Patterns

### Testing Observables

```typescript
import { TestScheduler } from 'rxjs/testing';

describe('Observable Tests', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should emit values over time', () => {
    scheduler.run(({ expectObservable }) => {
      const source$ = interval(1000).pipe(take(3));
      const expected = '1s a 999ms b 999ms (c|)';
      expectObservable(source$).toBe(expected, { a: 0, b: 1, c: 2 });
    });
  });
});
```

### Testing Forms

```typescript
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

describe('ContactForm', () => {
  it('should validate email', () => {
    const form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    form.controls['email'].setValue('invalid');
    expect(form.controls['email'].invalid).toBe(true);

    form.controls['email'].setValue('valid@example.com');
    expect(form.controls['email'].valid).toBe(true);
  });
});
```

### Testing Async Operations

```typescript
it('should load data asynchronously', async () => {
  const data = await service.getData().toPromise();
  expect(data).toBeDefined();
});

// Or with done callback
it('should load data asynchronously', (done) => {
  service.getData().subscribe((data) => {
    expect(data).toBeDefined();
    done();
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Tests Timeout

```typescript
// Increase timeout for slow tests
it(
  'should handle slow operation',
  async () => {
    // Test code
  },
  { timeout: 10000 }
);
```

#### 2. Memory Leaks

```typescript
// Always unsubscribe in tests
let subscription: Subscription;

afterEach(() => {
  subscription?.unsubscribe();
});
```

#### 3. Flaky Tests

```typescript
// Use waitFor for async updates
import { waitFor } from '@testing-library/dom';

await waitFor(() => {
  expect(element).toBeVisible();
});
```

#### 4. DOM Not Updating

```typescript
// Call fixture.detectChanges() after changes
component.value.set('new value');
fixture.detectChanges(); // Trigger change detection
```

---

## Running Tests

### Commands

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test:file src/app/shared/services/analytics/analytics.service.spec.ts

# Run E2E tests
npm run e2e

# Run E2E tests in headed mode
npm run e2e:headed

# Run E2E tests in UI mode
npm run e2e:ui
```

### CI/CD Integration

Tests run automatically on:

- Every push to any branch
- Every pull request
- Before deployment

All tests must pass before merge.

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Testing Library](https://testing-library.com/)
- [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)

---

**Last Updated**: December 9, 2025
**Maintainer**: Jay Moody
