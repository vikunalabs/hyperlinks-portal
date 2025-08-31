// src/types/auth.types.ts

// Authentication type definitions following the plan

// User type based on backend JWT claims
export interface User {
  sub: string; // User ID  
  username: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  name?: string;
  organization?: string;
}

// Authentication request/response types
export interface LoginCredentials {
  usernameOrEmail: string; // Can be either username or email
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  name?: string;
  organization?: string;
  termsConsent: boolean; // Terms & Privacy consent
  marketingConsent: boolean; // Marketing & Social notifications consent
}

export interface AuthResponse {
  user: User;
  message: string;
}

// API Response wrapper (matches backend APIResponse.java)
export interface ApiResponse<T = any> {
  status: number;
  data: T | null;
  error: ApiError | null;
  message: string;
  timestamp: string;
}

// Error response structure (matches backend APIError.java)
export interface ApiError {
  code: string;
  message: string;
  fieldErrors: FieldError[];
  details?: string;
}

export interface FieldError {
  field: string;
  code: string;
  message: string;
  rejectedValue?: any;
}

// State management types
export interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  
  // State setters
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

// Global app state
export interface AppState {
  // UI state
  isLoading: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
  
  // Actions
  showNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  dismissNotification: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setGlobalLoading: (loading: boolean) => void;
  initializeApp: () => void;
}

// Notification type
export interface Notification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// Utility type guards
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.status >= 200 && response.status < 300 && response.error === null;
}

export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: ApiError } {
  return response.status >= 400 && response.error !== null;
}