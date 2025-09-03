import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';
import { FormValidator, type ValidationResult } from '../../utils/validation';

@customElement('ui-input')
export class Input extends BaseComponent {
  @property({ type: String })
  type = 'text';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  validationType = '';

  @property({ type: String })
  compareWith = '';

  @property({ type: Boolean, attribute: 'show-password-toggle' })
  showPasswordToggle = false;

  @state()
  private showPassword = false;

  @state()
  private validationResult: ValidationResult | null = null;

  @state()
  private isDirty = false;

  static styles = [
    ...BaseComponent.styles,
    css`
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .input-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-gray-700);
        margin-bottom: 0.25rem;
      }

      .input-label.required::after {
        content: ' *';
        color: var(--color-red-500);
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
      }

      .input-field {
        width: 100%;
        padding-top: 0.75rem;
        padding-right: 1rem;
        padding-bottom: 0.75rem;
        padding-left: 1rem;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--border-radius-md);
        font-size: 1rem;
        line-height: 1.5;
        color: var(--color-gray-900);
        background-color: var(--color-white);
        transition: var(--transition-normal);
        outline: none;
        box-sizing: border-box;
        margin: 0;
      }

      /* Adjust padding for password fields with toggle button */
      .input-wrapper:has(.password-toggle) .input-field {
        padding-right: 2.5rem;
      }

      .input-field:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-alpha-20);
      }

      .input-field:disabled {
        background-color: var(--color-gray-50);
        color: var(--color-gray-500);
        cursor: not-allowed;
      }

      .input-field.error {
        border-color: var(--color-red-500);
      }

      .input-field.error:focus {
        border-color: var(--color-red-500);
        box-shadow: 0 0 0 3px var(--color-red-alpha-20);
      }

      .input-field.valid {
        border-color: var(--color-green-500);
      }

      .password-toggle {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--color-gray-400);
        border-radius: var(--border-radius-sm);
        transition: var(--transition-fast);
      }

      .password-toggle:hover {
        color: var(--color-gray-600);
        background-color: var(--color-gray-100);
      }

      .password-toggle:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .error-messages {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .error-message {
        font-size: 0.875rem;
        color: var(--color-red-600);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .success-message {
        font-size: 0.875rem;
        color: var(--color-green-600);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .validation-icon {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }

      @media (max-width: 640px) {
        .input-field {
          padding: 0.625rem 0.75rem;
          font-size: 0.9rem;
        }
      }
    `
  ];

  private handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.isDirty = true;
    this.validateInput();
    
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value: this.value, isValid: this.validationResult?.isValid ?? true },
      bubbles: true,
      composed: true
    }));
  };

  private togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  };

  private validateInput() {
    if (!this.validationType || !this.isDirty) {
      this.validationResult = null;
      return;
    }

    switch (this.validationType) {
      case 'username-email':
        this.validationResult = FormValidator.validateUsernameOrEmail(this.value);
        break;
      case 'username':
        this.validationResult = FormValidator.validateUsername(this.value);
        break;
      case 'email':
        this.validationResult = FormValidator.validateEmail(this.value);
        break;
      case 'password':
        this.validationResult = FormValidator.validatePassword(this.value);
        break;
      case 'confirm-password':
        this.validationResult = FormValidator.validateConfirmPassword(this.compareWith, this.value);
        break;
      case 'organization':
        this.validationResult = FormValidator.validateOrganization(this.value);
        break;
      default:
        this.validationResult = null;
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    
    if ((changedProperties.has('value') || changedProperties.has('compareWith')) && this.isDirty) {
      this.validateInput();
    }
  }

  getValidationResult(): ValidationResult | null {
    return this.validationResult;
  }

  isValid(): boolean {
    return this.validationResult?.isValid ?? true;
  }

  render() {
    const inputType = this.type === 'password' && this.showPasswordToggle
      ? (this.showPassword ? 'text' : 'password')
      : this.type;

    const hasError = this.validationResult && !this.validationResult.isValid;
    const isValid = this.validationResult && this.validationResult.isValid && this.isDirty;

    return html`
      <div class="input-group">
        ${this.label ? html`
          <label class="input-label ${this.required ? 'required' : ''}" for="input-field">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="input-wrapper">
          <input
            id="input-field"
            class="input-field ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}"
            type="${inputType}"
            .value="${this.value}"
            placeholder="${this.placeholder}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            @input="${this.handleInput}"
            aria-describedby="${hasError ? 'error-messages' : ''}"
            aria-invalid="${hasError ? 'true' : 'false'}"
          />
          
          ${this.showPasswordToggle && this.type === 'password' ? html`
            <button
              type="button"
              class="password-toggle"
              @click="${this.togglePasswordVisibility}"
              aria-label="${this.showPassword ? 'Hide password' : 'Show password'}"
            >
              ${this.showPassword ? html`
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ` : html`
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              `}
            </button>
          ` : ''}
        </div>

        ${hasError ? html`
          <div id="error-messages" class="error-messages" role="alert">
            ${this.validationResult!.errors.map(error => html`
              <div class="error-message">
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                ${error}
              </div>
            `)}
          </div>
        ` : isValid ? html`
          <div class="success-message">
            <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            Valid input
          </div>
        ` : ''}
      </div>
    `;
  }
}