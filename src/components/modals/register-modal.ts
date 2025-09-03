import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { FormValidator } from '../../utils/validation';
import { allModalStyles } from '../../shared/styles/modal-styles';
import { FocusTrap } from '../../utils/focus-trap';
import { scrollLock } from '../../utils/scroll-lock';
import type { 
  ModalComponent
  // RegisterModalEventDetail - for future use in event dispatching
} from '../../types';

@customElement('register-modal')
export class RegisterModal extends LitElement implements ModalComponent {
  // Add disconnection cleanup to prevent memory leaks
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    this.focusTrap?.deactivate();
    this.previousActiveElement = null;
  }
  @state() public isOpen = false;
  @state() private showPassword = false;
  @state() private showConfirmPassword = false;
  @state() private username = '';
  @state() private email = '';
  @state() private password = '';
  @state() private confirmPassword = '';
  @state() private organization = '';
  @state() private acceptTerms = false;
  @state() private usernameTouched = false;
  @state() private emailTouched = false;
  @state() private passwordTouched = false;
  @state() private confirmPasswordTouched = false;
  @state() private isLoading = false;
  @state() private error = '';
  
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

      /* Register modal specific styles */
      .modal {
        max-width: 450px;
      }

      .checkbox-container {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-4);
      }

      .checkbox {
        width: var(--spacing-4);
        height: var(--spacing-4);
        accent-color: var(--color-primary);
        margin-top: var(--spacing-1);
        flex-shrink: 0;
      }

      .checkbox-label {
        font-size: var(--font-size-sm);
        color: var(--color-gray-600);
        cursor: pointer;
        line-height: 1.4;
      }

      .checkbox-label a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
      }

      .checkbox-label a:hover {
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
    const trimmedEmail = this.email.trim();
    const usernameValid = FormValidator.validateUsername(trimmedUsername).isValid;
    const emailValid = FormValidator.validateEmail(trimmedEmail).isValid;
    const passwordValid = FormValidator.validatePassword(this.password).isValid;
    const confirmPasswordValid = this.confirmPassword === this.password && this.password.length > 0;
    const isFormValid = usernameValid && emailValid && passwordValid && confirmPasswordValid && this.acceptTerms && !this.isLoading;
    
    const hasUsernameError = this.usernameTouched && trimmedUsername && !usernameValid;
    const hasEmailError = this.emailTouched && trimmedEmail && !emailValid;
    const hasPasswordError = this.passwordTouched && this.password && !passwordValid;
    const hasConfirmPasswordError = this.confirmPasswordTouched && this.confirmPassword && !confirmPasswordValid;

    return html`
      <div class="modal-backdrop ${this.isOpen ? 'open' : ''}" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${this.handleModalClick}>
          <button class="close-btn" @click=${this.close} aria-label="Close modal">
            &times;
          </button>
          
          <div class="modal-header">
            <h2 class="modal-title">Create Account</h2>
            <p class="modal-subtitle">Get started with your free account today</p>
          </div>

          ${this.error ? html`
            <div class="form-error" style="text-align: center; margin-bottom: var(--spacing-6);">
              ${this.error}
            </div>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label class="form-label" for="register-username">Username<span class="required">*</span></label>
              <input
                type="text"
                id="register-username"
                class="form-input ${hasUsernameError ? 'error' : ''}"
                .value=${this.username}
                @input=${this.handleUsernameInput}
                @blur=${this.handleUsernameBlur}
                ?disabled=${this.isLoading}
                placeholder="johndoe123"
                autocomplete="username"
                spellcheck="false"
                required
                aria-describedby=${hasUsernameError ? 'register-username-error' : ''}
                aria-invalid=${hasUsernameError ? 'true' : 'false'}
              />
              ${hasUsernameError ? html`
                <span id="register-username-error" class="form-error" role="alert">
                  ${FormValidator.validateUsername(trimmedUsername).errors[0]}
                </span>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="register-email">Email Address<span class="required">*</span></label>
              <input
                type="email"
                id="register-email"
                class="form-input ${hasEmailError ? 'error' : ''}"
                .value=${this.email}
                @input=${this.handleEmailInput}
                @blur=${this.handleEmailBlur}
                ?disabled=${this.isLoading}
                placeholder="john.doe@example.com"
                autocomplete="email"
                spellcheck="false"
                required
                aria-describedby=${hasEmailError ? 'register-email-error' : ''}
                aria-invalid=${hasEmailError ? 'true' : 'false'}
              />
              ${hasEmailError ? html`
                <span id="register-email-error" class="form-error" role="alert">
                  ${FormValidator.validateEmail(trimmedEmail).errors[0]}
                </span>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="register-organization">Organization (Optional)</label>
              <input
                type="text"
                id="register-organization"
                class="form-input"
                .value=${this.organization}
                @input=${this.handleOrganizationInput}
                ?disabled=${this.isLoading}
                placeholder="Acme Corporation"
                autocomplete="organization"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="register-password">Password<span class="required">*</span></label>
              <div class="password-input-container">
                <input
                  type=${this.showPassword ? 'text' : 'password'}
                  id="register-password"
                  class="form-input ${hasPasswordError ? 'error' : ''}"
                  .value=${this.password}
                  @input=${this.handlePasswordInput}
                  @blur=${this.handlePasswordBlur}
                  ?disabled=${this.isLoading}
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                  aria-describedby=${hasPasswordError ? 'register-password-error' : ''}
                  aria-invalid=${hasPasswordError ? 'true' : 'false'}
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click=${() => this.togglePasswordVisibility('password')}
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
                <span id="register-password-error" class="form-error" role="alert">
                  ${FormValidator.validatePassword(this.password).errors[0]}
                </span>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="register-confirm-password">Confirm Password<span class="required">*</span></label>
              <div class="password-input-container">
                <input
                  type=${this.showConfirmPassword ? 'text' : 'password'}
                  id="register-confirm-password"
                  class="form-input ${hasConfirmPasswordError ? 'error' : ''}"
                  .value=${this.confirmPassword}
                  @input=${this.handleConfirmPasswordInput}
                  @blur=${this.handleConfirmPasswordBlur}
                  ?disabled=${this.isLoading}
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                  aria-describedby=${hasConfirmPasswordError ? 'register-confirm-password-error' : ''}
                  aria-invalid=${hasConfirmPasswordError ? 'true' : 'false'}
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click=${() => this.togglePasswordVisibility('confirm')}
                  aria-label=${this.showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  ${this.showConfirmPassword ? html`
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
              ${hasConfirmPasswordError ? html`
                <span id="register-confirm-password-error" class="form-error" role="alert">
                  Passwords do not match
                </span>
              ` : ''}
            </div>

            <div class="checkbox-container">
              <input
                type="checkbox"
                id="accept-terms"
                class="checkbox"
                .checked=${this.acceptTerms}
                @change=${this.handleTermsChange}
                ?disabled=${this.isLoading}
                required
                aria-describedby="accept-terms-label"
              />
              <label for="accept-terms" id="accept-terms-label" class="checkbox-label">
                I agree to the <a href="#" @click=${this.handleTermsClick}>Terms of Service</a> and <a href="#" @click=${this.handlePrivacyClick}>Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              ?disabled=${!isFormValid}
            >
              ${this.isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div class="divider">
            <span>Or continue with</span>
          </div>

          <button class="btn btn-google" @click=${this.handleGoogleSignup} ?disabled=${this.isLoading}>
            ${this.googleIcon}
            Sign up with Google
          </button>

          <div class="links">
            <a href="#" class="link" @click=${this.handleLoginClick}>Already have an account? Sign in</a>
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

    this.dispatchEvent(new CustomEvent('register-modal-closed', {
      bubbles: true,
      composed: true
    }));
  }

  private resetForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.organization = '';
    this.acceptTerms = false;
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.isLoading = false;
    this.error = '';
    this.usernameTouched = false;
    this.emailTouched = false;
    this.passwordTouched = false;
    this.confirmPasswordTouched = false;
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
    if (this.usernameTouched && this.username && FormValidator.validateUsername(this.username.trim()).isValid) {
      this.usernameTouched = false;
    }
  }

  private handleUsernameBlur() {
    this.usernameTouched = true;
  }

  private handleEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    this.email = input.value;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear email validation error when user starts typing valid input
    if (this.emailTouched && this.email && FormValidator.validateEmail(this.email.trim()).isValid) {
      this.emailTouched = false;
    }
  }

  private handleEmailBlur() {
    this.emailTouched = true;
  }

  private handleOrganizationInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    this.organization = input.value;
  }

  private handlePasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    this.password = input.value;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear password validation error when user starts typing valid input
    if (this.passwordTouched && this.password && FormValidator.validatePassword(this.password).isValid) {
      this.passwordTouched = false;
    }
    
    // Also re-validate confirm password when password changes
    if (this.confirmPasswordTouched && this.confirmPassword) {
      this.confirmPasswordTouched = this.password !== this.confirmPassword;
    }
  }

  private handlePasswordBlur() {
    this.passwordTouched = true;
  }

  private handleConfirmPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    this.confirmPassword = input.value;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear confirm password validation error when passwords match
    if (this.confirmPasswordTouched && this.confirmPassword && this.password === this.confirmPassword) {
      this.confirmPasswordTouched = false;
    }
  }

  private handleConfirmPasswordBlur() {
    this.confirmPasswordTouched = true;
  }

  private handleTermsChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (!checkbox) return;
    
    this.acceptTerms = checkbox.checked;
  }

  private togglePasswordVisibility(type: 'password' | 'confirm') {
    if (type === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    // Prevent double submission
    if (this.isLoading) return;
    
    // Validate all inputs
    const trimmedUsername = this.username.trim();
    const trimmedEmail = this.email.trim();
    
    if (!trimmedUsername || !FormValidator.validateUsername(trimmedUsername).isValid) {
      this.usernameTouched = true;
      this.username = trimmedUsername; // Update with trimmed value
      return;
    }
    
    if (!trimmedEmail || !FormValidator.validateEmail(trimmedEmail).isValid) {
      this.emailTouched = true;
      this.email = trimmedEmail; // Update with trimmed value
      return;
    }
    
    if (!this.password || !FormValidator.validatePassword(this.password).isValid) {
      this.passwordTouched = true;
      return;
    }
    
    if (!this.confirmPassword || this.password !== this.confirmPassword) {
      this.confirmPasswordTouched = true;
      return;
    }
    
    if (!this.acceptTerms) {
      // Focus the terms checkbox to draw attention
      const termsCheckbox = this.shadowRoot?.querySelector('#accept-terms') as HTMLInputElement;
      termsCheckbox?.focus();
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const registrationData = {
        username: trimmedUsername,
        email: trimmedEmail,
        password: this.password,
        organization: this.organization.trim() || undefined
      };
      
      // Successful registration - close modal and dispatch event
      this.dispatchEvent(new CustomEvent('register-success', { 
        detail: registrationData,
        bubbles: true, 
        composed: true 
      }));
      this.close();
      
    } catch (error) {
      // Handle different error types
      if (error instanceof Error) {
        this.error = error.message;
      } else if (typeof error === 'string') {
        this.error = error;
      } else {
        this.error = 'Registration failed. Please try again.';
      }
      
      // Focus back on username field for retry
      this.updateComplete.then(() => {
        const usernameInput = this.shadowRoot?.querySelector('#register-username') as HTMLInputElement;
        usernameInput?.focus();
      });
    } finally {
      this.isLoading = false;
    }
  }

  private handleGoogleSignup(event: Event) {
    // Prevent any default behavior that might trigger validation
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent Google signup during form submission
    if (this.isLoading) return;
    
    // Clear any existing form errors when using Google sign-up
    this.error = '';
    this.usernameTouched = false;
    this.emailTouched = false;
    this.passwordTouched = false;
    this.confirmPasswordTouched = false;
    
    this.dispatchEvent(new CustomEvent('google-signup-clicked', { bubbles: true, composed: true }));
  }

  private handleTermsClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Open Terms of Service in new tab
    window.open('/terms-of-service', '_blank', 'noopener,noreferrer');
  }

  private handlePrivacyClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Open Privacy Policy in new tab
    window.open('/privacy-policy', '_blank', 'noopener,noreferrer');
  }

  private handleLoginClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Clear any form errors when navigating to login
    this.error = '';
    this.usernameTouched = false;
    this.emailTouched = false;
    this.passwordTouched = false;
    this.confirmPasswordTouched = false;
    
    this.dispatchEvent(new CustomEvent('navigate-to-signin', { bubbles: true, composed: true }));
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
        const trimmedUsername = this.username.trim();
        const trimmedEmail = this.email.trim();
        const usernameValid = FormValidator.validateUsername(trimmedUsername).isValid;
        const emailValid = FormValidator.validateEmail(trimmedEmail).isValid;
        const passwordValid = FormValidator.validatePassword(this.password).isValid;
        const confirmPasswordValid = this.confirmPassword === this.password && this.password.length > 0;
        const isFormValid = usernameValid && emailValid && passwordValid && confirmPasswordValid && this.acceptTerms;
        
        if (isFormValid) {
          this.handleSubmit(e);
        }
      }
    }
  }
}