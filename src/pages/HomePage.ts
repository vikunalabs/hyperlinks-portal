// Public home page for unauthenticated users

import { appRouter, ROUTES } from '../router';

export class HomePage {
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <div class="home-page">
        <!-- Navigation Bar -->
        <nav class="home-navbar">
          <div class="nav-container">
            <div class="nav-brand">
              <h1>Hyperlinks Management Portal</h1>
            </div>
            <div class="nav-buttons">
              <ui-button 
                type="button" 
                variant="secondary" 
                size="md"
                label="Login"
                id="loginButton">Login</ui-button>
              <ui-button 
                type="button" 
                variant="primary" 
                size="md"
                label="Register"
                id="registerButton">Register</ui-button>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="home-main">
          <div class="hero-section">
            <div class="hero-content">
              <h2>Welcome to Hyperlinks Management Portal</h2>
              <p>Organize, manage, and track your hyperlinks efficiently with our powerful platform.</p>
              <div class="hero-actions">
                <ui-button 
                  type="button" 
                  variant="primary" 
                  size="lg"
                  label="Get Started"
                  id="getStartedButton">Get Started</ui-button>
                <ui-button 
                  type="button" 
                  variant="secondary" 
                  size="lg"
                  label="Learn More"
                  id="learnMoreButton">Learn More</ui-button>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container) return;

    const loginButton = this.container.querySelector('#loginButton');
    const registerButton = this.container.querySelector('#registerButton');
    const getStartedButton = this.container.querySelector('#getStartedButton');
    const learnMoreButton = this.container.querySelector('#learnMoreButton');

    // Navigation buttons
    loginButton?.addEventListener('click', () => {
      appRouter.navigate(ROUTES.LOGIN);
    });

    registerButton?.addEventListener('click', () => {
      appRouter.navigate(ROUTES.REGISTER);
    });

    // Hero action buttons
    getStartedButton?.addEventListener('click', () => {
      appRouter.navigate(ROUTES.REGISTER);
    });

    learnMoreButton?.addEventListener('click', () => {
      // For now, just scroll to more info or navigate to register
      appRouter.navigate(ROUTES.REGISTER);
    });
  }

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}