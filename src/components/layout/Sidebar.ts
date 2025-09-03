import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { navigationStore } from '../../stores/navigation.store';
import { authStore } from '../../stores/auth.store';
import type { User } from '../../types/auth.types';

@customElement('app-sidebar')
export class Sidebar extends LitElement {
  @property() activeRoute = '';
  @state() private isSettingsOpen = false;
  @state() private user: User | null = null;
  @state() private isProfileDropdownOpen = false;
  
  private unsubscribe?: () => void;
  private authUnsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to navigation store changes
    this.unsubscribe = navigationStore.subscribe((state) => {
      this.isSettingsOpen = state.isSettingsOpen;
    });
    
    // Subscribe to auth store changes
    this.authUnsubscribe = authStore.subscribe((state) => {
      this.user = state.user;
    });
    
    // Set initial user value
    this.user = authStore.getState().user;
    
    // Handle clicks outside to close profile dropdown
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up subscriptions
    this.unsubscribe?.();
    this.authUnsubscribe?.();
    
    // Clean up click listener
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  static styles = css`
    :host {
      display: block;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 280px;
      height: 100vh;
      background-color: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      z-index: 1000;
    }

    .sidebar-header {
      padding: var(--space-xl);
      border-bottom: 1px solid var(--border-color);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg) 0;
      margin-bottom: var(--space-lg);
      border-bottom: 1px solid var(--border-color-light);
      position: relative;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-xs) 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .profile-dropdown-trigger {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-dropdown-trigger:hover {
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .profile-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all var(--transition-base);
    }

    .profile-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .profile-dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md);
      color: var(--text-secondary);
      text-decoration: none;
      cursor: pointer;
      transition: all var(--transition-base);
      font-size: var(--font-size-sm);
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .profile-dropdown-item:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    .profile-dropdown-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background-color: var(--color-primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
    }

    .logo-text {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-md) 0;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: var(--space-lg);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-xl);
      color: var(--text-secondary);
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
    }

    .nav-item:hover {
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .nav-item.active {
      background-color: var(--color-primary);
      color: var(--text-inverse);
    }

    .nav-item.active:hover {
      background-color: var(--color-primary-hover);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .settings-dropdown {
      position: relative;
    }

    .dropdown-content {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease-out;
    }

    .dropdown-content.open {
      max-height: 200px;
      transition: max-height 0.3s ease-in;
    }

    .dropdown-item {
      padding: var(--space-sm) var(--space-xl);
      padding-left: 60px;
      color: var(--text-secondary);
      text-decoration: none;
      display: block;
      cursor: pointer;
      transition: all var(--transition-base);
      font-size: var(--font-size-sm);
      border-left: 3px solid transparent;
    }

    .dropdown-item:hover {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      border-left-color: var(--color-primary);
    }

    .dropdown-item.active {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-left-color: var(--color-primary-hover);
    }

    .chevron-icon {
      width: 16px;
      height: 16px;
      margin-left: auto;
      transition: transform var(--transition-base);
    }

    .settings-dropdown.open .chevron-icon {
      transform: rotate(180deg);
    }

    .sidebar-footer {
      padding: var(--space-xl);
      border-top: 1px solid var(--border-color);
    }

    .sign-out-btn {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      width: 100%;
      background: none;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
    }

    .sign-out-btn:hover {
      background-color: var(--color-danger);
      border-color: var(--color-danger);
      color: var(--text-inverse);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 250px;
      }
    }

    @media (max-width: 480px) {
      .sidebar {
        width: 100%;
        position: fixed;
        transform: translateX(-100%);
        transition: transform var(--transition-base);
      }
    }
  `;

  render() {
    return html`
      <div class="sidebar">
        <!-- Header with Logo and User Profile -->
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 13a5 5 0 0 0 7.54.54L13 8.79l-3 4.21z M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
              </svg>
            </div>
            <h1 class="logo-text">Linkly</h1>
          </div>
          
          <!-- User Profile Section -->
          <div class="user-profile">
            <div class="user-avatar">
              ${this.getUserInitial()}
            </div>
            <div class="user-info">
              <div class="user-name">${this.getUserDisplayName()}</div>
              <div class="user-email">${this.getUserEmail()}</div>
            </div>
            <button class="profile-dropdown-trigger" @click=${this.toggleProfileDropdown} title="Profile options">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Profile Dropdown -->
            <div class="profile-dropdown ${this.isProfileDropdownOpen ? 'open' : ''}">
              <button class="profile-dropdown-item" @click=${() => this.navigateToProfile('/profile')}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                View Profile
              </button>
              <button class="profile-dropdown-item" @click=${() => this.navigateToProfile('/settings/account')}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Account Settings
              </button>
              <button class="profile-dropdown-item" @click=${() => this.navigateToProfile('/settings/billing')}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Billing & Plans
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <div class="nav-section">
            <button class="nav-item ${this.activeRoute === '/dashboard' ? 'active' : ''}" @click=${() => this.navigateTo('/dashboard')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </button>

            <button class="nav-item ${this.activeRoute === '/links' ? 'active' : ''}" @click=${() => this.navigateTo('/links')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              My Links
            </button>

            <button class="nav-item ${this.activeRoute === '/qr-codes' ? 'active' : ''}" @click=${() => this.navigateTo('/qr-codes')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              QR Codes
            </button>

            <button class="nav-item ${this.activeRoute === '/analytics' ? 'active' : ''}" @click=${() => this.navigateTo('/analytics')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Analytics
            </button>

            <!-- Settings Dropdown -->
            <div class="settings-dropdown ${this.isSettingsOpen ? 'open' : ''}">
              <button class="nav-item" @click=${this.toggleSettings}>
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
                <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="dropdown-content ${this.isSettingsOpen ? 'open' : ''}">
                <div class="dropdown-item ${this.activeRoute === '/profile' ? 'active' : ''}" @click=${() => this.navigateTo('/profile')}>Profile</div>
                <div class="dropdown-item ${this.activeRoute === '/settings/account' ? 'active' : ''}" @click=${() => this.navigateTo('/settings/account')}>Account</div>
                <div class="dropdown-item ${this.activeRoute === '/settings/security' ? 'active' : ''}" @click=${() => this.navigateTo('/settings/security')}>Security</div>
                <div class="dropdown-item ${this.activeRoute === '/settings/billing' ? 'active' : ''}" @click=${() => this.navigateTo('/settings/billing')}>Billing</div>
              </div>
            </div>

            <button class="nav-item ${this.activeRoute === '/support' ? 'active' : ''}" @click=${() => this.navigateTo('/support')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 002.25 12a9.75 9.75 0 009.75 9.75A9.75 9.75 0 0021.75 12A9.75 9.75 0 0012 2.25z"></path>
              </svg>
              Support
            </button>
          </div>
        </nav>

        <!-- Sign Out -->
        <div class="sidebar-footer">
          <button class="sign-out-btn" @click=${this.handleLogout}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    `;
  }

  private navigateTo(path: string) {
    console.log(`[Sidebar] Navigating to ${path}`);
    // Use navigation store for centralized navigation
    navigationStore.getState().navigateToRoute(path);
  }

  private toggleSettings() {
    // Use navigation store for state management
    navigationStore.getState().toggleSettings();
  }

  private handleLogout() {
    console.log('[Sidebar] Logout requested');
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true
    }));
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

  private getUserEmail(): string {
    return this.user?.email || 'user@example.com';
  }

  private toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  private navigateToProfile(path: string) {
    this.isProfileDropdownOpen = false;
    this.navigateTo(path);
  }

  private handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.shadowRoot?.contains(target)) {
      this.isProfileDropdownOpen = false;
    }
  }
}