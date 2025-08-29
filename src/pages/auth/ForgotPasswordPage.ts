// Forgot password page using enhanced UI library page component

import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';

export class ForgotPasswordPage {
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Reset your password</h1>
            <p>We'll help you get back into your account</p>
            <p class="instructions">Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          <form class="forgot-password-form">
            <div class="form-group">
              <ui-input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required="true"
                auto-focus="true"
              ></ui-input>
            </div>
            <ui-button type="submit" variant="primary" full-width="true">
              Send Reset Link
            </ui-button>
          </form>
          <div class="auth-links">
            <a href="#" class="back-to-login">Back to Sign In</a>
            <a href="#" class="register-link">Don't have an account? Sign up</a>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container) return;

    const form = this.container.querySelector('.forgot-password-form');
    const backToLogin = this.container.querySelector('.back-to-login');
    const registerLink = this.container.querySelector('.register-link');
    
    // Handle form submission
    form?.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Handle navigation events
    backToLogin?.addEventListener('click', this.handleNavigateLogin.bind(this));
    registerLink?.addEventListener('click', this.handleNavigateRegister.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('#email') as any;
    const email = emailInput?.value;

    if (!email) {
      appStore.getState().showNotification({
        type: 'error',
        message: 'Please enter your email address',
        duration: 3000
      });
      return;
    }

    try {
      await authService.forgotPassword(email);
      
      // Show success notification
      appStore.getState().showNotification({
        type: 'success',
        message: 'Password reset email sent successfully!',
        duration: 5000
      });

      // Navigate back to login after delay
      setTimeout(() => {
        appRouter.navigate(ROUTES.LOGIN);
      }, 2000);

    } catch (error) {
      appStore.getState().showNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send reset email',
        duration: 5000
      });
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


  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}