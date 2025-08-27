import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { useUrlStore } from '../stores/url-store';
import { router } from '../router';
import type { UrlFilters } from '../types/url';

@customElement('urls-list-page')
export class UrlsListPage extends LitElement {
  @state()
  private isLoading = true;

  @state()
  private selectedUrls: string[] = [];

  @state()
  private showFilters = false;

  private urlStore = useUrlStore;

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary, #1a1a1a);
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filters-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filters-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .bulk-actions {
      background: var(--primary, #007bff);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bulk-actions-text {
      margin: 0;
    }

    .bulk-actions-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .urls-table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .urls-table {
      width: 100%;
      border-collapse: collapse;
    }

    .urls-table th,
    .urls-table td {
      text-align: left;
      padding: 1rem;
      border-bottom: 1px solid var(--border-light, #e5e5e5);
    }

    .urls-table th {
      background: var(--bg-light, #f8f9fa);
      font-weight: 600;
      color: var(--text-primary, #1a1a1a);
    }

    .urls-table tr:hover {
      background: var(--bg-light, #f8f9fa);
    }

    .url-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .url-title {
      font-weight: 500;
      color: var(--text-primary, #1a1a1a);
      margin: 0;
    }

    .url-original {
      font-size: 0.875rem;
      color: var(--text-secondary, #6c757d);
      text-decoration: none;
      word-break: break-all;
    }

    .url-short {
      color: var(--primary, #007bff);
      text-decoration: none;
      font-family: monospace;
    }

    .url-short:hover {
      text-decoration: underline;
    }

    .url-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .url-status.active {
      background: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }

    .url-status.inactive {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }

    .url-status.expired {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .url-actions {
      display: flex;
      gap: 0.5rem;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      background: white;
      border-top: 1px solid var(--border-light, #e5e5e5);
    }

    .pagination-info {
      color: var(--text-secondary, #6c757d);
      font-size: 0.875rem;
    }

    .pagination-controls {
      display: flex;
      gap: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary, #6c757d);
    }

    .empty-state h3 {
      margin: 0 0 1rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }
      
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .header-actions {
        justify-content: stretch;
      }
      
      .filters-grid {
        grid-template-columns: 1fr;
      }
      
      .urls-table-container {
        overflow-x: auto;
      }
      
      .urls-table {
        min-width: 800px;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadUrls();
  }

  private async loadUrls() {
    this.isLoading = true;
    try {
      await this.urlStore.getState().fetchUrls();
    } catch (error) {
      console.error('Failed to load URLs:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleCreateUrl() {
    router.navigate('/urls/create');
  }

  private handleFilterChange(event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    
    const filters: Partial<UrlFilters> = { [name]: value };
    this.urlStore.getState().setFilters(filters);
    this.loadUrls();
  }

  private handleClearFilters() {
    this.urlStore.getState().clearFilters();
    this.loadUrls();
  }

  private handleUrlSelect(urlId: string, checked: boolean) {
    if (checked) {
      this.selectedUrls = [...this.selectedUrls, urlId];
    } else {
      this.selectedUrls = this.selectedUrls.filter(id => id !== urlId);
    }
  }

  private handleSelectAll(checked: boolean) {
    if (checked) {
      this.selectedUrls = this.urlStore.getState().urls.map(url => url.id);
    } else {
      this.selectedUrls = [];
    }
  }

  private async handleBulkAction(operation: 'activate' | 'deactivate' | 'delete') {
    if (this.selectedUrls.length === 0) return;

    const confirmed = operation === 'delete' 
      ? confirm(`Are you sure you want to delete ${this.selectedUrls.length} URLs?`)
      : true;

    if (confirmed) {
      await this.urlStore.getState().bulkOperation({
        urlIds: this.selectedUrls,
        operation
      });
      this.selectedUrls = [];
    }
  }

  private handleViewUrl(urlId: string) {
    router.navigate(`/urls/${urlId}`);
  }

  private formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  private getUrlStatus(url: any) {
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return 'expired';
    }
    return url.isActive ? 'active' : 'inactive';
  }

  private renderFilters() {
    if (!this.showFilters) return '';

    const filters = this.urlStore.getState().filters;

    return html`
      <div class="filters-section">
        <div class="filters-grid">
          <ui-select
            label="Status"
            name="status"
            .value=${filters.status || 'all'}
            @change=${this.handleFilterChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </ui-select>

          <ui-input
            label="Search"
            name="search"
            placeholder="Search URLs..."
            .value=${filters.search || ''}
            @input=${this.handleFilterChange}
          ></ui-input>

          <ui-input
            label="Date From"
            name="dateFrom"
            type="date"
            .value=${filters.dateFrom || ''}
            @change=${this.handleFilterChange}
          ></ui-input>

          <ui-input
            label="Date To"
            name="dateTo"
            type="date"
            .value=${filters.dateTo || ''}
            @change=${this.handleFilterChange}
          ></ui-input>
        </div>
        
        <div class="filters-actions">
          <ui-button variant="outline" @click=${this.handleClearFilters}>
            Clear Filters
          </ui-button>
        </div>
      </div>
    `;
  }

  private renderBulkActions() {
    if (this.selectedUrls.length === 0) return '';

    return html`
      <div class="bulk-actions">
        <p class="bulk-actions-text">
          ${this.selectedUrls.length} URLs selected
        </p>
        <div class="bulk-actions-buttons">
          <ui-button 
            variant="secondary" 
            size="small"
            @click=${() => this.handleBulkAction('activate')}
          >
            Activate
          </ui-button>
          <ui-button 
            variant="secondary" 
            size="small"
            @click=${() => this.handleBulkAction('deactivate')}
          >
            Deactivate
          </ui-button>
          <ui-button 
            variant="danger" 
            size="small"
            @click=${() => this.handleBulkAction('delete')}
          >
            Delete
          </ui-button>
        </div>
      </div>
    `;
  }

  render() {
    const { urls, pagination } = this.urlStore.getState();

    return html`
      <div>
        <div class="page-header">
          <h1 class="page-title">My URLs</h1>
          <div class="header-actions">
            <ui-button 
              variant="outline"
              @click=${() => this.showFilters = !this.showFilters}
            >
              ${this.showFilters ? 'Hide' : 'Show'} Filters
            </ui-button>
            <ui-button variant="primary" @click=${this.handleCreateUrl}>
              Create URL
            </ui-button>
          </div>
        </div>

        ${this.renderFilters()}
        ${this.renderBulkActions()}

        <div class="urls-table-container">
          ${this.isLoading ? html`
            <div style="padding: 3rem; text-align: center;">
              <ui-spinner size="large"></ui-spinner>
            </div>
          ` : urls.length === 0 ? html`
            <div class="empty-state">
              <h3>No URLs found</h3>
              <p>Create your first short URL to get started</p>
              <ui-button variant="primary" @click=${this.handleCreateUrl}>
                Create URL
              </ui-button>
            </div>
          ` : html`
            <table class="urls-table">
              <thead>
                <tr>
                  <th>
                    <ui-checkbox 
                      @change=${(e: Event) => this.handleSelectAll((e.target as HTMLInputElement).checked)}
                    ></ui-checkbox>
                  </th>
                  <th>URL Details</th>
                  <th>Short Link</th>
                  <th>Status</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${urls.map(url => html`
                  <tr>
                    <td>
                      <ui-checkbox
                        .checked=${this.selectedUrls.includes(url.id)}
                        @change=${(e: Event) => this.handleUrlSelect(url.id, (e.target as HTMLInputElement).checked)}
                      ></ui-checkbox>
                    </td>
                    <td>
                      <div class="url-info">
                        <h4 class="url-title">${url.title || 'Untitled'}</h4>
                        <a href=${url.originalUrl} class="url-original" target="_blank">
                          ${url.originalUrl.length > 50 ? url.originalUrl.substring(0, 50) + '...' : url.originalUrl}
                        </a>
                      </div>
                    </td>
                    <td>
                      <a href=${url.shortUrl} class="url-short" target="_blank">
                        ${url.shortUrl}
                      </a>
                    </td>
                    <td>
                      <span class="url-status ${this.getUrlStatus(url)}">
                        ${this.getUrlStatus(url)}
                      </span>
                    </td>
                    <td>${url.clickCount}</td>
                    <td>${this.formatDate(url.createdAt)}</td>
                    <td>
                      <div class="url-actions">
                        <ui-button 
                          variant="ghost" 
                          size="small"
                          @click=${() => this.handleViewUrl(url.id)}
                        >
                          View
                        </ui-button>
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
            
            <div class="pagination">
              <div class="pagination-info">
                Showing ${(pagination.page - 1) * pagination.size + 1} to 
                ${Math.min(pagination.page * pagination.size, pagination.totalElements)} of 
                ${pagination.totalElements} URLs
              </div>
              <div class="pagination-controls">
                <ui-button 
                  variant="outline" 
                  size="small"
                  ?disabled=${pagination.page === 1}
                  @click=${() => this.urlStore.getState().setPage(pagination.page - 1)}
                >
                  Previous
                </ui-button>
                <ui-button 
                  variant="outline" 
                  size="small"
                  ?disabled=${pagination.page >= pagination.totalPages}
                  @click=${() => this.urlStore.getState().setPage(pagination.page + 1)}
                >
                  Next
                </ui-button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  }
}