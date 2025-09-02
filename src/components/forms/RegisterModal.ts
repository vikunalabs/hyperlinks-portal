import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { isValidEmail, isValidUsername, doPasswordsMatch, ValidationMessages } from '../../utils';
import { EyeIcon, EyeOffIcon } from '../../shared/icons';
import { allModalStyles } from '../../shared/styles/modal-styles';

@customElement('register-modal')
export class RegisterModal extends LitElement {
  // Add disconnection cleanup to prevent memory leaks
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    this.previousActiveElement = null;
  }
  
  connectedCallback() {
    super.connectedCallback();
  }
  @state() private isOpen = false;
  @state() private showPassword = false;
  @state() private showConfirmPassword = false;
  @state() private username = '';
  @state() private email = '';
  @state() private password = '';
  @state() private confirmPassword = '';
  @state() private organisation = '';
  @state() private acceptTerms = false;
  @state() private usernameTouched = false;
  @state() private emailTouched = false;
  @state() private passwordTouched = false;
  @state() private confirmPasswordTouched = false;
  @state() private isLoading = false;
  @state() private error = '';
  
  private previousActiveElement: Element | null = null;

  static styles = [
    ...allModalStyles,
    css`
      /* RegisterModal specific styles only */
      .modal {
        max-width: 450px; /* Medium modal size for registration */
      }

      .form-label .required {
        color: var(--color-danger);
        margin-left: var(--space-xs);
      }

      .checkbox-container {
        display: flex;
        align-items: flex-start;
        gap: var(--space-sm);
        margin-bottom: var(--space-md);
      }

      .checkbox {
        width: var(--space-md);
        height: var(--space-md);
        margin-top: calc(var(--space-xs) / 2);
        flex-shrink: 0;
      }

      .checkbox-label {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        cursor: pointer;
        line-height: var(--line-height-base);
      }

      .checkbox-label a {
        color: var(--color-primary);
        text-decoration: none;
      }

      .checkbox-label a:hover {
        text-decoration: underline;
      }

      .btn-primary {
        width: 100%;
        margin-bottom: var(--space-md);
      }

      .google-icon {
        width: var(--font-size-xl);
        height: var(--font-size-xl);
      }

      .divider {
        display: flex;
        align-items: center;
        margin: var(--space-md) 0;
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
    const trimmedUsername = this.username.trim();
    const trimmedEmail = this.email.trim();
    const passwordsMatch = !this.confirmPassword || doPasswordsMatch(this.password, this.confirmPassword);
    const isFormValid = isValidUsername(trimmedUsername) && isValidEmail(trimmedEmail) && this.password.length >= 6 && this.confirmPassword.length >= 6 && passwordsMatch && this.acceptTerms && !this.isLoading;
    const hasUsernameError = this.usernameTouched && (!trimmedUsername || !isValidUsername(trimmedUsername));
    const hasEmailError = this.emailTouched && (!trimmedEmail || !isValidEmail(trimmedEmail));
    const hasPasswordError = this.passwordTouched && (!this.password || this.password.length < 6);
    const hasConfirmPasswordError = this.confirmPasswordTouched && (!passwordsMatch || !this.confirmPassword || this.confirmPassword.length < 6);

    return html`
      <div 
        class="modal-backdrop ${this.isOpen ? 'open' : ''}"
        @click=${this.handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <div class="modal" @click=${this.stopPropagation}>
          <button 
            class="close-btn" 
            @click=${this.close}
            aria-label="Close registration modal"
          >×</button>
          
          <div class="modal-header">
            <h2 id="register-modal-title" class="modal-title">Create Account</h2>
            <p id="register-modal-description" class="modal-subtitle">Join us and start managing your hyperlinks efficiently</p>
          </div>

          ${this.error ? html`
            <div class="form-error" style="text-align: center; margin-bottom: var(--space-lg);">
              ${this.error}
            </div>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label class="form-label" for="reg-username">Username<span class="required">*</span></label>
              <input
                class="form-input ${hasUsernameError ? 'error' : ''}"
                type="text"
                id="reg-username"
                .value=${this.username}
                @input=${this.handleUsernameChange}
                placeholder="john.doe"
                autocomplete="off"
                spellcheck="false"
                required
                aria-describedby=${hasUsernameError ? 'username-error' : ''}
                aria-invalid=${hasUsernameError ? 'true' : 'false'}
              />
              ${hasUsernameError ? html`<span id="username-error" class="form-error" role="alert">${ValidationMessages.INVALID_USERNAME}</span>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email<span class="required">*</span></label>
              <input
                class="form-input ${hasEmailError ? 'error' : ''}"
                type="email"
                id="reg-email"
                .value=${this.email}
                @input=${this.handleEmailChange}
                placeholder="john.doe@example.com"
                autocomplete="off"
                spellcheck="false"
                required
                aria-describedby=${hasEmailError ? 'email-error' : ''}
                aria-invalid=${hasEmailError ? 'true' : 'false'}
              />
              ${hasEmailError ? html`<span id="email-error" class="form-error" role="alert">${ValidationMessages.INVALID_EMAIL}</span>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password<span class="required">*</span></label>
              <div class="password-input-container">
                <input
                  class="form-input ${hasPasswordError ? 'error' : ''}"
                  type=${this.showPassword ? 'text' : 'password'}
                  id="reg-password"
                  .value=${this.password}
                  @input=${this.handlePasswordChange}
                  placeholder="●●●●●●●●"
                  autocomplete="off"
                  spellcheck="false"
                  required
                  aria-describedby=${hasPasswordError ? 'password-error' : ''}
                  aria-invalid=${hasPasswordError ? 'true' : 'false'}
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click=${this.togglePasswordVisibility}
                  title=${this.showPassword ? 'Hide password' : 'Show password'}
                >
                  ${this.showPassword ? this.eyeIcon : this.eyeOffIcon}
                </button>
              </div>
              ${hasPasswordError ? html`<span id="password-error" class="form-error" role="alert">Password must be at least 6 characters long</span>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-confirm-password">Confirm Password<span class="required">*</span></label>
              <div class="password-input-container">
                <input
                  class="form-input ${hasConfirmPasswordError ? 'error' : ''}"
                  type=${this.showConfirmPassword ? 'text' : 'password'}
                  id="reg-confirm-password"
                  .value=${this.confirmPassword}
                  @input=${this.handleConfirmPasswordChange}
                  placeholder="●●●●●●●●"
                  autocomplete="off"
                  spellcheck="false"
                  required
                  aria-describedby=${hasConfirmPasswordError ? 'confirm-password-error' : ''}
                  aria-invalid=${hasConfirmPasswordError ? 'true' : 'false'}
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click=${this.toggleConfirmPasswordVisibility}
                  title=${this.showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  ${this.showConfirmPassword ? this.eyeIcon : this.eyeOffIcon}
                </button>
              </div>
              ${hasConfirmPasswordError ? html`<span id="confirm-password-error" class="form-error" role="alert">${!passwordsMatch ? ValidationMessages.PASSWORDS_DO_NOT_MATCH : 'Password must be at least 6 characters long'}</span>` : ''}
            </div>

                        <div class="form-group">
              <label class="form-label" for="reg-organisation">Organisation</label>
              <input
                class="form-input"
                type="text"
                id="reg-organisation"
                .value=${this.organisation}
                @input=${this.handleOrganisationChange}
                placeholder="Acme Inc"
                autocomplete="off"
                spellcheck="false"
              />
            </div>

            <div class="checkbox-container">
              <input
                type="checkbox"
                id="accept-terms"
                class="checkbox"
                .checked=${this.acceptTerms}
                @change=${this.handleAcceptTermsChange}
              />
              <label class="checkbox-label" for="accept-terms">
                I agree to the <a href="#" @click=${this.handleTermsClick}>Terms of Service</a> 
                and <a href="#" @click=${this.handlePrivacyClick}>Privacy Policy</a>
              </label>
            </div>

            <button type="submit" class="btn btn-primary" ?disabled=${!isFormValid || this.isLoading}>
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
    // Prevent multiple opens
    if (this.isOpen) return;
    
    this.previousActiveElement = document.activeElement as Element;
    this.isOpen = true;
    this.error = '';
    
    // Add keyboard listener only once
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Focus management for accessibility - use updateComplete for reliability
    this.updateComplete.then(() => {
      const firstInput = this.shadowRoot?.querySelector('#reg-username') as HTMLInputElement;
      if (firstInput && !this.isLoading) {
        firstInput.focus();
      }
    });
  }

  public close() {
    // Prevent multiple closes
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Always remove event listener to prevent memory leaks
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Reset form state
    this.resetForm();
    
    // Restore focus safely
    if (this.previousActiveElement) {
      try {
        if ('focus' in this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
          (this.previousActiveElement as HTMLElement).focus();
        }
      } catch (error) {
        // Silently handle focus restoration errors
        console.debug('Focus restoration failed:', error);
      }
    }
    this.previousActiveElement = null;
  }

  private resetForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.organisation = '';
    this.acceptTerms = false;
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.usernameTouched = false;
    this.emailTouched = false;
    this.passwordTouched = false;
    this.confirmPasswordTouched = false;
    this.isLoading = false;
    this.error = '';
  }

  private handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  private stopPropagation(e: Event) {
    e.stopPropagation();
  }

  private togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  private handleUsernameChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.username = target.value.trim();
    this.usernameTouched = true;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear username validation error when user starts typing valid input
    if (this.usernameTouched && this.username && isValidUsername(this.username)) {
      this.usernameTouched = false;
    }
  }

  private handleEmailChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.email = target.value.trim();
    this.emailTouched = true;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear email validation error when user starts typing valid input
    if (this.emailTouched && this.email && isValidEmail(this.email)) {
      this.emailTouched = false;
    }
  }

  private handleOrganisationChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.organisation = target.value.trim();
  }

  private handlePasswordChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.password = target.value;
    this.passwordTouched = true;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear password validation error when user starts typing valid input
    if (this.passwordTouched && this.password.length >= 6) {
      this.passwordTouched = false;
    }
  }

  private handleConfirmPasswordChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.confirmPassword = target.value;
    this.confirmPasswordTouched = true;
    
    // Clear errors on input for better UX
    if (this.error) this.error = '';
    
    // Clear confirm password validation error when passwords match
    if (this.confirmPasswordTouched && this.confirmPassword.length >= 6 && doPasswordsMatch(this.password, this.confirmPassword)) {
      this.confirmPasswordTouched = false;
    }
  }

  private handleAcceptTermsChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.acceptTerms = target.checked;
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    
    // Prevent double submission
    if (this.isLoading) return;
    
    // Validate inputs
    const trimmedUsername = this.username.trim();
    const trimmedEmail = this.email.trim();
    const trimmedOrganisation = this.organisation.trim();
    
    // Mark all fields as touched for validation
    this.usernameTouched = true;
    this.emailTouched = true;
    this.passwordTouched = true;
    this.confirmPasswordTouched = true;
    
    // Validate all required fields
    if (!trimmedUsername || !isValidUsername(trimmedUsername)) {
      this.username = trimmedUsername;
      return;
    }
    
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      this.email = trimmedEmail;
      return;
    }
    
    if (!this.password || this.password.length < 6) {
      return;
    }
    
    if (!this.confirmPassword || this.confirmPassword.length < 6) {
      return;
    }
    
    if (!doPasswordsMatch(this.password, this.confirmPassword)) {
      this.error = 'Passwords do not match';
      return;
    }
    
    if (!this.acceptTerms) {
      this.error = 'Please accept the Terms of Service and Privacy Policy';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      // TODO: Replace with actual registration service call
      console.log('Register form submitted:', {
        username: trimmedUsername,
        email: trimmedEmail,
        organisation: trimmedOrganisation,
        password: this.password,
        acceptTerms: this.acceptTerms
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Successful registration - close modal and dispatch event
      this.close();
      this.dispatchEvent(new CustomEvent('register-success', { bubbles: true, composed: true }));
      
    } catch (error) {
      // Handle different error types
      if (error instanceof Error) {
        this.error = error.message;
      } else if (typeof error === 'string') {
        this.error = error;
      } else {
        this.error = 'Registration failed. Please try again.';
      }
      
      // Focus back on first input field for retry
      this.updateComplete.then(() => {
        const firstInput = this.shadowRoot?.querySelector('#reg-username') as HTMLInputElement;
        firstInput?.focus();
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
    
    console.log('Google signup clicked');
    // TODO: Implement Google signup logic
    this.dispatchEvent(new CustomEvent('google-signup', { bubbles: true, composed: true }));
  }

  private handleLoginClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any form errors when navigating to login
    this.error = '';
    this.usernameTouched = false;
    this.emailTouched = false;
    this.passwordTouched = false;
    this.confirmPasswordTouched = false;
    
    // Close this modal first to prevent any further validation
    this.close();
    
    // Dispatch custom event to open login modal
    this.dispatchEvent(new CustomEvent('open-login-modal', {
      bubbles: true,
      composed: true
    }));
  }

  private handleTermsClick(e: Event) {
    e.preventDefault();
    window.open('/terms', '_blank');
  }

  private handlePrivacyClick(e: Event) {
    e.preventDefault();
    window.open('/privacy', '_blank');
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
        const passwordsMatch = doPasswordsMatch(this.password, this.confirmPassword);
        const isFormValid = isValidUsername(trimmedUsername) && isValidEmail(trimmedEmail) && this.password.length >= 6 && this.confirmPassword.length >= 6 && passwordsMatch && this.acceptTerms;
        if (isFormValid) {
          this.handleSubmit(e);
        }
      }
    }
  }
}