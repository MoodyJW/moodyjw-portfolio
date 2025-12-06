import { HttpErrorResponse } from '@angular/common/http';
import type { ErrorHandler} from '@angular/core';
import { inject, Injectable, signal } from '@angular/core';

import { ToastService } from '../toast/toast.service';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error context information
 */
export interface ErrorContext {
  /** Component or service where error occurred */
  source?: string;
  /** User action that triggered the error */
  action?: string;
  /** Additional context data */
  data?: Record<string, unknown>;
  /** Whether to show toast notification */
  showToast?: boolean;
  /** Custom user-friendly message */
  userMessage?: string;
  /** Error severity level */
  severity?: ErrorSeverity;
}

/**
 * Logged error information
 */
export interface LoggedError {
  /** Unique error ID */
  id: string;
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Error type (e.g., 'TypeError', 'HttpError') */
  type: string;
  /** Error context */
  context?: ErrorContext;
  /** Error severity */
  severity: ErrorSeverity;
  /** HTTP status code (for HTTP errors) */
  statusCode?: number;
}

/**
 * Global error handler service that catches and processes errors
 * Provides user-friendly error messages, logging, and optional external reporting
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     { provide: ErrorHandler, useClass: ErrorHandlerService },
 *     // ... other providers
 *   ]
 * };
 *
 * // Manual error handling
 * export class MyComponent {
 *   private errorHandler = inject(ErrorHandlerService);
 *
 *   someMethod() {
 *     try {
 *       // risky operation
 *     } catch (error) {
 *       this.errorHandler.handleError(error, {
 *         source: 'MyComponent',
 *         action: 'someMethod',
 *         showToast: true,
 *         userMessage: 'Failed to perform operation'
 *       });
 *     }
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private toastService = inject(ToastService);

  /** Signal containing all logged errors */
  private readonly _errors = signal<LoggedError[]>([]);

  /** Counter for generating unique error IDs */
  private _idCounter = 0;

  /** Maximum number of errors to keep in memory */
  private readonly MAX_ERRORS = 50;

  /** Whether to log errors to console */
  private logToConsole = true;

  /** External error reporting callback (e.g., Sentry) */
  private externalReporter?: (error: LoggedError) => void;

  /**
   * Public read-only access to logged errors
   */
  readonly errors = this._errors.asReadonly();

  /**
   * Get the total count of logged errors
   */
  getErrorCount = (): number => this._errors().length;

  /**
   * Handle an error (implements Angular's ErrorHandler interface)
   * @param error - The error to handle
   */
  handleError(error: unknown, context?: ErrorContext): void {
    const loggedError = this.processError(error, context);

    // Log to console
    if (this.logToConsole) {
      this.logErrorToConsole(loggedError);
    }

    // Store error
    this.storeError(loggedError);

    // Show toast notification if requested
    if (context?.showToast !== false) {
      this.showErrorToast(loggedError, context);
    }

    // Report to external service
    if (this.externalReporter) {
      try {
        this.externalReporter(loggedError);
      } catch (reportError) {
        console.error('[ErrorHandler] Failed to report error:', reportError);
      }
    }
  }

  /**
   * Handle HTTP errors specifically
   * @param error - HTTP error response
   * @param context - Error context
   */
  handleHttpError(error: HttpErrorResponse, context?: ErrorContext): void {
    const enhancedContext: ErrorContext = {
      ...context,
      data: {
        ...context?.data,
        url: error.url,
        status: error.status,
        statusText: error.statusText,
      },
    };

    this.handleError(error, enhancedContext);
  }

  /**
   * Set up external error reporting (e.g., Sentry)
   * @param reporter - Function to call for external reporting
   */
  setupExternalReporting(reporter: (error: LoggedError) => void): void {
    this.externalReporter = reporter;
  }

  /**
   * Enable or disable console logging
   * @param enabled - Whether to log to console
   */
  setConsoleLogging(enabled: boolean): void {
    this.logToConsole = enabled;
  }

  /**
   * Clear all logged errors
   */
  clearErrors(): void {
    this._errors.set([]);
  }

  /**
   * Get errors by severity level
   * @param severity - Severity level to filter by
   */
  getErrorsBySeverity(severity: ErrorSeverity): LoggedError[] {
    return this._errors().filter((error) => error.severity === severity);
  }

  /**
   * Process an error into a standardized format
   * @param error - The error to process
   * @param context - Error context
   * @returns Processed error information
   */
  private processError(error: unknown, context?: ErrorContext): LoggedError {
    const id = this.generateErrorId();
    const timestamp = new Date();

    // HTTP Error
    if (error instanceof HttpErrorResponse) {
      return {
        id,
        message: this.getHttpErrorMessage(error),
        stack: undefined,
        timestamp,
        type: 'HttpError',
        context,
        severity: this.determineHttpErrorSeverity(error),
        statusCode: error.status,
      };
    }

    // Standard Error
    if (error instanceof Error) {
      return {
        id,
        message: error.message,
        stack: error.stack,
        timestamp,
        type: error.name || 'Error',
        context,
        severity: context?.severity || this.determineErrorSeverity(error),
      };
    }

    // Unknown error type
    return {
      id,
      message: String(error),
      timestamp,
      type: 'UnknownError',
      context,
      severity: context?.severity || 'medium',
    };
  }

  /**
   * Get user-friendly message for HTTP errors
   * @param error - HTTP error response
   */
  private getHttpErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Network error - please check your internet connection';
    }

    if (error.status >= 400 && error.status < 500) {
      // Client errors
      switch (error.status) {
        case 400:
          return 'Bad request - please check your input';
        case 401:
          return 'Authentication required - please log in';
        case 403:
          return 'Access denied - you don\'t have permission';
        case 404:
          return 'Resource not found';
        case 429:
          return 'Too many requests - please try again later';
        default:
          return `Client error (${error.status})`;
      }
    }

    if (error.status >= 500) {
      // Server errors
      return 'Server error - please try again later';
    }

    return error.message || `HTTP Error ${error.status}`;
  }

  /**
   * Determine severity for HTTP errors
   * @param error - HTTP error response
   */
  private determineHttpErrorSeverity(error: HttpErrorResponse): ErrorSeverity {
    if (error.status === 0) return 'high'; // Network error
    if (error.status === 401) return 'medium'; // Auth error
    if (error.status === 403) return 'medium'; // Permission error
    if (error.status === 404) return 'low'; // Not found
    if (error.status >= 500) return 'high'; // Server error
    return 'medium';
  }

  /**
   * Determine severity for general errors
   * @param error - Error object
   */
  private determineErrorSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();

    // Critical errors
    if (
      message.includes('out of memory') ||
      message.includes('quota exceeded') ||
      message.includes('cannot read')
    ) {
      return 'critical';
    }

    // High severity
    if (
      message.includes('failed') ||
      message.includes('error') ||
      message.includes('exception')
    ) {
      return 'high';
    }

    return 'medium';
  }

  /**
   * Log error to console with formatting
   * @param error - Logged error information
   */
  private logErrorToConsole(error: LoggedError): void {
    const prefix = `[ErrorHandler ${error.severity.toUpperCase()}]`;
    const context = error.context
      ? `\nContext: ${JSON.stringify(error.context, null, 2)}`
      : '';

    console.error(
      `${prefix} ${error.type}: ${error.message}${context}`,
      error.stack ? `\n${error.stack}` : ''
    );
  }

  /**
   * Store error in memory (with limit)
   * @param error - Logged error information
   */
  private storeError(error: LoggedError): void {
    this._errors.update((errors) => {
      const updated = [error, ...errors];
      // Keep only the most recent MAX_ERRORS
      return updated.slice(0, this.MAX_ERRORS);
    });
  }

  /**
   * Show error toast notification
   * @param error - Logged error information
   * @param context - Error context
   */
  private showErrorToast(error: LoggedError, context?: ErrorContext): void {
    const userMessage =
      context?.userMessage || this.getUserFriendlyMessage(error);

    const duration = error.severity === 'critical' ? 0 : 7000; // Critical errors don't auto-dismiss

    this.toastService.error(userMessage, {
      title: this.getToastTitle(error),
      duration,
      position: 'top-right',
    });
  }

  /**
   * Get user-friendly error message
   * @param error - Logged error information
   */
  private getUserFriendlyMessage(error: LoggedError): string {
    // HTTP errors already have user-friendly messages
    if (error.type === 'HttpError') {
      return error.message;
    }

    // For other errors, provide a generic message
    if (error.severity === 'critical') {
      return 'A critical error occurred. Please refresh the page.';
    }

    if (error.severity === 'high') {
      return 'An error occurred. Please try again.';
    }

    return 'Something went wrong. Please try again.';
  }

  /**
   * Get toast title based on error severity
   * @param error - Logged error information
   */
  private getToastTitle(error: LoggedError): string {
    switch (error.severity) {
      case 'critical':
        return 'Critical Error';
      case 'high':
        return 'Error';
      case 'medium':
        return 'Warning';
      case 'low':
        return 'Notice';
      default:
        return 'Error';
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${++this._idCounter}`;
  }
}
