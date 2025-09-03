import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';
import { appRouter } from '../../router';
import '../ui/button';
import '../ui/icon';

interface FeatureCard {
  icon: 'lightning' | 'database' | 'shield';
  title: string;
  description: string;
}

@customElement('home-content')
export class HomeContent extends BaseComponent {
  @property({ type: String }) title = 'Welcome to Our Platform';
  @property({ type: String }) subtitle = 'Discover the future of web development with our cutting-edge tools and technologies. Build faster, scale easier, and create amazing user experiences.';

  private features: FeatureCard[] = [
    {
      icon: 'lightning',
      title: 'Lightning Fast',
      description: 'Built with Vite for the fastest development experience and optimal production builds.'
    },
    {
      icon: 'database',
      title: 'Modern Stack',
      description: 'Utilizing the latest technologies including Lit, TypeScript, and Tailwind CSS v4.'
    },
    {
      icon: 'shield',
      title: 'Secure by Design',
      description: 'Web Components provide built-in encapsulation and security for your applications.'
    }
  ];

  static styles = [
    ...BaseComponent.styles,
    css`
      main {
        padding-top: 6rem;
        min-height: 100vh;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
      }

      .hero-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem 3rem;
      }

      .hero-section {
        text-align: center;
        padding: 2rem 0;
      }

      .hero-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
        line-height: 1.1;
      }

      .hero-subtitle {
        font-size: 1.125rem;
        color: #4b5563;
        max-width: 40rem;
        margin: 0 auto 2rem;
        line-height: 1.5;
      }

      .hero-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 2rem;
      }

      .features-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 3rem 0;
      }

      .feature-card {
        background-color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        transition: all 300ms ease;
        text-align: center;
        height: fit-content;
      }

      .feature-card:hover {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        transform: translateY(-2px);
      }

      .feature-icon {
        color: #3b82f6;
        margin-bottom: 0.75rem;
        display: flex;
        justify-content: center;
      }

      .feature-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #1f2937;
      }

      .feature-description {
        color: #4b5563;
        line-height: 1.5;
        font-size: 0.875rem;
      }

      /* Navigation section styles */
      .navigation-section {
        background-color: #f9fafb;
        padding: 2rem;
        border-radius: 0.75rem;
        margin-top: 2rem;
        text-align: center;
      }

      .navigation-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
      }

      .navigation-links {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-link {
        color: #3b82f6;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        border: 1px solid #3b82f6;
        transition: all 0.3s ease;
        background-color: white;
      }

      .nav-link:hover {
        background-color: #3b82f6;
        color: white;
        transform: translateY(-2px);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        main {
          padding-top: 5rem;
        }

        .hero-title {
          font-size: 1.75rem;
          margin-bottom: 0.75rem;
        }

        .hero-subtitle {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .hero-actions {
          margin-bottom: 1.5rem;
        }

        .features-section {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .feature-card {
          padding: 0.75rem;
        }
      }

      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        .feature-card {
          transition: none;
        }

        .feature-card:hover {
          transform: none;
        }
      }
    `
  ];

  private handleNavigation = (event: Event, path: string) => {
    event.preventDefault();
    appRouter.navigate(path);
  };

  render() {
    return html`
      <main>
        <div class="hero-container">
          <section class="hero-section">
            <h1 class="hero-title">${this.title}</h1>
            <p class="hero-subtitle">${this.subtitle}</p>
            <div class="hero-actions">
              <ui-button variant="primary" size="lg" href="#get-started">
                Get Started
              </ui-button>
              <ui-button variant="secondary" size="lg" href="#learn-more">
                Learn More
              </ui-button>
            </div>
          </section>

          <section class="features-section">
            ${this.features.map(feature => html`
              <div class="feature-card">
                <div class="feature-icon">
                  <ui-icon name="${feature.icon}" size="xl"></ui-icon>
                </div>
                <h3 class="feature-title">${feature.title}</h3>
                <p class="feature-description">${feature.description}</p>
              </div>
            `)}
          </section>

          <!-- Navigation Section for Testing Routes -->
          <section class="navigation-section">
            <h3 class="navigation-title">🧭 Test Page Navigation</h3>
            <div class="navigation-links">
              <a href="/" class="nav-link" @click="${(e: Event) => this.handleNavigation(e, '/')}">
                Home
              </a>
              <a href="/terms-of-service" class="nav-link" @click="${(e: Event) => this.handleNavigation(e, '/terms-of-service')}">
                Terms of Service
              </a>
              <a href="/privacy-policy" class="nav-link" @click="${(e: Event) => this.handleNavigation(e, '/privacy-policy')}">
                Privacy Policy
              </a>
            </div>
          </section>
        </div>
      </main>
    `;
  }
}