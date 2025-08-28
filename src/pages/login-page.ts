import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authStore } from '../stores/auth-store';
import { simpleRouter } from '../router/simple-router';
import type { LoginCredentials } from '../types/auth';

@customElement('login-page')
export class LoginPage extends LitElement {
  @state()
  private isLoading = false;

  @state()
  private error: string | null = null;

  private authStore = authStore;

  connectedCallback() {
    super.connectedCallback();
    console.log('[LoginPage] Connected - initial error:', typeof this.error, this.error);
    console.log('[LoginPage] Auth store error:', typeof this.authStore.getState().error, this.authStore.getState().error);
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-secondary, #f8f9fa);
    }

    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .login-subtitle {
      color: var(--text-secondary, #6c757d);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 1.5rem 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-light, #e5e5e5);
    }

    .divider span {
      padding: 0 1rem;
      color: var(--text-secondary, #6c757d);
      font-size: 0.875rem;
    }

    .oauth-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .forgot-password {
      text-align: center;
      margin-top: 1rem;
    }

    .forgot-password a {
      color: var(--primary, #007bff);
      text-decoration: none;
      font-size: 0.875rem;
    }

    .forgot-password a:hover {
      text-decoration: underline;
    }

    .register-link {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-light, #e5e5e5);
    }

    .register-link a {
      color: var(--primary, #007bff);
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `;

  private async handleLogin(event: Event) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const credentials: LoginCredentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    this.isLoading = true;
    this.error = null;

    try {
      const success = await this.authStore.getState().login(credentials);
      
      if (success) {
        // Router guard will handle redirect to dashboard
        simpleRouter.navigate('/dashboard');
      } else {
        this.error = this.authStore.getState().error || 'Login failed';
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Login failed';
    } finally {
      this.isLoading = false;
    }
  }

  private handleOAuthLogin(provider: string) {
    // This would integrate with your OAuth implementation
    console.log(`OAuth login with ${provider} - to be implemented`);
  }

  private handleForgotPassword() {
    simpleRouter.navigate('/forgot-password');
  }

  private handleRegister() {
    simpleRouter.navigate('/register');
  }

  render() {
    return html`
      <div class="login-container">
        <ui-card 
          classes="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full max-w-md mx-auto"
        >
          <div class="login-header">
            <h1 class="login-title">Welcome Back</h1>
            <p class="login-subtitle">Sign in to your account</p>
          </div>
          
          ${this.error ? html`
            <ui-alert 
              variant="error" 
              message="${this.error}"
              dismissible
              @ui-alert-close="${() => this.error = null}"
              classes="mb-4"
              errorClasses="bg-red-50 border-red-200 text-red-800 p-3 rounded-md"
              iconClasses="text-red-500"
              closeButtonClasses="text-red-500 hover:text-red-700"
            ></ui-alert>
          ` : ''}

          <form @submit="${this.handleLogin}" class="login-form">
            <ui-input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              required
              classes="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            ></ui-input>

            <ui-input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              required
              classes="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            ></ui-input>

            <div class="form-actions">
              <ui-button 
                type="submit"
                ?disabled="${this.isLoading}"
                classes="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm"
                disabledClasses="opacity-50 cursor-not-allowed"
              >
                ${this.isLoading ? html`
                  <ui-loading-spinner classes="w-4 h-4 mr-2 animate-spin"></ui-loading-spinner>
                  Signing in...
                ` : 'Sign In'}
              </ui-button>
            </div>
          </form>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="oauth-buttons">
            <ui-button
              @click="${() => this.handleOAuthLogin('google')}"
              classes="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 font-medium transition-colors"
            >
              Continue with Google
            </ui-button>
          </div>

          <div class="forgot-password">
            <a href="#" @click="${this.handleForgotPassword}">
              Forgot your password?
            </a>
          </div>

          <div class="register-link">
            <span>Don't have an account? </span>
            <a href="#" @click="${this.handleRegister}">
              Sign up
            </a>
          </div>
        </ui-card>
      </div>
    `;
  }
}