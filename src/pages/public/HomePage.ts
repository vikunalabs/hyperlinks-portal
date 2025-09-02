import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { authService } from '../../services/auth.service';
import '../../components/forms/LoginModal';
import '../../components/forms/RegisterModal';
import '../../components/forms/ForgotPasswordModal';

@customElement('home-page')
export class HomePage extends LitElement {
  @query('login-modal') private loginModal!: any;
  @query('register-modal') private registerModal!: any;
  @query('forgot-password-modal') private forgotPasswordModal!: any;
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      overflow: hidden;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-sticky);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-xl);
      background-color: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-md);
    }

    .navbar-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
      text-decoration: none;
    }

    .navbar-title:hover {
      color: var(--color-primary);
      transition: color var(--transition-base);
    }

    .navbar-buttons {
      display: flex;
      gap: var(--space-md);
      align-items: center;
    }

    .btn {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      border: 2px solid transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      text-decoration: none;
      display: inline-block;
      min-width: 120px;
      text-align: center;
      line-height: var(--line-height-base);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      transform: translateY(-1px);
    }

    .main-content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 80px);
      padding: var(--space-xl);
      overflow: hidden;
    }

    .hero-section {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-md);
      color: var(--text-primary);
    }

    .hero-subtitle {
      font-size: var(--font-size-xl);
      color: var(--text-secondary);
      margin-bottom: var(--space-2xl);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: var(--space-md);
        padding: var(--space-md);
      }
      
      .navbar-title {
        font-size: var(--font-size-xl);
      }
      
      .navbar-buttons {
        gap: var(--space-sm);
      }
      
      .btn {
        padding: var(--space-sm) var(--space-md);
        font-size: var(--font-size-sm);
        min-width: 100px;
      }
      
      .hero-title {
        font-size: var(--font-size-3xl);
      }
      
      .hero-subtitle {
        font-size: var(--font-size-md);
      }
    }
  `;

  render() {
    return html`
      <nav class="navbar">
        <h1 class="navbar-title">Hyperlinks Management Platform</h1>
        <div class="navbar-buttons">
          <button class="btn btn-secondary" @click=${this.navigateToLogin}>Sign In</button>
          <button class="btn btn-primary" @click=${this.navigateToRegister}>Get Started</button>
        </div>
      </nav>
      
      <div class="main-content">
        <div class="hero-section">
          <h1 class="hero-title">Welcome</h1>
          <p class="hero-subtitle">Organize and manage your hyperlinks efficiently</p>
        </div>
      </div>
      
      <login-modal @open-register-modal=${this.handleOpenRegisterModal} @forgot-password=${this.handleOpenForgotPasswordModal} @show-register=${this.handleOpenRegisterModal} @google-login=${this.handleGoogleLogin}></login-modal>
      <register-modal @open-login-modal=${this.handleOpenLoginModal} @google-signup=${this.handleGoogleSignup}></register-modal>
      <forgot-password-modal @open-login-modal=${this.handleOpenLoginModal}></forgot-password-modal>
    `;
  }

  private navigateToLogin() {
    this.loginModal?.open();
  }

  private navigateToRegister() {
    this.registerModal?.open();
  }

  private handleOpenLoginModal() {
    this.loginModal?.open();
  }

  private handleOpenRegisterModal() {
    this.registerModal?.open();
  }

  private handleOpenForgotPasswordModal() {
    this.forgotPasswordModal?.open();
  }

  private handleGoogleLogin() {
    authService.initiateGoogleLogin();
  }

  private handleGoogleSignup() {
    // Both login and signup use the same Google OAuth flow
    authService.initiateGoogleLogin();
  }
}