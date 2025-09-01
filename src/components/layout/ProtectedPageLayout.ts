import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { navigationStore } from '../../stores/navigation.store';
import { authStore } from '../../stores/auth.store';
import type { User } from '../../types/auth.types';

@customElement('protected-page-layout')
export class ProtectedPageLayout extends LitElement {
  @property() activeRoute = '';
  @state() private pageTitle = '';
  @state() private user: User | null = null;
  
  private unsubscribe?: () => void;
  private authUnsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to navigation store changes
    this.unsubscribe = navigationStore.subscribe((state) => {
      this.pageTitle = state.pageTitle || this.getPageTitleFromRoute(state.activeRoute);
    });
    
    // Subscribe to auth store changes
    this.authUnsubscribe = authStore.subscribe((state) => {
      this.user = state.user;
    });
    
    // Set initial values
    navigationStore.getState().setActiveRoute(this.activeRoute);
    this.user = authStore.getState().user;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up subscriptions
    this.unsubscribe?.();
    this.authUnsubscribe?.();
  }

  private getPageTitleFromRoute(route: string): string {
    const routeTitleMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/links': 'My Links',
      '/qr-codes': 'QR Codes', 
      '/analytics': 'Analytics',
      '/profile': 'Profile'
    };
    
    return routeTitleMap[route] || 'Dashboard';
  }

  private getUserInitial(): string {
    if (this.user?.name) {
      return this.user.name.charAt(0).toUpperCase();
    } else if (this.user?.username) {
      return this.user.username.charAt(0).toUpperCase();
    }
    return 'U';
  }

  private getUserDisplayName(): string {
    if (this.user?.name) {
      return this.user.name;
    } else if (this.user?.username) {
      return this.user.username;
    }
    return 'User';
  }

  static styles = css`
    :host {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .main-container {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
    }

    .top-navbar {
      background-color: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      padding: var(--space-md) var(--space-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .main-content {
      flex: 1;
      padding: var(--space-xl);
      overflow-y: auto;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      font-weight: var(--font-weight-semibold);
    }

    .user-name {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    @media (max-width: 768px) {
      .main-container {
        margin-left: 250px;
      }
      
      .main-content {
        padding: var(--space-md);
      }
    }

    @media (max-width: 480px) {
      .main-container {
        margin-left: 0;
      }
    }
  `;

  render() {
    return html`
      <!-- Sidebar -->
      <app-sidebar 
        activeRoute=${this.activeRoute}
        @navigate=${this.handleNavigate}
        @logout=${this.handleLogout}>
      </app-sidebar>

      <!-- Main Container -->
      <div class="main-container">
        <!-- Top Navigation -->
        <div class="top-navbar">
          <h1 class="page-title">${this.pageTitle}</h1>
          <div class="user-actions">
            <div class="user-info">
              <div class="user-avatar">${this.getUserInitial()}</div>
              <span class="user-name">${this.getUserDisplayName()}</span>
            </div>
          </div>
        </div>

        <!-- Main Content Slot -->
        <div class="main-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private handleNavigate(event: CustomEvent) {
    // Forward the navigate event to parent components
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: event.detail,
      bubbles: true,
      composed: true
    }));
  }

  private handleLogout() {
    // Forward the logout event to parent components
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true
    }));
  }
}