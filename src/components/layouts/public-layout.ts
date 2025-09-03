import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseLayout } from './base-layout';
import '../layout/navbar';
import '../layout/footer';

@customElement('public-layout')
export class PublicLayout extends BaseLayout {
  static styles = [
    ...BaseLayout.styles,
    css`
      .public-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      /* Ensure content doesn't get hidden behind fixed navbar */
      ::slotted(*) {
        flex: 1;
      }
    `
  ];

  render() {
    return html`
      <div class="layout-container public-layout">
        ${this.renderErrorBanner()}
        
        <app-navbar></app-navbar>
        
        <main class="main-content">
          <slot></slot>
        </main>
        
        <app-footer></app-footer>
        
        ${this.renderLoadingOverlay()}
      </div>
    `;
  }
}