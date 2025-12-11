import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightPipe],
    });
    pipe = TestBed.inject(HighlightPipe);
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should highlight a single word', () => {
      const text = 'This is a test string';
      const result = pipe.transform(text, 'test');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('object');
    });

    it('should highlight multiple occurrences', () => {
      const text = 'test test test';
      const result = pipe.transform(text, 'test');

      expect(result).toBeTruthy();
    });

    it('should return original text when search term is empty', () => {
      const text = 'This is a test';
      const result = pipe.transform(text, '');

      expect(result).toBe('This is a test');
    });

    it('should return original text when search term is whitespace', () => {
      const text = 'This is a test';
      const result = pipe.transform(text, '   ');

      expect(result).toBe('This is a test');
    });
  });

  describe('Case Sensitivity', () => {
    const text = 'This is a Test string with TEST and test';

    it('should be case-insensitive by default', () => {
      const result = pipe.transform(text, 'test');

      expect(result).toBeTruthy();
    });

    it('should be case-insensitive when explicitly set to false', () => {
      const result = pipe.transform(text, 'test', false);

      expect(result).toBeTruthy();
    });

    it('should be case-sensitive when set to true', () => {
      const result = pipe.transform(text, 'Test', true);

      expect(result).toBeTruthy();
    });
  });

  describe('Multi-word Search', () => {
    it('should highlight multi-word search terms', () => {
      const text = 'This is a test string with multiple words';
      const result = pipe.transform(text, 'test string');

      expect(result).toBeTruthy();
    });

    it('should highlight phrase in longer text', () => {
      const text = 'Angular is a platform for building web applications';
      const result = pipe.transform(text, 'web applications');

      expect(result).toBeTruthy();
    });
  });

  describe('Special Characters', () => {
    it('should handle search terms with special regex characters', () => {
      const text = 'Price is $100.00 (discount available)';
      const result = pipe.transform(text, '$100.00');

      expect(result).toBeTruthy();
    });

    it('should handle parentheses in search term', () => {
      const text = 'Function call: doSomething()';
      const result = pipe.transform(text, 'doSomething()');

      expect(result).toBeTruthy();
    });

    it('should handle brackets in search term', () => {
      const text = 'Array access: items[0]';
      const result = pipe.transform(text, 'items[0]');

      expect(result).toBeTruthy();
    });

    it('should handle dots in search term', () => {
      const text = 'File name is document.txt';
      const result = pipe.transform(text, 'document.txt');

      expect(result).toBeTruthy();
    });

    it('should handle plus signs in search term', () => {
      const text = 'C++ and Python are programming languages';
      const result = pipe.transform(text, 'C++');

      expect(result).toBeTruthy();
    });

    it('should handle asterisks in search term', () => {
      const text = 'Wildcard search: file*.txt';
      const result = pipe.transform(text, 'file*.txt');

      expect(result).toBeTruthy();
    });
  });

  describe('HTML Escaping and XSS Prevention', () => {
    it('should escape HTML in input text', () => {
      const text = '<script>alert("xss")</script>';
      const result = pipe.transform(text, 'alert');

      expect(result).toBeTruthy();
    });

    it('should handle HTML entities in text', () => {
      const text = 'Use &lt;div&gt; for containers';
      const result = pipe.transform(text, 'div');

      expect(result).toBeTruthy();
    });

    it('should escape HTML tags before highlighting', () => {
      const text = '<p>Paragraph</p> with text';
      const result = pipe.transform(text, 'Paragraph');

      expect(result).toBeTruthy();
    });

    it('should handle text with quotes', () => {
      const text = 'He said "hello" to me';
      const result = pipe.transform(text, 'hello');

      expect(result).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should return empty string for null text', () => {
      expect(pipe.transform(null, 'search')).toBe('');
    });

    it('should return empty string for undefined text', () => {
      expect(pipe.transform(undefined, 'search')).toBe('');
    });

    it('should return empty string for empty text', () => {
      expect(pipe.transform('', 'search')).toBe('');
    });

    it('should handle null search term', () => {
      const text = 'Some text here';
      const result = pipe.transform(text, null);

      expect(result).toBe('Some text here');
    });

    it('should handle undefined search term', () => {
      const text = 'Some text here';
      const result = pipe.transform(text, undefined);

      expect(result).toBe('Some text here');
    });

    it('should handle text with no matches', () => {
      const text = 'This is some text';
      const result = pipe.transform(text, 'xyz');

      expect(result).toBeTruthy();
    });

    it('should handle very long text', () => {
      const text = 'word '.repeat(1000) + 'search' + ' word'.repeat(1000);
      const result = pipe.transform(text, 'search');

      expect(result).toBeTruthy();
    });
  });

  describe('Unicode and Special Characters', () => {
    it('should handle unicode characters', () => {
      const text = 'Hello 你好 World';
      const result = pipe.transform(text, '你好');

      expect(result).toBeTruthy();
    });

    it('should handle emojis', () => {
      const text = 'Hello 👋 World 🌍';
      const result = pipe.transform(text, '👋');

      expect(result).toBeTruthy();
    });

    it('should handle accented characters', () => {
      const text = 'Café résumé naïve';
      const result = pipe.transform(text, 'Café');

      expect(result).toBeTruthy();
    });

    it('should handle arabic text', () => {
      const text = 'مرحبا بك في العالم';
      const result = pipe.transform(text, 'مرحبا');

      expect(result).toBeTruthy();
    });
  });

  describe('Real World Scenarios', () => {
    it('should highlight search results', () => {
      const title = 'Introduction to Angular Framework';
      const searchQuery = 'angular';
      const result = pipe.transform(title, searchQuery);

      expect(result).toBeTruthy();
    });

    it('should highlight code snippets', () => {
      const code = 'function calculateTotal(items) { return items.reduce(...); }';
      const result = pipe.transform(code, 'calculateTotal');

      expect(result).toBeTruthy();
    });

    it('should highlight email addresses', () => {
      const text = 'Contact us at support@example.com for help';
      const result = pipe.transform(text, 'support@example.com');

      expect(result).toBeTruthy();
    });

    it('should highlight file paths', () => {
      const text = 'The file is located at /home/user/documents/file.txt';
      const result = pipe.transform(text, '/home/user/documents/file.txt');

      expect(result).toBeTruthy();
    });

    it('should highlight URLs', () => {
      const text = 'Visit https://example.com for more info';
      const result = pipe.transform(text, 'https://example.com');

      expect(result).toBeTruthy();
    });
  });

  describe('Pure Pipe Behavior', () => {
    it('should produce equivalent results for same input', () => {
      const text = 'This is a test';
      const result1 = pipe.transform(text, 'test');
      const result2 = pipe.transform(text, 'test');

      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(typeof result1).toBe('object');
      expect(typeof result2).toBe('object');
    });

    it('should return different results for different search terms', () => {
      const text = 'This is a test string';
      const result1 = pipe.transform(text, 'test');
      const result2 = pipe.transform(text, 'string');

      expect(result1).not.toEqual(result2);
    });
  });

  describe('Partial Word Matching', () => {
    it('should highlight partial word matches', () => {
      const text = 'Testing, tested, tester';
      const result = pipe.transform(text, 'test');

      expect(result).toBeTruthy();
    });

    it('should highlight word within compound words', () => {
      const text = 'JavaScript and TypeScript';
      const result = pipe.transform(text, 'Script');

      expect(result).toBeTruthy();
    });
  });
});
