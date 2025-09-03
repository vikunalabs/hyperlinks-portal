// Route definitions and configuration

export interface RouteConfig {
  path: string;
  handler: () => void;
  protected: boolean;
  title?: string;
}

// Route paths
export const ROUTES = {
  HOME: '/',
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
  home: () => {
    console.log('[Router] Navigating to Home');
    renderPage('home-content');
  },
  login: () => {
    console.log('[Router] Navigating to Login');
    // TODO: Render LoginPage component
  },
  register: () => {
    console.log('[Router] Navigating to Register');
    // TODO: Render RegisterPage component
  },
  forgotPassword: () => {
    console.log('[Router] Navigating to Forgot Password');
    // TODO: Render ForgotPasswordPage component
  },
  resetPassword: () => {
    console.log('[Router] Navigating to Reset Password');
    // TODO: Render ResetPasswordPage component
  },
  confirmAccount: () => {
    console.log('[Router] Navigating to Confirm Account');
    // TODO: Render ConfirmAccountPage component
  },
  resendVerification: () => {
    console.log('[Router] Navigating to Resend Verification');
    // TODO: Render ResendVerificationPage component
  },
  terms: async () => {
    console.log('[Router] Navigating to Terms of Service');
    await loadAndRenderPage('terms-of-service-page', () => import('../components/pages/terms-of-service'));
  },
  privacy: async () => {
    console.log('[Router] Navigating to Privacy Policy');
    await loadAndRenderPage('privacy-policy-page', () => import('../components/pages/privacy-policy'));
  }
};

// Helper function to render a page component
function renderPage(componentTag: string): void {
  const appContainer = document.querySelector('app-root');
  if (appContainer) {
    // Dispatch a custom event to update the current page
    appContainer.dispatchEvent(new CustomEvent('route-change', {
      detail: { componentTag },
      bubbles: true
    }));
  }
}

// Helper function to lazy load and render a page component
async function loadAndRenderPage(componentTag: string, importFn: () => Promise<any>): Promise<void> {
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
    renderPage(componentTag);
  } catch (error) {
    console.error('[Router] Failed to load page component:', error);
    // Fallback to home page
    renderPage('home-content');
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
    protected: false, // Changed to false - home can be public
    title: 'Home'
  },
  {
    path: ROUTES.TERMS,
    handler: routeHandlers.terms,
    protected: false,
    title: 'Terms of Service'
  },
  {
    path: ROUTES.PRIVACY,
    handler: routeHandlers.privacy,
    protected: false,
    title: 'Privacy Policy'
  },
  {
    path: ROUTES.LOGIN,
    handler: routeHandlers.login,
    protected: false,
    title: 'Login'
  },
  {
    path: ROUTES.REGISTER,
    handler: routeHandlers.register,
    protected: false,
    title: 'Register'
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    handler: routeHandlers.forgotPassword,
    protected: false,
    title: 'Forgot Password'
  },
  {
    path: ROUTES.RESET_PASSWORD,
    handler: routeHandlers.resetPassword,
    protected: false,
    title: 'Reset Password'
  },
  {
    path: ROUTES.CONFIRM_ACCOUNT,
    handler: routeHandlers.confirmAccount,
    protected: false,
    title: 'Confirm Account'
  },
  {
    path: ROUTES.RESEND_VERIFICATION,
    handler: routeHandlers.resendVerification,
    protected: false,
    title: 'Resend Verification'
  }
];