// Route definitions and configuration
import { logger } from '../utils/logger';

// Global current route reference for handlers
let currentRoute: RouteConfig | null = null;

export function setCurrentRoute(route: RouteConfig | null): void {
  currentRoute = route;
}

export function getCurrentRoute(): RouteConfig | null {
  return currentRoute;
}

export interface RouteConfig {
  path: string;
  handler: () => void;
  protected: boolean;
  layout: 'public' | 'protected';
  title?: string;
}

// Route paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  CONFIRM_ACCOUNT: '/confirm-account/:token',
  RESEND_VERIFICATION: '/resend-verification',
  TERMS: '/terms-of-service',
  PRIVACY: '/privacy-policy'
} as const;

// Route handlers - functions that render page components
const routeHandlers = {
  home: function() {
    logger.debug('[Router] Navigating to Home', null, { component: 'Router', action: 'navigate_home' });
    renderPage('home-content', getCurrentRoute());
  },
  dashboard: async function() {
    logger.debug('[Router] Navigating to Dashboard', null, { component: 'Router', action: 'navigate_dashboard' });
    await loadAndRenderPage('dashboard-page', () => import('../components/pages/protected/dashboard'), getCurrentRoute());
  },
  login: function() {
    logger.debug('[Router] Navigating to Login', null, { component: 'Router', action: 'navigate_login' });
    renderPage('login-page', getCurrentRoute());
  },
  register: function() {
    logger.debug('[Router] Navigating to Register', null, { component: 'Router', action: 'navigate_register' });
    renderPage('register-page', getCurrentRoute());
  },
  forgotPassword: function() {
    logger.debug('[Router] Navigating to Forgot Password', null, { component: 'Router', action: 'navigate_forgot_password' });
    renderPage('forgot-password-page', getCurrentRoute());
  },
  resetPassword: function() {
    logger.debug('[Router] Navigating to Reset Password', null, { component: 'Router', action: 'navigate_reset_password' });
    renderPage('reset-password-page', getCurrentRoute());
  },
  confirmAccount: function() {
    logger.debug('[Router] Navigating to Confirm Account', null, { component: 'Router', action: 'navigate_confirm_account' });
    renderPage('confirm-account-page', getCurrentRoute());
  },
  resendVerification: function() {
    logger.debug('[Router] Navigating to Resend Verification', null, { component: 'Router', action: 'navigate_resend_verification' });
    renderPage('resend-verification-page', getCurrentRoute());
  },
  terms: async function() {
    logger.debug('[Router] Navigating to Terms of Service', null, { component: 'Router', action: 'navigate_terms' });
    await loadAndRenderPage('terms-of-service-page', () => import('../components/pages/public/terms-of-service'), getCurrentRoute());
  },
  privacy: async function() {
    logger.debug('[Router] Navigating to Privacy Policy', null, { component: 'Router', action: 'navigate_privacy' });
    await loadAndRenderPage('privacy-policy-page', () => import('../components/pages/public/privacy-policy'), getCurrentRoute());
  }
};

// Helper function to render a page component
function renderPage(componentTag: string, route?: RouteConfig): void {
  const appContainer = document.querySelector('app-root');
  if (appContainer) {
    // Dispatch a custom event to update the current page
    appContainer.dispatchEvent(new CustomEvent('route-change', {
      detail: { componentTag, route },
      bubbles: true
    }));
  }
}

// Helper function to lazy load and render a page component
async function loadAndRenderPage(componentTag: string, importFn: () => Promise<any>, route?: RouteConfig): Promise<void> {
  try {
    // Show loading state
    const appContainer = document.querySelector('app-root');
    if (appContainer) {
      appContainer.dispatchEvent(new CustomEvent('route-loading', {
        detail: { loading: true },
        bubbles: true
      }));
    }

    // Lazy load the component
    await importFn();
    
    // Render the component
    renderPage(componentTag, route);
  } catch (error) {
    logger.error('[Router] Failed to load page component', error, { component: 'Router', action: 'load_page_error' });
    // Fallback to home page
    const homeRoute = routes.find(r => r.path === '/');
    renderPage('home-content', homeRoute);
  } finally {
    // Hide loading state
    const appContainer = document.querySelector('app-root');
    if (appContainer) {
      appContainer.dispatchEvent(new CustomEvent('route-loading', {
        detail: { loading: false },
        bubbles: true
      }));
    }
  }
}

// Route configuration with protection settings
export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    handler: routeHandlers.home,
    protected: false,
    layout: 'public',
    title: 'Home'
  },
  {
    path: ROUTES.DASHBOARD,
    handler: routeHandlers.dashboard,
    protected: false, // Protected route - requires authentication  
    layout: 'protected',
    title: 'Dashboard'
  },
  {
    path: ROUTES.TERMS,
    handler: routeHandlers.terms,
    protected: false,
    layout: 'public',
    title: 'Terms of Service'
  },
  {
    path: ROUTES.PRIVACY,
    handler: routeHandlers.privacy,
    protected: false,
    layout: 'public',
    title: 'Privacy Policy'
  },
  {
    path: ROUTES.LOGIN,
    handler: routeHandlers.login,
    protected: false,
    layout: 'public',
    title: 'Login'
  },
  {
    path: ROUTES.REGISTER,
    handler: routeHandlers.register,
    protected: false,
    layout: 'public',
    title: 'Register'
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    handler: routeHandlers.forgotPassword,
    protected: false,
    layout: 'public',
    title: 'Forgot Password'
  },
  {
    path: ROUTES.RESET_PASSWORD,
    handler: routeHandlers.resetPassword,
    protected: false,
    layout: 'public',
    title: 'Reset Password'
  },
  {
    path: ROUTES.CONFIRM_ACCOUNT,
    handler: routeHandlers.confirmAccount,
    protected: false,
    layout: 'public',
    title: 'Confirm Account'
  },
  {
    path: ROUTES.RESEND_VERIFICATION,
    handler: routeHandlers.resendVerification,
    protected: false,
    layout: 'public',
    title: 'Resend Verification'
  }
];