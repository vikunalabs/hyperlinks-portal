// src/services/csrf.service.ts
// CSRF token management service

import { HttpService } from './http.service';
import { API_BASE_URLS, AUTH_ENDPOINTS } from '../utils/constants';

export class CsrfService {
  private httpService: HttpService;
  private csrfToken: string | null = null;
  private tokenPromise: Promise<string> | null = null;

  constructor() {
    this.httpService = new HttpService(API_BASE_URLS.AUTH_SERVER);
  }

  /**
   * Get CSRF token - fetches from server if not cached
   * Implements singleton pattern to avoid multiple concurrent requests
   */
  public async getToken(): Promise<string> {
    // Return cached token if valid
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // Return existing promise if already fetching
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // Fetch new token
    this.tokenPromise = this.fetchToken();
    
    try {
      const token = await this.tokenPromise;
      this.csrfToken = token;
      return token;
    } catch (error) {
      // Clear promise on error to allow retry
      this.tokenPromise = null;
      throw error;
    }
  }

  /**
   * Refresh CSRF token - force fetch from server
   */
  public async refreshToken(): Promise<string> {
    this.csrfToken = null;
    this.tokenPromise = null;
    return this.getToken();
  }

  /**
   * Clear cached token
   */
  public clearToken(): void {
    this.csrfToken = null;
    this.tokenPromise = null;
    this.httpService.clearCsrfToken();
  }

  /**
   * Set token directly (for testing or external token source)
   */
  public setToken(token: string): void {
    this.csrfToken = token;
    this.httpService.setCsrfToken(token);
  }

  private async fetchToken(): Promise<string> {
    try {
      const response = await this.httpService.get<{ csrfToken: string }>(AUTH_ENDPOINTS.CSRF);
      
      if (response.data.data?.csrfToken) {
        const token = response.data.data.csrfToken;
        this.httpService.setCsrfToken(token);
        return token;
      }
      
      throw new Error('Invalid CSRF token response');
    } catch (error) {
      console.error('[CSRF] Failed to fetch token:', error);
      throw new Error('Failed to fetch CSRF token');
    }
  }
}

// Singleton instance
export const csrfService = new CsrfService();