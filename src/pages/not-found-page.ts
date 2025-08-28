import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { simpleRouter } from '../router/simple-router';

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
    }

    .error-code {
      font-size: 8rem;
      font-weight: 700;
      color: var(--primary, #007bff);
      margin: 0;
      line-height: 1;
    }

    .error-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 1rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .error-description {
      font-size: 1.1rem;
      color: var(--text-secondary, #6c757d);
      margin: 0 0 2rem 0;
      max-width: 500px;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 6rem;
      }
      
      .error-title {
        font-size: 1.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `;

  private handleGoHome() {
    simpleRouter.navigate('/');
  }

  private handleGoBack() {
    window.history.back();
  }

  render() {
    return html`
      <div class="not-found-container">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-description">
          Sorry, we couldn't find the page you're looking for. 
          The link might be broken or the page may have been moved.
        </p>
        
        <div class="action-buttons">
          <ui-button 
            variant="primary" 
            size="large"
            @click=${this.handleGoHome}
          >
            Go Home
          </ui-button>
          
          <ui-button 
            variant="outline" 
            size="large"
            @click=${this.handleGoBack}
          >
            Go Back
          </ui-button>
        </div>
      </div>
    `;
  }
}