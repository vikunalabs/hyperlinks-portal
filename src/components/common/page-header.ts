import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';

export interface ActionButton {
  id: string;
  label: string;
  icon: string;
  handler: () => void;
  primary?: boolean;
}

export interface UserProfile {
  name: string;
  initials: string;
  plan: string;
}

@customElement('page-header')
export class PageHeader extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
      }

      .user-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10;
        min-width: 200px;
        margin-top: 0.5rem;
      }

      .user-menu.open {
        display: block;
      }

      .user-menu-item {
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .user-menu-item:hover {
        background-color: #f3f4f6;
      }

      .btn-primary {
        background-color: var(--color-primary);
        color: white;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-primary:hover {
        background-color: color-mix(in srgb, var(--color-primary) 90%, black);
        transform: translateY(-1px);
      }

      .input-base {
        width: 100%;
        padding: 0.5rem 1rem;
        padding-left: 2.5rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        font-size: 0.875rem;
        color: var(--color-text);
        background-color: white;
        transition: all 0.2s;
      }

      .input-base:focus {
        outline: none;
        ring: 2px;
        ring-color: var(--color-primary);
        border-color: transparent;
      }

      @media (max-width: 640px) {
        .heading-mobile {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
      }

      @media (max-width: 480px) {
        .heading-mobile {
          font-size: 1.125rem;
          line-height: 1.625rem;
        }
      }

      /* Ensure consistent header height across all breakpoints */
      header {
        height: 105px !important;
        min-height: 105px !important;
        max-height: 105px !important;
      }

      /* Hide action buttons at 1200px and below */
      @media (max-width: 1200px) {
        .action-button {
          display: none !important;
        }
      }
    `
  ];

  @property({ type: String })
  pageTitle = 'Page Title';

  @property({ type: String })
  pageDescription = '';

  @property({ type: Boolean })
  showSearch = true;

  @property({ type: String })
  searchPlaceholder = 'Search...';

  @property({ type: Array })
  actionButtons: ActionButton[] = [];

  @property({ type: Boolean })
  showUserMenu = true;

  @property({ type: Object })
  userProfile: UserProfile = {
    name: 'John Doe',
    initials: 'JD',
    plan: 'Pro'
  };

  @state()
  private isUserMenuOpen = false;

  @state()
  private searchValue = '';

  private iconMap: { [key: string]: any } = {
    'fas fa-plus': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>`,
    'fas fa-search': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>`,
    'fas fa-chevron-down': html`<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`,
    'fas fa-user': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>`,
    'fas fa-sign-out-alt': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>`,
    'fas fa-upload': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`
  };

  private toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  private handleLogout() {
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true
    }));
  }

  private handleSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchValue = input.value;
    this.dispatchEvent(new CustomEvent('search', {
      detail: { query: this.searchValue },
      bubbles: true,
      composed: true
    }));
  }

  private renderIcon(iconClass: string) {
    return this.iconMap[iconClass] || html`<div class="w-4 h-4 bg-gray-300 rounded"></div>`;
  }

  private renderActionButtons() {
    return this.actionButtons.map(button => html`
      <button
        class="${button.primary ? 'btn-primary' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} action-button px-3 py-2 xl:px-4 xl:py-2 rounded-lg items-center mr-2 xl:mr-4 transition-all duration-200 hidden xl:flex"
        @click=${() => button.handler()}
      >
        ${this.renderIcon(button.icon)}
        <span class="ml-1 xl:ml-2">${button.label}</span>
      </button>
    `);
  }

  render() {
    return html`
      <header class="flex justify-between items-center p-4 md:p-6 bg-white" style="border-bottom: 1px solid var(--color-border); margin: 0; flex-shrink: 0; min-height: 105px;">
        <!-- Left: Page Title & Description -->
        <div>
          <h2 class="text-xl md:text-2xl font-bold heading-mobile" style="color: var(--color-text);">
            ${this.pageTitle}
          </h2>
          ${this.pageDescription ? html`
            <p class="text-xs md:text-sm mt-1" style="color: var(--color-secondary);">
              ${this.pageDescription}
            </p>
          ` : ''}
        </div>

        <!-- Right: Search, Actions, User Menu -->
        <div class="flex items-center">
          <!-- Search Input -->
          ${this.showSearch ? html`
            <div class="relative mr-2 lg:mr-4 hidden lg:block">
              <input 
                type="text" 
                placeholder="${this.searchPlaceholder}"
                class="input-base"
                @input=${this.handleSearch}
                .value=${this.searchValue}
              >
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2" style="color: var(--color-secondary);">
                ${this.renderIcon('fas fa-search')}
              </div>
            </div>
          ` : ''}

          <!-- Action Buttons -->
          ${this.renderActionButtons()}

          <!-- User Menu -->
          ${this.showUserMenu ? html`
            <div class="relative">
              <button 
                class="flex items-center cursor-pointer"
                @click=${this.toggleUserMenu}
              >
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mr-2" style="background-color: var(--color-primary);">
                  ${this.userProfile.initials}
                </div>
                <span class="hidden md:inline text-sm font-medium" style="color: var(--color-text);">
                  ${this.userProfile.name}
                </span>
                <div class="ml-1" style="color: var(--color-secondary);">
                  ${this.renderIcon('fas fa-chevron-down')}
                </div>
              </button>
              
              <div class="user-menu ${this.isUserMenuOpen ? 'open' : ''}">
                <div class="user-menu-item" style="color: var(--color-text);">
                  ${this.renderIcon('fas fa-user')}
                  <span>Profile</span>
                </div>
                <div 
                  class="user-menu-item" 
                  style="border-top: 1px solid var(--color-border); color: var(--color-error);"
                  @click=${this.handleLogout}
                >
                  ${this.renderIcon('fas fa-sign-out-alt')}
                  <span>Logout</span>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </header>
    `;
  }
}