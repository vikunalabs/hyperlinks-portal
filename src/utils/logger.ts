/**
 * Production-safe logging utility
 * Automatically handles environment-based logging
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  [key: string]: unknown;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log general information (hidden in production)
   */
  log(message: string, data?: unknown, context?: LogContext): void {
    if (!this.isProduction) {
      this.logWithContext('log', message, data, context);
    }
  }

  /**
   * Log development-only information
   */
  debug(message: string, data?: unknown, context?: LogContext): void {
    if (this.isDevelopment) {
      this.logWithContext('debug', message, data, context);
    }
  }

  /**
   * Log information (shown in all environments)
   */
  info(message: string, data?: unknown, context?: LogContext): void {
    this.logWithContext('info', message, data, context);
  }

  /**
   * Log warnings (shown in all environments)
   */
  warn(message: string, data?: unknown, context?: LogContext): void {
    this.logWithContext('warn', message, data, context);
  }

  /**
   * Log errors (shown in all environments)
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.logWithContext('error', message, error, context);
    
    // In production, send to error reporting service
    if (this.isProduction) {
      this.sendToErrorReporting(message, error, context);
    }
  }

  /**
   * Log user actions for analytics (production-safe)
   */
  analytics(event: string, data?: unknown, context?: LogContext): void {
    const analyticsData = {
      event,
      timestamp: new Date().toISOString(),
      ...context,
      data
    };

    if (this.isProduction) {
      // Send to analytics service (e.g., Google Analytics, Mixpanel)
      this.sendToAnalytics(analyticsData);
    } else {
      console.log('📊 Analytics:', analyticsData);
    }
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, context?: LogContext): void {
    const perfData = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      ...context
    };

    if (this.isProduction) {
      // Send to performance monitoring (e.g., Web Vitals)
      this.sendToPerformanceMonitoring(perfData);
    } else {
      console.log('⚡ Performance:', perfData);
    }
  }

  private logWithContext(
    level: LogLevel, 
    message: string, 
    data?: unknown, 
    context?: LogContext
  ): void {
    // Use appropriate console method
    const consoleMethod = console[level] || console.log;
    
    if (context?.component) {
      consoleMethod(`[${context.component}] ${message}`, data || '');
    } else {
      consoleMethod(message, data || '');
    }
  }

  private sendToErrorReporting(message: string, error?: unknown, context?: LogContext): void {
    // Integrate with error reporting service (Sentry, Rollbar, etc.)
    // Example: Sentry.captureException(error, { tags: context });
    
    // For now, store in session storage for debugging
    try {
      const errorLog = {
        message,
        error: (error as Error)?.message || String(error),
        stack: (error as Error)?.stack,
        context,
        timestamp: new Date().toISOString()
      };
      
      const existingLogs = sessionStorage.getItem('error_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(errorLog);
      
      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      sessionStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (storageError) {
      // Silently fail if storage is not available
    }
  }

  private sendToAnalytics(_data: unknown): void {
    // Integrate with analytics service
    // Example: gtag('event', _data.event, _data);
    // For now, use a placeholder
  }

  private sendToPerformanceMonitoring(_data: unknown): void {
    // Integrate with performance monitoring
    // Example: Send to Web Vitals, DataDog, etc.
    // For now, use a placeholder
  }

  /**
   * Get stored error logs (useful for debugging)
   */
  getErrorLogs(): unknown[] {
    try {
      const logs = sessionStorage.getItem('error_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear stored error logs
   */
  clearErrorLogs(): void {
    try {
      sessionStorage.removeItem('error_logs');
    } catch {
      // Silently fail
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };