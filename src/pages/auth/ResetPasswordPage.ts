// Reset password page using UI library components

import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';

export class ResetPasswordPage {
  private container: HTMLElement | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <auth-reset-password-page
        title="Reset Your Password"
        subtitle="Enter your new password below"
        instructions="Choose a strong password that you haven't used before. Your password will be used to secure your account."
        new-password-label="New Password"
        confirm-password-label="Confirm New Password"
        submit-label="Reset Password"
        show-password-strength="true"
        password-min-length="8"
        show-login-link="true"
        login-text="Back to Sign In"
        success-message="Your password has been reset successfully! You can now sign in with your new password."
        logo-src="/logo.png"
        company-name="Hyperlinks Management Platform"
        layout="centered"
        background-variant="gradient"
        auto-redirect-delay="3000"
      ></auth-reset-password-page>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container) return;

    const resetPage = this.container.querySelector('auth-reset-password-page');
    
    // Handle password reset form submission
    resetPage?.addEventListener('auth-reset-password-submit', this.handleResetSubmit.bind(this));
    
    // Handle navigation to login
    resetPage?.addEventListener('auth-navigate-login', this.handleBackToLogin.bind(this));
  }

  private async handleResetSubmit(event: Event): Promise<void> {
    const customEvent = event as CustomEvent<{ newPassword: string; confirmPassword: string }>;
    const { newPassword } = customEvent.detail;

    const resetPage = this.container?.querySelector('auth-reset-password-page') as any;

    try {
      await authService.resetPassword(this.token, newPassword);
      
      // Success - show success state on component
      if (resetPage?.showSuccess) {
        resetPage.showSuccess();
      }

      appStore.getState().showNotification({
        type: 'success',
        message: 'Password reset successfully! Please sign in with your new password.',
        duration: 5000
      });

    } catch (error) {
      // Error handling - set form error
      if (resetPage?.setFormError) {
        resetPage.setFormError(error instanceof Error ? error.message : 'Password reset failed');
      }

      appStore.getState().showNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Password reset failed',
        duration: 5000
      });
    }
  }

  private handleBackToLogin(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    appRouter.navigate(ROUTES.LOGIN);
  }

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}