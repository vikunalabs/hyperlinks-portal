// Main router implementation with Navigo

import Navigo from 'navigo';
import { routes, ROUTES, type RouteConfig } from './routes';
import { authStore } from '../stores/auth.store';
import { appStore } from '../stores/app.store';
import { AuthGuard, routeGuards } from './auth-guard';

export class AppRouter {
  private router: Navigo;
  private isInitialized = false;

  constructor() {
    this.router = new Navigo('/', { 
      hash: false,
      strategy: 'ONE'
    });
  }

  /**
   * Initialize router and set up all routes
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      console.warn('[Router] Already initialized');
      return;
    }

    // Initialize authentication check first
    await AuthGuard.initializeAuth();

    this.setupRoutes();
    this.setupNotFoundHandler();
    this.router.resolve();
    
    this.isInitialized = true;
    console.log('[Router] Initialized with', routes.length, 'routes');
  }

  /**
   * Navigate to a specific route
   */
  public navigate(path: string): void {
    this.router.navigate(path);
  }

  /**
   * Get current route path
   */
  public getCurrentPath(): string {
    return this.router.getCurrentLocation().url;
  }

  /**
   * Check if current route is protected
   */
  public isCurrentRouteProtected(): boolean {
    const currentPath = this.getCurrentPath();
    const route = routes.find(r => r.path === currentPath || this.matchesRoutePattern(currentPath, r.path));
    return route?.protected ?? false;
  }

  /**
   * Check if user is currently authenticated (public utility)
   */
  public isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }

  private setupRoutes(): void {
    routes.forEach(route => {
      this.router.on(route.path, async (match: any) => {
        await this.handleRoute(route, match?.data);
      });
    });
  }

  private setupNotFoundHandler(): void {
    this.router.notFound(() => {
      console.log('[Router] Route not found, redirecting to login');
      // Redirect to login for unknown routes
      this.navigate(ROUTES.LOGIN);
    });
  }

  private async handleRoute(route: RouteConfig, params?: any): Promise<void> {
    console.log(`[Router] Handling route: ${route.path}`, { protected: route.protected, params });

    // Set page title if provided
    if (route.title) {
      document.title = `${route.title} - Hyperlinks Management Platform`;
    }

    // Apply route guards
    let guardResult;
    
    if (route.protected) {
      guardResult = routeGuards.protected();
    } else {
      // Check if authenticated user should be redirected from auth pages
      const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD];
      if (authRoutes.includes(route.path as any)) {
        guardResult = routeGuards.auth();
      } else {
        // Allow access to confirmation and other public pages
        guardResult = routeGuards.confirmation();
      }
    }

    // Execute guard and handle redirection
    const canActivate = await AuthGuard.executeGuard(guardResult);
    if (!canActivate) {
      return; // Guard handled the redirection
    }

    // Execute route handler with parameters
    try {
      route.handler(params);
    } catch (error) {
      console.error('[Router] Error executing route handler:', error);
      appStore.getState().showNotification({
        type: 'error',
        message: 'Failed to load page',
        duration: 5000
      });
    }
  }

  /**
   * Check if user is currently authenticated
   * Reserved for future use in router utilities
   */
  private isAuthenticated(): boolean {
    return authStore.getState().isAuthenticated;
  }

  private matchesRoutePattern(path: string, pattern: string): boolean {
    // Simple pattern matching for routes with parameters (e.g., /reset-password/:token)
    const patternRegex = pattern.replace(/:([^/]+)/g, '([^/]+)');
    const regex = new RegExp(`^${patternRegex}$`);
    return regex.test(path);
  }

  /**
   * Destroy router instance
   */
  public destroy(): void {
    if (this.router) {
      this.router.destroy();
      this.isInitialized = false;
    }
  }
}

// Singleton router instance
export const appRouter = new AppRouter();

// Export routes and router utilities
export { ROUTES } from './routes';
export type { RouteConfig } from './routes';