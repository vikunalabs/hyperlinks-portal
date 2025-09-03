export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export class FormValidator {
  /**
   * Validates a username/email field
   */
  static validateUsernameOrEmail(value: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value || value.trim().length === 0) {
      errors.push('Username or email is required');
      return { isValid: false, errors };
    }

    const trimmedValue = value.trim();

    // Check if it's an email
    if (trimmedValue.includes('@')) {
      return this.validateEmail(trimmedValue);
    } else {
      return this.validateUsername(trimmedValue);
    }
  }

  /**
   * Validates email format
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    if (email.length > 254) {
      errors.push('Email address is too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates username format
   */
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username.length > 30) {
      errors.push('Username must be less than 30 characters long');
    }

    // Only allow a-z, A-Z, 0-9, period, hyphen, underscore
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(username)) {
      errors.push('Username can only contain letters, numbers, periods, hyphens, and underscores');
    }

    // Don't allow username to start or end with special characters
    if (/^[._-]|[._-]$/.test(username)) {
      errors.push('Username cannot start or end with special characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates password strength
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password || password.length === 0) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters long');
    }

    // Must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Must contain at least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Must contain at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push('Password is too common. Please choose a more secure password');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generic field validation
   */
  static validateField(value: string, rules: FormValidationRules): ValidationResult {
    const errors: string[] = [];

    // Required check
    if (rules.required && (!value || value.trim().length === 0)) {
      errors.push('This field is required');
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim().length === 0) {
      return { isValid: errors.length === 0, errors };
    }

    // Length validations
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters long`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be less than ${rules.maxLength} characters long`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push('Invalid format');
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates entire form
   */
  static validateForm(formData: Record<string, string>, rules: Record<string, FormValidationRules>): {
    isValid: boolean;
    fieldErrors: Record<string, string[]>;
  } {
    const fieldErrors: Record<string, string[]> = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const value = formData[fieldName] || '';
      const fieldRules = rules[fieldName];
      const result = this.validateField(value, fieldRules);

      if (!result.isValid) {
        fieldErrors[fieldName] = result.errors;
        isValid = false;
      }
    });

    return {
      isValid,
      fieldErrors
    };
  }

  /**
   * Validates confirm password matches original password
   */
  static validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
    const errors: string[] = [];

    if (!confirmPassword || confirmPassword.length === 0) {
      errors.push('Please confirm your password');
      return { isValid: false, errors };
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates organization name (optional field)
   */
  static validateOrganization(organization: string): ValidationResult {
    const errors: string[] = [];

    // Organization is optional, so empty is valid
    if (!organization || organization.trim().length === 0) {
      return { isValid: true, errors: [] };
    }

    const trimmedValue = organization.trim();

    if (trimmedValue.length < 2) {
      errors.push('Organization name must be at least 2 characters long');
    }

    if (trimmedValue.length > 100) {
      errors.push('Organization name must be less than 100 characters long');
    }

    // Allow letters, numbers, spaces, and common business characters
    const orgRegex = /^[a-zA-Z0-9\s._&-]+$/;
    if (!orgRegex.test(trimmedValue)) {
      errors.push('Organization name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Real-time validation with debouncing
   */
  static debounceValidation(
    callback: (result: ValidationResult) => void,
    delay: number = 300
  ) {
    let timeoutId: NodeJS.Timeout;

    return (value: string, validationFn: (value: string) => ValidationResult) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const result = validationFn(value);
        callback(result);
      }, delay);
    };
  }
}