// src/pages/auth/ConfirmAccountPage.ts
// Account confirmation page using lit-ui-library components
import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';

export class ConfirmAccountPage {
  private container: HTMLElement | null = null;
  private token: string;
  private verificationStatus: 'verifying' | 'success' | 'error' = 'verifying';

  constructor(token: string) {
    this.token = token;
  }

  public render(target: HTMLElement): void {
    this.container = target;
    this.renderContent();
    this.performVerification();
  }

  private renderContent(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>Account Verification</h1>
            <p id="statusMessage">Please wait while we verify your account...</p>
          </div>
          
          <div id="verificationContent" class="verification-content">
            ${this.getContentForStatus()}
          </div>
          
          <div id="actionButtons" class="auth-footer" style="display: none;">
            <ui-button 
              type="button" 
              variant="primary" 
              size="lg"
              label="Continue to Sign In"
              id="continueButton"
              style="display: none;">Continue to Sign In</ui-button>
            
            <div class="auth-links">
              <a href="#" id="loginLink">Go to Sign In</a>
              <a href="#" id="resendLink">Resend Verification Email</a>
            </div>
          </div>
        </ui-card>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container) return;

    const continueButton = this.container.querySelector('#continueButton');
    const loginLink = this.container.querySelector('#loginLink');
    const resendLink = this.container.querySelector('#resendLink');
    
    continueButton?.addEventListener('click', this.handleContinue.bind(this));
    loginLink?.addEventListener('click', this.handleGoToLogin.bind(this));
    resendLink?.addEventListener('click', this.handleResendVerification.bind(this));
  }

  private getContentForStatus(): string {
    switch (this.verificationStatus) {
      case 'verifying':
        return `
          <div class="verification-status verifying">
            <ui-spinner size="lg"></ui-spinner>
            <p>Verifying your account token...</p>
          </div>
        `;
      case 'success':
        return `
          <div class="verification-status success">
            <div class="success-icon">✅</div>
            <p>Your account has been successfully verified!</p>
            <p class="sub-message">You can now access all features of your account.</p>
          </div>
        `;
      case 'error':
        return `
          <div class="verification-status error">
            <div class="error-icon">❌</div>
            <p>Account verification failed.</p>
            <p class="sub-message">The link may be expired or invalid. Please try requesting a new verification email.</p>
          </div>
        `;
      default:
        return '';
    }
  }

  private updateStatus(status: 'success' | 'error', message?: string): void {
    this.verificationStatus = status;
    
    const statusMessageEl = this.container?.querySelector('#statusMessage');
    const verificationContentEl = this.container?.querySelector('#verificationContent');
    const actionButtonsEl = this.container?.querySelector('#actionButtons');
    const continueButtonEl = this.container?.querySelector('#continueButton');
    const resendLinkEl = this.container?.querySelector('#resendLink');
    
    if (statusMessageEl) {
      statusMessageEl.textContent = status === 'success' 
        ? 'Verification successful!' 
        : 'Verification failed';
    }
    
    if (verificationContentEl) {
      verificationContentEl.innerHTML = this.getContentForStatus();
    }
    
    if (actionButtonsEl) {
      actionButtonsEl.style.display = 'block';
    }
    
    if (continueButtonEl && status === 'success') {
      continueButtonEl.style.display = 'block';
    }
    
    // Only show resend link on error, hide on success
    if (resendLinkEl) {
      resendLinkEl.style.display = status === 'error' ? 'inline' : 'none';
    }
  }

  private async performVerification(): Promise<void> {
    try {
      await authService.confirmAccount(this.token);
      
      // Clear the token from URL for security after successful verification
      window.history.replaceState({}, document.title, '/confirm-account/verified');
      
      this.updateStatus('success');
      
      appStore.getState().showNotification({
        type: 'success',
        message: 'Account verified successfully!',
        duration: 5000
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account verification failed';
      
      this.updateStatus('error');
      
      appStore.getState().showNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      });
    }
  }

  private async handleResendVerification(event: Event): Promise<void> {
    event.preventDefault();
    
    appStore.getState().showNotification({
      type: 'info',
      message: 'Redirecting to resend verification page...',
      duration: 3000
    });

    appRouter.navigate(ROUTES.RESEND_VERIFICATION);
  }

  private handleContinue(): void {
    appRouter.navigate(ROUTES.LOGIN);
  }

  private handleGoToLogin(): void {
    appRouter.navigate(ROUTES.LOGIN);
  }

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}