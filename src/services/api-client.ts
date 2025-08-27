import { config } from '../config';
import type { ApiResponse, ApiError } from '../types/api';
import { isSuccessResponse, isErrorResponse } from '../types/api';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  withCredentials?: boolean;
}

export interface ApiClientOptions {
  baseUrl: string;
  timeout: number;
  defaultHeaders?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private csrfToken: string | null = null;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = options.timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders
    };
  }

  public setCsrfToken(token: string): void {
    this.csrfToken = token;
  }

  public clearCsrfToken(): void {
    this.csrfToken = null;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      withCredentials = true
    } = options;

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers
    };

    // Add CSRF token if available and method is not GET
    if (this.csrfToken && method !== 'GET') {
      requestHeaders['X-CSRF-TOKEN'] = this.csrfToken;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: withCredentials ? 'include' : 'omit',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let responseData: ApiResponse<T>;
      
      try {
        responseData = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create a generic error response
        responseData = {
          status: response.status,
          data: null,
          error: {
            code: 'RESPONSE_PARSE_ERROR',
            message: 'Failed to parse server response',
            fieldErrors: [],
            details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
          },
          message: 'Server response could not be parsed',
          timestamp: new Date().toISOString()
        };
      }

      // Validate response structure matches our ApiResponse interface
      if (!this.isValidApiResponse(responseData)) {
        throw new Error('Invalid API response format');
      }

      return responseData;

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle network and other errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return this.createErrorResponse<T>('REQUEST_TIMEOUT', 'Request timed out', 408);
        }
        
        return this.createErrorResponse<T>(
          'NETWORK_ERROR',
          `Network request failed: ${error.message}`,
          0
        );
      }

      return this.createErrorResponse<T>('UNKNOWN_ERROR', 'An unknown error occurred', 500);
    }
  }

  private isValidApiResponse<T>(data: any): data is ApiResponse<T> {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.status === 'number' &&
      typeof data.message === 'string' &&
      typeof data.timestamp === 'string' &&
      (data.data === null || data.data !== undefined) &&
      (data.error === null || (
        typeof data.error === 'object' &&
        typeof data.error.code === 'string' &&
        typeof data.error.message === 'string' &&
        Array.isArray(data.error.fieldErrors)
      ))
    );
  }

  private createErrorResponse<T>(
    code: string,
    message: string,
    status: number
  ): ApiResponse<T> {
    return {
      status,
      data: null,
      error: {
        code,
        message,
        fieldErrors: []
      },
      message,
      timestamp: new Date().toISOString()
    };
  }

  // HTTP method helpers
  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers });
  }

  public async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body, headers });
  }

  public async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', body, headers });
  }

  public async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body, headers });
  }

  public async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Create and export API client instances
export const authApiClient = new ApiClient({
  baseUrl: config.authServer.baseUrl,
  timeout: config.authServer.timeout,
  defaultHeaders: {
    'X-Client-Type': 'web-spa',
    'X-Client-Version': config.app.version
  }
});

export const resourceApiClient = new ApiClient({
  baseUrl: config.resourceServer.baseUrl,
  timeout: config.resourceServer.timeout,
  defaultHeaders: {
    'X-Client-Type': 'web-spa',
    'X-Client-Version': config.app.version
  }
});

// Utility functions for common response handling
export function handleApiResponse<T>(
  response: ApiResponse<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: ApiError) => void
): T | null {
  if (isSuccessResponse(response)) {
    if (onSuccess) {
      onSuccess(response.data);
    }
    return response.data;
  }

  if (isErrorResponse(response)) {
    if (config.app.debug) {
      console.error('API Error:', response.error);
    }
    if (onError) {
      onError(response.error);
    }
  }

  return null;
}