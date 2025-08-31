// Register page using enhanced UI library page component

import { authStore } from '../../stores/auth.store';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';
import { authService } from '../../services/auth.service';
import { validateUsername, validateEmail, validatePassword, validatePasswordConfirmation, validateRequired } from '../../utils';

export class RegisterPage {
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    console.log('RegisterPage rendering...');
    
    target.innerHTML = `
      <div class="auth-container">
        <ui-card class="auth-card">
          <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join our platform today</p>
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
            
            <ui-password-input 
              name="password"
              label="Password"
              placeholder="Enter a strong password"
              required>
            </ui-password-input>
            
            <ui-password-input 
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              required>
            </ui-password-input>
            
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
              size="lg"
              label="Create Account"
              id="registerButton">Create Account</ui-button>
            
            <div class="auth-divider">
              <span>or</span>
            </div>
            
            <ui-button 
              type="button" 
              variant="secondary" 
              size="lg"
              label="Continue with Google"
              id="googleSignUp">Continue with Google</ui-button>
            
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
    const registerButton = this.container.querySelector('#registerButton');
    const googleSignUpBtn = this.container.querySelector('#googleSignUp');
    const loginLink = this.container.querySelector('#loginLink');
    
    console.log('Registration page elements found:');
    console.log('- registerForm:', !!registerForm);
    console.log('- registerButton:', !!registerButton);
    
    // Handle form submission
    if (registerForm) {
      console.log('Register form found, adding event listener');
      registerForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    } else {
      console.error('Register form not found!');
    }

    // Also add click handler to button as fallback
    if (registerButton) {
      console.log('Register button found, adding click listener');
      registerButton.addEventListener('click', () => {
        console.log('Register button clicked');
        if (registerForm) {
          // Trigger form submission
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          registerForm.dispatchEvent(submitEvent);
        }
      });
    } else {
      console.error('Register button not found!');
    }
    
    // Handle Google OAuth
    googleSignUpBtn?.addEventListener('click', this.handleGoogleSignUp.bind(this));
    
    // Handle navigation to login
    loginLink?.addEventListener('click', this.handleNavigateLogin.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    console.log('Registration form submit handler called');
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    
    // Extract values directly from components (FormData not working yet with lit-ui-library)
    const usernameInput = form.querySelector('ui-input[name="username"]') as any;
    const emailInput = form.querySelector('ui-input[name="email"]') as any;
    const passwordInput = form.querySelector('ui-password-input[name="password"]') as any;
    const confirmPasswordInput = form.querySelector('ui-password-input[name="confirmPassword"]') as any;
    const organizationInput = form.querySelector('ui-input[name="organization"]') as any;
    const termsCheckbox = form.querySelector('ui-checkbox[name="acceptTerms"]') as any;
    const subscribeCheckbox = form.querySelector('ui-checkbox[name="subscribe"]') as any;
    
    const password = passwordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';
    
    const registrationData = {
      username: usernameInput?.value || '',
      email: emailInput?.value || '',
      password: password,
      organization: organizationInput?.value || undefined,
      termsConsent: termsCheckbox?.checked || false,
      marketingConsent: subscribeCheckbox?.checked || false
    };

    console.log('Registration form submission data:', registrationData);

    // Clear previous errors
    this.clearErrors();

    // Validate using utility functions
    const usernameValidation = validateUsername(registrationData.username);
    if (!usernameValidation.isValid) {
      this.showError(usernameValidation.error!);
      return;
    }

    const emailValidation = validateEmail(registrationData.email);
    if (!emailValidation.isValid) {
      this.showError(emailValidation.error!);
      return;
    }

    const passwordValidation = validatePassword(registrationData.password);
    if (!passwordValidation.isValid) {
      this.showError(passwordValidation.error!);
      return;
    }

    const passwordConfirmValidation = validatePasswordConfirmation(password, confirmPassword);
    if (!passwordConfirmValidation.isValid) {
      this.showError(passwordConfirmValidation.error!);
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
      submitBtn.loading = true;
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
        submitBtn.loading = false;
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