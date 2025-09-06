import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';
import '@components/layouts/protected-layout';

@customElement('mylinks-page')
export class MyLinksPage extends LitElement {
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
        id: 'create-link',
        label: 'Create Link',
        icon: 'fas fa-plus',
        primary: true,
        handler: () => console.log('Create Link clicked')
      },
      {
        id: 'import',
        label: 'Import',
        icon: 'fas fa-upload',
        primary: false,
        handler: () => console.log('Import clicked')
      }
    ];
  }

  render() {
    return html`
      <protected-layout 
        activePage="links"
        pageTitle="My URLs"
        pageDescription="Manage and track all your shortened links"
        .actionButtons=${this.getActionButtons()}
        searchPlaceholder="Search links..."
      >
        <div class="p-6">
          <div class="text-center container">
            <h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">My Links Content</h1>
            <p style="color: var(--color-secondary);">Your links management interface goes here.</p>
          </div>
        </div>
      </protected-layout>
    `;
  }
}