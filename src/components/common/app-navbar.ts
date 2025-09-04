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