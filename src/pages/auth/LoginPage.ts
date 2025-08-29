// Login page using building block UI components

import { authStore } from '../../stores/auth.store';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';
import { authService } from '../../services/auth.service';

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
            
            <ui-input 
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              show-toggle>
            </ui-input>
            
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
              size="large"
              full-width
              id="loginButton">
              Sign In
            </ui-button>
            
            <div class="auth-divider">
              <span>or</span>
            </div>
            
            <ui-button 
              type="button" 
              variant="outline" 
              size="large"
              full-width
              id="googleSignIn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </ui-button>
            
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
    const googleSignInBtn = this.container.querySelector('#googleSignIn');
    const registerLink = this.container.querySelector('#registerLink');
    const forgotPasswordLink = this.container.querySelector('#forgotPasswordLink');
    
    // Handle form submission
    if (loginForm) {
      console.log('Login form found, adding event listener');
      loginForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    } else {
      console.error('Login form not found!');
    }
    
    // Handle Google OAuth
    googleSignInBtn?.addEventListener('click', this.handleGoogleSignIn.bind(this));
    
    // Handle navigation
    registerLink?.addEventListener('click', this.handleNavigateRegister.bind(this));
    forgotPasswordLink?.addEventListener('click', this.handleNavigateForgotPassword.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    console.log('Login form submit handler called');
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    console.log('Login form element:', form);
    
    // Extract values directly from UI components
    const usernameOrEmailInput = form.querySelector('ui-input[name="usernameOrEmail"]') as any;
    const passwordInput = form.querySelector('ui-input[name="password"]') as any;
    const rememberMeCheckbox = form.querySelector('ui-checkbox[name="rememberMe"]') as any;
    
    // Extract form data from UI components
    const credentials = {
      usernameOrEmail: usernameOrEmailInput?.value || '',
      password: passwordInput?.value || '',
      rememberMe: rememberMeCheckbox?.checked || false
    };

    console.log('Login form submission data:', credentials);

    // Clear previous errors
    this.clearErrors();

    // Validate required fields
    if (!credentials.usernameOrEmail || !credentials.password) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Disable submit button
    const submitBtn = this.container?.querySelector('#loginButton') as any;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing In...';
    }

    try {
      await authStore.getState().login(credentials);
      
      appStore.getState().showNotification({
        type: 'success',
        message: 'Successfully signed in!',
        duration: 3000
      });

      appRouter.navigate(ROUTES.HOME);
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
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