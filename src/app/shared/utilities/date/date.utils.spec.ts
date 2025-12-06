import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import * as DateUtils from './date.utils';

describe('Date Utils', () => {
  beforeEach(() => {
    // Set system time to a known date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateISO', () => {
    it('should format date to ISO string (YYYY-MM-DD)', () => {
      const date = new Date(2024, 2, 15, 14, 30, 0); // March 15, 2024
      expect(DateUtils.formatDateISO(date)).toBe('2024-03-15');
    });

    it('should handle string input', () => {
      const result = DateUtils.formatDateISO('2024-03-15T12:00:00');
      expect(result).toMatch(/2024-03-1[45]/); // Can be 14 or 15 depending on timezone
    });

    it('should handle number input', () => {
      const timestamp = new Date(2024, 2, 15).getTime();
      expect(DateUtils.formatDateISO(timestamp)).toBe('2024-03-15');
    });

    it('should pad single-digit months and days', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024
      expect(DateUtils.formatDateISO(date)).toBe('2024-01-05');
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.formatDateISO('invalid')).toThrow(
        'Invalid date provided to formatDateISO'
      );
    });
  });

  describe('formatDate', () => {
    it('should format date without time by default', () => {
      const date = new Date(2024, 2, 15, 14, 30, 0);
      const result = DateUtils.formatDate(date);
      expect(result).toContain('3/15/2024');
    });

    it('should include time when requested', () => {
      const date = new Date(2024, 2, 15, 14, 30, 0);
      const result = DateUtils.formatDate(date, { includeTime: true });
      expect(result).toContain('2:30 PM');
    });

    it('should use 24-hour format when requested', () => {
      const date = new Date(2024, 2, 15, 14, 30, 0);
      const result = DateUtils.formatDate(date, {
        includeTime: true,
        use12Hour: false,
      });
      expect(result).toContain('14:30');
    });

    it('should include seconds when requested', () => {
      const date = new Date(2024, 2, 15, 14, 30, 45);
      const result = DateUtils.formatDate(date, {
        includeTime: true,
        includeSeconds: true,
      });
      expect(result).toContain('45');
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.formatDate('invalid')).toThrow(
        'Invalid date provided to formatDate'
      );
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      expect(DateUtils.formatDateLong(date)).toBe('March 15, 2024');
    });

    it('should handle string input', () => {
      const result = DateUtils.formatDateLong('2024-03-15T12:00:00');
      expect(result).toMatch(/March 1[45], 2024/); // Can be 14 or 15 depending on timezone
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.formatDateLong('invalid')).toThrow(
        'Invalid date provided to formatDateLong'
      );
    });
  });

  describe('formatDateMedium', () => {
    it('should format date in medium format', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      expect(DateUtils.formatDateMedium(date)).toBe('Mar 15, 2024');
    });

    it('should handle string input', () => {
      const result = DateUtils.formatDateMedium('2024-03-15T12:00:00');
      expect(result).toMatch(/Mar 1[45], 2024/); // Can be 14 or 15 depending on timezone
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.formatDateMedium('invalid')).toThrow(
        'Invalid date provided to formatDateMedium'
      );
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short format', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      const result = DateUtils.formatDateShort(date);
      expect(result).toContain('3/15/24');
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.formatDateShort('invalid')).toThrow(
        'Invalid date provided to formatDateShort'
      );
    });
  });

  describe('formatTime', () => {
    it('should format time in 12-hour format by default', () => {
      const date = new Date(2024, 2, 15, 14, 30, 0);
      expect(DateUtils.formatTime(date)).toContain('2:30 PM');
    });

    it('should format time in 24-hour format when requested', () => {
      const date = new Date(2024, 2, 15, 14, 30, 0);
      expect(DateUtils.formatTime(date, false)).toContain('14:30');
    });

    it('should include seconds when requested', () => {
      const date = new Date(2024, 2, 15, 14, 30, 45);
      const result = DateUtils.formatTime(date, true, true);
      expect(result).toContain('45');
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.formatTime('invalid')).toThrow(
        'Invalid date provided to formatTime'
      );
    });
  });

  describe('timeAgo', () => {
    it('should return "X seconds ago" for recent dates', () => {
      const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      expect(DateUtils.timeAgo(date)).toBe('30 seconds ago');
    });

    it('should return "X minutes ago" for dates within an hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(DateUtils.timeAgo(date)).toBe('5 minutes ago');
    });

    it('should return "X hours ago" for dates within a day', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
      expect(DateUtils.timeAgo(date)).toBe('3 hours ago');
    });

    it('should return "X days ago" for dates within a week', () => {
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      expect(DateUtils.timeAgo(date)).toBe('5 days ago');
    });

    it('should return "X weeks ago" for dates within a month', () => {
      const date = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
      expect(DateUtils.timeAgo(date)).toBe('2 weeks ago');
    });

    it('should return "X months ago" for dates within a year', () => {
      const date = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000); // ~3 months ago
      expect(DateUtils.timeAgo(date)).toBe('3 months ago');
    });

    it('should return "X years ago" for old dates', () => {
      const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000); // 2 years ago
      expect(DateUtils.timeAgo(date)).toBe('2 years ago');
    });

    it('should handle future dates with "in X"', () => {
      const date = new Date(Date.now() + 5 * 60 * 1000); // in 5 minutes
      expect(DateUtils.timeAgo(date)).toBe('in 5 minutes');
    });

    it('should handle singular units', () => {
      const date = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
      expect(DateUtils.timeAgo(date)).toBe('1 minute ago');
    });

    it('should support short format', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(DateUtils.timeAgo(date, { short: true })).toBe('2h ago');
    });

    it('should support removing suffix', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes
      expect(DateUtils.timeAgo(date, { includeSuffix: false })).toBe(
        '5 minutes'
      );
    });

    it('should respect maxUnit option', () => {
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      expect(DateUtils.timeAgo(date, { maxUnit: 'hour' })).toBe('120 hours ago');
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.timeAgo('invalid')).toThrow(
        'Invalid date provided to timeAgo'
      );
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid Date object', () => {
      expect(DateUtils.isValidDate(new Date())).toBe(true);
    });

    it('should return false for invalid Date object', () => {
      expect(DateUtils.isValidDate(new Date('invalid'))).toBe(false);
    });

    it('should return true for valid date string', () => {
      expect(DateUtils.isValidDate('2024-03-15')).toBe(true);
    });

    it('should return false for invalid date string', () => {
      expect(DateUtils.isValidDate('not a date')).toBe(false);
    });

    it('should return true for valid timestamp', () => {
      expect(DateUtils.isValidDate(Date.now())).toBe(true);
    });

    it('should return false for non-date values', () => {
      expect(DateUtils.isValidDate(null)).toBe(false);
      expect(DateUtils.isValidDate(undefined)).toBe(false);
      expect(DateUtils.isValidDate({})).toBe(false);
      expect(DateUtils.isValidDate([])).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for current date', () => {
      const now = new Date();
      expect(DateUtils.isToday(now)).toBe(true);
    });

    it('should return true for different time on same day', () => {
      const morning = new Date('2024-03-15T08:00:00');
      const evening = new Date('2024-03-15T20:00:00');
      vi.setSystemTime(morning);
      expect(DateUtils.isToday(evening)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(DateUtils.isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(DateUtils.isToday(tomorrow)).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(DateUtils.isToday('invalid')).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      const yesterday = new Date('2024-03-14T12:00:00'); // One day before system time
      expect(DateUtils.isYesterday(yesterday)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(DateUtils.isYesterday(today)).toBe(false);
    });

    it('should return false for two days ago', () => {
      const twoDaysAgo = new Date('2024-03-13T12:00:00');
      expect(DateUtils.isYesterday(twoDaysAgo)).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(DateUtils.isYesterday('invalid')).toBe(false);
    });
  });

  describe('isTomorrow', () => {
    it('should return true for tomorrow', () => {
      const tomorrow = new Date('2024-03-16T12:00:00'); // One day after system time
      expect(DateUtils.isTomorrow(tomorrow)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(DateUtils.isTomorrow(today)).toBe(false);
    });

    it('should return false for two days from now', () => {
      const twoDaysLater = new Date('2024-03-17T12:00:00');
      expect(DateUtils.isTomorrow(twoDaysLater)).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(DateUtils.isTomorrow('invalid')).toBe(false);
    });
  });

  describe('isPast', () => {
    it('should return true for past dates', () => {
      const past = new Date('2020-01-01');
      expect(DateUtils.isPast(past)).toBe(true);
    });

    it('should return false for future dates', () => {
      const future = new Date('2030-01-01');
      expect(DateUtils.isPast(future)).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(DateUtils.isPast('invalid')).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for future dates', () => {
      const future = new Date('2030-01-01');
      expect(DateUtils.isFuture(future)).toBe(true);
    });

    it('should return false for past dates', () => {
      const past = new Date('2020-01-01');
      expect(DateUtils.isFuture(past)).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(DateUtils.isFuture('invalid')).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day at different times', () => {
      const d1 = new Date('2024-03-15T08:00:00');
      const d2 = new Date('2024-03-15T20:00:00');
      expect(DateUtils.isSameDay(d1, d2)).toBe(true);
    });

    it('should return false for different days', () => {
      const d1 = new Date('2024-03-15');
      const d2 = new Date('2024-03-16');
      expect(DateUtils.isSameDay(d1, d2)).toBe(false);
    });

    it('should handle string inputs', () => {
      expect(DateUtils.isSameDay('2024-03-15', '2024-03-15')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(DateUtils.isSameDay('invalid', '2024-03-15')).toBe(false);
      expect(DateUtils.isSameDay('2024-03-15', 'invalid')).toBe(false);
    });
  });

  describe('isWithinRange', () => {
    it('should return true for date within range', () => {
      const date = new Date('2024-03-15');
      const range = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange(date, range)).toBe(true);
    });

    it('should return true for date at start of range', () => {
      const date = new Date('2024-03-01');
      const range = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange(date, range)).toBe(true);
    });

    it('should return true for date at end of range', () => {
      const date = new Date('2024-03-31');
      const range = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange(date, range)).toBe(true);
    });

    it('should return false for date before range', () => {
      const date = new Date('2024-02-28');
      const range = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange(date, range)).toBe(false);
    });

    it('should return false for date after range', () => {
      const date = new Date('2024-04-01');
      const range = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange(date, range)).toBe(false);
    });

    it('should return false for invalid date', () => {
      const range = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange('invalid', range)).toBe(false);
    });

    it('should return false for invalid range', () => {
      const date = new Date('2024-03-15');
      const range = {
        start: new Date('invalid'),
        end: new Date('2024-03-31'),
      };
      expect(DateUtils.isWithinRange(date, range)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add positive days', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      const result = DateUtils.addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should subtract negative days', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      const result = DateUtils.addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });

    it('should handle month boundaries', () => {
      const date = new Date(2024, 2, 30); // March 30, 2024
      const result = DateUtils.addDays(date, 5);
      expect(result.getMonth()).toBe(3); // April (0-indexed)
      expect(result.getDate()).toBe(4);
    });

    it('should not mutate original date', () => {
      const date = new Date(2024, 2, 15);
      const original = date.getDate();
      DateUtils.addDays(date, 5);
      expect(date.getDate()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.addDays('invalid', 5)).toThrow(
        'Invalid date provided to addDays'
      );
    });
  });

  describe('addMonths', () => {
    it('should add positive months', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.addMonths(date, 2);
      expect(result.getMonth()).toBe(4); // May (0-indexed)
    });

    it('should subtract negative months', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.addMonths(date, -2);
      expect(result.getMonth()).toBe(0); // January (0-indexed)
    });

    it('should handle year boundaries', () => {
      const date = new Date('2024-11-15');
      const result = DateUtils.addMonths(date, 3);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February (0-indexed)
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-03-15');
      const original = date.getMonth();
      DateUtils.addMonths(date, 2);
      expect(date.getMonth()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.addMonths('invalid', 2)).toThrow(
        'Invalid date provided to addMonths'
      );
    });
  });

  describe('addYears', () => {
    it('should add positive years', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.addYears(date, 2);
      expect(result.getFullYear()).toBe(2026);
    });

    it('should subtract negative years', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.addYears(date, -2);
      expect(result.getFullYear()).toBe(2022);
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-03-15');
      const original = date.getFullYear();
      DateUtils.addYears(date, 2);
      expect(date.getFullYear()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.addYears('invalid', 2)).toThrow(
        'Invalid date provided to addYears'
      );
    });
  });

  describe('diffInDays', () => {
    it('should calculate positive difference', () => {
      const d1 = new Date('2024-03-15');
      const d2 = new Date('2024-03-20');
      expect(DateUtils.diffInDays(d1, d2)).toBe(5);
    });

    it('should calculate negative difference', () => {
      const d1 = new Date('2024-03-20');
      const d2 = new Date('2024-03-15');
      expect(DateUtils.diffInDays(d1, d2)).toBe(-5);
    });

    it('should handle same dates', () => {
      const d1 = new Date('2024-03-15');
      const d2 = new Date('2024-03-15');
      expect(DateUtils.diffInDays(d1, d2)).toBe(0);
    });

    it('should handle month boundaries', () => {
      const d1 = new Date('2024-02-28');
      const d2 = new Date('2024-03-05');
      expect(DateUtils.diffInDays(d1, d2)).toBe(6);
    });

    it('should throw error for invalid dates', () => {
      expect(() =>
        DateUtils.diffInDays('invalid', '2024-03-15')
      ).toThrow('Invalid date(s) provided to diffInDays');
    });
  });

  describe('diffInHours', () => {
    it('should calculate positive difference', () => {
      const d1 = new Date('2024-03-15T10:00:00');
      const d2 = new Date('2024-03-15T15:30:00');
      expect(DateUtils.diffInHours(d1, d2)).toBe(5.5);
    });

    it('should calculate negative difference', () => {
      const d1 = new Date('2024-03-15T15:30:00');
      const d2 = new Date('2024-03-15T10:00:00');
      expect(DateUtils.diffInHours(d1, d2)).toBe(-5.5);
    });

    it('should handle same dates', () => {
      const d1 = new Date('2024-03-15T10:00:00');
      const d2 = new Date('2024-03-15T10:00:00');
      expect(DateUtils.diffInHours(d1, d2)).toBe(0);
    });

    it('should throw error for invalid dates', () => {
      expect(() =>
        DateUtils.diffInHours('invalid', '2024-03-15')
      ).toThrow('Invalid date(s) provided to diffInHours');
    });
  });

  describe('startOfDay', () => {
    it('should set time to midnight', () => {
      const date = new Date('2024-03-15T14:30:45.123');
      const result = DateUtils.startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should preserve date', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = DateUtils.startOfDay(date);
      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
      expect(result.getFullYear()).toBe(2024);
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-03-15T14:30:00');
      const original = date.getHours();
      DateUtils.startOfDay(date);
      expect(date.getHours()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.startOfDay('invalid')).toThrow(
        'Invalid date provided to startOfDay'
      );
    });
  });

  describe('endOfDay', () => {
    it('should set time to end of day', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = DateUtils.endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('should preserve date', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = DateUtils.endOfDay(date);
      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
      expect(result.getFullYear()).toBe(2024);
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-03-15T14:30:00');
      const original = date.getHours();
      DateUtils.endOfDay(date);
      expect(date.getHours()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.endOfDay('invalid')).toThrow(
        'Invalid date provided to endOfDay'
      );
    });
  });

  describe('startOfMonth', () => {
    it('should set to first day of month at midnight', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = DateUtils.startOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should preserve month and year', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.startOfMonth(date);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
      expect(result.getFullYear()).toBe(2024);
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-03-15');
      const original = date.getDate();
      DateUtils.startOfMonth(date);
      expect(date.getDate()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.startOfMonth('invalid')).toThrow(
        'Invalid date provided to startOfMonth'
      );
    });
  });

  describe('endOfMonth', () => {
    it('should set to last day of month at end of day', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.endOfMonth(date);
      expect(result.getDate()).toBe(31); // March has 31 days
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('should handle February in leap year', () => {
      const date = new Date('2024-02-15');
      const result = DateUtils.endOfMonth(date);
      expect(result.getDate()).toBe(29); // 2024 is leap year
    });

    it('should handle February in non-leap year', () => {
      const date = new Date('2023-02-15');
      const result = DateUtils.endOfMonth(date);
      expect(result.getDate()).toBe(28);
    });

    it('should preserve month and year', () => {
      const date = new Date('2024-03-15');
      const result = DateUtils.endOfMonth(date);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
      expect(result.getFullYear()).toBe(2024);
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-03-15');
      const original = date.getDate();
      DateUtils.endOfMonth(date);
      expect(date.getDate()).toBe(original);
    });

    it('should throw error for invalid date', () => {
      expect(() => DateUtils.endOfMonth('invalid')).toThrow(
        'Invalid date provided to endOfMonth'
      );
    });
  });
});
