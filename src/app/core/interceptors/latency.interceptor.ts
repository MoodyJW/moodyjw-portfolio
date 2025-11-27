import type { HttpInterceptorFn } from '@angular/common/http';

import { delay } from 'rxjs/operators';

import { LATENCY_CONFIG } from '@shared/constants';

/**
 * Functional HTTP interceptor that simulates network latency
 * Adds a random delay between MIN_DELAY and MAX_DELAY to HTTP requests
 *
 * This is useful for development to simulate real-world network conditions
 * and test loading states, spinners, and user experience under latency.
 *
 * @example
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([latencyInterceptor])
 * )
 * ```
 */
export const latencyInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip latency simulation if disabled
  if (!LATENCY_CONFIG.ENABLED) {
    return next(req);
  }

  // Generate random delay between MIN_DELAY and MAX_DELAY
  const randomDelay =
    Math.floor(Math.random() * (LATENCY_CONFIG.MAX_DELAY - LATENCY_CONFIG.MIN_DELAY)) +
    LATENCY_CONFIG.MIN_DELAY;

  // Apply delay to the response
  return next(req).pipe(delay(randomDelay));
};
