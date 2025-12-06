/* eslint-disable no-undef */
import { TestBed } from '@angular/core/testing';

import type { CacheOptions } from './cache.service';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheService],
    });
    service = TestBed.inject(CacheService);

    // Clear localStorage before each test
    localStorage.clear();

    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    service.clear();
    service.stopPeriodicCleanup();
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with zero cache size', () => {
      expect(service.size()).toBe(0);
    });

    it('should initialize with zero stats', () => {
      const stats = service.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('set() and get()', () => {
    it('should store and retrieve a value', () => {
      service.set('key1', 'value1');
      const result = service.get<string>('key1');

      expect(result).toBe('value1');
    });

    it('should store and retrieve complex objects', () => {
      const data = { id: 1, name: 'Test', nested: { value: 42 } };
      service.set('complex', data);
      const result = service.get<typeof data>('complex');

      expect(result).toEqual(data);
    });

    it('should store and retrieve arrays', () => {
      const data = [1, 2, 3, 4, 5];
      service.set('array', data);
      const result = service.get<number[]>('array');

      expect(result).toEqual(data);
    });

    it('should return null for non-existent key', () => {
      const result = service.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should overwrite existing value', () => {
      service.set('key', 'value1');
      service.set('key', 'value2');
      const result = service.get<string>('key');

      expect(result).toBe('value2');
    });

    it('should use default TTL when not specified', () => {
      service.set('key', 'value');

      // Should still exist before TTL expires (default 5 minutes)
      vi.advanceTimersByTime(4 * 60 * 1000); // 4 minutes
      expect(service.get('key')).toBe('value');

      // Should expire after default TTL
      vi.advanceTimersByTime(2 * 60 * 1000); // 2 more minutes (total 6)
      expect(service.get('key')).toBeNull();
    });

    it('should use custom TTL', () => {
      service.set('key', 'value', { ttl: 10000 }); // 10 seconds

      // Should exist before TTL
      vi.advanceTimersByTime(5000);
      expect(service.get('key')).toBe('value');

      // Should expire after TTL
      vi.advanceTimersByTime(6000);
      expect(service.get('key')).toBeNull();
    });
  });

  describe('has()', () => {
    it('should return true for existing key', () => {
      service.set('key', 'value');
      expect(service.has('key')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(service.has('nonexistent')).toBe(false);
    });

    it('should return false for expired key', () => {
      service.set('key', 'value', { ttl: 1000 });

      expect(service.has('key')).toBe(true);

      vi.advanceTimersByTime(1500);
      expect(service.has('key')).toBe(false);
    });
  });

  describe('delete()', () => {
    it('should delete existing key', () => {
      service.set('key', 'value');
      expect(service.has('key')).toBe(true);

      const deleted = service.delete('key');
      expect(deleted).toBe(true);
      expect(service.has('key')).toBe(false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = service.delete('nonexistent');
      expect(deleted).toBe(false);
    });

    it('should reduce cache size', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      expect(service.size()).toBe(2);

      service.delete('key1');
      expect(service.size()).toBe(1);
    });
  });

  describe('clear()', () => {
    it('should clear all cache entries', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');
      expect(service.size()).toBe(3);

      service.clear();
      expect(service.size()).toBe(0);
      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBeNull();
      expect(service.get('key3')).toBeNull();
    });

    it('should reset statistics', () => {
      service.set('key', 'value');
      service.get('key'); // hit
      service.get('missing'); // miss

      expect(service.getStats().hits).toBe(1);
      expect(service.getStats().misses).toBe(1);

      service.clear();
      const stats = service.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('clearExpired()', () => {
    it('should remove only expired entries', () => {
      service.set('short', 'value1', { ttl: 1000 });
      service.set('long', 'value2', { ttl: 10000 });

      vi.advanceTimersByTime(2000);

      const removed = service.clearExpired();
      expect(removed).toBe(1);
      expect(service.has('short')).toBe(false);
      expect(service.has('long')).toBe(true);
    });

    it('should return zero when no entries expired', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');

      const removed = service.clearExpired();
      expect(removed).toBe(0);
      expect(service.size()).toBe(2);
    });

    it('should manually remove expired entries when clearExpired is called', () => {
      service.set('expired', 'value1', { ttl: 1000 });
      service.set('valid', 'value2', { ttl: 10000 });

      vi.advanceTimersByTime(2000);

      // Manually call clearExpired
      const removed = service.clearExpired();

      expect(removed).toBe(1);
      expect(service.has('expired')).toBe(false);
      expect(service.has('valid')).toBe(true);
    });
  });

  describe('Statistics', () => {
    it('should track cache hits', () => {
      service.set('key', 'value');

      service.get('key'); // hit
      service.get('key'); // hit

      expect(service.hits()).toBe(2);
      expect(service.getStats().hits).toBe(2);
    });

    it('should track cache misses', () => {
      service.get('missing1'); // miss
      service.get('missing2'); // miss
      service.get('missing3'); // miss

      expect(service.misses()).toBe(3);
      expect(service.getStats().misses).toBe(3);
    });

    it('should calculate hit rate correctly', () => {
      service.set('key', 'value');

      service.get('key'); // hit
      service.get('missing'); // miss
      service.get('key'); // hit
      service.get('missing2'); // miss

      const stats = service.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe(50);
    });

    it('should handle zero requests in hit rate', () => {
      const stats = service.getStats();
      expect(stats.hitRate).toBe(0);
    });

    it('should track size correctly', () => {
      expect(service.getStats().size).toBe(0);

      service.set('key1', 'value1');
      expect(service.getStats().size).toBe(1);

      service.set('key2', 'value2');
      expect(service.getStats().size).toBe(2);

      service.delete('key1');
      expect(service.getStats().size).toBe(1);
    });
  });

  describe('resetStats()', () => {
    it('should reset hit and miss counters', () => {
      service.set('key', 'value');
      service.get('key'); // hit
      service.get('missing'); // miss

      expect(service.hits()).toBe(1);
      expect(service.misses()).toBe(1);

      service.resetStats();

      expect(service.hits()).toBe(0);
      expect(service.misses()).toBe(0);
    });

    it('should not affect cache size', () => {
      service.set('key', 'value');
      service.resetStats();

      expect(service.size()).toBe(1);
      expect(service.get('key')).toBe('value');
    });
  });

  describe('keys()', () => {
    it('should return all cache keys', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');

      const keys = service.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('should return empty array for empty cache', () => {
      const keys = service.keys();
      expect(keys).toEqual([]);
    });

    it('should not include expired keys', () => {
      service.set('valid', 'value1');
      service.set('expired', 'value2', { ttl: 1000 });

      vi.advanceTimersByTime(2000);
      service.clearExpired();

      const keys = service.keys();
      expect(keys).toEqual(['valid']);
    });
  });

  describe('size()', () => {
    it('should return current cache size', () => {
      expect(service.size()).toBe(0);

      service.set('key1', 'value1');
      expect(service.size()).toBe(1);

      service.set('key2', 'value2');
      expect(service.size()).toBe(2);

      service.delete('key1');
      expect(service.size()).toBe(1);

      service.clear();
      expect(service.size()).toBe(0);
    });
  });

  describe('LocalStorage Fallback', () => {
    it('should store in localStorage when enabled', () => {
      const options: CacheOptions = { useLocalStorage: true, ttl: 60000 };
      service.set('key', 'value', options);

      const stored = localStorage.getItem('cache_key');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.value).toBe('value');
    });

    it('should not store in localStorage by default', () => {
      service.set('key', 'value');

      const stored = localStorage.getItem('cache_key');
      expect(stored).toBeNull();
    });

    it('should retrieve from localStorage when memory cache is empty', () => {
      // Set with localStorage
      service.set('key', 'value', { useLocalStorage: true });

      // Clear memory cache only
      service['cache'].clear();

      // Should still get from localStorage
      const result = service.get('key');
      expect(result).toBe('value');
    });

    it('should use custom storage prefix', () => {
      service.set('key', 'value', {
        useLocalStorage: true,
        storagePrefix: 'custom_',
      });

      const stored = localStorage.getItem('custom_key');
      expect(stored).toBeTruthy();
    });

    it('should delete from localStorage when deleting key', () => {
      service.set('key', 'value', { useLocalStorage: true });
      expect(localStorage.getItem('cache_key')).toBeTruthy();

      service.delete('key');
      expect(localStorage.getItem('cache_key')).toBeNull();
    });

    it('should clear localStorage entries on clear()', () => {
      service.set('key1', 'value1', { useLocalStorage: true });
      service.set('key2', 'value2', { useLocalStorage: true });

      expect(localStorage.getItem('cache_key1')).toBeTruthy();
      expect(localStorage.getItem('cache_key2')).toBeTruthy();

      service.clear();

      expect(localStorage.getItem('cache_key1')).toBeNull();
      expect(localStorage.getItem('cache_key2')).toBeNull();
    });

    it('should not retrieve expired entries from localStorage', () => {
      service.set('key', 'value', { useLocalStorage: true, ttl: 1000 });

      // Clear memory cache
      service['cache'].clear();

      // Advance time past expiration
      vi.advanceTimersByTime(2000);

      const result = service.get('key');
      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const setItemSpy = vi
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          throw new Error('Quota exceeded');
        });

      // Should not throw
      expect(() => {
        service.set('key', 'value', { useLocalStorage: true });
      }).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should handle localStorage unavailability', () => {
      // Mock localStorage check to return false
      service['hasLocalStorage'] = false;

      service.set('key', 'value', { useLocalStorage: true });

      // Should still work with memory cache
      expect(service.get('key')).toBe('value');

      // Should not store in localStorage
      expect(localStorage.getItem('cache_key')).toBeNull();
    });
  });

  describe('TTL Expiration', () => {
    it('should expire entries after TTL', () => {
      service.set('key', 'value', { ttl: 5000 });

      // Before expiration
      vi.advanceTimersByTime(4000);
      expect(service.get('key')).toBe('value');

      // After expiration
      vi.advanceTimersByTime(2000);
      expect(service.get('key')).toBeNull();
    });

    it('should remove expired entry on get()', () => {
      service.set('key', 'value', { ttl: 1000 });
      expect(service.size()).toBe(1);

      vi.advanceTimersByTime(2000);
      service.get('key');

      expect(service.size()).toBe(0);
    });

    it('should count expired entry as miss', () => {
      service.set('key', 'value', { ttl: 1000 });

      vi.advanceTimersByTime(2000);
      service.get('key');

      expect(service.misses()).toBe(1);
      expect(service.hits()).toBe(0);
    });
  });

  describe('Signal Reactivity', () => {
    it('should provide readonly signal for hits', () => {
      const hitsSignal = service.hits;
      expect(typeof hitsSignal).toBe('function');
    });

    it('should provide readonly signal for misses', () => {
      const missesSignal = service.misses;
      expect(typeof missesSignal).toBe('function');
    });

    it('should update hits signal on cache hit', () => {
      service.set('key', 'value');
      expect(service.hits()).toBe(0);

      service.get('key');
      expect(service.hits()).toBe(1);

      service.get('key');
      expect(service.hits()).toBe(2);
    });

    it('should update misses signal on cache miss', () => {
      expect(service.misses()).toBe(0);

      service.get('missing');
      expect(service.misses()).toBe(1);

      service.get('missing2');
      expect(service.misses()).toBe(2);
    });
  });

  describe('Periodic Cleanup', () => {
    it('should start cleanup on initialization', () => {
      const newService = new CacheService();
      expect(newService['cleanupIntervalId']).toBeDefined();
      newService.stopPeriodicCleanup();
    });

    it('should stop cleanup when stopped', () => {
      service.stopPeriodicCleanup();
      expect(service['cleanupIntervalId']).toBeUndefined();
    });

    it('should have periodic cleanup functionality', () => {
      service.set('key1', 'value1', { ttl: 1000 });
      service.set('key2', 'value2', { ttl: 10000 });

      // Expire key1
      vi.advanceTimersByTime(2000);

      // Manually trigger cleanup (simulates what the interval does)
      const removed = service.clearExpired();

      expect(removed).toBe(1);
      expect(service.size()).toBe(1);
      expect(service.has('key2')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values', () => {
      service.set('null', null);
      expect(service.get('null')).toBeNull();
    });

    it('should handle undefined values', () => {
      service.set('undefined', undefined);
      expect(service.get('undefined')).toBeUndefined();
    });

    it('should handle boolean values', () => {
      service.set('true', true);
      service.set('false', false);

      expect(service.get('true')).toBe(true);
      expect(service.get('false')).toBe(false);
    });

    it('should handle number values including zero', () => {
      service.set('zero', 0);
      service.set('negative', -42);

      expect(service.get('zero')).toBe(0);
      expect(service.get('negative')).toBe(-42);
    });

    it('should handle empty string', () => {
      service.set('empty', '');
      expect(service.get('empty')).toBe('');
    });

    it('should handle very large TTL', () => {
      service.set('key', 'value', { ttl: Number.MAX_SAFE_INTEGER });

      vi.advanceTimersByTime(100000000);
      expect(service.get('key')).toBe('value');
    });

    it('should handle zero TTL', () => {
      service.set('key', 'value', { ttl: 0 });

      // Zero TTL means expires at current time, need to advance timer slightly
      vi.advanceTimersByTime(1);
      expect(service.get('key')).toBeNull();
    });
  });
});
