import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ToastService } from '../toast/toast.service';

import type { ErrorContext } from './error-handler.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let toastService: ToastService;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService, ToastService],
    });
    service = TestBed.inject(ErrorHandlerService);
    toastService = TestBed.inject(ToastService);

    // Spy on console.error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    service.clearErrors();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with zero errors', () => {
      expect(service.getErrorCount()).toBe(0);
      expect(service.errors()).toEqual([]);
    });
  });

  describe('handleError() with Error objects', () => {
    it('should handle a standard Error', () => {
      const error = new Error('Test error');
      service.handleError(error, { showToast: false });

      expect(service.getErrorCount()).toBe(1);
      const errors = service.errors();
      expect(errors[0].message).toBe('Test error');
      expect(errors[0].type).toBe('Error');
    });

    it('should handle a TypeError', () => {
      const error = new TypeError('Type error occurred');
      service.handleError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].type).toBe('TypeError');
      expect(errors[0].message).toBe('Type error occurred');
    });

    it('should log error to console by default', () => {
      const error = new Error('Console test');
      service.handleError(error, { showToast: false });

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArg = consoleErrorSpy.mock.calls[0][0];
      expect(callArg).toContain('Console test');
    });

    it('should not log to console when disabled', () => {
      service.setConsoleLogging(false);
      const error = new Error('No console');
      service.handleError(error, { showToast: false });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should include stack trace', () => {
      const error = new Error('Stack test');
      service.handleError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].stack).toBeDefined();
    });

    it('should include timestamp', () => {
      const beforeTime = new Date();
      const error = new Error('Timestamp test');
      service.handleError(error, { showToast: false });
      const afterTime = new Date();

      const errors = service.errors();
      expect(errors[0].timestamp).toBeInstanceOf(Date);
      expect(errors[0].timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(errors[0].timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should generate unique IDs', () => {
      service.handleError(new Error('Error 1'), { showToast: false });
      service.handleError(new Error('Error 2'), { showToast: false });
      service.handleError(new Error('Error 3'), { showToast: false });

      const errors = service.errors();
      const ids = errors.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('handleError() with context', () => {
    it('should store error context', () => {
      const error = new Error('Context test');
      const context: ErrorContext = {
        source: 'TestComponent',
        action: 'testMethod',
        data: { userId: 123 },
      };

      service.handleError(error, { ...context, showToast: false });

      const errors = service.errors();
      expect(errors[0].context).toEqual(expect.objectContaining(context));
    });

    it('should use custom severity from context', () => {
      const error = new Error('Custom severity');
      service.handleError(error, { severity: 'low', showToast: false });

      const errors = service.errors();
      expect(errors[0].severity).toBe('low');
    });

    it('should use custom user message in context', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      const error = new Error('Internal error');

      service.handleError(error, {
        userMessage: 'Custom user message',
        showToast: true,
      });

      expect(toastSpy).toHaveBeenCalledWith(
        'Custom user message',
        expect.any(Object)
      );
    });
  });

  describe('handleHttpError()', () => {
    it('should handle 404 error', () => {
      const error = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        url: '/api/test',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].type).toBe('HttpError');
      expect(errors[0].statusCode).toBe(404);
      expect(errors[0].message).toBe('Resource not found');
    });

    it('should handle 401 unauthorized error', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('Authentication required - please log in');
      expect(errors[0].severity).toBe('medium');
    });

    it('should handle 403 forbidden error', () => {
      const error = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('Access denied - you don\'t have permission');
    });

    it('should handle 500 server error', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('Server error - please try again later');
      expect(errors[0].severity).toBe('high');
    });

    it('should handle network error (status 0)', () => {
      const error = new HttpErrorResponse({
        status: 0,
        statusText: 'Unknown Error',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('Network error - please check your internet connection');
      expect(errors[0].severity).toBe('high');
    });

    it('should include URL in context', () => {
      const error = new HttpErrorResponse({
        status: 404,
        url: '/api/users/123',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].context?.data?.['url']).toBe('/api/users/123');
    });

    it('should handle 429 rate limit error', () => {
      const error = new HttpErrorResponse({
        status: 429,
        statusText: 'Too Many Requests',
      });

      service.handleHttpError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('Too many requests - please try again later');
    });
  });

  describe('Toast Notifications', () => {
    it('should show toast by default', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      const error = new Error('Toast test');

      service.handleError(error);

      expect(toastSpy).toHaveBeenCalled();
    });

    it('should not show toast when showToast is false', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      const error = new Error('No toast');

      service.handleError(error, { showToast: false });

      expect(toastSpy).not.toHaveBeenCalled();
    });

    it('should use different titles for different severities', () => {
      const toastSpy = vi.spyOn(toastService, 'error');

      // Critical
      service.handleError(new Error('out of memory'), { showToast: true });
      expect(toastSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ title: 'Critical Error' })
      );

      toastSpy.mockClear();

      // High
      service.handleError(new Error('failed to load'), { showToast: true });
      expect(toastSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ title: 'Error' })
      );
    });

    it('should not auto-dismiss critical errors', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      service.handleError(new Error('quota exceeded'), { showToast: true });

      expect(toastSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ duration: 0 })
      );
    });

    it('should auto-dismiss non-critical errors', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      service.handleError(new Error('regular error'), { showToast: true });

      expect(toastSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ duration: 7000 })
      );
    });
  });

  describe('Error Storage', () => {
    it('should store errors in order (newest first)', () => {
      service.handleError(new Error('First'), { showToast: false });
      service.handleError(new Error('Second'), { showToast: false });
      service.handleError(new Error('Third'), { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('Third');
      expect(errors[1].message).toBe('Second');
      expect(errors[2].message).toBe('First');
    });

    it('should limit stored errors to MAX_ERRORS (50)', () => {
      // Add 60 errors
      for (let i = 0; i < 60; i++) {
        service.handleError(new Error(`Error ${i}`), { showToast: false });
      }

      expect(service.getErrorCount()).toBe(50);
      const errors = service.errors();
      expect(errors[0].message).toBe('Error 59');
      expect(errors[49].message).toBe('Error 10');
    });

    it('should clear all errors', () => {
      service.handleError(new Error('Error 1'), { showToast: false });
      service.handleError(new Error('Error 2'), { showToast: false });
      expect(service.getErrorCount()).toBe(2);

      service.clearErrors();
      expect(service.getErrorCount()).toBe(0);
      expect(service.errors()).toEqual([]);
    });
  });

  describe('Error Severity Determination', () => {
    it('should assign critical severity for out of memory errors', () => {
      const error = new Error('out of memory');
      service.handleError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].severity).toBe('critical');
    });

    it('should assign critical severity for quota exceeded errors', () => {
      const error = new Error('quota exceeded');
      service.handleError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].severity).toBe('critical');
    });

    it('should assign high severity for failed operations', () => {
      const error = new Error('Operation failed');
      service.handleError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].severity).toBe('high');
    });

    it('should assign medium severity for generic errors', () => {
      const error = new Error('Something happened');
      service.handleError(error, { showToast: false });

      const errors = service.errors();
      expect(errors[0].severity).toBe('medium');
    });
  });

  describe('getErrorsBySeverity()', () => {
    beforeEach(() => {
      service.handleError(new Error('out of memory'), { showToast: false }); // critical
      service.handleError(new Error('failed to save'), { showToast: false }); // high
      service.handleError(new Error('something wrong'), { showToast: false }); // medium
      service.handleError(new Error('test'), { severity: 'low', showToast: false }); // low
    });

    it('should filter critical errors', () => {
      const criticalErrors = service.getErrorsBySeverity('critical');
      expect(criticalErrors.length).toBe(1);
      expect(criticalErrors[0].message).toBe('out of memory');
    });

    it('should filter high severity errors', () => {
      const highErrors = service.getErrorsBySeverity('high');
      expect(highErrors.length).toBe(1);
      expect(highErrors[0].message).toBe('failed to save');
    });

    it('should filter medium severity errors', () => {
      const mediumErrors = service.getErrorsBySeverity('medium');
      expect(mediumErrors.length).toBe(1);
    });

    it('should filter low severity errors', () => {
      const lowErrors = service.getErrorsBySeverity('low');
      expect(lowErrors.length).toBe(1);
      expect(lowErrors[0].severity).toBe('low');
    });
  });

  describe('External Reporting', () => {
    it('should call external reporter when configured', () => {
      const reporter = vi.fn();
      service.setupExternalReporting(reporter);

      const error = new Error('Report test');
      service.handleError(error, { showToast: false });

      expect(reporter).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Report test',
          type: 'Error',
        })
      );
    });

    it('should not crash if reporter throws error', () => {
      const reporter = vi.fn().mockImplementation(() => {
        throw new Error('Reporter failed');
      });
      service.setupExternalReporting(reporter);

      expect(() => {
        service.handleError(new Error('Test'), { showToast: false });
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to report error'),
        expect.any(Error)
      );
    });

    it('should not call reporter when not configured', () => {
      const error = new Error('No reporter');
      expect(() => {
        service.handleError(error, { showToast: false });
      }).not.toThrow();
    });
  });

  describe('Unknown Error Types', () => {
    it('should handle string errors', () => {
      service.handleError('String error', { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('String error');
      expect(errors[0].type).toBe('UnknownError');
    });

    it('should handle number errors', () => {
      service.handleError(404, { showToast: false });

      const errors = service.errors();
      expect(errors[0].message).toBe('404');
      expect(errors[0].type).toBe('UnknownError');
    });

    it('should handle object errors', () => {
      service.handleError({ code: 'ERR', msg: 'Error occurred' }, { showToast: false });

      const errors = service.errors();
      expect(errors[0].type).toBe('UnknownError');
      expect(errors[0].message).toBe('[object Object]');
    });

    it('should handle null', () => {
      service.handleError(null, { showToast: false });

      const errors = service.errors();
      expect(errors[0].type).toBe('UnknownError');
    });

    it('should handle undefined', () => {
      service.handleError(undefined, { showToast: false });

      const errors = service.errors();
      expect(errors[0].type).toBe('UnknownError');
    });
  });

  describe('Signal Reactivity', () => {
    it('should provide readonly signal for errors', () => {
      const errorsSignal = service.errors;
      expect(typeof errorsSignal).toBe('function');
    });

    it('should update signal when error is added', () => {
      expect(service.errors().length).toBe(0);

      service.handleError(new Error('Test'), { showToast: false });

      expect(service.errors().length).toBe(1);
    });

    it('should update signal when errors are cleared', () => {
      service.handleError(new Error('Test'), { showToast: false });
      expect(service.errors().length).toBe(1);

      service.clearErrors();
      expect(service.errors().length).toBe(0);
    });
  });

  describe('User-Friendly Messages', () => {
    it('should provide generic message for medium severity', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      service.handleError(new Error('Internal error'), { severity: 'medium' });

      expect(toastSpy).toHaveBeenCalledWith(
        'Something went wrong. Please try again.',
        expect.any(Object)
      );
    });

    it('should provide critical message for critical errors', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      service.handleError(new Error('quota exceeded'));

      expect(toastSpy).toHaveBeenCalledWith(
        'A critical error occurred. Please refresh the page.',
        expect.any(Object)
      );
    });

    it('should provide high severity message', () => {
      const toastSpy = vi.spyOn(toastService, 'error');
      service.handleError(new Error('Operation failed'), { severity: 'high' });

      expect(toastSpy).toHaveBeenCalledWith(
        'An error occurred. Please try again.',
        expect.any(Object)
      );
    });
  });
});
