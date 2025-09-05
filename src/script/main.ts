import '../style/main.css'

// Import stores
import { appStore } from '../stores';

// Import router
import { appRouter } from '../router';

// Import scrollbar utilities
import { setScrollbarWidthProperty } from '../utils/scrollbar';

// Application entry point
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize scrollbar width for modal compensation
  setScrollbarWidthProperty();
  
  // Initialize app
  appStore.getState().initializeApp();
  
  // Initialize router
  await appRouter.init();
});