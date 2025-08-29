import { createStore } from 'zustand/vanilla';
import type { AuthState, LoginCredentials, RegistrationData, User } from '../types/auth.types';
import { authService } from '../services/auth.service';

export const authStore = createStore<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  isLoading: false,
  isRefreshing: false,
  
  error: null,
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed',
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  register: async (data: RegistrationData) => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.register(data);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Registration failed',
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null,
        isRefreshing: false
      });
    } catch (error) {
      // Even if logout fails, clear local state
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null,
        isRefreshing: false
      });
      console.warn('[Auth Store] Logout failed, but cleared local state:', error);
    }
  },

  refreshToken: async () => {
    if (get().isRefreshing) return;
    
    set({ isRefreshing: true, error: null });
    
    try {
      const user = await authService.refreshToken();
      set({ 
        user, 
        isAuthenticated: true, 
        isRefreshing: false,
        error: null
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await authService.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile'
      });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: user !== null,
      error: null
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isRefreshing: false,
      error: null
    });
  }
}));