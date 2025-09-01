import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authService } from '@/services/auth.service';
import { isValidUsernameOrEmail, ValidationMessages } from '../../utils';
import { EyeIcon, EyeOffIcon } from '../../shared/icons';
import { allModalStyles } from '../../shared/styles/modal-styles';

@customElement('login-modal')
export class LoginModal extends LitElement {
  @state() private isOpen = false;
  @state() private showPassword = false;
  @state() private username = '';
  @state() private password = '';
  @state() private rememberMe = false;
  @state() private isLoading = false;
  @state() private error = '';
  @state() private usernameTouched = false;
  @state() private passwordTouched = false;
  
  private previousActiveElement: Element | null = null;

  static styles = [
    ...allModalStyles,
    css`
      /* LoginModal specific styles only */
      .modal {
        max-width: 400px; /* Small modal size for login */
      }

      .checkbox-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-lg);
      }

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      .checkbox-container input[type="checkbox"] {
        width: auto;
        margin: 0;
      }

      .checkbox-container label {
        margin: 0;
        font-size: var(--font-size-sm);
        cursor: pointer;
      }

      .forgot-password {
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        transition: color var(--transition-base);
      }

      .forgot-password:hover {
        color: var(--color-primary-hover);
        text-decoration: underline;
      }

      .google-icon {
        width: 18px;
        height: 18px;
      }

      .divider {
        display: flex;
        align-items: center;
        margin: var(--space-lg) 0;
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: var(--border-color);
      }

      .divider span {
        padding: 0 var(--space-md);
      }
    `
  ];

  render() {
    const isFormValid = isValidUsernameOrEmail(this.username) && this.password.length >= 6;
    const hasUsernameError = this.usernameTouched && !isValidUsernameOrEmail(this.username);
    const hasPasswordError = this.passwordTouched && this.password.length < 6;
    
    return html`
      <div class="modal-backdrop ${this.isOpen ? 'open' : ''}" @click=${this.handleBackdropClick}>
        <div class="modal modal-sm" @click=${this.handleModalClick}>
          <button class="close-btn" @click=${this.close} aria-label="Close modal">
            &times;
          </button>
          
          <div class="modal-header">
            <h2 class="modal-title">Welcome Back</h2>
            <p class="modal-subtitle">Sign in to your account</p>
          </div>

          ${this.error ? html`
            <div class="form-error" style="text-align: center; margin-bottom: var(--space-lg);">
              ${this.error}
            </div>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label class="form-label" for="username">Email or Username</label>
              <input
                type="text"
                id="username"
                class="form-input"
                .value=${this.username}
                @input=${this.handleUsernameInput}
                @blur=${this.handleUsernameBlur}
                ?disabled=${this.isLoading}
                placeholder="Enter your email or username"
                autocomplete="username"
                aria-describedby=${hasUsernameError ? 'username-error' : ''}
                aria-invalid=${hasUsernameError}
              />
              ${hasUsernameError ? html`
                <span id="username-error" class="form-error">${ValidationMessages.INVALID_USERNAME_OR_EMAIL}</span>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <div class="password-input-container">
                <input
                  type=${this.showPassword ? 'text' : 'password'}
                  id="password"
                  class="form-input"
                  .value=${this.password}
                  @input=${this.handlePasswordInput}
                  @blur=${this.handlePasswordBlur}
                  ?disabled=${this.isLoading}
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  aria-describedby=${hasPasswordError ? 'password-error' : ''}
                  aria-invalid=${hasPasswordError}
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click=${this.togglePasswordVisibility}
                  aria-label=${this.showPassword ? 'Hide password' : 'Show password'}
                >
                  ${this.showPassword ? this.eyeOffIcon : this.eyeIcon}
                </button>
              </div>
              ${hasPasswordError ? html`
                <span id="password-error" class="form-error">Password must be at least 6 characters</span>
              ` : ''}
            </div>

            <div class="checkbox-row">
              <div class="checkbox-container">
                <input
                  type="checkbox"
                  id="remember-me"
                  .checked=${this.rememberMe}
                  @change=${this.handleRememberMeChange}
                  ?disabled=${this.isLoading}
                />
                <label for="remember-me">Remember me</label>
              </div>
              <a href="#" class="forgot-password" @click=${this.handleForgotPasswordClick}>
                Forgot password?
              </a>
            </div>

            <div class="modal-footer">
              <button
                type="submit"
                class="btn btn-primary"
                ?disabled=${!isFormValid || this.isLoading}
                style="width: 100%;"
              >
                ${this.isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div class="divider">
            <span>or</span>
          </div>

          <button class="btn btn-google" @click=${this.handleGoogleLogin} ?disabled=${this.isLoading}>
            ${this.googleIcon}
            Sign in with Google
          </button>

          <div class="links">
            <a href="#" class="link" @click=${this.handleRegisterClick}>Don't have an account? Sign up</a>
          </div>
        </div>
      </div>
    `;
  }

  private get eyeIcon() {
    return EyeIcon;
  }

  private get eyeOffIcon() {
    return EyeOffIcon;
  }

  private get googleIcon() {
    return html`
      <svg class="google-icon" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    `;
  }

  public open() {
    this.previousActiveElement = document.activeElement as Element;
    this.isOpen = true;
    this.error = '';
    
    // Focus management for accessibility
    setTimeout(() => {
      const usernameInput = this.shadowRoot?.querySelector('#username') as HTMLInputElement;
      usernameInput?.focus();
    }, 100);
  }

  public close() {
    this.isOpen = false;
    this.resetForm();
    
    // Restore focus
    if (this.previousActiveElement && 'focus' in this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus();
    }
  }

  private resetForm() {
    this.username = '';
    this.password = '';
    this.rememberMe = false;
    this.showPassword = false;
    this.isLoading = false;
    this.error = '';
    this.usernameTouched = false;
    this.passwordTouched = false;
  }

  private handleBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private handleModalClick(event: Event) {
    event.stopPropagation();
  }

  private handleUsernameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.username = input.value;
    if (this.error) this.error = '';
  }

  private handleUsernameBlur() {
    this.usernameTouched = true;
  }

  private handlePasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password = input.value;
    if (this.error) this.error = '';
  }

  private handlePasswordBlur() {
    this.passwordTouched = true;
  }

  private handleRememberMeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.rememberMe = checkbox.checked;
  }

  private togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!isValidUsernameOrEmail(this.username) || this.password.length < 6) {
      this.usernameTouched = true;
      this.passwordTouched = true;
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      await authService.login({
        usernameOrEmail: this.username,
        password: this.password,
        rememberMe: this.rememberMe
      });
      
      this.close();
      this.dispatchEvent(new CustomEvent('login-success', { bubbles: true, composed: true }));
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private handleGoogleLogin() {
    // Clear any existing form errors when using Google sign-in
    this.error = '';
    this.usernameTouched = false;
    this.passwordTouched = false;
    
    this.dispatchEvent(new CustomEvent('google-login', { bubbles: true, composed: true }));
  }

  private handleForgotPasswordClick(event: Event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('forgot-password', { bubbles: true, composed: true }));
  }

  private handleRegisterClick(event: Event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('show-register', { bubbles: true, composed: true }));
  }
}