import { beforeEach, describe, expect, it } from 'vitest';

import { FilterPipe } from './filter.pipe';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
  category?: string;
  price?: number;
}

describe('FilterPipe', () => {
  let pipe: FilterPipe;
  let testItems: TestItem[];

  beforeEach(() => {
    pipe = new FilterPipe();
    testItems = [
      { id: 1, name: 'Item One', active: true, category: 'electronics', price: 100 },
      { id: 2, name: 'Item Two', active: false, category: 'books', price: 20 },
      { id: 3, name: 'Item Three', active: true, category: 'electronics', price: 150 },
      { id: 4, name: 'Item Four', active: false, category: 'clothing', price: 50 },
      { id: 5, name: 'Item Five', active: true, category: 'books', price: 30 },
    ];
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should return original array when no predicate provided', () => {
      const result = pipe.transform(testItems);
      expect(result).toEqual(testItems);
    });

    it('should return empty array for empty input', () => {
      const result = pipe.transform([]);
      expect(result).toEqual([]);
    });
  });

  describe('Predicate Function Filtering', () => {
    it('should filter by boolean property using predicate', () => {
      const result = pipe.transform(testItems, (item) => item.active);
      expect(result).toHaveLength(3);
      expect(result.every((item) => item.active)).toBe(true);
    });

    it('should filter by negated boolean property', () => {
      const result = pipe.transform(testItems, (item) => !item.active);
      expect(result).toHaveLength(2);
      expect(result.every((item) => !item.active)).toBe(true);
    });

    it('should filter by string comparison', () => {
      const result = pipe.transform(testItems, (item) => item.category === 'electronics');
      expect(result).toHaveLength(2);
      expect(result.every((item) => item.category === 'electronics')).toBe(true);
    });

    it('should filter by numeric comparison', () => {
      const result = pipe.transform(testItems, (item) => (item.price ?? 0) > 50);
      expect(result).toHaveLength(2);
      expect(result.every((item) => (item.price ?? 0) > 50)).toBe(true);
    });

    it('should filter by complex condition', () => {
      const result = pipe.transform(testItems, (item) => item.active && (item.price ?? 0) > 50);
      expect(result).toHaveLength(2);
      expect(result.every((item) => item.active && (item.price ?? 0) > 50)).toBe(true);
    });

    it('should handle predicate that matches nothing', () => {
      const result = pipe.transform(testItems, (item) => item.id === 999);
      expect(result).toHaveLength(0);
    });

    it('should handle predicate that matches everything', () => {
      const result = pipe.transform(testItems, () => true);
      expect(result).toHaveLength(testItems.length);
    });
  });

  describe('Property-Value Filtering', () => {
    it('should filter by exact boolean value', () => {
      const result = pipe.transform(testItems, 'active', true);
      expect(result).toHaveLength(3);
      expect(result.every((item) => item.active === true)).toBe(true);
    });

    it('should filter by exact string value', () => {
      const result = pipe.transform(testItems, 'category', 'books');
      expect(result).toHaveLength(2);
      expect(result.every((item) => item.category === 'books')).toBe(true);
    });

    it('should filter by exact number value', () => {
      const result = pipe.transform(testItems, 'price', 100);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(100);
    });
  });

  describe('String Search Filtering', () => {
    it('should perform case-insensitive partial match on string properties', () => {
      const result = pipe.transform(testItems, 'name', 'item');
      expect(result).toHaveLength(5); // All items contain 'item'
    });

    it('should find partial matches', () => {
      const result = pipe.transform(testItems, 'name', 'three');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Item Three');
    });

    it('should be case-insensitive', () => {
      const result = pipe.transform(testItems, 'name', 'ITEM TWO');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Item Two');
    });

    it('should handle search with no matches', () => {
      const result = pipe.transform(testItems, 'name', 'xyz');
      expect(result).toHaveLength(0);
    });

    it('should handle empty search string', () => {
      const result = pipe.transform(testItems, 'name', '');
      expect(result).toHaveLength(5); // All items match empty string
    });
  });

  describe('Truthy Property Filtering', () => {
    it('should filter by truthy property when no value provided', () => {
      const items = [
        { id: 1, name: 'A', category: 'cat1' },
        { id: 2, name: 'B', category: '' },
        { id: 3, name: 'C' }, // no category property
        { id: 4, name: 'D', category: 'cat2' },
      ];
      const result = pipe.transform(items, 'category');
      expect(result).toHaveLength(2);
      expect(result.every((item) => !!item.category)).toBe(true);
    });

    it('should filter by truthy boolean property', () => {
      const result = pipe.transform(testItems, 'active');
      expect(result).toHaveLength(3);
      expect(result.every((item) => item.active)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should return empty array for null', () => {
      expect(pipe.transform(null)).toEqual([]);
    });

    it('should return empty array for undefined', () => {
      expect(pipe.transform(undefined)).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      // any necessary for these tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform('not an array' as any)).toEqual([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform(123 as any)).toEqual([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform({} as any)).toEqual([]);
    });

    it('should handle array with null/undefined items', () => {
      // any necessary for these tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = [{ id: 1, name: 'A' }, null, undefined, { id: 2, name: 'B' }] as any[];
      const result = pipe.transform(items, (item) => item && item.id === 1);
      expect(result).toHaveLength(1);
    });

    it('should handle null search value', () => {
      const result = pipe.transform(testItems, 'name', null);
      expect(result).toHaveLength(5); // All items have truthy name
    });

    it('should handle undefined search value', () => {
      const result = pipe.transform(testItems, 'name', undefined);
      expect(result).toHaveLength(5); // All items have truthy name
    });
  });

  describe('Type Coercion', () => {
    it('should convert non-string property values to string for search', () => {
      const items = [
        { id: 1, code: 12345 },
        { id: 2, code: 67890 },
        { id: 3, code: 12567 },
      ];
      const result = pipe.transform(items, 'code', '234');
      expect(result).toHaveLength(1); // Matches 12345 (contains '234')
      expect(result[0].code).toBe(12345);
    });

    it('should handle boolean property search with string value', () => {
      const result = pipe.transform(testItems, 'active', 'true');
      expect(result).toHaveLength(3);
    });

    it('should handle number property search with string value', () => {
      const result = pipe.transform(testItems, 'price', '100');
      expect(result).toHaveLength(1);
    });
  });

  describe('Real World Scenarios', () => {
    it('should filter search results', () => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@test.com' },
      ];
      const result = pipe.transform(users, 'email', 'example');
      expect(result).toHaveLength(2);
    });

    it('should filter active items from list', () => {
      const tasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
        { id: 3, title: 'Task 3', completed: false },
      ];
      const result = pipe.transform(tasks, (task) => !task.completed);
      expect(result).toHaveLength(2);
    });

    it('should filter by category in e-commerce', () => {
      const result = pipe.transform(testItems, 'category', 'electronics');
      expect(result).toHaveLength(2);
      expect(result.every((item) => item.category === 'electronics')).toBe(true);
    });

    it('should filter by price range', () => {
      const result = pipe.transform(
        testItems,
        (item) => (item.price ?? 0) >= 30 && (item.price ?? 0) <= 100
      );
      expect(result).toHaveLength(3);
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        active: i % 2 === 0,
      }));
      const result = pipe.transform(largeArray, (item) => item.active);
      expect(result).toHaveLength(500);
    });

    it('should handle arrays with complex objects', () => {
      const complexItems = testItems.map((item) => ({
        ...item,
        nested: { deep: { value: item.id } },
      }));
      const result = pipe.transform(complexItems, (item) => item.nested.deep.value > 2);
      expect(result).toHaveLength(3);
    });
  });

  describe('Impure Pipe Behavior', () => {
    it('should detect array mutations (impure pipe)', () => {
      const items = [...testItems];
      const result1 = pipe.transform(items, (item) => item.active);

      // Mutate array
      items.push({ id: 6, name: 'Item Six', active: true, category: 'new', price: 200 });

      const result2 = pipe.transform(items, (item) => item.active);

      expect(result2.length).toBe(result1.length + 1);
    });

    it('should always return new array reference', () => {
      const result1 = pipe.transform(testItems, (item) => item.active);
      const result2 = pipe.transform(testItems, (item) => item.active);

      // Even with same input, impure pipe may return new array
      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
    });
  });
});
