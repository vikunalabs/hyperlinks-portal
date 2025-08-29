// Resend verification email page using building block UI components

import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';

export class ResendVerificationPage {
  private container: HTMLElement | null = null;
  private email: string | null = null;
  private context: string | null = null;

  constructor(email?: string, context?: string) {
    this.email = email || null;
    this.context = context || null;
  }

  public render(target: HTMLElement): void {
    this.container = target;
    
    const isPostRegistration = this.context === 'registration';
    const title = isPostRegistration ? "Check Your Email" : "Resend Verification Email";
    const subtitle = isPostRegistration 
      ? "We've sent you a verification link" 
      : "We'll send you a new verification link";
    const instructions = isPostRegistration 
      ? "We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account." 
      : "Enter your email address below and we'll send you a new verification link to activate your account.";
    
    target.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>${title}</h1>
            <p>${subtitle}</p>
          </div>
          
          ${isPostRegistration ? `
            <div class="instructions">
              <p>${instructions}</p>
              ${this.email ? `<p><strong>Email:</strong> ${this.email}</p>` : ''}
            </div>
            
            <div class="resend-section">
              <p>Didn't receive the email?</p>
              <ui-button 
                type="button" 
                variant="outline" 
                size="large"
                full-width
                id="resendButton">
                Send Again
              </ui-button>
            </div>
          ` : `
            <form id="resendForm" class="auth-form">
              <div class="instructions">
                <p>${instructions}</p>
              </div>
              
              <ui-input 
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value="${this.email || ''}"
                required
                autofocus>
              </ui-input>
              
              <ui-button 
                type="submit" 
                variant="primary" 
                size="large"
                full-width
                id="resendButton">
                Send Verification Email
              </ui-button>
            </form>
          `}
          
          <div class="auth-footer">
            <p>Remember your password? <a href="/login" id="loginLink">Sign in</a></p>
            <p>Don't have an account? <a href="/register" id="registerLink">Sign up</a></p>
          </div>
          
          <div id="errorMessage" class="error-message" style="display: none;"></div>
        </ui-card>
      </div>
    `;
    
    this.bindEvents();
  }


  private bindEvents(): void {
    if (!this.container) return;

    const resendForm = this.container.querySelector('#resendForm') as HTMLFormElement;
    const resendButton = this.container.querySelector('#resendButton');
    const loginLink = this.container.querySelector('#loginLink');
    const registerLink = this.container.querySelector('#registerLink');
    
    // Handle form submission (for non-post-registration case)
    resendForm?.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Handle resend button click (for post-registration case)
    resendButton?.addEventListener('click', this.handleResendClick.bind(this));
    
    // Handle navigation
    loginLink?.addEventListener('click', this.handleNavigateLogin.bind(this));
    registerLink?.addEventListener('click', this.handleNavigateRegister.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    
    if (!email) {
      this.showError('Email address is required');
      return;
    }
    
    await this.sendVerificationEmail(email);
  }

  private async handleResendClick(event: Event): Promise<void> {
    event.preventDefault();
    
    const emailToUse = this.email;
    if (!emailToUse) {
      this.showError('Email address is required');
      return;
    }
    
    await this.sendVerificationEmail(emailToUse);
  }

  private async sendVerificationEmail(email: string): Promise<void> {
    this.clearErrors();
    
    // Disable the button
    const resendBtn = this.container?.querySelector('#resendButton') as any;
    if (resendBtn) {
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending...';
    }

    try {
      await authService.resendVerification(email);
      
      appStore.getState().showNotification({
        type: 'success',
        message: `Verification email sent to ${email}!`,
        duration: 5000
      });

    } catch (error) {
      let errorMessage = 'Failed to send verification email';
      
      if (error instanceof Error) {
        if (error.message.includes('already verified')) {
          errorMessage = 'This email address is already verified. Please try signing in.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Email address not found. Please check your email or sign up for a new account.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.showError(errorMessage);

    } finally {
      // Re-enable the button
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.textContent = this.context === 'registration' ? 'Send Again' : 'Send Verification Email';
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