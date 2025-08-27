import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { useAuthStore } from '../stores/auth-store';
import { router } from '../router';
import type { RegisterData } from '../types/auth';

@customElement('register-page')
export class RegisterPage extends LitElement {
  @state()
  private isLoading = false;

  @state()
  private error: string | null = null;

  @state()
  private success: string | null = null;

  private authStore = useAuthStore;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-secondary, #f8f9fa);
    }

    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .register-card {
      width: 100%;
      max-width: 450px;
    }

    .register-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .register-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .register-subtitle {
      color: var(--text-secondary, #6c757d);
      margin: 0;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row ui-input {
      flex: 1;
    }

    .terms-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1rem 0;
    }

    .terms-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .terms-text {
      font-size: 0.875rem;
      color: var(--text-secondary, #6c757d);
      line-height: 1.4;
    }

    .terms-text a {
      color: var(--primary, #007bff);
      text-decoration: none;
    }

    .terms-text a:hover {
      text-decoration: underline;
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

    .login-link {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-light, #e5e5e5);
    }

    .login-link a {
      color: var(--primary, #007bff);
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
    }
  `;

  private async handleRegister(event: Event) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Validate checkboxes
    const agreeToTerms = formData.has('agreeToTerms');
    const consentToDataProcessing = formData.has('consentToDataProcessing');
    
    if (!agreeToTerms) {
      this.error = 'Please accept the Terms of Service to continue';
      return;
    }
    
    if (!consentToDataProcessing) {
      this.error = 'Please consent to data processing to continue';
      return;
    }

    // Validate password confirmation
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    
    const registerData: RegisterData = {
      email: formData.get('email') as string,
      password: password,
      name: formData.get('name') as string || undefined,
      organization: formData.get('organization') as string || undefined,
      agreeToTerms,
      consentToDataProcessing
    };

    this.isLoading = true;
    this.error = null;
    this.success = null;

    try {
      const success = await this.authStore.getState().register(registerData);
      
      if (success) {
        this.success = 'Account created successfully! Please check your email to verify your account.';
        form.reset();
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.navigate('/login');
        }, 3000);
      } else {
        this.error = this.authStore.getState().error || 'Registration failed';
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Registration failed';
    } finally {
      this.isLoading = false;
    }
  }

  private handleOAuthRegister(provider: string) {
    // This would integrate with your OAuth implementation
    console.log(`OAuth register with ${provider} - to be implemented`);
  }

  private handleLogin() {
    router.navigate('/login');
  }

  render() {
    return html`
      <div class="register-container">
        <ui-card class="register-card">
          <div slot="content">
            <div class="register-header">
              <h1 class="register-title">Create Account</h1>
              <p class="register-subtitle">Join thousands of users shortening their links</p>
            </div>

            ${this.error ? html`
              <ui-alert variant="error" style="margin-bottom: 1.5rem;">
                ${this.error}
              </ui-alert>
            ` : ''}

            ${this.success ? html`
              <ui-alert variant="success" style="margin-bottom: 1.5rem;">
                ${this.success}
              </ui-alert>
            ` : ''}

            <form class="register-form" @submit=${this.handleRegister}>
              <ui-input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              ></ui-input>

              <div class="form-row">
                <ui-input
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                ></ui-input>

                <ui-input
                  label="Organization"
                  name="organization"
                  type="text"
                  placeholder="Company (optional)"
                ></ui-input>
              </div>

              <ui-input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
              ></ui-input>

              <ui-input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              ></ui-input>

              <div class="terms-section">
                <div class="terms-row">
                  <ui-checkbox name="agreeToTerms" required></ui-checkbox>
                  <div class="terms-text">
                    I agree to the <a href="/terms" target="_blank">Terms of Service</a> 
                    and <a href="/privacy" target="_blank">Privacy Policy</a>
                  </div>
                </div>
                
                <div class="terms-row">
                  <ui-checkbox name="consentToDataProcessing" required></ui-checkbox>
                  <div class="terms-text">
                    I consent to the processing of my personal data for account creation 
                    and service provision as described in the Privacy Policy
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <ui-button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  ?loading=${this.isLoading}
                  style="width: 100%;"
                >
                  Create Account
                </ui-button>
              </div>
            </form>

            <div class="divider">
              <span>Or continue with</span>
            </div>

            <div class="oauth-buttons">
              <ui-button 
                variant="outline" 
                style="width: 100%;"
                @click=${() => this.handleOAuthRegister('google')}
              >
                <span style="margin-right: 0.5rem;">🔍</span>
                Sign up with Google
              </ui-button>
              
              <ui-button 
                variant="outline" 
                style="width: 100%;"
                @click=${() => this.handleOAuthRegister('github')}
              >
                <span style="margin-right: 0.5rem;">📂</span>
                Sign up with GitHub
              </ui-button>
            </div>

            <div class="login-link">
              <p>
                Already have an account? 
                <a href="#" @click=${(e: Event) => { e.preventDefault(); this.handleLogin(); }}>
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </ui-card>
      </div>
    `;
  }
}