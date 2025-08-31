// Centralized error handling utilities

import type { ApiResponse, ApiError } from '../types/auth.types';

export interface ErrorInfo {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  details?: string;
}

/**
 * Extract user-friendly error message from API response
 */
export function extractErrorMessage(error: any): ErrorInfo {
  // Handle Axios error responses
  if (error.response?.data) {
    const apiResponse = error.response.data as ApiResponse<any>;
    
    // Check if it's a standard API error response
    if (apiResponse.error) {
      const apiError = apiResponse.error as ApiError;
      
      // Convert field errors to a more usable format
      const fieldErrors: Record<string, string> = {};
      if (apiError.fieldErrors && apiError.fieldErrors.length > 0) {
        apiError.fieldErrors.forEach(fieldError => {
          fieldErrors[fieldError.field] = fieldError.message;
        });
      }
      
      return {
        message: apiError.message || 'An error occurred',
        code: apiError.code,
        fieldErrors,
        details: apiError.details
      };
    }
    
    // Fallback to response message
    if (apiResponse.message) {
      return { message: apiResponse.message };
    }
  }
  
  // Handle direct error message
  if (error.message) {
    return { message: error.message };
  }
  
  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return { 
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return { 
      message: 'Request timeout. Please try again.',
      code: 'TIMEOUT'
    };
  }
  
  // Default fallback
  return { message: 'An unexpected error occurred. Please try again.' };
}

/**
 * Get user-friendly error message for common HTTP status codes
 */
export function getStatusErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please sign in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 422:
      return 'Invalid input data. Please check your entries.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Service temporarily unavailable. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Enhanced error handler that provides structured error information
 */
export function handleApiError(error: any, fallbackMessage?: string): Error {
  const errorInfo = extractErrorMessage(error);
  
  // Use fallback message if provided and no specific message found
  if (fallbackMessage && errorInfo.message === 'An unexpected error occurred. Please try again.') {
    errorInfo.message = fallbackMessage;
  }
  
  // Create enhanced error with additional properties
  const enhancedError = new Error(errorInfo.message);
  (enhancedError as any).code = errorInfo.code;
  (enhancedError as any).fieldErrors = errorInfo.fieldErrors;
  (enhancedError as any).details = errorInfo.details;
  
  return enhancedError;
}

/**
 * Log error with context for debugging
 */
export function logError(context: string, error: any): void {
  if (import.meta.env.DEV) {
    console.group(`[Error] ${context}`);
    console.error('Error object:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
    
    if (error.request) {
      console.error('Request config:', error.config);
    }
    
    console.groupEnd();
  }
}