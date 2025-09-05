import { createStore } from 'zustand/vanilla';
import type { AppState, Notification } from '@/types/auth.types';

let notificationId = 0;

export const appStore = createStore<AppState>()((set, get) => ({
  isLoading: false,
  notifications: [],
  theme: 'light',
  
  showNotification: (notification: Notification) => {
    const id = notification.id || `notification-${++notificationId}`;
    const newNotification = { 
      ...notification, 
      id,
      duration: notification.duration ?? 5000,
      dismissible: notification.dismissible ?? true
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto-dismiss if duration is specified
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }, newNotification.duration);
    }
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  dismissNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  },

  setGlobalLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeApp: () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      get().setTheme(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      get().setTheme(prefersDark ? 'dark' : 'light');
    }
  }
}));