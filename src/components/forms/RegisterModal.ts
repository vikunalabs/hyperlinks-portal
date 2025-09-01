import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { isValidEmail, isValidUsername, doPasswordsMatch, ValidationMessages } from '../../utils';

@customElement('register-modal')
export class RegisterModal extends LitElement {
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
  
  private previousActiveElement: Element | null = null;

  static styles = css`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--bg-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal-backdrop);
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-slow);
    }

    .modal-backdrop.open {
      opacity: 1;
      visibility: visible;
    }

    .modal {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      width: 100%;
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
      transform: scale(0.9);
      transition: transform var(--transition-slow);
      z-index: var(--z-modal);
    }

    .modal-backdrop.open .modal {
      transform: scale(1);
    }

    .form-group {
      margin-bottom: var(--space-md);
    }

    .form-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    .form-label .required {
      color: var(--color-danger);
      margin-left: var(--space-xs);
    }

    .form-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: var(--font-size-md);
      transition: border-color var(--transition-base), box-shadow var(--transition-base);
      box-sizing: border-box;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .form-input.error {
      border-color: var(--color-danger);
    }

    .form-input::placeholder {
      color: var(--text-muted);
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

    .modal-header {
      text-align: center;
      margin-bottom: var(--space-lg);
    }

    .modal-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-sm) 0;
    }

    .modal-subtitle {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }

    .error-message {
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      margin-top: var(--space-xs);
    }

    .form-error {
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      margin-top: var(--space-xs);
      display: block;
    }

    .password-input-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: var(--space-sm);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
      padding: var(--space-xs);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .password-toggle:hover {
      color: var(--color-primary);
    }

    .password-toggle svg {
      width: var(--font-size-xl);
      height: var(--font-size-xl);
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

    /* Button style overrides */
    .btn {
      width: 100%;
      margin-bottom: 0;
    }

    .btn-primary {
      margin-bottom: var(--space-md);
    }

    .btn-google {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      margin-top: var(--space-md);
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-google:hover {
      background-color: var(--bg-secondary);
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
      background-color: var(--border-color-light);
    }

    .divider span {
      padding: 0 var(--space-md);
    }

    .links {
      text-align: center;
      margin-top: var(--space-md);
    }

    .link {
      color: var(--color-primary);
      text-decoration: none;
      font-size: var(--font-size-sm);
    }

    .link:hover {
      text-decoration: underline;
    }

    .close-btn {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      background: none;
      border: none;
      font-size: var(--font-size-2xl);
      cursor: pointer;
      color: var(--text-secondary);
      width: var(--space-xl);
      height: var(--space-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
    }

    .close-btn:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    @media (max-width: 480px) {
      .modal {
        margin: var(--space-md);
        padding: var(--space-lg);
        max-height: 95vh;
      }
    }
  `;

  render() {
    const passwordsMatch = !this.confirmPassword || doPasswordsMatch(this.password, this.confirmPassword);
    const isFormValid = isValidUsername(this.username) && isValidEmail(this.email) && this.password && this.confirmPassword && passwordsMatch && this.acceptTerms;
    const hasUsernameError = this.usernameTouched && !isValidUsername(this.username);
    const hasEmailError = this.emailTouched && !isValidEmail(this.email);
    const hasPasswordError = this.passwordTouched && this.password.length < 6;
    const hasConfirmPasswordError = this.confirmPasswordTouched && (!passwordsMatch || this.confirmPassword.length < 6);

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
                  placeholder="********"
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
                  placeholder="********"
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

            <button type="submit" class="btn btn-primary" ?disabled=${!isFormValid}>
              Create Account
            </button>
          </form>

          <div class="divider">
            <span>Or continue with</span>
          </div>

          <button class="btn btn-google" @click=${this.handleGoogleSignup}>
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
    return html`
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    `;
  }

  private get eyeOffIcon() {
    return html`
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"/>
      </svg>
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
    // Store current focus for restoration
    this.previousActiveElement = document.activeElement;
    
    this.isOpen = true;
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Focus management for accessibility
    this.updateComplete.then(() => {
      const firstInput = this.shadowRoot?.querySelector('#reg-username') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  public close() {
    this.isOpen = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus for accessibility
    if (this.previousActiveElement && this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
    
    this.resetForm();
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
    this.username = target.value;
    this.usernameTouched = true;
  }

  private handleEmailChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.email = target.value;
    this.emailTouched = true;
  }

  private handleOrganisationChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.organisation = target.value;
  }

  private handlePasswordChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.password = target.value;
    this.passwordTouched = true;
  }

  private handleConfirmPasswordChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.confirmPassword = target.value;
    this.confirmPasswordTouched = true;
  }

  private handleAcceptTermsChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.acceptTerms = target.checked;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    if (!doPasswordsMatch(this.password, this.confirmPassword)) {
      console.error('Passwords do not match');
      return;
    }

    console.log('Register form submitted:', {
      username: this.username,
      email: this.email,
      organisation: this.organisation,
      password: this.password,
      acceptTerms: this.acceptTerms
    });

    // TODO: Implement actual registration logic
    this.close();
  }

  private handleGoogleSignup() {
    console.log('Google signup clicked');
    // TODO: Implement Google signup logic
  }

  private handleLoginClick(e: Event) {
    e.preventDefault();
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
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }
}