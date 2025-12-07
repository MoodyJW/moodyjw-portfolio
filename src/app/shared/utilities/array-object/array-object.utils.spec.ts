import { describe, expect, it } from 'vitest';

import * as ArrayObjectUtils from './array-object.utils';

describe('ArrayObjectUtils', () => {
  describe('deepClone', () => {
    it('should clone primitives', () => {
      expect(ArrayObjectUtils.deepClone(42)).toBe(42);
      expect(ArrayObjectUtils.deepClone('hello')).toBe('hello');
      expect(ArrayObjectUtils.deepClone(true)).toBe(true);
      expect(ArrayObjectUtils.deepClone(null)).toBe(null);
      expect(ArrayObjectUtils.deepClone(undefined)).toBe(undefined);
    });

    it('should clone simple objects', () => {
      const obj = { name: 'John', age: 30 };
      const cloned = ArrayObjectUtils.deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should clone nested objects', () => {
      const obj = {
        name: 'John',
        address: {
          city: 'NYC',
          zip: '10001',
        },
      };
      const cloned = ArrayObjectUtils.deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.address).not.toBe(obj.address);

      cloned.address.city = 'LA';
      expect(obj.address.city).toBe('NYC');
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = ArrayObjectUtils.deepClone(arr);

      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone Date objects', () => {
      const date = new Date('2024-01-01');
      const cloned = ArrayObjectUtils.deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned instanceof Date).toBe(true);
    });

    it('should clone RegExp objects', () => {
      const regex = /test/gi;
      const cloned = ArrayObjectUtils.deepClone(regex);

      expect(cloned.source).toBe(regex.source);
      expect(cloned.flags).toBe(regex.flags);
      expect(cloned).not.toBe(regex);
    });

    it('should clone Map objects', () => {
      const map = new Map<string, unknown>([
        ['key1', 'value1'],
        ['key2', { nested: true }],
      ]);
      const cloned = ArrayObjectUtils.deepClone(map);

      expect(cloned.get('key1')).toBe('value1');
      expect(cloned.get('key2')).toEqual({ nested: true });
      expect(cloned.get('key2')).not.toBe(map.get('key2'));
      expect(cloned).not.toBe(map);
    });

    it('should clone Set objects', () => {
      const set = new Set([1, 2, { nested: true }]);
      const cloned = ArrayObjectUtils.deepClone(set);

      expect(cloned.size).toBe(3);
      expect(cloned.has(1)).toBe(true);
      expect(cloned).not.toBe(set);
    });

    it('should handle max depth option', () => {
      const deeply = { a: { b: { c: { d: { e: 'deep' } } } } };

      expect(() => {
        ArrayObjectUtils.deepClone(deeply, { maxDepth: 3 });
      }).toThrow('Maximum clone depth (3) exceeded');
    });

    it('should preserve prototypes when option is set', () => {
      class CustomClass {
        value = 42;
      }
      const instance = new CustomClass();
      const cloned = ArrayObjectUtils.deepClone(instance, { preservePrototypes: true });

      expect(cloned).toBeInstanceOf(CustomClass);
      expect(cloned.value).toBe(42);
    });
  });

  describe('groupBy', () => {
    it('should group by property key', () => {
      const users = [
        { name: 'John', role: 'admin' },
        { name: 'Jane', role: 'user' },
        { name: 'Bob', role: 'admin' },
      ];

      const result = ArrayObjectUtils.groupBy(users, 'role');

      expect(result).toEqual({
        admin: [
          { name: 'John', role: 'admin' },
          { name: 'Bob', role: 'admin' },
        ],
        user: [{ name: 'Jane', role: 'user' }],
      });
    });

    it('should group by function', () => {
      const users = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 30 },
      ];

      const result = ArrayObjectUtils.groupBy(users, (u) => u.age);

      expect(result['30']).toHaveLength(2);
      expect(result['25']).toHaveLength(1);
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        ArrayObjectUtils.groupBy({} as never, 'key');
      }).toThrow('First argument must be an array');
    });

    it('should handle empty array', () => {
      const result = ArrayObjectUtils.groupBy([], 'key');
      expect(result).toEqual({});
    });
  });

  describe('uniqueBy', () => {
    it('should return unique primitives', () => {
      const arr = [1, 2, 2, 3, 3, 3, 4];
      const result = ArrayObjectUtils.uniqueBy(arr);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should return unique by property key', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'John Doe' },
      ];

      const result = ArrayObjectUtils.uniqueBy(users, 'id');

      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]);
    });

    it('should return unique by function', () => {
      const users = [
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' },
        { name: 'Johnny', email: 'john@example.com' },
      ];

      const result = ArrayObjectUtils.uniqueBy(users, (u) => u.email);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John');
      expect(result[1].name).toBe('Jane');
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        ArrayObjectUtils.uniqueBy({} as never);
      }).toThrow('First argument must be an array');
    });
  });

  describe('sortBy', () => {
    it('should sort by property in ascending order', () => {
      const users = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 35 },
      ];

      const result = ArrayObjectUtils.sortBy(users, 'age');

      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(35);
    });

    it('should sort by property in descending order', () => {
      const users = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 35 },
      ];

      const result = ArrayObjectUtils.sortBy(users, 'age', { order: 'desc' });

      expect(result[0].age).toBe(35);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(25);
    });

    it('should handle case-insensitive string sorting', () => {
      const items = [
        { name: 'apple' },
        { name: 'Banana' },
        { name: 'Cherry' },
      ];

      const result = ArrayObjectUtils.sortBy(items, 'name', { caseSensitive: false });

      expect(result[0].name).toBe('apple');
      expect(result[1].name).toBe('Banana');
      expect(result[2].name).toBe('Cherry');
    });

    it('should use custom comparator', () => {
      const items = [
        { value: 1 },
        { value: 10 },
        { value: 2 },
      ];

      const result = ArrayObjectUtils.sortBy(items, 'value', {
        comparator: (a, b) => a.value - b.value,
      });

      expect(result[0].value).toBe(1);
      expect(result[1].value).toBe(2);
      expect(result[2].value).toBe(10);
    });

    it('should not mutate original array', () => {
      const original = [{ age: 30 }, { age: 25 }];
      const result = ArrayObjectUtils.sortBy(original, 'age');

      expect(result).not.toBe(original);
      expect(original[0].age).toBe(30);
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        ArrayObjectUtils.sortBy({} as never, 'key');
      }).toThrow('First argument must be an array');
    });
  });

  describe('flatten', () => {
    it('should flatten array one level deep by default', () => {
      const arr = [1, [2, [3, [4]]]];
      const result = ArrayObjectUtils.flatten(arr);

      expect(result).toEqual([1, 2, [3, [4]]]);
    });

    it('should flatten array to specified depth', () => {
      const arr = [1, [2, [3, [4]]]];
      const result = ArrayObjectUtils.flatten(arr, 2);

      expect(result).toEqual([1, 2, 3, [4]]);
    });

    it('should flatten array completely with Infinity depth', () => {
      const arr = [1, [2, [3, [4]]]];
      const result = ArrayObjectUtils.flatten(arr, Infinity);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should return original array if depth is 0', () => {
      const arr = [1, [2, 3]];
      const result = ArrayObjectUtils.flatten(arr, 0);

      expect(result).toEqual(arr);
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        ArrayObjectUtils.flatten({} as never);
      }).toThrow('First argument must be an array');
    });
  });

  describe('chunk', () => {
    it('should chunk array into specified size', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const result = ArrayObjectUtils.chunk(arr, 3);

      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle array smaller than chunk size', () => {
      const arr = [1, 2];
      const result = ArrayObjectUtils.chunk(arr, 5);

      expect(result).toEqual([[1, 2]]);
    });

    it('should throw error for invalid chunk size', () => {
      expect(() => {
        ArrayObjectUtils.chunk([1, 2, 3], 0);
      }).toThrow('Chunk size must be a positive integer');

      expect(() => {
        ArrayObjectUtils.chunk([1, 2, 3], -1);
      }).toThrow('Chunk size must be a positive integer');

      expect(() => {
        ArrayObjectUtils.chunk([1, 2, 3], 1.5);
      }).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        ArrayObjectUtils.chunk({} as never, 2);
      }).toThrow('First argument must be an array');
    });
  });

  describe('arrayDifference', () => {
    it('should compute difference between primitive arrays', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [3, 4, 5, 6];
      const result = ArrayObjectUtils.arrayDifference(arr1, arr2);

      expect(result.added).toEqual([5, 6]);
      expect(result.removed).toEqual([1, 2]);
      expect(result.unchanged).toEqual([3, 4]);
    });

    it('should compute difference with key function', () => {
      const arr1 = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      const arr2 = [
        { id: 2, name: 'Jane Updated' },
        { id: 3, name: 'Bob' },
      ];

      const result = ArrayObjectUtils.arrayDifference(arr1, arr2, (item) => item.id);

      expect(result.added).toHaveLength(1);
      expect(result.added[0].id).toBe(3);
      expect(result.removed).toHaveLength(1);
      expect(result.removed[0].id).toBe(1);
      expect(result.unchanged).toHaveLength(1);
      expect(result.unchanged[0].id).toBe(2);
    });

    it('should handle empty arrays', () => {
      const result = ArrayObjectUtils.arrayDifference([], []);

      expect(result.added).toEqual([]);
      expect(result.removed).toEqual([]);
      expect(result.unchanged).toEqual([]);
    });

    it('should throw error for non-array inputs', () => {
      expect(() => {
        ArrayObjectUtils.arrayDifference({} as never, []);
      }).toThrow('Both arguments must be arrays');
    });
  });

  describe('pick', () => {
    it('should pick specified properties', () => {
      const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
      const result = ArrayObjectUtils.pick(user, ['id', 'name', 'email']);

      expect(result).toEqual({ id: 1, name: 'John', email: 'john@example.com' });
      expect('password' in result).toBe(false);
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      const result = ArrayObjectUtils.pick(obj, ['a', 'c' as keyof typeof obj]);

      expect(result).toEqual({ a: 1 });
    });

    it('should throw error for non-object input', () => {
      expect(() => {
        ArrayObjectUtils.pick(null as never, []);
      }).toThrow('First argument must be an object');
    });
  });

  describe('omit', () => {
    it('should omit specified properties', () => {
      const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
      const result = ArrayObjectUtils.omit(user, ['password']);

      expect(result).toEqual({ id: 1, name: 'John', email: 'john@example.com' });
      expect('password' in result).toBe(false);
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      const result = ArrayObjectUtils.omit(obj, ['c' as keyof typeof obj]);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should throw error for non-object input', () => {
      expect(() => {
        ArrayObjectUtils.omit(null as never, []);
      }).toThrow('First argument must be an object');
    });
  });

  describe('deepMerge', () => {
    it('should merge simple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = ArrayObjectUtils.deepMerge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const obj1 = { theme: 'light', settings: { fontSize: 14, lineHeight: 1.5 } };
      const obj2 = { settings: { fontSize: 16, fontFamily: 'Arial' } };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = ArrayObjectUtils.deepMerge(obj1, obj2 as any);

      expect(result).toEqual({
        theme: 'light',
        settings: { fontSize: 16, lineHeight: 1.5, fontFamily: 'Arial' },
      });
    });

    it('should handle multiple source objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = ArrayObjectUtils.deepMerge(obj1, obj2 as any, obj3 as any);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should not merge arrays (replaces instead)', () => {
      const obj1 = { items: [1, 2, 3] };
      const obj2 = { items: [4, 5] };
      const result = ArrayObjectUtils.deepMerge(obj1, obj2);

      expect(result.items).toEqual([4, 5]);
    });

    it('should return target if no sources', () => {
      const obj = { a: 1 };
      const result = ArrayObjectUtils.deepMerge(obj);

      expect(result).toEqual(obj);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty objects', () => {
      expect(ArrayObjectUtils.isEmpty({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(ArrayObjectUtils.isEmpty({ a: 1 })).toBe(false);
    });

    it('should return true for empty arrays', () => {
      expect(ArrayObjectUtils.isEmpty([])).toBe(true);
    });

    it('should return false for non-empty arrays', () => {
      expect(ArrayObjectUtils.isEmpty([1, 2])).toBe(false);
    });

    it('should return true for empty Map', () => {
      expect(ArrayObjectUtils.isEmpty(new Map())).toBe(true);
    });

    it('should return false for non-empty Map', () => {
      const map = new Map();
      map.set('key', 'value');
      expect(ArrayObjectUtils.isEmpty(map)).toBe(false);
    });

    it('should return true for empty Set', () => {
      expect(ArrayObjectUtils.isEmpty(new Set())).toBe(true);
    });

    it('should return false for non-empty Set', () => {
      expect(ArrayObjectUtils.isEmpty(new Set([1, 2]))).toBe(false);
    });

    it('should return true for null and undefined', () => {
      expect(ArrayObjectUtils.isEmpty(null as never)).toBe(true);
      expect(ArrayObjectUtils.isEmpty(undefined as never)).toBe(true);
    });
  });

  describe('getPath', () => {
    const testObj = {
      name: 'John',
      address: {
        city: 'NYC',
        zip: '10001',
        coords: {
          lat: 40.7128,
          lng: -74.006,
        },
      },
    };

    it('should get value with string path', () => {
      expect(ArrayObjectUtils.getPath(testObj, 'name')).toBe('John');
      expect(ArrayObjectUtils.getPath(testObj, 'address.city')).toBe('NYC');
      expect(ArrayObjectUtils.getPath(testObj, 'address.coords.lat')).toBe(40.7128);
    });

    it('should get value with array path', () => {
      expect(ArrayObjectUtils.getPath(testObj, ['address', 'city'])).toBe('NYC');
      expect(ArrayObjectUtils.getPath(testObj, ['address', 'coords', 'lng'])).toBe(-74.006);
    });

    it('should return default value for non-existent path', () => {
      expect(ArrayObjectUtils.getPath(testObj, 'address.country', 'USA')).toBe('USA');
      expect(ArrayObjectUtils.getPath(testObj, 'nonexistent.path', 'default')).toBe('default');
    });

    it('should return undefined for non-existent path without default', () => {
      expect(ArrayObjectUtils.getPath(testObj, 'address.country')).toBeUndefined();
    });

    it('should handle non-object input', () => {
      expect(ArrayObjectUtils.getPath(null, 'path', 'default')).toBe('default');
      expect(ArrayObjectUtils.getPath(undefined, 'path', 'default')).toBe('default');
    });
  });

  describe('setPath', () => {
    it('should set value with string path', () => {
      const obj = { name: 'John' };
      ArrayObjectUtils.setPath(obj, 'age', 30);

      expect(obj).toEqual({ name: 'John', age: 30 });
    });

    it('should set nested value with string path', () => {
      const obj: Record<string, unknown> = { name: 'John' };
      ArrayObjectUtils.setPath(obj, 'address.city', 'NYC');

      expect(obj).toEqual({
        name: 'John',
        address: { city: 'NYC' },
      });
    });

    it('should set value with array path', () => {
      const obj: Record<string, unknown> = {};
      ArrayObjectUtils.setPath(obj, ['user', 'profile', 'email'], 'john@example.com');

      expect(obj).toEqual({
        user: {
          profile: {
            email: 'john@example.com',
          },
        },
      });
    });

    it('should overwrite existing paths', () => {
      const obj = { address: { city: 'NYC' } };
      ArrayObjectUtils.setPath(obj, 'address.city', 'LA');

      expect(obj.address.city).toBe('LA');
    });

    it('should throw error for non-object input', () => {
      expect(() => {
        ArrayObjectUtils.setPath(null as never, 'path', 'value');
      }).toThrow('First argument must be an object');
    });
  });

  describe('invert', () => {
    it('should invert object keys and values', () => {
      const obj = { active: 1, inactive: 0, pending: 2 };
      const result = ArrayObjectUtils.invert(obj);

      expect(result).toEqual({
        '1': 'active',
        '0': 'inactive',
        '2': 'pending',
      });
    });

    it('should handle string values', () => {
      const obj = { a: 'x', b: 'y', c: 'z' };
      const result = ArrayObjectUtils.invert(obj);

      expect(result).toEqual({ x: 'a', y: 'b', z: 'c' });
    });

    it('should throw error for non-object input', () => {
      expect(() => {
        ArrayObjectUtils.invert(null as never);
      }).toThrow('Argument must be an object');
    });
  });

  describe('compact', () => {
    it('should remove falsy values from array', () => {
      const arr = [0, 1, false, 2, '', 3, null, undefined, NaN];
      const result = ArrayObjectUtils.compact(arr);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle array with no falsy values', () => {
      const arr = [1, 2, 3, 'hello', true];
      const result = ArrayObjectUtils.compact(arr);

      expect(result).toEqual([1, 2, 3, 'hello', true]);
    });

    it('should handle empty array', () => {
      const result = ArrayObjectUtils.compact([]);
      expect(result).toEqual([]);
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        ArrayObjectUtils.compact({} as never);
      }).toThrow('Argument must be an array');
    });
  });

  describe('intersection', () => {
    it('should return intersection of two arrays', () => {
      const result = ArrayObjectUtils.intersection([1, 2, 3], [2, 3, 4]);
      expect(result).toEqual([2, 3]);
    });

    it('should return intersection of multiple arrays', () => {
      const result = ArrayObjectUtils.intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]);
      expect(result).toEqual([3]);
    });

    it('should handle no common elements', () => {
      const result = ArrayObjectUtils.intersection([1, 2], [3, 4]);
      expect(result).toEqual([]);
    });

    it('should handle empty arrays', () => {
      const result = ArrayObjectUtils.intersection([], [1, 2]);
      expect(result).toEqual([]);
    });

    it('should throw error for non-array inputs', () => {
      expect(() => {
        ArrayObjectUtils.intersection([1, 2], {} as never);
      }).toThrow('All arguments must be arrays');
    });
  });

  describe('union', () => {
    it('should return union of two arrays', () => {
      const result = ArrayObjectUtils.union([1, 2], [2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return union of multiple arrays', () => {
      const result = ArrayObjectUtils.union([1, 2], [2, 3], [3, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should remove duplicates', () => {
      const result = ArrayObjectUtils.union([1, 1, 2], [2, 2, 3], [3, 3, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty arrays', () => {
      const result = ArrayObjectUtils.union([], [1, 2]);
      expect(result).toEqual([1, 2]);
    });

    it('should throw error for non-array inputs', () => {
      expect(() => {
        ArrayObjectUtils.union([1, 2], {} as never);
      }).toThrow('All arguments must be arrays');
    });
  });
});
