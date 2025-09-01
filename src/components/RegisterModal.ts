import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

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

  static styles = css`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-backdrop.open {
      opacity: 1;
      visibility: visible;
    }

    .modal {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      width: 100%;
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .modal-backdrop.open .modal {
      transform: scale(1);
    }

    .modal-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 0.5rem 0;
    }

    .modal-subtitle {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-label .required {
      color: #dc3545;
      margin-left: 0.25rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .form-input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .password-input-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #6c757d;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .password-toggle:hover {
      color: #007bff;
    }

    .password-toggle svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .checkbox-container {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .checkbox-label {
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
      line-height: 1.4;
    }

    .checkbox-label a {
      color: #007bff;
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 0;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      margin-bottom: 1rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-google {
      background-color: white;
      color: #374151;
      border: 1px solid #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-google:hover {
      background-color: #f9fafb;
    }

    .google-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #e5e7eb;
    }

    .divider span {
      padding: 0 1rem;
    }

    .links {
      text-align: center;
      margin-top: 1rem;
    }

    .link {
      color: #007bff;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .link:hover {
      text-decoration: underline;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6c757d;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
    }

    .close-btn:hover {
      background-color: #f8f9fa;
      color: #212529;
    }

    @media (max-width: 480px) {
      .modal {
        margin: 1rem;
        padding: 1.5rem;
        max-height: 95vh;
      }
    }
  `;

  render() {
    const passwordsMatch = !this.confirmPassword || this.password === this.confirmPassword;
    const isFormValid = this.username && this.email && this.password && this.confirmPassword && passwordsMatch && this.acceptTerms;

    return html`
      <div class="modal-backdrop ${this.isOpen ? 'open' : ''}" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${this.stopPropagation}>
          <button class="close-btn" @click=${this.close}>×</button>
          
          <div class="modal-header">
            <h2 class="modal-title">Create Account</h2>
            <p class="modal-subtitle">Join us and start managing your hyperlinks efficiently</p>
          </div>

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label class="form-label" for="reg-username">Username<span class="required">*</span></label>
              <input
                class="form-input"
                type="text"
                id="reg-username"
                .value=${this.username}
                @input=${this.handleUsernameChange}
                placeholder="john.doe"
                autocomplete="off"
                spellcheck="false"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email<span class="required">*</span></label>
              <input
                class="form-input"
                type="email"
                id="reg-email"
                .value=${this.email}
                @input=${this.handleEmailChange}
                placeholder="john.doe@example.com"
                autocomplete="off"
                spellcheck="false"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password<span class="required">*</span></label>
              <div class="password-input-container">
                <input
                  class="form-input"
                  type=${this.showPassword ? 'text' : 'password'}
                  id="reg-password"
                  .value=${this.password}
                  @input=${this.handlePasswordChange}
                  placeholder="********"
                  autocomplete="off"
                  spellcheck="false"
                  required
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
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-confirm-password">Confirm Password<span class="required">*</span></label>
              <div class="password-input-container">
                <input
                  class="form-input ${!passwordsMatch ? 'error' : ''}"
                  type=${this.showConfirmPassword ? 'text' : 'password'}
                  id="reg-confirm-password"
                  .value=${this.confirmPassword}
                  @input=${this.handleConfirmPasswordChange}
                  placeholder="********"
                  autocomplete="off"
                  spellcheck="false"
                  required
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
              ${!passwordsMatch ? html`<div class="error-message">Passwords do not match</div>` : ''}
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
    this.isOpen = true;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  public close() {
    this.isOpen = false;
    document.removeEventListener('keydown', this.handleKeyDown);
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
  }

  private handleEmailChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.email = target.value;
  }

  private handleOrganisationChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.organisation = target.value;
  }

  private handlePasswordChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.password = target.value;
  }

  private handleConfirmPasswordChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.confirmPassword = target.value;
  }

  private handleAcceptTermsChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.acceptTerms = target.checked;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    if (this.password !== this.confirmPassword) {
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
    console.log('Terms of Service clicked');
    // TODO: Open terms modal or navigate to terms page
  }

  private handlePrivacyClick(e: Event) {
    e.preventDefault();
    console.log('Privacy Policy clicked');
    // TODO: Open privacy modal or navigate to privacy page
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }
}