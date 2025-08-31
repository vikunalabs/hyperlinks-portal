// src/components/auth/RegisterModal.ts
// Registration modal component using ui-modal and existing form logic
import { authStore, appStore } from '../../stores';
import { appRouter, ROUTES } from '../../router';
import { authService } from '../../services';
import { validateUsername, validateEmail, validatePassword, validatePasswordConfirmation } from '../../utils';

export class RegisterModal {
  private modal: HTMLElement | null = null;
  private container: HTMLElement | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    target.innerHTML = `
      <ui-modal id="registerModal" title="Create Account" size="md">
        <div class="auth-modal-content">
          <p class="auth-subtitle">Join our platform today</p>
          
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
            id="googleSignUp">Continue with Google</ui-button>
        </div>
        
        <div slot="footer" class="auth-modal-footer">
          <ui-button 
            type="button" 
            variant="secondary" 
            id="showLoginModal">Already have an account? Sign in</ui-button>
          <ui-button 
            type="submit" 
            form="registerForm"
            variant="primary" 
            size="md"
            label="Create Account"
            id="registerButton">Create Account</ui-button>
        </div>
      </ui-modal>
    `;

    this.modal = target.querySelector('#registerModal');
    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container || !this.modal) return;

    const registerForm = this.container.querySelector('#registerForm') as HTMLFormElement;
    const registerButton = this.container.querySelector('#registerButton');
    const googleSignUpBtn = this.container.querySelector('#googleSignUp');
    const showLoginBtn = this.container.querySelector('#showLoginModal');
    
    // Handle form submission
    registerForm?.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Handle button click (workaround for mouse click issue)
    registerButton?.addEventListener('click', (event) => {
      event.preventDefault();
      if (registerForm) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        registerForm.dispatchEvent(submitEvent);
      }
    });
    
    // Handle Google OAuth
    googleSignUpBtn?.addEventListener('click', this.handleGoogleSignUp.bind(this));
    
    // Handle navigation to login modal
    showLoginBtn?.addEventListener('click', this.handleShowLogin.bind(this));
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    
    // Extract values directly from components
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

      // Close modal and navigate to verification page
      this.close();
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
    // Close modal first, then initiate Google login
    this.close();
    authService.initiateGoogleLogin();
  }

  private handleShowLogin(event: Event): void {
    event.preventDefault();
    // Close register modal and show login modal
    this.close();
    // Dispatch custom event to show login modal
    window.dispatchEvent(new CustomEvent('show-login-modal'));
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