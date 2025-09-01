/**
 * Shared validation utilities for form inputs
 */

/**
 * Validates email format using standard regex
 * @param email - The email string to validate
 * @returns true if email format is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates username format
 * Username must be at least 3 characters and contain only alphanumeric characters,
 * underscores, hyphens, or periods
 * @param username - The username string to validate
 * @returns true if username format is valid, false otherwise
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
  return usernameRegex.test(username);
};

/**
 * Validates input as either valid username or valid email
 * @param input - The input string to validate
 * @returns true if input is either a valid username or valid email
 */
export const isValidUsernameOrEmail = (input: string): boolean => {
  if (!input || input.trim().length === 0) return false;
  return isValidEmail(input) || isValidUsername(input);
};

/**
 * Validates password strength
 * @param password - The password string to validate
 * @param minLength - Minimum password length (default: 6)
 * @returns true if password meets requirements, false otherwise
 */
export const isValidPassword = (password: string, minLength: number = 6): boolean => {
  return Boolean(password && password.length >= minLength);
};

/**
 * Validates if two passwords match
 * @param password - The original password
 * @param confirmPassword - The confirmation password
 * @returns true if passwords match, false otherwise
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validation error messages
 */
export const ValidationMessages = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_USERNAME: 'Username must be at least 3 characters and contain only letters, numbers, underscores, hyphens, or periods',
  INVALID_USERNAME_OR_EMAIL: 'Please enter a valid username (3+ characters) or email address',
  PASSWORD_TOO_SHORT: (minLength: number = 6) => `Password must be at least ${minLength} characters long`,
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  TERMS_REQUIRED: 'You must accept the terms and conditions',
} as const;