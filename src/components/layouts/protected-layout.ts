import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseLayout } from './base-layout';

@customElement('protected-layout')
export class ProtectedLayout extends BaseLayout {
  static styles = [
    ...BaseLayout.styles,
    css`
      .protected-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f8fafc;
      }

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .content-area {
        flex: 1;
        padding: 0;
        overflow: hidden;
      }

      /* Future: will contain sidebar layout */
      .sidebar-container {
        display: flex;
        min-height: 100vh;
      }

      .page-content {
        flex: 1;
        overflow-y: auto;
      }

      /* Ensure slotted content takes full space */
      ::slotted(*) {
        flex: 1;
        min-height: 100%;
      }
    `
  ];

  render() {
    return html`
      <div class="layout-container protected-layout">
        ${this.renderErrorBanner()}
        
        <main class="main-content">
          <div class="content-area">
            <!-- Future: Sidebar will go here -->
            <div class="page-content">
              <slot></slot>
            </div>
          </div>
        </main>
        
        ${this.renderLoadingOverlay()}
      </div>
    `;
  }
}