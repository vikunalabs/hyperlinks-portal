import '@vikunalabs/ui-library';
import './pages'; // Register all page components
import { router } from './router';
import { useAuthStore } from './stores/auth-store';
import { config } from './config';

class AppInitializer {
  private authStore = useAuthStore;

  async initialize() {
    try {
      if (config.app.debug) {
        console.log('[App] Initializing application...', {
          environment: config.environment,
          authServer: config.authServer.baseUrl,
          resourceServer: config.resourceServer.baseUrl
        });
      }

      // Show loading state
      this.showLoading();

      // Try to restore authentication state
      await this.restoreAuthState();

      // Set up authentication guard for router
      this.setupAuthGuard();

      // Start the router
      router.start();

      if (config.app.debug) {
        console.log('[App] Application initialized successfully');
      }

    } catch (error) {
      console.error('[App] Failed to initialize application:', error);
      this.showError(error instanceof Error ? error.message : 'Failed to initialize application');
    }
  }

  private async restoreAuthState() {
    try {
      // Check if we have a valid session by trying to refresh the token
      const isAuthenticated = await this.authStore.getState().refreshToken();
      
      if (config.app.debug) {
        console.log('[App] Auth state restored:', isAuthenticated ? 'authenticated' : 'not authenticated');
      }
    } catch (error) {
      // It's okay if token refresh fails - user just needs to login
      if (config.app.debug) {
        console.log('[App] No existing session found, user needs to login');
      }
    }
  }

  private setupAuthGuard() {
    router.addGuard((to) => {
      const isAuthenticated = this.authStore.getState().isAuthenticated();
      
      // If route requires auth but user is not authenticated
      if (to.requiresAuth && !isAuthenticated) {
        if (config.app.debug) {
          console.log('[App] Route requires authentication, redirecting to login');
        }
        router.navigate('/login');
        return false;
      }

      // If user is authenticated and trying to access auth pages, redirect to dashboard
      if (isAuthenticated && ['/login', '/register', '/forgot-password'].includes(to.path)) {
        if (config.app.debug) {
          console.log('[App] User already authenticated, redirecting to dashboard');
        }
        router.navigate('/dashboard');
        return false;
      }

      return true;
    });
  }

  private showLoading() {
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem;">
          <ui-spinner size="large"></ui-spinner>
          <p>Initializing ${config.app.name}...</p>
        </div>
      `;
    }
  }

  private showError(message: string) {
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem; padding: 2rem; text-align: center;">
          <h1 style="color: var(--error, #dc3545); margin: 0;">Initialization Failed</h1>
          <p style="color: var(--text-secondary, #6c757d); margin: 0;">${message}</p>
          <ui-button variant="primary" onclick="window.location.reload()">
            Try Again
          </ui-button>
        </div>
      `;
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const initializer = new AppInitializer();
  initializer.initialize();
});

// Set document title
document.title = config.app.name;