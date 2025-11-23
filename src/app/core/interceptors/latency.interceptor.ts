import type { HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs/operators';

/**
 * Functional HTTP interceptor that simulates network latency
 * Adds a random delay between 500-1000ms to HTTP requests
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
  // Generate random delay between 500-1000ms
  const randomDelay = Math.floor(Math.random() * 500) + 500;

  // Apply delay to the response
  return next(req).pipe(delay(randomDelay));
};
