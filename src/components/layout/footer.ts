import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';
import '../ui/icon';

interface SocialLink {
  name: string;
  href: string;
  icon: 'twitter' | 'facebook' | 'github';
}

@customElement('app-footer')
export class Footer extends BaseComponent {
  @property({ type: String }) brandName = 'YourBrand';
  @property({ type: String }) tagline = 'Building amazing web experiences';
  @property({ type: Number }) copyrightYear = new Date().getFullYear();

  private socialLinks: SocialLink[] = [
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { name: 'GitHub', href: 'https://github.com', icon: 'github' }
  ];

  static styles = [
    ...BaseComponent.styles,
    css`
      footer {
        background-color: var(--color-gray-800);
        color: white;
        padding: var(--spacing-8) 0;
      }

      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-4);
      }

      .footer-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-4);
      }

      .brand-section {
        text-align: center;
      }

      .brand-name {
        font-size: var(--font-size-xl);
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .brand-tagline {
        color: var(--color-gray-400);
        font-size: var(--font-size-base);
      }

      .social-links {
        display: flex;
        gap: var(--spacing-4);
      }

      .social-link {
        color: var(--color-gray-400);
        transition: var(--transition-normal);
        padding: var(--spacing-2);
        border-radius: var(--border-radius-md);
        text-decoration: none;
      }

      .social-link:hover {
        color: white;
        background-color: rgba(255, 255, 255, 0.1);
      }

      .copyright {
        text-align: center;
        margin-top: var(--spacing-8);
        padding-top: var(--spacing-4);
        border-top: 1px solid var(--color-gray-600);
        color: var(--color-gray-400);
        font-size: var(--font-size-sm);
        width: 100%;
      }

      @media (min-width: 768px) {
        .footer-content {
          flex-direction: row;
        }

        .brand-section {
          text-align: left;
        }
      }
    `
  ];

  render() {
    return html`
      <footer>
        <div class="footer-container">
          <div class="footer-content">
            <div class="brand-section">
              <h3 class="brand-name">${this.brandName}</h3>
              <p class="brand-tagline">${this.tagline}</p>
            </div>
            <div class="social-links">
              ${this.socialLinks.map(link => html`
                <a 
                  href="${link.href}" 
                  class="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${link.name}"
                >
                  <ui-icon name="${link.icon}" size="md"></ui-icon>
                </a>
              `)}
            </div>
          </div>
          <div class="copyright">
            <p>&copy; ${this.copyrightYear} ${this.brandName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}