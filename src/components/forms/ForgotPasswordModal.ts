import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('forgot-password-modal')
export class ForgotPasswordModal extends LitElement {
  @state() private isOpen = false;
  @state() private email = '';
  @state() private isSubmitted = false;
  @state() private emailTouched = false;
  
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
      max-width: 400px;
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
      margin-bottom: var(--space-lg);
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
      line-height: var(--line-height-base);
    }

    .form-error {
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      margin-top: var(--space-xs);
      display: block;
    }

    /* Button style overrides */
    .btn {
      width: 100%;
      margin-bottom: 0;
    }

    .btn-primary {
      margin-bottom: var(--space-md);
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

    .success-message {
      text-align: center;
      padding: var(--space-md) 0;
    }

    .success-icon {
      width: var(--space-3xl);
      height: var(--space-3xl);
      margin: 0 auto var(--space-md);
      color: var(--color-success);
    }

    .success-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    .success-text {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-base);
      margin-bottom: var(--space-lg);
    }

    @media (max-width: 480px) {
      .modal {
        margin: var(--space-md);
        padding: var(--space-lg);
      }
    }
  `;

  render() {
    return html`
      <div 
        class="modal-backdrop ${this.isOpen ? 'open' : ''}"
        @click=${this.handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-modal-title"
        aria-describedby="forgot-password-modal-description"
      >
        <div class="modal" @click=${this.stopPropagation}>
          <button 
            class="close-btn" 
            @click=${this.close}
            aria-label="Close forgot password modal"
          >×</button>
          
          ${this.isSubmitted ? this.renderSuccessMessage() : this.renderForm()}
        </div>
      </div>
    `;
  }

  private renderForm() {
    const isFormValid = this.email && this.email.includes('@');
    const hasEmailError = this.emailTouched && (!this.email || !this.email.includes('@'));

    return html`
      <div class="modal-header">
        <h2 id="forgot-password-modal-title" class="modal-title">Reset Password</h2>
        <p id="forgot-password-modal-description" class="modal-subtitle">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label class="form-label" for="reset-email">Email Address<span class="required">*</span></label>
          <input
            class="form-input ${hasEmailError ? 'error' : ''}"
            type="email"
            id="reset-email"
            .value=${this.email}
            @input=${this.handleEmailChange}
            placeholder="john.doe@example.com"
            autocomplete="off"
            spellcheck="false"
            required
            aria-describedby=${hasEmailError ? 'reset-email-error' : ''}
            aria-invalid=${hasEmailError ? 'true' : 'false'}
          />
          ${hasEmailError ? html`<span id="reset-email-error" class="form-error" role="alert">Please enter a valid email address</span>` : ''}
        </div>

        <button type="submit" class="btn btn-primary" ?disabled=${!isFormValid}>
          Send Reset Link
        </button>
      </form>

      <div class="links">
        <a href="#" class="link" @click=${this.handleBackToLoginClick}>Back to Sign In</a>
      </div>
    `;
  }

  private renderSuccessMessage() {
    return html`
      <div class="success-message">
        <div class="success-icon">
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        
        <h3 class="success-title">Check Your Email</h3>
        <p class="success-text">
          We've sent a password reset link to<br>
          <strong>${this.email}</strong>
        </p>
        
        <button class="btn btn-primary" @click=${this.handleBackToLoginClick}>
          Back to Sign In
        </button>
      </div>
    `;
  }

  public open() {
    // Store current focus for restoration
    this.previousActiveElement = document.activeElement;
    
    this.isOpen = true;
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Focus management for accessibility
    this.updateComplete.then(() => {
      const firstInput = this.shadowRoot?.querySelector('#reset-email') as HTMLInputElement;
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
    this.email = '';
    this.isSubmitted = false;
    this.emailTouched = false;
  }

  private handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  private stopPropagation(e: Event) {
    e.stopPropagation();
  }

  private handleEmailChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.email = target.value;
    this.emailTouched = true;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!this.email || !this.email.includes('@')) {
      console.error('Please enter a valid email address');
      return;
    }

    console.log('Forgot password submitted for:', this.email);
    
    // Show success message
    this.isSubmitted = true;
    
    // TODO: Implement actual forgot password logic
    // Call API to send reset email
  }

  private handleBackToLoginClick(e: Event) {
    e.preventDefault();
    this.close();
    // Dispatch custom event to open login modal
    this.dispatchEvent(new CustomEvent('open-login-modal', { 
      bubbles: true,
      composed: true 
    }));
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }
}