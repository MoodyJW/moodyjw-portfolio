/* eslint-disable no-undef */
import { Injectable, isDevMode } from '@angular/core';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  None = 4,
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /** Minimum log level to display */
  level?: LogLevel;
  /** Whether to include timestamps */
  showTimestamp?: boolean;
  /** Whether to include source context */
  showContext?: boolean;
  /** Custom prefix for all logs */
  prefix?: string;
}

/**
 * Log entry structure
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Timestamp */
  timestamp: Date;
  /** Optional context/source */
  context?: string;
  /** Optional additional data */
  data?: unknown[];
}

/**
 * Performance timing entry
 */
export interface PerformanceEntry {
  /** Label for the timing */
  label: string;
  /** Start time in milliseconds */
  startTime: number;
  /** End time in milliseconds */
  endTime?: number;
  /** Duration in milliseconds */
  duration?: number;
}

/**
 * Structured logging service with configurable log levels and console abstraction
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private logger = inject(LoggerService);
 *
 *   ngOnInit() {
 *     this.logger.info('Component initialized');
 *     this.logger.debug('Debug data:', this.data);
 *
 *     this.logger.startTimer('data-load');
 *     await this.loadData();
 *     this.logger.endTimer('data-load');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /** Current log level */
  private currentLevel: LogLevel = isDevMode() ? LogLevel.Debug : LogLevel.Warn;

  /** Configuration options */
  private config: Required<LoggerConfig> = {
    level: this.currentLevel,
    showTimestamp: true,
    showContext: true,
    prefix: '',
  };

  /** Performance timers */
  private timers = new Map<string, PerformanceEntry>();

  /** Log history (only in development) */
  private history: LogEntry[] = [];

  /** Maximum history size */
  private readonly MAX_HISTORY = 100;

  /**
   * Configure the logger
   * @param config - Logger configuration options
   */
  configure(config: LoggerConfig): void {
    this.config = {
      ...this.config,
      ...config,
    };

    if (config.level !== undefined) {
      this.currentLevel = config.level;
    }
  }

  /**
   * Set the minimum log level
   * @param level - Minimum log level to display
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
    this.config.level = level;
  }

  /**
   * Log a debug message (only in development)
   * @param message - Message to log
   * @param data - Additional data to log
   */
  debug(message: string, ...data: unknown[]): void {
    this.log(LogLevel.Debug, message, data);
  }

  /**
   * Log an info message
   * @param message - Message to log
   * @param data - Additional data to log
   */
  info(message: string, ...data: unknown[]): void {
    this.log(LogLevel.Info, message, data);
  }

  /**
   * Log a warning message
   * @param message - Message to log
   * @param data - Additional data to log
   */
  warn(message: string, ...data: unknown[]): void {
    this.log(LogLevel.Warn, message, data);
  }

  /**
   * Log an error message
   * @param message - Message to log
   * @param error - Error object or additional data
   */
  error(message: string, error?: Error | unknown, ...data: unknown[]): void {
    const allData = error ? [error, ...data] : data;
    this.log(LogLevel.Error, message, allData);
  }

  /**
   * Create a logger instance with a specific context
   * @param context - Context/source identifier
   * @returns Logger function bound to the context
   */
  createLogger(context: string) {
    return {
      debug: (message: string, ...data: unknown[]) =>
        this.logWithContext(LogLevel.Debug, context, message, data),
      info: (message: string, ...data: unknown[]) =>
        this.logWithContext(LogLevel.Info, context, message, data),
      warn: (message: string, ...data: unknown[]) =>
        this.logWithContext(LogLevel.Warn, context, message, data),
      error: (message: string, error?: Error | unknown, ...data: unknown[]) => {
        const allData = error ? [error, ...data] : data;
        this.logWithContext(LogLevel.Error, context, message, allData);
      },
    };
  }

  /**
   * Start a performance timer
   * @param label - Timer label
   */
  startTimer(label: string): void {
    this.timers.set(label, {
      label,
      startTime: performance.now(),
    });

    if (this.shouldLog(LogLevel.Debug)) {
      this.debug(`⏱️ Timer started: ${label}`);
    }
  }

  /**
   * End a performance timer and log the duration
   * @param label - Timer label
   * @returns Duration in milliseconds or undefined if timer not found
   */
  endTimer(label: string): number | undefined {
    const timer = this.timers.get(label);

    if (!timer) {
      this.warn(`Timer "${label}" not found`);
      return undefined;
    }

    const endTime = performance.now();
    const duration = endTime - timer.startTime;

    timer.endTime = endTime;
    timer.duration = duration;

    this.timers.delete(label);

    if (this.shouldLog(LogLevel.Info)) {
      this.info(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Measure the execution time of an async operation
   * @param label - Timer label
   * @param operation - Async operation to measure
   * @returns Result of the operation
   */
  async measure<T>(label: string, operation: () => Promise<T>): Promise<T> {
    this.startTimer(label);
    try {
      return await operation();
    } finally {
      this.endTimer(label);
    }
  }

  /**
   * Group related log messages
   * @param label - Group label
   * @param collapsed - Whether to start collapsed (default: false)
   */
  group(label: string, collapsed = false): void {
    if (this.shouldLog(LogLevel.Debug)) {
      if (collapsed) {
        console.groupCollapsed(this.formatMessage(label));
      } else {
        console.group(this.formatMessage(label));
      }
    }
  }

  /**
   * End the current log group
   */
  groupEnd(): void {
    if (this.shouldLog(LogLevel.Debug)) {
      console.groupEnd();
    }
  }

  /**
   * Log a table (useful for arrays of objects)
   * @param data - Data to display as a table
   * @param columns - Optional column names to display
   */
  table(data: unknown, columns?: string[]): void {
    if (this.shouldLog(LogLevel.Debug)) {
      if (columns) {
        console.table(data, columns);
      } else {
        console.table(data);
      }
    }
  }

  /**
   * Assert a condition and log an error if false
   * @param condition - Condition to assert
   * @param message - Error message if assertion fails
   */
  assert(condition: boolean, message: string): void {
    if (!condition) {
      this.error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Clear the console (only in development)
   */
  clear(): void {
    if (isDevMode()) {
      console.clear();
      this.history = [];
    }
  }

  /**
   * Get log history (only available in development)
   * @returns Array of log entries
   */
  getHistory(): LogEntry[] {
    return [...this.history];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Get all active timers
   * @returns Map of active performance timers
   */
  getActiveTimers(): Map<string, PerformanceEntry> {
    return new Map(this.timers);
  }

  /**
   * Core logging method
   * @param level - Log level
   * @param message - Message to log
   * @param data - Additional data
   * @param context - Optional context
   */
  private log(
    level: LogLevel,
    message: string,
    data: unknown[],
    context?: string
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data,
    };

    // Store in history (only in development)
    if (isDevMode()) {
      this.storeInHistory(entry);
    }

    // Format and output to console
    this.outputToConsole(entry);
  }

  /**
   * Log with a specific context
   * @param level - Log level
   * @param context - Context identifier
   * @param message - Message to log
   * @param data - Additional data
   */
  private logWithContext(
    level: LogLevel,
    context: string,
    message: string,
    data: unknown[]
  ): void {
    this.log(level, message, data, context);
  }

  /**
   * Check if a log level should be displayed
   * @param level - Log level to check
   * @returns True if should log
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  /**
   * Output log entry to console
   * @param entry - Log entry to output
   */
  private outputToConsole(entry: LogEntry): void {
    const formattedMessage = this.formatMessage(
      entry.message,
      entry.context,
      entry.timestamp
    );

    switch (entry.level) {
      case LogLevel.Debug:
        if (entry.data && entry.data.length > 0) {
          console.debug(formattedMessage, ...entry.data);
        } else {
          console.debug(formattedMessage);
        }
        break;

      case LogLevel.Info:
        if (entry.data && entry.data.length > 0) {
          console.info(formattedMessage, ...entry.data);
        } else {
          console.info(formattedMessage);
        }
        break;

      case LogLevel.Warn:
        if (entry.data && entry.data.length > 0) {
          console.warn(formattedMessage, ...entry.data);
        } else {
          console.warn(formattedMessage);
        }
        break;

      case LogLevel.Error:
        if (entry.data && entry.data.length > 0) {
          console.error(formattedMessage, ...entry.data);
        } else {
          console.error(formattedMessage);
        }
        break;
    }
  }

  /**
   * Format log message with optional timestamp and context
   * @param message - Message to format
   * @param context - Optional context
   * @param timestamp - Optional timestamp
   * @returns Formatted message
   */
  private formatMessage(
    message: string,
    context?: string,
    timestamp?: Date
  ): string {
    const parts: string[] = [];

    // Add prefix if configured
    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }

    // Add timestamp if enabled
    if (this.config.showTimestamp && timestamp) {
      parts.push(`[${this.formatTimestamp(timestamp)}]`);
    }

    // Add context if available and enabled
    if (this.config.showContext && context) {
      parts.push(`[${context}]`);
    }

    // Add message
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Format timestamp for display
   * @param timestamp - Date to format
   * @returns Formatted timestamp string
   */
  private formatTimestamp(timestamp: Date): string {
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const seconds = timestamp.getSeconds().toString().padStart(2, '0');
    const ms = timestamp.getMilliseconds().toString().padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * Get console style for log level (currently unused, reserved for future styled logging)
   * @param level - Log level
   * @returns CSS style string
   */
  private getLogStyle(_level: LogLevel): string {
    // Reserved for future use with styled console logging
    return '';
  }

  /**
   * Store log entry in history
   * @param entry - Log entry to store
   */
  private storeInHistory(entry: LogEntry): void {
    this.history.unshift(entry);

    // Limit history size
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(0, this.MAX_HISTORY);
    }
  }
}
