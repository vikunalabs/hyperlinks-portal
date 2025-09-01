import '../style/main.css';

// Import stores
import { appStore } from '../stores';
import { appRouter } from '../router';

// Import pages
import '../pages/public/HomePage';
import '../pages/public/TermsPage';
import '../pages/public/PrivacyPage';

// Application entry point
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize app
  appStore.getState().initializeApp();
  
  // Initialize router
  await appRouter.init();
});