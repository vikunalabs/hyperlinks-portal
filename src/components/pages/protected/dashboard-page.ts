import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';
import '@components/layouts/protected-layout';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }
    `
  ];

  private getActionButtons() {
    return [
      {
        id: 'create-new',
        label: 'Create New',
        icon: 'fas fa-plus',
        primary: true,
        handler: () => console.log('Create New clicked')
      }
    ];
  }

  render() {
    return html`
      <protected-layout 
        activePage="dashboard"
        pageTitle="Dashboard Overview"
        pageDescription="Welcome back! Here's your link performance summary"
        .actionButtons=${this.getActionButtons()}
      >
        <div class="p-6">
          <div class="text-center container">
            <h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">Dashboard Content</h1>
            <p style="color: var(--color-secondary);">Your dashboard content goes here. The page header is now consistent across all pages.</p>
          </div>
        </div>
      </protected-layout>
    `;
  }
}