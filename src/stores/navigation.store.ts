import { createStore } from 'zustand/vanilla';

interface NavigationState {
  // Current active route
  activeRoute: string;
  
  // Settings dropdown state
  isSettingsOpen: boolean;
  
  // Page title
  pageTitle: string;
  
  // Actions
  setActiveRoute: (route: string) => void;
  setPageTitle: (title: string) => void;
  toggleSettings: () => void;
  closeSettings: () => void;
  
  // Navigation handler
  navigateToRoute: (route: string) => void;
}

export const navigationStore = createStore<NavigationState>((set, get) => ({
  // Initial state
  activeRoute: '',
  isSettingsOpen: false,
  pageTitle: '',

  // Actions
  setActiveRoute: (route: string) => {
    set({ activeRoute: route });
  },

  setPageTitle: (title: string) => {
    set({ pageTitle: title });
  },

  toggleSettings: () => {
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen }));
  },

  closeSettings: () => {
    set({ isSettingsOpen: false });
  },

  navigateToRoute: (route: string) => {
    // Close settings when navigating
    get().closeSettings();
    
    // Set the new route
    get().setActiveRoute(route);
    
    // Update page title based on route
    const routeTitleMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/links': 'My Links',
      '/qr-codes': 'QR Codes', 
      '/analytics': 'Analytics',
      '/profile': 'Profile',
      '/settings/account': 'Account Settings',
      '/settings/security': 'Security Settings',
      '/settings/billing': 'Billing Settings',
      '/support': 'Support'
    };
    
    const title = routeTitleMap[route] || 'Dashboard';
    get().setPageTitle(title);
    
    // Navigate using router
    import('../router').then(({ appRouter }) => {
      appRouter.navigate(route);
    });
  }
}));