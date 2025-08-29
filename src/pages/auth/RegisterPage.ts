// Register page using enhanced UI library page component

import { authStore } from '../../stores/auth.store';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';
import { authService } from '../../services/auth.service';

export class RegisterPage {
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    console.log('RegisterPage rendering...');
    
    target.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>Create your account</h1>
            <p>Join thousands of users already using our platform</p>
          </div>
          
          <form id="registerForm" class="auth-form">
            <ui-input 
              name="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              required>
            </ui-input>
            
            <ui-input 
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              required>
            </ui-input>
            
            <ui-input 
              name="password"
              type="password"
              label="Password"
              placeholder="Enter a strong password"
              required
              show-toggle>
            </ui-input>
            
            <ui-input 
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              show-toggle>
            </ui-input>
            
            <ui-input 
              name="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name">
            </ui-input>
            
            <ui-input 
              name="organization"
              type="text"
              label="Organization (Optional)"
              placeholder="Enter your organization">
            </ui-input>
            
            <ui-checkbox 
              name="acceptTerms"
              label="I accept the Terms of Service and Privacy Policy"
              required>
            </ui-checkbox>
            
            <ui-checkbox 
              name="subscribe"
              label="Subscribe to our newsletter for updates">
            </ui-checkbox>
            
            <ui-button 
              type="submit" 
              variant="primary" 
              size="large"
              full-width
              id="registerButton">
              Create Account
            </ui-button>
            
            <div class="auth-divider">
              <span>or</span>
            </div>
            
            <ui-button 
              type="button" 
              variant="outline" 
              size="large"
              full-width
              id="googleSignUp">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </ui-button>
            
            <div class="auth-footer">
              <p>Already have an account? <a href="/login" id="loginLink">Sign in</a></p>
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

    const registerForm = this.container.querySelector('#registerForm') as HTMLFormElement;
    const googleSignUpBtn = this.container.querySelector('#googleSignUp');
    const loginLink = this.container.querySelector('#loginLink');
    
    // Handle form submission
    if (registerForm) {
      console.log('Register form found, adding event listener');
      registerForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    } else {
      console.error('Register form not found!');
    }
    
    // Handle Google OAuth
    googleSignUpBtn?.addEventListener('click', this.handleGoogleSignUp.bind(this));
    
    // Handle navigation to login
    loginLink?.addEventListener('click', this.handleNavigateLogin.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    console.log('Form submit handler called');
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    console.log('Form element:', form);
    
    // Extract values directly from UI components
    const usernameInput = form.querySelector('ui-input[name="username"]') as any;
    const emailInput = form.querySelector('ui-input[name="email"]') as any;
    const passwordInput = form.querySelector('ui-input[name="password"]') as any;
    const confirmPasswordInput = form.querySelector('ui-input[name="confirmPassword"]') as any;
    const nameInput = form.querySelector('ui-input[name="name"]') as any;
    const organizationInput = form.querySelector('ui-input[name="organization"]') as any;
    const termsCheckbox = form.querySelector('ui-checkbox[name="acceptTerms"]') as any;
    const subscribeCheckbox = form.querySelector('ui-checkbox[name="subscribe"]') as any;
    
    // Extract form data from UI components
    const password = passwordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';
    
    const registrationData = {
      username: usernameInput?.value || '',
      email: emailInput?.value || '',
      password: password,
      name: nameInput?.value || '',
      organization: organizationInput?.value || undefined,
      termsConsent: termsCheckbox?.checked || false,
      marketingConsent: subscribeCheckbox?.checked || false
    };

    console.log('Form submission data:', registrationData);

    // Clear previous errors
    this.clearErrors();

    // Validate required fields
    if (!registrationData.username || !registrationData.email || !registrationData.password || !confirmPassword) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      this.showError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      this.showError('Password must be at least 8 characters long');
      return;
    }

    if (!registrationData.termsConsent) {
      this.showError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    // Disable submit button
    const submitBtn = this.container?.querySelector('#registerButton') as any;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
    }

    try {
      await authStore.getState().register(registrationData);
      
      appStore.getState().showNotification({
        type: 'success',
        message: 'Account created successfully! Please check your email to verify your account.',
        duration: 5000
      });

      appRouter.navigate(`${ROUTES.RESEND_VERIFICATION}?email=${encodeURIComponent(registrationData.email)}&context=registration`);
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }
  }

  private handleGoogleSignUp(): void {
    // Use the auth service method for Google OAuth
    authService.initiateGoogleLogin();
  }

  private handleNavigateLogin(event: Event): void {
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