# Error Handler Service

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Global error handling service with user-friendly error messages, toast notifications, error logging, and external reporting support (Sentry-ready).

## Features

- ✅ **Global Error Handling**: Implements Angular's ErrorHandler interface
- ✅ **HTTP Error Handling**: User-friendly messages for all HTTP status codes
- ✅ **Signal-based State**: Reactive error storage with signals
- ✅ **Toast Notifications**: Automatic user notifications with ToastService integration
- ✅ **Error Severity Levels**: Automatic classification (low, medium, high, critical)
- ✅ **Error Storage**: Keep up to 50 most recent errors in memory
- ✅ **External Reporting**: Callback pattern for Sentry/external error reporting
- ✅ **Console Logging**: Formatted error logging with context
- ✅ **Type-safe**: Full TypeScript type safety with interfaces
- ✅ **Contextual Information**: Track error source, user actions, and additional data

## Quick Start

### 1. Register as Global Error Handler

In your app configuration (e.g., `app.config.ts`):

```typescript
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from '@shared/services';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    // ... other providers
  ],
};
```

### 2. Handle Errors Manually

In your components or services:

```typescript
import { Component, inject } from '@angular/core';
import { ErrorHandlerService } from '@shared/services';

@Component({
  selector: 'app-my-component',
  // ...
})
export class MyComponent {
  private errorHandler = inject(ErrorHandlerService);

  async loadData() {
    try {
      await this.fetchData();
    } catch (error) {
      this.errorHandler.handleError(error, {
        source: 'MyComponent',
        action: 'loadData',
        showToast: true,
        userMessage: 'Failed to load data. Please try again.',
      });
    }
  }
}
```

### 3. Handle HTTP Errors

```typescript
import { HttpErrorResponse } from '@angular/common/http';

this.http.get('/api/data').subscribe({
  error: (error: HttpErrorResponse) => {
    this.errorHandler.handleHttpError(error, {
      source: 'DataService',
      action: 'fetchData',
    });
  },
});
```

### 4. Set Up External Reporting

```typescript
import * as Sentry from '@sentry/angular';

// In app initialization
this.errorHandler.setupExternalReporting((error) => {
  Sentry.captureException(error);
});
```

## Usage

### Basic Error Handling

```typescript
try {
  // risky operation
  throw new Error('Something went wrong');
} catch (error) {
  this.errorHandler.handleError(error);
  // Shows toast notification automatically
}
```

### Error with Context

```typescript
this.errorHandler.handleError(error, {
  source: 'ProfileComponent',
  action: 'updateProfile',
  data: { userId: 123 },
  severity: 'high',
  showToast: true,
  userMessage: 'Failed to update profile',
});
```

### HTTP Error Handling

```typescript
// Handles 404, 401, 403, 500, network errors, etc.
this.errorHandler.handleHttpError(httpError, {
  source: 'ApiService',
  action: 'fetchUsers',
});
```

### Custom Severity

```typescript
this.errorHandler.handleError(error, {
  severity: 'low', // won't interrupt user much
  showToast: true,
});
```

### Silent Error Logging

```typescript
// Log error without showing toast
this.errorHandler.handleError(error, {
  showToast: false,
});
```

### Access Logged Errors

```typescript
// Get all errors (as a signal)
const errors = this.errorHandler.errors();

// Get error count
const count = this.errorHandler.getErrorCount();

// Filter by severity
const criticalErrors = this.errorHandler.getErrorsBySeverity('critical');
const highErrors = this.errorHandler.getErrorsBySeverity('high');

// Clear all errors
this.errorHandler.clearErrors();
```

### Disable Console Logging

```typescript
// Useful for production
this.errorHandler.setConsoleLogging(false);
```

## Service API

### `handleError(error: unknown, context?: ErrorContext): void`

Handle any error type (Error, HttpErrorResponse, string, object, etc.).

**Parameters:**
- `error` - The error to handle
- `context` - Optional error context

**Example:**
```typescript
this.errorHandler.handleError(new Error('Failed'), {
  source: 'MyComponent',
  action: 'saveData',
  showToast: true,
});
```

### `handleHttpError(error: HttpErrorResponse, context?: ErrorContext): void`

Handle HTTP errors with enhanced context.

**Parameters:**
- `error` - HTTP error response
- `context` - Optional error context

**Example:**
```typescript
this.errorHandler.handleHttpError(httpError, {
  source: 'ApiService',
  action: 'fetchData',
});
```

### `setupExternalReporting(reporter: (error: LoggedError) => void): void`

Configure external error reporting (e.g., Sentry).

**Parameters:**
- `reporter` - Callback function for external reporting

**Example:**
```typescript
this.errorHandler.setupExternalReporting((error) => {
  Sentry.captureException(error);
});
```

### `setConsoleLogging(enabled: boolean): void`

Enable or disable console logging.

**Parameters:**
- `enabled` - Whether to log errors to console

**Example:**
```typescript
this.errorHandler.setConsoleLogging(false);
```

### `clearErrors(): void`

Clear all logged errors from memory.

**Example:**
```typescript
this.errorHandler.clearErrors();
```

### `getErrorCount(): number`

Get the total number of logged errors.

**Returns:** Number of errors currently stored

**Example:**
```typescript
const count = this.errorHandler.getErrorCount();
console.log(`Total errors: ${count}`);
```

### `getErrorsBySeverity(severity: ErrorSeverity): LoggedError[]`

Filter logged errors by severity level.

**Parameters:**
- `severity` - Severity level to filter by

**Returns:** Array of errors matching the severity

**Example:**
```typescript
const criticalErrors = this.errorHandler.getErrorsBySeverity('critical');
console.log(`Critical errors: ${criticalErrors.length}`);
```

### `readonly errors: Signal<LoggedError[]>`

Readonly signal containing all logged errors (newest first).

**Example:**
```typescript
// In component
const errorList = this.errorHandler.errors();

// In template with signal syntax
@if (errorHandler.errors().length > 0) {
  <p>{{ errorHandler.errors().length }} errors occurred</p>
}
```

## Configuration Interfaces

### `ErrorContext`

```typescript
interface ErrorContext {
  /** Component or service where error occurred */
  source?: string;
  /** User action that triggered the error */
  action?: string;
  /** Additional context data */
  data?: Record<string, unknown>;
  /** Whether to show toast notification (default: true) */
  showToast?: boolean;
  /** Custom user-friendly message */
  userMessage?: string;
  /** Error severity level */
  severity?: ErrorSeverity;
}
```

### `LoggedError`

```typescript
interface LoggedError {
  /** Unique error ID */
  id: string;
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Error type (e.g., 'TypeError', 'HttpError') */
  type: string;
  /** Error context */
  context?: ErrorContext;
  /** Error severity */
  severity: ErrorSeverity;
  /** HTTP status code (for HTTP errors) */
  statusCode?: number;
}
```

### `ErrorSeverity`

```typescript
type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
```

## Error Severity Classification

The service automatically determines error severity based on error content:

### Critical Errors
- Out of memory errors
- Quota exceeded errors
- Cannot read property errors
- **Toast behavior**: Never auto-dismiss, user must manually close
- **Title**: "Critical Error"

### High Severity
- Failed operations
- HTTP 500 errors
- Network errors (status 0)
- **Toast behavior**: Auto-dismiss after 7 seconds
- **Title**: "Error"

### Medium Severity
- Generic errors
- HTTP 401/403 errors
- **Toast behavior**: Auto-dismiss after 7 seconds
- **Title**: "Warning"

### Low Severity
- HTTP 404 errors
- Explicitly set low severity
- **Toast behavior**: Auto-dismiss after 7 seconds
- **Title**: "Notice"

## HTTP Error Messages

User-friendly messages for common HTTP status codes:

| Status Code | User Message |
|-------------|-------------|
| 0 | Network error - please check your internet connection |
| 400 | Bad request - please check your input |
| 401 | Authentication required - please log in |
| 403 | Access denied - you don't have permission |
| 404 | Resource not found |
| 429 | Too many requests - please try again later |
| 500+ | Server error - please try again later |

## Toast Notifications

### Default Behavior

By default, all errors show a toast notification:

```typescript
this.errorHandler.handleError(error);
// Toast automatically shown
```

### Custom User Message

```typescript
this.errorHandler.handleError(error, {
  userMessage: 'Unable to save your changes. Please try again.',
});
```

### Disable Toast

```typescript
this.errorHandler.handleError(error, {
  showToast: false,
});
```

### Toast Titles by Severity

- **Critical**: "Critical Error"
- **High**: "Error"
- **Medium**: "Warning"
- **Low**: "Notice"

### Auto-Dismiss Behavior

- **Critical errors**: Never auto-dismiss (duration: 0)
- **All other severities**: Auto-dismiss after 7 seconds

## Error Storage

### Storage Limit

The service stores up to 50 most recent errors in memory:

```typescript
private readonly MAX_ERRORS = 50;
```

### Order

Errors are stored in reverse chronological order (newest first):

```typescript
const errors = this.errorHandler.errors();
console.log(errors[0]); // Most recent error
```

### Clearing Errors

```typescript
this.errorHandler.clearErrors();
```

## External Error Reporting

### Sentry Integration

```typescript
import * as Sentry from '@sentry/angular';

// In app initialization
this.errorHandler.setupExternalReporting((error) => {
  Sentry.captureException({
    message: error.message,
    level: error.severity,
    contexts: {
      error: {
        id: error.id,
        type: error.type,
        timestamp: error.timestamp,
      },
      app: error.context,
    },
  });
});
```

### Custom Reporting

```typescript
this.errorHandler.setupExternalReporting((error) => {
  // Send to your custom error tracking service
  fetch('/api/errors', {
    method: 'POST',
    body: JSON.stringify({
      message: error.message,
      severity: error.severity,
      timestamp: error.timestamp,
      context: error.context,
    }),
  });
});
```

### Error Reporter Safety

If the external reporter throws an error, it's caught and logged:

```typescript
// Won't crash your app if reporter fails
this.errorHandler.setupExternalReporting(() => {
  throw new Error('Reporter failed');
});
```

## Console Logging

### Default Format

```
[ErrorHandler HIGH] TypeError: Cannot read property 'name' of undefined
Context: {
  "source": "ProfileComponent",
  "action": "loadProfile",
  "data": { "userId": 123 }
}
Stack trace...
```

### Disable Console Logging

```typescript
// Useful for production
this.errorHandler.setConsoleLogging(false);
```

## Best Practices

### 1. Provide Context

Always provide context when handling errors manually:

```typescript
// Good
this.errorHandler.handleError(error, {
  source: 'UserService',
  action: 'updateEmail',
  data: { userId: user.id },
});

// Less helpful
this.errorHandler.handleError(error);
```

### 2. Use Appropriate Severity

Override severity when the automatic classification isn't appropriate:

```typescript
// Expected error, not critical
this.errorHandler.handleError(error, {
  severity: 'low',
  userMessage: 'This feature is not available in your region',
});
```

### 3. Custom User Messages

Provide clear, actionable user messages:

```typescript
// Good
this.errorHandler.handleError(error, {
  userMessage: 'Failed to upload file. Please check the file size is under 5MB.',
});

// Less helpful
this.errorHandler.handleError(error, {
  userMessage: 'An error occurred',
});
```

### 4. Use handleHttpError for HTTP Errors

```typescript
// Good
this.errorHandler.handleHttpError(httpError);

// Less ideal (doesn't include HTTP-specific handling)
this.errorHandler.handleError(httpError);
```

### 5. Set Up External Reporting Early

```typescript
// In app.component.ts or app initialization
ngOnInit() {
  if (environment.production) {
    this.errorHandler.setupExternalReporting(this.sentryReporter);
  }
}
```

### 6. Monitor Critical Errors

```typescript
// Create a monitoring component or service
const criticalErrors = computed(() =>
  this.errorHandler.errors().filter(e => e.severity === 'critical')
);

effect(() => {
  if (criticalErrors().length > 0) {
    // Alert admin, show UI warning, etc.
  }
});
```

## Testing

Comprehensive unit tests are provided with 49 test cases:

```bash
npm test
```

### Test Coverage

- ✅ Service creation and initialization
- ✅ Error handling (Error objects, HTTP errors, unknown types)
- ✅ Error context storage
- ✅ Toast notifications
- ✅ Error storage and limits
- ✅ Error severity determination
- ✅ External reporting
- ✅ Console logging
- ✅ Signal reactivity
- ✅ User-friendly messages

### Mocking in Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { ToastService } from '../toast/toast.service';

describe('MyComponent', () => {
  let errorHandler: ErrorHandlerService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService, ToastService],
    });
    errorHandler = TestBed.inject(ErrorHandlerService);
    toastService = TestBed.inject(ToastService);
  });

  it('should handle error', () => {
    const toastSpy = vi.spyOn(toastService, 'error');

    errorHandler.handleError(new Error('Test error'));

    expect(errorHandler.getErrorCount()).toBe(1);
    expect(toastSpy).toHaveBeenCalled();
  });
});
```

## Architecture

```
services/
├── error-handler/
│   ├── error-handler.service.ts       # Service implementation
│   ├── error-handler.service.spec.ts  # Unit tests (49 tests)
│   └── README.md                      # This file
└── index.ts                           # Barrel export
```

## Dependencies

### Angular Core
- `@angular/core` - Injectable, inject, signal, ErrorHandler
- `@angular/common/http` - HttpErrorResponse

### Internal Services
- `ToastService` - For error notifications

## Common Integration Patterns

### With HTTP Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '@shared/services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error) => {
      errorHandler.handleHttpError(error, {
        source: 'HTTP Interceptor',
        data: { url: req.url, method: req.method },
      });
      throw error;
    })
  );
};
```

### With Form Validation

```typescript
export class FormComponent {
  private errorHandler = inject(ErrorHandlerService);

  onSubmit() {
    if (this.form.invalid) {
      this.errorHandler.handleError(
        new Error('Form validation failed'),
        {
          severity: 'low',
          userMessage: 'Please check the form for errors',
          showToast: true,
        }
      );
      return;
    }
    // Submit form...
  }
}
```

### With Reactive State

```typescript
export class ErrorLogComponent {
  private errorHandler = inject(ErrorHandlerService);

  // Reactive error list
  errors = this.errorHandler.errors;
  errorCount = computed(() => this.errors().length);
  criticalCount = computed(() =>
    this.errors().filter(e => e.severity === 'critical').length
  );

  clearAll() {
    this.errorHandler.clearErrors();
  }
}
```

### Error Log Display

```typescript
@Component({
  selector: 'app-error-log',
  template: `
    <div class="error-log">
      <h3>Error Log ({{ errorHandler.getErrorCount() }})</h3>

      @for (error of errorHandler.errors(); track error.id) {
        <div class="error-item" [class]="'severity-' + error.severity">
          <span class="timestamp">{{ error.timestamp | date:'short' }}</span>
          <span class="type">{{ error.type }}</span>
          <span class="message">{{ error.message }}</span>
          @if (error.context?.source) {
            <span class="source">{{ error.context.source }}</span>
          }
        </div>
      }

      <button (click)="errorHandler.clearErrors()">Clear All</button>
    </div>
  `,
})
export class ErrorLogComponent {
  errorHandler = inject(ErrorHandlerService);
}
```

## Troubleshooting

### Toast Not Showing

1. Ensure ToastService is properly configured
2. Check that `showToast` is not set to `false`
3. Verify toast container is in the DOM

### Errors Not Being Logged

1. Check that the error is actually being thrown
2. Verify ErrorHandlerService is registered as ErrorHandler provider
3. Check console logging is enabled: `setConsoleLogging(true)`

### External Reporter Not Called

1. Verify reporter was set up: `setupExternalReporting()`
2. Check for errors in the reporter callback
3. Look for console errors about failed reporting

### Memory Issues with Error Storage

The service automatically limits stored errors to 50. If you need more:

```typescript
// Note: MAX_ERRORS is private, you'd need to modify the service
// Or clear errors periodically
setInterval(() => {
  const errors = this.errorHandler.errors();
  if (errors.length > 100) {
    this.errorHandler.clearErrors();
  }
}, 60000); // Every minute
```

## Performance

- **Signal-based**: Efficient reactive state management
- **Error Limit**: Automatically limits to 50 errors to prevent memory issues
- **Tree-shakeable**: Provided at root level for optimal bundle size
- **Lazy Toast**: Only creates toast notifications when needed

## License

Part of the MoodyJW Portfolio project.
