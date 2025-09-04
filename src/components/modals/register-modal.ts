import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import tailwindStyles from '../../style/main.css?inline';

// Define types locally to avoid import issues
interface ModalComponent {
  open(): void;
  close(): void;
  readonly isOpen: boolean;
  reset?(): void;
}

interface ModalState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  previousActiveElement: Element | null;
}

interface RegisterModalEventDetail {
  username: string;
  email: string;
  password: string;
  organization?: string;
  acceptTerms: boolean;
}

interface ModalCustomEvent<T = any> extends CustomEvent {
  detail: T;
}

@customElement('register-modal')
export class RegisterModal extends LitElement implements ModalComponent {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        display: none;
      }
      
      :host([ismodalopen]) {
        display: flex !important;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }
      
      .modal-container {
        position: relative;
        animation: slideIn 0.3s ease-out;
        max-height: 90vh;
        overflow-y: auto;
        width: 100%;
        max-width: 500px;
        margin: 0 1rem;
        /* Hide scrollbar */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      .modal-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
      }
      
      .modal-content {
        width: 100%;
        background: white !important;
        border: 1px solid rgba(229, 231, 235, 0.8);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .input-error {
        border-color: #ef4444 !important;
      }
      
      .input-group {
        position: relative;
      }
      
      .password-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        transition: color 0.2s;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        z-index: 10;
      }
      
      .password-toggle:hover {
        color: #6B7280;
      }
      
      .password-toggle:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `
  ];

  @property({ type: Boolean, reflect: true })
  isModalOpen = false;

  @state()
  private modalState: ModalState = {
    isOpen: false,
    isLoading: false,
    error: null,
    previousActiveElement: null
  };

  @state()
  private formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    acceptTerms: false
  };

  @state()
  private showPassword = false; // Default: password hidden

  @state()
  private showConfirmPassword = false; // Default: confirm password hidden

  @state()
  private fieldErrors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  };

  private formRef = createRef<HTMLFormElement>();
  private firstInputRef = createRef<HTMLInputElement>();

  get isOpen(): boolean {
    return this.isModalOpen;
  }

  public open(): void {
    this.modalState.previousActiveElement = document.activeElement as Element;
    this.isModalOpen = true;
    this.modalState.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first input after animation
    setTimeout(() => {
      this.firstInputRef.value?.focus();
    }, 100);
    
    this.dispatchEvent(new CustomEvent('modal-opened', {
      bubbles: true,
      composed: true
    }));
  }

  public close(): void {
    this.isModalOpen = false;
    this.modalState.isOpen = false;
    this.modalState.error = null;
    this.resetForm();
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    if (this.modalState.previousActiveElement) {
      (this.modalState.previousActiveElement as HTMLElement).focus();
    }
    
    this.dispatchEvent(new CustomEvent('modal-closed', {
      bubbles: true,
      composed: true
    }));
  }

  public reset(): void {
    this.resetForm();
    this.modalState.error = null;
    this.modalState.isLoading = false;
  }

  private resetForm(): void {
    this.formData = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      organization: '',
      acceptTerms: false
    };
    this.fieldErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: ''
    };
  }

  private validateForm(): boolean {
    let isValid = true;
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: ''
    };

    // Username validation
    if (!this.formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (this.formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (this.formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!this.formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (this.formData.password !== this.formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Terms validation
    if (!this.formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
      isValid = false;
    }

    this.fieldErrors = errors;
    return isValid;
  }

  private isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!(
      this.formData.username.trim().length >= 3 && 
      this.formData.email.trim() &&
      emailRegex.test(this.formData.email) &&
      this.formData.password && 
      this.formData.password.length >= 8 &&
      this.formData.confirmPassword &&
      this.formData.password === this.formData.confirmPassword &&
      this.formData.acceptTerms
    );
  }

  private handleInputChange(field: keyof typeof this.formData) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (field === 'acceptTerms') {
        this.formData[field] = target.checked;
      } else {
        this.formData[field] = target.value;
      }
      
      // Clear field error when user starts typing
      if (field in this.fieldErrors) {
        this.fieldErrors[field as keyof typeof this.fieldErrors] = '';
      }
      
      this.requestUpdate();
    };
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.modalState.isLoading = true;
    this.modalState.error = null;
    this.requestUpdate();

    try {
      // Dispatch custom event with form data
      const submitEvent: ModalCustomEvent<RegisterModalEventDetail> = new CustomEvent('modal-submit', {
        bubbles: true,
        composed: true,
        detail: {
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password,
          organization: this.formData.organization || undefined,
          acceptTerms: this.formData.acceptTerms
        }
      }) as ModalCustomEvent<RegisterModalEventDetail>;
      
      this.dispatchEvent(submitEvent);
      
    } catch (error) {
      this.modalState.error = error instanceof Error ? error.message : 'Registration failed';
      this.modalState.isLoading = false;
      this.requestUpdate();
    }
  };

  private handleBackdropClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      this.close();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.close();
    }
  };

  private handleNavigateToSignin = () => {
    this.close();
    this.dispatchEvent(new CustomEvent('navigate-to-signin', {
      bubbles: true,
      composed: true
    }));
  };

  private handleGoogleSignUp = () => {
    console.log('Google Sign Up clicked');
    this.dispatchEvent(new CustomEvent('google-signup-clicked', {
      bubbles: true,
      composed: true
    }));
  };

  private togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  };

  private toggleConfirmPasswordVisibility = () => {
    this.showConfirmPassword = !this.showConfirmPassword;
  };

  private handleTermsClick = (e: Event) => {
    e.preventDefault();
    // Open terms page in new tab
    window.open('/terms.html', '_blank');
  };

  private handlePrivacyClick = (e: Event) => {
    e.preventDefault();
    // Open privacy page in new tab
    window.open('/privacy.html', '_blank');
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    // Restore body scroll if modal is removed
    document.body.style.overflow = '';
  }

  render() {
    return html`
      <div class="modal-container" @click=${this.handleBackdropClick}>
        <div class="modal-content bg-white rounded-2xl shadow-2xl" @click=${(e: Event) => e.stopPropagation()}>
          <!-- Header -->
          <div class="px-8 pt-8 pb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-900">
                Create your account
              </h2>
              <button 
                @click=${this.close}
                class="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-gray-600">
              Join thousands of users managing their links efficiently
            </p>
          </div>

          <!-- Form -->
          <form ${ref(this.formRef)} @submit=${this.handleSubmit} class="px-8 pb-8">
            <!-- Error Display -->
            ${this.modalState.error ? html`
              <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-red-700">${this.modalState.error}</p>
                </div>
              </div>
            ` : ''}

            <!-- Username Field -->
            <div class="input-group mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username <span class="text-red-500">*</span>
              </label>
              <input
                ${ref(this.firstInputRef)}
                type="text"
                id="username"
                .value=${this.formData.username}
                @input=${this.handleInputChange('username')}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${this.fieldErrors.username ? 'input-error' : ''}"
                placeholder="Choose a username"
                ?disabled=${this.modalState.isLoading}
              />
              ${this.fieldErrors.username ? html`
                <p class="mt-1 text-sm text-red-600">${this.fieldErrors.username}</p>
              ` : ''}
            </div>

            <!-- Email Field -->
            <div class="input-group mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                .value=${this.formData.email}
                @input=${this.handleInputChange('email')}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${this.fieldErrors.email ? 'input-error' : ''}"
                placeholder="Enter your email address"
                ?disabled=${this.modalState.isLoading}
              />
              ${this.fieldErrors.email ? html`
                <p class="mt-1 text-sm text-red-600">${this.fieldErrors.email}</p>
              ` : ''}
            </div>

            <!-- Password Field -->
            <div class="input-group mb-4">
              <label for="register-password" class="block text-sm font-medium text-gray-700 mb-2">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type=${this.showPassword ? 'text' : 'password'}
                  id="register-password"
                  .value=${this.formData.password}
                  @input=${this.handleInputChange('password')}
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${this.fieldErrors.password ? 'input-error' : ''}"
                  placeholder="Create a strong password"
                  ?disabled=${this.modalState.isLoading}
                />
                <button
                  type="button"
                  @click=${this.togglePasswordVisibility}
                  class="password-toggle"
                  ?disabled=${this.modalState.isLoading}
                >
                  ${this.showPassword ? html`
                    <!-- Eye open (password visible, click to hide) -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ` : html`
                    <!-- Eye closed/slashed (password hidden, click to show) -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  `}
                </button>
              </div>
              ${this.fieldErrors.password ? html`
                <p class="mt-1 text-sm text-red-600">${this.fieldErrors.password}</p>
              ` : ''}
            </div>

            <!-- Confirm Password Field -->
            <div class="input-group mb-4">
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type=${this.showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  .value=${this.formData.confirmPassword}
                  @input=${this.handleInputChange('confirmPassword')}
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${this.fieldErrors.confirmPassword ? 'input-error' : ''}"
                  placeholder="Confirm your password"
                  ?disabled=${this.modalState.isLoading}
                />
                <button
                  type="button"
                  @click=${this.toggleConfirmPasswordVisibility}
                  class="password-toggle"
                  ?disabled=${this.modalState.isLoading}
                >
                  ${this.showConfirmPassword ? html`
                    <!-- Eye open (password visible, click to hide) -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.723 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ` : html`
                    <!-- Eye closed/slashed (password hidden, click to show) -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  `}
                </button>
              </div>
              ${this.fieldErrors.confirmPassword ? html`
                <p class="mt-1 text-sm text-red-600">${this.fieldErrors.confirmPassword}</p>
              ` : ''}
            </div>

            <!-- Organization Field (Optional) -->
            <div class="input-group mb-4">
              <label for="organization" class="block text-sm font-medium text-gray-700 mb-2">
                Organization <span class="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="organization"
                .value=${this.formData.organization}
                @input=${this.handleInputChange('organization')}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Your company or organization"
                ?disabled=${this.modalState.isLoading}
              />
            </div>

            <!-- Terms and Conditions -->
            <div class="input-group mb-6">
              <label class="flex items-start">
                <input
                  type="checkbox"
                  .checked=${this.formData.acceptTerms}
                  @change=${this.handleInputChange('acceptTerms')}
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  ?disabled=${this.modalState.isLoading}
                />
                <span class="ml-2 text-sm text-gray-600">
                  I agree to the 
                  <a href="#" @click=${this.handleTermsClick} class="text-blue-600 hover:text-blue-500">Terms of Service</a> 
                  and 
                  <a href="#" @click=${this.handlePrivacyClick} class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                </span>
              </label>
              ${this.fieldErrors.acceptTerms ? html`
                <p class="mt-1 text-sm text-red-600">${this.fieldErrors.acceptTerms}</p>
              ` : ''}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn-primary w-full justify-center mb-4 ${!this.isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}"
              ?disabled=${this.modalState.isLoading || !this.isFormValid()}
            >
              ${this.modalState.isLoading ? html`
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              ` : 'Create Account'}
            </button>

            <!-- Divider -->
            <div class="relative mb-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <!-- Google Sign Up Button -->
            <button
              type="button"
              @click=${this.handleGoogleSignUp}
              class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mb-4"
              ?disabled=${this.modalState.isLoading}
            >
              <!-- Google Logo SVG -->
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <!-- Sign In Link -->
            <p class="text-center text-sm text-gray-600">
              Already have an account?
              <button
                type="button"
                @click=${this.handleNavigateToSignin}
                class="text-blue-600 hover:text-blue-500 font-medium transition-colors ml-1"
                ?disabled=${this.modalState.isLoading}
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    `;
  }
}