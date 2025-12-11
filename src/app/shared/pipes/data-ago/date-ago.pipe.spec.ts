import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DateAgoPipe } from './date-ago.pipe';

describe('DateAgoPipe', () => {
  let pipe: DateAgoPipe;
  let now: Date;

  beforeEach(() => {
    pipe = new DateAgoPipe();
    // Fix current time for consistent testing
    now = new Date('2025-12-07T12:00:00Z');
    vi.setSystemTime(now);
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should transform date to relative time string', () => {
      const twoHoursAgo = new Date('2025-12-07T10:00:00Z');
      expect(pipe.transform(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should handle date strings', () => {
      const dateString = '2025-12-07T10:00:00Z';
      expect(pipe.transform(dateString)).toBe('2 hours ago');
    });

    it('should handle timestamps', () => {
      const timestamp = new Date('2025-12-07T10:00:00Z').getTime();
      expect(pipe.transform(timestamp)).toBe('2 hours ago');
    });
  });

  describe('Time Ranges', () => {
    it('should handle seconds', () => {
      const thirtySecondsAgo = new Date('2025-12-07T11:59:30Z');
      expect(pipe.transform(thirtySecondsAgo)).toBe('30 seconds ago');
    });

    it('should handle minutes', () => {
      const fiveMinutesAgo = new Date('2025-12-07T11:55:00Z');
      expect(pipe.transform(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should handle hours', () => {
      const threeHoursAgo = new Date('2025-12-07T09:00:00Z');
      expect(pipe.transform(threeHoursAgo)).toBe('3 hours ago');
    });

    it('should handle days', () => {
      const threeDaysAgo = new Date('2025-12-04T12:00:00Z');
      expect(pipe.transform(threeDaysAgo)).toBe('3 days ago');
    });

    it('should handle weeks', () => {
      const twoWeeksAgo = new Date('2025-11-23T12:00:00Z');
      expect(pipe.transform(twoWeeksAgo)).toBe('2 weeks ago');
    });

    it('should handle months', () => {
      const twoMonthsAgo = new Date('2025-10-07T12:00:00Z');
      expect(pipe.transform(twoMonthsAgo)).toBe('2 months ago');
    });

    it('should handle years', () => {
      const oneYearAgo = new Date('2024-12-07T12:00:00Z');
      expect(pipe.transform(oneYearAgo)).toBe('1 year ago');
    });
  });

  describe('Options', () => {
    it('should respect includeSuffix option', () => {
      const twoHoursAgo = new Date('2025-12-07T10:00:00Z');

      // With suffix (default true)
      expect(pipe.transform(twoHoursAgo)).toBe('2 hours ago');

      // Without suffix
      expect(pipe.transform(twoHoursAgo, { includeSuffix: false })).toBe('2 hours');
    });

    it('should respect short option', () => {
      const twoHoursAgo = new Date('2025-12-07T10:00:00Z');

      // Long format (default)
      expect(pipe.transform(twoHoursAgo)).toBe('2 hours ago');

      // Short format
      expect(pipe.transform(twoHoursAgo, { short: true })).toBe('2h ago');
    });

    it('should respect maxUnit option', () => {
      const oneMonthAgo = new Date('2025-11-07T12:00:00Z');

      // Default (shows months)
      expect(pipe.transform(oneMonthAgo)).toBe('1 month ago');

      // Limit to days
      expect(pipe.transform(oneMonthAgo, { maxUnit: 'day' })).toBe('30 days ago');
    });

    it('should handle combined options', () => {
      const twoHoursAgo = new Date('2025-12-07T10:00:00Z');
      const result = pipe.transform(twoHoursAgo, {
        short: true,
        includeSuffix: false,
      });
      expect(result).toBe('2h');
    });
  });

  describe('Future Dates', () => {
    it('should handle future dates', () => {
      const inTwoHours = new Date('2025-12-07T14:00:00Z');
      expect(pipe.transform(inTwoHours)).toBe('in 2 hours');
    });

    it('should handle future dates without suffix', () => {
      const inThreeDays = new Date('2025-12-10T12:00:00Z');
      expect(pipe.transform(inThreeDays, { includeSuffix: false })).toBe('3 days');
    });

    it('should handle future dates with short format', () => {
      const inOneHour = new Date('2025-12-07T13:00:00Z');
      expect(pipe.transform(inOneHour, { short: true })).toBe('in 1h');
    });
  });

  describe('Edge Cases', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      expect(pipe.transform('invalid-date')).toBe('');
    });

    it('should handle "now" (same time)', () => {
      const result = pipe.transform(now);
      expect(result).toBe('0 seconds ago');
    });

    it('should handle very old dates', () => {
      const tenYearsAgo = new Date('2015-12-07T12:00:00Z');
      expect(pipe.transform(tenYearsAgo)).toBe('10 years ago');
    });

    it('should handle very recent dates', () => {
      const fiveSecondsAgo = new Date('2025-12-07T11:59:55Z');
      expect(pipe.transform(fiveSecondsAgo)).toBe('5 seconds ago');
    });
  });

  describe('Singular vs Plural', () => {
    it('should use singular for 1 hour', () => {
      const oneHourAgo = new Date('2025-12-07T11:00:00Z');
      expect(pipe.transform(oneHourAgo)).toBe('1 hour ago');
    });

    it('should use plural for 2 hours', () => {
      const twoHoursAgo = new Date('2025-12-07T10:00:00Z');
      expect(pipe.transform(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should use singular for 1 day', () => {
      const oneDayAgo = new Date('2025-12-06T12:00:00Z');
      expect(pipe.transform(oneDayAgo)).toBe('1 day ago');
    });

    it('should use singular for 1 month', () => {
      const oneMonthAgo = new Date('2025-11-07T12:00:00Z');
      expect(pipe.transform(oneMonthAgo)).toBe('1 month ago');
    });

    it('should use singular for 1 year', () => {
      const oneYearAgo = new Date('2024-12-07T12:00:00Z');
      expect(pipe.transform(oneYearAgo)).toBe('1 year ago');
    });
  });

  describe('Pure Pipe Behavior', () => {
    it('should return same result for same input (pure pipe caching)', () => {
      const date = new Date('2025-12-07T10:00:00Z');
      const result1 = pipe.transform(date);
      const result2 = pipe.transform(date);

      expect(result1).toBe(result2);
      expect(result1).toBe('2 hours ago');
    });

    it('should handle different date formats consistently', () => {
      const dateObj = new Date('2025-12-07T10:00:00Z');
      const dateString = '2025-12-07T10:00:00Z';
      const timestamp = dateObj.getTime();

      const result1 = pipe.transform(dateObj);
      const result2 = pipe.transform(dateString);
      const result3 = pipe.transform(timestamp);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('Short Format', () => {
    it('should use short format for minutes', () => {
      const fiveMinutesAgo = new Date('2025-12-07T11:55:00Z');
      expect(pipe.transform(fiveMinutesAgo, { short: true })).toBe('5m ago');
    });

    it('should use short format for hours', () => {
      const threeHoursAgo = new Date('2025-12-07T09:00:00Z');
      expect(pipe.transform(threeHoursAgo, { short: true })).toBe('3h ago');
    });

    it('should use short format for days', () => {
      const twoDaysAgo = new Date('2025-12-05T12:00:00Z');
      expect(pipe.transform(twoDaysAgo, { short: true })).toBe('2d ago');
    });

    it('should use short format for weeks', () => {
      const twoWeeksAgo = new Date('2025-11-23T12:00:00Z');
      expect(pipe.transform(twoWeeksAgo, { short: true })).toBe('2w ago');
    });

    it('should use short format for months', () => {
      const threeMonthsAgo = new Date('2025-09-07T12:00:00Z');
      expect(pipe.transform(threeMonthsAgo, { short: true })).toBe('3mo ago');
    });

    it('should use short format for years', () => {
      const twoYearsAgo = new Date('2023-12-07T12:00:00Z');
      expect(pipe.transform(twoYearsAgo, { short: true })).toBe('2y ago');
    });
  });

  describe('Max Unit Constraints', () => {
    it('should respect maxUnit as hour', () => {
      const twoHoursAgo = new Date('2025-12-07T10:00:00Z');
      expect(pipe.transform(twoHoursAgo, { maxUnit: 'hour' })).toBe('2 hours ago');

      const oneDayAgo = new Date('2025-12-06T12:00:00Z');
      expect(pipe.transform(oneDayAgo, { maxUnit: 'hour' })).toBe('24 hours ago');
    });

    it('should respect maxUnit as day', () => {
      const threeDaysAgo = new Date('2025-12-04T12:00:00Z');
      expect(pipe.transform(threeDaysAgo, { maxUnit: 'day' })).toBe('3 days ago');

      const twoWeeksAgo = new Date('2025-11-23T12:00:00Z');
      expect(pipe.transform(twoWeeksAgo, { maxUnit: 'day' })).toBe('14 days ago');
    });

    it('should respect maxUnit as week', () => {
      const twoWeeksAgo = new Date('2025-11-23T12:00:00Z');
      expect(pipe.transform(twoWeeksAgo, { maxUnit: 'week' })).toBe('2 weeks ago');

      const oneMonthAgo = new Date('2025-11-07T12:00:00Z');
      expect(pipe.transform(oneMonthAgo, { maxUnit: 'week' })).toBe('4 weeks ago');
    });
  });
});
