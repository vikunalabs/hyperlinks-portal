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
  RESEND_VERIFICATION: '/resend-verification'
} as const;

// Route handlers - placeholder functions that will be implemented with page components
const routeHandlers = {
  home: () => {
    console.log('[Router] Navigating to Dashboard');
    // TODO: Render DashboardPage component
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