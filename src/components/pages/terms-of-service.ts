import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';

@customElement('terms-of-service-page')
export class TermsOfServicePage extends BaseComponent {
  @property({ type: String }) title = 'Terms of Service';
  @property({ type: String }) lastUpdated = 'January 15, 2025';
  
  private handleBackClick = () => {
    // Check if opened in new tab, close it; otherwise navigate to home
    if (window.history.length > 1 && document.referrer) {
      window.close();
    } else {
      this.dispatchEvent(new CustomEvent('navigate-to-home', {
        bubbles: true,
        composed: true
      }));
    }
  };

  static styles = [
    ...BaseComponent.styles,
    css`
      main {
        padding-top: 6rem;
        min-height: 100vh;
        background-color: #f9fafb;
      }

      .content-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #e5e7eb;
      }

      .page-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
        line-height: 1.1;
      }

      .last-updated {
        color: #6b7280;
        font-size: 0.875rem;
        font-style: italic;
      }

      .content {
        background: white;
        border-radius: 0.75rem;
        padding: 2.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        line-height: 1.7;
      }

      .section {
        margin-bottom: 2.5rem;
      }

      .section:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
      }

      .section-content {
        color: #4b5563;
        margin-bottom: 1rem;
      }

      .section-content:last-child {
        margin-bottom: 0;
      }

      .subsection {
        margin: 1.5rem 0;
        padding-left: 1.5rem;
      }

      .subsection-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.75rem;
      }

      .list {
        padding-left: 1.5rem;
        margin: 1rem 0;
      }

      .list li {
        margin-bottom: 0.5rem;
        color: #4b5563;
      }

      .highlight {
        background-color: #fef3c7;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #f59e0b;
        margin: 1.5rem 0;
      }

      .contact-info {
        background-color: #f0f9ff;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #3b82f6;
        margin-top: 2rem;
      }

      .contact-info h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.75rem;
      }

      .contact-info p {
        color: #4b5563;
        margin-bottom: 0.5rem;
      }

      .contact-info a {
        color: #3b82f6;
        text-decoration: none;
        font-weight: 500;
      }

      .contact-info a:hover {
        color: #2563eb;
        text-decoration: underline;
      }
      
      .back-button {
        background: none;
        border: none;
        color: #3b82f6;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        padding: 0.5rem 0;
        margin-bottom: 1rem;
        transition: color 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .back-button:hover {
        color: #2563eb;
        text-decoration: underline;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        main {
          padding-top: 5rem;
        }

        .content-container {
          padding: 1.5rem 1rem 3rem;
        }

        .page-title {
          font-size: 2rem;
        }

        .content {
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
        }

        .subsection {
          padding-left: 1rem;
        }
      }
    `
  ];

  render() {
    return html`
      <main>
        <div class="content-container">
          <div class="header">
            <button class="back-button" @click=${this.handleBackClick} aria-label="Go back or close tab">
              ← Back
            </button>
            <h1 class="page-title">${this.title}</h1>
            <p class="last-updated">Last updated: ${this.lastUpdated}</p>
          </div>

          <div class="content">
            <div class="section">
              <h2 class="section-title">1. Acceptance of Terms</h2>
              <div class="section-content">
                <p>By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </div>
              <div class="highlight">
                <strong>Important:</strong> These terms constitute a legally binding agreement between you and our company. Please read them carefully.
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">2. Use License</h2>
              <div class="section-content">
                <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul class="list">
                  <li>modify or copy the materials;</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial);</li>
                  <li>attempt to decompile or reverse engineer any software contained on our website;</li>
                  <li>remove any copyright or other proprietary notations from the materials.</li>
                </ul>
                <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">3. User Accounts</h2>
              <div class="section-content">
                <p>To access certain features of our service, you may be required to create an account. You agree to:</p>
                <ul class="list">
                  <li>Provide accurate, complete, and current information during the registration process</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Accept all risks of unauthorized access to your account and the information you provide to us</li>
                  <li>Notify us immediately of any breach of security or unauthorized use of your account</li>
                </ul>
              </div>
              <div class="subsection">
                <h3 class="subsection-title">Account Responsibilities</h3>
                <p>You are responsible for all activities that occur under your account, whether or not you have knowledge of or control over such activities.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">4. Privacy and Data Protection</h2>
              <div class="section-content">
                <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.</p>
                <ul class="list">
                  <li>We collect information you provide directly to us</li>
                  <li>We may collect information automatically as you use our services</li>
                  <li>We use this information to provide, maintain, and improve our services</li>
                  <li>We implement appropriate security measures to protect your information</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">5. Prohibited Uses</h2>
              <div class="section-content">
                <p>You may not use our service:</p>
                <ul class="list">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">6. Service Availability</h2>
              <div class="section-content">
                <p>We strive to maintain continuous service availability, but we cannot guarantee uninterrupted access to our services. We reserve the right to:</p>
                <ul class="list">
                  <li>Modify or discontinue any part of our service with or without notice</li>
                  <li>Suspend or terminate your access to our service for any reason</li>
                  <li>Perform scheduled maintenance that may temporarily affect service availability</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">7. Limitation of Liability</h2>
              <div class="section-content">
                <p>In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, special, or consequential damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
              </div>
              <div class="highlight">
                <strong>Note:</strong> Some jurisdictions do not allow the exclusion of certain warranties or the exclusion or limitation of liability for consequential or incidental damages, so the limitations above may not apply to you.
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">8. Governing Law</h2>
              <div class="section-content">
                <p>These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">9. Changes to Terms</h2>
              <div class="section-content">
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
                <p>What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.</p>
              </div>
            </div>

            <div class="contact-info">
              <h3>Contact Information</h3>
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <p>Email: <a href="mailto:legal@yourcompany.com">legal@yourcompany.com</a></p>
              <p>Address: [Your Company Address]</p>
              <p>Phone: [Your Company Phone]</p>
            </div>
          </div>
        </div>
      </main>
    `;
  }
}