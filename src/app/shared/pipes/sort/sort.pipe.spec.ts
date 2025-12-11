import { beforeEach, describe, expect, it } from 'vitest';

import { SortPipe } from './sort.pipe';

interface TestItem {
  id: number;
  name: string;
  price?: number;
  createdAt?: Date;
  category?: string;
}

describe('SortPipe', () => {
  let pipe: SortPipe;
  let testItems: TestItem[];

  beforeEach(() => {
    pipe = new SortPipe();
    testItems = [
      { id: 3, name: 'Charlie', price: 150, category: 'B' },
      { id: 1, name: 'Alice', price: 100, category: 'A' },
      { id: 2, name: 'Bob', price: 200, category: 'C' },
      { id: 5, name: 'Eve', price: 50, category: 'A' },
      { id: 4, name: 'David', price: 175, category: 'B' },
    ];
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should return original array when no property/comparator provided', () => {
      const result = pipe.transform(testItems);
      expect(result).toEqual(testItems);
    });

    it('should return empty array for empty input', () => {
      const result = pipe.transform([]);
      expect(result).toEqual([]);
    });

    it('should not mutate the original array', () => {
      const original = [...testItems];
      pipe.transform(testItems, 'name');
      expect(testItems).toEqual(original);
    });
  });

  describe('Sort by String Property', () => {
    it('should sort by string property ascending by default', () => {
      const result = pipe.transform(testItems, 'name');
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
      expect(result[3].name).toBe('David');
      expect(result[4].name).toBe('Eve');
    });

    it('should sort by string property ascending explicitly', () => {
      const result = pipe.transform(testItems, 'name', 'asc');
      expect(result[0].name).toBe('Alice');
      expect(result[4].name).toBe('Eve');
    });

    it('should sort by string property descending', () => {
      const result = pipe.transform(testItems, 'name', 'desc');
      expect(result[0].name).toBe('Eve');
      expect(result[1].name).toBe('David');
      expect(result[2].name).toBe('Charlie');
      expect(result[3].name).toBe('Bob');
      expect(result[4].name).toBe('Alice');
    });

    it('should handle case-insensitive sorting', () => {
      const items = [
        { id: 1, name: 'zebra', price: 100 },
        { id: 2, name: 'Apple', price: 50 },
        { id: 3, name: 'banana', price: 75 },
      ];
      const result = pipe.transform(items, 'name');
      expect(result[0].name).toBe('Apple');
      expect(result[1].name).toBe('banana');
      expect(result[2].name).toBe('zebra');
    });
  });

  describe('Sort by Number Property', () => {
    it('should sort by number property ascending', () => {
      const result = pipe.transform(testItems, 'price');
      expect(result[0].price).toBe(50);
      expect(result[1].price).toBe(100);
      expect(result[2].price).toBe(150);
      expect(result[3].price).toBe(175);
      expect(result[4].price).toBe(200);
    });

    it('should sort by number property descending', () => {
      const result = pipe.transform(testItems, 'price', 'desc');
      expect(result[0].price).toBe(200);
      expect(result[1].price).toBe(175);
      expect(result[2].price).toBe(150);
      expect(result[3].price).toBe(100);
      expect(result[4].price).toBe(50);
    });

    it('should sort by id ascending', () => {
      const result = pipe.transform(testItems, 'id');
      expect(result[0].id).toBe(1);
      expect(result[4].id).toBe(5);
    });

    it('should sort by id descending', () => {
      const result = pipe.transform(testItems, 'id', 'desc');
      expect(result[0].id).toBe(5);
      expect(result[4].id).toBe(1);
    });
  });

  describe('Sort by Date Property', () => {
    it('should sort by date ascending', () => {
      const date1 = new Date(2025, 0, 1); // January 1, 2025
      const date2 = new Date(2025, 1, 1); // February 1, 2025
      const date3 = new Date(2025, 2, 1); // March 1, 2025
      const items = [
        { id: 1, name: 'A', createdAt: date3 },
        { id: 2, name: 'B', createdAt: date1 },
        { id: 3, name: 'C', createdAt: date2 },
      ];
      const result = pipe.transform(items, 'createdAt');
      expect(result[0].name).toBe('B'); // January (earliest)
      expect(result[1].name).toBe('C'); // February
      expect(result[2].name).toBe('A'); // March (latest)
    });

    it('should sort by date descending', () => {
      const date1 = new Date(2025, 0, 1); // January 1, 2025
      const date2 = new Date(2025, 1, 1); // February 1, 2025
      const date3 = new Date(2025, 2, 1); // March 1, 2025
      const items = [
        { id: 1, name: 'A', createdAt: date1 },
        { id: 2, name: 'B', createdAt: date3 },
        { id: 3, name: 'C', createdAt: date2 },
      ];
      const result = pipe.transform(items, 'createdAt', 'desc');
      expect(result[0].name).toBe('B'); // March (latest)
      expect(result[1].name).toBe('C'); // February
      expect(result[2].name).toBe('A'); // January (earliest)
    });
  });

  describe('Custom Comparator', () => {
    it('should sort using custom comparator', () => {
      const comparator = (a: TestItem, b: TestItem) => a.price! - b.price!;
      const result = pipe.transform(testItems, comparator);
      expect(result[0].price).toBe(50);
      expect(result[4].price).toBe(200);
    });

    it('should sort by multiple criteria with custom comparator', () => {
      const comparator = (a: TestItem, b: TestItem) => {
        // Sort by category first, then by price
        const categoryComparison = a.category!.localeCompare(b.category!);
        if (categoryComparison !== 0) return categoryComparison;
        return a.price! - b.price!;
      };
      const result = pipe.transform(testItems, comparator);
      expect(result[0].category).toBe('A');
      expect(result[0].price).toBe(50);
      expect(result[1].category).toBe('A');
      expect(result[1].price).toBe(100);
    });

    it('should handle reverse sort with custom comparator', () => {
      const comparator = (a: TestItem, b: TestItem) => b.price! - a.price!;
      const result = pipe.transform(testItems, comparator);
      expect(result[0].price).toBe(200);
      expect(result[4].price).toBe(50);
    });
  });

  describe('Null/Undefined Handling', () => {
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

    it('should sort items with null property values to the end (ascending)', () => {
      const items = [
        { id: 1, name: 'Alice', price: 100 },
        { id: 2, name: 'Bob', price: undefined },
        { id: 3, name: 'Charlie', price: 50 },
        { id: 4, name: 'David', price: null },
      ];
      const result = pipe.transform(items as TestItem[], 'price');
      expect(result[0].price).toBe(50);
      expect(result[1].price).toBe(100);
      expect(result[2].price).toBeUndefined();
      expect(result[3].price).toBeNull();
    });

    it('should handle all null values', () => {
      const items = [
        { id: 1, name: 'A', price: undefined },
        { id: 2, name: 'B', price: undefined },
        { id: 3, name: 'C', price: undefined },
      ];
      const result = pipe.transform(items, 'price');
      expect(result).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item array', () => {
      const items = [{ id: 1, name: 'Only', price: 100 }];
      const result = pipe.transform(items, 'name');
      expect(result).toEqual(items);
    });

    it('should handle array with duplicate values', () => {
      const items = [
        { id: 1, name: 'Alice', price: 100 },
        { id: 2, name: 'Alice', price: 50 },
        { id: 3, name: 'Bob', price: 100 },
      ];
      const result = pipe.transform(items, 'name');
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Alice');
      expect(result[2].name).toBe('Bob');
    });

    it('should handle already sorted array', () => {
      const sorted = [
        { id: 1, name: 'Alice', price: 50 },
        { id: 2, name: 'Bob', price: 100 },
        { id: 3, name: 'Charlie', price: 150 },
      ];
      const result = pipe.transform(sorted, 'name');
      expect(result).toEqual(sorted);
    });

    it('should handle reverse sorted array', () => {
      const reversed = [
        { id: 3, name: 'Charlie', price: 150 },
        { id: 2, name: 'Bob', price: 100 },
        { id: 1, name: 'Alice', price: 50 },
      ];
      const result = pipe.transform(reversed, 'name');
      expect(result[0].name).toBe('Alice');
      expect(result[2].name).toBe('Charlie');
    });
  });

  describe('Real World Scenarios', () => {
    it('should sort user list by name', () => {
      const users = [
        { id: 1, name: 'Zoe', price: 0 },
        { id: 2, name: 'Alice', price: 0 },
        { id: 3, name: 'Mike', price: 0 },
      ];
      const result = pipe.transform(users, 'name');
      expect(result.map((u) => u.name)).toEqual(['Alice', 'Mike', 'Zoe']);
    });

    it('should sort products by price (low to high)', () => {
      const result = pipe.transform(testItems, 'price');
      const prices = result.map((item) => item.price);
      expect(prices).toEqual([50, 100, 150, 175, 200]);
    });

    it('should sort products by price (high to low)', () => {
      const result = pipe.transform(testItems, 'price', 'desc');
      const prices = result.map((item) => item.price);
      expect(prices).toEqual([200, 175, 150, 100, 50]);
    });

    it('should sort blog posts by date (newest first)', () => {
      const posts = [
        { id: 1, name: 'Post 1', createdAt: new Date('2025-01-01') },
        { id: 2, name: 'Post 2', createdAt: new Date('2025-03-01') },
        { id: 3, name: 'Post 3', createdAt: new Date('2025-02-01') },
      ];
      const result = pipe.transform(posts, 'createdAt', 'desc');
      expect(result[0].name).toBe('Post 2');
      expect(result[1].name).toBe('Post 3');
      expect(result[2].name).toBe('Post 1');
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${1000 - i}`,
        price: Math.random() * 1000,
      }));
      const result = pipe.transform(largeArray, 'price');
      // Verify it's sorted
      for (let i = 1; i < result.length; i++) {
        expect(result[i].price!).toBeGreaterThanOrEqual(result[i - 1].price!);
      }
    });

    it('should handle arrays with complex objects', () => {
      const complexItems = testItems.map((item) => ({
        ...item,
        nested: { deep: { value: item.price } },
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comparator = (a: any, b: any) => a.nested.deep.value - b.nested.deep.value;
      const result = pipe.transform(complexItems, comparator);
      expect(result[0].price).toBe(50);
      expect(result[4].price).toBe(200);
    });
  });

  describe('Impure Pipe Behavior', () => {
    it('should detect array mutations (impure pipe)', () => {
      const items = [...testItems];
      const result1 = pipe.transform(items, 'name');

      // Mutate array
      items.push({ id: 6, name: 'Frank', price: 125 });

      const result2 = pipe.transform(items, 'name');

      expect(result2.length).toBe(result1.length + 1);
      expect(result2[result2.length - 1].name).toBe('Frank');
    });

    it('should always return new array reference', () => {
      const result1 = pipe.transform(testItems, 'name');
      const result2 = pipe.transform(testItems, 'name');

      // Even with same input, should return new array
      expect(result1).not.toBe(testItems);
      expect(result2).not.toBe(testItems);
      expect(result1).not.toBe(result2);
    });
  });

  describe('Mixed Type Fallback', () => {
    it('should handle mixed types by converting to string', () => {
      // any necessary for these tests
      const items = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: 1, name: 'A', price: '100' as any },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: 2, name: 'B', price: 50 as any },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: 3, name: 'C', price: '200' as any },
      ];
      const result = pipe.transform(items, 'price');
      // String comparison: '100' < '200' < '50'
      expect(result[0].price).toBe('100');
      expect(result[1].price).toBe('200');
      expect(result[2].price).toBe(50);
    });
  });
});
