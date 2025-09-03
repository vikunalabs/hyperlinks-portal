// Export all form-related types
export type {
  FormFieldState,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  FormValidationState,
  FormSubmissionResult,
  AuthResponse,
  PasswordResetResponse,
  FormValidationContext,
  ValidationConfig,
  FormFieldConfig,
} from './forms';

// Export all modal-related types
export type {
  ModalState,
  ModalConfig,
  LoginModalEventDetail,
  RegisterModalEventDetail,
  ForgotPasswordModalEventDetail,
  ModalEventType,
  ModalCustomEvent,
  ModalComponent,
  ModalManager,
  ModalAnimationConfig,
  ModalKeyboardConfig,
} from './modals';

// Export all component-related types
export type {
  BaseComponentProps,
  ButtonProps,
  InputProps,
  FormProps,
  NavbarProps,
  IconProps,
  LoadingProps,
  ErrorBoundaryProps,
  PageProps,
  ComponentState,
  ComponentLifecycle,
  ThemeConfig,
} from './components';

// Export validation types from utils
export type { ValidationResult, FormValidationRules } from '../utils/validation';