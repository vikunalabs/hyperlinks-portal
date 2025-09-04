/**
 * Global error handler for production applications
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: Error[] = [];
  private maxErrors = 10;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(`Unhandled promise rejection: ${event.reason}`));
      event.preventDefault(); // Prevent console error
    });

    // Handle custom component errors
    window.addEventListener('lit-component-error', ((event: CustomEvent) => {
      this.handleError(event.detail.error, {
        component: event.detail.component,
        method: event.detail.method
      });
    }) as EventListener);
  }

  handleError(error: Error, context?: Record<string, any>): void {
    console.error('Error caught by ErrorHandler:', error, context);

    // Add to error queue
    this.errorQueue.push(error);
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(error, context);
    }
  }

  private sendToErrorService(error: Error, context?: Record<string, any>): void {
    // Implementation for error tracking service (e.g., Sentry, LogRocket)
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };

    // Send to your error tracking service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(() => {
      // Silently fail if error reporting fails
    });
  }

  getRecentErrors(): Error[] {
    return [...this.errorQueue];
  }

  clearErrors(): void {
    this.errorQueue = [];
  }
}

// Initialize error handler
ErrorHandler.getInstance();