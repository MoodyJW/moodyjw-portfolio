/**
 * Date utility functions for formatting, manipulation, and validation
 *
 * @module DateUtils
 */

/**
 * Date format options
 */
export interface DateFormatOptions {
  /** Whether to include time (default: false) */
  includeTime?: boolean;
  /** Whether to use 12-hour format (default: false for 24-hour) */
  use12Hour?: boolean;
  /** Whether to include seconds (default: false) */
  includeSeconds?: boolean;
  /** Locale for formatting (default: 'en-US') */
  locale?: string;
}

/**
 * Relative time options
 */
export interface RelativeTimeOptions {
  /** Whether to include "ago" suffix (default: true) */
  includeSuffix?: boolean;
  /** Maximum unit to use (default: 'year') */
  maxUnit?: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  /** Whether to use short format (default: false) */
  short?: boolean;
}

/**
 * Date range interface
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Format a date to ISO string (YYYY-MM-DD)
 *
 * @param date - Date to format
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDateISO(new Date('2024-03-15'));
 * // Returns: '2024-03-15'
 * ```
 */
export function formatDateISO(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDateISO');
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format a date to a localized string
 *
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-03-15T14:30:00'));
 * // Returns: '3/15/2024'
 *
 * formatDate(new Date('2024-03-15T14:30:00'), { includeTime: true });
 * // Returns: '3/15/2024, 2:30 PM'
 *
 * formatDate(new Date('2024-03-15T14:30:00'), { includeTime: true, use12Hour: false });
 * // Returns: '3/15/2024, 14:30'
 * ```
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }

  const {
    includeTime = false,
    use12Hour = true,
    includeSeconds = false,
    locale = 'en-US',
  } = options;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  if (includeTime) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = 'numeric';
    dateOptions.hour12 = use12Hour;

    if (includeSeconds) {
      dateOptions.second = 'numeric';
    }
  }

  return d.toLocaleString(locale, dateOptions);
}

/**
 * Format a date for display (e.g., "March 15, 2024")
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDateLong(new Date('2024-03-15'));
 * // Returns: 'March 15, 2024'
 * ```
 */
export function formatDateLong(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDateLong');
  }

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date for display (e.g., "Mar 15, 2024")
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDateMedium(new Date('2024-03-15'));
 * // Returns: 'Mar 15, 2024'
 * ```
 */
export function formatDateMedium(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDateMedium');
  }

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date for display (e.g., "3/15/24")
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDateShort(new Date('2024-03-15'));
 * // Returns: '3/15/24'
 * ```
 */
export function formatDateShort(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDateShort');
  }

  return d.toLocaleDateString(locale, {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * Format time only (e.g., "2:30 PM" or "14:30")
 *
 * @param date - Date to format
 * @param use12Hour - Whether to use 12-hour format (default: true)
 * @param includeSeconds - Whether to include seconds (default: false)
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatTime(new Date('2024-03-15T14:30:00'));
 * // Returns: '2:30 PM'
 *
 * formatTime(new Date('2024-03-15T14:30:00'), false);
 * // Returns: '14:30'
 * ```
 */
export function formatTime(
  date: Date | string | number,
  use12Hour = true,
  includeSeconds = false,
  locale = 'en-US'
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatTime');
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: use12Hour,
  };

  if (includeSeconds) {
    options.second = 'numeric';
  }

  return d.toLocaleTimeString(locale, options);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to compare
 * @param options - Relative time options
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
 * timeAgo(twoHoursAgo);
 * // Returns: '2 hours ago'
 *
 * const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
 * timeAgo(inThreeDays);
 * // Returns: 'in 3 days'
 *
 * timeAgo(twoHoursAgo, { short: true });
 * // Returns: '2h ago'
 * ```
 */
export function timeAgo(
  date: Date | string | number,
  options: RelativeTimeOptions = {}
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to timeAgo');
  }

  const { includeSuffix = true, maxUnit = 'year', short = false } = options;

  const now = Date.now();
  const past = d.getTime();
  const diffMs = now - past;
  const isFuture = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value: number;
  let unit: string;

  // Determine appropriate unit
  if (years > 0 && maxUnit === 'year') {
    value = years;
    unit = short ? 'y' : years === 1 ? 'year' : 'years';
  } else if (months > 0 && ['year', 'month'].includes(maxUnit)) {
    value = months;
    unit = short ? 'mo' : months === 1 ? 'month' : 'months';
  } else if (weeks > 0 && ['year', 'month', 'week'].includes(maxUnit)) {
    value = weeks;
    unit = short ? 'w' : weeks === 1 ? 'week' : 'weeks';
  } else if (days > 0 && ['year', 'month', 'week', 'day'].includes(maxUnit)) {
    value = days;
    unit = short ? 'd' : days === 1 ? 'day' : 'days';
  } else if (
    hours > 0 &&
    ['year', 'month', 'week', 'day', 'hour'].includes(maxUnit)
  ) {
    value = hours;
    unit = short ? 'h' : hours === 1 ? 'hour' : 'hours';
  } else if (
    minutes > 0 &&
    ['year', 'month', 'week', 'day', 'hour', 'minute'].includes(maxUnit)
  ) {
    value = minutes;
    unit = short ? 'm' : minutes === 1 ? 'minute' : 'minutes';
  } else {
    value = seconds;
    unit = short ? 's' : seconds === 1 ? 'second' : 'seconds';
  }

  // Build result string
  const timeStr = short ? `${value}${unit}` : `${value} ${unit}`;

  if (!includeSuffix) {
    return timeStr;
  }

  if (isFuture) {
    return short ? `in ${timeStr}` : `in ${timeStr}`;
  }

  return short ? `${timeStr} ago` : `${timeStr} ago`;
}

/**
 * Check if a date is valid
 *
 * @param date - Date to validate
 * @returns True if date is valid
 *
 * @example
 * ```typescript
 * isValidDate(new Date());
 * // Returns: true
 *
 * isValidDate('invalid');
 * // Returns: false
 *
 * isValidDate(new Date('2024-03-15'));
 * // Returns: true
 * ```
 */
export function isValidDate(date: unknown): date is Date {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  if (typeof date === 'string' || typeof date === 'number') {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }

  return false;
}

/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns True if date is today
 *
 * @example
 * ```typescript
 * isToday(new Date());
 * // Returns: true
 *
 * isToday(new Date('2024-03-15'));
 * // Returns: false (unless today is March 15, 2024)
 * ```
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is yesterday
 *
 * @param date - Date to check
 * @returns True if date is yesterday
 *
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * isYesterday(yesterday);
 * // Returns: true
 * ```
 */
export function isYesterday(date: Date | string | number): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if a date is tomorrow
 *
 * @param date - Date to check
 * @returns True if date is tomorrow
 *
 * @example
 * ```typescript
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * isTomorrow(tomorrow);
 * // Returns: true
 * ```
 */
export function isTomorrow(date: Date | string | number): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Check if a date is in the past
 *
 * @param date - Date to check
 * @returns True if date is in the past
 *
 * @example
 * ```typescript
 * isPast(new Date('2020-01-01'));
 * // Returns: true
 * ```
 */
export function isPast(date: Date | string | number): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  return d.getTime() < Date.now();
}

/**
 * Check if a date is in the future
 *
 * @param date - Date to check
 * @returns True if date is in the future
 *
 * @example
 * ```typescript
 * isFuture(new Date('2030-01-01'));
 * // Returns: true
 * ```
 */
export function isFuture(date: Date | string | number): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  return d.getTime() > Date.now();
}

/**
 * Check if two dates are the same day
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 *
 * @example
 * ```typescript
 * const d1 = new Date('2024-03-15T10:00:00');
 * const d2 = new Date('2024-03-15T18:00:00');
 * isSameDay(d1, d2);
 * // Returns: true
 * ```
 */
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return false;
  }

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

/**
 * Check if a date is within a range
 *
 * @param date - Date to check
 * @param range - Date range
 * @returns True if date is within range (inclusive)
 *
 * @example
 * ```typescript
 * const date = new Date('2024-03-15');
 * const range = {
 *   start: new Date('2024-03-01'),
 *   end: new Date('2024-03-31'),
 * };
 * isWithinRange(date, range);
 * // Returns: true
 * ```
 */
export function isWithinRange(
  date: Date | string | number,
  range: DateRange
): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  const start = new Date(range.start);
  const end = new Date(range.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

/**
 * Add days to a date
 *
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 *
 * @example
 * ```typescript
 * addDays(new Date('2024-03-15'), 5);
 * // Returns: Date representing 2024-03-20
 *
 * addDays(new Date('2024-03-15'), -5);
 * // Returns: Date representing 2024-03-10
 * ```
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to addDays');
  }

  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 *
 * @param date - Starting date
 * @param months - Number of months to add (can be negative)
 * @returns New date with months added
 *
 * @example
 * ```typescript
 * addMonths(new Date('2024-03-15'), 2);
 * // Returns: Date representing 2024-05-15
 * ```
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to addMonths');
  }

  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to a date
 *
 * @param date - Starting date
 * @param years - Number of years to add (can be negative)
 * @returns New date with years added
 *
 * @example
 * ```typescript
 * addYears(new Date('2024-03-15'), 1);
 * // Returns: Date representing 2025-03-15
 * ```
 */
export function addYears(date: Date | string | number, years: number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to addYears');
  }

  const result = new Date(d);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get the difference between two dates in days
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates (can be negative)
 *
 * @example
 * ```typescript
 * const d1 = new Date('2024-03-15');
 * const d2 = new Date('2024-03-20');
 * diffInDays(d1, d2);
 * // Returns: 5
 * ```
 */
export function diffInDays(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date(s) provided to diffInDays');
  }

  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get the difference between two dates in hours
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of hours between dates (can be negative)
 *
 * @example
 * ```typescript
 * const d1 = new Date('2024-03-15T10:00:00');
 * const d2 = new Date('2024-03-15T15:30:00');
 * diffInHours(d1, d2);
 * // Returns: 5.5
 * ```
 */
export function diffInHours(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date(s) provided to diffInHours');
  }

  const diffMs = d2.getTime() - d1.getTime();
  return diffMs / (1000 * 60 * 60);
}

/**
 * Get the start of day (midnight) for a date
 *
 * @param date - Date to process
 * @returns New date set to start of day
 *
 * @example
 * ```typescript
 * startOfDay(new Date('2024-03-15T14:30:00'));
 * // Returns: Date representing 2024-03-15T00:00:00
 * ```
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to startOfDay');
  }

  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of day (23:59:59.999) for a date
 *
 * @param date - Date to process
 * @returns New date set to end of day
 *
 * @example
 * ```typescript
 * endOfDay(new Date('2024-03-15T14:30:00'));
 * // Returns: Date representing 2024-03-15T23:59:59.999
 * ```
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to endOfDay');
  }

  const result = new Date(d);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get the start of month for a date
 *
 * @param date - Date to process
 * @returns New date set to start of month
 *
 * @example
 * ```typescript
 * startOfMonth(new Date('2024-03-15'));
 * // Returns: Date representing 2024-03-01T00:00:00
 * ```
 */
export function startOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to startOfMonth');
  }

  const result = new Date(d);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of month for a date
 *
 * @param date - Date to process
 * @returns New date set to end of month
 *
 * @example
 * ```typescript
 * endOfMonth(new Date('2024-03-15'));
 * // Returns: Date representing 2024-03-31T23:59:59.999
 * ```
 */
export function endOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to endOfMonth');
  }

  const result = new Date(d);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}
