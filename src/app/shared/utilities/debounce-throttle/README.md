# Debounce and Throttle Utilities

A comprehensive collection of timing control utilities for both standalone functions and RxJS operators. Provides debouncing, throttling, rate limiting, memoization, and more with full type safety for Angular v21 applications.

## Features

- **Debounce**: Delay function execution until after a wait period
- **Throttle**: Limit function execution to once per time period
- **RxJS Operators**: Custom debounce and throttle operators for Observables
- **Rate Limiting**: Execute functions at most once per interval
- **Once**: Ensure a function executes only one time
- **Memoization**: Cache function results for performance
- **Delay**: Simple function execution delay
- **Type Safety**: Full TypeScript support with generics
- **Zero Dependencies**: Pure TypeScript + RxJS operators
- **Cancel/Flush Support**: Control pending executions

## Quick Start

```typescript
import {
  debounce,
  throttle,
  rxDebounce,
  rxThrottle,
  once,
  memoize,
} from '@shared/utilities/debounce-throttle/debounce-throttle.utils';

// Debounce search input
const debouncedSearch = debounce((query: string) => {
  this.search(query);
}, 300);

// Throttle scroll handler
const throttledScroll = throttle(() => {
  this.handleScroll();
}, 100);

// RxJS debounce for form controls
this.searchControl.valueChanges
  .pipe(rxDebounce(300))
  .subscribe(query => this.search(query));

// Execute function only once
const initialize = once(() => {
  console.log('Initialized!');
});
```

## Installation

These utilities are part of the shared utilities module. Import them directly:

```typescript
import * as TimingUtils from '@shared/utilities/debounce-throttle/debounce-throttle.utils';
// or
import { debounce, throttle } from '@shared/utilities/debounce-throttle/debounce-throttle.utils';
```

## API Reference

### Debounce

#### `debounce<T>(func: T, wait: number, options?: DebounceOptions): T & Methods`

Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time it was invoked.

**Options:**
- `leading?: boolean` - Execute on the leading edge (default: false)
- `trailing?: boolean` - Execute on the trailing edge (default: true)
- `maxWait?: number` - Maximum time func is allowed to be delayed before forced execution

**Methods:**
- `cancel()` - Cancel pending execution
- `flush()` - Immediately execute pending invocation
- `pending()` - Check if execution is pending

**Examples:**

```typescript
// Basic debounce (trailing edge)
const debouncedSave = debounce((data: unknown) => {
  this.saveData(data);
}, 500);

// Type in form...
input.addEventListener('input', (e) => debouncedSave(e.target.value));
// saveData called 500ms after last keystroke

// Leading edge execution
const debouncedSubmit = debounce(handleSubmit, 1000, {
  leading: true,
  trailing: false
});
// Executes immediately on first call, ignores subsequent calls for 1s

// With maxWait
const debouncedScroll = debounce(handleScroll, 100, {
  maxWait: 500
});
// Executes at least once every 500ms, even if continuously called

// Cancel pending execution
debouncedSave.cancel();

// Flush immediately
debouncedSave.flush();

// Check if pending
if (debouncedSave.pending()) {
  console.log('Execution is pending');
}
```

**Angular Component Example:**

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input (input)="onSearch($event.target.value)" />
  `
})
export class SearchComponent {
  private debouncedSearch = debounce((query: string) => {
    this.searchService.search(query).subscribe(results => {
      this.results = results;
    });
  }, 300);

  onSearch(query: string) {
    this.debouncedSearch(query);
  }

  ngOnDestroy() {
    this.debouncedSearch.cancel();
  }
}
```

### Throttle

#### `throttle<T>(func: T, wait: number, options?: ThrottleOptions): T & Methods`

Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.

**Options:**
- `leading?: boolean` - Execute on the leading edge (default: true)
- `trailing?: boolean` - Execute on the trailing edge (default: false)

**Methods:**
- `cancel()` - Cancel pending execution
- `flush()` - Immediately execute pending invocation
- `pending()` - Check if execution is pending

**Examples:**

```typescript
// Basic throttle (leading edge)
const throttledResize = throttle(() => {
  this.handleResize();
}, 200);

window.addEventListener('resize', throttledResize);
// handleResize executes immediately, then at most once per 200ms

// Trailing edge execution
const throttledScroll = throttle(handleScroll, 100, {
  leading: false,
  trailing: true
});
// Executes after scrolling stops for 100ms

// Both edges
const throttledInput = throttle(handleInput, 300, {
  leading: true,
  trailing: true
});
// Executes immediately, then again after 300ms if still being called
```

**Angular Component Example:**

```typescript
@Component({
  selector: 'app-infinite-scroll',
  template: `<div (scroll)="onScroll()">...</div>`
})
export class InfiniteScrollComponent {
  private throttledScroll = throttle(() => {
    this.loadMore();
  }, 200);

  onScroll() {
    this.throttledScroll();
  }

  ngOnDestroy() {
    this.throttledScroll.cancel();
  }
}
```

### RxJS Operators

#### `rxDebounce<T>(wait: number, options?: RxDebounceOptions): MonoTypeOperatorFunction<T>`

RxJS operator that debounces emissions from the source Observable.

**Options:**
- `leading?: boolean` - Emit on leading edge (default: false)

**Examples:**

```typescript
// Search input debouncing
@Component({...})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        rxDebounce(300),
        switchMap(query => this.searchService.search(query))
      )
      .subscribe(results => {
        this.results = results;
      });
  }
}

// Leading edge emission
clicks$
  .pipe(rxDebounce(500, { leading: true }))
  .subscribe(() => console.log('Clicked'));
// Logs immediately on first click, then waits 500ms before accepting another

// Auto-save form
this.form.valueChanges
  .pipe(
    rxDebounce(1000),
    switchMap(value => this.saveForm(value))
  )
  .subscribe();
```

#### `rxThrottle<T>(wait: number, options?: RxThrottleOptions): MonoTypeOperatorFunction<T>`

RxJS operator that throttles emissions from the source Observable.

**Options:**
- `leading?: boolean` - Emit on leading edge (default: true)
- `trailing?: boolean` - Emit on trailing edge (default: false)

**Examples:**

```typescript
// Scroll event throttling
@Component({...})
export class ScrollComponent implements OnInit {
  private scroll$ = fromEvent(window, 'scroll');

  ngOnInit() {
    this.scroll$
      .pipe(
        rxThrottle(100),
        map(() => window.scrollY)
      )
      .subscribe(scrollY => {
        this.currentScroll = scrollY;
      });
  }
}

// Mouse move tracking
mousemove$
  .pipe(
    rxThrottle(50),
    map(event => ({ x: event.clientX, y: event.clientY }))
  )
  .subscribe(position => {
    this.mousePosition = position;
  });

// API calls throttling
button$
  .pipe(
    rxThrottle(1000, { leading: true, trailing: false })
  )
  .subscribe(() => this.callApi());
```

### Utility Functions

#### `once<T>(func: T): T & { reset: () => void }`

Creates a function that is restricted to execute only once.

**Examples:**

```typescript
// Initialize service only once
const initializeAnalytics = once(() => {
  console.log('Initializing analytics...');
  return analytics.init();
});

initializeAnalytics(); // Logs and initializes
initializeAnalytics(); // No-op, returns cached result
initializeAnalytics(); // No-op, returns cached result

// Reset to allow re-execution
initializeAnalytics.reset();
initializeAnalytics(); // Logs and initializes again

// Singleton pattern
class DatabaseConnection {
  private static connectOnce = once(() => {
    return new DatabaseConnection();
  });

  static getInstance() {
    return this.connectOnce();
  }
}
```

#### `rateLimit<T>(func: T, interval: number): T & { cancel: () => void }`

Creates a rate-limited function that executes at most once per interval.

**Examples:**

```typescript
// API rate limiting
const rateLimitedApi = rateLimit((endpoint: string) => {
  return this.http.get(endpoint).toPromise();
}, 1000);

// These will execute one per second
await rateLimitedApi('/api/users');
await rateLimitedApi('/api/posts');
await rateLimitedApi('/api/comments');

// Cancel pending execution
rateLimitedApi.cancel();

// Analytics tracking
const trackEvent = rateLimit((event: string) => {
  analytics.track(event);
}, 5000);
```

#### `delay<T>(func: T, wait: number): (...args: Parameters<T>) => void`

Delays the execution of a function by the specified time.

**Examples:**

```typescript
// Delayed notification
const delayedNotify = delay((message: string) => {
  this.toastService.show(message);
}, 1000);

delayedNotify('Operation completed!');
// Shows toast after 1 second

// Delayed redirect
const delayedRedirect = delay((url: string) => {
  this.router.navigate([url]);
}, 2000);

delayedRedirect('/dashboard');
// Navigates after 2 seconds
```

#### `memoize<T>(func: T, resolver?: Function): T & { cache: Map; clear: () => void }`

Creates a function that memoizes the result of `func`.

**Examples:**

```typescript
// Expensive calculation memoization
const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(40); // Calculates
fibonacci(40); // Returns cached result (instant)

// API response caching
const fetchUser = memoize(
  (userId: string) => {
    return this.http.get(`/api/users/${userId}`).toPromise();
  },
  (userId) => userId // Cache key
);

await fetchUser('123'); // Makes API call
await fetchUser('123'); // Returns cached response

// Clear cache
fetchUser.clear();

// Access cache
console.log(fetchUser.cache.size);
console.log(fetchUser.cache.get('123'));

// Custom resolver
const memoizedFetch = memoize(
  (url: string, options: RequestInit) => fetch(url, options),
  (url) => url // Cache by URL only, ignore options
);
```

## Common Patterns

### Search Input Debouncing

```typescript
@Component({
  selector: 'app-product-search',
  template: `
    <input [formControl]="searchControl" placeholder="Search products..." />
    <div *ngFor="let product of products">{{ product.name }}</div>
  `
})
export class ProductSearchComponent implements OnInit {
  searchControl = new FormControl('');
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        rxDebounce(300),
        distinctUntilChanged(),
        switchMap(query =>
          query ? this.productService.search(query) : of([])
        )
      )
      .subscribe(products => {
        this.products = products;
      });
  }
}
```

### Infinite Scroll with Throttle

```typescript
@Component({
  selector: 'app-feed',
  template: `
    <div class="feed" (scroll)="onScroll($event)">
      <div *ngFor="let item of items">{{ item }}</div>
    </div>
  `
})
export class FeedComponent {
  items: any[] = [];

  private throttledLoadMore = throttle(() => {
    this.loadMoreItems();
  }, 200);

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const bottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (bottom) {
      this.throttledLoadMore();
    }
  }

  private loadMoreItems() {
    // Load more items logic
  }

  ngOnDestroy() {
    this.throttledLoadMore.cancel();
  }
}
```

### Auto-Save Form

```typescript
@Component({
  selector: 'app-auto-save-form',
  template: `<form [formGroup]="form">...</form>`
})
export class AutoSaveFormComponent implements OnInit {
  form = this.fb.group({
    title: [''],
    content: [''],
  });

  constructor(
    private fb: FormBuilder,
    private saveService: SaveService
  ) {}

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        rxDebounce(1000),
        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)
        ),
        switchMap(value => this.saveService.save(value)),
        catchError(error => {
          console.error('Auto-save failed:', error);
          return EMPTY;
        })
      )
      .subscribe(() => {
        console.log('Form auto-saved');
      });
  }
}
```

### Window Resize Handler

```typescript
@Component({
  selector: 'app-responsive-layout',
})
export class ResponsiveLayoutComponent implements OnInit, OnDestroy {
  private resize$ = fromEvent(window, 'resize');
  private resizeSubscription?: Subscription;

  ngOnInit() {
    this.resizeSubscription = this.resize$
      .pipe(
        rxThrottle(200),
        map(() => ({
          width: window.innerWidth,
          height: window.innerHeight,
        }))
      )
      .subscribe(dimensions => {
        this.handleResize(dimensions);
      });
  }

  private handleResize(dimensions: { width: number; height: number }) {
    // Update layout based on dimensions
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
  }
}
```

### API Call Rate Limiting

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private rateLimitedPost = rateLimit(
    (endpoint: string, data: unknown) => {
      return this.http.post(endpoint, data).toPromise();
    },
    1000
  );

  constructor(private http: HttpClient) {}

  async createItem(data: unknown) {
    return this.rateLimitedPost('/api/items', data);
  }

  async updateItem(id: string, data: unknown) {
    return this.rateLimitedPost(`/api/items/${id}`, data);
  }
}
```

### Expensive Computation Memoization

```typescript
@Injectable({ providedIn: 'root' })
export class ChartService {
  private calculateStatistics = memoize(
    (data: number[]) => {
      console.log('Calculating statistics...');
      return {
        mean: data.reduce((a, b) => a + b, 0) / data.length,
        median: this.getMedian(data),
        mode: this.getMode(data),
      };
    },
    (data) => JSON.stringify(data)
  );

  getStatistics(data: number[]) {
    return this.calculateStatistics(data);
  }

  clearCache() {
    this.calculateStatistics.clear();
  }
}
```

## Best Practices

### 1. Choose the Right Tool

```typescript
// Use debounce for user input (search, forms)
const debouncedSearch = debounce(search, 300);

// Use throttle for events that fire continuously (scroll, resize, mousemove)
const throttledScroll = throttle(handleScroll, 100);

// Use rxDebounce/rxThrottle for Observable streams
searchControl.valueChanges.pipe(rxDebounce(300))

// Use once for initialization
const init = once(() => setupApp());

// Use rateLimit for API calls
const rateLimited = rateLimit(apiCall, 1000);

// Use memoize for expensive pure functions
const memoized = memoize(expensiveCalc);
```

### 2. Clean Up Resources

```typescript
@Component({...})
export class MyComponent implements OnDestroy {
  private debouncedSave = debounce(this.save, 500);

  ngOnDestroy() {
    // Cancel pending executions
    this.debouncedSave.cancel();
  }
}
```

### 3. Set Appropriate Wait Times

```typescript
// User input: 200-500ms
const debouncedInput = debounce(handleInput, 300);

// Scroll/resize: 50-200ms
const throttledScroll = throttle(handleScroll, 100);

// API calls: 500-2000ms
const debouncedApi = debounce(apiCall, 1000);

// Autocomplete: 150-300ms
const debouncedAutocomplete = debounce(autocomplete, 250);
```

### 4. Use Leading Edge Appropriately

```typescript
// Leading edge for immediate feedback
const debouncedSubmit = debounce(submit, 1000, {
  leading: true,
  trailing: false
});

// Trailing edge for batch operations
const debouncedSave = debounce(save, 500, {
  leading: false,
  trailing: true
});

// Both edges for comprehensive handling
const throttledUpdate = throttle(update, 200, {
  leading: true,
  trailing: true
});
```

### 5. Combine with RxJS Operators

```typescript
// Complete pipeline
this.searchControl.valueChanges
  .pipe(
    rxDebounce(300),
    distinctUntilChanged(),
    filter(query => query.length >= 3),
    switchMap(query => this.searchService.search(query)),
    catchError(() => of([]))
  )
  .subscribe(results => {
    this.results = results;
  });
```

### 6. Handle Errors

```typescript
const debouncedSave = debounce(async (data: unknown) => {
  try {
    await this.saveData(data);
  } catch (error) {
    console.error('Save failed:', error);
    this.handleError(error);
  }
}, 500);
```

## Performance Notes

- `debounce`: O(1) for each invocation
- `throttle`: O(1) for each invocation
- `once`: O(1) after first invocation
- `memoize`: O(1) for cache hits, O(n) for cache misses where n is function complexity
- `rateLimit`: O(1) for each invocation

Memory usage:
- Debounced/throttled functions keep one timer reference
- Memoized functions store results in a Map (can grow unbounded - use `clear()`)
- Once functions store single result

## Browser Compatibility

These utilities use modern JavaScript features:
- ES6+ syntax
- Promises
- Map
- RxJS (for operators)

Supported in all modern browsers and Node.js 14+.

## Related Utilities

- [Array/Object Utilities](../array-object/README.md) - Data manipulation utilities
- [Validation Utilities](../validation/README.md) - Input validation
- [String Utilities](../string/README.md) - String operations
- [Date Utilities](../date/README.md) - Date manipulation

## License

MIT License - Part of the moodyjw-portfolio project.
