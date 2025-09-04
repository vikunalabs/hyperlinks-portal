import '../style/main.css'

// Import stores
import { appStore } from '../stores';

// Import home page component
import '../components/home-page';

// Import scrollbar utilities
import { setScrollbarWidthProperty } from '../utils/scrollbar';

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scrollbar width for modal compensation
  setScrollbarWidthProperty();
  
  // Initialize app
  appStore.getState().initializeApp();
  
  const app = document.getElementById('app')!;
  
  // Render the home page component
  app.innerHTML = `<home-page></home-page>`;
});