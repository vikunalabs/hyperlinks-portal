import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';

export abstract class BaseLayout extends BaseComponent {
  @property({ type: Boolean }) isLoading = false;
  @property({ type: String }) errorMessage = '';

  static styles = [
    ...BaseComponent.styles,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }

      .layout-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid var(--color-gray-200);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .error-banner {
        background-color: var(--color-red-50);
        border: 1px solid var(--color-red-200);
        color: var(--color-red-800);
        padding: var(--spacing-3);
        text-align: center;
        position: relative;
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

  protected renderLoadingOverlay() {
    return this.isLoading ? html`
      <div class="loading-overlay">
        <div class="spinner" aria-label="Loading"></div>
      </div>
    ` : '';
  }

  protected renderErrorBanner() {
    return this.errorMessage ? html`
      <div class="error-banner" role="alert">
        ${this.errorMessage}
      </div>
    ` : '';
  }

  abstract render(): unknown;
}