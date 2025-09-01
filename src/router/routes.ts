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
  TERMS: '/terms',
  PRIVACY: '/privacy',
  DASHBOARD: '/dashboard',
  MY_LINKS: '/links',
  QR_CODES: '/qr-codes',
  ANALYTICS: '/analytics',
  PROFILE: '/profile'
} as const;

// Route handlers - placeholder functions that will be implemented with page components
const routeHandlers = {
  home: () => {
    console.log('[Router] Navigating to Home Page');
    const app = document.getElementById('app')!;
    app.innerHTML = '<home-page></home-page>';
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
  terms: () => {
    console.log('[Router] Navigating to Terms of Service');
    const app = document.getElementById('app')!;
    app.innerHTML = '<terms-page></terms-page>';
  },
  privacy: () => {
    console.log('[Router] Navigating to Privacy Policy');
    const app = document.getElementById('app')!;
    app.innerHTML = '<privacy-page></privacy-page>';
  },
  dashboard: () => {
    console.log('[Router] Navigating to Dashboard');
    const app = document.getElementById('app')!;
    app.innerHTML = '<dashboard-page></dashboard-page>';
  },
  myLinks: () => {
    console.log('[Router] Navigating to My Links');
    const app = document.getElementById('app')!;
    app.innerHTML = '<my-links-page></my-links-page>';
  },
  qrCodes: () => {
    console.log('[Router] Navigating to QR Codes');
    const app = document.getElementById('app')!;
    app.innerHTML = '<qr-codes-page></qr-codes-page>';
  },
  analytics: () => {
    console.log('[Router] Navigating to Analytics');
    const app = document.getElementById('app')!;
    app.innerHTML = '<analytics-page></analytics-page>';
  },
  profile: () => {
    console.log('[Router] Navigating to Profile');
    const app = document.getElementById('app')!;
    app.innerHTML = '<profile-page></profile-page>';
  }
};

// Route configuration with protection settings
export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    handler: routeHandlers.home,
    protected: false,
    title: 'Home'
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
    path: ROUTES.DASHBOARD,
    handler: routeHandlers.dashboard,
    protected: true,
    title: 'Dashboard'
  },
  {
    path: ROUTES.MY_LINKS,
    handler: routeHandlers.myLinks,
    protected: true,
    title: 'My Links'
  },
  {
    path: ROUTES.QR_CODES,
    handler: routeHandlers.qrCodes,
    protected: true,
    title: 'QR Codes'
  },
  {
    path: ROUTES.ANALYTICS,
    handler: routeHandlers.analytics,
    protected: true,
    title: 'Analytics'
  },
  {
    path: ROUTES.PROFILE,
    handler: routeHandlers.profile,
    protected: true,
    title: 'Profile'
  }
];