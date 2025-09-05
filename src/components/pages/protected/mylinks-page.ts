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


  render() {
    return html`
      <protected-layout activePage="links">
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center container">
            <h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">MyLinks</h1>
          </div>
        </div>
      </protected-layout>
    `;
  }
}