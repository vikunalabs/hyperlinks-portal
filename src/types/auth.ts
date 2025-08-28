// Authentication-related types based on your auth workflows

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  organization?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

// Login/Registration Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  organization?: string;
  agreeToTerms: boolean;
  consentToMarketing: boolean;
}

export interface LoginResponse {
  user: User;
  csrfToken: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

// OAuth Types
export interface OAuthProvider {
  name: 'google' | 'github' | 'microsoft';
  displayName: string;
  redirectUrl: string;
}

export interface OAuthResponse {
  redirectUrl: string;
}

// Password Management
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Email Verification
export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationData {
  email: string;
  code: string;
}

// Profile Management
export interface ProfileUpdateData {
  name?: string;
  organization?: string;
  bio?: string;
  avatar?: string;
}

// CSRF Token Management
export interface CsrfTokenResponse {
  csrfToken: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  csrfToken: string | null;
}

// Token Types (for internal use)
export interface TokenInfo {
  token: string;
  expiresAt: number;
  isValid: boolean;
}

// Auth Action Types
export type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; csrfToken: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'SET_CSRF_TOKEN'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Auth Event Types for event-driven architecture
export interface AuthEvents {
  'auth.login.success': { user: User; timestamp: number };
  'auth.login.failure': { email: string; error: string; timestamp: number };
  'auth.logout': { userId: string; timestamp: number };
  'auth.token.refreshed': { timestamp: number };
  'auth.registration.success': { email: string; timestamp: number };
  'auth.password.changed': { userId: string; timestamp: number };
  'auth.email.verified': { userId: string; email: string; timestamp: number };
}