import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';
import '@components/common/sidebar';
import '@components/common/page-header';
import type { MenuItem, MenuSection, UserProfile } from '@components/common/sidebar';
import type { ActionButton } from '@components/common/page-header';

@customElement('protected-layout')
export class ProtectedLayout extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }
      
      .main-content {
        flex: 1;
        height: 100vh;
        overflow: hidden;
      }
    `
  ];

  @property({ type: String })
  activePage: string = 'dashboard';

  @property({ type: String })
  brandName: string = 'ZLinkly';

  @property({ type: String })
  brandTagline: string = '';

  @property({ type: String })
  pageTitle: string = 'Page Title';

  @property({ type: String })
  pageDescription: string = '';

  @property({ type: Boolean })
  showSearch: boolean = true;

  @property({ type: String })
  searchPlaceholder: string = 'Search...';

  @property({ type: Array })
  actionButtons: ActionButton[] = [];

  @property({ type: Boolean })
  showUserMenu: boolean = true;

  @state()
  private userProfile: UserProfile = {
    name: 'John Doe',
    initials: 'JD',
    plan: 'Pro'
  };

  private getMainNavItems(): MenuItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'fas fa-home',
        active: this.activePage === 'dashboard',
        handler: () => { window.location.href = '/dashboard'; }
      },
      {
        id: 'urls',
        label: 'My URLs',
        icon: 'fas fa-link',
        active: this.activePage === 'links',
        handler: () => { window.location.href = '/links'; }
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: 'fas fa-chart-bar',
        active: this.activePage === 'analytics',
        handler: () => console.log('Analytics clicked')
      }
    ];
  }

  private getMenuSections(): MenuSection[] {
    return [
      {
        id: 'content',
        label: 'Content',
        icon: 'fas fa-file-alt',
        items: [
          { id: 'qr-codes', label: 'QR Codes', icon: 'fas fa-qrcode', handler: () => console.log('QR Codes clicked') },
          { id: 'barcodes', label: 'Barcodes', icon: 'fas fa-barcode', handler: () => console.log('Barcodes clicked') },
          { id: 'landing-pages', label: 'Landing Pages', icon: 'fas fa-file-alt', handler: () => console.log('Landing Pages clicked') },
          { id: 'bio-profiles', label: 'Bio Profiles', icon: 'fas fa-pencil-alt', handler: () => console.log('Bio Profiles clicked') },
          { id: 'custom-domains', label: 'Custom Domains', icon: 'fas fa-font', handler: () => console.log('Custom Domains clicked') }
        ]
      },
      {
        id: 'account',
        label: 'Account',
        icon: 'fas fa-user',
        items: [
          { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle', handler: () => console.log('Profile clicked') },
          { id: 'team', label: 'Team Management', icon: 'fas fa-users', handler: () => console.log('Team Management clicked') },
          { id: 'security', label: 'Security', icon: 'fas fa-shield-alt', handler: () => console.log('Security clicked') }
        ]
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'fas fa-credit-card',
        items: [
          { id: 'subscription', label: 'Subscription', icon: 'fas fa-crown', handler: () => console.log('Subscription clicked') },
          { id: 'payments', label: 'Payments', icon: 'fas fa-money-bill-wave', handler: () => console.log('Payments clicked') },
          { id: 'invoices', label: 'Invoices', icon: 'fas fa-file-invoice-dollar', handler: () => console.log('Invoices clicked') },
          { id: 'billing-history', label: 'Billing History', icon: 'fas fa-receipt', handler: () => console.log('Billing History clicked') }
        ]
      },
      {
        id: 'features',
        label: 'Features',
        icon: 'fas fa-star',
        items: [
          { id: 'campaigns', label: 'Campaigns', icon: 'fas fa-bullhorn', handler: () => console.log('Campaigns clicked') },
          { id: 'geolocation', label: 'Geolocation', icon: 'fas fa-map-marker-alt', handler: () => console.log('Geolocation clicked') },
          { id: 'scheduling', label: 'Scheduling', icon: 'fas fa-clock', handler: () => console.log('Scheduling clicked') }
        ]
      },
      {
        id: 'support',
        label: 'Support',
        icon: 'fas fa-question-circle',
        items: [
          { id: 'help-center', label: 'Help Center', icon: 'fas fa-life-ring', handler: () => console.log('Help Center clicked') },
          { id: 'documentation', label: 'Documentation', icon: 'fas fa-book', handler: () => console.log('Documentation clicked') },
          { id: 'feedback', label: 'Feedback', icon: 'fas fa-comments', handler: () => console.log('Feedback clicked') }
        ]
      }
    ];
  }

  private handleSearch(e: CustomEvent) {
    // Dispatch search event to parent or handle search logic
    this.dispatchEvent(new CustomEvent('search', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  private handleLogout() {
    // Handle logout logic
    console.log('Logout clicked from page header');
    // You can add your logout logic here
  }

  render() {
    return html`
      <div class="flex min-h-screen">
        <!-- Sidebar -->
        <app-sidebar 
          .mainNavItems=${this.getMainNavItems()}
          .menuSections=${this.getMenuSections()}
          .userProfile=${this.userProfile}
          .brandName=${this.brandName}
          .brandTagline=${this.brandTagline}
        ></app-sidebar>

        <!-- Main Content Area -->
        <div class="main-content flex flex-col" style="background-color: var(--color-bg);">
          <!-- Page Header -->
          <page-header
            .pageTitle=${this.pageTitle}
            .pageDescription=${this.pageDescription}
            .showSearch=${this.showSearch}
            .searchPlaceholder=${this.searchPlaceholder}
            .actionButtons=${this.actionButtons}
            .showUserMenu=${this.showUserMenu}
            .userProfile=${this.userProfile}
            @search=${this.handleSearch}
            @logout=${this.handleLogout}
          ></page-header>
          
          <!-- Page Content -->
          <div class="flex-1 overflow-y-auto">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}