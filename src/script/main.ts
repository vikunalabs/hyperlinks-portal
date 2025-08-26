import '../style/main.css'

// Import your UI library components
import '@vikunalabs/ui-library/ui';
import '@vikunalabs/ui-library/auth'; 
import '@vikunalabs/ui-library/features';

// Your app-specific code goes here
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')!;
  
  // Example usage of your library components
  app.innerHTML = `
    <div style="padding: 2rem;">
      <h1>Hyperlinks Portal</h1>
      <p>Using @vikunalabs/ui-library components:</p>
      
      <div style="margin: 1rem 0;">
        <ui-button classes="btn-primary">Click Me</ui-button>
        <ui-input placeholder="Enter something" classes="input-style"></ui-input>
      </div>
      
      <div style="margin: 1rem 0;">
        <url-shorten-form classes="form-wrapper"></url-shorten-form>
      </div>
    </div>
  `;
});