/**
 * Array and Object Utility Functions
 *
 * A comprehensive collection of type-safe utilities for working with arrays and objects.
 * Provides deep cloning, grouping, filtering, sorting, and transformation operations.
 *
 * @module ArrayObjectUtils
 */

/**
 * Options for deep cloning operations
 */
export interface DeepCloneOptions {
  /** Whether to preserve prototypes (default: false) */
  preservePrototypes?: boolean;
  /** Maximum depth to clone (prevents circular reference issues, default: 100) */
  maxDepth?: number;
}

/**
 * Options for sorting operations
 */
export interface SortOptions<T> {
  /** Sort order */
  order?: 'asc' | 'desc';
  /** Custom comparator function */
  comparator?: (a: T, b: T) => number;
  /** Case-sensitive string comparison (default: false) */
  caseSensitive?: boolean;
}

/**
 * Result of array difference operation
 */
export interface ArrayDifference<T> {
  /** Items only in first array */
  added: T[];
  /** Items only in second array */
  removed: T[];
  /** Items in both arrays */
  unchanged: T[];
}

/**
 * Creates a deep clone of any value (objects, arrays, primitives, dates, etc.)
 *
 * @param value - The value to clone
 * @param options - Cloning options
 * @returns A deep clone of the input value
 *
 * @example
 * ```typescript
 * const original = { name: 'John', address: { city: 'NYC' } };
 * const cloned = deepClone(original);
 * cloned.address.city = 'LA';
 * console.log(original.address.city); // 'NYC' (unchanged)
 * ```
 */
export function deepClone<T>(value: T, options: DeepCloneOptions = {}): T {
  const { preservePrototypes = false, maxDepth = 100 } = options;

  function cloneRecursive(val: unknown, depth: number): unknown {
    // Prevent infinite recursion
    if (depth > maxDepth) {
      throw new Error(`Maximum clone depth (${maxDepth}) exceeded`);
    }

    // Handle null and undefined
    if (val === null || val === undefined) {
      return val;
    }

    // Handle primitives
    if (typeof val !== 'object') {
      return val;
    }

    // Handle Date
    if (val instanceof Date) {
      return new Date(val.getTime());
    }

    // Handle RegExp
    if (val instanceof RegExp) {
      return new RegExp(val.source, val.flags);
    }

    // Handle Map
    if (val instanceof Map) {
      const clonedMap = new Map();
      val.forEach((value, key) => {
        clonedMap.set(cloneRecursive(key, depth + 1), cloneRecursive(value, depth + 1));
      });
      return clonedMap;
    }

    // Handle Set
    if (val instanceof Set) {
      const clonedSet = new Set();
      val.forEach((value) => {
        clonedSet.add(cloneRecursive(value, depth + 1));
      });
      return clonedSet;
    }

    // Handle Array
    if (Array.isArray(val)) {
      return val.map((item) => cloneRecursive(item, depth + 1));
    }

    // Handle Object
    const clonedObj: Record<string, unknown> = preservePrototypes
      ? Object.create(Object.getPrototypeOf(val))
      : {};

    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        clonedObj[key] = cloneRecursive((val as Record<string, unknown>)[key], depth + 1);
      }
    }

    return clonedObj;
  }

  return cloneRecursive(value, 0) as T;
}

/**
 * Groups array elements by a key or key function
 *
 * @param array - The array to group
 * @param key - Property key or function that returns the grouping key
 * @returns Object with grouped elements
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', role: 'admin' },
 *   { name: 'Jane', role: 'user' },
 *   { name: 'Bob', role: 'admin' }
 * ];
 * const byRole = groupBy(users, 'role');
 * // { admin: [{name: 'John', ...}, {name: 'Bob', ...}], user: [{name: 'Jane', ...}] }
 *
 * const byFirstLetter = groupBy(users, (u) => u.name[0]);
 * // { J: [{name: 'John', ...}, {name: 'Jane', ...}], B: [{name: 'Bob', ...}] }
 * ```
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string | number)
): Record<string, T[]> {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  const result: Record<string, T[]> = {};

  for (const item of array) {
    const groupKey =
      typeof key === 'function' ? String(key(item)) : String(item[key]);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }

  return result;
}

/**
 * Returns unique array elements based on a key or key function
 *
 * @param array - The array to filter
 * @param key - Property key or function that returns the uniqueness key
 * @returns Array with unique elements (first occurrence kept)
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 1, name: 'John Doe' }
 * ];
 * const unique = uniqueBy(users, 'id');
 * // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * ```
 */
export function uniqueBy<T>(
  array: T[],
  key?: keyof T | ((item: T) => unknown)
): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (!key) {
    // Use Set for primitive uniqueness
    return Array.from(new Set(array));
  }

  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of array) {
    const uniqueKey = typeof key === 'function' ? key(item) : item[key];

    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      result.push(item);
    }
  }

  return result;
}

/**
 * Sorts an array by a key or custom comparator
 *
 * @param array - The array to sort
 * @param key - Property key to sort by
 * @param options - Sorting options
 * @returns New sorted array (does not mutate original)
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 25 },
 *   { name: 'Bob', age: 35 }
 * ];
 * const sorted = sortBy(users, 'age');
 * // [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }, { name: 'Bob', age: 35 }]
 *
 * const descending = sortBy(users, 'age', { order: 'desc' });
 * // [{ name: 'Bob', age: 35 }, { name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
 * ```
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  options: SortOptions<T> = {}
): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  const { order = 'asc', comparator, caseSensitive = false } = options;
  const multiplier = order === 'asc' ? 1 : -1;

  return [...array].sort((a, b) => {
    if (comparator) {
      return comparator(a, b) * multiplier;
    }

    let aVal = a[key];
    let bVal = b[key];

    // Handle case-insensitive string comparison
    if (!caseSensitive && typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase() as T[keyof T];
      bVal = bVal.toLowerCase() as T[keyof T];
    }

    if (aVal < bVal) return -1 * multiplier;
    if (aVal > bVal) return 1 * multiplier;
    return 0;
  });
}

/**
 * Flattens a nested array to a specified depth
 *
 * @param array - The array to flatten
 * @param depth - Maximum depth to flatten (default: 1)
 * @returns Flattened array
 *
 * @example
 * ```typescript
 * const nested = [1, [2, [3, [4]]]];
 * flatten(nested, 1); // [1, 2, [3, [4]]]
 * flatten(nested, 2); // [1, 2, 3, [4]]
 * flatten(nested, Infinity); // [1, 2, 3, 4]
 * ```
 */
export function flatten<T>(array: T[], depth = 1): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (depth < 1) {
    return array;
  }

  return array.reduce((acc: T[], val: T) => {
    if (Array.isArray(val)) {
      acc.push(...(flatten(val, depth - 1) as T[]));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

/**
 * Chunks an array into smaller arrays of specified size
 *
 * @param array - The array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7];
 * chunk(numbers, 3); // [[1, 2, 3], [4, 5, 6], [7]]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (!Number.isInteger(size) || size < 1) {
    throw new TypeError('Chunk size must be a positive integer');
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Computes the difference between two arrays
 *
 * @param array1 - First array
 * @param array2 - Second array
 * @param key - Optional key function for object comparison
 * @returns Object containing added, removed, and unchanged items
 *
 * @example
 * ```typescript
 * const old = [1, 2, 3, 4];
 * const new = [3, 4, 5, 6];
 * arrayDifference(old, new);
 * // { added: [5, 6], removed: [1, 2], unchanged: [3, 4] }
 * ```
 */
export function arrayDifference<T>(
  array1: T[],
  array2: T[],
  key?: (item: T) => unknown
): ArrayDifference<T> {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    throw new TypeError('Both arguments must be arrays');
  }

  const getKey = key || ((item: T) => item);

  const set1 = new Map(array1.map((item) => [getKey(item), item]));
  const set2 = new Map(array2.map((item) => [getKey(item), item]));

  const added: T[] = [];
  const removed: T[] = [];
  const unchanged: T[] = [];

  // Find added and unchanged
  set2.forEach((item, k) => {
    if (set1.has(k)) {
      unchanged.push(item);
    } else {
      added.push(item);
    }
  });

  // Find removed
  set1.forEach((item, k) => {
    if (!set2.has(k)) {
      removed.push(item);
    }
  });

  return { added, removed, unchanged };
}

/**
 * Picks specified properties from an object
 *
 * @param obj - The source object
 * @param keys - Keys to pick
 * @returns New object with only specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
 * pick(user, ['id', 'name', 'email']);
 * // { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('First argument must be an object');
  }

  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits specified properties from an object
 *
 * @param obj - The source object
 * @param keys - Keys to omit
 * @returns New object without specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
 * omit(user, ['password']);
 * // { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('First argument must be an object');
  }

  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Merges multiple objects deeply
 *
 * @param target - Target object
 * @param sources - Source objects to merge
 * @returns Merged object
 *
 * @example
 * ```typescript
 * const defaults = { theme: 'light', fontSize: 14, features: { search: true } };
 * const user = { fontSize: 16, features: { darkMode: true } };
 * deepMerge(defaults, user);
 * // { theme: 'light', fontSize: 16, features: { search: true, darkMode: true } }
 * ```
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;

  const result = { ...target };

  for (const source of sources) {
    if (typeof source !== 'object' || source === null) {
      continue;
    }

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          result[key] = deepMerge(targetValue, sourceValue) as T[Extract<keyof T, string>];
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }
  }

  return result;
}

/**
 * Checks if an object is empty (no own properties)
 *
 * @param obj - Object to check
 * @returns True if object is empty
 *
 * @example
 * ```typescript
 * isEmpty({}); // true
 * isEmpty({ name: 'John' }); // false
 * isEmpty([]); // true
 * isEmpty([1, 2]); // false
 * ```
 */
export function isEmpty(obj: object): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  if (obj instanceof Map || obj instanceof Set) {
    return obj.size === 0;
  }

  return Object.keys(obj).length === 0;
}

/**
 * Gets a nested property value from an object using a path
 *
 * @param obj - The source object
 * @param path - Path to the property (dot notation or array)
 * @param defaultValue - Default value if path doesn't exist
 * @returns The property value or default value
 *
 * @example
 * ```typescript
 * const user = { name: 'John', address: { city: 'NYC', zip: '10001' } };
 * getPath(user, 'address.city'); // 'NYC'
 * getPath(user, ['address', 'zip']); // '10001'
 * getPath(user, 'address.country', 'USA'); // 'USA' (default)
 * ```
 */
export function getPath<T>(
  obj: unknown,
  path: string | string[],
  defaultValue?: T
): T | undefined {
  if (typeof obj !== 'object' || obj === null) {
    return defaultValue;
  }

  const keys = Array.isArray(path) ? path : path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }

  return result as T;
}

/**
 * Sets a nested property value in an object using a path
 *
 * @param obj - The target object
 * @param path - Path to the property (dot notation or array)
 * @param value - Value to set
 * @returns The modified object
 *
 * @example
 * ```typescript
 * const user = { name: 'John' };
 * setPath(user, 'address.city', 'NYC');
 * // { name: 'John', address: { city: 'NYC' } }
 * ```
 */
export function setPath<T extends object>(
  obj: T,
  path: string | string[],
  value: unknown
): T {
  // Prevent prototype pollution via dangerous keys anywhere in the path.
  const forbidden = ['__proto__', 'prototype', 'constructor'];
  const keys = Array.isArray(path) ? path : path.split('.');
  if (keys.some((k) => forbidden.includes(k))) {
    throw new Error(
      'Attempt to set forbidden property on object (prototype pollution blocked)'
    );
  }

  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('First argument must be an object');
  }

  let current: Record<string, unknown> = obj as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Inverts an object (swaps keys and values)
 *
 * @param obj - Object to invert
 * @returns Inverted object
 *
 * @example
 * ```typescript
 * const status = { active: 1, inactive: 0, pending: 2 };
 * invert(status); // { '1': 'active', '0': 'inactive', '2': 'pending' }
 * ```
 */
export function invert(obj: Record<string, string | number>): Record<string, string> {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('Argument must be an object');
  }

  const result: Record<string, string> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[String(obj[key])] = key;
    }
  }
  return result;
}

/**
 * Compacts an array by removing falsy values
 *
 * @param array - Array to compact
 * @returns Array with falsy values removed
 *
 * @example
 * ```typescript
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]);
 * // [1, 2, 3]
 * ```
 */
export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Argument must be an array');
  }

  return array.filter((item): item is T => Boolean(item));
}

/**
 * Returns the intersection of two or more arrays
 *
 * @param arrays - Arrays to intersect
 * @returns Array containing only elements present in all input arrays
 *
 * @example
 * ```typescript
 * intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [3]
 * ```
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.some((arr) => !Array.isArray(arr))) {
    throw new TypeError('All arguments must be arrays');
  }

  const [first, ...rest] = arrays;
  return uniqueBy(first).filter((item) => rest.every((arr) => arr.includes(item)));
}

/**
 * Returns the union of two or more arrays (unique elements from all arrays)
 *
 * @param arrays - Arrays to unite
 * @returns Array containing unique elements from all input arrays
 *
 * @example
 * ```typescript
 * union([1, 2], [2, 3], [3, 4]); // [1, 2, 3, 4]
 * ```
 */
export function union<T>(...arrays: T[][]): T[] {
  if (arrays.some((arr) => !Array.isArray(arr))) {
    throw new TypeError('All arguments must be arrays');
  }

  return uniqueBy(arrays.flat());
}
