import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseComponent } from './components/shared/base-component';
import { PerformanceMonitor, measurePerformance } from './utils/performance';
import { ErrorHandler } from './utils/error-handler';
import { appRouter } from './router';

// Import core components (always needed)
import './components/layout/navbar';
import './components/layout/footer';  
import './components/pages/home';
import './components/ui/button';
import './components/ui/icon';

@customElement('app-root')
export class AppRoot extends BaseComponent {
  @state()
  protected isLoading: boolean = true;
  
  @state()
  protected hasError: boolean = false;
  
  @state()
  protected currentPage: string = 'home-content';
  
  @state()
  protected isPageLoading: boolean = false;

  private performanceMonitor = PerformanceMonitor.getInstance();
  private errorHandler = ErrorHandler.getInstance();

  static styles = [
    ...BaseComponent.styles,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }

      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
      }

      .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid var(--color-gray-200);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .error-boundary {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: var(--spacing-8);
        text-align: center;
        background: var(--color-gray-50);
      }

      .error-title {
        font-size: var(--font-size-2xl);
        font-weight: 600;
        color: var(--color-gray-800);
        margin-bottom: var(--spacing-4);
      }

      .error-message {
        color: var(--color-gray-600);
        margin-bottom: var(--spacing-6);
        max-width: 400px;
      }

      .main-content {
        flex: 1;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
        }
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.performanceMonitor.markStart('app-initialization');
    this.initializeApp();
    
    // Listen for router events
    this.addEventListener('route-change', this.handleRouteChange);
    this.addEventListener('route-loading', this.handleRouteLoading);
    this.addEventListener('navigate-to-home', this.handleHomeNavigation);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up event listeners to prevent memory leaks
    this.removeEventListener('route-change', this.handleRouteChange);
    this.removeEventListener('route-loading', this.handleRouteLoading);
    this.removeEventListener('navigate-to-home', this.handleHomeNavigation);
  }

  @measurePerformance('app-initialization')
  private async initializeApp(): Promise<void> {
    try {
      // Simulate app initialization (loading config, user data, etc.)
      await this.loadAppData();
      
      // Initialize the router
      await appRouter.init();
      
      // Report web vitals after app is loaded
      this.performanceMonitor.reportWebVitals();
      
      this.isLoading = false;
    } catch (error) {
      this.errorHandler.handleError(error as Error, { 
        component: 'AppRoot', 
        method: 'initializeApp' 
      });
      this.hasError = true;
      this.isLoading = false;
    }
  }

  private async loadAppData(): Promise<void> {
    // Simulate async data loading - reduced delay for better UX
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  private handleRetry = () => {
    this.hasError = false;
    this.isLoading = true;
    this.initializeApp();
  };
  
  private handleHomeNavigation = () => {
    appRouter.navigate('/');
  };
  
  private handleRouteChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { componentTag } = customEvent.detail;
    this.currentPage = componentTag;
  };
  
  private handleRouteLoading = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { loading } = customEvent.detail;
    this.isPageLoading = loading;
  };
  
  private renderCurrentPage() {
    if (this.isPageLoading) {
      return html`
        <div class="loading-spinner">
          <div class="spinner" aria-label="Loading page"></div>
        </div>
      `;
    }
    
    // Render component based on the componentTag from router
    switch (this.currentPage) {
      case 'terms-of-service-page':
        return html`<terms-of-service-page></terms-of-service-page>`;
      case 'privacy-policy-page':
        return html`<privacy-policy-page></privacy-policy-page>`;
      case 'home-content':
      default:
        return html`<home-content></home-content>`;
    }
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="loading-spinner">
          <div class="spinner" aria-label="Loading application"></div>
        </div>
      `;
    }

    if (this.hasError) {
      return html`
        <div class="error-boundary" role="alert">
          <h1 class="error-title">Oops! Something went wrong</h1>
          <p class="error-message">
            We're sorry, but there was an error loading the application. 
            Please try refreshing the page or contact support if the problem persists.
          </p>
          <ui-button variant="primary" @click="${this.handleRetry}">
            Try Again
          </ui-button>
        </div>
      `;
    }

    return html`
      <div class="app-container">
        <app-navbar></app-navbar>
        <main class="main-content">
          ${this.renderCurrentPage()}
        </main>
        <app-footer></app-footer>
      </div>
    `;
  }
}