import '../style/main.css'

// Import stores
import { appStore } from '../stores';

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  // Initialize app
  appStore.getState().initializeApp();
  
  const app = document.getElementById('app')!;
  
  app.innerHTML = `
    <div style="padding: 2rem; text-align: center;">
      <h1>Hyperlinks Management Platform</h1>
      <p>Phase A.1: Core Infrastructure - Complete</p>
      <ul style="list-style: none; margin: 2rem 0;">
        <li>✓ HTTP Service Layer</li>
        <li>✓ CSRF Token Management</li>
        <li>✓ Authentication Service</li>
        <li>✓ Zustand State Management</li>
        <li>✓ Type Definitions</li>
      </ul>
    </div>
  `;
});