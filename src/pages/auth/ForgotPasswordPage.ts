// src/pages/auth/ForgotPasswordPage.ts
// Forgot password page using enhanced UI library page component
import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';
import { validateEmail } from '../../utils';

export class ForgotPasswordPage {
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>Reset your password</h1>
            <p>We'll help you get back into your account</p>
            <p class="instructions">Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          <form id="forgotPasswordForm" class="auth-form">
            <ui-input
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              required
              autofocus>
            </ui-input>
            
            <ui-button 
              type="submit" 
              variant="primary" 
              size="md"
              label="Send Reset Link"
              id="submitButton">Send Reset Link</ui-button>
            
            <div class="auth-footer">
              <p><a href="/login" id="loginLink">← Back to Sign In</a></p>
              <p>Don't have an account? <a href="/register" id="registerLink">Sign up</a></p>
            </div>
            
            <div id="errorMessage" class="error-message" style="display: none;"></div>
          </form>
        </ui-card>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container) return;

    const form = this.container.querySelector('#forgotPasswordForm') as HTMLFormElement;
    const submitButton = this.container.querySelector('#submitButton');
    const loginLink = this.container.querySelector('#loginLink');
    const registerLink = this.container.querySelector('#registerLink');
    
    // Handle form submission
    form?.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Handle button click (workaround for mouse click issue)
    submitButton?.addEventListener('click', (event) => {
      event.preventDefault();
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    });
    
    // Handle navigation events
    loginLink?.addEventListener('click', this.handleNavigateLogin.bind(this));
    registerLink?.addEventListener('click', this.handleNavigateRegister.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    // Extract value directly from component (FormData not working yet with lit-ui-library)
    const emailInput = form.querySelector('ui-input[name="email"]') as any;
    const email = emailInput?.value;

    // Clear previous errors
    this.clearErrors();

    if (!email) {
      this.showError('Please enter your email address');
      return;
    }

    // Validate email format using utility function
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      this.showError(emailValidation.error!);
      return;
    }

    // Get submit button and show loading state
    const submitBtn = this.container?.querySelector('#submitButton') as any;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.loading = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      await authService.forgotPassword(email);
      
      // Show success notification
      appStore.getState().showNotification({
        type: 'success',
        message: 'Password reset email sent successfully!',
        duration: 5000
      });

      // Navigate back to login immediately
      appRouter.navigate(ROUTES.LOGIN);

    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.loading = false;
        submitBtn.textContent = 'Send Reset Link';
      }
    }
  }


  private handleNavigateLogin(event: Event): void {
    event.preventDefault();
    appRouter.navigate(ROUTES.LOGIN);
  }

  private handleNavigateRegister(event: Event): void {
    event.preventDefault();
    appRouter.navigate(ROUTES.REGISTER);
  }

  private showError(message: string): void {
    const errorDiv = this.container?.querySelector('#errorMessage') as HTMLElement;
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  private clearErrors(): void {
    const errorDiv = this.container?.querySelector('#errorMessage') as HTMLElement;
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  }

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}