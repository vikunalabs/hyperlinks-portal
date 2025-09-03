import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { FormValidator } from '../../utils/validation';
import { logger } from '../../utils/logger';
import { allModalStyles } from '../../shared/styles/modal-styles';
import { FocusTrap } from '../../utils/focus-trap';
import { scrollLock } from '../../utils/scroll-lock';
import type { 
  ModalComponent
  // ForgotPasswordModalEventDetail - for future use in event dispatching
} from '../../types';

@customElement('forgot-password-modal')
export class ForgotPasswordModal extends LitElement implements ModalComponent {
  // Add disconnection cleanup to prevent memory leaks
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    this.focusTrap?.deactivate();
    this.previousActiveElement = null;
  }
  @state() public isOpen = false;
  @state() private email = '';
  @state() private isSubmitted = false;
  @state() private emailTouched = false;
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

      /* Forgot password modal specific styles */
      .modal {
        max-width: 400px;
      }

      .links {
        margin-top: var(--spacing-4);
      }
    `
  ];

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
    const trimmedEmail = this.email.trim();
    const emailValid = FormValidator.validateEmail(trimmedEmail).isValid;
    const isFormValid = emailValid && !this.isLoading;
    const hasEmailError = this.emailTouched && trimmedEmail && !emailValid;

    return html`
      <div class="modal-header">
        <h2 id="forgot-password-modal-title" class="modal-title">Reset Password</h2>
        <p id="forgot-password-modal-description" class="modal-subtitle">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      ${this.error ? html`
        <div class="form-error" style="text-align: center; margin-bottom: var(--spacing-6);">
          ${this.error}
        </div>
      ` : ''}

      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label class="form-label" for="reset-email">Email Address<span class="required">*</span></label>
          <input
            class="form-input ${hasEmailError ? 'error' : ''}"
            type="email"
            id="reset-email"
            .value=${this.email}
            @input=${this.handleEmailChange}
            @blur=${this.handleEmailBlur}
            placeholder="john.doe@example.com"
            autocomplete="email"
            spellcheck="false"
            required
            aria-describedby=${hasEmailError ? 'reset-email-error' : ''}
            aria-invalid=${hasEmailError ? 'true' : 'false'}
          />
          ${hasEmailError ? html`
            <span id="reset-email-error" class="form-error" role="alert">
              ${FormValidator.validateEmail(trimmedEmail).errors[0]}
            </span>
          ` : ''}
        </div>

        <button type="submit" class="btn btn-primary" ?disabled=${!isFormValid || this.isLoading}>
          ${this.isLoading ? 'Sending Reset Email...' : 'Send Password Reset'}
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

    this.dispatchEvent(new CustomEvent('forgot-password-modal-closed', {
      bubbles: true,
      composed: true
    }));
  }

  private resetForm() {
    this.email = '';
    this.isSubmitted = false;
    this.emailTouched = false;
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

  private handleEmailChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    
    this.email = target.value;
    
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

  private async handleSubmit(e: Event) {
    e.preventDefault();
    
    // Prevent double submission
    if (this.isLoading) return;
    
    // Validate email
    const trimmedEmail = this.email.trim();
    if (!trimmedEmail || !FormValidator.validateEmail(trimmedEmail).isValid) {
      this.emailTouched = true;
      this.email = trimmedEmail;
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      logger.analytics('forgot_password_submitted', { email: trimmedEmail }, { component: 'ForgotPasswordModal' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      this.isSubmitted = true;
      this.email = trimmedEmail; // Update with trimmed value
      
    } catch (error) {
      // Handle different error types
      if (error instanceof Error) {
        this.error = error.message;
      } else if (typeof error === 'string') {
        this.error = error;
      } else {
        this.error = 'Failed to send reset email. Please try again.';
      }
      
      // Focus back on email field for retry
      this.updateComplete.then(() => {
        const emailInput = this.shadowRoot?.querySelector('#reset-email') as HTMLInputElement;
        emailInput?.focus();
      });
    } finally {
      this.isLoading = false;
    }
  }

  private handleBackToLoginClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any form errors when navigating to login
    this.error = '';
    this.emailTouched = false;
    
    this.dispatchEvent(new CustomEvent('back-to-login', { 
      bubbles: true,
      composed: true 
    }));
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Only handle keys when modal is open
    if (!this.isOpen) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
    
    // Handle Enter key for form submission when not in loading state
    if (e.key === 'Enter' && !this.isLoading && !this.isSubmitted) {
      const activeElement = this.shadowRoot?.activeElement;
      // Don't auto-submit if user is focused on a button or link
      if (activeElement?.tagName !== 'BUTTON' && activeElement?.tagName !== 'A') {
        const trimmedEmail = this.email.trim();
        const isFormValid = FormValidator.validateEmail(trimmedEmail).isValid;
        if (isFormValid) {
          this.handleSubmit(e);
        }
      }
    }
  }
}