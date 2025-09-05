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


  render() {
    return html`
      <protected-layout activePage="dashboard">
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center container">
            <h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">Welcome to Dashboard</h1>
            <p class="text-lg mb-6" style="color: var(--color-secondary);">Select an option from the sidebar to get started</p>
            <div class="flex gap-4 justify-center">
              <button class="btn-primary">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                </svg>
                Create New Link
              </button>
              <button class="btn-secondary">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </protected-layout>
    `;
  }
}