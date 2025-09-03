import type { ValidationResult } from '../utils/validation';

/**
 * Form field state interface
 */
export interface FormFieldState {
  value: string;
  touched: boolean;
  error: string | null;
  isValid: boolean;
}

/**
 * Login form data interface
 */
export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Registration form data interface
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  organization?: string;
  acceptTerms: boolean;
}

/**
 * Forgot password form data interface
 */
export interface ForgotPasswordFormData {
  email: string;
}

/**
 * Form validation state interface
 */
export interface FormValidationState {
  isValid: boolean;
  isSubmitting: boolean;
  submitAttempted: boolean;
  fieldErrors: Record<string, string[]>;
}

/**
 * Form submission result interface
 */
export interface FormSubmissionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    organization?: string;
  };
  token?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * Password reset response interface
 */
export interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Form validation context interface
 */
export interface FormValidationContext {
  field: string;
  value: string;
  formData: Record<string, string>;
  touched: boolean;
}

/**
 * Validation configuration interface
 */
export interface ValidationConfig {
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  debounceMs?: number;
}

/**
 * Form field configuration interface
 */
export interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'checkbox' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  validation?: {
    rules: ValidationResult;
    realTime?: boolean;
    debounce?: number;
  };
}