/**
 * Performance monitoring utilities for production applications
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  private constructor() {
    this.setupPerformanceObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupPerformanceObservers(): void {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.set('lcp', entry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number }; // Type assertion for FID entry
          if (fidEntry.processingStart) {
            this.metrics.set('fid', fidEntry.processingStart - entry.startTime);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }; // Type assertion for CLS entry
          if (!clsEntry.hadRecentInput && clsEntry.value !== undefined) {
            clsValue += clsEntry.value;
          }
        }
        this.metrics.set('cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  markStart(name: string): void {
    performance.mark(`${name}-start`);
  }

  markEnd(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure ? measure.duration : 0;
    
    this.metrics.set(name, duration);
    
    // Clean up marks
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  reportWebVitals(): void {
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => {
        const vitals = {
          lcp: this.metrics.get('lcp'),
          fid: this.metrics.get('fid'),
          cls: this.metrics.get('cls'),
          timestamp: new Date().toISOString(),
          url: window.location.href
        };

        // Send to analytics service
        fetch('/api/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vitals)
        }).catch(() => {
          // Silently fail if reporting fails
        });
      }, 2000);
    }
  }
}

/**
 * Performance decorator for measuring method execution time
 */
export function measurePerformance(name?: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const measureName = name || `${(target as any).constructor.name}.${propertyKey}`;
    
    descriptor.value = function (...args: unknown[]) {
      const monitor = PerformanceMonitor.getInstance();
      monitor.markStart(measureName);
      
      try {
        const result = originalMethod.apply(this, args);
        
        // Handle async methods
        if (result instanceof Promise) {
          return result.finally(() => {
            monitor.markEnd(measureName);
          });
        } else {
          monitor.markEnd(measureName);
          return result;
        }
      } catch (error) {
        monitor.markEnd(measureName);
        throw error;
      }
    };
    
    return descriptor;
  };
}

// Initialize performance monitor
PerformanceMonitor.getInstance();