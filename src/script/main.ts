import '../style/main.css'

// Import UI library components
import '@vikunalabs/ui-library';

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')!;
  
  app.innerHTML = `
    <div style="padding: 2rem; text-align: center;">
      <h1>Hyperlinks Management Platform</h1>
      <p>Setting up application architecture...</p>
    </div>
  `;
});