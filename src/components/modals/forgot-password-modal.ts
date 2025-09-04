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

interface ForgotPasswordModalEventDetail {
  email: string;
}

interface ModalCustomEvent<T = any> extends CustomEvent {
  detail: T;
}

@customElement('forgot-password-modal')
export class ForgotPasswordModal extends LitElement implements ModalComponent {
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
    email: ''
  };

  @state()
  private fieldErrors = {
    email: ''
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
      email: ''
    };
    this.fieldErrors = {
      email: ''
    };
  }

  private validateForm(): boolean {
    let isValid = true;
    const errors = { email: '' };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    this.fieldErrors = errors;
    return isValid;
  }

  private isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!(
      this.formData.email.trim() &&
      emailRegex.test(this.formData.email)
    );
  }

  private handleInputChange(field: keyof typeof this.formData) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.formData[field] = target.value;
      
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
      const submitEvent: ModalCustomEvent<ForgotPasswordModalEventDetail> = new CustomEvent('modal-submit', {
        bubbles: true,
        composed: true,
        detail: {
          email: this.formData.email
        }
      }) as ModalCustomEvent<ForgotPasswordModalEventDetail>;
      
      this.dispatchEvent(submitEvent);
      
    } catch (error) {
      this.modalState.error = error instanceof Error ? error.message : 'Failed to send reset email';
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

  private handleBackToLogin = () => {
    this.close();
    this.dispatchEvent(new CustomEvent('back-to-login', {
      bubbles: true,
      composed: true
    }));
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
                Reset your password
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
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <!-- Form -->
          <form ${ref(this.formRef)} @submit=${this.handleSubmit} class="px-8 pb-8">
            <!-- Error Display -->
            ${this.modalState.error ? html`
              <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-red-700">${this.modalState.error}</p>
                </div>
              </div>
            ` : ''}

            <!-- Email Field -->
            <div class="input-group mb-4">
              <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                ${ref(this.firstInputRef)}
                type="email"
                id="forgot-email"
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
                Sending reset link...
              ` : 'Send reset link'}
            </button>

            <!-- Back to Login Link -->
            <p class="text-center text-sm text-gray-600">
              Remember your password?
              <button
                type="button"
                @click=${this.handleBackToLogin}
                class="text-blue-600 hover:text-blue-500 font-medium transition-colors ml-1"
                ?disabled=${this.modalState.isLoading}
              >
                Back to login
              </button>
            </p>
          </form>
        </div>
      </div>
    `;
  }
}