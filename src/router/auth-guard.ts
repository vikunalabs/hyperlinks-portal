// Authentication guard utilities for route protection

import { authStore } from '../stores/auth.store';
import { appStore } from '../stores/app.store';
import { appRouter, ROUTES } from './index';
import { logger } from '../utils/logger';

export interface GuardResult {
  canActivate: boolean;
  redirectTo?: string;
  reason?: string;
}

export class AuthGuard {
  /**
   * Check if user can access a protected route
   */
  static canActivateProtected(): GuardResult {
    const { isAuthenticated, isLoading } = authStore.getState();

    // If still loading auth state, allow but may redirect later
    if (isLoading) {
      return { canActivate: true };
    }

    if (!isAuthenticated) {
      return {
        canActivate: false,
        redirectTo: ROUTES.LOGIN,
        reason: 'Authentication required'
      };
    }

    return { canActivate: true };
  }

  /**
   * Check if authenticated user should be redirected from auth pages
   */
  static canActivateAuth(): GuardResult {
    const { isAuthenticated } = authStore.getState();

    if (isAuthenticated) {
      return {
        canActivate: false,
        redirectTo: ROUTES.HOME,
        reason: 'Already authenticated'
      };
    }

    return { canActivate: true };
  }

  /**
   * Check if user can access account confirmation routes
   */
  static canActivateConfirmation(): GuardResult {
    // Account confirmation pages should always be accessible
    // even for authenticated users (in case they need to confirm additional emails)
    return { canActivate: true };
  }

  /**
   * Execute guard and handle redirection
   */
  static async executeGuard(guardResult: GuardResult): Promise<boolean> {
    if (!guardResult.canActivate && guardResult.redirectTo) {
      logger.debug(`[AuthGuard] Access denied: ${guardResult.reason}, redirecting to ${guardResult.redirectTo}`, { guardResult }, { component: 'AuthGuard', action: 'access_denied' });
      
      // Show notification if reason provided
      if (guardResult.reason) {
        appStore.getState().showNotification({
          type: 'warning',
          message: guardResult.reason,
          duration: 3000
        });
      }

      // Redirect
      appRouter.navigate(guardResult.redirectTo);
      return false;
    }

    return guardResult.canActivate;
  }

  /**
   * Check authentication status and refresh if needed
   */
  static async checkAuthStatus(): Promise<boolean> {
    const { isAuthenticated, isLoading, getCurrentUser } = authStore.getState();

    // If already loading, wait for it to complete
    if (isLoading) {
      return new Promise((resolve) => {
        const unsubscribe = authStore.subscribe((state) => {
          if (!state.isLoading) {
            unsubscribe();
            resolve(state.isAuthenticated);
          }
        });
      });
    }

    // If not authenticated, try to get current user (may have valid cookies)
    if (!isAuthenticated) {
      try {
        await getCurrentUser();
        return authStore.getState().isAuthenticated;
      } catch (error) {
        logger.debug('[AuthGuard] No valid authentication found', null, { component: 'AuthGuard', action: 'auth_not_found' });
        return false;
      }
    }

    return isAuthenticated;
  }

  /**
   * Initialize authentication check on app start
   */
  static async initializeAuth(): Promise<void> {
    logger.debug('[AuthGuard] Initializing authentication check', null, { component: 'AuthGuard', action: 'init_auth_check' });
    
    try {
      await this.checkAuthStatus();
      logger.debug('[AuthGuard] Authentication check completed', null, { component: 'AuthGuard', action: 'auth_check_completed' });
    } catch (error) {
      logger.error('[AuthGuard] Authentication check failed', error, { component: 'AuthGuard', action: 'auth_check_failed' });
    }
  }
}

// Route-specific guard functions
export const routeGuards = {
  protected: () => AuthGuard.canActivateProtected(),
  auth: () => AuthGuard.canActivateAuth(),
  confirmation: () => AuthGuard.canActivateConfirmation()
};