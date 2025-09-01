import '../style/main.css';

// Import stores
import { appStore } from '../stores';
import { appRouter } from '../router';

// Import pages
import '../pages/public/HomePage';
import '../pages/public/TermsPage';
import '../pages/public/PrivacyPage';

// Import protected pages
import '../pages/protected/DashboardPage';
import '../pages/protected/MyLinksPage';
import '../pages/protected/QRCodesPage';
import '../pages/protected/AnalyticsPage';
import '../pages/protected/ProfilePage';

// Application entry point
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize app
  appStore.getState().initializeApp();
  
  // Initialize router
  await appRouter.init();
});