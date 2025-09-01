import { LitElement, html, css } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';
import { EyeIcon, EyeOffIcon } from '../../shared/icons';
import { allModalStyles } from '../../shared/styles/modal-styles';

interface LinkFormData {
  title: string;
  longLink: string;
  domain: string;
  code: string;
  expiryDate: string;
  password: string;
}

interface ValidationErrors {
  title?: string;
  longLink?: string;
  code?: string;
  expiryDate?: string;
  password?: string;
}

type ModalMode = 'add' | 'edit' | 'view';

@customElement('add-link-modal')
export class AddLinkModal extends LitElement {
  @property({ type: Boolean }) open = false;
  @property({ type: String }) mode: ModalMode = 'add';
  @property({ type: Object }) linkData?: LinkFormData;
  @state() private isSubmitting = false;
  @state() private showPassword = false;
  @state() private formData: LinkFormData = {
    title: '',
    longLink: '',
    domain: '',
    code: '',
    expiryDate: '',
    password: ''
  };
  @state() private errors: ValidationErrors = {};
  @state() private touched: Record<string, boolean> = {};

  @query('#title-input') private titleInput?: HTMLInputElement;

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    
    if (changedProperties.has('open') && this.open) {
      this.loadFormData();
      // Focus the title input after the modal is rendered (except in view mode)
      if (this.mode !== 'view') {
        this.updateComplete.then(() => {
          this.titleInput?.focus();
        });
      }
    }

    if (changedProperties.has('linkData') && this.linkData) {
      this.loadFormData();
    }
  }

  private loadFormData() {
    if (this.linkData && (this.mode === 'edit' || this.mode === 'view')) {
      this.formData = { ...this.linkData };
    } else {
      // Reset for add mode
      this.formData = {
        title: '',
        longLink: '',
        domain: 'hlink.ly',
        code: '',
        expiryDate: '',
        password: ''
      };
    }
    this.errors = {};
    this.touched = {};
    this.showPassword = false;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  static styles = [
    ...allModalStyles,
    css`
      /* AddLinkModal specific styles only */
      .modal {
        max-width: 750px; /* Large modal size for link form */
      }

      .domain-code-group {
        display: flex;
        gap: var(--space-sm);
        align-items: flex-start;
      }

      .domain-select {
        flex: 1;
      }

      .code-input {
        flex: 1;
      }

      .form-help {
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        margin-top: var(--space-xs);
      }

      .short-link-display {
        padding: var(--space-sm) var(--space-md);
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-xs);
      }

      .short-link-display .short-link {
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        color: var(--color-primary);
      }

      .short-link-display .short-link:hover {
        text-decoration: underline;
      }

      .form-input:read-only,
      .form-select:read-only,
      .form-select:disabled {
        background-color: var(--bg-secondary);
        color: var(--text-secondary);
        cursor: not-allowed;
      }

      .form-select:disabled {
        opacity: 0.6;
      }

      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: var(--space-xs);
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 480px) {
        .domain-code-group {
          flex-direction: column;
          gap: var(--space-md);
        }

        .domain-select {
          flex: 1;
        }

        .modal-footer {
          flex-direction: column;
        }

        .modal-footer .btn {
          width: 100%;
        }
      }
    `
  ];

  render() {
    const isFormValid = this.isValidForm();
    const isReadOnly = this.mode === 'view';
    const modalTitle = this.mode === 'add' ? 'Add New Link' : 
                      this.mode === 'edit' ? 'Edit Link' : 'View Link';
    const modalSubtitle = this.mode === 'add' ? 'Create a shortened link for easy sharing' :
                         this.mode === 'edit' ? 'Update your link details' : 'Link details and analytics';
    
    return html`
      <div 
        class="modal-backdrop ${this.open ? 'open' : ''}"
        @click=${this.handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-link-modal-title"
      >
        <div class="modal" @click=${this.handleModalClick}>
          <button 
            class="close-btn" 
            @click=${this.close}
            aria-label="Close modal"
          >×</button>
          
          <div class="modal-header">
            <h2 id="add-link-modal-title" class="modal-title">${modalTitle}</h2>
            <p class="modal-subtitle">${modalSubtitle}</p>
          </div>

          <form @submit=${this.handleSubmit}>

            <div class="form-group">
              <label class="form-label" for="title-input">Title</label>
              <input
                id="title-input"
                class="form-input ${this.errors.title ? 'error' : ''}"
                type="text"
                .value=${this.formData.title}
                @input=${this.handleTitleChange}
                @blur=${() => this.touched.title = true}
                placeholder="Enter a descriptive title"
                ?readonly=${isReadOnly}
                autocomplete="off"
                spellcheck="false"
                aria-describedby="title-help ${this.errors.title ? 'title-error' : ''}"
                aria-invalid=${this.errors.title ? 'true' : 'false'}
              />
              ${this.errors.title ? html`<span id="title-error" class="form-error" role="alert">${this.errors.title}</span>` : ''}
              <span class="form-help" id="title-help">A friendly name to identify your link</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="long-link-input">Long Link<span class="required">*</span></label>
              <input
                id="long-link-input"
                class="form-input ${this.errors.longLink ? 'error' : ''}"
                type="url"
                .value=${this.formData.longLink}
                @input=${this.handleLongLinkChange}
                @blur=${() => this.touched.longLink = true}
                placeholder="https://example.com/very-long-url"
                ?required=${!isReadOnly}
                ?readonly=${isReadOnly}
                autocomplete="off"
                spellcheck="false"
                aria-describedby="long-link-help ${this.errors.longLink ? 'long-link-error' : ''}"
                aria-invalid=${this.errors.longLink ? 'true' : 'false'}
              />
              ${this.errors.longLink ? html`<span id="long-link-error" class="form-error" role="alert">${this.errors.longLink}</span>` : ''}
              <span class="form-help" id="long-link-help">The original URL you want to shorten</span>
            </div>

            <div class="form-group">
              <label class="form-label">Domain & Custom Code</label>
              <div class="domain-code-group">
                <div class="domain-select">
                  <select
                    class="form-select"
                    .value=${this.formData.domain}
                    @change=${this.handleDomainChange}
                    ?disabled=${isReadOnly}
                    aria-label="Select domain"
                  >
                    <option value="hlink.ly">hlink.ly</option>
                    <option value="custom.one">custom.one</option>
                  </select>
                </div>
                <div class="code-input">
                  <input
                    class="form-input ${this.errors.code ? 'error' : ''}"
                    type="text"
                    .value=${this.formData.code}
                    @input=${this.handleCodeChange}
                    @blur=${() => this.touched.code = true}
                    placeholder="custom-code"
                    ?readonly=${isReadOnly}
                    autocomplete="off"
                    spellcheck="false"
                    aria-describedby="code-help ${this.errors.code ? 'code-error' : ''}"
                    aria-invalid=${this.errors.code ? 'true' : 'false'}
                  />
                </div>
              </div>
              ${this.errors.code ? html`<span id="code-error" class="form-error" role="alert">${this.errors.code}</span>` : ''}
              <span class="form-help" id="code-help">${this.mode === 'add' ? 'Optional: Custom code for your short link' : 'Your link code (alias)'}</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="expiry-input">Expiry Date</label>
              <input
                id="expiry-input"
                class="form-input ${this.errors.expiryDate ? 'error' : ''}"
                type="date"
                .value=${this.formData.expiryDate}
                @input=${this.handleExpiryDateChange}
                @blur=${() => this.touched.expiryDate = true}
                min=${this.getTomorrowDate()}
                ?readonly=${isReadOnly}
                autocomplete="off"
                aria-describedby="expiry-help ${this.errors.expiryDate ? 'expiry-error' : ''}"
                aria-invalid=${this.errors.expiryDate ? 'true' : 'false'}
              />
              ${this.errors.expiryDate ? html`<span id="expiry-error" class="form-error" role="alert">${this.errors.expiryDate}</span>` : ''}
              <span class="form-help" id="expiry-help">Optional: When the link should stop working</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password-input">Password</label>
              <div class="password-input-container">
                <input
                  id="password-input"
                  class="form-input ${this.errors.password ? 'error' : ''}"
                  type=${this.showPassword ? 'text' : 'password'}
                  .value=${this.formData.password}
                  @input=${this.handlePasswordChange}
                  @blur=${() => this.touched.password = true}
                  placeholder="Enter password (optional)"
                  autocomplete="off"
                  spellcheck="false"
                  ?readonly=${isReadOnly}
                  aria-describedby="password-help ${this.errors.password ? 'password-error' : ''}"
                  aria-invalid=${this.errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click=${this.togglePasswordVisibility}
                  title=${this.showPassword ? 'Hide password' : 'Show password'}
                >
                  ${this.showPassword ? this.eyeIcon : this.eyeOffIcon}
                </button>
              </div>
              ${this.errors.password ? html`<span id="password-error" class="form-error" role="alert">${this.errors.password}</span>` : ''}
              <span class="form-help" id="password-help">Optional: Protect your link with a password</span>
            </div>

            <div class="modal-footer">
              ${this.mode === 'view' ? html`
                <button type="button" class="btn btn-secondary" @click=${this.close}>
                  Close
                </button>
                <button type="button" class="btn btn-primary" @click=${this.switchToEditMode}>
                  Edit Link
                </button>
              ` : this.mode === 'edit' ? html`
                <button type="button" class="btn btn-secondary" @click=${this.close}>
                  Close
                </button>
                <button type="submit" class="btn btn-primary" ?disabled=${this.isSubmitting || !isFormValid}>
                  ${this.isSubmitting ? html`<span class="spinner"></span>` : ''}
                  ${this.isSubmitting ? 'Updating...' : 'Update Link'}
                </button>
              ` : html`
                <button type="button" class="btn btn-secondary" @click=${this.handleReset} ?disabled=${this.isSubmitting}>
                  Reset
                </button>
                <button type="submit" class="btn btn-primary" ?disabled=${this.isSubmitting || !isFormValid}>
                  ${this.isSubmitting ? html`<span class="spinner"></span>` : ''}
                  ${this.isSubmitting ? 'Creating...' : 'Create Link'}
                </button>
              `}
            </div>
          </form>
        </div>
      </div>
    `;
  }

  public close() {
    this.resetForm();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private get eyeIcon() {
    return EyeIcon;
  }

  private get eyeOffIcon() {
    return EyeOffIcon;
  }

  private togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private switchToEditMode() {
    this.dispatchEvent(new CustomEvent('edit-mode', {
      bubbles: true,
      composed: true
    }));
  }

  private handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private handleModalClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private handleTitleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formData = { ...this.formData, title: target.value };
    if (this.touched.title) {
      this.validateField('title');
    }
  }

  private handleLongLinkChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formData = { ...this.formData, longLink: target.value };
    if (this.touched.longLink) {
      this.validateField('longLink');
    }
  }

  private handleDomainChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.formData = { ...this.formData, domain: target.value as 'hlink.ly' | 'custom.one' };
  }

  private handleCodeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formData = { ...this.formData, code: target.value };
    if (this.touched.code) {
      this.validateField('code');
    }
  }

  private handleExpiryDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formData = { ...this.formData, expiryDate: target.value };
    if (this.touched.expiryDate) {
      this.validateField('expiryDate');
    }
  }

  private handlePasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formData = { ...this.formData, password: target.value };
    if (this.touched.password) {
      this.validateField('password');
    }
  }

  private handleReset() {
    this.resetForm();
  }

  private validateField(field: keyof LinkFormData) {
    const errors: ValidationErrors = { ...this.errors };
    
    switch (field) {
      case 'title':
        if (this.formData.title && this.formData.title.length > 100) {
          errors.title = 'Title must be 100 characters or less';
        } else {
          delete errors.title;
        }
        break;
      
      case 'longLink':
        const urlPattern = /^https?:\/\/.+/;
        if (!this.formData.longLink.trim()) {
          errors.longLink = 'Long link is required';
        } else if (!urlPattern.test(this.formData.longLink)) {
          errors.longLink = 'Please enter a valid URL (must start with http:// or https://)';
        } else {
          delete errors.longLink;
        }
        break;
      
      case 'code':
        if (this.formData.code && !/^[a-zA-Z0-9-_]+$/.test(this.formData.code)) {
          errors.code = 'Code can only contain letters, numbers, hyphens, and underscores';
        } else if (this.formData.code && this.formData.code.length > 50) {
          errors.code = 'Code must be 50 characters or less';
        } else {
          delete errors.code;
        }
        break;
      
      case 'expiryDate':
        if (this.formData.expiryDate) {
          const selectedDate = new Date(this.formData.expiryDate);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (selectedDate < tomorrow) {
            errors.expiryDate = 'Expiry date must be at least tomorrow';
          } else {
            delete errors.expiryDate;
          }
        } else {
          delete errors.expiryDate;
        }
        break;
      
      case 'password':
        if (this.formData.password && this.formData.password.length < 4) {
          errors.password = 'Password must be at least 4 characters';
        } else {
          delete errors.password;
        }
        break;
    }
    
    this.errors = errors;
  }

  private validateForm(): boolean {
    const fields = ['title', 'longLink', 'code', 'expiryDate', 'password'];

    fields.forEach(field => {
      this.validateField(field as keyof LinkFormData);
    });

    return Object.keys(this.errors).length === 0;
  }

  private isValidForm(): boolean {
    // Only longLink is required
    const hasRequiredFields = this.formData.longLink.trim() !== '';
    
    // Check if longLink is a valid URL
    const urlPattern = /^https?:\/\/.+/;
    const hasValidUrl = urlPattern.test(this.formData.longLink);
    
    // No current validation errors
    const noErrors = Object.keys(this.errors).length === 0;
    
    return hasRequiredFields && hasValidUrl && noErrors;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;

    try {
      // Mark all fields as touched for validation
      this.touched = {
        title: true,
        longLink: true,
        code: true,
        expiryDate: true,
        password: true
      };

      if (!this.validateForm()) {
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dispatch submit event with form data and mode
      const eventType = this.mode === 'add' ? 'submit' : 'update';
      this.dispatchEvent(new CustomEvent(eventType, {
        detail: { ...this.formData },
        bubbles: true,
        composed: true
      }));

    } catch (error) {
      console.error('[AddLinkModal] Submit error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm() {
    this.formData = {
      title: '',
      longLink: '',
      domain: 'hlink.ly',
      code: '',
      expiryDate: '',
      password: ''
    };
    this.errors = {};
    this.touched = {};
    this.showPassword = false;
  }

  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      this.close();
    }
  };
}