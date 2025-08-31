// src/components/auth/LoginModal.ts
// Login modal component using ui-modal and existing form logic
import { authStore, appStore } from '../../stores';
import { appRouter, ROUTES } from '../../router';
import { authService } from '../../services';
import { validateUsernameOrEmail, validateRequired } from '../../utils';

export class LoginModal {
  private modal: HTMLElement | null = null;
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <ui-modal id="loginModal" title="Sign in to your account" size="md">
        <div class="auth-modal-content">
          <p class="auth-subtitle">Welcome back! Please sign in to continue</p>
          
          <form id="loginForm" class="auth-form">
            <ui-input 
              name="usernameOrEmail"
              type="text"
              label="Email or Username"
              placeholder="Enter your email or username"
              required
              autofocus>
            </ui-input>
            
            <ui-password-input 
              name="password"
              label="Password"
              placeholder="Enter your password"
              required>
            </ui-password-input>
            
            <div class="form-options">
              <ui-checkbox 
                name="rememberMe"
                label="Remember me">
              </ui-checkbox>
              
              <a href="#" id="forgotPasswordLink" class="forgot-password">
                Forgot password?
              </a>
            </div>
            
            <div id="errorMessage" class="error-message" style="display: none;"></div>
          </form>
          
          <div class="auth-divider">
            <span>or</span>
          </div>
          
          <ui-button 
            type="button" 
            variant="secondary" 
            size="md"
            label="Continue with Google"
            id="googleSignIn">Continue with Google</ui-button>
        </div>
        
        <div slot="footer" class="auth-modal-footer">
          <ui-button 
            type="button" 
            variant="secondary" 
            id="showRegisterModal">Don't have an account? Sign up</ui-button>
          <ui-button 
            type="submit" 
            form="loginForm"
            variant="primary" 
            size="md"
            label="Sign In"
            id="loginButton">Sign In</ui-button>
        </div>
      </ui-modal>
    `;

    this.modal = target.querySelector('#loginModal');
    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container || !this.modal) return;

    const loginForm = this.container.querySelector('#loginForm') as HTMLFormElement;
    const loginButton = this.container.querySelector('#loginButton');
    const googleSignInBtn = this.container.querySelector('#googleSignIn');
    const showRegisterBtn = this.container.querySelector('#showRegisterModal');
    const forgotPasswordLink = this.container.querySelector('#forgotPasswordLink');
    
    // Handle form submission
    loginForm?.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Handle button click (workaround for mouse click issue)
    loginButton?.addEventListener('click', (event) => {
      event.preventDefault();
      if (loginForm) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        loginForm.dispatchEvent(submitEvent);
      }
    });
    
    // Handle Google OAuth
    googleSignInBtn?.addEventListener('click', this.handleGoogleSignIn.bind(this));
    
    // Handle navigation to registration modal
    showRegisterBtn?.addEventListener('click', this.handleShowRegister.bind(this));
    
    // Handle forgot password
    forgotPasswordLink?.addEventListener('click', this.handleForgotPassword.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    
    // Extract values directly from components
    const usernameInput = form.querySelector('ui-input[name="usernameOrEmail"]') as any;
    const passwordInput = form.querySelector('ui-password-input[name="password"]') as any;
    const rememberMeCheckbox = form.querySelector('ui-checkbox[name="rememberMe"]') as any;
    
    const credentials = {
      usernameOrEmail: usernameInput?.value || '',
      password: passwordInput?.value || '',
      rememberMe: rememberMeCheckbox?.checked || false
    };

    // Clear previous errors
    this.clearErrors();

    // Validate required fields using utility functions
    const usernameValidation = validateUsernameOrEmail(credentials.usernameOrEmail);
    const passwordValidation = validateRequired(credentials.password, 'Password');

    if (!usernameValidation.isValid) {
      this.showError(usernameValidation.error!);
      return;
    }

    if (!passwordValidation.isValid) {
      this.showError(passwordValidation.error!);
      return;
    }

    // Disable submit button
    const submitBtn = this.container?.querySelector('#loginButton') as any;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.loading = true;
      submitBtn.textContent = 'Signing In...';
    }

    try {
      await authStore.getState().login(credentials);
      
      appStore.getState().showNotification({
        type: 'success',
        message: 'Successfully signed in!',
        duration: 3000
      });

      // Close modal and navigate to dashboard
      this.close();
      appRouter.navigate(ROUTES.DASHBOARD);
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.loading = false;
        submitBtn.textContent = 'Sign In';
      }
    }
  }

  private handleGoogleSignIn(): void {
    // Close modal first, then initiate Google login
    this.close();
    authService.initiateGoogleLogin();
  }

  private handleShowRegister(event: Event): void {
    event.preventDefault();
    // Close login modal and show register modal
    this.close();
    // Dispatch custom event to show register modal
    window.dispatchEvent(new CustomEvent('show-register-modal'));
  }

  private handleForgotPassword(event: Event): void {
    event.preventDefault();
    // Close modal and navigate to forgot password page
    this.close();
    appRouter.navigate(ROUTES.FORGOT_PASSWORD);
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

  public open(): void {
    if (this.modal) {
      (this.modal as any).open = true;
    }
  }

  public close(): void {
    if (this.modal) {
      (this.modal as any).open = false;
    }
  }

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
    this.modal = null;
  }
}