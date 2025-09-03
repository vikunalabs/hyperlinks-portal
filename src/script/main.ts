import '../styles/main.css'
import '../utils/error-handler';
import '../utils/performance';
import '../app';
import { logger } from '../utils/logger';

// Import stores
import { appStore } from '../stores';

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  // Initialize app
  appStore.getState().initializeApp();
  
  const appContainer = document.getElementById('app')!;
  
  if (appContainer) {
    // Secure: Create element instead of using innerHTML to prevent XSS
    const appElement = document.createElement('app-root');
    appContainer.appendChild(appElement);
  } else {
    logger.error('App container not found', null, { component: 'main' });
  }
});