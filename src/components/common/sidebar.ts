import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  handler?: () => void;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
  expanded?: boolean;
}

export interface UserProfile {
  name: string;
  initials: string;
  plan: string;
}

@customElement('app-sidebar')
export class Sidebar extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
      }

      .submenu {
        transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
        overflow: hidden;
        max-height: 0;
        opacity: 0;
      }

      .submenu.open {
        max-height: 300px;
        opacity: 1;
        transition: max-height 0.3s ease-in, opacity 0.3s ease-in;
      }

      .rotate-90 {
        transform: rotate(90deg);
      }

      @media (max-width: 768px) {
        .mobile-nav-trigger {
          display: flex !important;
        }

        .sidebar {
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          position: fixed;
          z-index: 50;
          height: 100vh;
          overflow-y: auto;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 40;
        }

        .overlay.open {
          display: block;
        }
      }

      .touch-target {
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
      }

      .touch-target:hover {
        background-color: rgba(0, 0, 0, 0.05);
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

      .logout-btn:hover {
        color: white !important;
        background-color: var(--color-error) !important;
        border-color: var(--color-error) !important;
      }
    `
  ];

  @property({ type: String })
  activePage = 'dashboard';

  @property({ type: String })
  brandName = 'ZLinkly';

  @property({ type: String }) 
  brandTagline = 'Premium URL Management';

  @property({ type: Object })
  userProfile: UserProfile = {
    name: 'John Doe',
    initials: 'JD',
    plan: 'Pro'
  };

  @property({ type: Array })
  mainNavItems: MenuItem[] = [];

  @property({ type: Array })
  menuSections: MenuSection[] = [];

  @state()
  private isMobileSidebarOpen = false;

  @state()
  private expandedSections = new Set<string>();


  private iconMap: { [key: string]: any } = {
    'fas fa-home': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>`,
    'fas fa-link': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>`,
    'fas fa-chart-bar': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>`,
    'fas fa-bars': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>`,
    'fas fa-chevron-down': html`<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`,
    'fas fa-sign-out-alt': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>`,
    'fas fa-file-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path></svg>`,
    'fas fa-user': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>`,
    'fas fa-credit-card': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 5H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path></svg>`,
    'fas fa-star': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`,
    'fas fa-question-circle': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`,
    // Menu item icons
    'fas fa-qrcode': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM9 4a1 1 0 000 2v5a1 1 0 001 1h5a1 1 0 100-2h-5V6a1 1 0 00-1-2zM9 13a1 1 0 100 2h2a1 1 0 100-2H9zM16 13a1 1 0 100 2h1a1 1 0 100-2h-1zM16 16a1 1 0 100 2h1a1 1 0 100-2h-1zM13 13a1 1 0 100 2h1a1 1 0 100-2h-1z" clip-rule="evenodd"/></svg>`,
    'fas fa-barcode': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a2 2 0 012-2h2a1 1 0 000 2H4v2a1 1 0 01-2 0V4zM2 12a1 1 0 012 0v2h2a1 1 0 100 2H4a2 2 0 01-2-2v-2zM18 4a2 2 0 00-2-2h-2a1 1 0 100 2h2v2a1 1 0 102 0V4zM18 12a1 1 0 00-2 0v2h-2a1 1 0 100 2h2a2 2 0 002-2v-2zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/></svg>`,
    'fas fa-pencil-alt': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>`,
    'fas fa-font': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v1.5a.5.5 0 01-1 0V6H8.5v6.5H10a.5.5 0 010 1H6a.5.5 0 010-1h1.5V6H7v.5a.5.5 0 01-1 0V5z" clip-rule="evenodd"/></svg>`,
    'fas fa-user-circle': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>`,
    'fas fa-users': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>`,
    'fas fa-shield-alt': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
    'fas fa-crown': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-.584 1.813L10 9.869l5.584-4.056A1 1 0 0015 4a1 1 0 00-1 1v1l-3 3v6a1 1 0 01-2 0V9L6 6V5a1 1 0 00-1-1z"/></svg>`,
    'fas fa-money-bill-wave': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>`,
    'fas fa-file-invoice-dollar': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>`,
    'fas fa-receipt': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.898-.512L12.72 12.8 9.5 10.866a1 1 0 010-1.732L12.72 7.2l1.651-6.256A1 1 0 0112 2z" clip-rule="evenodd"/></svg>`,
    'fas fa-bullhorn': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v.114H4a1 1 0 00-1 1v4a1 1 0 001 1h2v.114a1 1 0 00.804.98l10 2A1 1 0 0018 13V3zM8 12V7.25a.25.25 0 01.2-.245l8-1.6a.25.25 0 01.3.245v7.9a.25.25 0 01-.3.245l-8-1.6a.25.25 0 01-.2-.245z" clip-rule="evenodd"/></svg>`,
    'fas fa-map-marker-alt': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>`,
    'fas fa-clock': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`,
    'fas fa-life-ring': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
    'fas fa-book': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>`,
    'fas fa-comments': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>`
  };

  private toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  private toggleSection(sectionId: string) {
    if (this.expandedSections.has(sectionId)) {
      // If clicking on an already expanded section, collapse it
      this.expandedSections.delete(sectionId);
    } else {
      // Close all other sections and open the clicked one (accordion behavior)
      this.expandedSections.clear();
      this.expandedSections.add(sectionId);
    }
    this.requestUpdate();
  }

  private handleLogout() {
    // Dispatch logout event
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true
    }));
  }

  private renderIcon(iconClass: string) {
    return this.iconMap[iconClass] || html`<div class="w-5 h-5 bg-gray-300 rounded"></div>`;
  }

  private renderMobileButton() {
    return html`
      <button 
        class="mobile-nav-trigger md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-lg p-2 touch-target"
        style="display: none;"
        @click=${this.toggleMobileSidebar}
      >
        ${this.renderIcon('fas fa-bars')}
      </button>
    `;
  }

  private renderOverlay() {
    return html`
      <div 
        class="overlay ${this.isMobileSidebarOpen ? 'open' : ''}"
        @click=${this.toggleMobileSidebar}
      ></div>
    `;
  }

  render() {
    return html`
      ${this.renderMobileButton()}
      ${this.renderOverlay()}
      
      <aside class="sidebar ${this.isMobileSidebarOpen ? 'open' : ''} w-64 bg-white shadow-md flex flex-col h-screen">
        <!-- Header -->
        <div class="px-6 py-4 md:py-6 border-b text-center" style="border-color: var(--color-border); height: auto; min-height: 105px; display: flex; flex-direction: column; justify-content: center;">
          <h1 class="text-xl md:text-2xl font-bold flex items-center justify-center" style="color: var(--color-primary);">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
            </svg>
            ${this.brandName}
          </h1>
          <p class="text-xs mt-1" style="color: var(--color-secondary);">${this.brandTagline}</p>
        </div>

        <div class="flex-1 overflow-y-auto pt-4 pb-4 border-r" style="border-color: var(--color-border);">
          <!-- Main Navigation -->
          <div class="mb-4">
            ${this.mainNavItems.map(item => html`
              <div class="flex items-center px-6 py-3 cursor-pointer ${item.active ? '' : 'hover:bg-gray-50'}" 
                   style="${item.active ? 'color: var(--color-primary); background-color: color-mix(in srgb, var(--color-primary) 10%, white); border-left: 4px solid var(--color-primary);' : 'color: var(--color-secondary);'}"
                   @click=${() => item.handler?.()}>
                ${this.renderIcon(item.icon)}
                <span class="ml-3">${item.label}</span>
              </div>
            `)}
          </div>

          <!-- Collapsible Sections -->
          ${this.menuSections.map(section => {
            const isExpanded = this.expandedSections.has(section.id);
            return html`
              <div class="sidebar-section mb-4">
                <div 
                  class="sidebar-header flex items-center justify-between px-6 py-3 hover:bg-gray-50 cursor-pointer" 
                  style="color: var(--color-secondary);"
                  @click=${() => this.toggleSection(section.id)}
                >
                  <div class="flex items-center">
                    ${this.renderIcon(section.icon)}
                    <span class="ml-3">${section.label}</span>
                  </div>
                  <div class="transition-transform ${isExpanded ? 'rotate-90' : ''}">
                    ${this.renderIcon('fas fa-chevron-down')}
                  </div>
                </div>
                <div class="submenu ${isExpanded ? 'open' : ''}">
                  ${section.items.map(item => html`
                    <div class="flex items-center px-6 py-3 hover:bg-gray-50 pl-12 cursor-pointer" 
                         style="color: var(--color-secondary);"
                         @click=${() => item.handler?.()}>
                      ${this.renderIcon(item.icon)}
                      <span class="ml-3">${item.label}</span>
                    </div>
                  `)}
                </div>
              </div>
            `;
          })}
        </div>

        <!-- Bottom Section: Logout & User Profile - Sticky to bottom -->
        <div class="mt-auto border-r" style="border-color: var(--color-border);">
          <!-- Logout Button - Above user info as per design -->
          <div class="p-4" style="border-top: 1px solid var(--color-border);">
            <button 
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 group border logout-btn"
              style="color: var(--color-error); border-color: var(--color-error);"
              @click=${this.handleLogout}
            >
              ${this.renderIcon('fas fa-sign-out-alt')}
              <span class="text-sm font-medium">Logout</span>
            </button>
          </div>

          <!-- User Profile -->
          <div class="py-6 px-4 md:px-6" style="border-top: 1px solid var(--color-border);">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style="background-color: var(--color-primary);">
                ${this.userProfile.initials}
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium" style="color: var(--color-text);">${this.userProfile.name}</p>
                <p class="text-xs" style="color: var(--color-secondary);">${this.userProfile.plan} Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    `;
  }
}