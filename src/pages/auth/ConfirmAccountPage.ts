// Account confirmation page using UI library components

import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';

export class ConfirmAccountPage {
  private container: HTMLElement | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <auth-email-verification-page
        title="Confirm Your Account"
        subtitle="Please wait while we verify your account"
        verification-status="verifying"
        verification-message="Verifying your account with the provided token..."
        success-message="Your account has been successfully verified!"
        error-message="Account verification failed. The link may be expired or invalid."
        resend-message="We can send another verification link to your email address."
        resend-label="Resend Verification Email"
        continue-label="Continue to Dashboard"
        login-label="Go to Sign In"
        show-resend-option="true"
        show-continue-button="true"
        show-login-link="true"
        logo-src="/logo.png"
        company-name="Hyperlinks Management Platform"
        layout="centered"
        background-variant="gradient"
        auto-redirect-delay="0"
      ></auth-email-verification-page>
    `;

    this.bindEvents();
    this.performVerification();
  }

  private bindEvents(): void {
    if (!this.container) return;

    const verificationPage = this.container.querySelector('auth-email-verification-page');
    
    // Handle email verification events
    verificationPage?.addEventListener('auth-email-verification-resend', this.handleResendVerification.bind(this));
    verificationPage?.addEventListener('auth-email-verification-continue', this.handleContinue.bind(this));
    verificationPage?.addEventListener('auth-navigate-login', this.handleGoToLogin.bind(this));
  }

  private async performVerification(): Promise<void> {
    const verificationPage = this.container?.querySelector('auth-email-verification-page') as any;
    
    try {
      await authService.confirmAccount(this.token);
      
      // Success - update component status
      if (verificationPage?.setSuccess) {
        verificationPage.setSuccess();
      }

      appStore.getState().showNotification({
        type: 'success',
        message: 'Account verified successfully!',
        duration: 5000
      });

    } catch (error) {
      // Error - update component status
      if (verificationPage?.setError) {
        verificationPage.setError(error instanceof Error ? error.message : 'Account verification failed');
      }

      appStore.getState().showNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Account verification failed',
        duration: 5000
      });
    }
  }

  private async handleResendVerification(): Promise<void> {
    try {
      // For resending, we'd need the email - this is a simplified implementation
      appStore.getState().showNotification({
        type: 'info',
        message: 'Please go to the resend verification page to request a new email',
        duration: 5000
      });

      appRouter.navigate(ROUTES.RESEND_VERIFICATION);
    } catch (error) {
      appStore.getState().showNotification({
        type: 'error',
        message: 'Failed to resend verification email',
        duration: 5000
      });
    }
  }

  private handleContinue(): void {
    appRouter.navigate(ROUTES.HOME);
  }

  private handleGoToLogin(): void {
    appRouter.navigate(ROUTES.LOGIN);
  }

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}