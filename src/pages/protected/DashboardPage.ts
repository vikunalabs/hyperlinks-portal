import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = css`
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

    @media (max-width: 768px) {      
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
  `;

  render() {
    return html`
      <protected-page-layout activeRoute="/dashboard">
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
      </protected-page-layout>
    `;
  }
}