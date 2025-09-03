import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { FormValidator } from '../../utils/validation';
import { allModalStyles } from '../../shared/styles/modal-styles';
import { FocusTrap } from '../../utils/focus-trap';
import { scrollLock } from '../../utils/scroll-lock';
import type { 
  ModalComponent,
  LoginModalEventDetail
} from '../../types';

@customElement('login-modal')
export class LoginModal extends LitElement implements ModalComponent {
  // Add disconnection cleanup to prevent memory leaks
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    this.focusTrap?.deactivate();
    this.previousActiveElement = null;
  }
  @state() public isOpen = false;
  @state() private showPassword = false;
  @state() private username = '';
  @state() private password = '';
  @state() private rememberMe = false;
  @state() private isLoading = false;
  @state() private error = '';
  @state() private usernameTouched = false;
  @state() private passwordTouched = false;
  
  private previousActiveElement: Element | null = null;
  private focusTrap: FocusTrap | null = null;

  static styles = [
    ...allModalStyles,
    css`
      /* Import CSS variables from theme system */
      :host {
        --color-primary: var(--color-primary, #3b82f6);
        --color-primary-dark: var(--color-primary-dark, #2563eb);
        --color-gray-50: var(--color-gray-50, #f9fafb);
        --color-gray-100: var(--color-gray-100, #f3f4f6);
        --color-gray-400: var(--color-gray-400, #9ca3af);
        --color-gray-600: var(--color-gray-600, #4b5563);
        --color-gray-800: var(--color-gray-800, #1f2937);
        --spacing-1: var(--spacing-1, 0.25rem);
        --spacing-2: var(--spacing-2, 0.5rem);
        --spacing-4: var(--spacing-4, 1rem);
        --spacing-6: var(--spacing-6, 1.5rem);
        --border-radius-sm: var(--border-radius-sm, 0.25rem);
        --font-size-sm: var(--font-size-sm, 0.875rem);
        --transition-fast: var(--transition-fast, 150ms ease);
      }

      /* Login modal specific styles */
      .modal {
        max-width: 400px;
      }

      .checkbox-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-4);
      }

      .checkbox-container input[type="checkbox"] {
        width: auto;
        margin: 0;
      }

      .checkbox-container label {
        margin: 0;
        font-size: var(--font-size-sm);
        cursor: pointer;
        color: var(--color-gray-800);
      }

      .forgot-password {
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        transition: color var(--transition-fast);
      }

      .forgot-password:hover {
        color: var(--color-primary-dark);
        text-decoration: underline;
      }

      .divider {
        display: flex;
        align-items: center;
        margin: var(--spacing-4) 0;
        color: var(--color-gray-600);
        font-size: var(--font-size-sm);
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: var(--color-gray-400);
      }

      .divider span {
        padding: 0 var(--spacing-4);
        background: white;
        position: relative;
        z-index: 1;
      }

      .google-icon {
        width: 18px;
        height: 18px;
      }

      .links {
        margin-top: var(--spacing-4);
      }
    `
  ];

  render() {
    const trimmedUsername = this.username.trim();
    const usernameValid = FormValidator.validateUsernameOrEmail(trimmedUsername).isValid;
    const isFormValid = usernameValid && this.password.length >= 8;
    const hasUsernameError = this.usernameTouched && trimmedUsername && !usernameValid;
    const hasPasswordError = this.passwordTouched && this.password && this.password.length < 8;
    
    return html`
      <div class="modal-backdrop ${this.isOpen ? 'open' : ''}" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${this.handleModalClick}>
          <button class="close-btn" @click=${this.close} aria-label="Close modal">
            &times;
          </button>
          
          <div class="modal-header">
            <h2 class="modal-title">Welcome Back</h2>
            <p class="modal-subtitle">Sign in to your account</p>
          </div>

          ${this.error ? html`
            <div class="form-error" style="text-align: center; margin-bottom: var(--spacing-6);">
              ${this.error}
            </div>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label class="form-label" for="username">Email or Username</label>
              <input
                type="text"
                id="username"
                class="form-input ${hasUsernameError ? 'error' : ''}"
                .value=${this.username}
                @input=${this.handleUsernameInput}
                @blur=${this.handleUsernameBlur}
                ?disabled=${this.isLoading}
                placeholder="john.doe@example.com"
                autocomplete="username"
                aria-describedby=${hasUsernameError ? 'username-error' : ''}
                aria-invalid=${hasUsernameError}
              />
              ${hasUsernameError ? html`
                <span id="username-error" class="form-error">Please enter a valid email or username</span>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <div class="password-input-container">
                <input
                  type=${this.showPassword ? 'text' : 'password'}
                  id="password"
                  class="form-input ${hasPasswordError ? 'error' : ''}"
                  .value=${this.password}
                  @input=${this.handlePasswordInput}
                  @blur=${this.handlePasswordBlur}
                  ?disabled=${this.isLoading}
                  placeholder="••••••••"
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
                  ${this.showPassword ? html`
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ` : html`
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  `}
                </button>
              </div>
              ${hasPasswordError ? html`
                <span id="password-error" class="form-error">Password must be at least 8 characters</span>
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

            <button
              type="submit"
              class="btn btn-primary"
              ?disabled=${!isFormValid || this.isLoading}
            >
              ${this.isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div class="divider">
            <span>Or continue with</span>
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
    // Prevent multiple opens
    if (this.isOpen) return;
    
    this.previousActiveElement = document.activeElement as Element;
    this.isOpen = true;
    this.classList.add('open');
    scrollLock.lock();
    this.error = '';
    
    // Add keyboard listener only once
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Initialize and activate focus trap after modal is rendered
    this.updateComplete.then(() => {
      if (this.shadowRoot) {
        this.focusTrap = new FocusTrap(this.shadowRoot);
        this.focusTrap.activate(this.previousActiveElement || undefined);
      }
    });
  }

  public close() {
    // Prevent multiple closes
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.classList.remove('open');
    scrollLock.unlock();
    
    // Always remove event listener to prevent memory leaks
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Deactivate focus trap (handles focus restoration)
    this.focusTrap?.deactivate();
    this.focusTrap = null;
    
    // Reset form state
    this.resetForm();
    
    this.previousActiveElement = null;

    this.dispatchEvent(new CustomEvent('login-modal-closed', {
      bubbles: true,
      composed: true
    }));
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
    if (!input) return;
    
    this.username = input.value;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear username validation error when user starts typing valid input
    if (this.usernameTouched && this.username && FormValidator.validateUsernameOrEmail(this.username.trim()).isValid) {
      this.usernameTouched = false;
    }
  }

  private handleUsernameBlur() {
    this.usernameTouched = true;
  }

  private handlePasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    this.password = input.value;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear password validation error when user starts typing valid input
    if (this.passwordTouched && this.password.length >= 8) {
      this.passwordTouched = false;
    }
  }

  private handlePasswordBlur() {
    this.passwordTouched = true;
  }

  private handleRememberMeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (!checkbox) return;
    
    this.rememberMe = checkbox.checked;
  }

  private togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    // Prevent double submission
    if (this.isLoading) return;
    
    // Validate inputs
    const trimmedUsername = this.username.trim();
    if (!trimmedUsername || !FormValidator.validateUsernameOrEmail(trimmedUsername).isValid) {
      this.usernameTouched = true;
      this.username = trimmedUsername; // Update with trimmed value
      return;
    }
    
    if (!this.password || this.password.length < 8) {
      this.passwordTouched = true;
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loginData: LoginModalEventDetail = {
        usernameOrEmail: trimmedUsername,
        password: this.password,
        rememberMe: this.rememberMe
      };
      
      // Successful login - close modal and dispatch event
      this.dispatchEvent(new CustomEvent<LoginModalEventDetail>('login-success', { 
        detail: loginData,
        bubbles: true, 
        composed: true 
      }));
      this.close();
      
    } catch (error) {
      this.handleSubmissionError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleSubmissionError(error: unknown): void {
    // Handle different error types with proper type checking
    if (error instanceof Error) {
      this.error = error.message;
    } else if (typeof error === 'string') {
      this.error = error;
    } else {
      this.error = 'Login failed. Please check your credentials and try again.';
    }
    
    // Focus back on username field for retry
    this.updateComplete.then(() => {
      const usernameInput = this.shadowRoot?.querySelector('#username') as HTMLInputElement;
      usernameInput?.focus();
    });
  }

  private handleGoogleLogin(event: Event) {
    // Prevent any default behavior that might trigger validation
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent Google login during form submission
    if (this.isLoading) return;
    
    // Clear any existing form errors when using Google sign-in
    this.error = '';
    this.usernameTouched = false;
    this.passwordTouched = false;
    
    this.dispatchEvent(new CustomEvent('google-signin-clicked', { bubbles: true, composed: true }));
  }

  private handleForgotPasswordClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Clear any form errors when navigating to forgot password
    this.error = '';
    this.usernameTouched = false;
    this.passwordTouched = false;
    
    this.dispatchEvent(new CustomEvent('forgot-password-clicked', { bubbles: true, composed: true }));
  }

  private handleRegisterClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Clear any form errors IMMEDIATELY when navigating to register
    this.error = '';
    this.usernameTouched = false;
    this.passwordTouched = false;
    
    this.dispatchEvent(new CustomEvent('navigate-to-signup', { bubbles: true, composed: true }));
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Only handle keys when modal is open
    if (!this.isOpen) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
    
    // Handle Enter key for form submission when not in loading state
    if (e.key === 'Enter' && !this.isLoading) {
      const activeElement = this.shadowRoot?.activeElement;
      // Don't auto-submit if user is focused on a button or link
      if (activeElement?.tagName !== 'BUTTON' && activeElement?.tagName !== 'A') {
        const usernameValid = FormValidator.validateUsernameOrEmail(this.username.trim()).isValid;
        const isFormValid = usernameValid && this.password.length >= 8;
        if (isFormValid) {
          this.handleSubmit(e);
        }
      }
    }
  }
}