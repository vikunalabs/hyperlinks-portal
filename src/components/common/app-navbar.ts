import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import tailwindStyles from '../../style/main.css?inline';

export interface NavbarButton {
  label: string;
  type: 'primary' | 'secondary';
  handler: () => void;
}

@customElement('app-navbar')
export class AppNavbar extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
      }
      
      /* Ensure button styles work properly in shadow DOM */
      .btn-secondary {
        background-color: transparent;
        color: var(--color-primary, #3b82f6);
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: 2px solid var(--color-primary, #3b82f6);
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        
        &:hover {
          background-color: var(--color-primary, #3b82f6);
          color: white;
          transform: translateY(-1px);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
      
      .btn-primary {
        background-color: var(--color-primary, #3b82f6);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        
        &:hover {
          background-color: color-mix(in srgb, var(--color-primary, #3b82f6) 90%, black);
          transform: translateY(-1px);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    `
  ];

  @property({ type: Array })
  buttons: NavbarButton[] = [];

  @property({ type: Boolean })
  showBackButton = false;

  @property({ type: Function })
  onBackClick?: () => void;

  private handleBackClick = () => {
    if (this.onBackClick) {
      this.onBackClick();
    } else {
      // Default back behavior
      if (window.opener) {
        window.close();
      } else {
        window.history.back();
      }
    }
  };

  render() {
    return html`
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="container">
          <div class="flex justify-between items-center h-16">
            <!-- Logo/Title -->
            <div class="flex-shrink-0">
              <h1 class="text-xl font-semibold text-gray-900">
                Hyperlinks Management Platform
              </h1>
            </div>
            
            <!-- Right Side Content -->
            <div class="flex items-center space-x-4">
              ${this.showBackButton ? html`
                <button 
                  @click=${this.handleBackClick}
                  class="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors flex items-center"
                  aria-label="Go back"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span class="ml-2">Back</span>
                </button>
              ` : ''}
              
              <!-- Action Buttons -->
              ${this.buttons.map(button => html`
                <button 
                  class="btn-${button.type} text-sm"
                  @click=${button.handler}
                >
                  ${button.label}
                </button>
              `)}
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}