// Reset password page using building block UI components

import { authService } from '../../services/auth.service';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';
import { validatePassword, validatePasswordConfirmation } from '../../utils';

export class ResetPasswordPage {
  private container: HTMLElement | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>Reset Your Password</h1>
            <p>Enter your new password below</p>
            <p class="instructions">Choose a strong password that you haven't used before. Your password will be used to secure your account.</p>
          </div>
          
          <form id="resetPasswordForm" class="auth-form">
            <ui-password-input 
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              required>
            </ui-password-input>
            
            <ui-password-input 
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              required>
            </ui-password-input>
            
            <ui-button 
              type="submit" 
              variant="primary" 
              size="lg"
              label="Reset Password"
              id="resetButton">Reset Password</ui-button>
              
            <div class="auth-footer">
              <p><a href="/login" id="backToLoginLink">← Back to Sign In</a></p>
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

    const resetForm = this.container.querySelector('#resetPasswordForm') as HTMLFormElement;
    const resetButton = this.container.querySelector('#resetButton');
    const backToLoginLink = this.container.querySelector('#backToLoginLink');
    
    // Handle form submission
    resetForm?.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Also add click handler to button as fallback
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (resetForm) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          resetForm.dispatchEvent(submitEvent);
        }
      });
    }
    
    // Handle navigation to login
    backToLoginLink?.addEventListener('click', this.handleBackToLogin.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    
    // Extract values directly from components
    const newPasswordInput = form.querySelector('ui-password-input[name="newPassword"]') as any;
    const confirmPasswordInput = form.querySelector('ui-password-input[name="confirmPassword"]') as any;
    
    const newPassword = newPasswordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';

    // Clear previous errors
    this.clearErrors();

    // Validate using utility functions
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      this.showError(passwordValidation.error!);
      return;
    }

    const passwordConfirmValidation = validatePasswordConfirmation(newPassword, confirmPassword);
    if (!passwordConfirmValidation.isValid) {
      this.showError(passwordConfirmValidation.error!);
      return;
    }

    // Disable submit button
    const submitBtn = this.container?.querySelector('#resetButton') as any;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.loading = true;
      submitBtn.textContent = 'Resetting Password...';
    }

    try {
      await authService.resetPassword(this.token, newPassword);
      
      appStore.getState().showNotification({
        type: 'success',
        message: 'Password reset successfully! Please sign in with your new password.',
        duration: 5000
      });

      // Redirect to login after successful reset
      setTimeout(() => {
        appRouter.navigate(ROUTES.LOGIN);
      }, 2000);

    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.loading = false;
        submitBtn.textContent = 'Reset Password';
      }
    }
  }

  private handleBackToLogin(event: Event): void {
    event.preventDefault();
    appRouter.navigate(ROUTES.LOGIN);
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