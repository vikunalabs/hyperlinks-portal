import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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

@customElement('collapsible-sidebar')
export class CollapsibleSidebar extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
        height: 100vh;
        width: 256px;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        min-height: 100vh;
      }
      
      aside {
        height: 100vh;
        min-height: 100vh;
      }
      
      .submenu {
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .submenu.expanded {
        max-height: 500px;
      }
      
      .submenu.collapsed {
        max-height: 0;
      }
      
      .chevron {
        transition: transform 0.3s ease;
      }
      
      .chevron.rotated {
        transform: rotate(90deg);
      }
      
      .nav-item {
        transition: all 0.2s ease-in-out;
        cursor: pointer;
      }

      .logout-btn {
        color: var(--color-text);
        border-color: var(--color-error);
        border-width: 1px;
        border-style: solid;
        opacity: 0.7;
      }

      .logout-btn:hover {
        background-color: var(--color-error);
        border-color: var(--color-error);
        color: white;
        opacity: 1;
      }
      
      .nav-item:hover {
        background-color: rgba(249, 250, 251, 1);
      }
      
      .nav-item.active {
        background-color: rgba(239, 246, 255, 1);
        border-right: 3px solid #3b82f6;
        color: #3b82f6;
      }
    `
  ];

  @property({ type: Array })
  mainNavItems: MenuItem[] = [];

  @property({ type: Array })
  menuSections: MenuSection[] = [];

  @property({ type: Object })
  userProfile: UserProfile = { name: 'User', initials: 'U', plan: 'Free' };

  @property({ type: String })
  brandName: string = 'ShortlyPro';

  @property({ type: String })
  brandTagline: string = 'Premium URL Management';

  @state()
  private expandedSections = new Set<string>();

  connectedCallback() {
    super.connectedCallback();
    // Auto-expand first section
    if (this.menuSections.length > 0) {
      this.expandedSections.add(this.menuSections[0].id);
    }
  }

  private toggleSection(sectionId: string) {
    const newExpanded = new Set(this.expandedSections);
    
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      // Close all other sections (accordion behavior)
      newExpanded.clear();
      newExpanded.add(sectionId);
    }
    
    this.expandedSections = newExpanded;
    this.requestUpdate();
  }

  private handleMainNavClick(item: MenuItem) {
    if (item.handler) {
      item.handler();
    }
    
    // Update active states
    this.mainNavItems = this.mainNavItems.map(navItem => ({
      ...navItem,
      active: navItem.id === item.id
    }));
  }

  private handleSubMenuClick(item: MenuItem) {
    if (item.handler) {
      item.handler();
    }
    
    // Update active states in all sections
    this.menuSections = this.menuSections.map(section => ({
      ...section,
      items: section.items.map(subItem => ({
        ...subItem,
        active: subItem.id === item.id
      }))
    }));
    
    // Deactivate main nav items
    this.mainNavItems = this.mainNavItems.map(navItem => ({
      ...navItem,
      active: false
    }));
  }

  private handleSettingsClick() {
    console.log('Settings clicked');
  }

  private handleLogoutClick() {
    console.log('Logout clicked');
    // Here you would typically call your auth service logout
    // For now, just redirect to home page
    window.location.href = '/';
  }

  private getSvgIcon(iconName: string) {
    const icons: Record<string, any> = {
      'fas fa-home': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>`,
      'fas fa-link': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>`,
      'fas fa-chart-bar': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>`,
      'fas fa-file-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>`,
      'fas fa-qrcode': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clip-rule="evenodd"/><path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 12a1 1 0 100-2h-3a1 1 0 100 2h3zM12 15a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM16 16a1 1 0 100-2h-2a1 1 0 100 2h2z"/></svg>`,
      'fas fa-barcode': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>`,
      'fas fa-pencil-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>`,
      'fas fa-font': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h1a1 1 0 110 2H9v1h1a1 1 0 110 2H9v1a1 1 0 01-2 0v-1H6a1 1 0 110-2h1V9H6a1 1 0 01-1-1zm5-1a1 1 0 000 2h1a1 1 0 100-2h-1z" clip-rule="evenodd"/></svg>`,
      'fas fa-user': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>`,
      'fas fa-user-circle': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>`,
      'fas fa-users': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>`,
      'fas fa-shield-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
      'fas fa-credit-card': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 5H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H8z" clip-rule="evenodd"/></svg>`,
      'fas fa-crown': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 000 2h1.5L4 7.5 2.5 4H4a1 1 0 000-2H2a1 1 0 00-.894 1.447L2.618 6.22l1.706 5.117A3 3 0 007.236 13h5.528a3 3 0 002.912-2.663L17.382 6.22l1.512-2.773A1 1 0 0018 2h-2a1 1 0 000 2h1.5L16 7.5 13.5 4H15a1 1 0 000-2h-2a1 1 0 00-.894.553L10 6.5 7.894 2.553A1 1 0 007 2H5z" clip-rule="evenodd"/></svg>`,
      'fas fa-money-bill-wave': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>`,
      'fas fa-file-invoice-dollar': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd"/></svg>`,
      'fas fa-receipt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.967 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2 11.033 2.744A1 1 0 0112 2z" clip-rule="evenodd"/></svg>`,
      'fas fa-star': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`,
      'fas fa-bullhorn': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.894A1 1 0 0018 16V3z" clip-rule="evenodd"/></svg>`,
      'fas fa-map-marker-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>`,
      'fas fa-clock': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`,
      'fas fa-question-circle': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
      'fas fa-life-ring': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0zm-7-3a1 1 0 00-2 0v6a1 1 0 102 0V7z" clip-rule="evenodd"/></svg>`,
      'fas fa-book': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>`,
      'fas fa-comments': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/></svg>`,
      'fas fa-cog': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>`,
      'fas fa-chevron-down': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`,
      'fas fa-sign-out-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>`
    };
    return icons[iconName] || html`<div class="w-5 h-5"></div>`;
  }

  render() {
    return html`
      <aside class="w-64 bg-white shadow-md flex flex-col h-full">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <h1 class="text-2xl font-bold flex items-center" style="color: var(--color-primary);">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
            </svg>
            ${this.brandName}
          </h1>
          <p class="text-xs text-gray-500 mt-1">${this.brandTagline}</p>
        </div>
        
        <!-- Main Navigation -->
        <div class="flex-1 overflow-y-auto pt-4">
          <div class="mb-4">
            ${this.mainNavItems.map(item => {
              const itemClasses = {
                'nav-item': true,
                'flex items-center px-6 py-3': true,
                'active': item.active || false,
                'text-gray-600': !item.active,
                'font-medium': true
              };

              const itemStyles = item.active ? 
                `color: var(--color-primary); background-color: rgba(59, 130, 246, 0.1); border-right: 3px solid var(--color-primary);` : 
                '';

              return html`
                <div 
                  class="${classMap(itemClasses)}"
                  style="${itemStyles}"
                  @click=${() => this.handleMainNavClick(item)}
                >
                  <span class="mr-3">${this.getSvgIcon(item.icon)}</span>
                  ${item.label}
                </div>
              `;
            })}
          </div>

          <!-- Collapsible Sections -->
          ${this.menuSections.map(section => {
            const isExpanded = this.expandedSections.has(section.id);
            const chevronClasses = {
              'transition-transform chevron': true,
              'rotated': isExpanded
            };
            const submenuClasses = {
              'submenu': true,
              'expanded': isExpanded,
              'collapsed': !isExpanded
            };

            return html`
              <div class="sidebar-section mb-4">
                <div 
                  class="sidebar-header flex items-center justify-between px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer"
                  @click=${() => this.toggleSection(section.id)}
                >
                  <div class="flex items-center">
                    <span class="mr-3">${this.getSvgIcon(section.icon)}</span>
                    <span>${section.label}</span>
                  </div>
                  <span class="${classMap(chevronClasses)}">${this.getSvgIcon('fas fa-chevron-down')}</span>
                </div>
                <div class="${classMap(submenuClasses)}">
                  ${section.items.map(item => {
                    const subItemClasses = {
                      'flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 pl-12': true,
                      'nav-item': true,
                      'active': item.active || false
                    };

                    const subItemStyles = item.active ? 
                      `color: var(--color-primary); background-color: rgba(59, 130, 246, 0.1);` : 
                      '';

                    return html`
                      <div 
                        class="${classMap(subItemClasses)}"
                        style="${subItemStyles}"
                        @click=${() => this.handleSubMenuClick(item)}
                      >
                        <span class="mr-3">${this.getSvgIcon(item.icon)}</span>
                        ${item.label}
                      </div>
                    `;
                  })}
                </div>
              </div>
            `;
          })}
        </div>

        <!-- User Profile -->
        <div class="p-4 border-t border-gray-100">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style="background-color: var(--color-primary);">
              ${this.userProfile.initials}
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium">${this.userProfile.name}</p>
              <p class="text-xs text-gray-500">${this.userProfile.plan} Plan</p>
            </div>
            <div class="flex items-center space-x-2">
              <button class="logout-btn group flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border"
                     @click=${this.handleLogoutClick}
                      title="Logout"
                    >
                      ${this.getSvgIcon('fas fa-sign-out-alt')}
                      <span>Logout</span>
                   </button>

            </div>
          </div>
        </div>
      </aside>
    `;
  }
}