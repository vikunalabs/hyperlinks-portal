import '../style/main.css'

// Import stores
import { appStore } from '../stores';

// Import home page component
import '../components/home-page';

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  // Initialize app
  appStore.getState().initializeApp();
  
  const app = document.getElementById('app')!;
  
  // Render the home page component
  app.innerHTML = `<home-page></home-page>`;
});