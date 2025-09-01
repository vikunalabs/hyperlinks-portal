import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  @state() private activeNavItem = 'dashboard';
  @state() private isSettingsOpen = false;
  static styles = css`
    :host {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
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

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-md);
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

    .btn {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      border: 2px solid transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      text-decoration: none;
      display: inline-block;
      text-align: center;
      line-height: var(--line-height-base);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      transform: translateY(-1px);
    }

    .dashboard-header {
      margin-bottom: var(--space-2xl);
    }

    .dashboard-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-md) 0;
    }

    .dashboard-subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-xl);
      margin-bottom: var(--space-2xl);
    }

    .dashboard-card {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }

    .dashboard-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .card-icon {
      width: 24px;
      height: 24px;
      color: var(--color-primary);
    }

    .card-content {
      color: var(--text-secondary);
      line-height: var(--line-height-relaxed);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .stat-card {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      text-align: center;
    }

    .stat-number {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      margin: 0 0 var(--space-sm) 0;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .quick-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      transform: translateY(-1px);
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
      .sidebar {
        width: 250px;
      }
      
      .main-container {
        margin-left: 250px;
      }
      
      .main-content {
        padding: var(--space-md);
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: var(--space-lg);
      }
      
      .dashboard-title {
        font-size: var(--font-size-2xl);
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--space-md);
      }
      
      .quick-actions {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .sidebar {
        width: 100%;
        position: fixed;
        transform: translateX(-100%);
        transition: transform var(--transition-base);
      }
      
      .main-container {
        margin-left: 0;
      }
    }
  `;

  render() {
    return html`
      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 13a5 5 0 0 0 7.54.54L13 8.79l-3 4.21z M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
              </svg>
            </div>
            <h1 class="logo-text">Linkly</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <div class="nav-section">
            <button class="nav-item ${this.activeNavItem === 'dashboard' ? 'active' : ''}" @click=${() => this.setActiveNav('dashboard')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </button>

            <button class="nav-item" @click=${() => this.navigateTo('/links')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              My Links
            </button>

            <button class="nav-item" @click=${() => this.navigateTo('/qr-codes')}>
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              QR Codes
            </button>

            <button class="nav-item" @click=${() => this.navigateTo('/analytics')}>
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
                <div class="dropdown-item" @click=${() => this.navigateTo('/profile')}>Profile</div>
                <div class="dropdown-item" @click=${() => this.navigateTo('/settings/account')}>Account</div>
                <div class="dropdown-item" @click=${() => this.navigateTo('/settings/security')}>Security</div>
                <div class="dropdown-item" @click=${() => this.navigateTo('/settings/billing')}>Billing</div>
              </div>
            </div>

            <button class="nav-item" @click=${() => this.navigateTo('/support')}>
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

      <!-- Main Container -->
      <div class="main-container">
        <!-- Top Navigation -->
        <div class="top-navbar">
          <h1 class="page-title">${this.getPageTitle()}</h1>
          <div class="user-actions">
            <div class="user-info">
              <div class="user-avatar">U</div>
              <span class="user-name">User</span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          ${this.renderContent()}
        </div>
      </div>
    `;
  }

  private setActiveNav(item: string) {
    this.activeNavItem = item;
    console.log(`[Dashboard] Navigating to ${item}`);
  }

  private toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }


  private getPageTitle(): string {
    switch (this.activeNavItem) {
      case 'dashboard':
        return 'Dashboard';
      case 'links':
        return 'My Links';
      case 'qr':
        return 'QR Codes';
      case 'analytics':
        return 'Analytics';
      case 'support':
        return 'Support';
      case 'settings-profile':
        return 'Profile Settings';
      case 'settings-account':
        return 'Account Settings';
      case 'settings-security':
        return 'Security Settings';
      case 'settings-billing':
        return 'Billing Settings';
      default:
        return 'Dashboard';
    }
  }

  private renderContent() {
    switch (this.activeNavItem) {
      case 'dashboard':
        return this.renderDashboardContent();
      case 'links':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">My Links</h1>
          <p class="dashboard-subtitle">Manage and organize your hyperlinks</p>
        </div>
        <p>Links management interface coming soon...</p>`;
      case 'qr':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">QR Codes</h1>
          <p class="dashboard-subtitle">Generate and manage QR codes for your links</p>
        </div>
        <p>QR code generator coming soon...</p>`;
      case 'analytics':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">Analytics</h1>
          <p class="dashboard-subtitle">Track your link performance and engagement</p>
        </div>
        <p>Analytics dashboard coming soon...</p>`;
      case 'support':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">Support</h1>
          <p class="dashboard-subtitle">Get help and contact our support team</p>
        </div>
        <p>Support center coming soon...</p>`;
      case 'settings-profile':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">Profile Settings</h1>
          <p class="dashboard-subtitle">Manage your personal information</p>
        </div>
        <p>Profile settings coming soon...</p>`;
      case 'settings-account':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">Account Settings</h1>
          <p class="dashboard-subtitle">Manage your account preferences</p>
        </div>
        <p>Account settings coming soon...</p>`;
      case 'settings-security':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">Security Settings</h1>
          <p class="dashboard-subtitle">Manage your security and privacy settings</p>
        </div>
        <p>Security settings coming soon...</p>`;
      case 'settings-billing':
        return html`<div class="dashboard-header">
          <h1 class="dashboard-title">Billing Settings</h1>
          <p class="dashboard-subtitle">Manage your subscription and billing</p>
        </div>
        <p>Billing settings coming soon...</p>`;
      default:
        return this.renderDashboardContent();
    }
  }

  private renderDashboardContent() {
    return html`
      <div class="dashboard-header">
        <h1 class="dashboard-title">Welcome back!</h1>
        <p class="dashboard-subtitle">Here's an overview of your hyperlinks management platform</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">0</div>
          <div class="stat-label">Total Links</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">0</div>
          <div class="stat-label">Collections</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">0</div>
          <div class="stat-label">Tags</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">0</div>
          <div class="stat-label">Clicks Today</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-header">
            <h2 class="card-title">Quick Actions</h2>
            <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="card-content">
            <div class="quick-actions">
              <button class="btn btn-primary">Add New Link</button>
              <button class="btn btn-secondary">Create Collection</button>
              <button class="btn btn-secondary">Import Links</button>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">
            <h2 class="card-title">Recent Activity</h2>
            <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="card-content">
            <p>No recent activity yet. Start by adding your first hyperlink!</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">
            <h2 class="card-title">Popular Links</h2>
            <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="card-content">
            <p>Your most popular links will appear here once you start tracking clicks.</p>
          </div>
        </div>
      </div>
    `;
  }

  private navigateTo(path: string) {
    console.log(`[Dashboard] Navigating to ${path}`);
    // Import appRouter dynamically to avoid circular imports
    import('../../router').then(({ appRouter }) => {
      appRouter.navigate(path);
    });
  }

  private handleLogout() {
    console.log('[Dashboard] Logout requested');
    // TODO: Implement logout functionality
  }
}