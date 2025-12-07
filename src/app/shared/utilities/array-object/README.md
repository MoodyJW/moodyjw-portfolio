# Array and Object Utilities

A comprehensive collection of type-safe utilities for working with arrays and objects in TypeScript/Angular applications. These utilities provide deep cloning, grouping, filtering, sorting, and transformation operations with full type safety.

## Features

- **Deep Operations**: Deep clone, deep merge with circular reference protection
- **Array Transformations**: Group, unique, sort, flatten, chunk, compact
- **Set Operations**: Intersection, union, difference
- **Object Manipulation**: Pick, omit, invert, nested get/set
- **Type Safety**: Full TypeScript support with generics
- **Zero Dependencies**: Pure TypeScript implementation
- **Immutable**: Most operations return new instances without mutating originals
- **Well Tested**: 100+ comprehensive unit tests

## Quick Start

```typescript
import {
  deepClone,
  groupBy,
  uniqueBy,
  sortBy,
  pick,
  omit,
} from '@shared/utilities/array-object/array-object.utils';

// Deep clone objects
const cloned = deepClone({ name: 'John', address: { city: 'NYC' } });

// Group array items
const byRole = groupBy(users, 'role');

// Get unique items
const unique = uniqueBy(products, 'id');

// Sort arrays
const sorted = sortBy(items, 'price', { order: 'desc' });

// Filter object properties
const safe = omit(user, ['password', 'ssn']);
```

## Installation

These utilities are part of the shared utilities module. Import them directly:

```typescript
import * as ArrayObjectUtils from '@shared/utilities/array-object/array-object.utils';
// or
import { deepClone, groupBy } from '@shared/utilities/array-object/array-object.utils';
```

## API Reference

### Deep Clone

#### `deepClone<T>(value: T, options?: DeepCloneOptions): T`

Creates a deep clone of any value, including nested objects, arrays, Date, RegExp, Map, and Set.

**Options:**
- `preservePrototypes?: boolean` - Preserve object prototypes (default: false)
- `maxDepth?: number` - Maximum recursion depth (default: 100)

**Examples:**

```typescript
// Clone nested objects
const user = { name: 'John', address: { city: 'NYC', zip: '10001' } };
const cloned = deepClone(user);
cloned.address.city = 'LA';
console.log(user.address.city); // 'NYC' (unchanged)

// Clone arrays with nested objects
const items = [{ id: 1, tags: ['a', 'b'] }, { id: 2, tags: ['c'] }];
const clonedItems = deepClone(items);

// Clone special types
const date = deepClone(new Date());
const regex = deepClone(/test/gi);
const map = deepClone(new Map([['key', 'value']]));
const set = deepClone(new Set([1, 2, 3]));

// Preserve prototypes
class CustomClass {
  value = 42;
}
const instance = new CustomClass();
const cloned = deepClone(instance, { preservePrototypes: true });
console.log(cloned instanceof CustomClass); // true
```

### Array Grouping

#### `groupBy<T>(array: T[], key: keyof T | ((item: T) => string | number)): Record<string, T[]>`

Groups array elements by a property key or key function.

**Examples:**

```typescript
const users = [
  { name: 'John', role: 'admin', department: 'IT' },
  { name: 'Jane', role: 'user', department: 'HR' },
  { name: 'Bob', role: 'admin', department: 'IT' },
];

// Group by property
const byRole = groupBy(users, 'role');
// {
//   admin: [{ name: 'John', ... }, { name: 'Bob', ... }],
//   user: [{ name: 'Jane', ... }]
// }

// Group by function
const byFirstLetter = groupBy(users, (u) => u.name[0]);
// { J: [{ name: 'John', ... }, { name: 'Jane', ... }], B: [{ name: 'Bob', ... }] }

// Group by computed value
const byNameLength = groupBy(users, (u) => u.name.length);
```

### Unique Items

#### `uniqueBy<T>(array: T[], key?: keyof T | ((item: T) => unknown)): T[]`

Returns unique array elements based on a key or key function. First occurrence is kept.

**Examples:**

```typescript
// Unique primitives
const numbers = [1, 2, 2, 3, 3, 3];
uniqueBy(numbers); // [1, 2, 3]

// Unique by property
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John Doe' }, // Duplicate id
];
uniqueBy(users, 'id'); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// Unique by function
const products = [
  { sku: 'A123', name: 'Widget' },
  { sku: 'B456', name: 'Gadget' },
  { sku: 'A123', name: 'Widget Pro' }, // Duplicate SKU
];
uniqueBy(products, (p) => p.sku); // Keeps first occurrence
```

### Sorting

#### `sortBy<T>(array: T[], key: keyof T, options?: SortOptions<T>): T[]`

Sorts an array by a property key or custom comparator. Returns a new sorted array.

**Options:**
- `order?: 'asc' | 'desc'` - Sort order (default: 'asc')
- `comparator?: (a: T, b: T) => number` - Custom comparison function
- `caseSensitive?: boolean` - Case-sensitive string comparison (default: false)

**Examples:**

```typescript
const products = [
  { name: 'Widget', price: 29.99, stock: 5 },
  { name: 'Gadget', price: 19.99, stock: 10 },
  { name: 'Doohickey', price: 39.99, stock: 3 },
];

// Sort by price (ascending)
sortBy(products, 'price');
// [{ price: 19.99 }, { price: 29.99 }, { price: 39.99 }]

// Sort by price (descending)
sortBy(products, 'price', { order: 'desc' });
// [{ price: 39.99 }, { price: 29.99 }, { price: 19.99 }]

// Case-insensitive name sort
sortBy(products, 'name', { caseSensitive: false });

// Custom comparator
sortBy(products, 'stock', {
  comparator: (a, b) => {
    // Out of stock last
    if (a.stock === 0 && b.stock > 0) return 1;
    if (b.stock === 0 && a.stock > 0) return -1;
    return a.stock - b.stock;
  },
});
```

### Array Utilities

#### `flatten<T>(array: T[], depth?: number): T[]`

Flattens a nested array to a specified depth.

```typescript
const nested = [1, [2, [3, [4]]]];

flatten(nested); // [1, 2, [3, [4]]] (depth 1 by default)
flatten(nested, 2); // [1, 2, 3, [4]]
flatten(nested, Infinity); // [1, 2, 3, 4]
```

#### `chunk<T>(array: T[], size: number): T[][]`

Chunks an array into smaller arrays of specified size.

```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7];
chunk(numbers, 3); // [[1, 2, 3], [4, 5, 6], [7]]

// Useful for pagination
const items = [...Array(100)].map((_, i) => i);
const pages = chunk(items, 10); // 10 pages of 10 items each
```

#### `compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[]`

Removes all falsy values from an array.

```typescript
const mixed = [0, 1, false, 2, '', 3, null, undefined, NaN];
compact(mixed); // [1, 2, 3]

// Useful for filtering optional values
const names = ['John', '', 'Jane', null, 'Bob', undefined];
compact(names); // ['John', 'Jane', 'Bob']
```

#### `arrayDifference<T>(array1: T[], array2: T[], key?: (item: T) => unknown): ArrayDifference<T>`

Computes the difference between two arrays.

```typescript
const oldTags = ['javascript', 'typescript', 'react'];
const newTags = ['typescript', 'angular', 'rxjs'];

const diff = arrayDifference(oldTags, newTags);
// {
//   added: ['angular', 'rxjs'],
//   removed: ['javascript', 'react'],
//   unchanged: ['typescript']
// }

// With key function for objects
const oldUsers = [{ id: 1 }, { id: 2 }];
const newUsers = [{ id: 2 }, { id: 3 }];
const userDiff = arrayDifference(oldUsers, newUsers, (u) => u.id);
// {
//   added: [{ id: 3 }],
//   removed: [{ id: 1 }],
//   unchanged: [{ id: 2 }]
// }
```

### Set Operations

#### `intersection<T>(...arrays: T[][]): T[]`

Returns the intersection of two or more arrays.

```typescript
intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [3]

// Find common tags
const post1Tags = ['javascript', 'typescript', 'angular'];
const post2Tags = ['typescript', 'angular', 'rxjs'];
intersection(post1Tags, post2Tags); // ['typescript', 'angular']
```

#### `union<T>(...arrays: T[][]): T[]`

Returns the union of two or more arrays (unique elements from all arrays).

```typescript
union([1, 2], [2, 3], [3, 4]); // [1, 2, 3, 4]

// Merge tag lists
const allTags = union(
  ['javascript', 'typescript'],
  ['typescript', 'angular'],
  ['angular', 'rxjs']
);
// ['javascript', 'typescript', 'angular', 'rxjs']
```

### Object Utilities

#### `pick<T, K>(obj: T, keys: K[]): Pick<T, K>`

Picks specified properties from an object.

```typescript
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
  ssn: '123-45-6789',
};

// Create safe user object for API response
const safeUser = pick(user, ['id', 'name', 'email']);
// { id: 1, name: 'John', email: 'john@example.com' }
```

#### `omit<T, K>(obj: T, keys: K[]): Omit<T, K>`

Omits specified properties from an object.

```typescript
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
  ssn: '123-45-6789',
};

// Remove sensitive data
const safeUser = omit(user, ['password', 'ssn']);
// { id: 1, name: 'John', email: 'john@example.com' }
```

#### `deepMerge<T>(target: T, ...sources: Partial<T>[]): T`

Merges multiple objects deeply.

```typescript
const defaults = {
  theme: 'light',
  fontSize: 14,
  features: { search: true, notifications: true },
};

const userPrefs = {
  fontSize: 16,
  features: { darkMode: true },
};

const settings = deepMerge(defaults, userPrefs);
// {
//   theme: 'light',
//   fontSize: 16,
//   features: { search: true, notifications: true, darkMode: true }
// }

// Merge multiple sources
const final = deepMerge(defaults, userPrefs, { theme: 'dark' });
```

#### `isEmpty(obj: object): boolean`

Checks if an object, array, Map, or Set is empty.

```typescript
isEmpty({}); // true
isEmpty({ name: 'John' }); // false
isEmpty([]); // true
isEmpty([1, 2]); // false
isEmpty(new Map()); // true
isEmpty(new Set([1])); // false
```

### Nested Property Access

#### `getPath<T>(obj: unknown, path: string | string[], defaultValue?: T): T | undefined`

Gets a nested property value from an object using a path.

```typescript
const user = {
  name: 'John',
  address: {
    city: 'NYC',
    zip: '10001',
    coords: { lat: 40.7128, lng: -74.006 },
  },
};

// Dot notation
getPath(user, 'address.city'); // 'NYC'
getPath(user, 'address.coords.lat'); // 40.7128

// Array notation
getPath(user, ['address', 'coords', 'lng']); // -74.006

// With default value
getPath(user, 'address.country', 'USA'); // 'USA'
getPath(user, 'social.twitter', '@john'); // '@john'
```

#### `setPath<T>(obj: T, path: string | string[], value: unknown): T`

Sets a nested property value in an object using a path. Creates intermediate objects as needed.

```typescript
const user = { name: 'John' };

// Create nested structure
setPath(user, 'address.city', 'NYC');
// { name: 'John', address: { city: 'NYC' } }

setPath(user, 'address.coords.lat', 40.7128);
// { name: 'John', address: { city: 'NYC', coords: { lat: 40.7128 } } }

// Array notation
setPath(user, ['social', 'twitter'], '@john');
```

### Other Utilities

#### `invert(obj: Record<string, string | number>): Record<string, string>`

Inverts an object (swaps keys and values).

```typescript
const statusCodes = { active: 1, inactive: 0, pending: 2 };
const codeToStatus = invert(statusCodes);
// { '1': 'active', '0': 'inactive', '2': 'pending' }

// Useful for reverse lookups
const roleIds = { admin: 'ADM', user: 'USR', guest: 'GST' };
const idToRole = invert(roleIds);
console.log(idToRole['ADM']); // 'admin'
```

## Common Patterns

### Data Transformation Pipeline

```typescript
import { groupBy, sortBy, pick, compact } from '@shared/utilities/array-object/array-object.utils';

// Transform API response
const rawUsers = await fetchUsers();

const processedUsers = rawUsers
  .map((user) => pick(user, ['id', 'name', 'email', 'role', 'department']))
  .filter((user) => user.role !== 'deleted');

const byDepartment = groupBy(processedUsers, 'department');

// Sort users in each department
Object.keys(byDepartment).forEach((dept) => {
  byDepartment[dept] = sortBy(byDepartment[dept], 'name');
});
```

### Configuration Management

```typescript
import { deepMerge, getPath, setPath } from '@shared/utilities/array-object/array-object.utils';

const defaultConfig = {
  api: { baseUrl: 'https://api.example.com', timeout: 5000 },
  features: { analytics: true, debugging: false },
  ui: { theme: 'light', language: 'en' },
};

const userConfig = {
  api: { timeout: 10000 },
  ui: { theme: 'dark' },
};

const config = deepMerge(defaultConfig, userConfig);

// Access nested config
const timeout = getPath(config, 'api.timeout'); // 10000

// Update nested config
setPath(config, 'features.newFeature', true);
```

### State Management

```typescript
import { deepClone, setPath, arrayDifference } from '@shared/utilities/array-object/array-object.utils';

class StateManager {
  private state = {};

  update(path: string, value: unknown) {
    // Immutable update
    const newState = deepClone(this.state);
    setPath(newState, path, value);
    this.state = newState;
  }

  getState() {
    return deepClone(this.state);
  }
}

// Track changes
const oldItems = [{ id: 1 }, { id: 2 }];
const newItems = [{ id: 2 }, { id: 3 }];
const changes = arrayDifference(oldItems, newItems, (item) => item.id);

if (changes.added.length > 0) {
  console.log('Added:', changes.added);
}
if (changes.removed.length > 0) {
  console.log('Removed:', changes.removed);
}
```

### Form Data Processing

```typescript
import { pick, omit, compact } from '@shared/utilities/array-object/array-object.utils';

// Clean form data before submission
function prepareFormData(formValue: any) {
  // Remove UI-only fields
  let data = omit(formValue, ['_formId', '_metadata']);

  // Remove empty optional fields
  data = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null && value !== '')
  );

  // Pick only allowed fields
  return pick(data, ['name', 'email', 'phone', 'message']);
}
```

### Data Deduplication

```typescript
import { uniqueBy, intersection } from '@shared/utilities/array-object/array-object.utils';

// Remove duplicate products
const products = [
  { id: 1, sku: 'A123', name: 'Widget' },
  { id: 2, sku: 'B456', name: 'Gadget' },
  { id: 3, sku: 'A123', name: 'Widget' }, // Duplicate SKU
];

const uniqueProducts = uniqueBy(products, 'sku');

// Find products in multiple categories
const electronics = [{ id: 1 }, { id: 2 }, { id: 3 }];
const deals = [{ id: 2 }, { id: 4 }];
const featured = [{ id: 2 }, { id: 5 }];

const commonProducts = intersection(electronics, deals, featured);
// Products in all three categories
```

## Best Practices

### 1. Use Type Safety

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe operations
const users: User[] = [...];
const byEmail = groupBy<User>(users, 'email');
const unique = uniqueBy<User>(users, (u) => u.id);
```

### 2. Immutability

```typescript
// Good - creates new array
const sorted = sortBy(users, 'name');

// Bad - mutates original
users.sort((a, b) => a.name.localeCompare(b.name));

// Good - clone before modifying
const updated = deepClone(original);
updated.nested.value = 'new';

// Bad - mutates original
original.nested.value = 'new';
```

### 3. Performance Considerations

```typescript
// For large arrays, consider performance
const largeArray = [...Array(100000)];

// Good - single pass
const uniqueSorted = sortBy(uniqueBy(largeArray), 'value');

// Less efficient - multiple passes with intermediate arrays
const step1 = largeArray.filter((x) => x.value > 0);
const step2 = uniqueBy(step1, 'id');
const step3 = sortBy(step2, 'value');

// For very deep objects, set max depth
const cloned = deepClone(veryDeepObject, { maxDepth: 50 });
```

### 4. Null Safety

```typescript
// Use default values for nested access
const city = getPath(user, 'address.city', 'Unknown');

// Check for empty before processing
if (!isEmpty(config)) {
  processConfig(config);
}

// Compact to remove null/undefined
const validEmails = compact(users.map((u) => u.email));
```

### 5. Functional Composition

```typescript
// Compose operations for cleaner code
const processData = (data: User[]) =>
  sortBy(uniqueBy(compact(data), 'id'), 'name');

// Use with RxJS
import { map } from 'rxjs/operators';

users$.pipe(
  map((users) => groupBy(users, 'department')),
  map((grouped) => Object.entries(grouped).map(([dept, users]) => ({
    department: dept,
    users: sortBy(users, 'name'),
  })))
);
```

### 6. Error Handling

```typescript
// Handle potential errors
try {
  const cloned = deepClone(circularObject);
} catch (error) {
  console.error('Clone failed:', error);
  // Handle circular reference or max depth exceeded
}

// Validate inputs
if (!Array.isArray(data)) {
  throw new TypeError('Expected array');
}
```

## Testing

### Unit Testing

```typescript
import { describe, it, expect } from 'vitest';
import { groupBy, deepClone } from '@shared/utilities/array-object/array-object.utils';

describe('User Processing', () => {
  it('should group users by role', () => {
    const users = [
      { name: 'John', role: 'admin' },
      { name: 'Jane', role: 'user' },
    ];

    const result = groupBy(users, 'role');

    expect(result.admin).toHaveLength(1);
    expect(result.user).toHaveLength(1);
  });

  it('should deep clone without mutation', () => {
    const original = { nested: { value: 1 } };
    const cloned = deepClone(original);

    cloned.nested.value = 2;

    expect(original.nested.value).toBe(1);
  });
});
```

## Performance Notes

- `deepClone`: O(n) where n is the number of properties/elements. Use `maxDepth` for very deep structures.
- `groupBy`: O(n) single pass through array
- `uniqueBy`: O(n) using Set for tracking seen values
- `sortBy`: O(n log n) using native sort
- `flatten`: O(n × d) where d is depth
- `intersection`: O(n × m) where n and m are array lengths
- `getPath`/`setPath`: O(d) where d is path depth

For very large datasets (>10,000 items), consider using specialized libraries or implementing custom optimizations.

## Browser Compatibility

These utilities use modern JavaScript features:
- ES6+ syntax (const, let, arrow functions)
- Array methods (map, filter, reduce, flat)
- Object methods (Object.entries, Object.keys)
- Set and Map

Supported in all modern browsers and Node.js 14+.

## Related Utilities

- [Date Utilities](../date/README.md) - Date manipulation and formatting
- [String Utilities](../string/README.md) - String transformation and validation
- [Validation Utilities](../validation/README.md) - Input validation and Angular validators

## License

MIT License - Part of the moodyjw-portfolio project.
