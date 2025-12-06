/* eslint-disable no-undef */
import { Injectable, signal } from '@angular/core';

/**
 * Cache entry with value and expiration time
 */
interface CacheEntry<T> {
  /** Cached value */
  value: T;
  /** Expiration timestamp (ms since epoch) */
  expiresAt: number;
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Time-to-live in milliseconds (default: 5 minutes) */
  ttl?: number;
  /** Whether to use localStorage as fallback (default: false) */
  useLocalStorage?: boolean;
  /** Storage key prefix for localStorage (default: 'cache_') */
  storagePrefix?: string;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Number of items in cache */
  size: number;
  /** Number of cache hits */
  hits: number;
  /** Number of cache misses */
  misses: number;
  /** Hit rate percentage */
  hitRate: number;
}

/**
 * In-memory caching service with TTL support and optional localStorage fallback
 *
 * @example
 * ```typescript
 * export class DataService {
 *   private cacheService = inject(CacheService);
 *
 *   async getUserData(userId: string) {
 *     const cacheKey = `user_${userId}`;
 *     const cached = this.cacheService.get<User>(cacheKey);
 *
 *     if (cached) {
 *       return cached;
 *     }
 *
 *     const data = await this.fetchUserData(userId);
 *     this.cacheService.set(cacheKey, data, { ttl: 300000 }); // 5 minutes
 *     return data;
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /** In-memory cache storage */
  private cache = new Map<string, CacheEntry<unknown>>();

  /** Cache hit counter */
  private readonly _hits = signal(0);

  /** Cache miss counter */
  private readonly _misses = signal(0);

  /** Default TTL in milliseconds (5 minutes) */
  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  /** Default storage prefix */
  private readonly DEFAULT_STORAGE_PREFIX = 'cache_';

  /** Cleanup interval ID */
  private cleanupIntervalId?: number;

  /** Whether localStorage is available */
  private hasLocalStorage = this.checkLocalStorageAvailability();

  /** Public read-only signals for stats */
  readonly hits = this._hits.asReadonly();
  readonly misses = this._misses.asReadonly();

  constructor() {
    // Start periodic cleanup (every minute)
    this.startPeriodicCleanup();
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    // Try in-memory cache first
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (entry) {
      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        this._misses.update((count) => count + 1);
        return null;
      }

      this._hits.update((count) => count + 1);
      return entry.value;
    }

    // Try localStorage fallback
    const storedValue = this.getFromLocalStorage<T>(key);
    if (storedValue) {
      // Restore to in-memory cache
      this.cache.set(key, storedValue as CacheEntry<unknown>);
      this._hits.update((count) => count + 1);
      return storedValue.value;
    }

    this._misses.update((count) => count + 1);
    return null;
  }

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Cache options (ttl, useLocalStorage)
   */
  set<T>(key: string, value: T, options?: CacheOptions): void {
    const ttl = options?.ttl ?? this.DEFAULT_TTL;
    const useLocalStorage = options?.useLocalStorage ?? false;

    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttl,
    };

    // Store in memory
    this.cache.set(key, entry as CacheEntry<unknown>);

    // Store in localStorage if enabled
    if (useLocalStorage && this.hasLocalStorage) {
      this.setInLocalStorage(key, entry, options);
    }
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key - Cache key
   * @returns True if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key from the cache
   * @param key - Cache key
   * @returns True if key was deleted
   */
  delete(key: string): boolean {
    // Delete from memory
    const deleted = this.cache.delete(key);

    // Delete from localStorage
    if (this.hasLocalStorage) {
      this.deleteFromLocalStorage(key);
    }

    return deleted;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();

    // Clear localStorage entries with our prefix
    if (this.hasLocalStorage) {
      this.clearLocalStorage();
    }

    // Reset stats
    this._hits.set(0);
    this._misses.set(0);
  }

  /**
   * Clear all expired entries from the cache
   * @returns Number of entries removed
   */
  clearExpired(): number {
    const now = Date.now();
    let removedCount = 0;

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removedCount++;
      }
    });

    return removedCount;
  }

  /**
   * Get cache statistics
   * @returns Cache stats object
   */
  getStats(): CacheStats {
    const hits = this._hits();
    const misses = this._misses();
    const total = hits + misses;

    return {
      size: this.cache.size,
      hits,
      misses,
      hitRate: total > 0 ? (hits / total) * 100 : 0,
    };
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get the number of items in the cache
   * @returns Cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Reset statistics counters
   */
  resetStats(): void {
    this._hits.set(0);
    this._misses.set(0);
  }

  /**
   * Stop periodic cleanup (called on service destroy)
   */
  stopPeriodicCleanup(): void {
    if (this.cleanupIntervalId !== undefined) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = undefined;
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startPeriodicCleanup(): void {
    // Clean up expired entries every minute
    this.cleanupIntervalId = window.setInterval(() => {
      this.clearExpired();
    }, 60000);
  }

  /**
   * Check if localStorage is available
   * @returns True if localStorage is available
   */
  private checkLocalStorageAvailability(): boolean {
    try {
      const testKey = '__cache_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get value from localStorage
   * @param key - Cache key
   * @returns Cache entry or null
   */
  private getFromLocalStorage<T>(key: string): CacheEntry<T> | null {
    if (!this.hasLocalStorage) {
      return null;
    }

    try {
      const stored = localStorage.getItem(this.getStorageKey(key));
      if (!stored) {
        return null;
      }

      const entry = JSON.parse(stored) as CacheEntry<T>;

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(this.getStorageKey(key));
        return null;
      }

      return entry;
    } catch {
      return null;
    }
  }

  /**
   * Set value in localStorage
   * @param key - Cache key
   * @param entry - Cache entry
   * @param options - Cache options
   */
  private setInLocalStorage<T>(
    key: string,
    entry: CacheEntry<T>,
    options?: CacheOptions
  ): void {
    if (!this.hasLocalStorage) {
      return;
    }

    try {
      const storageKey = this.getStorageKey(key, options?.storagePrefix);
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch {
      // Quota exceeded or other error - silently fail
    }
  }

  /**
   * Delete value from localStorage
   * @param key - Cache key
   */
  private deleteFromLocalStorage(key: string): void {
    if (!this.hasLocalStorage) {
      return;
    }

    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch {
      // Silently fail
    }
  }

  /**
   * Clear all cache entries from localStorage
   */
  private clearLocalStorage(): void {
    if (!this.hasLocalStorage) {
      return;
    }

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.DEFAULT_STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Silently fail
    }
  }

  /**
   * Get storage key with prefix
   * @param key - Cache key
   * @param prefix - Optional custom prefix
   * @returns Storage key with prefix
   */
  private getStorageKey(key: string, prefix?: string): string {
    return `${prefix ?? this.DEFAULT_STORAGE_PREFIX}${key}`;
  }
}
