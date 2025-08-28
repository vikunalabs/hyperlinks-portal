import { routes } from './routes';
import type { RouteConfig } from './routes';
import { config } from '../config';

export type NavigationGuard = (to: RouteConfig, from?: RouteConfig) => boolean | Promise<boolean>;

class SimpleRouter {
  private guards: NavigationGuard[] = [];
  private currentRoute: RouteConfig | null = null;

  public addGuard(guard: NavigationGuard): void {
    this.guards.push(guard);
  }

  public async navigate(path: string): Promise<void> {
    // Find matching route
    const route = this.findRoute(path);
    
    if (!route) {
      // Show 404 page
      const notFoundRoute = routes.find(r => r.path === '*');
      if (notFoundRoute) {
        await this.loadRoute(notFoundRoute);
      }
      return;
    }

    await this.loadRoute(route);
  }

  private findRoute(path: string): RouteConfig | null {
    // Try exact match first
    const exactMatch = routes.find(route => route.path === path);
    if (exactMatch) return exactMatch;

    // Try pattern matching for dynamic routes
    for (const route of routes) {
      if (route.path.includes(':')) {
        const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(path)) {
          return route;
        }
      }
    }

    return null;
  }

  private async loadRoute(route: RouteConfig): Promise<void> {
    try {
      // Run navigation guards
      for (const guard of this.guards) {
        const canProceed = await guard(route, this.currentRoute || undefined);
        if (!canProceed) {
          return; // Navigation blocked
        }
      }

      // Update current route
      this.currentRoute = route;

      // Update document title
      if (route.title) {
        document.title = `${route.title} | ${config.app.name}`;
      }

      // Update URL without triggering reload
      if (window.location.pathname !== route.path) {
        window.history.pushState({}, '', route.path);
      }

      // Log navigation in development
      if (config.app.debug) {
        console.log(`[SimpleRouter] Loading route: ${route.path} -> ${route.component}`);
      }

      // Load the component
      await this.loadComponent(route);

    } catch (error) {
      console.error('[SimpleRouter] Navigation error:', error);
      this.showErrorPage('Navigation failed');
    }
  }

  private async loadComponent(route: RouteConfig): Promise<void> {
    const appContainer = document.querySelector('#app');
    if (!appContainer) {
      throw new Error('App container not found');
    }

    try {
      // Create the component element
      const component = document.createElement(route.component);
      
      if (config.app.debug) {
        console.log(`[SimpleRouter] Created component: ${route.component}`);
      }

      // Clear and add component
      appContainer.innerHTML = '';
      appContainer.appendChild(component);

      if (config.app.debug) {
        console.log(`[SimpleRouter] Component rendered successfully`);
      }

    } catch (error) {
      console.error(`[SimpleRouter] Failed to load component ${route.component}:`, error);
      this.showErrorPage(`Failed to load page: ${route.component}`);
    }
  }

  private showErrorPage(message: string): void {
    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem; padding: 2rem; text-align: center;">
          <h1 style="color: #dc3545; margin: 0;">Error</h1>
          <p style="color: #6c757d; margin: 0;">${message}</p>
          <button onclick="window.location.reload()" style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }

  public start(): void {
    // Handle initial route
    const currentPath = window.location.pathname;
    this.navigate(currentPath);

    // Listen for browser navigation (back/forward)
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });

    if (config.app.debug) {
      console.log('[SimpleRouter] Router started, initial path:', currentPath);
    }
  }

  public getCurrentRoute(): RouteConfig | null {
    return this.currentRoute;
  }
}

export const simpleRouter = new SimpleRouter();
export type { RouteConfig };