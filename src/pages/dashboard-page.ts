import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { useAuthStore } from '../stores/auth-store';
import { useUrlStore } from '../stores/url-store';
import { router } from '../router';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  @state()
  private isLoading = true;

  @state()
  private stats = {
    totalUrls: 0,
    totalClicks: 0,
    activeUrls: 0,
    clicksThisMonth: 0
  };

  @state()
  private recentUrls: any[] = [];

  private authStore = useAuthStore;
  private urlStore = useUrlStore;

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .dashboard-subtitle {
      color: var(--text-secondary, #6c757d);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-left: 4px solid var(--primary, #007bff);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary, #007bff);
      margin: 0 0 0.25rem 0;
    }

    .stat-label {
      color: var(--text-secondary, #6c757d);
      font-size: 0.875rem;
      margin: 0;
    }

    .dashboard-section {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary, #1a1a1a);
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .recent-urls {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .url-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-light, #e5e5e5);
    }

    .url-item:last-child {
      border-bottom: none;
    }

    .url-info {
      flex: 1;
      min-width: 0;
    }

    .url-title {
      font-weight: 500;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .url-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-secondary, #6c757d);
    }

    .url-short {
      color: var(--primary, #007bff);
      text-decoration: none;
    }

    .url-short:hover {
      text-decoration: underline;
    }

    .url-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-secondary, #6c757d);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-secondary, #6c757d);
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .loading-card {
      height: 100px;
      background: var(--bg-light, #f8f9fa);
      border-radius: 8px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        justify-content: center;
      }
      
      .url-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .url-stats {
        align-self: flex-end;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadDashboardData();
  }

  private async loadDashboardData() {
    this.isLoading = true;
    
    try {
      // Load URLs and calculate stats
      await this.urlStore.getState().fetchUrls();
      
      const urls = this.urlStore.getState().urls;
      this.recentUrls = urls.slice(0, 5); // Show 5 most recent
      
      // Calculate stats
      this.stats = {
        totalUrls: urls.length,
        totalClicks: urls.reduce((sum, url) => sum + url.clickCount, 0),
        activeUrls: urls.filter(url => url.isActive).length,
        clicksThisMonth: this.calculateMonthlyClicks(urls)
      };
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateMonthlyClicks(urls: any[]) {
    // This would need proper date filtering based on lastClickedAt
    // For now, return total clicks (simplified)
    return urls.reduce((sum, url) => sum + url.clickCount, 0);
  }

  private handleCreateUrl() {
    router.navigate('/urls/create');
  }

  private handleViewAllUrls() {
    router.navigate('/urls');
  }

  private handleViewUrl(urlId: string) {
    router.navigate(`/urls/${urlId}`);
  }

  private handleLogout() {
    this.authStore.getState().logout();
    router.navigate('/');
  }

  private formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  private renderStats() {
    if (this.isLoading) {
      return html`
        <div class="loading-grid">
          <div class="loading-card"></div>
          <div class="loading-card"></div>
          <div class="loading-card"></div>
          <div class="loading-card"></div>
        </div>
      `;
    }

    return html`
      <div class="stats-grid">
        <div class="stat-card">
          <h3 class="stat-value">${this.stats.totalUrls}</h3>
          <p class="stat-label">Total URLs</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-value">${this.stats.totalClicks}</h3>
          <p class="stat-label">Total Clicks</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-value">${this.stats.activeUrls}</h3>
          <p class="stat-label">Active URLs</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-value">${this.stats.clicksThisMonth}</h3>
          <p class="stat-label">Clicks This Month</p>
        </div>
      </div>
    `;
  }

  private renderRecentUrls() {
    if (this.isLoading) {
      return html`<ui-spinner size="large"></ui-spinner>`;
    }

    if (this.recentUrls.length === 0) {
      return html`
        <div class="empty-state">
          <h3>No URLs created yet</h3>
          <p>Create your first short URL to get started</p>
          <ui-button variant="primary" @click=${this.handleCreateUrl}>
            Create Your First URL
          </ui-button>
        </div>
      `;
    }

    return html`
      <div class="recent-urls">
        ${this.recentUrls.map(url => html`
          <div class="url-item">
            <div class="url-info">
              <h4 class="url-title">${url.title || 'Untitled'}</h4>
              <div class="url-details">
                <a href=${url.shortUrl} class="url-short" target="_blank">
                  ${url.shortUrl}
                </a>
                <span>•</span>
                <span>Created ${this.formatDate(url.createdAt)}</span>
              </div>
            </div>
            <div class="url-stats">
              <span>${url.clickCount} clicks</span>
              <ui-button 
                variant="outline" 
                size="small"
                @click=${() => this.handleViewUrl(url.id)}
              >
                View Details
              </ui-button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    const user = this.authStore.getState().user;
    
    return html`
      <div>
        <div class="dashboard-header">
          <h1 class="dashboard-title">Welcome back, ${user?.name || 'User'}!</h1>
          <p class="dashboard-subtitle">Here's an overview of your link management activity</p>
        </div>

        ${this.renderStats()}

        <div class="quick-actions">
          <ui-button variant="primary" size="large" @click=${this.handleCreateUrl}>
            Create New URL
          </ui-button>
          <ui-button variant="outline" @click=${this.handleViewAllUrls}>
            View All URLs
          </ui-button>
          <ui-button variant="outline" @click=${this.handleLogout}>
            Sign Out
          </ui-button>
        </div>

        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">Recent URLs</h2>
            <ui-button variant="ghost" @click=${this.handleViewAllUrls}>
              View All
            </ui-button>
          </div>
          ${this.renderRecentUrls()}
        </div>
      </div>
    `;
  }
}