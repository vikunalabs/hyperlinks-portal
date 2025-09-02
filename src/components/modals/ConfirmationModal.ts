import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { allModalStyles } from '../../shared/styles/modal-styles';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: 'delete' | 'warning' | 'info';
}

@customElement('confirmation-modal')
export class ConfirmationModal extends LitElement {
  @property({ type: Boolean }) open = false;
  @property({ type: Object }) options: ConfirmationOptions = {
    title: 'Confirm Action',
    message: 'Are you sure you want to continue?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    icon: 'info'
  };
  @state() private isConfirming = false;
  
  private previousActiveElement: Element | null = null;
  private currentPromiseResolver: ((value: boolean) => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
    this.previousActiveElement = null;
    
    // Clean up any pending promise to prevent memory leaks
    if (this.currentPromiseResolver) {
      this.currentPromiseResolver(false);
      this.currentPromiseResolver = null;
    }
  }

  static styles = [
    ...allModalStyles,
    css`
      /* ConfirmationModal specific styles */
      .modal {
        max-width: 480px; /* Medium-small modal size */
      }

      .modal-header {
        text-align: center;
      }

      .modal-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto var(--space-lg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-icon svg {
        width: 32px;
        height: 32px;
      }

      .modal-icon.danger {
        background-color: var(--color-danger-light);
        color: var(--color-danger);
      }

      .modal-icon.warning {
        background-color: var(--color-warning-light);
        color: var(--color-warning);
      }

      .modal-icon.info {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
      }

      .modal-message {
        text-align: center;
        color: var(--text-secondary);
        font-size: var(--font-size-md);
        line-height: var(--line-height-relaxed);
        margin-bottom: var(--space-xl);
      }

      .modal-actions {
        display: flex;
        gap: var(--space-md);
        justify-content: center;
      }

      .btn-danger {
        background-color: var(--color-danger) !important;
        color: white !important;
        border-color: var(--color-danger) !important;
      }

      .btn-danger:hover:not(:disabled) {
        background-color: var(--color-danger-hover) !important;
        color: white !important;
        border-color: var(--color-danger-hover) !important;
        transform: translateY(-1px);
      }

      .btn-warning {
        background-color: var(--color-warning);
        color: white;
        border-color: var(--color-warning);
      }

      .btn-warning:hover:not(:disabled) {
        background-color: var(--color-warning-hover);
        color: white;
        border-color: var(--color-warning-hover);
        transform: translateY(-1px);
      }

      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: var(--space-xs);
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 480px) {
        .modal-actions {
          flex-direction: column;
        }

        .modal-actions .btn {
          width: 100%;
        }
      }
    `
  ];

  render() {
    if (!this.open) return html``;

    const { title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'info', icon = 'info' } = this.options;

    return html`
      <div 
        class="modal-backdrop open"
        @click=${this.handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
      >
        <div class="modal" @click=${this.stopPropagation}>
          <button 
            class="close-btn" 
            @click=${this.handleCancel}
            aria-label="Close confirmation modal"
            ?disabled=${this.isConfirming}
          >×</button>
          
          <div class="modal-header">
            <div class="modal-icon ${type}">
              ${this.renderIcon(icon)}
            </div>
            <h2 id="confirmation-modal-title" class="modal-title">${title}</h2>
          </div>

          <div id="confirmation-modal-message" class="modal-message">
            ${message}
          </div>

          <div class="modal-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click=${this.handleCancel}
              ?disabled=${this.isConfirming}
            >
              ${cancelText}
            </button>
            <button 
              type="button" 
              class="btn ${this.getConfirmButtonClass(type)}" 
              style="${type === 'danger' ? 'background-color: #dc2626 !important; color: white !important; border-color: #dc2626 !important;' : ''}"
              @click=${this.handleConfirm}
              @mouseenter=${type === 'danger' ? this.handleDangerHover : null}
              @mouseleave=${type === 'danger' ? this.handleDangerLeave : null}
              ?disabled=${this.isConfirming}
            >
              ${this.isConfirming ? html`<span class="spinner"></span>` : ''}
              ${this.isConfirming ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderIcon(icon: string) {
    switch (icon) {
      case 'delete':
        return html`
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
            </path>
          </svg>
        `;
      case 'warning':
        return html`
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z">
            </path>
          </svg>
        `;
      case 'info':
      default:
        return html`
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
        `;
    }
  }

  private getConfirmButtonClass(type: string): string {
    switch (type) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
      default:
        return 'btn-primary';
    }
  }

  public show(options: ConfirmationOptions): Promise<boolean> {
    this.options = { ...this.options, ...options };
    this.previousActiveElement = document.activeElement as Element;
    this.open = true;
    this.isConfirming = false;

    // Focus management for accessibility
    this.updateComplete.then(() => {
      const cancelButton = this.shadowRoot?.querySelector('.btn-secondary') as HTMLButtonElement;
      if (cancelButton) {
        cancelButton.focus();
      }
    });

    return new Promise<boolean>((resolve) => {
      // Clean up any existing resolver
      if (this.currentPromiseResolver) {
        this.currentPromiseResolver(false);
      }
      this.currentPromiseResolver = resolve;
      
      const handleResult = (event: CustomEvent) => {
        const confirmed = event.detail.confirmed;
        this.open = false;
        this.restoreFocus();
        resolve(confirmed);
        this.currentPromiseResolver = null;
        this.removeEventListener('confirmation-result', handleResult as EventListener);
      };
      
      this.addEventListener('confirmation-result', handleResult as EventListener);
    });
  }

  private async handleConfirm() {
    if (this.isConfirming) return;
    
    this.isConfirming = true;
    
    try {
      // Add a small delay to show the loading state and prevent accidental double-clicks
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.dispatchEvent(new CustomEvent('confirmation-result', { 
        detail: { confirmed: true },
        bubbles: true,
        composed: true 
      }));
    } catch (error) {
      // Fallback in case of any error
      console.error('[ConfirmationModal] Confirm error:', error);
      this.isConfirming = false;
    }
  }

  private handleCancel() {
    if (this.isConfirming) return;
    
    this.dispatchEvent(new CustomEvent('confirmation-result', { 
      detail: { confirmed: false },
      bubbles: true,
      composed: true 
    }));
  }

  private handleBackdropClick(event: Event) {
    if (event.target === event.currentTarget && !this.isConfirming) {
      this.handleCancel();
    }
  }

  private stopPropagation(event: Event) {
    event.stopPropagation();
  }

  private restoreFocus() {
    if (this.previousActiveElement) {
      try {
        if ('focus' in this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
          (this.previousActiveElement as HTMLElement).focus();
        }
      } catch (error) {
        console.debug('Focus restoration failed:', error);
      }
    }
    this.previousActiveElement = null;
  }

  private handleDangerHover = (event: Event) => {
    const button = event.target as HTMLButtonElement;
    if (button && !this.isConfirming) {
      button.style.backgroundColor = '#b91c1c !important';
      button.style.color = 'white !important';
      button.style.borderColor = '#b91c1c !important';
    }
  };

  private handleDangerLeave = (event: Event) => {
    const button = event.target as HTMLButtonElement;
    if (button && !this.isConfirming) {
      button.style.backgroundColor = '#dc2626 !important';
      button.style.color = 'white !important';
      button.style.borderColor = '#dc2626 !important';
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.open || this.isConfirming) return;
    
    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleCancel();
    }
    
    // Handle Enter key to confirm
    if (event.key === 'Enter') {
      const activeElement = this.shadowRoot?.activeElement;
      // Only auto-confirm if focus is on the confirm button
      if (activeElement?.classList.contains('btn-primary') || 
          activeElement?.classList.contains('btn-danger') ||
          activeElement?.classList.contains('btn-warning')) {
        event.preventDefault();
        this.handleConfirm();
      }
    }
  };
}