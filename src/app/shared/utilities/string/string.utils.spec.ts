import { describe, expect,it } from 'vitest';

import * as StringUtils from './string.utils';

describe('String Utils', () => {
  describe('truncate', () => {
    it('should truncate string to specified length', () => {
      expect(StringUtils.truncate('Hello World', { length: 8 })).toBe('Hello...');
    });

    it('should not truncate if string is shorter than length', () => {
      expect(StringUtils.truncate('Hello', { length: 10 })).toBe('Hello');
    });

    it('should use custom ellipsis', () => {
      expect(StringUtils.truncate('Hello World', { length: 8, ellipsis: '…' })).toBe('Hello…');
    });

    it('should break words when specified', () => {
      expect(StringUtils.truncate('Hello World', { length: 8, breakWords: true })).toBe('Hello...');
    });

    it('should truncate from middle', () => {
      const result = StringUtils.truncate('Hello World Test', {
        length: 12,
        position: 'middle',
      });
      expect(result).toBe('Hell...Test');
    });

    it('should truncate from start', () => {
      const result = StringUtils.truncate('Hello World', {
        length: 8,
        position: 'start',
      });
      expect(result).toBe('...World');
    });

    it('should handle empty string', () => {
      expect(StringUtils.truncate('', { length: 10 })).toBe('');
    });

    it('should not break words by default', () => {
      const result = StringUtils.truncate('The quick brown fox', { length: 10 });
      expect(result).toBe('The...');
    });
  });

  describe('slug', () => {
    it('should convert string to slug', () => {
      expect(StringUtils.slug('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(StringUtils.slug('Hello World!')).toBe('hello-world');
    });

    it('should use custom separator', () => {
      expect(StringUtils.slug('Hello World', { separator: '_' })).toBe('hello_world');
    });

    it('should preserve case when specified', () => {
      expect(StringUtils.slug('Hello World', { lowercase: false })).toBe('Hello-World');
    });

    it('should handle accented characters', () => {
      expect(StringUtils.slug('Café résumé')).toBe('cafe-resume');
    });

    it('should handle german characters', () => {
      expect(StringUtils.slug('Straße')).toBe('strasse');
    });

    it('should remove multiple spaces', () => {
      expect(StringUtils.slug('Hello   World')).toBe('hello-world');
    });

    it('should trim leading/trailing separators', () => {
      expect(StringUtils.slug('  Hello World  ')).toBe('hello-world');
    });

    it('should handle custom replacements', () => {
      expect(
        StringUtils.slug('Hello & World', {
          replacements: { '&': 'and' },
        })
      ).toBe('hello-and-world');
    });

    it('should preserve special chars when specified', () => {
      expect(
        StringUtils.slug('Hello@World', {
          removeSpecialChars: false,
        })
      ).toBe('hello@world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(StringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should not change rest of string', () => {
      expect(StringUtils.capitalize('hELLO')).toBe('HELLO');
    });

    it('should handle empty string', () => {
      expect(StringUtils.capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(StringUtils.capitalize('h')).toBe('H');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first and lowercase rest', () => {
      expect(StringUtils.capitalizeFirst('hELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(StringUtils.capitalizeFirst('')).toBe('');
    });
  });

  describe('titleCase', () => {
    it('should convert to title case', () => {
      expect(StringUtils.titleCase('hello world')).toBe('Hello World');
    });

    it('should handle multiple words', () => {
      expect(StringUtils.titleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle uppercase input', () => {
      expect(StringUtils.titleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(StringUtils.titleCase('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert space-separated to camelCase', () => {
      expect(StringUtils.camelCase('hello world')).toBe('helloWorld');
    });

    it('should convert hyphen-separated to camelCase', () => {
      expect(StringUtils.camelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert underscore-separated to camelCase', () => {
      expect(StringUtils.camelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle mixed separators', () => {
      expect(StringUtils.camelCase('hello-world_test case')).toBe('helloWorldTestCase');
    });

    it('should handle empty string', () => {
      expect(StringUtils.camelCase('')).toBe('');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(StringUtils.pascalCase('hello world')).toBe('HelloWorld');
    });

    it('should handle hyphen-separated', () => {
      expect(StringUtils.pascalCase('hello-world')).toBe('HelloWorld');
    });

    it('should handle empty string', () => {
      expect(StringUtils.pascalCase('')).toBe('');
    });
  });

  describe('snakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(StringUtils.snakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert PascalCase to snake_case', () => {
      expect(StringUtils.snakeCase('HelloWorld')).toBe('hello_world');
    });

    it('should convert spaces to underscores', () => {
      expect(StringUtils.snakeCase('Hello World')).toBe('hello_world');
    });

    it('should handle empty string', () => {
      expect(StringUtils.snakeCase('')).toBe('');
    });
  });

  describe('kebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(StringUtils.kebabCase('helloWorld')).toBe('hello-world');
    });

    it('should convert PascalCase to kebab-case', () => {
      expect(StringUtils.kebabCase('HelloWorld')).toBe('hello-world');
    });

    it('should convert spaces to hyphens', () => {
      expect(StringUtils.kebabCase('Hello World')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(StringUtils.kebabCase('')).toBe('');
    });
  });

  describe('reverse', () => {
    it('should reverse a string', () => {
      expect(StringUtils.reverse('hello')).toBe('olleh');
    });

    it('should handle empty string', () => {
      expect(StringUtils.reverse('')).toBe('');
    });

    it('should handle single character', () => {
      expect(StringUtils.reverse('a')).toBe('a');
    });
  });

  describe('removeWhitespace', () => {
    it('should remove all whitespace', () => {
      expect(StringUtils.removeWhitespace('hello world  test')).toBe('helloworldtest');
    });

    it('should handle tabs and newlines', () => {
      expect(StringUtils.removeWhitespace('hello\tworld\ntest')).toBe('helloworldtest');
    });

    it('should handle empty string', () => {
      expect(StringUtils.removeWhitespace('')).toBe('');
    });
  });

  describe('collapseWhitespace', () => {
    it('should collapse multiple spaces', () => {
      expect(StringUtils.collapseWhitespace('hello    world  test')).toBe('hello world test');
    });

    it('should trim leading/trailing spaces', () => {
      expect(StringUtils.collapseWhitespace('  hello world  ')).toBe('hello world');
    });

    it('should handle tabs and newlines', () => {
      expect(StringUtils.collapseWhitespace('hello\t\tworld\n\ntest')).toBe('hello world test');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(StringUtils.escapeHtml('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;&#x2F;div&gt;');
    });

    it('should escape ampersands', () => {
      expect(StringUtils.escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });

    it('should escape quotes', () => {
      expect(StringUtils.escapeHtml('He said "Hello"')).toBe('He said &quot;Hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(StringUtils.escapeHtml("It's working")).toBe('It&#x27;s working');
    });
  });

  describe('unescapeHtml', () => {
    it('should unescape HTML entities', () => {
      expect(StringUtils.unescapeHtml('&lt;div&gt;Hello&lt;&#x2F;div&gt;')).toBe(
        '<div>Hello</div>'
      );
    });

    it('should unescape ampersands', () => {
      expect(StringUtils.unescapeHtml('Hello &amp; World')).toBe('Hello & World');
    });

    it('should unescape quotes', () => {
      expect(StringUtils.unescapeHtml('He said &quot;Hello&quot;')).toBe('He said "Hello"');
    });
  });

  describe('escapeRegex', () => {
    it('should escape regex special characters', () => {
      expect(StringUtils.escapeRegex('hello.world*')).toBe('hello\\.world\\*');
    });

    it('should escape all special characters', () => {
      const input = '.*+?^${}()|[]\\';
      const result = StringUtils.escapeRegex(input);
      // Should be able to use result in RegExp without errors
      expect(() => new RegExp(result)).not.toThrow();
    });
  });

  describe('wordCount', () => {
    it('should count words', () => {
      expect(StringUtils.wordCount('hello world')).toBe(2);
    });

    it('should handle multiple spaces', () => {
      expect(StringUtils.wordCount('hello   world  test')).toBe(3);
    });

    it('should handle empty string', () => {
      expect(StringUtils.wordCount('')).toBe(0);
    });

    it('should handle single word', () => {
      expect(StringUtils.wordCount('hello')).toBe(1);
    });
  });

  describe('initials', () => {
    it('should extract initials from name', () => {
      expect(StringUtils.initials('John Doe')).toBe('JD');
    });

    it('should handle more than 2 names', () => {
      expect(StringUtils.initials('John Michael Doe')).toBe('JM');
    });

    it('should respect maxInitials parameter', () => {
      expect(StringUtils.initials('John Michael Doe', 3)).toBe('JMD');
    });

    it('should handle single name', () => {
      expect(StringUtils.initials('John')).toBe('J');
    });

    it('should handle empty string', () => {
      expect(StringUtils.initials('')).toBe('');
    });

    it('should handle lowercase input', () => {
      expect(StringUtils.initials('john doe')).toBe('JD');
    });
  });

  describe('isAlpha', () => {
    it('should return true for alphabetic string', () => {
      expect(StringUtils.isAlpha('hello')).toBe(true);
    });

    it('should return false for alphanumeric string', () => {
      expect(StringUtils.isAlpha('hello123')).toBe(false);
    });

    it('should return false for string with spaces', () => {
      expect(StringUtils.isAlpha('hello world')).toBe(false);
    });

    it('should handle uppercase', () => {
      expect(StringUtils.isAlpha('HELLO')).toBe(true);
    });

    it('should handle mixed case', () => {
      expect(StringUtils.isAlpha('HeLLo')).toBe(true);
    });
  });

  describe('isAlphanumeric', () => {
    it('should return true for alphanumeric string', () => {
      expect(StringUtils.isAlphanumeric('hello123')).toBe(true);
    });

    it('should return false for string with special chars', () => {
      expect(StringUtils.isAlphanumeric('hello-123')).toBe(false);
    });

    it('should return true for only letters', () => {
      expect(StringUtils.isAlphanumeric('hello')).toBe(true);
    });

    it('should return true for only numbers', () => {
      expect(StringUtils.isAlphanumeric('123')).toBe(true);
    });
  });

  describe('isNumeric', () => {
    it('should return true for numeric string', () => {
      expect(StringUtils.isNumeric('123')).toBe(true);
    });

    it('should return false for string with letters', () => {
      expect(StringUtils.isNumeric('123abc')).toBe(false);
    });

    it('should return false for decimal numbers', () => {
      expect(StringUtils.isNumeric('12.3')).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(StringUtils.isNumeric('-123')).toBe(false);
    });
  });

  describe('isLowerCase', () => {
    it('should return true for lowercase string', () => {
      expect(StringUtils.isLowerCase('hello')).toBe(true);
    });

    it('should return false for mixed case', () => {
      expect(StringUtils.isLowerCase('Hello')).toBe(false);
    });

    it('should return false for uppercase string', () => {
      expect(StringUtils.isLowerCase('HELLO')).toBe(false);
    });

    it('should return false for numbers only', () => {
      expect(StringUtils.isLowerCase('123')).toBe(false);
    });
  });

  describe('isUpperCase', () => {
    it('should return true for uppercase string', () => {
      expect(StringUtils.isUpperCase('HELLO')).toBe(true);
    });

    it('should return false for mixed case', () => {
      expect(StringUtils.isUpperCase('Hello')).toBe(false);
    });

    it('should return false for lowercase string', () => {
      expect(StringUtils.isUpperCase('hello')).toBe(false);
    });

    it('should return false for numbers only', () => {
      expect(StringUtils.isUpperCase('123')).toBe(false);
    });
  });

  describe('pad', () => {
    it('should pad string at end by default', () => {
      expect(StringUtils.pad('hello', 10)).toBe('hello     ');
    });

    it('should pad string at start', () => {
      expect(StringUtils.pad('hello', 10, '-', 'start')).toBe('-----hello');
    });

    it('should pad string on both sides', () => {
      const result = StringUtils.pad('hello', 11, '-', 'both');
      expect(result).toBe('---hello---');
    });

    it('should not pad if string is already long enough', () => {
      expect(StringUtils.pad('hello', 3)).toBe('hello');
    });

    it('should use custom pad string', () => {
      expect(StringUtils.pad('hello', 10, '.')).toBe('hello.....');
    });
  });

  describe('repeat', () => {
    it('should repeat string', () => {
      expect(StringUtils.repeat('abc', 3)).toBe('abcabcabc');
    });

    it('should handle zero count', () => {
      expect(StringUtils.repeat('abc', 0)).toBe('');
    });

    it('should handle single repeat', () => {
      expect(StringUtils.repeat('abc', 1)).toBe('abc');
    });
  });

  describe('chunk', () => {
    it('should split string into chunks', () => {
      expect(StringUtils.chunk('hello world', 3)).toEqual(['hel', 'lo ', 'wor', 'ld']);
    });

    it('should handle chunk size larger than string', () => {
      expect(StringUtils.chunk('hello', 10)).toEqual(['hello']);
    });

    it('should handle chunk size of 1', () => {
      expect(StringUtils.chunk('abc', 1)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(StringUtils.stripHtml('<div>Hello <strong>World</strong></div>')).toBe(
        'Hello World'
      );
    });

    it('should handle self-closing tags', () => {
      expect(StringUtils.stripHtml('Hello<br/>World')).toBe('HelloWorld');
    });

    it('should handle string without tags', () => {
      expect(StringUtils.stripHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('startsWith', () => {
    it('should check if string starts with substring', () => {
      expect(StringUtils.startsWith('Hello World', 'Hello')).toBe(true);
    });

    it('should be case-sensitive by default', () => {
      expect(StringUtils.startsWith('Hello World', 'hello')).toBe(false);
    });

    it('should support case-insensitive check', () => {
      expect(StringUtils.startsWith('Hello World', 'hello', true)).toBe(true);
    });

    it('should return false for non-matching substring', () => {
      expect(StringUtils.startsWith('Hello World', 'World')).toBe(false);
    });
  });

  describe('endsWith', () => {
    it('should check if string ends with substring', () => {
      expect(StringUtils.endsWith('Hello World', 'World')).toBe(true);
    });

    it('should be case-sensitive by default', () => {
      expect(StringUtils.endsWith('Hello World', 'world')).toBe(false);
    });

    it('should support case-insensitive check', () => {
      expect(StringUtils.endsWith('Hello World', 'world', true)).toBe(true);
    });

    it('should return false for non-matching substring', () => {
      expect(StringUtils.endsWith('Hello World', 'Hello')).toBe(false);
    });
  });

  describe('contains', () => {
    it('should check if string contains substring', () => {
      expect(StringUtils.contains('Hello World', 'World')).toBe(true);
    });

    it('should be case-sensitive by default', () => {
      expect(StringUtils.contains('Hello World', 'world')).toBe(false);
    });

    it('should support case-insensitive check', () => {
      expect(StringUtils.contains('Hello World', 'world', true)).toBe(true);
    });

    it('should return false for non-matching substring', () => {
      expect(StringUtils.contains('Hello World', 'Test')).toBe(false);
    });

    it('should find substring in middle', () => {
      expect(StringUtils.contains('Hello World', 'lo Wo')).toBe(true);
    });
  });
});
