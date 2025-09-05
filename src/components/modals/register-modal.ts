import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import tailwindStyles from '../../style/main.css?inline';
import { ModalScrollManager } from '../../utils/scrollbar';
import { withFocusTrap } from '../../utils/focus-trap';
import { FormValidator } from '../../utils/validation';
import { ErrorHandler } from '../../utils/error-handler';

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
export class RegisterModal extends withFocusTrap(LitElement) implements ModalComponent {
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
      
      
      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
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
    username: [] as string[],
    email: [] as string[],
    password: [] as string[],
    confirmPassword: [] as string[],
    acceptTerms: [] as string[]
  };

  @state()
  private validationDebounceTimeouts = new Map<string, NodeJS.Timeout>();

  private eventCleanupFunctions: Array<() => void> = [];

  private formRef = createRef<HTMLFormElement>();
  private firstInputRef = createRef<HTMLInputElement>();

  get isOpen(): boolean {
    return this.isModalOpen;
  }

  public open(): void {
    try {
      this.modalState.previousActiveElement = document.activeElement as Element;
      this.isModalOpen = true;
      this.modalState.isOpen = true;
      
      // Use modal scroll manager to prevent page tilt
      ModalScrollManager.openModal();
      
      // Create and activate focus trap
      this.createFocusTrap();
      
      // Focus management after animation
      setTimeout(() => {
        this.activateFocusTrap(this.modalState.previousActiveElement || undefined);
        // Auto-focus first input field
        if (this.firstInputRef.value) {
          this.firstInputRef.value.focus();
        }
      }, 100);
      
      this.dispatchEvent(new CustomEvent('modal-opened', {
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'RegisterModal',
        method: 'open'
      });
    }
  }

  public close(): void {
    try {
      this.isModalOpen = false;
      this.modalState.isOpen = false;
      this.modalState.error = null;
      this.resetForm();
      
      // Deactivate focus trap first
      this.deactivateFocusTrap();
      
      // Use modal scroll manager to restore scrolling
      ModalScrollManager.closeModal();
      
      this.dispatchEvent(new CustomEvent('modal-closed', {
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'RegisterModal',
        method: 'close'
      });
    }
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
      username: [],
      email: [],
      password: [],
      confirmPassword: [],
      acceptTerms: []
    };
    
    // Clear any pending validation timeouts
    this.validationDebounceTimeouts.forEach(timeout => clearTimeout(timeout));
    this.validationDebounceTimeouts.clear();
  }

  private validateForm(): boolean {
    try {
      // Use FormValidator utility with input trimming
      const usernameResult = FormValidator.validateUsername(this.formData.username.trim());
      const emailResult = FormValidator.validateEmail(this.formData.email.trim());
      const passwordResult = FormValidator.validatePassword(this.formData.password);

      // Confirm password validation
      const confirmPasswordErrors: string[] = [];
      if (!this.formData.confirmPassword) {
        confirmPasswordErrors.push('Please confirm your password');
      } else if (this.formData.password !== this.formData.confirmPassword) {
        confirmPasswordErrors.push('Passwords do not match');
      }

      // Terms validation
      const termsErrors: string[] = [];
      if (!this.formData.acceptTerms) {
        termsErrors.push('You must accept the terms and conditions');
      }

      this.fieldErrors = {
        username: usernameResult.errors,
        email: emailResult.errors,
        password: passwordResult.errors,
        confirmPassword: confirmPasswordErrors,
        acceptTerms: termsErrors
      };

      return usernameResult.isValid && 
             emailResult.isValid && 
             passwordResult.isValid && 
             confirmPasswordErrors.length === 0 && 
             termsErrors.length === 0;
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'RegisterModal',
        method: 'validateForm'
      });
      return false;
    }
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
      try {
        const target = e.target as HTMLInputElement;
        
        if (field === 'acceptTerms') {
          this.formData[field] = target.checked;
        } else {
          // Apply input trimming for text fields
          this.formData[field] = target.value.trim();
        }
        
        // Clear field errors when user starts typing
        this.fieldErrors[field as keyof typeof this.fieldErrors] = [];
        
        // Debounced real-time validation for text fields
        if (field !== 'acceptTerms') {
          this.debounceValidation(field, target.value);
        }
        
        this.requestUpdate();
      } catch (error) {
        ErrorHandler.getInstance().handleError(error as Error, {
          component: 'RegisterModal',
          method: 'handleInputChange',
          field
        });
      }
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

  private debounceValidation(field: keyof typeof this.formData, value: string): void {
    // Clear existing timeout for this field
    const existingTimeout = this.validationDebounceTimeouts.get(field);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout for validation
    const timeoutId = setTimeout(() => {
      this.validateSingleField(field, value);
    }, 300);

    this.validationDebounceTimeouts.set(field, timeoutId);
  }

  private validateSingleField(field: keyof typeof this.formData, value: string): void {
    try {
      if (field === 'username') {
        const result = FormValidator.validateUsername(value.trim());
        this.fieldErrors.username = result.errors;
      } else if (field === 'email') {
        const result = FormValidator.validateEmail(value.trim());
        this.fieldErrors.email = result.errors;
      } else if (field === 'password') {
        const result = FormValidator.validatePassword(value);
        this.fieldErrors.password = result.errors;
        
        // Also validate confirm password if it has a value
        if (this.formData.confirmPassword) {
          if (value !== this.formData.confirmPassword) {
            this.fieldErrors.confirmPassword = ['Passwords do not match'];
          } else {
            this.fieldErrors.confirmPassword = [];
          }
        }
      } else if (field === 'confirmPassword') {
        if (value !== this.formData.password) {
          this.fieldErrors.confirmPassword = ['Passwords do not match'];
        } else {
          this.fieldErrors.confirmPassword = [];
        }
      }
      this.requestUpdate();
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'RegisterModal',
        method: 'validateSingleField',
        field
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    this.eventCleanupFunctions.forEach(cleanup => cleanup());
    this.eventCleanupFunctions = [];
    
    // Clear validation timeouts
    this.validationDebounceTimeouts.forEach(timeout => clearTimeout(timeout));
    this.validationDebounceTimeouts.clear();
    
    // Ensure modal scroll manager is cleaned up if modal is removed
    if (this.isModalOpen) {
      ModalScrollManager.closeModal();
    }
    
    // Deactivate focus trap
    this.deactivateFocusTrap();
  }

  render() {
    return html`
      <div 
        class="modal-container" 
        @click=${this.handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <div class="modal-content bg-white rounded-2xl shadow-2xl" @click=${(e: Event) => e.stopPropagation()}>
          <!-- Header -->
          <div class="px-8 pt-8 pb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 id="register-modal-title" class="text-2xl font-bold text-gray-900">
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
            <p id="register-modal-description" class="text-gray-600">
              Join thousands of users managing their links efficiently
            </p>
          </div>

          <!-- Form -->
          <form 
            ${ref(this.formRef)} 
            @submit=${this.handleSubmit} 
            class="px-8 pb-8"
            novalidate
          >
            <!-- Live Region for Dynamic Updates -->
            <div aria-live="polite" aria-atomic="true">
              <!-- Error Display -->
              ${this.modalState.error ? html`
                <div 
                  class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-describedby="register-error-message"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p id="register-error-message" class="text-sm text-red-700">${this.modalState.error}</p>
                  </div>
                </div>
              ` : ''}
            </div>

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
                class="input-base ${this.fieldErrors.username.length > 0 ? 'input-error' : ''}"
                placeholder="Choose a username"
                ?disabled=${this.modalState.isLoading}
                aria-required="true"
                aria-invalid=${this.fieldErrors.username.length > 0 ? 'true' : 'false'}
                aria-describedby=${this.fieldErrors.username.length > 0 ? 'username-error' : ''}
                autocomplete="username"
                inputmode="text"
                autocapitalize="none"
                spellcheck="false"
              />
              ${this.fieldErrors.username.length > 0 ? html`
                <div id="username-error" role="alert" aria-live="polite">
                  ${this.fieldErrors.username.map(error => html`
                    <p class="mt-1 text-sm text-red-600">${error}</p>
                  `)}
                </div>
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
                class="input-base ${this.fieldErrors.email.length > 0 ? 'input-error' : ''}"
                placeholder="Enter your email address"
                ?disabled=${this.modalState.isLoading}
                aria-required="true"
                aria-invalid=${this.fieldErrors.email.length > 0 ? 'true' : 'false'}
                aria-describedby=${this.fieldErrors.email.length > 0 ? 'email-error' : ''}
                autocomplete="email"
                inputmode="email"
                autocapitalize="none"
                spellcheck="false"
              />
              ${this.fieldErrors.email.length > 0 ? html`
                <div id="email-error" role="alert" aria-live="polite">
                  ${this.fieldErrors.email.map(error => html`
                    <p class="mt-1 text-sm text-red-600">${error}</p>
                  `)}
                </div>
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
                  class="input-base has-toggle ${this.fieldErrors.password.length > 0 ? 'input-error' : ''}"
                  placeholder="Create a strong password"
                  ?disabled=${this.modalState.isLoading}
                  aria-required="true"
                  aria-invalid=${this.fieldErrors.password.length > 0 ? 'true' : 'false'}
                  aria-describedby=${this.fieldErrors.password.length > 0 ? 'register-password-error' : 'register-password-toggle'}
                  autocomplete="new-password"
                  inputmode="text"
                  autocapitalize="none"
                  spellcheck="false"
                />
                <button
                  type="button"
                  @click=${this.togglePasswordVisibility}
                  class="password-toggle"
                  ?disabled=${this.modalState.isLoading}
                  id="register-password-toggle"
                  aria-label=${this.showPassword ? 'Hide password' : 'Show password'}
                  aria-describedby="register-password"
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
              ${this.fieldErrors.password.length > 0 ? html`
                <div id="register-password-error" role="alert" aria-live="polite">
                  ${this.fieldErrors.password.map(error => html`
                    <p class="mt-1 text-sm text-red-600">${error}</p>
                  `)}
                </div>
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
                  class="input-base has-toggle ${this.fieldErrors.confirmPassword.length > 0 ? 'input-error' : ''}"
                  placeholder="Confirm your password"
                  ?disabled=${this.modalState.isLoading}
                  aria-required="true"
                  aria-invalid=${this.fieldErrors.confirmPassword.length > 0 ? 'true' : 'false'}
                  aria-describedby=${this.fieldErrors.confirmPassword.length > 0 ? 'confirm-password-error' : 'confirm-password-toggle'}
                  autocomplete="new-password"
                  inputmode="text"
                  autocapitalize="none"
                  spellcheck="false"
                />
                <button
                  type="button"
                  @click=${this.toggleConfirmPasswordVisibility}
                  class="password-toggle"
                  ?disabled=${this.modalState.isLoading}
                  id="confirm-password-toggle"
                  aria-label=${this.showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  aria-describedby="confirm-password"
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
              ${this.fieldErrors.confirmPassword.length > 0 ? html`
                <div id="confirm-password-error" role="alert" aria-live="polite">
                  ${this.fieldErrors.confirmPassword.map(error => html`
                    <p class="mt-1 text-sm text-red-600">${error}</p>
                  `)}
                </div>
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
                class="input-base"
                placeholder="Your company or organization"
                ?disabled=${this.modalState.isLoading}
                autocomplete="organization"
                inputmode="text"
                autocapitalize="words"
                spellcheck="true"
              />
            </div>

            <!-- Terms and Conditions -->
            <div class="input-group mb-6">
              <label class="flex items-start">
                <input
                  type="checkbox"
                  id="accept-terms"
                  .checked=${this.formData.acceptTerms}
                  @change=${this.handleInputChange('acceptTerms')}
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  ?disabled=${this.modalState.isLoading}
                  aria-required="true"
                  aria-invalid=${this.fieldErrors.acceptTerms.length > 0 ? 'true' : 'false'}
                  aria-describedby=${this.fieldErrors.acceptTerms.length > 0 ? 'accept-terms-error' : ''}
                />
                <span class="ml-2 text-sm text-gray-600">
                  I agree to the 
                  <a href="#" @click=${this.handleTermsClick} class="text-blue-600 hover:text-blue-500">Terms of Service</a> 
                  and 
                  <a href="#" @click=${this.handlePrivacyClick} class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                </span>
              </label>
              ${this.fieldErrors.acceptTerms.length > 0 ? html`
                <div id="accept-terms-error" role="alert" aria-live="polite">
                  ${this.fieldErrors.acceptTerms.map(error => html`
                    <p class="mt-1 text-sm text-red-600">${error}</p>
                  `)}
                </div>
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