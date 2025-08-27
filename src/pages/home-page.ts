import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { useUrlStore } from '../stores/url-store';
import { router } from '../router';

@customElement('home-page')
export class HomePage extends LitElement {
  @state()
  private isShortening = false;

  @state()
  private shortenedUrl: string | null = null;

  @state()
  private error: string | null = null;

  private urlStore = useUrlStore;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, var(--primary, #007bff) 0%, var(--primary-dark, #0056b3) 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin: 0 0 2rem 0;
    }

    .url-shortener-section {
      padding: 3rem 2rem;
      background: var(--bg-secondary, #f8f9fa);
    }

    .shortener-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .shortener-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .url-input-group {
      display: flex;
      gap: 0.75rem;
    }

    .url-input {
      flex: 1;
    }

    .features-section {
      padding: 4rem 2rem;
      background: white;
    }

    .features-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .features-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 600;
      margin: 0 0 3rem 0;
      color: var(--text-primary, #1a1a1a);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .url-input-group {
        flex-direction: column;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  private async handleShortenUrl(event: Event) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const originalUrl = formData.get('url') as string;

    if (!originalUrl) {
      this.error = 'Please enter a URL to shorten';
      return;
    }

    this.isShortening = true;
    this.error = null;
    this.shortenedUrl = null;

    try {
      const result = await this.urlStore.getState().createUrl({
        originalUrl,
        title: formData.get('title') as string || undefined,
        customSlug: formData.get('customSlug') as string || undefined
      });

      if (result) {
        this.shortenedUrl = result.shortUrl;
        form.reset();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to shorten URL';
    } finally {
      this.isShortening = false;
    }
  }

  private handleGetStarted() {
    router.navigate('/register');
  }

  private handleSignIn() {
    router.navigate('/login');
  }

  private copyToClipboard(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      // Could show a toast notification here using your UI library
      console.log('URL copied to clipboard');
    });
  }

  render() {
    return html`
      <div>
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">Shorten Your Links, Amplify Your Reach</h1>
            <p class="hero-subtitle">
              Create short, memorable links with powerful analytics and custom branding. 
              Track clicks, manage campaigns, and optimize your online presence.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <ui-button variant="secondary" size="large" @click=${this.handleGetStarted}>
                Get Started Free
              </ui-button>
              <ui-button variant="outline" size="large" @click=${this.handleSignIn}>
                Sign In
              </ui-button>
            </div>
          </div>
        </section>

        <!-- URL Shortener Section -->
        <section class="url-shortener-section">
          <div class="shortener-container">
            <h2 style="text-align: center; margin-bottom: 2rem; color: var(--text-primary);">
              Try it now - No signup required
            </h2>
            
            <form class="shortener-form" @submit=${this.handleShortenUrl}>
              <div class="url-input-group">
                <ui-input
                  class="url-input"
                  name="url"
                  placeholder="Enter your long URL here..."
                  type="url"
                  required
                ></ui-input>
                <ui-button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  ?loading=${this.isShortening}
                >
                  Shorten
                </ui-button>
              </div>
              
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <ui-input
                  name="customSlug"
                  placeholder="Custom slug (optional)"
                  style="flex: 1; min-width: 200px;"
                ></ui-input>
                <ui-input
                  name="title"
                  placeholder="Title (optional)"
                  style="flex: 1; min-width: 200px;"
                ></ui-input>
              </div>
            </form>

            ${this.error ? html`
              <ui-alert variant="error">
                ${this.error}
              </ui-alert>
            ` : ''}

            ${this.shortenedUrl ? html`
              <ui-card>
                <div slot="content">
                  <h4 style="margin: 0 0 1rem 0; color: var(--success);">URL Shortened Successfully!</h4>
                  <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-light); border-radius: 6px;">
                    <ui-input
                      .value=${this.shortenedUrl}
                      readonly
                      style="flex: 1;"
                    ></ui-input>
                    <ui-button
                      variant="outline"
                      size="small"
                      @click=${() => this.copyToClipboard(this.shortenedUrl!)}
                    >
                      Copy
                    </ui-button>
                  </div>
                  <p style="margin: 1rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">
                    Want analytics and custom domains? <a href="/register" style="color: var(--primary);">Create a free account</a>
                  </p>
                </div>
              </ui-card>
            ` : ''}
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
          <div class="features-container">
            <h2 class="features-title">Everything You Need to Succeed</h2>
            <div class="features-grid">
              <feature-card
                icon="📊"
                title="Powerful Analytics"
                description="Track clicks, locations, devices, and referrers with detailed insights and real-time data."
              ></feature-card>
              
              <feature-card
                icon="🎨"
                title="Custom Branding"
                description="Use your own domain and create branded short links that build trust with your audience."
              ></feature-card>
              
              <feature-card
                icon="🔗"
                title="Bulk Management"
                description="Create, update, and manage hundreds of links at once with our powerful bulk operations."
              ></feature-card>
              
              <feature-card
                icon="📱"
                title="QR Codes"
                description="Generate QR codes for your short links and bridge the gap between offline and online."
              ></feature-card>
              
              <feature-card
                icon="🔒"
                title="Password Protection"
                description="Secure your links with passwords and control access to your valuable content."
              ></feature-card>
              
              <feature-card
                icon="⏰"
                title="Link Expiration"
                description="Set expiration dates for time-sensitive campaigns and automatically disable old links."
              ></feature-card>
            </div>
          </div>
        </section>
      </div>
    `;
  }
}