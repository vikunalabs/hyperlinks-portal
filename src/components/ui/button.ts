import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('ui-button')
export class Button extends BaseComponent {
  @property({ type: String }) variant: ButtonVariant = 'primary';
  @property({ type: String }) size: ButtonSize = 'md';
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) href?: string;
  @property({ type: String }) target?: string;

  static styles = [
    ...BaseComponent.styles,
    css`
      :host {
        display: inline-block;
      }

      button, a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        text-decoration: none;
        border-radius: var(--border-radius-md);
        transition: var(--transition-normal);
        cursor: pointer;
        border: none;
        font-family: inherit;
      }

      button:disabled, a.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Size variants */
      .size-sm {
        padding: var(--spacing-2) var(--spacing-3);
        font-size: var(--font-size-sm);
      }

      .size-md {
        padding: var(--spacing-3) var(--spacing-6);
        font-size: var(--font-size-base);
      }

      .size-lg {
        padding: var(--spacing-4) var(--spacing-8);
        font-size: var(--font-size-lg);
      }

      /* Style variants */
      .variant-primary {
        background-color: var(--color-primary);
        color: white;
      }

      .variant-primary:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
      }

      .variant-secondary {
        background-color: transparent;
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
      }

      .variant-secondary:hover:not(:disabled) {
        background-color: var(--color-primary-light);
      }

      .variant-ghost {
        background-color: transparent;
        color: var(--color-gray-600);
      }

      .variant-ghost:hover:not(:disabled) {
        background-color: var(--color-gray-100);
      }
    `
  ];

  private _handleClick = (e: Event) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  render() {
    const classes = `size-${this.size} variant-${this.variant} ${this.disabled ? 'disabled' : ''}`;
    
    if (this.href) {
      return html`
        <a 
          href="${this.href}"
          target="${this.target || nothing}"
          class="${classes}"
          @click="${this._handleClick}"
        >
          <slot></slot>
        </a>
      `;
    }

    return html`
      <button 
        class="${classes}"
        ?disabled="${this.disabled}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }
}