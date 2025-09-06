import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';

@customElement('protected-footer')
export class ProtectedFooter extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
      }

      .touch-target {
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
      }

      .footer-link:hover {
        color: var(--color-primary);
      }
    `
  ];

  render() {
    return html`
      <footer class="bg-gray-900 text-white py-6 px-4 md:px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm mb-4 md:mb-0 text-gray-400">
            © 2025 ZLinkly. All rights reserved.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-sm footer-link touch-target transition-colors text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" class="text-sm footer-link touch-target transition-colors text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" class="text-sm footer-link touch-target transition-colors text-gray-400 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    `;
  }
}