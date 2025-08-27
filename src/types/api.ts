// TypeScript types based on Java APIResponse, APIError, FieldError classes

/**
 * Standardized API response wrapper for all endpoints.
 * Based on APIResponse.java
 * 
 * For successful responses (status 2xx):
 * - 'data' contains the response payload (may be null for success responses with only a message)
 * - 'error' is always null
 * 
 * For error responses (status 4xx/5xx):
 * - 'data' is always null
 * - 'error' contains error details (must not be null)
 */
export interface ApiResponse<T = any> {
  status: number;
  data: T | null;
  error: ApiError | null;
  message: string;
  timestamp: string; // ISO-8601 format
}

/**
 * Standardized error response format for API failures.
 * Based on APIError.java
 */
export interface ApiError {
  code: string;           // Machine-readable error code
  message: string;        // Human-readable error message
  fieldErrors: FieldError[]; // List of field-specific errors
  details?: string;       // Additional debug information (optional)
}

/**
 * Validation error for a specific field in request data.
 * Based on FieldError.java
 */
export interface FieldError {
  field: string;          // name of the invalid field
  code: string;           // machine-readable error code for this field
  message: string;        // human-readable error message for this field
  rejectedValue?: any;    // rejected input value (may be omitted for security)
}

// Utility type guards for type safety
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.status >= 200 && response.status < 300 && response.error === null;
}

export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: ApiError } {
  return response.status >= 400 && response.error !== null;
}

// Helper type for creating API responses
export interface ApiResponseBuilder<T> {
  success(data: T, message?: string): ApiResponse<T>;
  error(error: ApiError, message?: string): ApiResponse<T>;
}

// Common HTTP status codes used in responses
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// Common error codes based on your auth workflows
export const API_ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  CSRF_TOKEN_INVALID: 'CSRF_TOKEN_INVALID',
  REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',
  
  // Validation Errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
  
  // Business Logic Errors
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  URL_NOT_FOUND: 'URL_NOT_FOUND',
  CUSTOM_SLUG_TAKEN: 'CUSTOM_SLUG_TAKEN',
  
  // System Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];