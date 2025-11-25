# Error Tracking & Observability

This document outlines error tracking strategy for a static GitHub Pages deployment without external services or self-hosted infrastructure.

## Recommendation Summary

**For Portfolio/Static Sites (No Backend):**

- **Primary Approach**: Angular ErrorHandler + Browser Console + Optional User Reporting
- **Development**: Local error logging with IndexedDB/LocalStorage for debugging
- **Production**: Structured console logging + GitHub Issues integration for user reports
- **Why**: Keeps everything contained in the deployed app, no external dependencies, no hosting costs

**Alternative (If External Service Acceptable Later):**

- Sentry Cloud (free tier: 5K events/month) - requires external service
- Note: Sentry is open source but self-hosting requires Docker/PostgreSQL/Redis infrastructure (not suitable for GitHub Pages)

---

## Recommended Implementation: Client-Side Error Tracking

### Phase 1: Error Handler Service

Create an `ErrorHandlerService` that extends Angular's `ErrorHandler`:

```typescript
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  environment: string;
  release: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  private readonly MAX_ERRORS = 50;
  private readonly STORAGE_KEY = 'app_error_logs';

  handleError(error: Error | any): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      environment: environment.name,
      release: environment.version,
    };

    // Development: Log to console with full details
    if (!environment.production) {
      console.error('🔴 Error caught:', errorLog);
      console.error('Stack trace:', error);
    }

    // Production: Log structured info
    if (environment.production) {
      console.error('[Error]', {
        message: errorLog.message,
        timestamp: errorLog.timestamp,
        url: errorLog.url,
      });
    }

    // Store error locally
    this.storeError(errorLog);
  }

  private storeError(errorLog: ErrorLog): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const errors: ErrorLog[] = stored ? JSON.parse(stored) : [];
      
      errors.unshift(errorLog);
      
      if (errors.length > this.MAX_ERRORS) {
        errors.length = this.MAX_ERRORS;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(errors));
    } catch (e) {
      // Storage failed, ignore
    }
  }

  getStoredErrors(): ErrorLog[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearStoredErrors(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
```

### Phase 2: Register Error Handler

In `app.config.ts`:

```typescript
import { ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from '@core/services/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
};
```

### Phase 3: HTTP Error Interceptor

Create an interceptor to catch HTTP errors:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '@core/services/error-handler.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error) => {
      errorHandler.handleError({
        message: `HTTP ${error.status}: ${error.statusText}`,
        stack: `URL: ${req.url}\nMethod: ${req.method}`,
      });
      return throwError(() => error);
    })
  );
};
```

### Phase 4: Optional User Reporting

Create a "Report Issue" button:

```typescript
import { Component, inject } from '@angular/core';
import { ErrorHandlerService } from '@core/services/error-handler.service';

@Component({
  selector: 'app-error-report',
  template: `<button (click)="reportIssue()">Report Issue</button>`,
})
export class ErrorReportComponent {
  private errorHandler = inject(ErrorHandlerService);

  reportIssue(): void {
    const errors = this.errorHandler.getStoredErrors();
    const recentErrors = errors.slice(0, 5);
    
    const issueBody = encodeURIComponent(`
**Error Report**

**Environment:** ${navigator.userAgent}
**URL:** ${window.location.href}
**Timestamp:** ${new Date().toISOString()}

**Recent Errors:**
${recentErrors.map(e => `- ${e.timestamp}: ${e.message}`).join('\n')}

**Steps to Reproduce:**
1. 
2. 
3. 
    `);

    const issueUrl = `https://github.com/MoodyJW/moodyjw-portfolio/issues/new?title=Bug%20Report&body=${issueBody}`;
    window.open(issueUrl, '_blank');
  }
}
```

---

## Alternative: Sentry Cloud (If External Service Acceptable)

If you later decide to use an external service, Sentry offers a free tier (5K events/month):

### Sentry Setup

```bash
npm install @sentry/angular --legacy-peer-deps
```

```typescript
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: environment.sentryDsn,
  environment: environment.name,
  release: environment.version,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Scrub PII if present
    return event;
  },
});
```

**Note**: Sentry requires an external service account. Self-hosting requires Docker infrastructure (not suitable for GitHub Pages).

---

## QA & Acceptance

**For Client-Side Approach:**

- [ ] ErrorHandler catches and logs errors in console
- [ ] Errors stored in localStorage with timestamp and details
- [ ] HTTP errors intercepted and logged
- [ ] "Report Issue" button generates GitHub issue with error details
- [ ] Production builds show minimal console output (no stack traces exposed)

**For Sentry (if chosen):**

- [ ] Sentry receives test error from staging
- [ ] Source maps uploaded (optional)
- [ ] User feedback widget appears on errors (optional)

---

## Recommendation for Portfolio Site

✅ **Use the client-side ErrorHandler approach**
- Zero external dependencies
- No hosting costs
- All code contained in your app
- Good enough for a portfolio site

❌ **Skip Sentry** unless you need advanced features
- Requires external service account
- Overkill for a portfolio site

---

**Document Version**: 2.0  
**Last Updated**: November 25, 2025  
**Approach**: Client-Side Error Tracking (No External Services)
