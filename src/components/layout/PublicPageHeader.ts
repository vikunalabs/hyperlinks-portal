import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('public-page-header')
export class PublicPageHeader extends LitElement {
  @property() pageTitle = '';
  @property({ type: Boolean }) showButtons = false;

  static styles = css`
    .header {
      background: #ffffff;
      border-bottom: 1px solid #dee2e6;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 600;
      color: #007bff;
      text-decoration: none;
    }

    .brand:hover {
      color: #0056b3;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin: 0;
    }

    .back-btn {
      background: none;
      border: none;
      color: #007bff;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
    }

    .back-btn:hover {
      background-color: #f8f9fa;
    }

    .auth-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn {
      padding: 0.5rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 500;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-secondary {
      background-color: transparent;
      color: #007bff;
      border: 2px solid #007bff;
    }

    .btn-secondary:hover {
      background-color: #007bff;
      color: white;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    @media (max-width: 768px) {
      .header {
        padding: 1rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .page-title {
        font-size: 1.25rem;
      }
    }
  `;

  render() {
    return html`
      <header class="header">
        <div class="header-content">
          <a href="/" class="brand">Hyperlinks Management Platform</a>
          ${this.pageTitle ? html`<h1 class="page-title">${this.pageTitle}</h1>` : ''}
          ${this.showButtons 
            ? html`
              <div class="auth-buttons">
                <button class="btn btn-secondary" @click=${this.handleLoginClick}>Login</button>
                <button class="btn btn-primary" @click=${this.handleRegisterClick}>Register</button>
              </div>
            `
            : html`<a href="/" class="back-btn">← Back to Home</a>`
          }
        </div>
      </header>
    `;
  }

  private handleLoginClick() {
    this.dispatchEvent(new CustomEvent('login-clicked', { 
      bubbles: true,
      composed: true 
    }));
  }

  private handleRegisterClick() {
    this.dispatchEvent(new CustomEvent('register-clicked', { 
      bubbles: true,
      composed: true 
    }));
  }
}