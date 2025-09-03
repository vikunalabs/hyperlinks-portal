import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';
import { logger } from '../../utils/logger';
import { appRouter } from '../../router';
import type { ModalComponent } from '../../types';
import '../ui/button';
import '../modals/login-modal';
import '../modals/register-modal';
import '../modals/forgot-password-modal';

@customElement('app-navbar')
export class Navbar extends BaseComponent {
  @property({ type: String }) brandName = 'Hyperlinks Portal';

  @query('login-modal')
  private loginModal!: ModalComponent;

  @query('register-modal')
  private registerModal!: ModalComponent;

  @query('forgot-password-modal')
  private forgotPasswordModal!: ModalComponent;

  static styles = [
    ...BaseComponent.styles,
    css`
      nav {
        background-color: white;
        box-shadow: var(--shadow-lg);
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid var(--color-gray-100);
      }

      .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-4);
      }

      .navbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .brand-section {
        display: flex;
        align-items: center;
        padding: var(--spacing-4) 0;
      }

      .brand-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--color-gray-800);
      }

      .brand-name {
        font-size: var(--font-size-lg);
        font-weight: 600;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }

      @media (max-width: 768px) {
        .nav-actions {
          gap: var(--spacing-2);
        }
        
        .brand-name {
          font-size: var(--font-size-base);
        }
      }
    `
  ];

  private handleLoginClick = () => {
    this.loginModal?.open();
  };

  private handleRegisterClick = () => {
    this.registerModal?.open();
  };

  private handleLoginSuccess = (e: CustomEvent) => {
    logger.analytics('login_success', e.detail, { component: 'Navbar' });
    // Handle successful login (e.g., update user state, navigate)
  };

  private handleRegisterSuccess = (e: CustomEvent) => {
    logger.analytics('registration_success', e.detail, { component: 'Navbar' });
    // Handle successful registration (e.g., update user state, navigate)
  };

  private handleGoogleSignIn = () => {
    logger.analytics('google_signin_clicked', {}, { component: 'Navbar' });
    // Handle Google sign-in
  };

  private handleGoogleSignUp = () => {
    logger.analytics('google_signup_clicked', {}, { component: 'Navbar' });
    // Handle Google sign-up
  };

  private handleForgotPassword = () => {
    this.loginModal?.close();
    
    // Use a small delay for smooth transition
    setTimeout(() => {
      this.forgotPasswordModal?.open();
    }, 150);
  };

  private handleNavigateSignup = () => {
    // Close login modal and open register modal with smooth transition
    this.loginModal?.close();
    
    // Use a small delay for smooth transition
    setTimeout(() => {
      this.registerModal?.open();
    }, 150);
  };

  private handleNavigateSignin = () => {
    // Close register modal and open login modal with smooth transition
    this.registerModal?.close();
    
    // Use a small delay for smooth transition  
    setTimeout(() => {
      this.loginModal?.open();
    }, 150);
  };

  private handleBackToLogin = () => {
    // Close forgot password modal and open login modal
    this.forgotPasswordModal?.close();
    
    // Use a small delay for smooth transition
    setTimeout(() => {
      this.loginModal?.open();
    }, 150);
  };

  private handleBrandClick = (e: Event) => {
    e.preventDefault();
    appRouter.navigate('/');
  };

  render() {
    return html`
      <nav>
        <div class="navbar-container">
          <div class="navbar-content">
            <div class="brand-section">
              <a href="/" class="brand-link" @click="${this.handleBrandClick}">
                <span class="brand-name">${this.brandName}</span>
              </a>
            </div>
            <div class="nav-actions">
              <ui-button variant="ghost" size="sm" @click="${this.handleLoginClick}">
                Login
              </ui-button>
              <ui-button variant="primary" size="sm" @click="${this.handleRegisterClick}">
                Register
              </ui-button>
            </div>
          </div>
        </div>
      </nav>
      
      <login-modal
        @login-success="${this.handleLoginSuccess}"
        @google-signin-clicked="${this.handleGoogleSignIn}"
        @forgot-password-clicked="${this.handleForgotPassword}"
        @navigate-to-signup="${this.handleNavigateSignup}"
      ></login-modal>
      
      <register-modal
        @register-success="${this.handleRegisterSuccess}"
        @google-signup-clicked="${this.handleGoogleSignUp}"
        @navigate-to-signin="${this.handleNavigateSignin}"
      ></register-modal>
      
      <forgot-password-modal
        @back-to-login="${this.handleBackToLogin}"
      ></forgot-password-modal>
    `;
  }
}