// Route definitions and configuration

export interface RouteConfig {
  path: string;
  handler: (params?: any) => void;
  protected: boolean;
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
  RESEND_VERIFICATION: '/resend-verification'
} as const;

// Import page components
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ConfirmAccountPage } from '../pages/auth/ConfirmAccountPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { ResendVerificationPage } from '../pages/auth/ResendVerificationPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Global variable to track current page instance for cleanup
let currentPageInstance: any = null;

// Helper function to render a page
const renderPage = (PageClass: any, ...args: any[]) => {
  // Clean up previous page instance
  if (currentPageInstance && typeof currentPageInstance.destroy === 'function') {
    currentPageInstance.destroy();
  }

  // Get the main app container
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('[Router] App container not found');
    return;
  }

  // Create and render new page instance
  currentPageInstance = new PageClass(...args);
  currentPageInstance.render(appContainer);
};

// Route handlers with actual page rendering
const routeHandlers = {
  home: () => {
    console.log('[Router] Navigating to Dashboard');
    renderPage(DashboardPage);
  },
  dashboard: () => {
    console.log('[Router] Navigating to Dashboard via /dashboard');
    renderPage(DashboardPage);
  },
  login: () => {
    console.log('[Router] Navigating to Login');
    renderPage(LoginPage);
  },
  register: () => {
    console.log('[Router] Navigating to Register');
    renderPage(RegisterPage);
  },
  forgotPassword: () => {
    console.log('[Router] Navigating to Forgot Password');
    renderPage(ForgotPasswordPage);
  },
  resetPassword: (params: { token: string }) => {
    console.log('[Router] Navigating to Reset Password', params);
    renderPage(ResetPasswordPage, params.token);
  },
  confirmAccount: (params: { token: string }) => {
    console.log('[Router] Navigating to Confirm Account', params);
    renderPage(ConfirmAccountPage, params.token);
  },
  resendVerification: (params?: any) => {
    console.log('[Router] Navigating to Resend Verification', params);
    
    // Extract URL parameters if they exist
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const context = urlParams.get('context');
    
    console.log('[Router] URL params extracted:', { email, context });
    
    // Pass parameters individually like ConfirmAccountPage does
    renderPage(ResendVerificationPage, email, context);
  }
};

// Route configuration with protection settings
export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    handler: routeHandlers.home,
    protected: true,
    title: 'Dashboard'
  },
  {
    path: ROUTES.DASHBOARD,
    handler: routeHandlers.dashboard,
    protected: true,
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
  }
];