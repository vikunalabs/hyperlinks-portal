export interface RouteConfig {
  path: string;
  component: string;
  requiresAuth?: boolean;
  title?: string;
  meta?: Record<string, any>;
}

export const routes: RouteConfig[] = [
  // Public routes
  {
    path: '/',
    component: 'home-page',
    title: 'Home - URL Shortener'
  },
  {
    path: '/login',
    component: 'login-page',
    title: 'Login'
  },
  {
    path: '/register',
    component: 'register-page',
    title: 'Create Account'
  },
  {
    path: '/forgot-password',
    component: 'forgot-password-page',
    title: 'Reset Password'
  },
  {
    path: '/reset-password',
    component: 'reset-password-page',
    title: 'Set New Password'
  },
  {
    path: '/verify-email',
    component: 'verify-email-page',
    title: 'Verify Email'
  },

  // Protected routes
  {
    path: '/dashboard',
    component: 'dashboard-page',
    requiresAuth: true,
    title: 'Dashboard'
  },
  {
    path: '/urls',
    component: 'urls-list-page',
    requiresAuth: true,
    title: 'My URLs'
  },
  {
    path: '/urls/create',
    component: 'url-create-page',
    requiresAuth: true,
    title: 'Create Short URL'
  },
  {
    path: '/urls/:id',
    component: 'url-detail-page',
    requiresAuth: true,
    title: 'URL Details'
  },
  {
    path: '/urls/:id/analytics',
    component: 'url-analytics-page',
    requiresAuth: true,
    title: 'URL Analytics'
  },
  {
    path: '/profile',
    component: 'profile-page',
    requiresAuth: true,
    title: 'Profile Settings'
  },
  {
    path: '/settings',
    component: 'settings-page',
    requiresAuth: true,
    title: 'Account Settings'
  },

  // Catch-all route for 404
  {
    path: '*',
    component: 'not-found-page',
    title: 'Page Not Found'
  }
];