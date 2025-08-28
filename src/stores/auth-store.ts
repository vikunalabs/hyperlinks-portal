import { createStore } from 'zustand/vanilla';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { authApiClient, handleApiResponse } from '../services/api-client';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
  setCsrfToken: (token: string) => void;
  
  // Auth checks
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  isEmailVerified: () => boolean;
}

export const authStore = createStore<AuthStore>()((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,
  csrfToken: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApiClient.post<{ user: User; csrfToken: string }>(
        '/auth/login',
        credentials
      );

      return handleApiResponse(
        response,
        (data) => {
          set({
            user: data.user,
            csrfToken: data.csrfToken,
            isLoading: false,
            error: null
          });
          
          // Update API client with CSRF token
          authApiClient.setCsrfToken(data.csrfToken);
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      ) !== null;

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
      return false;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApiClient.post<{ message: string; userId: string }>(
        '/auth/register',
        data
      );

      return handleApiResponse(
        response,
        () => {
          set({
            isLoading: false,
            error: null
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      ) !== null;

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authApiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local state regardless of API call result
      set({
        user: null,
        csrfToken: null,
        isLoading: false,
        error: null
      });
      
      // Clear CSRF token from API client
      authApiClient.clearCsrfToken();
    }
  },

  refreshToken: async () => {
    try {
      const response = await authApiClient.post<{ user: User; csrfToken: string }>(
        '/auth/refresh'
      );

      return handleApiResponse(
        response,
        (data) => {
          set({
            user: data.user,
            csrfToken: data.csrfToken
          });
          
          // Update API client with new CSRF token
          authApiClient.setCsrfToken(data.csrfToken);
        },
        () => {
          // Token refresh failed, user needs to login again
          set({
            user: null,
            csrfToken: null,
            error: 'Session expired. Please login again.'
          });
          authApiClient.clearCsrfToken();
        }
      ) !== null;

    } catch (error) {
      set({
        user: null,
        csrfToken: null,
        error: 'Session expired. Please login again.'
      });
      authApiClient.clearCsrfToken();
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateUser: (userUpdate: Partial<User>) => {
    const { user } = get();
    if (user) {
      set({
        user: { ...user, ...userUpdate }
      });
    }
  },

  setCsrfToken: (token: string) => {
    set({ csrfToken: token });
    authApiClient.setCsrfToken(token);
  },

  // Auth checks
  isAuthenticated: () => {
    const { user } = get();
    return user !== null;
  },

  hasRole: (role: string) => {
    const { user } = get();
    return user?.role === role;
  },

  isEmailVerified: () => {
    const { user } = get();
    return user?.emailVerified === true;
  }
}));