/**
 * String utility functions for text manipulation and formatting
 *
 * @module StringUtils
 */

/**
 * Truncate options
 */
export interface TruncateOptions {
  /** Maximum length (default: 50) */
  length?: number;
  /** Ellipsis string (default: '...') */
  ellipsis?: string;
  /** Whether to break words (default: false) */
  breakWords?: boolean;
  /** Position to truncate: 'end', 'middle', or 'start' (default: 'end') */
  position?: 'end' | 'middle' | 'start';
}

/**
 * Slug options
 */
export interface SlugOptions {
  /** Separator character (default: '-') */
  separator?: string;
  /** Whether to lowercase (default: true) */
  lowercase?: boolean;
  /** Whether to remove special characters (default: true) */
  removeSpecialChars?: boolean;
  /** Custom replacements map */
  replacements?: Record<string, string>;
}

/**
 * Truncate a string with ellipsis
 *
 * @param str - String to truncate
 * @param options - Truncate options
 * @returns Truncated string
 *
 * @example
 * ```typescript
 * truncate('Hello World', { length: 8 });
 * // Returns: 'Hello...'
 *
 * truncate('Hello World', { length: 8, breakWords: true });
 * // Returns: 'Hello Wo...'
 *
 * truncate('Hello World', { length: 8, position: 'middle' });
 * // Returns: 'Hel...ld'
 * ```
 */
export function truncate(str: string, options: TruncateOptions = {}): string {
  const {
    length = 50,
    ellipsis = '...',
    breakWords = false,
    position = 'end',
  } = options;

  if (str.length <= length) {
    return str;
  }

  const ellipsisLength = ellipsis.length;

  if (position === 'middle') {
    const halfLength = Math.floor((length - ellipsisLength) / 2);
    const start = str.substring(0, halfLength);
    const end = str.substring(str.length - halfLength);
    return `${start}${ellipsis}${end}`;
  }

  if (position === 'start') {
    const keepLength = length - ellipsisLength;
    return `${ellipsis}${str.substring(str.length - keepLength)}`;
  }

  // position === 'end'
  const maxLength = length - ellipsisLength;

  if (breakWords) {
    return `${str.substring(0, maxLength)}${ellipsis}`;
  }

  // Don't break words
  const truncated = str.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return `${truncated.substring(0, lastSpace)}${ellipsis}`;
  }

  return `${truncated}${ellipsis}`;
}

/**
 * Generate a URL-friendly slug from a string
 *
 * @param str - String to convert to slug
 * @param options - Slug options
 * @returns URL-friendly slug
 *
 * @example
 * ```typescript
 * slug('Hello World!');
 * // Returns: 'hello-world'
 *
 * slug('Hello World!', { separator: '_' });
 * // Returns: 'hello_world'
 *
 * slug('Hello World!', { lowercase: false });
 * // Returns: 'Hello-World'
 * ```
 */
export function slug(str: string, options: SlugOptions = {}): string {
  const {
    separator = '-',
    lowercase = true,
    removeSpecialChars = true,
    replacements = {},
  } = options;

  let result = str.trim();

  // Apply custom replacements
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });

  // Convert to lowercase if specified
  if (lowercase) {
    result = result.toLowerCase();
  }

  // Replace common special characters with ASCII equivalents
  const charMap: Record<string, string> = {
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ý: 'y',
    ÿ: 'y',
    ñ: 'n',
    ç: 'c',
    ß: 'ss',
    æ: 'ae',
    œ: 'oe',
  };

  Object.entries(charMap).forEach(([char, replacement]) => {
    result = result.replace(new RegExp(char, 'g'), replacement);
  });

  // Replace spaces and underscores with separator
  result = result.replace(/[\s_]+/g, separator);

  if (removeSpecialChars) {
    // Remove all non-alphanumeric characters except the separator
    const regex = new RegExp(`[^a-z0-9${separator}]`, 'gi');
    result = result.replace(regex, '');
  }

  // Remove duplicate separators
  result = result.replace(new RegExp(`${separator}+`, 'g'), separator);

  // Remove leading and trailing separators
  result = result.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

  return result;
}

/**
 * Capitalize the first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * ```typescript
 * capitalize('hello world');
 * // Returns: 'Hello world'
 *
 * capitalize('HELLO WORLD');
 * // Returns: 'HELLO WORLD'
 * ```
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize the first letter and lowercase the rest
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * ```typescript
 * capitalizeFirst('HELLO WORLD');
 * // Returns: 'Hello world'
 * ```
 */
export function capitalizeFirst(str: string): string {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert a string to title case (capitalize first letter of each word)
 *
 * @param str - String to convert
 * @param options - Options for title case conversion
 * @returns Title case string
 *
 * @example
 * ```typescript
 * titleCase('hello world');
 * // Returns: 'Hello World'
 *
 * titleCase('the quick brown fox');
 * // Returns: 'The Quick Brown Fox'
 * ```
 */
export function titleCase(str: string): string {
  if (!str) {
    return str;
  }

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert string to camelCase
 *
 * @param str - String to convert
 * @returns camelCase string
 *
 * @example
 * ```typescript
 * camelCase('hello world');
 * // Returns: 'helloWorld'
 *
 * camelCase('hello-world');
 * // Returns: 'helloWorld'
 *
 * camelCase('hello_world');
 * // Returns: 'helloWorld'
 * ```
 */
export function camelCase(str: string): string {
  if (!str) {
    return str;
  }

  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert string to PascalCase
 *
 * @param str - String to convert
 * @returns PascalCase string
 *
 * @example
 * ```typescript
 * pascalCase('hello world');
 * // Returns: 'HelloWorld'
 *
 * pascalCase('hello-world');
 * // Returns: 'HelloWorld'
 * ```
 */
export function pascalCase(str: string): string {
  if (!str) {
    return str;
  }

  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Convert string to snake_case
 *
 * @param str - String to convert
 * @returns snake_case string
 *
 * @example
 * ```typescript
 * snakeCase('helloWorld');
 * // Returns: 'hello_world'
 *
 * snakeCase('Hello World');
 * // Returns: 'hello_world'
 * ```
 */
export function snakeCase(str: string): string {
  if (!str) {
    return str;
  }

  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .replace(/_+/g, '_') // Remove duplicate underscores
    .replace(/^_/, '')
    .toLowerCase();
}

/**
 * Convert string to kebab-case
 *
 * @param str - String to convert
 * @returns kebab-case string
 *
 * @example
 * ```typescript
 * kebabCase('helloWorld');
 * // Returns: 'hello-world'
 *
 * kebabCase('Hello World');
 * // Returns: 'hello-world'
 * ```
 */
export function kebabCase(str: string): string {
  if (!str) {
    return str;
  }

  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-/, '')
    .toLowerCase();
}

/**
 * Reverse a string
 *
 * @param str - String to reverse
 * @returns Reversed string
 *
 * @example
 * ```typescript
 * reverse('hello');
 * // Returns: 'olleh'
 * ```
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Remove all whitespace from a string
 *
 * @param str - String to process
 * @returns String without whitespace
 *
 * @example
 * ```typescript
 * removeWhitespace('hello world  test');
 * // Returns: 'helloworldtest'
 * ```
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Collapse multiple spaces into single space
 *
 * @param str - String to process
 * @returns String with collapsed spaces
 *
 * @example
 * ```typescript
 * collapseWhitespace('hello    world  test');
 * // Returns: 'hello world test'
 * ```
 */
export function collapseWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Escape HTML special characters
 *
 * @param str - String to escape
 * @returns HTML-escaped string
 *
 * @example
 * ```typescript
 * escapeHtml('<div>Hello & "World"</div>');
 * // Returns: '&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;'
 * ```
 */
export function escapeHtml(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Unescape HTML entities
 *
 * @param str - String to unescape
 * @returns Unescaped string
 *
 * @example
 * ```typescript
 * unescapeHtml('&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;');
 * // Returns: '<div>Hello & "World"</div>'
 * ```
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };

  return str.replace(/&(?:amp|lt|gt|quot|#x27|#x2F);/g, (entity) => htmlUnescapeMap[entity] || entity);
}

/**
 * Escape special regex characters
 *
 * @param str - String to escape
 * @returns Regex-escaped string
 *
 * @example
 * ```typescript
 * escapeRegex('hello.world*');
 * // Returns: 'hello\\.world\\*'
 * ```
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Count the number of words in a string
 *
 * @param str - String to count words in
 * @returns Number of words
 *
 * @example
 * ```typescript
 * wordCount('hello world');
 * // Returns: 2
 *
 * wordCount('hello   world  test');
 * // Returns: 3
 * ```
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Extract initials from a name
 *
 * @param str - Name string
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials in uppercase
 *
 * @example
 * ```typescript
 * initials('John Doe');
 * // Returns: 'JD'
 *
 * initials('John Michael Doe', 3);
 * // Returns: 'JMD'
 * ```
 */
export function initials(str: string, maxInitials = 2): string {
  if (!str) {
    return '';
  }

  return str
    .trim()
    .split(/\s+/)
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Check if a string contains only alphabetic characters
 *
 * @param str - String to check
 * @returns True if string contains only letters
 *
 * @example
 * ```typescript
 * isAlpha('hello');
 * // Returns: true
 *
 * isAlpha('hello123');
 * // Returns: false
 * ```
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Check if a string contains only alphanumeric characters
 *
 * @param str - String to check
 * @returns True if string contains only letters and numbers
 *
 * @example
 * ```typescript
 * isAlphanumeric('hello123');
 * // Returns: true
 *
 * isAlphanumeric('hello-123');
 * // Returns: false
 * ```
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if a string contains only numeric characters
 *
 * @param str - String to check
 * @returns True if string contains only numbers
 *
 * @example
 * ```typescript
 * isNumeric('123');
 * // Returns: true
 *
 * isNumeric('12.3');
 * // Returns: false
 * ```
 */
export function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

/**
 * Check if a string is lowercase
 *
 * @param str - String to check
 * @returns True if string is all lowercase
 *
 * @example
 * ```typescript
 * isLowerCase('hello');
 * // Returns: true
 *
 * isLowerCase('Hello');
 * // Returns: false
 * ```
 */
export function isLowerCase(str: string): boolean {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

/**
 * Check if a string is uppercase
 *
 * @param str - String to check
 * @returns True if string is all uppercase
 *
 * @example
 * ```typescript
 * isUpperCase('HELLO');
 * // Returns: true
 *
 * isUpperCase('Hello');
 * // Returns: false
 * ```
 */
export function isUpperCase(str: string): boolean {
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

/**
 * Pad a string to a certain length with another string
 *
 * @param str - String to pad
 * @param targetLength - Target length
 * @param padString - String to pad with (default: ' ')
 * @param position - Position to pad: 'start', 'end', or 'both' (default: 'end')
 * @returns Padded string
 *
 * @example
 * ```typescript
 * pad('hello', 10);
 * // Returns: 'hello     '
 *
 * pad('hello', 10, '-', 'start');
 * // Returns: '-----hello'
 *
 * pad('hello', 10, '-', 'both');
 * // Returns: '--hello---'
 * ```
 */
export function pad(
  str: string,
  targetLength: number,
  padString = ' ',
  position: 'start' | 'end' | 'both' = 'end'
): string {
  if (str.length >= targetLength) {
    return str;
  }

  const padLength = targetLength - str.length;

  if (position === 'start') {
    return padString.repeat(Math.ceil(padLength / padString.length)).slice(0, padLength) + str;
  }

  if (position === 'end') {
    return str + padString.repeat(Math.ceil(padLength / padString.length)).slice(0, padLength);
  }

  // position === 'both'
  const leftPad = Math.floor(padLength / 2);
  const rightPad = padLength - leftPad;

  return (
    padString.repeat(Math.ceil(leftPad / padString.length)).slice(0, leftPad) +
    str +
    padString.repeat(Math.ceil(rightPad / padString.length)).slice(0, rightPad)
  );
}

/**
 * Repeat a string n times
 *
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 *
 * @example
 * ```typescript
 * repeat('abc', 3);
 * // Returns: 'abcabcabc'
 * ```
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * Split a string into chunks of specified length
 *
 * @param str - String to split
 * @param chunkSize - Size of each chunk
 * @returns Array of string chunks
 *
 * @example
 * ```typescript
 * chunk('hello world', 3);
 * // Returns: ['hel', 'lo ', 'wor', 'ld']
 * ```
 */
export function chunk(str: string, chunkSize: number): string[] {
  const chunks: string[] = [];

  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.substring(i, i + chunkSize));
  }

  return chunks;
}

/**
 * Strip HTML tags from a string
 *
 * @param str - String with HTML tags
 * @returns String without HTML tags
 *
 * @example
 * ```typescript
 * stripHtml('<div>Hello <strong>World</strong></div>');
 * // Returns: 'Hello World'
 * ```
 */
export function stripHtml(str: string): string {
  let prev: string;
  let curr: string = str;
  do {
    prev = curr;
    curr = curr.replace(/<[^>]*>/g, '');
  } while (curr !== prev);
  return curr;
}

/**
 * Check if a string starts with a substring (case-insensitive option)
 *
 * @param str - String to check
 * @param searchString - Substring to search for
 * @param caseInsensitive - Whether to ignore case (default: false)
 * @returns True if string starts with searchString
 *
 * @example
 * ```typescript
 * startsWith('Hello World', 'Hello');
 * // Returns: true
 *
 * startsWith('Hello World', 'hello', true);
 * // Returns: true
 * ```
 */
export function startsWith(str: string, searchString: string, caseInsensitive = false): boolean {
  if (caseInsensitive) {
    return str.toLowerCase().startsWith(searchString.toLowerCase());
  }
  return str.startsWith(searchString);
}

/**
 * Check if a string ends with a substring (case-insensitive option)
 *
 * @param str - String to check
 * @param searchString - Substring to search for
 * @param caseInsensitive - Whether to ignore case (default: false)
 * @returns True if string ends with searchString
 *
 * @example
 * ```typescript
 * endsWith('Hello World', 'World');
 * // Returns: true
 *
 * endsWith('Hello World', 'world', true);
 * // Returns: true
 * ```
 */
export function endsWith(str: string, searchString: string, caseInsensitive = false): boolean {
  if (caseInsensitive) {
    return str.toLowerCase().endsWith(searchString.toLowerCase());
  }
  return str.endsWith(searchString);
}

/**
 * Check if a string contains a substring (case-insensitive option)
 *
 * @param str - String to check
 * @param searchString - Substring to search for
 * @param caseInsensitive - Whether to ignore case (default: false)
 * @returns True if string contains searchString
 *
 * @example
 * ```typescript
 * contains('Hello World', 'World');
 * // Returns: true
 *
 * contains('Hello World', 'world', true);
 * // Returns: true
 * ```
 */
export function contains(str: string, searchString: string, caseInsensitive = false): boolean {
  if (caseInsensitive) {
    return str.toLowerCase().includes(searchString.toLowerCase());
  }
  return str.includes(searchString);
}
