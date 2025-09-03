/**
 * Modal state interface
 */
export interface ModalState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  previousActiveElement: Element | null;
}

/**
 * Modal configuration interface
 */
export interface ModalConfig {
  id: string;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  focusTrap?: boolean;
  preventBodyScroll?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/**
 * Modal event detail interfaces
 */
export interface LoginModalEventDetail {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterModalEventDetail {
  username: string;
  email: string;
  password: string;
  organization?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordModalEventDetail {
  email: string;
}

/**
 * Modal event types
 */
export type ModalEventType = 
  | 'modal-opened'
  | 'modal-closed'
  | 'modal-submit'
  | 'modal-error'
  | 'login-success'
  | 'register-success'
  | 'forgot-password-submitted'
  | 'navigate-to-signup'
  | 'navigate-to-signin'
  | 'forgot-password-clicked'
  | 'back-to-login'
  | 'google-signin-clicked'
  | 'google-signup-clicked';

/**
 * Custom modal event interface
 */
export interface ModalCustomEvent<T = any> extends CustomEvent {
  type: ModalEventType;
  detail: T;
}

/**
 * Modal component interface
 */
export interface ModalComponent {
  open(): void;
  close(): void;
  readonly isOpen: boolean;
  reset?(): void;
}

/**
 * Modal manager interface for handling multiple modals
 */
export interface ModalManager {
  activeModal: ModalComponent | null;
  modalStack: ModalComponent[];
  registerModal(id: string, modal: ModalComponent): void;
  unregisterModal(id: string): void;
  openModal(id: string): void;
  closeModal(id: string): void;
  closeAllModals(): void;
  getActiveModal(): ModalComponent | null;
}

/**
 * Modal animation configuration
 */
export interface ModalAnimationConfig {
  duration: number;
  easing: string;
  fade: boolean;
  scale: boolean;
  slide: 'none' | 'up' | 'down' | 'left' | 'right';
}

/**
 * Keyboard navigation configuration for modals
 */
export interface ModalKeyboardConfig {
  escapeKey: boolean;
  enterKey: boolean;
  tabNavigation: boolean;
  focusTrap: boolean;
  restoreFocus: boolean;
}