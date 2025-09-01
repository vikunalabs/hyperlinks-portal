// Authentication service - handles all Auth Server interactions

import { HttpService } from './http.service';
import { csrfService } from './csrf.service';
import { API_BASE_URLS, AUTH_ENDPOINTS } from '../utils/constants';
import type { 
  LoginCredentials, 
  RegistrationData, 
  AuthResponse, 
  User
} from '../types/auth.types';

export class AuthService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService(API_BASE_URLS.AUTH_SERVER);
  }

  /**
   * Traditional login with email/password
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Get CSRF token before state-changing request
      const csrfToken = await csrfService.getToken();
      
      const response = await this.httpService.post<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials,
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        }
      );

      return this.handleAuthResponse(response);
    } catch (error) {
      throw this.handleAuthError(error, 'Login failed');
    }
  }

  /**
   * User registration
   */
  public async register(userData: RegistrationData): Promise<AuthResponse> {
    try {
      const csrfToken = await csrfService.getToken();
      
      const response = await this.httpService.post<AuthResponse>(
        AUTH_ENDPOINTS.REGISTER,
        userData,
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        }
      );

      return this.handleAuthResponse(response);
    } catch (error) {
      throw this.handleAuthError(error, 'Registration failed');
    }
  }

  /**
   * Logout user and clear cookies
   */
  public async logout(): Promise<void> {
    try {
      const csrfToken = await csrfService.getToken();
      
      await this.httpService.post(
        AUTH_ENDPOINTS.LOGOUT,
        {},
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        }
      );
      
      // Clear CSRF token after logout
      csrfService.clearToken();
    } catch (error) {
      // Clear tokens even if logout request fails
      csrfService.clearToken();
      console.warn('[Auth] Logout request failed, but clearing local state:', error);
    }
  }

  /**
   * Refresh access token using refresh token cookie
   */
  public async refreshToken(): Promise<User> {
    try {
      const response = await this.httpService.post<{ user: User }>(AUTH_ENDPOINTS.REFRESH);
      
      if (response.data.data?.user) {
        return response.data.data.user;
      }
      
      throw new Error('Invalid token refresh response');
    } catch (error) {
      throw this.handleAuthError(error, 'Token refresh failed');
    }
  }

  /**
   * Get current user profile
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await this.httpService.get<User>(AUTH_ENDPOINTS.USER);
      
      if (response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Invalid user response');
    } catch (error) {
      throw this.handleAuthError(error, 'Failed to get user profile');
    }
  }

  /**
   * Forgot password - send reset email
   */
  public async forgotPassword(email: string): Promise<void> {
    try {
      const csrfToken = await csrfService.getToken();
      
      await this.httpService.post(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        { email },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        }
      );
    } catch (error) {
      throw this.handleAuthError(error, 'Failed to send password reset email');
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const csrfToken = await csrfService.getToken();
      
      await this.httpService.post(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        { token, newPassword },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        }
      );
    } catch (error) {
      throw this.handleAuthError(error, 'Password reset failed');
    }
  }

  /**
   * Confirm account with email token
   */
  public async confirmAccount(token: string): Promise<void> {
    try {
      await this.httpService.get(`${AUTH_ENDPOINTS.CONFIRM_ACCOUNT}?token=${token}`);
    } catch (error) {
      throw this.handleAuthError(error, 'Account confirmation failed');
    }
  }

  /**
   * Resend verification email
   */
  public async resendVerification(email: string): Promise<void> {
    try {
      const csrfToken = await csrfService.getToken();
      
      await this.httpService.post(
        AUTH_ENDPOINTS.RESEND_VERIFICATION,
        { email },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        }
      );
    } catch (error) {
      throw this.handleAuthError(error, 'Failed to resend verification email');
    }
  }

  /**
   * Initiate Google OAuth2 flow
   */
  public initiateGoogleLogin(): void {
    window.location.href = `${API_BASE_URLS.AUTH_SERVER}${AUTH_ENDPOINTS.GOOGLE_OAUTH}`;
  }

  private handleAuthResponse(response: any): AuthResponse {
    if (response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Invalid authentication response');
  }

  private handleAuthError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.error?.message) {
      return new Error(error.response.data.error.message);
    }
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error(defaultMessage);
  }
}

// Singleton instance
export const authService = new AuthService();