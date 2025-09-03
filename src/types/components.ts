/**
 * Base component props interface
 */
export interface BaseComponentProps {
  className?: string;
  disabled?: boolean;
  hidden?: boolean;
  tabIndex?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/**
 * Button component props interface
 */
export interface ButtonProps extends BaseComponentProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'google';
  size: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: MouseEvent) => void;
}

/**
 * Input component props interface
 */
export interface InputProps extends BaseComponentProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  spellcheck?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  error?: string;
  onInput?: (event: InputEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
}

/**
 * Form component props interface
 */
export interface FormProps extends BaseComponentProps {
  noValidate?: boolean;
  onSubmit?: (event: SubmitEvent) => void;
  onReset?: (event: Event) => void;
}

/**
 * Navbar component props interface
 */
export interface NavbarProps extends BaseComponentProps {
  brandName: string;
  brandHref?: string;
  fixed?: boolean;
  transparent?: boolean;
}

/**
 * Icon component props interface
 */
export interface IconProps extends BaseComponentProps {
  name: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  strokeWidth?: number;
}

/**
 * Loading component props interface
 */
export interface LoadingProps extends BaseComponentProps {
  size: 'sm' | 'md' | 'lg';
  message?: string;
  overlay?: boolean;
}

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: string | HTMLElement;
  onError?: (error: Error, errorInfo: any) => void;
}

/**
 * Page component props interface
 */
export interface PageProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
}

/**
 * Component state interface
 */
export interface ComponentState {
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

/**
 * Component lifecycle hooks interface
 */
export interface ComponentLifecycle {
  onMount?(): void | Promise<void>;
  onUnmount?(): void | Promise<void>;
  onUpdate?(changedProperties: Map<string, any>): void | Promise<void>;
  onError?(error: Error): void;
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    6: string;
    8: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}