import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import tailwindStyles from '../../style/main.css?inline';
import { ModalScrollManager } from '../../utils/scrollbar';
// Define types locally for now to avoid import issues
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

interface LoginModalEventDetail {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

interface ModalCustomEvent<T = any> extends CustomEvent {
  detail: T;
}

@customElement('login-modal')
export class LoginModal extends LitElement implements ModalComponent {
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
    usernameOrEmail: '',
    password: '',
    rememberMe: false
  };

  @state()
  private showPassword = false; // Default: password hidden

  @state()
  private fieldErrors = {
    usernameOrEmail: '',
    password: ''
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
    
    // Use modal scroll manager to prevent page tilt
    ModalScrollManager.openModal();
    
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
    
    // Use modal scroll manager to restore scrolling
    ModalScrollManager.closeModal();
    
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
      usernameOrEmail: '',
      password: '',
      rememberMe: false
    };
    this.fieldErrors = {
      usernameOrEmail: '',
      password: ''
    };
  }

  private validateForm(): boolean {
    let isValid = true;
    const errors = { usernameOrEmail: '', password: '' };

    if (!this.formData.usernameOrEmail.trim()) {
      errors.usernameOrEmail = 'Username or email is required';
      isValid = false;
    }

    if (!this.formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (this.formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    this.fieldErrors = errors;
    return isValid;
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.usernameOrEmail.trim() && 
      this.formData.password && 
      this.formData.password.length >= 8
    );
  }

  private handleInputChange(field: keyof typeof this.formData) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (field === 'rememberMe') {
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
      const submitEvent: ModalCustomEvent<LoginModalEventDetail> = new CustomEvent('modal-submit', {
        bubbles: true,
        composed: true,
        detail: {
          usernameOrEmail: this.formData.usernameOrEmail,
          password: this.formData.password,
          rememberMe: this.formData.rememberMe
        }
      }) as ModalCustomEvent<LoginModalEventDetail>;
      
      this.dispatchEvent(submitEvent);
      
    } catch (error) {
      this.modalState.error = error instanceof Error ? error.message : 'Login failed';
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

  private handleForgotPassword = () => {
    this.close();
    this.dispatchEvent(new CustomEvent('forgot-password-clicked', {
      bubbles: true,
      composed: true
    }));
  };

  private handleNavigateToSignup = () => {
    this.close();
    this.dispatchEvent(new CustomEvent('navigate-to-signup', {
      bubbles: true,
      composed: true
    }));
  };

  private handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
    this.dispatchEvent(new CustomEvent('google-signin-clicked', {
      bubbles: true,
      composed: true
    }));
  };

  private togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    // Ensure modal scroll manager is cleaned up if modal is removed
    if (this.isModalOpen) {
      ModalScrollManager.closeModal();
    }
  }

  render() {
    return html`
      <div class="modal-container" @click=${this.handleBackdropClick}>
        <div class="modal-content bg-white rounded-2xl shadow-2xl" @click=${(e: Event) => e.stopPropagation()}>
            <!-- Header -->
            <div class="px-8 pt-8 pb-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-gray-900">
                  Welcome back
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
                Sign in to your account to continue
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

              <!-- Username/Email Field -->
              <div class="input-group mb-4">
                <label for="usernameOrEmail" class="block text-sm font-medium text-gray-700 mb-2">
                  Username or Email <span class="text-red-500">*</span>
                </label>
                <input
                  ${ref(this.firstInputRef)}
                  type="text"
                  id="usernameOrEmail"
                  .value=${this.formData.usernameOrEmail}
                  @input=${this.handleInputChange('usernameOrEmail')}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${this.fieldErrors.usernameOrEmail ? 'input-error' : ''}"
                  placeholder="Enter your username or email"
                  ?disabled=${this.modalState.isLoading}
                />
                ${this.fieldErrors.usernameOrEmail ? html`
                  <p class="mt-1 text-sm text-red-600">${this.fieldErrors.usernameOrEmail}</p>
                ` : ''}
              </div>

              <!-- Password Field -->
              <div class="input-group mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    type=${this.showPassword ? 'text' : 'password'}
                    id="password"
                    .value=${this.formData.password}
                    @input=${this.handleInputChange('password')}
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${this.fieldErrors.password ? 'input-error' : ''}"
                    placeholder="Enter your password"
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

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between mb-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    .checked=${this.formData.rememberMe}
                    @change=${this.handleInputChange('rememberMe')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    ?disabled=${this.modalState.isLoading}
                  />
                  <span class="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  @click=${this.handleForgotPassword}
                  class="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                  ?disabled=${this.modalState.isLoading}
                >
                  Forgot password?
                </button>
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
                  Signing in...
                ` : 'Sign in'}
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

              <!-- Google Sign In Button -->
              <button
                type="button"
                @click=${this.handleGoogleSignIn}
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

              <!-- Sign Up Link -->
              <p class="text-center text-sm text-gray-600">
                Don't have an account?
                <button
                  type="button"
                  @click=${this.handleNavigateToSignup}
                  class="text-blue-600 hover:text-blue-500 font-medium transition-colors ml-1"
                  ?disabled=${this.modalState.isLoading}
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}