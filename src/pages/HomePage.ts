import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '../components/LoginModal';
import '../components/RegisterModal';
import '../components/ForgotPasswordModal';

@customElement('home-page')
export class HomePage extends LitElement {
  @query('login-modal') private loginModal!: any;
  @query('register-modal') private registerModal!: any;
  @query('forgot-password-modal') private forgotPasswordModal!: any;
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      background-color: #ffffff;
      color: #212529;
      overflow: hidden;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #ffffff;
      border-bottom: 1px solid #dee2e6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin: 0;
    }

    .navbar-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .main-content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 80px);
      padding: 2rem;
      overflow: hidden;
    }

    .hero-section {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #212529;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: #6c757d;
      margin-bottom: 3rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 500;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: transparent;
      color: #007bff;
      border: 2px solid #007bff;
    }

    .btn-secondary:hover {
      background-color: #007bff;
      color: white;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      .navbar-title {
        font-size: 1.2rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .navbar-buttons {
        gap: 0.5rem;
      }
      
      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `;

  render() {
    return html`
      <nav class="navbar">
        <h1 class="navbar-title">Hyperlinks Management Platform</h1>
        <div class="navbar-buttons">
          <button class="btn btn-secondary" @click=${this.navigateToLogin}>Login</button>
          <button class="btn btn-primary" @click=${this.navigateToRegister}>Register</button>
        </div>
      </nav>
      
      <div class="main-content">
        <div class="hero-section">
          <h1 class="hero-title">Welcome</h1>
          <p class="hero-subtitle">Organize and manage your hyperlinks efficiently</p>
        </div>
      </div>
      
      <login-modal @open-register-modal=${this.handleOpenRegisterModal} @open-forgot-password-modal=${this.handleOpenForgotPasswordModal}></login-modal>
      <register-modal @open-login-modal=${this.handleOpenLoginModal}></register-modal>
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
}