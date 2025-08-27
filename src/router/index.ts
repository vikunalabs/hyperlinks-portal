import Navigo from 'navigo';
import type { RouteConfig } from './routes';
import { routes } from './routes';
import { config } from '../config';

export type NavigationGuard = (to: RouteConfig, from?: RouteConfig) => boolean | Promise<boolean>;

class RouterManager {
  private router: Navigo;
  private currentRoute: RouteConfig | null = null;
  private guards: NavigationGuard[] = [];

  constructor() {
    this.router = new Navigo('/', { hash: false });
    this.setupRoutes();
  }

  private setupRoutes(): void {
    routes.forEach(route => {
      if (route.path === '*') {
        // Handle catch-all route
        this.router.notFound(() => {
          this.handleRouteChange(route);
        });
      } else {
        this.router.on(route.path, () => {
          this.handleRouteChange(route);
        });
      }
    });
  }

  private async handleRouteChange(route: RouteConfig): Promise<void> {
    try {
      // Run navigation guards
      for (const guard of this.guards) {
        const canProceed = await guard(route, this.currentRoute || undefined);
        if (!canProceed) {
          return; // Navigation blocked
        }
      }

      // Update current route
      const previousRoute = this.currentRoute;
      this.currentRoute = route;

      // Update document title
      if (route.title) {
        document.title = `${route.title} | ${config.app.name}`;
      }

      // Log navigation in development
      if (config.app.debug) {
        console.log(`[Router] Navigating from ${previousRoute?.path || 'none'} to ${route.path}`);
      }

      // Load and render the component
      await this.loadComponent(route);

    } catch (error) {
      console.error('[Router] Navigation error:', error);
      this.handleNavigationError(error);
    }
  }

  private async loadComponent(route: RouteConfig): Promise<void> {
    const appContainer = document.querySelector('#app');
    if (!appContainer) {
      throw new Error('App container not found');
    }

    // Clear current content
    appContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    `;

    try {
      // Create and append the component
      const component = document.createElement(route.component);
      
      // Pass route parameters as attributes if they exist
      const resolved = this.router.lastResolved();
      const params = resolved && resolved.length > 0 ? resolved[0].params : null;
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          component.setAttribute(`data-${key}`, value as string);
        });
      }

      // Clear loading and add component
      appContainer.innerHTML = '';
      appContainer.appendChild(component);

    } catch (error) {
      console.error(`[Router] Failed to load component ${route.component}:`, error);
      this.showErrorPage('Component failed to load');
    }
  }

  private handleNavigationError(error: any): void {
    console.error('[Router] Navigation error:', error);
    this.showErrorPage('Navigation failed');
  }

  private showErrorPage(message: string): void {
    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="error-container">
          <h1>Oops! Something went wrong</h1>
          <p>${message}</p>
          <button onclick="window.location.reload()">Refresh Page</button>
        </div>
      `;
    }
  }

  public addGuard(guard: NavigationGuard): void {
    this.guards.push(guard);
  }

  public removeGuard(guard: NavigationGuard): void {
    const index = this.guards.indexOf(guard);
    if (index > -1) {
      this.guards.splice(index, 1);
    }
  }

  public navigate(path: string, options?: { title?: string; data?: any }): void {
    this.router.navigate(path, options);
  }

  public getCurrentRoute(): RouteConfig | null {
    return this.currentRoute;
  }

  public getParams(): Record<string, string> | null {
    const resolved = this.router.lastResolved();
    return resolved && resolved.length > 0 ? resolved[0].params : null;
  }

  public getQuery(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  public start(): void {
    this.router.resolve();
  }

  public destroy(): void {
    this.router.destroy();
  }

  // Utility methods for common navigation patterns
  public goToLogin(): void {
    this.navigate('/login');
  }

  public goToDashboard(): void {
    this.navigate('/dashboard');
  }

  public goBack(): void {
    window.history.back();
  }

  public refresh(): void {
    window.location.reload();
  }
}

// Export singleton instance
export const router = new RouterManager();

// Export types and routes
export type { RouteConfig };
export { routes };