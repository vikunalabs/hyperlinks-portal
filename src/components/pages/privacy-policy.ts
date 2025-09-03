import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../shared/base-component';

@customElement('privacy-policy-page')
export class PrivacyPolicyPage extends BaseComponent {
  @property({ type: String }) title = 'Privacy Policy';
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
        border-left: 4px solid #10b981;
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
        background-color: #ecfdf5;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #10b981;
        margin: 1.5rem 0;
      }

      .warning {
        background-color: #fef2f2;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ef4444;
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

      .data-table {
        border-collapse: collapse;
        width: 100%;
        margin: 1.5rem 0;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .data-table th {
        background-color: #f9fafb;
        padding: 0.75rem;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
      }

      .data-table td {
        padding: 0.75rem;
        border-bottom: 1px solid #f3f4f6;
        color: #4b5563;
      }

      .data-table tr:last-child td {
        border-bottom: none;
      }
      
      .back-button {
        background: none;
        border: none;
        color: #10b981;
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
        color: #059669;
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

        .data-table {
          font-size: 0.875rem;
        }

        .data-table th,
        .data-table td {
          padding: 0.5rem;
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
              <h2 class="section-title">1. Introduction</h2>
              <div class="section-content">
                <p>This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services. We are committed to ensuring that your privacy is protected and that any information you provide is handled in accordance with this privacy policy.</p>
              </div>
              <div class="highlight">
                <strong>Your Privacy Matters:</strong> We believe in transparency about how we collect, use, and share your information. This policy is designed to help you understand your privacy rights and choices.
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">2. Information We Collect</h2>
              <div class="section-content">
                <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
              </div>
              
              <div class="subsection">
                <h3 class="subsection-title">Personal Information</h3>
                <p>This includes information that can be used to identify you:</p>
                <ul class="list">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Communications with us (support requests, feedback)</li>
                </ul>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">Automatically Collected Information</h3>
                <p>We may automatically collect certain information about your use of our services:</p>
                <ul class="list">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, click patterns)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location information (if you consent to location services)</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">3. How We Use Your Information</h2>
              <div class="section-content">
                <p>We use the collected information for various purposes:</p>
              </div>

              <table class="data-table">
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Description</th>
                    <th>Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Service Provision</td>
                    <td>To provide, maintain, and improve our services</td>
                    <td>Contract Performance</td>
                  </tr>
                  <tr>
                    <td>User Support</td>
                    <td>To respond to your requests and provide customer support</td>
                    <td>Contract Performance</td>
                  </tr>
                  <tr>
                    <td>Communication</td>
                    <td>To send you updates, security alerts, and administrative messages</td>
                    <td>Legitimate Interest</td>
                  </tr>
                  <tr>
                    <td>Analytics</td>
                    <td>To understand how users interact with our services</td>
                    <td>Legitimate Interest</td>
                  </tr>
                  <tr>
                    <td>Security</td>
                    <td>To protect against fraud, abuse, and security threats</td>
                    <td>Legitimate Interest</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2 class="section-title">4. Information Sharing and Disclosure</h2>
              <div class="section-content">
                <p>We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul class="list">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who help us operate our services</li>
                  <li><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you have given us explicit consent to share your information</li>
                  <li><strong>Safety:</strong> To protect the rights, property, or safety of our users or the public</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">5. Data Security</h2>
              <div class="section-content">
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>
              
              <div class="subsection">
                <h3 class="subsection-title">Security Measures</h3>
                <ul class="list">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>

              <div class="warning">
                <strong>Important:</strong> While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">6. Your Privacy Rights</h2>
              <div class="section-content">
                <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">General Rights</h3>
                <ul class="list">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your information in a structured format</li>
                  <li><strong>Objection:</strong> Object to the processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                </ul>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">How to Exercise Your Rights</h3>
                <p>To exercise any of these rights, please contact us using the information provided at the end of this policy. We will respond to your request within a reasonable timeframe and in accordance with applicable law.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">7. Cookies and Tracking Technologies</h2>
              <div class="section-content">
                <p>We use cookies and similar tracking technologies to collect information about your browsing activities and to provide personalized experiences.</p>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">Types of Cookies We Use</h3>
                <ul class="list">
                  <li><strong>Essential Cookies:</strong> Necessary for basic website functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
                </ul>
                <p>You can control cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of our services.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">8. Data Retention</h2>
              <div class="section-content">
                <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.</p>
                <ul class="list">
                  <li>Account information: Until you delete your account or request deletion</li>
                  <li>Usage data: Typically retained for 2-3 years for analytics purposes</li>
                  <li>Support communications: Retained for 3 years for customer service purposes</li>
                  <li>Legal compliance: As required by applicable laws and regulations</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">9. International Data Transfers</h2>
              <div class="section-content">
                <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">10. Children's Privacy</h2>
              <div class="section-content">
                <p>Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">11. Changes to This Privacy Policy</h2>
              <div class="section-content">
                <p>We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last updated" date.</p>
                <p>We encourage you to review this privacy policy periodically to stay informed about how we protect your information.</p>
              </div>
            </div>

            <div class="contact-info">
              <h3>Contact Us</h3>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <p>Email: <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a></p>
              <p>Address: [Your Company Address]</p>
              <p>Phone: [Your Company Phone]</p>
              <p>Data Protection Officer: <a href="mailto:dpo@yourcompany.com">dpo@yourcompany.com</a></p>
            </div>
          </div>
        </div>
      </main>
    `;
  }
}