/* eslint-disable no-console */

/**
 * Production-safe logging utility following Silicon Valley best practices
 *
 * Features:
 * - Development-only console logging
 * - Structured log levels (debug, info, warn, error)
 * - User-facing toast notifications for important events
 * - Performance monitoring hooks
 * - Error tracking integration points
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

export interface Logger {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, error?: Error, context?: LogContext) => void;
  success: (message: string, context?: LogContext) => void;
  performance: (label: string, duration: number, context?: LogContext) => void;
}

/**
 * Development-only console logger
 * Logs are automatically stripped from production builds
 */
class ConsoleLogger implements Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private sendToErrorTracking(_message: string, _error?: Error, _context?: LogContext): void {
    // TODO: Integrate with Sentry, Highlight.io, or custom endpoint
    // NOTE: Remove console fallback in error() method when this is implemented
    // Example implementations:
    // For Sentry:
    // Sentry.captureException(error || new Error(message), {
    //   tags: { component: context?.component },
    //   extra: context
    // });
    // For custom endpoint:
    // fetch('/api/log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     level: 'error',
    //     message,
    //     error: error?.message,
    //     stack: error?.stack,
    //     context,
    //     timestamp: new Date().toISOString()
    //   })
    // }).catch(() => {}); // Fail silently to avoid logging loops
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`🔍 ${this.formatMessage('debug', message, context)}`);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`ℹ️ ${this.formatMessage('info', message, context)}`);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`⚠️ ${this.formatMessage('warn', message, context)}`);
    }
    // In production, you might want to send warnings to monitoring service
    // Example: sendToMonitoring('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };

    if (this.isDevelopment) {
      console.error(`❌ ${this.formatMessage('error', message, errorContext)}`);
      if (error) {
        console.error('Stack trace:', error);
      }
    }

    if (!this.isDevelopment) {
      // Send to error tracking service
      this.sendToErrorTracking(message, error, errorContext);

      // Fallback: Log to console until error tracking is implemented
      // This ensures errors are never silently lost in production
      console.error(`🚨 [PRODUCTION ERROR] ${this.formatMessage('error', message, errorContext)}`);
      if (error) {
        console.error('Stack trace:', error);
      }
    }
  }

  success(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`✅ ${this.formatMessage('info', message, context)}`);
    }
  }

  performance(label: string, duration: number, context?: LogContext): void {
    const perfContext = { ...context, duration: `${duration}ms` };

    if (this.isDevelopment) {
      console.log(`⚡ Performance: ${label} took ${duration}ms`, perfContext);
    }

    // In production, send to performance monitoring
    // Example: sendToPerformanceMonitoring(label, duration, context);
  }
}

/**
 * Toast notification utility for user-facing messages
 * This is a placeholder - integrate with your actual toast library
 */
export const toast = {
  success: (message: string) => {
    // TODO: Integrate with actual toast library (react-hot-toast, sonner, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎉 Toast Success: ${message}`);
    }
    // Example: toast.success(message);
  },

  error: (message: string) => {
    // TODO: Integrate with actual toast library
    if (process.env.NODE_ENV === 'development') {
      console.log(`💥 Toast Error: ${message}`);
    }
    // Example: toast.error(message);
  },

  info: (message: string) => {
    // TODO: Integrate with actual toast library
    if (process.env.NODE_ENV === 'development') {
      console.log(`💡 Toast Info: ${message}`);
    }
    // Example: toast.info(message);
  },

  loading: (message: string) => {
    // TODO: Integrate with actual toast library
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏳ Toast Loading: ${message}`);
    }
    // Example: return toast.loading(message);
    return null;
  },
};

/**
 * Performance measurement utility
 */
export class PerformanceTracker {
  private startTimes = new Map<string, number>();

  start(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  end(label: string, context?: LogContext): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      logger.warn(`Performance tracker: No start time found for "${label}"`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.startTimes.delete(label);

    logger.performance(label, duration, context);
    return duration;
  }

  measure<T>(label: string, fn: () => T, context?: LogContext): T {
    this.start(label);
    try {
      const result = fn();
      this.end(label, context);
      return result;
    } catch (error) {
      this.end(label, { ...context, error: true });
      throw error;
    }
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>, context?: LogContext): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label, context);
      return result;
    } catch (error) {
      this.end(label, { ...context, error: true });
      throw error;
    }
  }
}

// Global logger instance
export const logger = new ConsoleLogger();

// Global performance tracker
export const perf = new PerformanceTracker();

/**
 * Throws an error with the provided message if the condition is false in development mode.
 *
 * In development environments, this function enforces assertions by throwing an error and logging it when the condition is not met. In production, it has no effect.
 *
 * @param condition - The boolean expression to assert
 * @param message - The error message to display if the assertion fails
 */
export function devAssert(condition: boolean, message: string): asserts condition {
  if (process.env.NODE_ENV === 'development' && !condition) {
    logger.error(`Assertion failed: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Creates a logger instance scoped to a specific component, automatically including the component name in all log entries.
 *
 * @param componentName - The name of the component to associate with all log messages
 * @returns An object with logging methods (`debug`, `info`, `warn`, `error`, `success`) that prepend the component context to each log entry
 */
export function createComponentLogger(componentName: string) {
  return {
    debug: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.debug(message, { component: componentName, ...context }),
    info: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.info(message, { component: componentName, ...context }),
    warn: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.warn(message, { component: componentName, ...context }),
    error: (message: string, error?: Error, context?: Omit<LogContext, 'component'>) =>
      logger.error(message, error, { component: componentName, ...context }),
    success: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.success(message, { component: componentName, ...context }),
  };
}

/**
 * Creates a logger instance scoped to a specific feature, automatically including the feature name in all log contexts.
 *
 * @param featureName - The name of the feature to associate with all log entries
 * @returns An object with logging methods (`debug`, `info`, `warn`, `error`, `success`) that prepend the feature context to each log
 */
export function createFeatureLogger(featureName: string) {
  return {
    debug: (message: string, context?: Omit<LogContext, 'feature'>) =>
      logger.debug(message, { feature: featureName, ...context }),
    info: (message: string, context?: Omit<LogContext, 'feature'>) =>
      logger.info(message, { feature: featureName, ...context }),
    warn: (message: string, context?: Omit<LogContext, 'feature'>) =>
      logger.warn(message, { feature: featureName, ...context }),
    error: (message: string, error?: Error, context?: Omit<LogContext, 'feature'>) =>
      logger.error(message, error, { feature: featureName, ...context }),
    success: (message: string, context?: Omit<LogContext, 'feature'>) =>
      logger.success(message, { feature: featureName, ...context }),
  };
}

// Chat-specific logger for domain insights
export const chatLogger = createFeatureLogger('Chat');
