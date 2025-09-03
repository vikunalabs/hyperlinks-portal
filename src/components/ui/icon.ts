import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';

export type IconName = 'lightning' | 'database' | 'shield' | 'twitter' | 'facebook' | 'github';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const ICONS = {
  lightning: 'M13 10V3L4 14h7v7l9-11h-7z',
  database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  shield: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  twitter: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
  facebook: 'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z',
  github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
};

@customElement('ui-icon')
export class Icon extends BaseComponent {
  @property({ type: String }) name: IconName = 'lightning';
  @property({ type: String }) size: IconSize = 'md';

  static styles = [
    ...BaseComponent.styles,
    css`
      svg {
        display: block;
        color: currentColor;
      }

      .size-sm {
        width: 1rem;
        height: 1rem;
      }

      .size-md {
        width: 1.5rem;
        height: 1.5rem;
      }

      .size-lg {
        width: 2rem;
        height: 2rem;
      }

      .size-xl {
        width: 3rem;
        height: 3rem;
      }
    `
  ];

  render() {
    const path = ICONS[this.name];
    const isStroke = ['lightning', 'database', 'shield'].includes(this.name);
    
    return html`
      <svg 
        class="size-${this.size}" 
        fill="${isStroke ? 'none' : 'currentColor'}" 
        viewBox="0 0 24 24" 
        stroke="${isStroke ? 'currentColor' : 'none'}"
      >
        <path 
          stroke-linecap="${isStroke ? 'round' : ''}"
          stroke-linejoin="${isStroke ? 'round' : ''}"
          stroke-width="${isStroke ? '2' : ''}"
          d="${path}"
        />
      </svg>
    `;
  }
}