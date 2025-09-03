import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';

@customElement('ui-checkbox')
export class Checkbox extends BaseComponent {
  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  value = '';

  static styles = [
    ...BaseComponent.styles,
    css`
      .checkbox-container {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        line-height: 1.5;
      }

      .checkbox-container:has(input:disabled) {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .checkbox-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .checkbox-input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        margin: 0;
      }

      .checkbox-input:disabled {
        cursor: not-allowed;
      }

      .checkbox-box {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid var(--color-gray-300);
        border-radius: var(--border-radius-sm);
        background-color: var(--color-white);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-fast);
        flex-shrink: 0;
      }

      .checkbox-input:checked + .checkbox-box {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .checkbox-input:focus + .checkbox-box {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .checkbox-input:hover:not(:disabled) + .checkbox-box {
        border-color: var(--color-primary-light);
      }

      .checkbox-input:disabled + .checkbox-box {
        background-color: var(--color-gray-100);
        border-color: var(--color-gray-200);
      }

      .checkbox-icon {
        width: 0.875rem;
        height: 0.875rem;
        color: white;
        opacity: 0;
        transform: scale(0.8);
        transition: var(--transition-fast);
      }

      .checkbox-input:checked + .checkbox-box .checkbox-icon {
        opacity: 1;
        transform: scale(1);
      }

      .checkbox-label {
        font-size: 0.875rem;
        color: var(--color-gray-700);
        cursor: pointer;
      }

      .checkbox-input:disabled + .checkbox-box + .checkbox-label {
        color: var(--color-gray-400);
        cursor: not-allowed;
      }

      @media (max-width: 640px) {
        .checkbox-box {
          width: 1.125rem;
          height: 1.125rem;
        }
        
        .checkbox-icon {
          width: 0.75rem;
          height: 0.75rem;
        }
        
        .checkbox-label {
          font-size: 0.8125rem;
        }
      }
    `
  ];

  private handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    
    this.dispatchEvent(new CustomEvent('checkbox-change', {
      detail: { checked: this.checked, value: this.value },
      bubbles: true,
      composed: true
    }));
  };

  render() {
    return html`
      <label class="checkbox-container">
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            class="checkbox-input"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            value="${this.value}"
            @change="${this.handleChange}"
            aria-describedby="${this.label ? 'checkbox-label' : ''}"
          />
          <div class="checkbox-box">
            <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
        </div>
        ${this.label ? html`
          <span id="checkbox-label" class="checkbox-label">${this.label}</span>
        ` : ''}
      </label>
    `;
  }
}