import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';
import { scrollLock } from '../../utils/scroll-lock';

@customElement('ui-modal')
export class Modal extends BaseComponent {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = '';

  @property({ type: Boolean })
  closeOnOverlayClick = true;

  @property({ type: Boolean })
  closeOnEscape = true;

  @state()
  private isClosing = false;

  static styles = [
    ...BaseComponent.styles,
    css`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: none;
      }

      :host([open]) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.2s ease-out;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .modal-container {
        position: relative;
        background: white;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        width: auto;
        max-width: min(420px, calc(100vw - 2rem));
        max-height: fit-content;
        overflow: visible;
        animation: slideIn 0.3s ease-out;
        z-index: 1001;
        margin: auto;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom: 1px solid var(--color-gray-100);
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-gray-800);
        margin: 0;
      }

      .close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: none;
        background: none;
        color: var(--color-gray-400);
        cursor: pointer;
        border-radius: var(--border-radius-sm);
        transition: var(--transition-normal);
      }

      .close-button:hover {
        background-color: var(--color-gray-100);
        color: var(--color-gray-600);
      }

      .close-button:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .modal-content {
        padding: 1.5rem;
        overflow: visible;
      }

      .modal-container.closing {
        animation: slideOut 0.2s ease-in;
      }

      .modal-overlay.closing {
        animation: fadeOut 0.2s ease-in;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-1rem) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes slideOut {
        from { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        to { 
          opacity: 0;
          transform: translateY(-1rem) scale(0.95);
        }
      }

      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        .modal-overlay,
        .modal-container {
          animation: none;
        }
      }

      /* Mobile responsive */
      @media (max-width: 640px) {
        .modal-container {
          width: auto;
          max-width: min(350px, calc(100vw - 2rem));
          margin: auto;
        }

        .modal-overlay {
          padding: 1rem;
        }

        .modal-header,
        .modal-content {
          padding: 1rem;
        }
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscapeKey);
    }

    // Prevent body scroll when modal is open
    if (this.open) {
      scrollLock.lock();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleEscapeKey);
    
    // Restore body scroll
    scrollLock.unlock();
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    
    if (changedProperties.has('open')) {
      if (this.open) {
        scrollLock.lock();
        // Focus trap - focus first focusable element
        this.focusFirstElement();
      } else {
        scrollLock.unlock();
      }
    }
  }

  private handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) {
      this.closeModal();
    }
  };

  private handleOverlayClick = (e: MouseEvent) => {
    if (this.closeOnOverlayClick && e.target === e.currentTarget) {
      this.closeModal();
    }
  };

  private focusFirstElement() {
    requestAnimationFrame(() => {
      const focusableElements = this.shadowRoot?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    });
  }

  openModal() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('modal-opened', {
      bubbles: true,
      composed: true
    }));
  }

  closeModal() {
    if (this.isClosing) return;
    
    this.isClosing = true;
    
    // Start closing animation
    const overlay = this.shadowRoot?.querySelector('.modal-overlay');
    const container = this.shadowRoot?.querySelector('.modal-container');
    
    overlay?.classList.add('closing');
    container?.classList.add('closing');
    
    // Wait for animation to complete
    setTimeout(() => {
      this.open = false;
      this.isClosing = false;
      overlay?.classList.remove('closing');
      container?.classList.remove('closing');
      
      this.dispatchEvent(new CustomEvent('modal-closed', {
        bubbles: true,
        composed: true
      }));
    }, 200);
  }

  render() {
    if (!this.open) {
      return html``;
    }

    return html`
      <div 
        class="modal-overlay" 
        @click="${this.handleOverlayClick}"
        role="presentation"
      >
        <div 
          class="modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          ${this.title ? html`
            <header class="modal-header">
              <h2 id="modal-title" class="modal-title">${this.title}</h2>
              <button 
                class="close-button"
                @click="${this.closeModal}"
                aria-label="Close modal"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>
          ` : ''}
          
          <div class="modal-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}