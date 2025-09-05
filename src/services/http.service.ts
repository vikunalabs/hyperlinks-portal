// Base HTTP service with Axios configuration and interceptors

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/auth.types';
import { HTTP_CONFIG } from '@utils/constants';

export class HttpService {
  private instance: AxiosInstance;

  constructor(baseURL: string, config?: Partial<AxiosRequestConfig>) {
    this.instance = axios.create({
      baseURL,
      timeout: HTTP_CONFIG.TIMEOUT,
      withCredentials: true, // Essential for HTTP-only cookies
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for debugging and token injection
    this.instance.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        return config;
      },
      (error) => {
        console.error('[HTTP] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.instance.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[HTTP] Response ${response.status}:`, response.data);
        }
        return response;
      },
      (error) => {
        console.error('[HTTP] Response error:', error);
        
        // Handle specific error scenarios
        if (error.response?.status === 401) {
          const wwwAuth = error.response.headers['www-authenticate'];
          if (wwwAuth === 'Refresh') {
            // Signal that token refresh is needed
            console.log('[HTTP] Token refresh required');
            // The auth service will handle this
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url, config);
  }

  // Set CSRF token in default headers
  public setCsrfToken(token: string): void {
    this.instance.defaults.headers.common['X-CSRF-TOKEN'] = token;
  }

  // Clear CSRF token
  public clearCsrfToken(): void {
    delete this.instance.defaults.headers.common['X-CSRF-TOKEN'];
  }

  // Get the underlying Axios instance for advanced usage
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}