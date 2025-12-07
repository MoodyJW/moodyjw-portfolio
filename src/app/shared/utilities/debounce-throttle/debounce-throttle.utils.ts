/**
 * Debounce and Throttle Utility Functions
 *
 * A comprehensive collection of timing control utilities for both
 * standalone functions and RxJS operators. Provides debouncing,
 * throttling, and rate limiting with full type safety.
 *
 * @module DebounceThrottleUtils
 */

/* eslint-disable no-undef */
import type { MonoTypeOperatorFunction } from 'rxjs';
import { Observable } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

/**
 * Options for debounce operations
 */
export interface DebounceOptions {
  /** Execute on the leading edge instead of trailing (default: false) */
  leading?: boolean;
  /** Execute on the trailing edge (default: true) */
  trailing?: boolean;
  /** Maximum wait time before forced execution (in ms) */
  maxWait?: number;
}

/**
 * Options for throttle operations
 */
export interface ThrottleOptions {
  /** Execute on the leading edge (default: true) */
  leading?: boolean;
  /** Execute on the trailing edge (default: false) */
  trailing?: boolean;
}

/**
 * Options for RxJS debounce operators
 */
export interface RxDebounceOptions {
  /** Execute on the leading edge instead of trailing (default: false) */
  leading?: boolean;
}

/**
 * Options for RxJS throttle operators
 */
export interface RxThrottleOptions {
  /** Execute on the leading edge (default: true) */
  leading?: boolean;
  /** Execute on the trailing edge (default: false) */
  trailing?: boolean;
}

/**
 * Creates a debounced function that delays invoking func until after
 * wait milliseconds have elapsed since the last time the debounced
 * function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Debounce options
 * @returns The debounced function with a cancel method
 *
 * @example
 * ```typescript
 * // Basic debounce - waits 300ms after last call
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // Leading edge execution
 * const debouncedClick = debounce(handleClick, 500, { leading: true, trailing: false });
 *
 * // With max wait
 * const debouncedScroll = debounce(handleScroll, 100, { maxWait: 500 });
 *
 * // Cancel pending execution
 * debouncedSearch.cancel();
 *
 * // Flush pending execution immediately
 * debouncedSearch.flush();
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => void; pending: () => boolean } {
  const { leading = false, trailing = true, maxWait } = options;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let maxTimerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: unknown[] | undefined;
  let lastThis: unknown;
  let result: unknown;

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as Parameters<T>);
    return result;
  }

  function startTimer(pendingFunc: () => void, wait: number) {
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id: ReturnType<typeof setTimeout> | undefined) {
    if (id !== undefined) {
      clearTimeout(id);
    }
  }

  function leadingEdge(time: number) {
    // Reset any maxWait timer
    lastInvokeTime = time;

    // Start the timer for the trailing edge
    timerId = startTimer(timerExpired, wait);

    // Invoke the leading edge
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the maxWait limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    timerId = startTimer(timerExpired, remainingWait(time));
    return undefined;
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    // Only invoke if we have lastArgs which means func has been called
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    if (maxTimerId !== undefined) {
      cancelTimer(maxTimerId);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    lastThis = undefined;
    timerId = undefined;
    maxTimerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(this: unknown, ...args: unknown[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Handle invocations in a tight loop
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced as T & {
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
  };
}

/**
 * Creates a throttled function that only invokes func at most once per
 * every wait milliseconds.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Throttle options
 * @returns The throttled function with a cancel method
 *
 * @example
 * ```typescript
 * // Basic throttle - executes at most once per 200ms
 * const throttledResize = throttle(() => {
 *   console.log('Window resized');
 * }, 200);
 *
 * // Trailing edge execution
 * const throttledScroll = throttle(handleScroll, 100, { trailing: true });
 *
 * // Leading edge disabled
 * const throttledInput = throttle(handleInput, 300, { leading: false, trailing: true });
 *
 * // Cancel pending execution
 * throttledResize.cancel();
 *
 * // Flush pending execution immediately
 * throttledResize.flush();
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): T & { cancel: () => void; flush: () => void; pending: () => boolean } {
  const { leading = true, trailing = false } = options;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

/**
 * RxJS operator that debounces emissions from the source Observable.
 * Emits a value from the source Observable only after a particular time
 * span has passed without another source emission.
 *
 * @param wait - The timeout duration in milliseconds
 * @param options - Debounce options
 * @returns An operator function that returns an Observable
 *
 * @example
 * ```typescript
 * // In a component
 * searchControl.valueChanges
 *   .pipe(rxDebounce(300))
 *   .subscribe(query => this.search(query));
 *
 * // Leading edge execution
 * clicks$
 *   .pipe(rxDebounce(500, { leading: true }))
 *   .subscribe(() => console.log('Clicked'));
 * ```
 */
export function rxDebounce<T>(
  wait: number,
  options: RxDebounceOptions = {}
): MonoTypeOperatorFunction<T> {
  const { leading = false } = options;

  if (leading) {
    // For leading edge, we need custom implementation
    return (source: Observable<T>) =>
      new Observable((subscriber) => {
        let timerId: ReturnType<typeof setTimeout> | undefined;
        let hasValue = false;

        const subscription = source.subscribe({
          next(value: T) {
            if (!hasValue) {
              hasValue = true;
              subscriber.next(value);
            }

            if (timerId !== undefined) {
              clearTimeout(timerId);
            }

            timerId = setTimeout(() => {
              hasValue = false;
              timerId = undefined;
            }, wait);
          },
          error(err) {
            subscriber.error(err);
          },
          complete() {
            subscriber.complete();
          },
        });

        return () => {
          if (timerId !== undefined) {
            clearTimeout(timerId);
          }
          subscription.unsubscribe();
        };
      });
  }

  // Default trailing edge behavior
  return debounceTime<T>(wait);
}

/**
 * RxJS operator that throttles emissions from the source Observable.
 * Emits a value from the source Observable, then ignores subsequent
 * source values for wait milliseconds, then repeats this process.
 *
 * @param wait - The throttling duration in milliseconds
 * @param options - Throttle options
 * @returns An operator function that returns an Observable
 *
 * @example
 * ```typescript
 * // In a component
 * scroll$
 *   .pipe(rxThrottle(100))
 *   .subscribe(() => this.handleScroll());
 *
 * // Trailing edge execution
 * resize$
 *   .pipe(rxThrottle(200, { leading: false, trailing: true }))
 *   .subscribe(() => this.handleResize());
 * ```
 */
export function rxThrottle<T>(
  wait: number,
  options: RxThrottleOptions = {}
): MonoTypeOperatorFunction<T> {
  const { leading = true, trailing = false } = options;

  const config = {
    leading,
    trailing,
  };

  return throttleTime<T>(wait, undefined, config);
}

/**
 * Creates a function that is restricted to execute func only once.
 * Repeat calls to the function return the value of the first invocation.
 *
 * @param func - The function to restrict
 * @returns The restricted function
 *
 * @example
 * ```typescript
 * const initialize = once(() => {
 *   console.log('Initializing...');
 *   return { initialized: true };
 * });
 *
 * initialize(); // Logs: 'Initializing...'
 * initialize(); // No log, returns cached result
 * initialize(); // No log, returns cached result
 * ```
 */
export function once<T extends (...args: unknown[]) => unknown>(
  func: T
): T & { reset: () => void } {
  let called = false;
  let result: ReturnType<T>;

  function onceWrapper(this: unknown, ...args: unknown[]) {
    if (!called) {
      called = true;
      result = func.apply(this, args) as ReturnType<T>;
    }
    return result;
  }

  onceWrapper.reset = () => {
    called = false;
    result = undefined as ReturnType<T>;
  };

  return onceWrapper as T & { reset: () => void };
}

/**
 * Creates a rate-limited function that executes at most once per interval.
 * Unlike throttle, this tracks execution time rather than call time.
 *
 * @param func - The function to rate limit
 * @param interval - The interval in milliseconds
 * @returns The rate-limited function
 *
 * @example
 * ```typescript
 * const rateLimitedApi = rateLimit(apiCall, 1000);
 *
 * // These will queue and execute one per second
 * rateLimitedApi();
 * rateLimitedApi();
 * rateLimitedApi();
 * ```
 */
export function rateLimit<T extends (...args: unknown[]) => unknown>(
  func: T,
  interval: number
): T & { cancel: () => void } {
  let lastExecution = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function rateLimited(this: unknown, ...args: unknown[]) {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecution;

    if (timeSinceLastExecution >= interval) {
      lastExecution = now;
      return func.apply(this, args);
    }

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        lastExecution = Date.now();
        resolve(func.apply(this, args));
        timeoutId = undefined;
      }, interval - timeSinceLastExecution);
    });
  }

  rateLimited.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return rateLimited as T & { cancel: () => void };
}

/**
 * Delays the execution of a function by the specified time.
 *
 * @param func - The function to delay
 * @param wait - The delay in milliseconds
 * @returns The delayed function
 *
 * @example
 * ```typescript
 * const delayedLog = delay((msg: string) => console.log(msg), 1000);
 * delayedLog('Hello'); // Logs after 1 second
 * ```
 */
export function delay<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  return function (this: unknown, ...args: Parameters<T>) {
    setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Creates a function that memoizes the result of func. If resolver is provided,
 * it determines the cache key for storing the result based on the arguments.
 *
 * @param func - The function to memoize
 * @param resolver - The function to resolve the cache key
 * @returns The memoized function with cache access
 *
 * @example
 * ```typescript
 * const expensiveCalc = memoize((n: number) => {
 *   console.log('Calculating...');
 *   return n * n;
 * });
 *
 * expensiveCalc(5); // Logs: 'Calculating...', returns 25
 * expensiveCalc(5); // Returns 25 (from cache, no log)
 *
 * // With custom resolver
 * const memoizedFetch = memoize(
 *   (url: string, options: RequestInit) => fetch(url, options),
 *   (url) => url // Cache by URL only
 * );
 * ```
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T & { cache: Map<string, ReturnType<T>>; clear: () => void } {
  const cache = new Map<string, ReturnType<T>>();

  function memoized(this: unknown, ...args: Parameters<T>) {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized as T & {
    cache: Map<string, ReturnType<T>>;
    clear: () => void;
  };
}
