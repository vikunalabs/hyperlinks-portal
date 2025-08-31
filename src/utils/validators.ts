// Form validation utility functions

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string = 'Field'): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const requiredCheck = validateRequired(email, 'Email');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  const requiredCheck = validateRequired(password, 'Password');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
}

/**
 * Validate username format
 */
export function validateUsername(username: string): ValidationResult {
  const requiredCheck = validateRequired(username, 'Username');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 50) {
    return { isValid: false, error: 'Username must be less than 50 characters long' };
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, periods, underscores, and hyphens' };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
  const requiredCheck = validateRequired(confirmPassword, 'Password confirmation');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}

/**
 * Validate username or email input
 */
export function validateUsernameOrEmail(input: string): ValidationResult {
  const requiredCheck = validateRequired(input, 'Email or Username');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  // Check if it's an email format
  if (input.includes('@')) {
    return validateEmail(input);
  } else {
    return validateUsername(input);
  }
}

/**
 * Validate form fields and return consolidated errors
 */
export function validateForm(fields: Record<string, { value: string; validator: (value: string) => ValidationResult }>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, { value, validator }] of Object.entries(fields)) {
    const result = validator(value);
    if (!result.isValid) {
      errors[fieldName] = result.error || 'Invalid value';
      isValid = false;
    }
  }

  return { isValid, errors };
}