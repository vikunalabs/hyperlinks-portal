// src/pages/auth/LoginPage.ts
// Login page using building block UI components
import { authStore, appStore } from '../../stores';
import { appRouter, ROUTES } from '../../router';
import { authService } from '../../services';
import { validateUsernameOrEmail, validateRequired } from '../../utils';

export class LoginPage {
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>Sign in to your account</h1>
            <p>Welcome back! Please sign in to continue</p>
          </div>
          
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
              
              <a href="/forgot-password" id="forgotPasswordLink" class="forgot-password">
                Forgot password?
              </a>
            </div>
            
            <ui-button 
              type="submit" 
              variant="primary" 
              size="lg"
              label="Sign In"
              id="loginButton">Sign In</ui-button>
            
            <div class="auth-divider">
              <span>or</span>
            </div>
            
            <ui-button 
              type="button" 
              variant="secondary" 
              size="lg"
              label="Continue with Google"
              id="googleSignIn">Continue with Google</ui-button>
            
            <div class="auth-footer">
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

    const loginForm = this.container.querySelector('#loginForm') as HTMLFormElement;
    const loginButton = this.container.querySelector('#loginButton');
    const googleSignInBtn = this.container.querySelector('#googleSignIn');
    const registerLink = this.container.querySelector('#registerLink');
    const forgotPasswordLink = this.container.querySelector('#forgotPasswordLink');
    
    // Handle form submission
    loginForm?.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Also add click handler to button as fallback
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        if (loginForm) {
          // Trigger form submission
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          loginForm.dispatchEvent(submitEvent);
        }
      });
    }
    
    // Handle Google OAuth
    googleSignInBtn?.addEventListener('click', this.handleGoogleSignIn.bind(this));
    
    // Handle navigation
    registerLink?.addEventListener('click', this.handleNavigateRegister.bind(this));
    forgotPasswordLink?.addEventListener('click', this.handleNavigateForgotPassword.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    
    // Extract values directly from components (FormData not working yet with lit-ui-library)
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
    // Use the auth service method for Google OAuth
    authService.initiateGoogleLogin();
  }

  private handleNavigateRegister(): void {
    appRouter.navigate(ROUTES.REGISTER);
  }

  private handleNavigateForgotPassword(event: Event): void {
    event.preventDefault();
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


  public destroy(): void {
    // Clean up any event listeners or resources
    this.container = null;
  }
}