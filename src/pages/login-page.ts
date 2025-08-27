import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { useAuthStore } from '../stores/auth-store';
import { router } from '../router';
import type { LoginCredentials } from '../types/auth';

@customElement('login-page')
export class LoginPage extends LitElement {
  @state()
  private isLoading = false;

  @state()
  private error: string | null = null;

  private authStore = useAuthStore;

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
        router.navigate('/dashboard');
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
    router.navigate('/forgot-password');
  }

  private handleRegister() {
    router.navigate('/register');
  }

  render() {
    return html`
      <div class="login-container">
        <ui-card class="login-card">
          <div slot="content">
            <div class="login-header">
              <h1 class="login-title">Welcome Back</h1>
              <p class="login-subtitle">Sign in to your account to continue</p>
            </div>

            ${this.error ? html`
              <ui-alert variant="error" style="margin-bottom: 1.5rem;">
                ${this.error}
              </ui-alert>
            ` : ''}

            <form class="login-form" @submit=${this.handleLogin}>
              <ui-input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              ></ui-input>

              <ui-input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              ></ui-input>

              <div class="form-actions">
                <ui-button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  ?loading=${this.isLoading}
                  style="width: 100%;"
                >
                  Sign In
                </ui-button>
              </div>
            </form>

            <div class="forgot-password">
              <a href="#" @click=${(e: Event) => { e.preventDefault(); this.handleForgotPassword(); }}>
                Forgot your password?
              </a>
            </div>

            <div class="divider">
              <span>Or continue with</span>
            </div>

            <div class="oauth-buttons">
              <ui-button 
                variant="outline" 
                style="width: 100%;"
                @click=${() => this.handleOAuthLogin('google')}
              >
                <span style="margin-right: 0.5rem;">🔍</span>
                Continue with Google
              </ui-button>
              
              <ui-button 
                variant="outline" 
                style="width: 100%;"
                @click=${() => this.handleOAuthLogin('github')}
              >
                <span style="margin-right: 0.5rem;">📂</span>
                Continue with GitHub
              </ui-button>
            </div>

            <div class="register-link">
              <p>
                Don't have an account? 
                <a href="#" @click=${(e: Event) => { e.preventDefault(); this.handleRegister(); }}>
                  Create one now
                </a>
              </p>
            </div>
          </div>
        </ui-card>
      </div>
    `;
  }
}