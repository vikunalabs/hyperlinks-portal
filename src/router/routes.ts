// Route definitions and configuration

// Import page components
import '@components/pages/protected/dashboard-page';
import '@components/pages/public/home-page';
import '@components/pages/protected/mylinks-page';

// Utility function to render pages
function renderPage(componentTag: string) {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = `<${componentTag}></${componentTag}>`;
  }
}

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
  DASHBOARD: '/dashboard',
  LINKS: '/links'
} as const;

// Route handlers - page component rendering
const routeHandlers = {
  home: () => {
    console.log('[Router] Navigating to Home');
    renderPage('home-page');
  },
  login: () => {
    console.log('[Router] Navigating to Login');
    renderPage('home-page');
  },
  register: () => {
    console.log('[Router] Navigating to Register');
    renderPage('home-page');
  },
  forgotPassword: () => {
    console.log('[Router] Navigating to Forgot Password');
    renderPage('home-page');
  },
  resetPassword: () => {
    console.log('[Router] Navigating to Reset Password');
    renderPage('home-page');
  },
  confirmAccount: () => {
    console.log('[Router] Navigating to Confirm Account');
    renderPage('home-page');
  },
  resendVerification: () => {
    console.log('[Router] Navigating to Resend Verification');
    renderPage('home-page');
  },
  dashboard: () => {
    console.log('[Router] Navigating to Dashboard');
    renderPage('dashboard-page');
  },
  links: () => {
    console.log('[Router] Navigating to Links');
    renderPage('mylinks-page');
  }
};

// Route configuration with protection settings
export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    handler: routeHandlers.home,
    protected: false,
    title: 'Dashboard'
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
  },
  {
    path: ROUTES.DASHBOARD,
    handler: routeHandlers.dashboard,
    protected: false,
    title: 'Dashboard'
  },
  {
    path: ROUTES.LINKS,
    handler: routeHandlers.links,
    protected: false,
    title: 'My Links'
  },
];