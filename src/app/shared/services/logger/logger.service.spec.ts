/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleGroupSpy: ReturnType<typeof vi.spyOn>;
  let consoleGroupCollapsedSpy: ReturnType<typeof vi.spyOn>;
  let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>;
  let consoleTableSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    });
    service = TestBed.inject(LoggerService);

    // Spy on console methods
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    consoleGroupCollapsedSpy = vi
      .spyOn(console, 'groupCollapsed')
      .mockImplementation(() => {});
    consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    consoleTableSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
  });

  afterEach(() => {
    service.clearHistory();
    vi.restoreAllMocks();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with Debug level in development mode', () => {
      // The service defaults to Debug in dev mode
      service.debug('test');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('Log Levels', () => {
    it('should log debug messages', () => {
      service.setLevel(LogLevel.Debug);
      service.debug('Debug message');

      expect(consoleDebugSpy).toHaveBeenCalled();
      const call = consoleDebugSpy.mock.calls[0][0];
      expect(call).toContain('Debug message');
    });

    it('should log info messages', () => {
      service.setLevel(LogLevel.Debug);
      service.info('Info message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('Info message');
    });

    it('should log warn messages', () => {
      service.setLevel(LogLevel.Debug);
      service.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const call = consoleWarnSpy.mock.calls[0][0];
      expect(call).toContain('Warning message');
    });

    it('should log error messages', () => {
      service.setLevel(LogLevel.Debug);
      service.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('Error message');
    });

    it('should log error with Error object', () => {
      service.setLevel(LogLevel.Debug);
      const error = new Error('Test error');
      service.error('An error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0]).toContain(error);
    });
  });

  describe('Log Level Filtering', () => {
    it('should not log debug when level is Info', () => {
      service.setLevel(LogLevel.Info);
      service.debug('Debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log info when level is Info', () => {
      service.setLevel(LogLevel.Info);
      service.info('Info message');

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should not log info when level is Warn', () => {
      service.setLevel(LogLevel.Warn);
      service.info('Info message');

      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('should log warn when level is Warn', () => {
      service.setLevel(LogLevel.Warn);
      service.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should not log anything when level is None', () => {
      service.setLevel(LogLevel.None);
      service.debug('Debug');
      service.info('Info');
      service.warn('Warn');
      service.error('Error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log only error when level is Error', () => {
      service.setLevel(LogLevel.Error);
      service.debug('Debug');
      service.info('Info');
      service.warn('Warn');
      service.error('Error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    it('should configure log level', () => {
      service.configure({ level: LogLevel.Warn });

      service.info('Should not log');
      service.warn('Should log');

      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should configure prefix', () => {
      service.configure({ prefix: 'MyApp' });
      service.info('Test message');

      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('[MyApp]');
    });

    it('should configure timestamp visibility', () => {
      service.configure({ showTimestamp: false });
      service.info('Test');

      const call = consoleInfoSpy.mock.calls[0][0];
      // Should not contain timestamp pattern
      expect(call).not.toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/);
    });

    it('should show timestamp by default', () => {
      service.configure({ showTimestamp: true });
      service.info('Test');

      const call = consoleInfoSpy.mock.calls[0][0];
      // Should contain timestamp pattern
      expect(call).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/);
    });

    it('should configure context visibility', () => {
      const logger = service.createLogger('TestContext');
      service.configure({ showContext: false });

      logger.info('Test');

      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).not.toContain('[TestContext]');
    });
  });

  describe('Context Logger', () => {
    it('should create a logger with context', () => {
      const logger = service.createLogger('MyComponent');
      logger.info('Test message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('[MyComponent]');
    });

    it('should support all log levels with context', () => {
      const logger = service.createLogger('TestContext');

      logger.debug('Debug');
      logger.info('Info');
      logger.warn('Warn');
      logger.error('Error');

      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle error with context logger', () => {
      const logger = service.createLogger('ErrorContext');
      const error = new Error('Test error');

      logger.error('Error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0]).toContain(error);
    });
  });

  describe('Performance Timing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should start a timer', () => {
      service.startTimer('test');

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining('Timer started: test')
      );
    });

    it('should end a timer and log duration', () => {
      service.startTimer('test');
      vi.advanceTimersByTime(100);
      const duration = service.endTimer('test');

      expect(duration).toBeGreaterThanOrEqual(0);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('test:')
      );
    });

    it('should return undefined for non-existent timer', () => {
      const duration = service.endTimer('nonexistent');

      expect(duration).toBeUndefined();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Timer "nonexistent" not found')
      );
    });

    it('should measure async operations', async () => {
      const operation = vi.fn().mockResolvedValue('result');

      const result = await service.measure('async-test', operation);

      expect(result).toBe('result');
      expect(operation).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('async-test:')
      );
    });

    it('should get active timers', () => {
      service.startTimer('timer1');
      service.startTimer('timer2');

      const timers = service.getActiveTimers();

      expect(timers.size).toBe(2);
      expect(timers.has('timer1')).toBe(true);
      expect(timers.has('timer2')).toBe(true);
    });

    it('should remove timer after ending', () => {
      service.startTimer('timer');
      service.endTimer('timer');

      const timers = service.getActiveTimers();
      expect(timers.has('timer')).toBe(false);
    });
  });

  describe('Grouping', () => {
    it('should create a log group', () => {
      service.group('Test Group');

      expect(consoleGroupSpy).toHaveBeenCalled();
    });

    it('should create a collapsed log group', () => {
      service.group('Test Group', true);

      expect(consoleGroupCollapsedSpy).toHaveBeenCalled();
    });

    it('should end a log group', () => {
      service.group('Test');
      service.groupEnd();

      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should not create group when level is too high', () => {
      service.setLevel(LogLevel.Error);
      service.group('Test');

      expect(consoleGroupSpy).not.toHaveBeenCalled();
    });
  });

  describe('Table Logging', () => {
    it('should log a table', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      service.table(data);

      expect(consoleTableSpy).toHaveBeenCalledWith(data);
    });

    it('should log a table with specific columns', () => {
      const data = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
      ];

      service.table(data, ['id', 'name']);

      expect(consoleTableSpy).toHaveBeenCalledWith(data, ['id', 'name']);
    });

    it('should not log table when level is too high', () => {
      service.setLevel(LogLevel.Error);
      service.table([{ id: 1 }]);

      expect(consoleTableSpy).not.toHaveBeenCalled();
    });
  });

  describe('Assertions', () => {
    it('should not log when assertion passes', () => {
      service.assert(true, 'Should not fail');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log error when assertion fails', () => {
      service.assert(false, 'Should fail');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Assertion failed: Should fail')
      );
    });
  });

  describe('Log History', () => {
    it('should store logs in history', () => {
      service.info('Message 1');
      service.warn('Message 2');
      service.error('Message 3');

      const history = service.getHistory();

      expect(history.length).toBe(3);
      expect(history[0].message).toBe('Message 3'); // Newest first
      expect(history[1].message).toBe('Message 2');
      expect(history[2].message).toBe('Message 1');
    });

    it('should limit history to MAX_HISTORY', () => {
      // Add 150 entries
      for (let i = 0; i < 150; i++) {
        service.info(`Message ${i}`);
      }

      const history = service.getHistory();

      expect(history.length).toBe(100); // MAX_HISTORY
    });

    it('should clear history', () => {
      service.info('Test 1');
      service.info('Test 2');

      expect(service.getHistory().length).toBe(2);

      service.clearHistory();

      expect(service.getHistory().length).toBe(0);
    });

    it('should store log level in history', () => {
      service.debug('Debug');
      service.info('Info');
      service.warn('Warn');
      service.error('Error');

      const history = service.getHistory();

      expect(history[3].level).toBe(LogLevel.Debug);
      expect(history[2].level).toBe(LogLevel.Info);
      expect(history[1].level).toBe(LogLevel.Warn);
      expect(history[0].level).toBe(LogLevel.Error);
    });

    it('should store timestamp in history', () => {
      const beforeTime = new Date();
      service.info('Test');
      const afterTime = new Date();

      const history = service.getHistory();

      expect(history[0].timestamp).toBeInstanceOf(Date);
      expect(history[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeTime.getTime()
      );
      expect(history[0].timestamp.getTime()).toBeLessThanOrEqual(
        afterTime.getTime()
      );
    });

    it('should store context in history', () => {
      const logger = service.createLogger('TestContext');
      logger.info('Test message');

      const history = service.getHistory();

      expect(history[0].context).toBe('TestContext');
    });

    it('should store additional data in history', () => {
      service.info('Test', { foo: 'bar' }, [1, 2, 3]);

      const history = service.getHistory();

      expect(history[0].data).toEqual([{ foo: 'bar' }, [1, 2, 3]]);
    });
  });

  describe('Additional Data Logging', () => {
    it('should log additional data with debug', () => {
      service.debug('Test', { key: 'value' }, [1, 2, 3]);

      expect(consoleDebugSpy).toHaveBeenCalled();
      const args = consoleDebugSpy.mock.calls[0];
      // First arg is the formatted message, rest are data
      expect(args[0]).toContain('Test');
      expect(args[1]).toEqual({ key: 'value' });
      expect(args[2]).toEqual([1, 2, 3]);
    });

    it('should log additional data with info', () => {
      service.info('Test', { data: 123 });

      expect(consoleInfoSpy).toHaveBeenCalled();
      const args = consoleInfoSpy.mock.calls[0];
      expect(args[0]).toContain('Test');
      expect(args[1]).toEqual({ data: 123 });
    });

    it('should log additional data with warn', () => {
      service.warn('Warning', 'extra', 'data');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const args = consoleWarnSpy.mock.calls[0];
      expect(args[0]).toContain('Warning');
      expect(args[1]).toBe('extra');
      expect(args[2]).toBe('data');
    });

    it('should log error with additional data', () => {
      const error = new Error('Test');
      service.error('Error occurred', error, 'extra data');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const args = consoleErrorSpy.mock.calls[0];
      expect(args[0]).toContain('Error occurred');
      expect(args[1]).toBe(error);
      expect(args[2]).toBe('extra data');
    });
  });

  describe('Message Formatting', () => {
    it('should include prefix in message', () => {
      service.configure({ prefix: 'APP' });
      service.info('Test');

      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('[APP]');
    });

    it('should include timestamp when enabled', () => {
      service.configure({ showTimestamp: true });
      service.info('Test');

      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/);
    });

    it('should include context when enabled', () => {
      service.configure({ showContext: true });
      const logger = service.createLogger('Context');
      logger.info('Test');

      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('[Context]');
    });

    it('should format with all options', () => {
      service.configure({
        prefix: 'APP',
        showTimestamp: true,
        showContext: true,
      });

      const logger = service.createLogger('Component');
      logger.info('Message');

      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('[APP]');
      expect(call).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/);
      expect(call).toContain('[Component]');
      expect(call).toContain('Message');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty messages', () => {
      service.info('');

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should handle very long messages', () => {
      const longMessage = 'x'.repeat(10000);
      service.info(longMessage);

      expect(consoleInfoSpy).toHaveBeenCalled();
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain(longMessage);
    });

    it('should handle special characters in messages', () => {
      service.info('Message with\nnewline\tand\ttabs');

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should handle null as additional data', () => {
      service.info('Test', null);

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should handle undefined as additional data', () => {
      service.info('Test', undefined);

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should handle circular references in data', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;

      // Should not throw
      expect(() => {
        service.info('Circular', obj);
      }).not.toThrow();
    });
  });
});
