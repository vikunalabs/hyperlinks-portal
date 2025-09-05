import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';

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

  @state()
  private mobileMenuOpen = false;

  private toggleMobileMenu = () => {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  };

  private closeMobileMenu = () => {
    this.mobileMenuOpen = false;
  };

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

  private handleClickOutside = (e: Event) => {
    if (this.mobileMenuOpen && !this.contains(e.target as Node)) {
      this.closeMobileMenu();
    }
  };

  private handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  render() {
    return html`
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="container">
          <div class="flex justify-between items-center h-16">
            <!-- Logo/Title -->
            <div class="flex-shrink-0 min-w-0">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                <span class="hidden sm:inline">Hyperlinks Management Platform</span>
                <span class="sm:hidden">Hyperlinks</span>
              </h1>
            </div>
            
            <!-- Desktop Right Side Content -->
            <div class="hidden md:flex items-center space-x-4">
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
              
              <!-- Desktop Action Buttons -->
              ${this.buttons.map(button => html`
                <button 
                  class="btn-${button.type} text-sm"
                  @click=${button.handler}
                >
                  ${button.label}
                </button>
              `)}
            </div>
            
            <!-- Mobile Menu Button -->
            <button
              @click=${this.toggleMobileMenu}
              class="mobile-nav-trigger"
              aria-label="Toggle mobile menu"
              aria-expanded=${this.mobileMenuOpen ? 'true' : 'false'}
              aria-controls="mobile-menu"
            >
              ${this.mobileMenuOpen ? html`
                <!-- Close icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ` : html`
                <!-- Hamburger icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              `}
            </button>
          </div>
        </div>
        
        <!-- Mobile Menu -->
        <div 
          id="mobile-menu"
          class="mobile-nav-menu ${this.mobileMenuOpen ? 'open' : ''}"
          role="menu"
          aria-labelledby="mobile-menu-button"
        >
          <div class="px-4 py-3 space-y-3">
            ${this.showBackButton ? html`
              <button 
                @click=${() => {
                  this.handleBackClick();
                  this.closeMobileMenu();
                }}
                class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                role="menuitem"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ` : ''}
            
            <!-- Mobile Action Buttons -->
            ${this.buttons.map(button => html`
              <button 
                class="w-full btn-${button.type} justify-center mb-2"
                @click=${() => {
                  button.handler();
                  this.closeMobileMenu();
                }}
                role="menuitem"
              >
                ${button.label}
              </button>
            `)}
          </div>
        </div>
      </nav>
    `;
  }
}