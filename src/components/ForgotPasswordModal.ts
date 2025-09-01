import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('forgot-password-modal')
export class ForgotPasswordModal extends LitElement {
  @state() private isOpen = false;
  @state() private email = '';
  @state() private isSubmitted = false;

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
      max-width: 400px;
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
      line-height: 1.4;
    }

    .form-group {
      margin-bottom: 1.5rem;
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

    .success-message {
      text-align: center;
      padding: 1rem 0;
    }

    .success-icon {
      width: 3rem;
      height: 3rem;
      margin: 0 auto 1rem;
      color: #28a745;
    }

    .success-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #212529;
      margin-bottom: 0.5rem;
    }

    .success-text {
      color: #6c757d;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      .modal {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  `;

  render() {
    return html`
      <div class="modal-backdrop ${this.isOpen ? 'open' : ''}" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${this.stopPropagation}>
          <button class="close-btn" @click=${this.close}>×</button>
          
          ${this.isSubmitted ? this.renderSuccessMessage() : this.renderForm()}
        </div>
      </div>
    `;
  }

  private renderForm() {
    const isFormValid = this.email && this.email.includes('@');

    return html`
      <div class="modal-header">
        <h2 class="modal-title">Reset Password</h2>
        <p class="modal-subtitle">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label class="form-label" for="reset-email">Email Address<span class="required">*</span></label>
          <input
            class="form-input"
            type="email"
            id="reset-email"
            .value=${this.email}
            @input=${this.handleEmailChange}
            placeholder="john.doe@example.com"
            autocomplete="off"
            spellcheck="false"
            required
          />
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
    this.isOpen = true;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  public close() {
    this.isOpen = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    this.resetForm();
  }

  private resetForm() {
    this.email = '';
    this.isSubmitted = false;
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