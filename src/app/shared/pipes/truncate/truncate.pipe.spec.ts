import { beforeEach,describe, expect, it } from 'vitest';

import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = pipe.transform(text, 20);
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result).toContain('...');
    });

    it('should not truncate text shorter than max length', () => {
      const text = 'Short text';
      expect(pipe.transform(text, 50)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exact';
      expect(pipe.transform(text, 5)).toBe('Exact');
    });
  });

  describe('Truncation Positions', () => {
    const longText = 'This is a very long text that will be truncated';

    it('should truncate at end by default', () => {
      const result = pipe.transform(longText, 20);
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should truncate at end when explicitly specified', () => {
      const result = pipe.transform(longText, 20, { position: 'end' });
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should truncate in middle', () => {
      const result = pipe.transform(longText, 20, { position: 'middle' });
      expect(result).toContain('...');
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it('should truncate at start', () => {
      const result = pipe.transform(longText, 20, { position: 'start' });
      expect(result.startsWith('...')).toBe(true);
      expect(result.length).toBeLessThanOrEqual(20);
    });
  });

  describe('Custom Ellipsis', () => {
    const text = 'This is a long text that needs truncation';

    it('should use default ellipsis (...)', () => {
      const result = pipe.transform(text, 20);
      expect(result).toContain('...');
    });

    it('should use custom ellipsis', () => {
      const result = pipe.transform(text, 20, { ellipsis: '…' });
      expect(result).toContain('…');
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it('should use empty ellipsis', () => {
      const result = pipe.transform(text, 20, { ellipsis: '' });
      // With empty ellipsis and word boundaries, length may be less than 20
      expect(result.length).toBeLessThanOrEqual(20);
    });
  });

  describe('BreakWords Option', () => {
    const text = 'This is a very long text that should be truncated';

    it('should break at word boundaries by default (breakWords: false)', () => {
      const result = pipe.transform(text, 25);
      expect(result.length).toBeLessThanOrEqual(25);
      expect(result).toContain('...');
    });

    it('should break at word boundaries when breakWords is false', () => {
      const result = pipe.transform(text, 25, { breakWords: false });
      expect(result.length).toBeLessThanOrEqual(25);
    });

    it('should break mid-word when breakWords is true', () => {
      const result = pipe.transform(text, 25, { breakWords: true });
      expect(result.length).toBe(25);
    });
  });

  describe('Edge Cases', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null, 50)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined, 50)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('', 50)).toBe('');
    });

    it('should return original value when maxLength is undefined', () => {
      const text = 'Some text';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform(text, undefined as any)).toBe(text);
    });

    it('should return original value when maxLength is null', () => {
      const text = 'Some text';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform(text, null as any)).toBe(text);
    });

    it('should handle maxLength of 0', () => {
      const text = 'Some text';
      const result = pipe.transform(text, 0);
      expect(result).toBe('...');
    });

    it('should handle very short maxLength', () => {
      const text = 'Some text';
      const result = pipe.transform(text, 3);
      expect(result).toBe('...');
    });
  });

  describe('Pure Pipe Behavior', () => {
    it('should return same result for same input (pure pipe caching)', () => {
      const text = 'This is some text to truncate';
      const result1 = pipe.transform(text, 15);
      const result2 = pipe.transform(text, 15);

      expect(result1).toBe(result2);
    });

    it('should return different results for different lengths', () => {
      const text = 'This is some text to truncate';
      const result1 = pipe.transform(text, 15);
      const result2 = pipe.transform(text, 20);

      expect(result1).not.toBe(result2);
    });
  });

  describe('Real World Scenarios', () => {
    it('should handle blog excerpts', () => {
      const excerpt = 'Learn how to build scalable applications with Angular and TypeScript.';
      const result = pipe.transform(excerpt, 40, { breakWords: false });

      expect(result.length).toBeLessThanOrEqual(40);
      expect(result).toContain('...');
    });

    it('should handle file names with middle truncation', () => {
      const filename = 'very-long-document-name-with-important-extension.pdf';
      const result = pipe.transform(filename, 30, { position: 'middle' });

      expect(result.length).toBeLessThanOrEqual(30);
      expect(result).toContain('...');
      expect(result.endsWith('.pdf')).toBe(true);
    });
  });
});
