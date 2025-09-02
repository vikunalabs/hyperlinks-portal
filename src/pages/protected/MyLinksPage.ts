import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import '../../components/modals/ConfirmationModal';
import type { ConfirmationModal } from '../../components/modals/ConfirmationModal';

interface LinkFormData {
  title: string;
  longLink: string;
  domain: string;
  code: string;
  expiryDate: string;
  password: string;
}

interface LinkData {
  id: string;
  title: string;
  shortLink: string;
  longLink: string;
  domain: string;
  code: string;
  expiryDate?: string;
  hasPassword: boolean;
  createdAt: string;
  clicks: number;
  status: 'active' | 'expired' | 'disabled';
}

@customElement('my-links-page')
export class MyLinksPage extends LitElement {
  @state() private showModal = false;
  @state() private modalMode: 'add' | 'edit' | 'view' = 'add';
  @state() private selectedLink?: LinkFormData;
  @state() private selectedLinkId?: string;
  @state() private links: LinkData[] = [];
  @state() private searchQuery = '';
  @state() private sortBy = 'created';
  @state() private filterBy = 'all';
  @state() private currentPage = 1;
  @state() private itemsPerPage = 10;
  
  @query('confirmation-modal') private confirmationModal!: ConfirmationModal;

  connectedCallback() {
    super.connectedCallback();
    // Add some sample data for testing
    this.initSampleData();
  }

  private initSampleData() {
    this.links = [
      {
        id: '1',
        title: 'My Portfolio Website',
        shortLink: 'hlink.ly/portfolio',
        longLink: 'https://myportfolio.example.com/about',
        domain: 'hlink.ly',
        code: 'portfolio',
        expiryDate: '2025-12-31',
        hasPassword: false,
        createdAt: '2024-01-15T10:30:00Z',
        clicks: 125,
        status: 'active'
      },
      {
        id: '2',
        title: 'Important Document',
        shortLink: 'hlink.ly/doc123',
        longLink: 'https://drive.google.com/file/d/1234567890abcdef/view',
        domain: 'hlink.ly',
        code: 'doc123',
        hasPassword: true,
        createdAt: '2024-02-10T14:22:00Z',
        clicks: 45,
        status: 'active'
      },
      {
        id: '3',
        title: 'GitHub Repository',
        shortLink: 'custom.one/myrepo',
        longLink: 'https://github.com/username/my-awesome-project',
        domain: 'custom.one',
        code: 'myrepo',
        expiryDate: '2024-06-30',
        hasPassword: false,
        createdAt: '2024-01-05T09:15:00Z',
        clicks: 89,
        status: 'expired'
      }
    ];
  }

  static styles = css`
    .page-header {
      margin-bottom: var(--space-2xl);
    }

    .page-title-main {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-md) 0;
    }

    .page-subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin: 0;
    }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      padding: var(--space-lg);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
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

    .empty-state {
      text-align: center;
      padding: var(--space-2xl);
      background-color: var(--bg-secondary);
      border: 2px dashed var(--border-color);
      border-radius: var(--radius-lg);
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--space-lg);
      color: var(--text-secondary);
    }

    .empty-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-md) 0;
    }

    .empty-description {
      color: var(--text-secondary);
      margin: 0 0 var(--space-lg) 0;
    }

    .links-table-container {
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .links-table {
      width: 100%;
      border-collapse: collapse;
    }

    .links-table th {
      background-color: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      padding: var(--space-md);
      text-align: left;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .links-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--border-color-light);
      vertical-align: middle;
    }

    .links-table tbody tr:hover {
      background-color: var(--bg-primary);
    }

    .links-table tbody tr:last-child td {
      border-bottom: none;
    }

    .short-link {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      word-break: break-all;
    }

    .short-link:hover {
      text-decoration: underline;
    }

    .long-link {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .link-title {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--space-xs);
    }

    .password-indicator {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .password-indicator.protected {
      background-color: var(--color-warning-light);
      color: var(--color-warning-dark);
    }

    .password-indicator.public {
      background-color: var(--color-success-light);
      color: var(--color-success-dark);
    }

    .expiry-date {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }

    .expiry-date.expired {
      color: var(--color-danger);
      font-weight: var(--font-weight-medium);
    }

    .expiry-date.expiring-soon {
      color: var(--color-warning);
      font-weight: var(--font-weight-medium);
    }

    .actions {
      display: flex;
      gap: var(--space-sm);
    }

    .action-btn {
      padding: var(--space-sm);
      border: none;
      background: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
      width: 40px;
      height: 40px;
    }

    .action-btn:hover {
      background-color: var(--bg-primary);
    }

    .action-btn.view {
      color: var(--color-primary);
    }

    .action-btn.edit {
      color: var(--color-warning);
    }

    .action-btn.delete {
      color: var(--color-danger);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .stats-summary {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .search-controls {
      display: flex;
      gap: var(--space-md);
      align-items: center;
      margin-bottom: var(--space-xl);
      padding: var(--space-lg);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .search-input {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--font-size-md);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .dropdown {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--font-size-md);
      cursor: pointer;
      min-width: 150px;
    }

    .dropdown:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }

    .pagination-info {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .pagination-controls {
      display: flex;
      gap: var(--space-sm);
      align-items: center;
    }

    .pagination-btn {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border-color);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
    }

    .pagination-btn:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-btn.active {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: capitalize;
    }

    .status-badge.active {
      background-color: var(--color-success-light);
      color: var(--color-success-dark);
    }

    .status-badge.expired {
      background-color: var(--color-danger-light);
      color: var(--color-danger-dark);
    }

    .status-badge.disabled {
      background-color: var(--color-warning-light);
      color: var(--color-warning-dark);
    }

    .clicks-count {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    .created-date {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }

    @media (max-width: 768px) {
      .search-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .pagination-container {
        flex-direction: column;
        gap: var(--space-md);
        text-align: center;
      }

      .pagination-controls {
        justify-content: center;
      }

      .links-table-container {
        overflow-x: auto;
      }

      .links-table {
        min-width: 1000px;
      }

      .long-link {
        max-width: 150px;
      }
    }
  `;

  render() {
    return html`
      <protected-page-layout activeRoute="/links">
        <div class="page-header">
          <h1 class="page-title-main">My Links</h1>
          <p class="page-subtitle">Manage and organize your hyperlinks</p>
        </div>

        <div class="action-bar">
          <div class="stats-summary">
            <span>${this.getFilteredLinks().length} of ${this.links.length} links</span>
            ${this.links.length > 0 ? html`
              <span> • ${this.getTotalClicks()} clicks total</span>
            ` : ''}
          </div>
          <button class="btn btn-primary" @click=${this.openAddModal}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Link
          </button>
        </div>

        <!-- Search Controls -->
        <div class="search-controls">
          <input 
            class="search-input" 
            type="text" 
            placeholder="Search links by title, domain, or destination..."
            .value=${this.searchQuery}
            @input=${this.handleSearchInput}
          />
          <select class="dropdown" .value=${this.sortBy} @change=${this.handleSortChange}>
            <option value="created">Sort by Created</option>
            <option value="title">Sort by Title</option>
            <option value="clicks">Sort by Clicks</option>
            <option value="expiry">Sort by Expiry</option>
          </select>
          <select class="dropdown" .value=${this.filterBy} @change=${this.handleFilterChange}>
            <option value="all">All Links</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="disabled">Disabled</option>
            <option value="protected">Protected</option>
            <option value="public">Public</option>
          </select>
        </div>

        ${this.links.length === 0 ? html`
          <div class="empty-state">
            <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <h3 class="empty-title">No links yet</h3>
            <p class="empty-description">Start building your link collection by adding your first hyperlink.</p>
            <button class="btn btn-primary" @click=${this.openAddModal}>Add Your First Link</button>
          </div>
        ` : html`
          <div class="links-table-container">
            <table class="links-table">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Destination</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Protection</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.getPaginatedLinks().map(link => html`
                  <tr>
                    <td>
                      <div class="link-title">${link.title || 'Untitled'}</div>
                      <a href="https://${link.shortLink}" target="_blank" class="short-link">
                        https://${link.shortLink}
                      </a>
                    </td>
                    <td>
                      <div class="long-link" title="${link.longLink}">
                        ${link.longLink}
                      </div>
                    </td>
                    <td>
                      <div class="clicks-count">${link.clicks.toLocaleString()}</div>
                    </td>
                    <td>
                      <div class="created-date">${this.formatDate(link.createdAt)}</div>
                    </td>
                    <td>
                      ${link.expiryDate ? html`
                        <div class="expiry-date ${this.getExpiryStatus(link.expiryDate)}">
                          ${this.formatDate(link.expiryDate)}
                        </div>
                      ` : html`
                        <span class="expiry-date">Never</span>
                      `}
                    </td>
                    <td>
                      <span class="status-badge ${link.status}">
                        ${link.status}
                      </span>
                    </td>
                    <td>
                      <span class="password-indicator ${link.hasPassword ? 'protected' : 'public'}">
                        ${link.hasPassword ? html`
                          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                          Protected
                        ` : html`
                          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                          </svg>
                          Public
                        `}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <button class="action-btn view" @click=${() => this.viewLink(link)} title="View analytics">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        <button class="action-btn edit" @click=${() => this.editLink(link)} title="Edit link">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button class="action-btn delete" @click=${() => this.deleteLink(link)} title="Delete link">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
            ${this.getFilteredLinks().length > this.itemsPerPage ? html`
              <div class="pagination-container">
                <div class="pagination-info">
                  Showing ${this.getPaginationStartIndex()} to ${this.getPaginationEndIndex()} of ${this.getFilteredLinks().length} links
                </div>
                <div class="pagination-controls">
                  <button 
                    class="pagination-btn"
                    ?disabled=${this.currentPage === 1}
                    @click=${this.goToPreviousPage}
                  >
                    Previous
                  </button>
                  ${this.getPaginationButtons().map(page => html`
                    <button 
                      class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
                      @click=${() => this.goToPage(page)}
                    >
                      ${page}
                    </button>
                  `)}
                  <button 
                    class="pagination-btn"
                    ?disabled=${this.currentPage === this.getTotalPages()}
                    @click=${this.goToNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </protected-page-layout>
      
      <!-- Link Modal -->
      <add-link-modal 
        ?open=${this.showModal} 
        mode=${this.modalMode}
        .linkData=${this.selectedLink}
        @close=${this.closeModal}
        @submit=${this.handleLinkSubmit}
        @update=${this.handleLinkUpdate}
        @edit-mode=${this.handleSwitchToEditMode}>
      </add-link-modal>

      <!-- Confirmation Modal -->
      <confirmation-modal></confirmation-modal>
    `;
  }

  private openAddModal() {
    this.modalMode = 'add';
    this.selectedLink = undefined;
    this.selectedLinkId = undefined;
    this.showModal = true;
  }

  private closeModal() {
    this.showModal = false;
    this.selectedLink = undefined;
    this.selectedLinkId = undefined;
  }

  private handleLinkSubmit(event: CustomEvent) {
    const formData = event.detail;
    console.log('[MyLinks] New link submitted:', formData);
    
    const alias = formData.code || this.generateCode();
    
    // Create new link object with proper short link format
    const newLink: LinkData = {
      id: this.generateId(),
      title: formData.title || '',
      shortLink: `${formData.domain}/${alias}`,
      longLink: formData.longLink,
      domain: formData.domain,
      code: alias,
      expiryDate: formData.expiryDate || undefined,
      hasPassword: !!formData.password,
      createdAt: new Date().toISOString(),
      clicks: 0,
      status: 'active'
    };
    
    // Add to links array
    this.links = [...this.links, newLink];
    this.closeModal();
  }

  private handleLinkUpdate(event: CustomEvent) {
    const formData = event.detail;
    console.log('[MyLinks] Link updated:', formData);
    
    if (this.selectedLinkId) {
      // Update in links array
      this.links = this.links.map(link => 
        link.id === this.selectedLinkId ? {
          ...link,
          title: formData.title || '',
          longLink: formData.longLink,
          expiryDate: formData.expiryDate || undefined,
          hasPassword: !!formData.password,
        } : link
      );
    }
    
    this.closeModal();
  }

  private handleSwitchToEditMode() {
    this.modalMode = 'edit';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getTotalClicks(): number {
    return this.links.reduce((total, link) => total + link.clicks, 0);
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private getExpiryStatus(expiryDate: string): string {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return 'expired';
    } else if (daysUntilExpiry <= 7) {
      return 'expiring-soon';
    }
    return '';
  }

  private viewLink(link: LinkData) {
    console.log('[MyLinks] View link:', link.id);
    this.modalMode = 'view';
    this.selectedLinkId = link.id;
    this.selectedLink = {
      title: link.title,
      longLink: link.longLink,
      domain: link.domain,
      code: link.code, // This will be the alias from backend
      expiryDate: link.expiryDate || '', // Populate if exists, empty if not
      password: '' // Always empty - password not shown for security
    };
    this.showModal = true;
  }

  private editLink(link: LinkData) {
    console.log('[MyLinks] Edit link:', link.id);
    this.modalMode = 'edit';
    this.selectedLinkId = link.id;
    this.selectedLink = {
      title: link.title,
      longLink: link.longLink,
      domain: link.domain, // Preselect the domain
      code: link.code, // Show alias (same as user's wish/custom code)
      expiryDate: link.expiryDate || '', // Prepopulate if exists
      password: '' // Empty - user must enter new password to change
    };
    this.showModal = true;
  }

  private async deleteLink(link: LinkData) {
    console.log('[MyLinks] Delete link:', link.id);
    
    const linkDisplayName = link.title || link.shortLink;
    const confirmed = await this.confirmationModal.show({
      title: 'Delete Link',
      message: `Are you sure you want to delete "${linkDisplayName}"? This action cannot be undone and all analytics data will be lost.`,
      confirmText: 'Delete Link',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'delete'
    });

    if (confirmed) {
      this.links = this.links.filter(l => l.id !== link.id);
      console.log('[MyLinks] Link deleted successfully:', link.id);
    }
  }

  // Search and Filter Methods
  private handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 1; // Reset to first page when searching
  }

  private handleSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    this.currentPage = 1; // Reset to first page when sorting
  }

  private handleFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterBy = select.value;
    this.currentPage = 1; // Reset to first page when filtering
  }

  private getFilteredLinks(): LinkData[] {
    let filtered = this.links;

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(link => 
        (link.title || '').toLowerCase().includes(query) ||
        link.shortLink.toLowerCase().includes(query) ||
        link.longLink.toLowerCase().includes(query) ||
        link.domain.toLowerCase().includes(query)
      );
    }

    // Apply status/protection filter
    if (this.filterBy !== 'all') {
      filtered = filtered.filter(link => {
        switch (this.filterBy) {
          case 'active':
          case 'expired':
          case 'disabled':
            return link.status === this.filterBy;
          case 'protected':
            return link.hasPassword;
          case 'public':
            return !link.hasPassword;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'clicks':
          return b.clicks - a.clicks;
        case 'expiry':
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }

  // Pagination Methods
  private getPaginatedLinks(): LinkData[] {
    const filtered = this.getFilteredLinks();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  private getTotalPages(): number {
    return Math.ceil(this.getFilteredLinks().length / this.itemsPerPage);
  }

  private getPaginationStartIndex(): number {
    return Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.getFilteredLinks().length);
  }

  private getPaginationEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.getFilteredLinks().length);
  }

  private getPaginationButtons(): number[] {
    const totalPages = this.getTotalPages();
    const buttons: number[] = [];
    const maxButtons = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    return buttons;
  }

  private goToPage(page: number) {
    this.currentPage = page;
  }

  private goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  private goToNextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}