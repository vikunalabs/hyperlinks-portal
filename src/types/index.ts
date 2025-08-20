// Component type definitions
export interface ComponentStyleProps {
  classes?: string;
  hoverClasses?: string;
  activeClasses?: string;
  disabledClasses?: string;
  errorClasses?: string;
  focusClasses?: string;
}

export interface FormFieldProps extends ComponentStyleProps {
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export interface ComponentChangeEvent<T = any> {
  value: T;
  name?: string;
  originalEvent?: Event;
}

export interface ComponentClickEvent {
  originalEvent: MouseEvent;
  target: EventTarget | null;
}

export interface ValidationRule {
  message: string;
  validator: (value: any) => boolean;
}

export interface ValidationState {
  isValid: boolean;
  errors: string[];
}