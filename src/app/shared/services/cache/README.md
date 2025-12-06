# Cache Service

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

In-memory caching service with TTL (Time-To-Live) support, optional localStorage fallback, and automatic cache invalidation.

## Features

- ✅ **In-Memory Caching**: Fast Map-based storage with O(1) lookup
- ✅ **TTL Support**: Automatic expiration with custom time-to-live
- ✅ **LocalStorage Fallback**: Optional persistence across page reloads
- ✅ **Auto Cleanup**: Periodic cleanup of expired entries (every minute)
- ✅ **Cache Statistics**: Track hits, misses, and hit rate
- ✅ **Signal-based Stats**: Reactive statistics with Angular signals
- ✅ **Type-safe**: Full TypeScript type safety with generics
- ✅ **Flexible Invalidation**: Manual deletion, clear all, or clear expired
- ✅ **Zero Dependencies**: Pure TypeScript implementation
- ✅ **Tree-shakeable**: Provided at root level for optimal bundle size

## Quick Start

### 1. Inject the Service

```typescript
import { Component, inject } from '@angular/core';
import { CacheService } from '@shared/services';

@Component({
  selector: 'app-data',
  // ...
})
export class DataComponent {
  private cacheService = inject(CacheService);

  async loadData(id: string) {
    // Try cache first
    const cached = this.cacheService.get<UserData>(`user_${id}`);
    if (cached) {
      return cached;
    }

    // Fetch and cache
    const data = await this.fetchData(id);
    this.cacheService.set(`user_${id}`, data, { ttl: 300000 }); // 5 minutes
    return data;
  }
}
```

### 2. Basic Caching Pattern

```typescript
// Check cache first
const cacheKey = 'my-data';
let data = this.cacheService.get<MyData>(cacheKey);

if (!data) {
  // Cache miss - fetch data
  data = await this.fetchData();

  // Store in cache for 5 minutes
  this.cacheService.set(cacheKey, data, { ttl: 300000 });
}

return data;
```

### 3. With localStorage Persistence

```typescript
// Cache survives page reloads
this.cacheService.set('user-preferences', preferences, {
  ttl: 3600000, // 1 hour
  useLocalStorage: true,
});
```

## Usage

### Set Cache Entry

```typescript
// Basic usage (default 5 minute TTL)
this.cacheService.set('key', 'value');

// Custom TTL
this.cacheService.set('key', data, { ttl: 60000 }); // 1 minute

// With localStorage
this.cacheService.set('key', data, {
  ttl: 300000,
  useLocalStorage: true,
});

// Custom localStorage prefix
this.cacheService.set('key', data, {
  ttl: 60000,
  useLocalStorage: true,
  storagePrefix: 'myapp_',
});
```

### Get Cache Entry

```typescript
// Returns null if not found or expired
const value = this.cacheService.get<string>('key');

if (value) {
  console.log('Cache hit:', value);
} else {
  console.log('Cache miss');
}
```

### Check if Key Exists

```typescript
if (this.cacheService.has('key')) {
  console.log('Key exists and is not expired');
}
```

### Delete Entry

```typescript
const deleted = this.cacheService.delete('key');
console.log(deleted ? 'Deleted' : 'Not found');
```

### Clear All Cache

```typescript
// Clears both memory and localStorage
this.cacheService.clear();
```

### Clear Only Expired Entries

```typescript
const removed = this.cacheService.clearExpired();
console.log(`Removed ${removed} expired entries`);
```

### Get Cache Statistics

```typescript
const stats = this.cacheService.getStats();
console.log(`Size: ${stats.size}`);
console.log(`Hits: ${stats.hits}`);
console.log(`Misses: ${stats.misses}`);
console.log(`Hit Rate: ${stats.hitRate.toFixed(2)}%`);
```

### Reset Statistics

```typescript
this.cacheService.resetStats();
```

### Get All Keys

```typescript
const keys = this.cacheService.keys();
console.log('Cached keys:', keys);
```

### Get Cache Size

```typescript
const size = this.cacheService.size();
console.log(`${size} items in cache`);
```

## Service API

### `set<T>(key: string, value: T, options?: CacheOptions): void`

Store a value in the cache.

**Parameters:**
- `key` - Unique cache key
- `value` - Value to cache (any type)
- `options` - Optional cache options

**Example:**
```typescript
this.cacheService.set('user-123', userData, {
  ttl: 600000, // 10 minutes
  useLocalStorage: true,
});
```

### `get<T>(key: string): T | null`

Retrieve a value from the cache.

**Parameters:**
- `key` - Cache key

**Returns:** Cached value or null if not found/expired

**Example:**
```typescript
const user = this.cacheService.get<User>('user-123');
if (user) {
  console.log('Found user:', user.name);
}
```

### `has(key: string): boolean`

Check if a key exists and is not expired.

**Parameters:**
- `key` - Cache key

**Returns:** True if key exists and is valid

**Example:**
```typescript
if (this.cacheService.has('session')) {
  // Session is still valid
}
```

### `delete(key: string): boolean`

Delete a specific cache entry.

**Parameters:**
- `key` - Cache key

**Returns:** True if key was deleted

**Example:**
```typescript
this.cacheService.delete('temp-data');
```

### `clear(): void`

Clear all cached entries (memory and localStorage).

**Example:**
```typescript
this.cacheService.clear();
```

### `clearExpired(): number`

Remove all expired entries from the cache.

**Returns:** Number of entries removed

**Example:**
```typescript
const removed = this.cacheService.clearExpired();
console.log(`Cleaned up ${removed} expired entries`);
```

### `getStats(): CacheStats`

Get cache statistics.

**Returns:** Statistics object

**Example:**
```typescript
const stats = this.cacheService.getStats();
console.log(`Hit rate: ${stats.hitRate}%`);
```

### `keys(): string[]`

Get all cache keys.

**Returns:** Array of cache keys

**Example:**
```typescript
const allKeys = this.cacheService.keys();
```

### `size(): number`

Get the number of items in the cache.

**Returns:** Cache size

**Example:**
```typescript
console.log(`Cache contains ${this.cacheService.size()} items`);
```

### `resetStats(): void`

Reset hit/miss statistics counters.

**Example:**
```typescript
this.cacheService.resetStats();
```

### `stopPeriodicCleanup(): void`

Stop the automatic periodic cleanup interval.

**Example:**
```typescript
// Cleanup runs automatically, but can be stopped if needed
this.cacheService.stopPeriodicCleanup();
```

### Readonly Signals

#### `readonly hits: Signal<number>`

Reactive signal for cache hits count.

**Example:**
```typescript
const hitCount = this.cacheService.hits();
```

#### `readonly misses: Signal<number>`

Reactive signal for cache misses count.

**Example:**
```typescript
const missCount = this.cacheService.misses();
```

## Configuration Interfaces

### `CacheOptions`

```typescript
interface CacheOptions {
  /** Time-to-live in milliseconds (default: 5 minutes) */
  ttl?: number;
  /** Whether to use localStorage as fallback (default: false) */
  useLocalStorage?: boolean;
  /** Storage key prefix for localStorage (default: 'cache_') */
  storagePrefix?: string;
}
```

### `CacheStats`

```typescript
interface CacheStats {
  /** Number of items in cache */
  size: number;
  /** Number of cache hits */
  hits: number;
  /** Number of cache misses */
  misses: number;
  /** Hit rate percentage */
  hitRate: number;
}
```

## TTL (Time-To-Live) Behavior

### Default TTL

If no TTL is specified, entries expire after 5 minutes (300,000ms).

```typescript
this.cacheService.set('key', 'value'); // Expires in 5 minutes
```

### Custom TTL

Specify TTL in milliseconds:

```typescript
this.cacheService.set('key', 'value', { ttl: 60000 }); // 1 minute
this.cacheService.set('key', 'value', { ttl: 3600000 }); // 1 hour
this.cacheService.set('key', 'value', { ttl: 86400000 }); // 1 day
```

### Expiration Behavior

- Expired entries return `null` when accessed via `get()`
- Expired entries are automatically removed when accessed
- Periodic cleanup removes expired entries every 60 seconds
- Manual cleanup with `clearExpired()` removes all expired entries immediately

## LocalStorage Fallback

### When to Use

Use localStorage fallback for:
- User preferences that should persist across sessions
- Data that's expensive to fetch
- Non-sensitive data (localStorage is not encrypted)
- Data under 5MB (typical localStorage limit)

### Availability Check

The service automatically checks localStorage availability and handles errors gracefully:

```typescript
// Automatically handled - no action needed
this.cacheService.set('key', 'value', { useLocalStorage: true });
```

### Storage Key Format

Keys in localStorage use a prefix to avoid conflicts:

```typescript
// Default prefix: 'cache_'
this.cacheService.set('user', data, { useLocalStorage: true });
// Stored as: 'cache_user'

// Custom prefix:
this.cacheService.set('user', data, {
  useLocalStorage: true,
  storagePrefix: 'myapp_',
});
// Stored as: 'myapp_user'
```

### Clear localStorage

```typescript
// Clears both memory and localStorage
this.cacheService.clear();
```

## Cache Statistics

### Track Performance

Monitor cache effectiveness with built-in statistics:

```typescript
// In component
const stats = this.cacheService.getStats();
console.log(`Cache performance:
  Size: ${stats.size} entries
  Hits: ${stats.hits}
  Misses: ${stats.misses}
  Hit Rate: ${stats.hitRate.toFixed(2)}%
`);
```

### Reactive Stats with Signals

```typescript
export class CacheMonitorComponent {
  private cacheService = inject(CacheService);

  hits = this.cacheService.hits;
  misses = this.cacheService.misses;

  hitRate = computed(() => {
    const total = this.hits() + this.misses();
    return total > 0 ? (this.hits() / total) * 100 : 0;
  });
}
```

Template:
```html
<div class="cache-stats">
  <p>Hits: {{ hits() }}</p>
  <p>Misses: {{ misses() }}</p>
  <p>Hit Rate: {{ hitRate() | number:'1.2-2' }}%</p>
</div>
```

## Common Patterns

### API Response Caching

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);

  getUser(id: string): Observable<User> {
    const cacheKey = `user_${id}`;
    const cached = this.cache.get<User>(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http.get<User>(`/api/users/${id}`).pipe(
      tap(user => this.cache.set(cacheKey, user, { ttl: 300000 }))
    );
  }

  invalidateUser(id: string): void {
    this.cache.delete(`user_${id}`);
  }
}
```

### Search Results Caching

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);

  search(query: string): Observable<SearchResult[]> {
    const cacheKey = `search_${query.toLowerCase()}`;
    const cached = this.cache.get<SearchResult[]>(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http.get<SearchResult[]>('/api/search', {
      params: { q: query },
    }).pipe(
      tap(results => this.cache.set(cacheKey, results, {
        ttl: 600000, // 10 minutes
      }))
    );
  }

  clearSearchCache(): void {
    this.cache.keys()
      .filter(key => key.startsWith('search_'))
      .forEach(key => this.cache.delete(key));
  }
}
```

### Configuration/Settings Cache

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private cache = inject(CacheService);

  saveConfig(config: AppConfig): void {
    this.cache.set('app-config', config, {
      ttl: 86400000, // 24 hours
      useLocalStorage: true, // Persist across sessions
    });
  }

  getConfig(): AppConfig | null {
    return this.cache.get<AppConfig>('app-config');
  }
}
```

### Conditional Caching

```typescript
getCachedData<T>(
  key: string,
  fetcher: () => Observable<T>,
  shouldCache: (data: T) => boolean
): Observable<T> {
  const cached = this.cache.get<T>(key);

  if (cached) {
    return of(cached);
  }

  return fetcher().pipe(
    tap(data => {
      if (shouldCache(data)) {
        this.cache.set(key, data, { ttl: 300000 });
      }
    })
  );
}
```

### Cache Warming

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private cache = inject(CacheService);

  // Warm cache on app initialization
  warmCache(): void {
    this.fetchCriticalData().subscribe(data => {
      this.cache.set('critical-data', data, {
        ttl: 3600000, // 1 hour
        useLocalStorage: true,
      });
    });
  }
}
```

## Best Practices

### 1. Use Appropriate TTL Values

```typescript
// Short TTL for frequently changing data
this.cache.set('live-scores', scores, { ttl: 30000 }); // 30 seconds

// Medium TTL for semi-static data
this.cache.set('user-profile', profile, { ttl: 600000 }); // 10 minutes

// Long TTL for static data
this.cache.set('app-config', config, { ttl: 3600000 }); // 1 hour
```

### 2. Use Meaningful Cache Keys

```typescript
// Good - descriptive and unique
this.cache.set(`user_${userId}`, userData);
this.cache.set(`posts_page_${page}_limit_${limit}`, posts);

// Bad - vague or collision-prone
this.cache.set('data', userData);
this.cache.set('list', posts);
```

### 3. Implement Cache Invalidation

```typescript
updateUser(userId: string, updates: Partial<User>): Observable<User> {
  return this.http.put<User>(`/api/users/${userId}`, updates).pipe(
    tap(() => {
      // Invalidate cache after update
      this.cache.delete(`user_${userId}`);
    })
  );
}
```

### 4. Use localStorage Sparingly

```typescript
// Good use cases for localStorage:
// - User preferences
// - Non-sensitive configuration
// - Data under 1MB

// Avoid localStorage for:
// - Sensitive data (tokens, passwords)
// - Large datasets (> 5MB)
// - Frequently changing data
```

### 5. Monitor Cache Performance

```typescript
@Injectable({ providedIn: 'root' })
export class CacheMonitor {
  private cache = inject(CacheService);

  logPerformance(): void {
    const stats = this.cache.getStats();

    if (stats.hitRate < 50) {
      console.warn('Low cache hit rate:', stats);
    }

    if (stats.size > 100) {
      console.warn('Large cache size, consider cleanup');
      this.cache.clearExpired();
    }
  }
}
```

### 6. Clean Up on Logout

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private cache = inject(CacheService);

  logout(): void {
    // Clear all cached user data
    this.cache.clear();

    // Or selectively clear user-specific caches
    this.cache.keys()
      .filter(key => key.startsWith('user_'))
      .forEach(key => this.cache.delete(key));
  }
}
```

## Testing

Comprehensive unit tests are provided with 58 test cases:

```bash
npm test
```

### Test Coverage

- ✅ Service creation and initialization
- ✅ Set and get operations
- ✅ TTL expiration
- ✅ LocalStorage fallback
- ✅ Cache invalidation
- ✅ Statistics tracking
- ✅ Signal reactivity
- ✅ Periodic cleanup
- ✅ Edge cases (null, undefined, zero TTL)

### Mocking in Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('MyComponent', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheService],
    });
    cacheService = TestBed.inject(CacheService);

    // Use fake timers for TTL testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    cacheService.clear();
    cacheService.stopPeriodicCleanup();
    vi.useRealTimers();
  });

  it('should cache API response', () => {
    cacheService.set('test', 'value');
    expect(cacheService.get('test')).toBe('value');
  });

  it('should expire after TTL', () => {
    cacheService.set('test', 'value', { ttl: 1000 });

    vi.advanceTimersByTime(1500);
    expect(cacheService.get('test')).toBeNull();
  });
});
```

## Architecture

```
services/
├── cache/
│   ├── cache.service.ts       # Service implementation
│   ├── cache.service.spec.ts  # Unit tests (58 tests)
│   └── README.md              # This file
└── index.ts                   # Barrel export
```

## Dependencies

### Angular Core
- `@angular/core` - Injectable, inject, signal

### Browser APIs
- `localStorage` - Optional persistence
- `Map` - In-memory storage
- `setInterval/clearInterval` - Periodic cleanup

## Performance

- **O(1) Lookup**: Map-based storage for fast retrieval
- **Automatic Cleanup**: Periodic removal of expired entries prevents memory bloat
- **Lazy Expiration**: Expired entries are removed on access or cleanup
- **Signal-based Stats**: Efficient reactive state management
- **Tree-shakeable**: Provided at root level for optimal bundle size
- **Zero Dependencies**: No external libraries required

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Note: localStorage may not be available in private/incognito mode. The service handles this gracefully.

## Troubleshooting

### Cache Not Persisting

1. Check that `useLocalStorage` is set to `true`:
```typescript
this.cache.set('key', 'value', { useLocalStorage: true });
```

2. Verify localStorage is available (not in private mode)

3. Check browser's storage quota hasn't been exceeded

### High Cache Misses

1. Check TTL isn't too short:
```typescript
const stats = this.cache.getStats();
console.log('Hit rate:', stats.hitRate);
```

2. Verify cache keys are consistent

3. Ensure cache isn't being cleared prematurely

### Memory Issues

1. Use `clearExpired()` to remove old entries:
```typescript
this.cache.clearExpired();
```

2. Reduce TTL for less critical data

3. Monitor cache size:
```typescript
if (this.cache.size() > 100) {
  this.cache.clear();
}
```

### localStorage Errors

The service handles localStorage errors gracefully (quota exceeded, not available, etc.). Check console for warnings.

## License

Part of the MoodyJW Portfolio project.
