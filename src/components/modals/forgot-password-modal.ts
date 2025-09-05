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

interface ForgotPasswordModalEventDetail {
  email: string;
}

interface ModalCustomEvent<T = any> extends CustomEvent {
  detail: T;
}

@customElement('forgot-password-modal')
export class ForgotPasswordModal extends withFocusTrap(LitElement) implements ModalComponent {
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
    email: ''
  };

  @state()
  private fieldErrors = {
    email: [] as string[]
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
        component: 'ForgotPasswordModal',
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
        component: 'ForgotPasswordModal',
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
      email: ''
    };
    this.fieldErrors = {
      email: []
    };
    
    // Clear any pending validation timeouts
    this.validationDebounceTimeouts.forEach(timeout => clearTimeout(timeout));
    this.validationDebounceTimeouts.clear();
  }

  private validateForm(): boolean {
    try {
      // Use FormValidator utility with input trimming
      const emailResult = FormValidator.validateEmail(this.formData.email.trim());

      this.fieldErrors = {
        email: emailResult.errors
      };

      return emailResult.isValid;
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'ForgotPasswordModal',
        method: 'validateForm'
      });
      return false;
    }
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
      try {
        const target = e.target as HTMLInputElement;
        
        // Apply input trimming
        this.formData[field] = target.value.trim();
        
        // Clear field errors when user starts typing
        this.fieldErrors[field as keyof typeof this.fieldErrors] = [];
        
        // Debounced real-time validation
        this.debounceValidation(field, target.value);
        
        this.requestUpdate();
      } catch (error) {
        ErrorHandler.getInstance().handleError(error as Error, {
          component: 'ForgotPasswordModal',
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
      if (field === 'email') {
        const result = FormValidator.validateEmail(value.trim());
        this.fieldErrors.email = result.errors;
      }
      this.requestUpdate();
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'ForgotPasswordModal',
        method: 'validateSingleField',
        field
      });
    }
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
        aria-labelledby="forgot-password-modal-title"
        aria-describedby="forgot-password-modal-description"
      >
        <div class="modal-content bg-white rounded-2xl shadow-2xl" @click=${(e: Event) => e.stopPropagation()}>
          <!-- Header -->
          <div class="px-8 pt-8 pb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 id="forgot-password-modal-title" class="text-2xl font-bold text-gray-900">
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
            <p id="forgot-password-modal-description" class="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
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
                  class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-describedby="forgot-password-error-message"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p id="forgot-password-error-message" class="text-sm text-red-700">${this.modalState.error}</p>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Email Field -->
            <div class="input-group mb-4">
              <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                ${ref(this.firstInputRef)}
                type="email"
                id="forgot-email"
                name="email"
                .value=${this.formData.email}
                @input=${this.handleInputChange('email')}
                class="input-base ${this.fieldErrors.email.length > 0 ? 'input-error' : ''}"
                placeholder="Enter your email address"
                ?disabled=${this.modalState.isLoading}
                aria-required="true"
                aria-invalid=${this.fieldErrors.email.length > 0 ? 'true' : 'false'}
                aria-describedby=${this.fieldErrors.email.length > 0 ? 'forgot-email-error' : ''}
                autocomplete="email"
                inputmode="email"
                autocapitalize="none"
                spellcheck="false"
              />
              ${this.fieldErrors.email.length > 0 ? html`
                <div id="forgot-email-error" role="alert" aria-live="polite">
                  ${this.fieldErrors.email.map(error => html`
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