import '../style/main.css'

// Import UI library components
import '@vikunalabs/ui-library';


// Import stores and router
import { appStore } from '../stores';
import { appRouter } from '../router';

// Application entry point
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize app store
    appStore.getState().initializeApp();
    
    // Initialize and start the router
    await appRouter.init();
    
    console.log('[App] Application initialized successfully');
  } catch (error) {
    console.error('[App] Failed to initialize application:', error);
    
    // Show error fallback
    const app = document.getElementById('app')!;
    app.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: red;">
        <h1>Application Error</h1>
        <p>Failed to initialize the application. Please refresh the page.</p>
        <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `;
  }
});