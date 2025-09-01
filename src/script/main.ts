import '../style/main.css';

// Import stores
import { appStore } from '../stores';
import { appRouter } from '../router';

// Import components
import '../pages/HomePage';

// Application entry point
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize app
  appStore.getState().initializeApp();
  
  // Initialize router
  await appRouter.init();
});