# String Utilities

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: 120 passing tests, >95% coverage

Comprehensive string utility functions for text manipulation, formatting, and validation. Pure TypeScript implementation with zero dependencies.

## Features

- ✅ **Truncation**: Smart text truncation with ellipsis (end, middle, start positions)
- ✅ **Slug Generation**: URL-friendly slugs with customizable options
- ✅ **Case Conversion**: camelCase, PascalCase, snake_case, kebab-case, Title Case
- ✅ **Text Transformation**: Capitalize, reverse, repeat, chunk
- ✅ **Whitespace Control**: Remove, collapse, pad
- ✅ **HTML Utilities**: Escape, unescape, strip tags
- ✅ **Validation**: Alpha, alphanumeric, numeric, case checking
- ✅ **Search**: Case-sensitive/insensitive starts/ends/contains
- ✅ **Name Utilities**: Extract initials, word count
- ✅ **Zero Dependencies**: Pure TypeScript implementation
- ✅ **Type-safe**: Full TypeScript type safety with interfaces
- ✅ **Immutable**: Functions never mutate input strings

## Quick Start

### Import

```typescript
import {
  truncate,
  slug,
  titleCase,
  camelCase,
  escapeHtml,
} from '@shared/utilities/string/string.utils';
```

### Basic Usage

```typescript
// Truncate text
truncate('Hello World', { length: 8 }); // "Hello..."

// Create URL slug
slug('Hello World!'); // "hello-world"

// Convert case
titleCase('hello world'); // "Hello World"
camelCase('hello world'); // "helloWorld"

// Escape HTML
escapeHtml('<div>Hello</div>'); // "&lt;div&gt;Hello&lt;/div&gt;"
```

## Usage

### Truncation

```typescript
// Basic truncation
truncate('The quick brown fox', { length: 10 });
// Returns: "The..."

// Truncate from middle
truncate('Hello World Test', { length: 12, position: 'middle' });
// Returns: "Hell...Test"

// Truncate from start
truncate('Hello World', { length: 8, position: 'start' });
// Returns: "...World"

// Custom ellipsis
truncate('Hello World', { length: 8, ellipsis: '…' });
// Returns: "Hello…"

// Break words
truncate('Hello World', { length: 8, breakWords: true });
// Returns: "Hello..."
```

### Slug Generation

```typescript
// Basic slug
slug('Hello World!');
// Returns: "hello-world"

// Custom separator
slug('Hello World', { separator: '_' });
// Returns: "hello_world"

// Preserve case
slug('Hello World', { lowercase: false });
// Returns: "Hello-World"

// Handle accents
slug('Café résumé');
// Returns: "cafe-resume"

// Custom replacements
slug('Hello & World', {
  replacements: { '&': 'and' },
});
// Returns: "hello-and-world"

// Preserve special characters
slug('Hello@World', { removeSpecialChars: false });
// Returns: "hello@world"
```

### Case Conversion

```typescript
// Capitalize first letter only
capitalize('hello'); // "Hello"

// Capitalize first, lowercase rest
capitalizeFirst('HELLO'); // "Hello"

// Title Case (capitalize each word)
titleCase('hello world'); // "Hello World"

// camelCase
camelCase('hello world'); // "helloWorld"
camelCase('hello-world'); // "helloWorld"
camelCase('hello_world'); // "helloWorld"

// PascalCase
pascalCase('hello world'); // "HelloWorld"

// snake_case
snakeCase('helloWorld'); // "hello_world"
snakeCase('Hello World'); // "hello_world"

// kebab-case
kebabCase('helloWorld'); // "hello-world"
kebabCase('Hello World'); // "hello-world"
```

### Text Transformation

```typescript
// Reverse
reverse('hello'); // "olleh"

// Repeat
repeat('abc', 3); // "abcabcabc"

// Chunk into pieces
chunk('hello world', 3); // ["hel", "lo ", "wor", "ld"]

// Extract initials
initials('John Doe'); // "JD"
initials('John Michael Doe', 3); // "JMD"

// Word count
wordCount('hello world test'); // 3
```

### Whitespace Control

```typescript
// Remove all whitespace
removeWhitespace('hello world  test');
// Returns: "helloworldtest"

// Collapse multiple spaces to single
collapseWhitespace('hello    world  test');
// Returns: "hello world test"

// Pad string
pad('hello', 10); // "hello     "
pad('hello', 10, '-', 'start'); // "-----hello"
pad('hello', 11, '-', 'both'); // "---hello---"
```

### HTML Utilities

```typescript
// Escape HTML
escapeHtml('<div>Hello & "World"</div>');
// Returns: "&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;"

// Unescape HTML
unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;');
// Returns: "<div>Hello</div>"

// Strip HTML tags
stripHtml('<div>Hello <strong>World</strong></div>');
// Returns: "Hello World"

// Escape regex special characters
escapeRegex('hello.world*');
// Returns: "hello\\.world\\*"
```

### Validation

```typescript
// Check alphabetic
isAlpha('hello'); // true
isAlpha('hello123'); // false

// Check alphanumeric
isAlphanumeric('hello123'); // true
isAlphanumeric('hello-123'); // false

// Check numeric
isNumeric('123'); // true
isNumeric('12.3'); // false

// Check case
isLowerCase('hello'); // true
isUpperCase('HELLO'); // true
```

### Search Utilities

```typescript
// Case-sensitive search
startsWith('Hello World', 'Hello'); // true
endsWith('Hello World', 'World'); // true
contains('Hello World', 'lo Wo'); // true

// Case-insensitive search
startsWith('Hello World', 'hello', true); // true
endsWith('Hello World', 'world', true); // true
contains('Hello World', 'WORLD', true); // true
```

## API Reference

### Truncation

#### `truncate(str: string, options?: TruncateOptions): string`

Truncate a string with ellipsis.

**Options**:
```typescript
interface TruncateOptions {
  length?: number;                           // Default: 50
  ellipsis?: string;                         // Default: '...'
  breakWords?: boolean;                      // Default: false
  position?: 'end' | 'middle' | 'start';    // Default: 'end'
}
```

### Slug Generation

#### `slug(str: string, options?: SlugOptions): string`

Generate a URL-friendly slug.

**Options**:
```typescript
interface SlugOptions {
  separator?: string;                        // Default: '-'
  lowercase?: boolean;                       // Default: true
  removeSpecialChars?: boolean;              // Default: true
  replacements?: Record<string, string>;     // Custom replacements
}
```

### Capitalization

#### `capitalize(str: string): string`
Capitalize the first letter only.

#### `capitalizeFirst(str: string): string`
Capitalize first letter and lowercase the rest.

#### `titleCase(str: string): string`
Convert to Title Case (capitalize each word).

### Case Conversion

#### `camelCase(str: string): string`
Convert to camelCase.

#### `pascalCase(str: string): string`
Convert to PascalCase.

#### `snakeCase(str: string): string`
Convert to snake_case.

#### `kebabCase(str: string): string`
Convert to kebab-case.

### Transformation

#### `reverse(str: string): string`
Reverse a string.

#### `repeat(str: string, count: number): string`
Repeat a string n times.

#### `chunk(str: string, chunkSize: number): string[]`
Split string into chunks of specified length.

### Whitespace

#### `removeWhitespace(str: string): string`
Remove all whitespace from a string.

#### `collapseWhitespace(str: string): string`
Collapse multiple spaces into single space.

#### `pad(str: string, targetLength: number, padString?: string, position?: 'start' | 'end' | 'both'): string`
Pad a string to a certain length.

**Parameters**:
- `padString`: Default `' '`
- `position`: Default `'end'`

### HTML

#### `escapeHtml(str: string): string`
Escape HTML special characters.

#### `unescapeHtml(str: string): string`
Unescape HTML entities.

#### `stripHtml(str: string): string`
Strip HTML tags from a string.

#### `escapeRegex(str: string): string`
Escape special regex characters.

### Name Utilities

#### `wordCount(str: string): number`
Count the number of words in a string.

#### `initials(str: string, maxInitials?: number): string`
Extract initials from a name.

**Parameters**:
- `maxInitials`: Default `2`

### Validation

#### `isAlpha(str: string): boolean`
Check if string contains only alphabetic characters.

#### `isAlphanumeric(str: string): boolean`
Check if string contains only letters and numbers.

#### `isNumeric(str: string): boolean`
Check if string contains only numeric characters.

#### `isLowerCase(str: string): boolean`
Check if string is all lowercase.

#### `isUpperCase(str: string): boolean`
Check if string is all uppercase.

### Search

#### `startsWith(str: string, searchString: string, caseInsensitive?: boolean): boolean`
Check if string starts with substring.

#### `endsWith(str: string, searchString: string, caseInsensitive?: boolean): boolean`
Check if string ends with substring.

#### `contains(str: string, searchString: string, caseInsensitive?: boolean): boolean`
Check if string contains substring.

## Common Patterns

### URL-Friendly Titles

```typescript
function createPermalink(title: string): string {
  return `/blog/${slug(title)}`;
}

createPermalink('10 Tips for Better Code');
// Returns: "/blog/10-tips-for-better-code"
```

### Display Long Text

```typescript
function displayExcerpt(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) {
    return text;
  }

  return truncate(text, {
    length: maxLength,
    breakWords: false,
    ellipsis: '... [Read more]',
  });
}
```

### Sanitize User Input

```typescript
function sanitizeInput(input: string): string {
  // Collapse whitespace and trim
  let cleaned = collapseWhitespace(input);

  // Escape HTML to prevent XSS
  cleaned = escapeHtml(cleaned);

  return cleaned;
}
```

### Format Names

```typescript
interface User {
  firstName: string;
  lastName: string;
}

function formatUserName(user: User): string {
  return titleCase(`${user.firstName} ${user.lastName}`);
}

function getUserInitials(user: User): string {
  return initials(`${user.firstName} ${user.lastName}`);
}

// Usage
const user = { firstName: 'john', lastName: 'doe' };
formatUserName(user); // "John Doe"
getUserInitials(user); // "JD"
```

### Convert API Response Keys

```typescript
// Convert snake_case API keys to camelCase for frontend
function convertKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    result[camelCase(key)] = value;
  });

  return result;
}

// Example
convertKeys({ user_name: 'John', created_at: '2024-01-01' });
// Returns: { userName: 'John', createdAt: '2024-01-01' }
```

### Search with Highlighting

```typescript
function highlightMatch(text: string, searchTerm: string): string {
  if (!searchTerm || !contains(text, searchTerm, true)) {
    return escapeHtml(text);
  }

  // Escape for regex
  const escapedTerm = escapeRegex(searchTerm);
  const regex = new RegExp(`(${escapedTerm})`, 'gi');

  return escapeHtml(text).replace(
    regex,
    '<mark>$1</mark>'
  );
}
```

### Generate File Names

```typescript
function generateFileName(title: string, extension: string): string {
  const timestamp = Date.now();
  const slugifiedTitle = slug(title, { separator: '_' });

  return `${slugifiedTitle}_${timestamp}.${extension}`;
}

generateFileName('My Document', 'pdf');
// Returns: "my_document_1234567890.pdf"
```

### Format Code Identifiers

```typescript
// Component name from title
function componentName(title: string): string {
  return pascalCase(title) + 'Component';
}

// Constant name from title
function constantName(title: string): string {
  return snakeCase(title).toUpperCase();
}

// File name from component
function fileName(componentName: string): string {
  return kebabCase(componentName.replace(/Component$/, ''));
}

// Usage
const title = 'User Profile Card';
componentName(title);  // "UserProfileCardComponent"
constantName(title);   // "USER_PROFILE_CARD"
fileName(componentName(title)); // "user-profile-card"
```

## Best Practices

### 1. Choose the Right Truncation Method

```typescript
// For user-visible text - don't break words
truncate(longText, { length: 100, breakWords: false });

// For technical data - break words OK
truncate(longUrl, { length: 50, breakWords: true });

// For file names - truncate from middle to preserve extension
truncate('very-long-file-name.pdf', { length: 20, position: 'middle' });
// "very-lo...name.pdf"
```

### 2. Sanitize HTML Appropriately

```typescript
// For display only - escape HTML
const safeText = escapeHtml(userInput);

// For HTML content - use DomSanitizer (Angular)
// Don't use unescapeHtml on user input!

// For stripping formatting - use stripHtml
const plainText = stripHtml(richTextContent);
```

### 3. Use Slug for URLs

```typescript
// Good - URL-safe
const url = `/products/${slug(product.name)}`;

// Bad - may contain spaces/special chars
const url = `/products/${product.name}`;
```

### 4. Consistent Case Conversion

```typescript
// API/Database - use snake_case or kebab-case
const apiKey = snakeCase('userId'); // "user_id"

// JavaScript/TypeScript - use camelCase
const jsVar = camelCase('user_id'); // "userId"

// Classes/Components - use PascalCase
const className = pascalCase('user-profile'); // "UserProfile"

// Constants - use SCREAMING_SNAKE_CASE
const constant = snakeCase('maxRetries').toUpperCase(); // "MAX_RETRIES"
```

### 5. Validate Before Processing

```typescript
// Good - validate input type
function processUsername(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('Username must be a string');
  }

  return slug(input, { separator: '_' });
}

// Better - handle edge cases
function safeSlug(input: string | null | undefined): string {
  if (!input) {
    return '';
  }

  return slug(input);
}
```

### 6. Use Whitespace Functions Appropriately

```typescript
// For user display - collapse whitespace
const display = collapseWhitespace(userInput);

// For data processing - remove whitespace
const data = removeWhitespace(input);

// For formatting - use pad
const formatted = pad(value.toString(), 10, '0', 'start');
// Pads numbers: "42" → "0000000042"
```

## Testing

Comprehensive unit tests with 120 test cases:

```bash
npm test src/app/shared/utilities/string/string.utils.spec.ts
```

### Test Coverage

- ✅ Truncation (8 tests) - all positions, options, edge cases
- ✅ Slug generation (10 tests) - separators, accents, replacements
- ✅ Capitalization (8 tests) - capitalize, capitalizeFirst, titleCase
- ✅ Case conversion (16 tests) - camel, pascal, snake, kebab cases
- ✅ Text transformation (10 tests) - reverse, repeat, chunk, initials
- ✅ Whitespace control (9 tests) - remove, collapse, pad
- ✅ HTML utilities (9 tests) - escape, unescape, strip, regex escape
- ✅ Validation (17 tests) - alpha, alphanumeric, numeric, case checks
- ✅ Search utilities (13 tests) - starts, ends, contains with case options
- ✅ Word count (4 tests) - various scenarios
- ✅ Name utilities (6 tests) - initials extraction
- ✅ Edge cases (10 tests) - empty strings, special cases

### Testing in Your Code

```typescript
import { describe, it, expect } from 'vitest';
import { slug, truncate } from '@shared/utilities/string/string.utils';

describe('BlogPost', () => {
  it('should generate URL-safe slugs', () => {
    expect(slug('Hello World!')).toBe('hello-world');
  });

  it('should truncate long titles', () => {
    const result = truncate('Very Long Title Here', { length: 10 });
    expect(result).toBe('Very...');
  });
});
```

## Architecture

```
utilities/
└── string/
    ├── string.utils.ts       # Main utility functions (900+ lines)
    ├── string.utils.spec.ts  # Unit tests (120 tests, 500+ lines)
    └── README.md             # This file
```

## Performance

- **Zero Dependencies**: Pure TypeScript, no external libraries
- **Efficient**: All operations use native string methods
- **Immutable**: Never mutates input strings
- **Tree-shakeable**: Import only what you need
- **Type-safe**: Full TypeScript type checking

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Uses standard JavaScript String API which is universally supported.

## Migration Guide

### From lodash

```typescript
// lodash → our utils
import { truncate, camelCase, kebabCase, snakeCase } from 'lodash';
// Replace with:
import { truncate, camelCase, kebabCase, snakeCase } from '@shared/utilities/string/string.utils';

// Most functions have similar signatures
_.truncate(str, { length: 20 });
truncate(str, { length: 20 });
```

### From validator.js

```typescript
// validator.js → our utils
import validator from 'validator';
validator.isAlpha(str);
validator.isAlphanumeric(str);

// Replace with:
import { isAlpha, isAlphanumeric } from '@shared/utilities/string/string.utils';
isAlpha(str);
isAlphanumeric(str);
```

## License

Part of the MoodyJW Portfolio project.
