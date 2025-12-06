# Logger Service

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Structured logging service with configurable log levels, console abstraction, and performance timing capabilities.

## Features

- ✅ **Log Levels**: Debug, Info, Warn, Error with filtering
- ✅ **Environment-Aware**: Auto-configures for development/production
- ✅ **Context Logging**: Create scoped loggers with automatic context tags
- ✅ **Performance Timing**: Built-in timer utilities for measuring operations
- ✅ **Log History**: Stores recent logs in development mode (configurable)
- ✅ **Console Abstraction**: Centralized control over console output
- ✅ **Grouping & Tables**: Support for grouped logs and tabular data
- ✅ **Configurable Formatting**: Timestamps, prefixes, and context display
- ✅ **Type-safe**: Full TypeScript type safety with enums and interfaces
- ✅ **Zero Dependencies**: Pure TypeScript implementation

## Quick Start

### 1. Inject the Service

```typescript
import { Component, inject } from '@angular/core';
import { LoggerService } from '@shared/services';

@Component({
  selector: 'app-my-component',
  //...
})
export class MyComponent {
  private logger = inject(LoggerService);

  ngOnInit() {
    this.logger.info('Component initialized');
    this.logger.debug('Debug data:', this.data);
  }
}
```

### 2. Create Context Logger

```typescript
export class UserService {
  private logger = inject(LoggerService).createLogger('UserService');

  getUser(id: string) {
    this.logger.info('Fetching user', { id });
    // All logs automatically include [UserService] context
  }
}
```

### 3. Performance Timing

```typescript
async loadData() {
  this.logger.startTimer('data-load');

  await this.fetchData();

  this.logger.endTimer('data-load'); // Logs: "⏱️ data-load: 123.45ms"
}
```

## Usage

### Basic Logging

```typescript
// Debug (only in development)
this.logger.debug('Debug message', { data: 'value' });

// Info
this.logger.info('User logged in', { userId: 123 });

// Warning
this.logger.warn('API rate limit approaching');

// Error
this.logger.error('Failed to save', error);
```

### Log Levels

```typescript
import { LogLevel } from '@shared/services';

// Set minimum log level
this.logger.setLevel(LogLevel.Warn); // Only Warn and Error will log

// Available levels
LogLevel.Debug  // 0 - Most verbose
LogLevel.Info   // 1
LogLevel.Warn   // 2
LogLevel.Error  // 3
LogLevel.None   // 4 - No logging
```

### Configuration

```typescript
this.logger.configure({
  level: LogLevel.Info,
  showTimestamp: true,
  showContext: true,
  prefix: 'MyApp',
});

// Output: [MyApp] [12:34:56.789] [UserService] User logged in
```

### Context Loggers

```typescript
// Create a logger with automatic context
const logger = this.logger.createLogger('DataService');

logger.info('Loading data');    // [DataService] Loading data
logger.warn('Slow response');   // [DataService] Slow response
logger.error('Failed', error);  // [DataService] Failed
```

### Performance Timing

```typescript
// Manual timing
this.logger.startTimer('api-call');
await this.api.fetchData();
const duration = this.logger.endTimer('api-call'); // Returns ms

// Automatic timing with measure()
const result = await this.logger.measure('async-operation', async () => {
  return await this.expensiveOperation();
});
```

### Grouping

```typescript
this.logger.group('User Details');
this.logger.info('Name:', user.name);
this.logger.info('Email:', user.email);
this.logger.groupEnd();

// Collapsed group
this.logger.group('Advanced Settings', true); // Starts collapsed
```

### Table Logging

```typescript
const users = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
];

this.logger.table(users);

// With specific columns
this.logger.table(users, ['id', 'name']);
```

### Assertions

```typescript
this.logger.assert(user.isValid(), 'User must be valid');
// Logs error if condition is false
```

### Log History

```typescript
// Get recent logs (development only)
const history = this.logger.getHistory();

history.forEach(entry => {
  console.log(entry.level, entry.message, entry.timestamp);
});

// Clear history
this.logger.clearHistory();
```

## Service API

### Logging Methods

#### `debug(message: string, ...data: unknown[]): void`

Log a debug message (only in development).

**Example:**
```typescript
this.logger.debug('Component state:', this.state);
```

#### `info(message: string, ...data: unknown[]): void`

Log an informational message.

**Example:**
```typescript
this.logger.info('Data loaded successfully', { count: data.length });
```

#### `warn(message: string, ...data: unknown[]): void`

Log a warning message.

**Example:**
```typescript
this.logger.warn('Deprecated method used');
```

#### `error(message: string, error?: Error | unknown, ...data: unknown[]): void`

Log an error message.

**Example:**
```typescript
this.logger.error('Failed to save user', error, { userId: 123 });
```

### Configuration Methods

#### `configure(config: LoggerConfig): void`

Configure logger settings.

**Example:**
```typescript
this.logger.configure({
  level: LogLevel.Warn,
  showTimestamp: false,
  prefix: 'APP',
});
```

#### `setLevel(level: LogLevel): void`

Set the minimum log level.

**Example:**
```typescript
this.logger.setLevel(LogLevel.Error); // Only errors will log
```

### Context Logger

#### `createLogger(context: string)`

Create a scoped logger with automatic context.

**Returns:** Logger object with debug, info, warn, error methods

**Example:**
```typescript
const logger = this.logger.createLogger('AuthService');
logger.info('User authenticated'); // [AuthService] User authenticated
```

### Performance Methods

#### `startTimer(label: string): void`

Start a performance timer.

**Example:**
```typescript
this.logger.startTimer('data-processing');
```

#### `endTimer(label: string): number | undefined`

End a performance timer and log duration.

**Returns:** Duration in milliseconds or undefined if timer not found

**Example:**
```typescript
const ms = this.logger.endTimer('data-processing');
console.log(`Took ${ms}ms`);
```

#### `measure<T>(label: string, operation: () => Promise<T>): Promise<T>`

Measure execution time of an async operation.

**Returns:** Result of the operation

**Example:**
```typescript
const data = await this.logger.measure('fetch-users', () =>
  this.http.get<User[]>('/api/users').toPromise()
);
```

#### `getActiveTimers(): Map<string, PerformanceEntry>`

Get all currently running timers.

**Example:**
```typescript
const timers = this.logger.getActiveTimers();
console.log(`${timers.size} timers running`);
```

### Grouping & Formatting Methods

#### `group(label: string, collapsed?: boolean): void`

Start a log group.

**Example:**
```typescript
this.logger.group('Component Lifecycle');
this.logger.info('ngOnInit called');
this.logger.groupEnd();
```

#### `groupEnd(): void`

End the current log group.

#### `table(data: unknown, columns?: string[]): void`

Log data as a table.

**Example:**
```typescript
this.logger.table(users, ['id', 'name', 'email']);
```

#### `assert(condition: boolean, message: string): void`

Assert a condition and log error if false.

**Example:**
```typescript
this.logger.assert(data.length > 0, 'Data must not be empty');
```

#### `clear(): void`

Clear the console (development only).

### History Methods

#### `getHistory(): LogEntry[]`

Get log history (development only).

**Returns:** Array of log entries

**Example:**
```typescript
const logs = this.logger.getHistory();
console.log(`${logs.length} logs in history`);
```

#### `clearHistory(): void`

Clear log history.

## Configuration Interfaces

### `LoggerConfig`

```typescript
interface LoggerConfig {
  /** Minimum log level to display */
  level?: LogLevel;
  /** Whether to include timestamps (default: true) */
  showTimestamp?: boolean;
  /** Whether to include source context (default: true) */
  showContext?: boolean;
  /** Custom prefix for all logs (default: '') */
  prefix?: string;
}
```

### `LogLevel`

```typescript
enum LogLevel {
  Debug = 0,  // Most verbose
  Info = 1,
  Warn = 2,
  Error = 3,
  None = 4,   // No logging
}
```

### `LogEntry`

```typescript
interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Timestamp */
  timestamp: Date;
  /** Optional context/source */
  context?: string;
  /** Optional additional data */
  data?: unknown[];
}
```

### `PerformanceEntry`

```typescript
interface PerformanceEntry {
  /** Label for the timing */
  label: string;
  /** Start time in milliseconds */
  startTime: number;
  /** End time in milliseconds */
  endTime?: number;
  /** Duration in milliseconds */
  duration?: number;
}
```

## Environment-Aware Logging

### Development Mode

In development (`ng serve`):
- Default level: `LogLevel.Debug` (all logs shown)
- Log history enabled (last 100 entries)
- All console methods available

### Production Mode

In production (`ng build`):
- Default level: `LogLevel.Warn` (only warnings and errors)
- Log history disabled
- Reduced console output

### Override for Production

```typescript
// In app initialization
if (environment.production) {
  logger.setLevel(LogLevel.Error); // Only errors
} else {
  logger.setLevel(LogLevel.Debug); // Everything
}
```

## Common Patterns

### Service with Context Logger

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService).createLogger('UserService');

  async getUser(id: string): Promise<User> {
    this.logger.info('Fetching user', { id });

    try {
      return await this.logger.measure('fetch-user', () =>
        firstValueFrom(this.http.get<User>(`/api/users/${id}`))
      );
    } catch (error) {
      this.logger.error('Failed to fetch user', error, { id });
      throw error;
    }
  }
}
```

### Component Lifecycle Logging

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private logger = inject(LoggerService).createLogger('MyComponent');

  ngOnInit() {
    this.logger.info('Component initialized');
    this.logger.debug('Initial state:', this.state);
  }

  ngOnDestroy() {
    this.logger.info('Component destroyed');
  }
}
```

### Performance Monitoring

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private logger = inject(LoggerService);

  async loadLargeDataset() {
    this.logger.startTimer('data-load');

    const data = await this.fetchData();

    const duration = this.logger.endTimer('data-load');

    if (duration && duration > 1000) {
      this.logger.warn(`Slow data load: ${duration}ms`);
    }

    return data;
  }
}
```

### Error Tracking with Context

```typescript
try {
  await this.performOperation();
} catch (error) {
  this.logger.error('Operation failed', error, {
    operation: 'saveUser',
    userId: this.userId,
    timestamp: new Date(),
  });
}
```

### Debugging Complex State

```typescript
this.logger.group('State Update');
this.logger.debug('Previous state:', previousState);
this.logger.debug('New state:', newState);
this.logger.debug('Changes:', diff);
this.logger.groupEnd();
```

### API Response Logging

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const logger = this.logger.createLogger('HTTP');

  logger.info(`${req.method} ${req.url}`);
  logger.startTimer(req.url);

  return next.handle(req).pipe(
    tap({
      next: () => {
        logger.endTimer(req.url);
        logger.info('Request successful');
      },
      error: (error) => {
        logger.endTimer(req.url);
        logger.error('Request failed', error);
      },
    })
  );
}
```

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// Good
this.logger.debug('Detailed state:', complexObject); // Dev only
this.logger.info('User action completed');           // Important events
this.logger.warn('Deprecated API used');             // Potential issues
this.logger.error('Critical failure', error);        // Actual errors

// Avoid
this.logger.error('User clicked button'); // Not an error
this.logger.debug('App started');         // Use info
```

### 2. Create Context Loggers for Services

```typescript
// Good - automatic context
const logger = this.logger.createLogger('AuthService');
logger.info('Token refreshed');

// Less ideal - manual context every time
this.logger.info('[AuthService] Token refreshed');
```

### 3. Include Relevant Data

```typescript
// Good - actionable information
this.logger.error('Failed to save user', error, {
  userId: user.id,
  operation: 'update',
  fields: changedFields,
});

// Less helpful
this.logger.error('Error occurred');
```

### 4. Use Timers for Performance

```typescript
// Measure critical paths
this.logger.startTimer('initial-load');
await this.loadCriticalData();
this.logger.endTimer('initial-load');

// Or use measure() for cleaner code
const data = await this.logger.measure('api-call', () =>
  this.api.fetch()
);
```

### 5. Leverage Grouping for Related Logs

```typescript
this.logger.group('Form Validation');
this.logger.debug('Email:', emailValid);
this.logger.debug('Password:', passwordValid);
this.logger.debug('Terms:', termsAccepted);
this.logger.groupEnd();
```

### 6. Disable Verbose Logging in Production

```typescript
// In app config
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (logger: LoggerService) => () => {
        if (environment.production) {
          logger.setLevel(LogLevel.Warn);
        }
      },
      deps: [LoggerService],
      multi: true,
    },
  ],
};
```

## Testing

Comprehensive unit tests are provided with 57 test cases:

```bash
npm test
```

### Test Coverage

- ✅ Service creation and initialization
- ✅ All log levels (debug, info, warn, error)
- ✅ Log level filtering
- ✅ Configuration options
- ✅ Context loggers
- ✅ Performance timing
- ✅ Grouping and tables
- ✅ Assertions
- ✅ Log history
- ✅ Message formatting
- ✅ Edge cases

### Mocking in Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('MyComponent', () => {
  let logger: LoggerService;
  let consoleInfoSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    });

    logger = TestBed.inject(LoggerService);

    // Spy on console to verify logging
    consoleInfoSpy = spyOn(console, 'info');
  });

  it('should log info message', () => {
    logger.info('Test message');

    expect(consoleInfoSpy).toHaveBeenCalled();
  });
});
```

## Architecture

```
services/
├── logger/
│   ├── logger.service.ts       # Service implementation
│   ├── logger.service.spec.ts  # Unit tests (57 tests)
│   └── README.md               # This file
└── index.ts                    # Barrel export
```

## Dependencies

### Angular Core
- `@angular/core` - Injectable, isDevMode

### Browser APIs
- `console` - All console methods (debug, info, warn, error, group, table)
- `performance` - High-resolution timing

## Performance

- **Zero Runtime Cost**: Logs filtered before formatting
- **Conditional Logging**: Dev-only features disabled in production
- **Efficient History**: Fixed-size circular buffer (100 entries)
- **Tree-shakeable**: Provided at root level
- **No External Dependencies**: Pure TypeScript

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Logs Not Appearing

1. Check log level:
```typescript
console.log(this.logger.getHistory()); // See if logs are being captured
this.logger.setLevel(LogLevel.Debug);  // Lower the threshold
```

2. Verify environment:
```typescript
console.log(isDevMode()); // Should be true in development
```

### Performance Timers Not Working

1. Ensure timer was started:
```typescript
const timers = this.logger.getActiveTimers();
console.log('Active timers:', Array.from(timers.keys()));
```

2. Check for typos in timer labels (must match exactly)

### History Not Storing Logs

History is only enabled in development mode. In production:
```typescript
this.logger.getHistory(); // Returns empty array
```

## License

Part of the MoodyJW Portfolio project.
