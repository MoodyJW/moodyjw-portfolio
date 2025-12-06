# Date Utilities

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: 112 passing tests, >95% coverage

Comprehensive date utility functions for formatting, manipulation, and validation. Pure TypeScript implementation with zero dependencies.

## Features

- ✅ **Multiple Format Options**: ISO, long, medium, short formats
- ✅ **Time Formatting**: 12-hour and 24-hour formats with optional seconds
- ✅ **Relative Time**: "2 hours ago", "in 3 days" with customizable options
- ✅ **Date Validation**: Type-safe validation with TypeScript type guards
- ✅ **Date Comparison**: Check for today, yesterday, tomorrow, past, future
- ✅ **Date Math**: Add/subtract days, months, years
- ✅ **Range Checking**: Verify if date is within a range
- ✅ **Difference Calculation**: Calculate days or hours between dates
- ✅ **Boundary Helpers**: Start/end of day and month
- ✅ **Locale Support**: All formatting functions support custom locales
- ✅ **Type-safe**: Full TypeScript type safety with interfaces
- ✅ **Zero Dependencies**: Pure TypeScript implementation
- ✅ **Immutable**: Functions never mutate input dates

## Quick Start

### Import

```typescript
import {
  formatDate,
  formatDateISO,
  timeAgo,
  isValidDate,
  addDays,
} from '@shared/utilities/date/date.utils';
```

### Basic Usage

```typescript
// Format dates
formatDate(new Date()); // "3/15/2024"
formatDateISO(new Date()); // "2024-03-15"

// Relative time
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
timeAgo(twoHoursAgo); // "2 hours ago"

// Validate
isValidDate(new Date()); // true
isValidDate('invalid'); // false

// Date math
addDays(new Date(), 7); // Date one week from now
```

## Usage

### Date Formatting

#### ISO Format (YYYY-MM-DD)

```typescript
formatDateISO(new Date('2024-03-15'));
// Returns: "2024-03-15"

// Works with Date objects, strings, or timestamps
formatDateISO(Date.now());
formatDateISO('2024-03-15');
```

#### Flexible Date Formatting

```typescript
// Default format
formatDate(new Date('2024-03-15'));
// Returns: "3/15/2024"

// With time (12-hour)
formatDate(new Date('2024-03-15T14:30:00'), { includeTime: true });
// Returns: "3/15/2024, 2:30 PM"

// With time (24-hour)
formatDate(new Date('2024-03-15T14:30:00'), {
  includeTime: true,
  use12Hour: false,
});
// Returns: "3/15/2024, 14:30"

// With seconds
formatDate(new Date('2024-03-15T14:30:45'), {
  includeTime: true,
  includeSeconds: true,
});
// Returns: "3/15/2024, 2:30:45 PM"

// Custom locale
formatDate(new Date('2024-03-15'), { locale: 'de-DE' });
// Returns: "15.3.2024"
```

#### Named Formats

```typescript
// Long format
formatDateLong(new Date('2024-03-15'));
// Returns: "March 15, 2024"

// Medium format
formatDateMedium(new Date('2024-03-15'));
// Returns: "Mar 15, 2024"

// Short format
formatDateShort(new Date('2024-03-15'));
// Returns: "3/15/24"
```

#### Time Formatting

```typescript
// 12-hour format (default)
formatTime(new Date('2024-03-15T14:30:00'));
// Returns: "2:30 PM"

// 24-hour format
formatTime(new Date('2024-03-15T14:30:00'), false);
// Returns: "14:30"

// With seconds
formatTime(new Date('2024-03-15T14:30:45'), true, true);
// Returns: "2:30:45 PM"
```

### Relative Time

```typescript
// Basic usage
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
timeAgo(twoHoursAgo);
// Returns: "2 hours ago"

// Future dates
const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
timeAgo(inThreeDays);
// Returns: "in 3 days"

// Short format
timeAgo(twoHoursAgo, { short: true });
// Returns: "2h ago"

// Without suffix
timeAgo(twoHoursAgo, { includeSuffix: false });
// Returns: "2 hours"

// Maximum unit constraint
const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
timeAgo(fiveDaysAgo, { maxUnit: 'hour' });
// Returns: "120 hours ago"
```

### Date Validation

```typescript
// Type guard validation
isValidDate(new Date()); // true
isValidDate(new Date('invalid')); // false
isValidDate('2024-03-15'); // true
isValidDate('not a date'); // false
isValidDate(null); // false
isValidDate(undefined); // false

// Use in type narrowing
function processDate(input: unknown) {
  if (isValidDate(input)) {
    // TypeScript knows input is a valid date
    const date = new Date(input);
    // ...
  }
}
```

### Date Comparison

```typescript
// Check if today
isToday(new Date()); // true
isToday(new Date('2020-01-01')); // false

// Check if yesterday
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
isYesterday(yesterday); // true

// Check if tomorrow
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
isTomorrow(tomorrow); // true

// Check if past/future
isPast(new Date('2020-01-01')); // true
isFuture(new Date('2030-01-01')); // true

// Check if same day (ignores time)
const morning = new Date('2024-03-15T08:00:00');
const evening = new Date('2024-03-15T20:00:00');
isSameDay(morning, evening); // true

// Check if within range
const date = new Date('2024-03-15');
const range = {
  start: new Date('2024-03-01'),
  end: new Date('2024-03-31'),
};
isWithinRange(date, range); // true
```

### Date Math

```typescript
// Add days
addDays(new Date('2024-03-15'), 5);
// Returns: Date for 2024-03-20

addDays(new Date('2024-03-15'), -5);
// Returns: Date for 2024-03-10

// Add months
addMonths(new Date('2024-03-15'), 2);
// Returns: Date for 2024-05-15

// Add years
addYears(new Date('2024-03-15'), 1);
// Returns: Date for 2025-03-15

// Calculate difference in days
const d1 = new Date('2024-03-15');
const d2 = new Date('2024-03-20');
diffInDays(d1, d2); // 5

// Calculate difference in hours
const t1 = new Date('2024-03-15T10:00:00');
const t2 = new Date('2024-03-15T15:30:00');
diffInHours(t1, t2); // 5.5
```

### Boundary Helpers

```typescript
// Start of day (midnight)
startOfDay(new Date('2024-03-15T14:30:00'));
// Returns: Date for 2024-03-15T00:00:00.000

// End of day (23:59:59.999)
endOfDay(new Date('2024-03-15T14:30:00'));
// Returns: Date for 2024-03-15T23:59:59.999

// Start of month
startOfMonth(new Date('2024-03-15'));
// Returns: Date for 2024-03-01T00:00:00.000

// End of month
endOfMonth(new Date('2024-03-15'));
// Returns: Date for 2024-03-31T23:59:59.999
```

## API Reference

### Formatting Functions

#### `formatDateISO(date: Date | string | number): string`

Format a date to ISO string (YYYY-MM-DD).

**Throws**: Error if date is invalid

---

#### `formatDate(date: Date | string | number, options?: DateFormatOptions): string`

Format a date to a localized string.

**Options**:
```typescript
interface DateFormatOptions {
  includeTime?: boolean;      // Default: false
  use12Hour?: boolean;         // Default: true
  includeSeconds?: boolean;    // Default: false
  locale?: string;             // Default: 'en-US'
}
```

**Throws**: Error if date is invalid

---

#### `formatDateLong(date: Date | string | number, locale?: string): string`

Format a date for display (e.g., "March 15, 2024").

**Throws**: Error if date is invalid

---

#### `formatDateMedium(date: Date | string | number, locale?: string): string`

Format a date for display (e.g., "Mar 15, 2024").

**Throws**: Error if date is invalid

---

#### `formatDateShort(date: Date | string | number, locale?: string): string`

Format a date for display (e.g., "3/15/24").

**Throws**: Error if date is invalid

---

#### `formatTime(date: Date | string | number, use12Hour?: boolean, includeSeconds?: boolean, locale?: string): string`

Format time only.

**Parameters**:
- `use12Hour`: Default `true`
- `includeSeconds`: Default `false`
- `locale`: Default `'en-US'`

**Throws**: Error if date is invalid

---

#### `timeAgo(date: Date | string | number, options?: RelativeTimeOptions): string`

Get relative time string (e.g., "2 hours ago", "in 3 days").

**Options**:
```typescript
interface RelativeTimeOptions {
  includeSuffix?: boolean;  // Default: true
  maxUnit?: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'; // Default: 'year'
  short?: boolean;          // Default: false
}
```

**Throws**: Error if date is invalid

### Validation Functions

#### `isValidDate(date: unknown): date is Date`

Type guard to check if a value is a valid date. Returns `true` if the value can be converted to a valid Date.

---

#### `isToday(date: Date | string | number): boolean`

Check if a date is today. Returns `false` for invalid dates.

---

#### `isYesterday(date: Date | string | number): boolean`

Check if a date is yesterday. Returns `false` for invalid dates.

---

#### `isTomorrow(date: Date | string | number): boolean`

Check if a date is tomorrow. Returns `false` for invalid dates.

---

#### `isPast(date: Date | string | number): boolean`

Check if a date is in the past. Returns `false` for invalid dates.

---

#### `isFuture(date: Date | string | number): boolean`

Check if a date is in the future. Returns `false` for invalid dates.

---

#### `isSameDay(date1: Date | string | number, date2: Date | string | number): boolean`

Check if two dates are the same day (ignores time). Returns `false` if either date is invalid.

---

#### `isWithinRange(date: Date | string | number, range: DateRange): boolean`

Check if a date is within a range (inclusive).

```typescript
interface DateRange {
  start: Date;
  end: Date;
}
```

Returns `false` if date or range is invalid.

### Math Functions

#### `addDays(date: Date | string | number, days: number): Date`

Add days to a date (can be negative).

**Returns**: New Date object (does not mutate original)

**Throws**: Error if date is invalid

---

#### `addMonths(date: Date | string | number, months: number): Date`

Add months to a date (can be negative).

**Returns**: New Date object (does not mutate original)

**Throws**: Error if date is invalid

---

#### `addYears(date: Date | string | number, years: number): Date`

Add years to a date (can be negative).

**Returns**: New Date object (does not mutate original)

**Throws**: Error if date is invalid

---

#### `diffInDays(date1: Date | string | number, date2: Date | string | number): number`

Get the difference between two dates in days.

**Returns**: Number of days (can be negative)

**Throws**: Error if either date is invalid

---

#### `diffInHours(date1: Date | string | number, date2: Date | string | number): number`

Get the difference between two dates in hours.

**Returns**: Number of hours (can be negative, can be fractional)

**Throws**: Error if either date is invalid

### Boundary Functions

#### `startOfDay(date: Date | string | number): Date`

Get the start of day (midnight) for a date.

**Returns**: New Date object set to 00:00:00.000

**Throws**: Error if date is invalid

---

#### `endOfDay(date: Date | string | number): Date`

Get the end of day (23:59:59.999) for a date.

**Returns**: New Date object set to 23:59:59.999

**Throws**: Error if date is invalid

---

#### `startOfMonth(date: Date | string | number): Date`

Get the start of month for a date.

**Returns**: New Date object set to first day of month at midnight

**Throws**: Error if date is invalid

---

#### `endOfMonth(date: Date | string | number): Date`

Get the end of month for a date.

**Returns**: New Date object set to last day of month at 23:59:59.999

**Throws**: Error if date is invalid

## Common Patterns

### Display User-Friendly Dates

```typescript
function displayDate(date: Date): string {
  if (isToday(date)) {
    return `Today at ${formatTime(date)}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${formatTime(date)}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow at ${formatTime(date)}`;
  }

  // Within the last week - use relative time
  const daysAgo = diffInDays(date, new Date());
  if (Math.abs(daysAgo) <= 7) {
    return timeAgo(date);
  }

  // Older - use full date
  return formatDateLong(date);
}
```

### Validate Date Range Input

```typescript
function validateDateRange(start: unknown, end: unknown): boolean {
  if (!isValidDate(start) || !isValidDate(end)) {
    return false;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // End must be after start
  return endDate.getTime() >= startDate.getTime();
}
```

### Calculate Age

```typescript
function calculateAge(birthDate: Date): number {
  const today = new Date();
  const years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return years - 1;
  }

  return years;
}
```

### Format Date for API

```typescript
function formatForAPI(date: Date): string {
  // APIs often expect ISO format
  return formatDateISO(date);
}

function parseFromAPI(dateString: string): Date | null {
  if (!isValidDate(dateString)) {
    return null;
  }
  return new Date(dateString);
}
```

### Activity Timeline

```typescript
interface Activity {
  timestamp: Date;
  description: string;
}

function formatActivity(activity: Activity): string {
  const time = timeAgo(activity.timestamp);
  return `${activity.description} - ${time}`;
}

// Example
const activity: Activity = {
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  description: 'User logged in',
};
formatActivity(activity);
// Returns: "User logged in - 2 hours ago"
```

### Date Range Queries

```typescript
function getThisMonth(): DateRange {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

function getLastWeek(): DateRange {
  const now = new Date();
  return {
    start: addDays(startOfDay(now), -7),
    end: endOfDay(now),
  };
}

function filterByDateRange<T extends { date: Date }>(
  items: T[],
  range: DateRange
): T[] {
  return items.filter(item => isWithinRange(item.date, range));
}
```

### Reminder System

```typescript
function checkReminder(reminderDate: Date): string {
  if (isPast(reminderDate)) {
    return `Overdue by ${timeAgo(reminderDate, { includeSuffix: false })}`;
  }

  if (isToday(reminderDate)) {
    return `Due today at ${formatTime(reminderDate)}`;
  }

  if (isTomorrow(reminderDate)) {
    return `Due tomorrow at ${formatTime(reminderDate)}`;
  }

  return `Due ${timeAgo(reminderDate)}`;
}
```

## Best Practices

### 1. Always Validate User Input

```typescript
// Good
function processUserDate(input: string) {
  if (!isValidDate(input)) {
    throw new Error('Invalid date provided');
  }
  return formatDateLong(input);
}

// Bad - no validation
function processUserDate(input: string) {
  return formatDateLong(input); // May throw unexpected error
}
```

### 2. Use Type Guards

```typescript
// Good - TypeScript knows the type after validation
function handleDate(input: unknown) {
  if (isValidDate(input)) {
    const date = new Date(input);
    // TypeScript knows input is valid
  }
}
```

### 3. Handle Timezones Appropriately

```typescript
// For display, use local time
formatDate(new Date());

// For storage/API, use ISO format
const isoDate = formatDateISO(new Date());
```

### 4. Choose the Right Format

```typescript
// For logs/debugging
formatDateISO(date); // "2024-03-15" - sortable, unambiguous

// For user display
formatDateLong(date); // "March 15, 2024" - readable

// For compact display
formatDateShort(date); // "3/15/24" - saves space
```

### 5. Use Relative Time for Recent Dates

```typescript
// Good for activity feeds
if (diffInDays(date, new Date()) <= 7) {
  return timeAgo(date); // "2 hours ago"
} else {
  return formatDateMedium(date); // "Mar 15, 2024"
}
```

### 6. Leverage Immutability

```typescript
// All functions return new Date objects
const original = new Date('2024-03-15');
const modified = addDays(original, 5);

console.log(original); // Still 2024-03-15
console.log(modified); // 2024-03-20
```

## Testing

Comprehensive unit tests with 112 test cases:

```bash
npm test src/app/shared/utilities/date/date.utils.spec.ts
```

### Test Coverage

- ✅ ISO formatting (5 tests)
- ✅ Flexible date formatting (5 tests)
- ✅ Named formats - long, medium, short (6 tests)
- ✅ Time formatting (4 tests)
- ✅ Relative time with all options (13 tests)
- ✅ Date validation (6 tests)
- ✅ Today/yesterday/tomorrow checks (9 tests)
- ✅ Past/future checks (6 tests)
- ✅ Same day comparison (4 tests)
- ✅ Range validation (7 tests)
- ✅ Add days/months/years (12 tests)
- ✅ Difference calculations (8 tests)
- ✅ Boundary helpers (16 tests)
- ✅ Edge cases (11 tests)

### Testing in Your Code

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, isValidDate } from '@shared/utilities/date/date.utils';

describe('MyComponent', () => {
  it('should format date correctly', () => {
    const date = new Date(2024, 2, 15); // March 15, 2024
    expect(formatDate(date)).toContain('3/15/2024');
  });

  it('should validate dates', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate('invalid')).toBe(false);
  });
});
```

## Architecture

```
utilities/
└── date/
    ├── date.utils.ts       # Main utility functions (900+ lines)
    ├── date.utils.spec.ts  # Unit tests (112 tests, 700+ lines)
    └── README.md           # This file
```

## Performance

- **Zero Dependencies**: Pure TypeScript, no external libraries
- **Efficient**: All operations use native Date methods
- **Immutable**: Never mutates input dates
- **Tree-shakeable**: Import only what you need
- **Type-safe**: Full TypeScript type checking

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Uses standard JavaScript `Date` API and `Intl.DateTimeFormat` which are widely supported.

## Troubleshooting

### Timezone Issues

If you're seeing dates off by one day:

```typescript
// Avoid using date-only strings which may be interpreted as UTC
const bad = new Date('2024-03-15'); // May be off by timezone

// Use explicit constructors instead
const good = new Date(2024, 2, 15); // Month is 0-indexed
```

### Locale Formatting

To use a different locale:

```typescript
formatDate(date, { locale: 'de-DE' }); // German
formatDate(date, { locale: 'ja-JP' }); // Japanese
formatDate(date, { locale: 'fr-FR' }); // French
```

### Invalid Date Handling

All formatting functions throw errors for invalid dates. Use validation first:

```typescript
// Safe approach
if (isValidDate(userInput)) {
  return formatDate(userInput);
} else {
  return 'Invalid date';
}
```

## Migration from date-fns or moment

If you're migrating from other date libraries:

```typescript
// date-fns → our utils
import { format } from 'date-fns';
// Replace with:
import { formatDate } from '@shared/utilities/date/date.utils';

// moment → our utils
moment(date).format('YYYY-MM-DD');
// Replace with:
formatDateISO(date);

moment(date).fromNow();
// Replace with:
timeAgo(date);
```

## License

Part of the MoodyJW Portfolio project.
