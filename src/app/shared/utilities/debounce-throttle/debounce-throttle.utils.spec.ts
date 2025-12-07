import { of, Subject } from 'rxjs';
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import * as DebounceThrottleUtils from './debounce-throttle.utils';

describe('DebounceThrottleUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100);

      debounced('test', 123);
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('should use the latest arguments', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith('third');
    });

    it('should support leading edge execution', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100, { leading: true, trailing: false });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      debounced();
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should support both leading and trailing execution', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100, { leading: true, trailing: true });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should support maxWait option', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100, { maxWait: 200 });

      debounced();
      vi.advanceTimersByTime(150);
      debounced();
      vi.advanceTimersByTime(60);

      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should cancel pending execution', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100);

      debounced();
      debounced.cancel();

      vi.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });

    it('should flush pending execution', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100);

      debounced('test');
      debounced.flush();

      expect(func).toHaveBeenCalledWith('test');
    });

    it('should indicate if execution is pending', () => {
      const func = vi.fn();
      const debounced = DebounceThrottleUtils.debounce(func, 100);

      expect(debounced.pending()).toBe(false);

      debounced();
      expect(debounced.pending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debounced.pending()).toBe(false);
    });

    it('should preserve this context', () => {
      const mockFn = vi.fn(function (this: { value: number }) {
        return this.value;
      });

      const obj = {
        value: 42,
        method: mockFn,
      };

      const debounced = DebounceThrottleUtils.debounce(obj.method, 100);
      obj.method = debounced as typeof mockFn;

      obj.method();
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const func = vi.fn();
      const throttled = DebounceThrottleUtils.throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should support leading edge execution', () => {
      const func = vi.fn();
      const throttled = DebounceThrottleUtils.throttle(func, 100, { leading: true });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      vi.advanceTimersByTime(50);
      throttled();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should support trailing edge execution', () => {
      const func = vi.fn();
      const throttled = DebounceThrottleUtils.throttle(func, 100, { leading: false, trailing: true });

      throttled();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should support both leading and trailing execution', () => {
      const func = vi.fn();
      const throttled = DebounceThrottleUtils.throttle(func, 100, { leading: true, trailing: true });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should cancel pending execution', () => {
      const func = vi.fn();
      const throttled = DebounceThrottleUtils.throttle(func, 100, { trailing: true });

      throttled();
      throttled.cancel();

      vi.advanceTimersByTime(100);
      // Leading edge executed, but trailing should be canceled
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should flush pending execution', () => {
      const func = vi.fn();
      const throttled = DebounceThrottleUtils.throttle(func, 100, { leading: true, trailing: true });

      throttled();
      throttled();
      throttled.flush();

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('rxDebounce', () => {
    it('should debounce observable emissions', () => {
      const subject = new Subject<number>();
      const results: number[] = [];

      subject.pipe(DebounceThrottleUtils.rxDebounce(100)).subscribe((value) => results.push(value));

      subject.next(1);
      subject.next(2);
      subject.next(3);

      expect(results).toEqual([]);

      vi.advanceTimersByTime(100);
      expect(results).toEqual([3]);
    });

    it('should support leading edge emission', () => {
      const subject = new Subject<number>();
      const results: number[] = [];

      subject
        .pipe(DebounceThrottleUtils.rxDebounce(100, { leading: true }))
        .subscribe((value) => results.push(value));

      subject.next(1);
      expect(results).toEqual([1]);

      subject.next(2);
      subject.next(3);
      vi.advanceTimersByTime(100);

      expect(results).toEqual([1]);
    });

    it('should handle multiple emission cycles', () => {
      const subject = new Subject<number>();
      const results: number[] = [];

      subject.pipe(DebounceThrottleUtils.rxDebounce(100)).subscribe((value) => results.push(value));

      subject.next(1);
      vi.advanceTimersByTime(100);

      subject.next(2);
      vi.advanceTimersByTime(100);

      expect(results).toEqual([1, 2]);
    });

    it('should complete when source completes', () => {
      const completed = vi.fn();

      of(1, 2, 3)
        .pipe(DebounceThrottleUtils.rxDebounce(100))
        .subscribe({
          complete: completed,
        });

      vi.advanceTimersByTime(100);
      expect(completed).toHaveBeenCalled();
    });
  });

  describe('rxThrottle', () => {
    it('should throttle observable emissions', () => {
      const subject = new Subject<number>();
      const results: number[] = [];

      subject.pipe(DebounceThrottleUtils.rxThrottle(100)).subscribe((value) => results.push(value));

      subject.next(1);
      expect(results).toEqual([1]);

      subject.next(2);
      subject.next(3);
      expect(results).toEqual([1]);

      vi.advanceTimersByTime(100);
      subject.next(4);
      expect(results).toEqual([1, 4]);
    });

    it('should support trailing edge emission', () => {
      const subject = new Subject<number>();
      const results: number[] = [];

      subject
        .pipe(DebounceThrottleUtils.rxThrottle(100, { leading: false, trailing: true }))
        .subscribe((value) => results.push(value));

      subject.next(1);
      expect(results).toEqual([]);

      vi.advanceTimersByTime(100);
      expect(results).toEqual([1]);
    });

    it('should support both leading and trailing emission', () => {
      const subject = new Subject<number>();
      const results: number[] = [];

      subject
        .pipe(DebounceThrottleUtils.rxThrottle(100, { leading: true, trailing: true }))
        .subscribe((value) => results.push(value));

      subject.next(1);
      expect(results).toEqual([1]);

      subject.next(2);
      vi.advanceTimersByTime(100);
      expect(results).toEqual([1, 2]);
    });
  });

  describe('once', () => {
    it('should execute function only once', () => {
      const func = vi.fn(() => 'result');
      const onceFunc = DebounceThrottleUtils.once(func);

      const result1 = onceFunc();
      const result2 = onceFunc();
      const result3 = onceFunc();

      expect(func).toHaveBeenCalledTimes(1);
      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(result3).toBe('result');
    });

    it('should pass arguments on first call', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = vi.fn((a: number, b: number) => a + b) as any;
      const onceFunc = DebounceThrottleUtils.once(func);

      const result1 = onceFunc(1, 2);
      const result2 = onceFunc(3, 4);

      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith(1, 2);
      expect(result1).toBe(3);
      expect(result2).toBe(3);
    });

    it('should reset when reset is called', () => {
      const func = vi.fn(() => 'result');
      const onceFunc = DebounceThrottleUtils.once(func);

      onceFunc();
      expect(func).toHaveBeenCalledTimes(1);

      onceFunc.reset();
      onceFunc();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('rateLimit', () => {
    it('should rate limit function execution', async () => {
      const func = vi.fn();
      const limited = DebounceThrottleUtils.rateLimit(func, 100);

      limited();
      expect(func).toHaveBeenCalledTimes(1);

      limited();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      await Promise.resolve();

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should queue executions', async () => {
      const func = vi.fn();
      const limited = DebounceThrottleUtils.rateLimit(func, 100);

      limited();
      limited();
      limited();

      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      await Promise.resolve();

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should cancel pending execution', () => {
      const func = vi.fn();
      const limited = DebounceThrottleUtils.rateLimit(func, 100);

      limited();
      limited();
      limited.cancel();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('delay', () => {
    it('should delay function execution', () => {
      const func = vi.fn();
      const delayed = DebounceThrottleUtils.delay(func, 100);

      delayed();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to delayed function', () => {
      const func = vi.fn();
      const delayed = DebounceThrottleUtils.delay(func, 100);

      delayed('test', 123);
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('should execute each call after delay', () => {
      const func = vi.fn();
      const delayed = DebounceThrottleUtils.delay(func, 100);

      delayed();
      delayed();
      delayed();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(3);
    });
  });

  describe('memoize', () => {
    it('should memoize function results', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = vi.fn((n: number) => n * 2) as any;
      const memoized = DebounceThrottleUtils.memoize(func);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should cache different arguments separately', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = vi.fn((n: number) => n * 2) as any;
      const memoized = DebounceThrottleUtils.memoize(func);

      expect(memoized(5)).toBe(10);
      expect(memoized(10)).toBe(20);
      expect(memoized(5)).toBe(10);

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should use custom resolver', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = vi.fn((a: number, b: number) => a + b) as any;
      const memoized = DebounceThrottleUtils.memoize(func, (a) => String(a));

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 5)).toBe(3); // Same first arg, cached

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should provide cache access', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = vi.fn((n: number) => n * 2) as any;
      const memoized = DebounceThrottleUtils.memoize(func);

      memoized(5);
      expect(memoized.cache.size).toBe(1);
      expect(memoized.cache.get('[5]')).toBe(10);
    });

    it('should clear cache', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = vi.fn((n: number) => n * 2) as any;
      const memoized = DebounceThrottleUtils.memoize(func);

      memoized(5);
      expect(memoized.cache.size).toBe(1);

      memoized.clear();
      expect(memoized.cache.size).toBe(0);

      memoized(5);
      expect(func).toHaveBeenCalledTimes(2);
    });
  });
});
