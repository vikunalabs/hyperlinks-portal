import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../../shared/base-component';
import { authStore } from '../../../stores/auth.store';
import { appRouter } from '../../../router';
import '../../ui/button';
import '../../ui/icon';

interface DashboardMetric {
  label: string;
  value: string;
  icon: 'link' | 'eye' | 'trending-up' | 'users';
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: 'plus' | 'edit' | 'settings' | 'download';
  action: string;
}

@customElement('dashboard-page')
export class DashboardPage extends BaseComponent {
  @property({ type: String }) title = 'Dashboard';
  @property({ type: String }) subtitle = 'Welcome back! Here\'s what\'s happening with your hyperlinks.';

  private metrics: DashboardMetric[] = [
    {
      label: 'Total Links',
      value: '24',
      icon: 'link',
      trend: 'up',
      change: '+3 this week'
    },
    {
      label: 'Total Views',
      value: '1,247',
      icon: 'eye',
      trend: 'up',
      change: '+12% from last week'
    },
    {
      label: 'Performance',
      value: '98.5%',
      icon: 'trending-up',
      trend: 'stable',
      change: 'Excellent uptime'
    },
    {
      label: 'Active Users',
      value: '156',
      icon: 'users',
      trend: 'up',
      change: '+8 new this month'
    }
  ];

  private quickActions: QuickAction[] = [
    {
      label: 'Add New Link',
      description: 'Create a new hyperlink',
      icon: 'plus',
      action: 'add-link'
    },
    {
      label: 'Edit Links',
      description: 'Manage existing links',
      icon: 'edit',
      action: 'edit-links'
    },
    {
      label: 'Settings',
      description: 'Configure your account',
      icon: 'settings',
      action: 'settings'
    },
    {
      label: 'Export Data',
      description: 'Download your data',
      icon: 'download',
      action: 'export'
    }
  ];

  static styles = [
    ...BaseComponent.styles,
    css`
      main {
        min-height: 100vh;
        background-color: #f8fafc;
      }

      .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .dashboard-header {
        margin-bottom: 2rem;
      }

      .dashboard-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .dashboard-subtitle {
        font-size: 1rem;
        color: #6b7280;
        margin-bottom: 1rem;
      }

      .welcome-message {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        margin-bottom: 2rem;
      }

      .welcome-text {
        font-size: 1.125rem;
        font-weight: 500;
      }

      .user-name {
        font-weight: 600;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .metric-card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        border: 1px solid #e5e7eb;
        transition: all 300ms ease;
      }

      .metric-card:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        transform: translateY(-2px);
      }

      .metric-header {
        display: flex;
        align-items: center;
        justify-content: between;
        margin-bottom: 1rem;
      }

      .metric-icon {
        color: #3b82f6;
        margin-right: 0.75rem;
      }

      .metric-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
      }

      .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .metric-change {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .metric-change.trend-up {
        color: #10b981;
      }

      .metric-change.trend-down {
        color: #ef4444;
      }

      .metric-change.trend-stable {
        color: #6b7280;
      }

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
      }

      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .action-card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        border: 1px solid #e5e7eb;
        cursor: pointer;
        transition: all 300ms ease;
        text-decoration: none;
        color: inherit;
      }

      .action-card:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        transform: translateY(-2px);
        border-color: #3b82f6;
      }

      .action-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .action-icon {
        color: #3b82f6;
        margin-right: 0.75rem;
      }

      .action-label {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
      }

      .action-description {
        font-size: 0.875rem;
        color: #6b7280;
        line-height: 1.4;
      }

      .recent-activity {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        border: 1px solid #e5e7eb;
      }

      .activity-item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #f3f4f6;
      }

      .activity-item:last-child {
        border-bottom: none;
      }

      .activity-icon {
        color: #6b7280;
        margin-right: 0.75rem;
      }

      .activity-text {
        font-size: 0.875rem;
        color: #4b5563;
      }

      .activity-time {
        margin-left: auto;
        font-size: 0.75rem;
        color: #9ca3af;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        main {
          padding-top: 5rem;
        }

        .dashboard-container {
          padding: 1rem;
        }

        .dashboard-title {
          font-size: 1.5rem;
        }

        .metrics-grid,
        .quick-actions-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .metric-card,
        .action-card {
          padding: 1rem;
        }
      }

      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        .metric-card,
        .action-card {
          transition: none;
        }

        .metric-card:hover,
        .action-card:hover {
          transform: none;
        }
      }
    `
  ];

  private getCurrentUser() {
    const { user } = authStore.getState();
    return user;
  }

  private handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-link':
        // TODO: Open add link modal/page
        console.log('Add new link action');
        break;
      case 'edit-links':
        appRouter.navigate('/links');
        break;
      case 'settings':
        appRouter.navigate('/settings');
        break;
      case 'export':
        // TODO: Trigger export functionality
        console.log('Export data action');
        break;
    }
  };

  render() {
    const user = this.getCurrentUser();
    const userName = user?.name || user?.username || 'User';

    return html`
      <main>
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1 class="dashboard-title">${this.title}</h1>
            <p class="dashboard-subtitle">${this.subtitle}</p>
            
            <div class="welcome-message">
              <div class="welcome-text">
                Welcome back, <span class="user-name">${userName}</span>! 
                Ready to manage your hyperlinks?
              </div>
            </div>
          </div>

          <!-- Metrics Section -->
          <section class="metrics-section">
            <h2 class="section-title">Overview</h2>
            <div class="metrics-grid">
              ${this.metrics.map(metric => html`
                <div class="metric-card">
                  <div class="metric-header">
                    <div class="metric-icon">
                      <ui-icon name="${metric.icon}" size="lg"></ui-icon>
                    </div>
                    <div class="metric-label">${metric.label}</div>
                  </div>
                  <div class="metric-value">${metric.value}</div>
                  ${metric.change ? html`
                    <div class="metric-change trend-${metric.trend}">
                      ${metric.change}
                    </div>
                  ` : ''}
                </div>
              `)}
            </div>
          </section>

          <!-- Quick Actions Section -->
          <section class="quick-actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="quick-actions-grid">
              ${this.quickActions.map(action => html`
                <div class="action-card" @click="${() => this.handleQuickAction(action.action)}">
                  <div class="action-header">
                    <div class="action-icon">
                      <ui-icon name="${action.icon}" size="lg"></ui-icon>
                    </div>
                    <div class="action-label">${action.label}</div>
                  </div>
                  <div class="action-description">${action.description}</div>
                </div>
              `)}
            </div>
          </section>

          <!-- Recent Activity Section -->
          <section class="recent-activity-section">
            <h2 class="section-title">Recent Activity</h2>
            <div class="recent-activity">
              <div class="activity-item">
                <div class="activity-icon">
                  <ui-icon name="link" size="sm"></ui-icon>
                </div>
                <div class="activity-text">Created new link "Product Launch"</div>
                <div class="activity-time">2 hours ago</div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <ui-icon name="edit" size="sm"></ui-icon>
                </div>
                <div class="activity-text">Updated link "Marketing Campaign"</div>
                <div class="activity-time">1 day ago</div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <ui-icon name="eye" size="sm"></ui-icon>
                </div>
                <div class="activity-text">Link "Homepage" viewed 45 times</div>
                <div class="activity-time">2 days ago</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    `;
  }
}