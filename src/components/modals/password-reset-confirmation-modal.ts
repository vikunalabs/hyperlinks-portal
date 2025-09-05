import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';
import { ModalScrollManager } from '@utils/scrollbar';
import { withFocusTrap } from '@utils/focus-trap';
import { ErrorHandler } from '@utils/error-handler';

// Define types locally to avoid import issues
interface ModalComponent {
  open(): void;
  close(): void;
  readonly isOpen: boolean;
  reset?(): void;
}

interface ModalState {
  isOpen: boolean;
  previousActiveElement: Element | null;
}

@customElement('password-reset-confirmation-modal')
export class PasswordResetConfirmationModal extends withFocusTrap(LitElement) implements ModalComponent {
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
      
      .success-icon {
        background: linear-gradient(135deg, #10b981, #059669);
        animation: checkmarkDraw 0.5s ease-out 0.3s both;
      }
      
      @keyframes checkmarkDraw {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
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

  @property({ type: String })
  email = '';

  @state()
  private modalState: ModalState = {
    isOpen: false,
    previousActiveElement: null
  };

  private eventCleanupFunctions: Array<() => void> = [];

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
      
      // Focus management after animation - focus on the first actionable button
      setTimeout(() => {
        this.activateFocusTrap(this.modalState.previousActiveElement || undefined);
      }, 100);
      
      this.dispatchEvent(new CustomEvent('modal-opened', {
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error, {
        component: 'PasswordResetConfirmationModal',
        method: 'open'
      });
    }
  }

  public close(): void {
    try {
      this.isModalOpen = false;
      this.modalState.isOpen = false;
      
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
        component: 'PasswordResetConfirmationModal',
        method: 'close'
      });
    }
  }

  public reset(): void {
    // No form to reset in confirmation modal
  }

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

  private handleOpenEmailApp = () => {
    // Try to open default email app
    window.location.href = 'mailto:';
  };

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
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <div class="modal-content bg-white rounded-2xl shadow-2xl" @click=${(e: Event) => e.stopPropagation()}>
          <!-- Header -->
          <div class="px-8 pt-8 pb-6 text-center">
            <div class="flex justify-end mb-4">
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
            
            <!-- Success Icon -->
            <div class="flex justify-center mb-6">
              <div class="success-icon w-16 h-16 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 id="confirmation-modal-title" class="text-2xl font-bold text-gray-900 mb-4">
              Check your email
            </h2>
            <div id="confirmation-modal-description">
              <p class="text-gray-600 mb-2">
                We've sent a password reset link to:
              </p>
              <p class="text-lg font-semibold text-gray-900 mb-4" aria-label="Email address: ${this.email}">
                ${this.email}
              </p>
              <p class="text-sm text-gray-500">
                If you don't see the email, check your spam folder or try again with a different email address.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-8 pb-8">
            <!-- Open Email App Button -->
            <button
              type="button"
              @click=${this.handleOpenEmailApp}
              class="btn-primary w-full justify-center mb-4"
              aria-describedby="email-app-description"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Open email app
            </button>

            <!-- Resend Email Button -->
            <button
              type="button"
              @click=${() => {
                this.close();
                this.dispatchEvent(new CustomEvent('resend-reset-email', {
                  bubbles: true,
                  composed: true,
                  detail: { email: this.email }
                }));
              }}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mb-4"
              aria-describedby="resend-email-description"
            >
              Didn't receive the email? Resend
            </button>

            <!-- Screen reader descriptions -->
            <div class="sr-only">
              <p id="email-app-description">
                Opens your default email application to check for the password reset email
              </p>
              <p id="resend-email-description">
                Sends another password reset email to ${this.email}
              </p>
            </div>
            
            <!-- Back to Login Link -->
            <p class="text-center text-sm text-gray-600">
              <button
                type="button"
                @click=${this.handleBackToLogin}
                class="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                aria-label="Go back to login modal"
              >
                ← Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    `;
  }
}