import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '../style/main.css?inline';
import './common/app-navbar';
import './common/app-footer';

@customElement('privacy-page')
export class PrivacyPage extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }
      
      .prose {
        max-width: none;
      }
      
      .prose h1 {
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 2rem;
        color: #111827;
      }
      
      .prose h2 {
        font-size: 1.875rem;
        font-weight: 700;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        color: #374151;
      }
      
      .prose h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        color: #4B5563;
      }
      
      .prose p {
        margin-bottom: 1.25rem;
        line-height: 1.7;
        color: #6B7280;
      }
      
      .prose ul {
        margin-bottom: 1.25rem;
        padding-left: 1.5rem;
      }
      
      .prose li {
        margin-bottom: 0.5rem;
        color: #6B7280;
        line-height: 1.6;
      }
      
      .prose strong {
        font-weight: 600;
        color: #374151;
      }
      
      .last-updated {
        background: #F3F4F6;
        border-left: 4px solid #3B82F6;
        padding: 1rem 1.5rem;
        margin-bottom: 2rem;
        border-radius: 0.5rem;
      }
    `
  ];

  private handleBackClick = () => {
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  };

  render() {
    return html`
      <!-- Navbar -->
      <app-navbar 
        .showBackButton=${true}
        .onBackClick=${this.handleBackClick}
      ></app-navbar>
      
      <!-- Page Header -->
      <header class="bg-gray-50 border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <h1 class="text-3xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="prose">
          <div class="last-updated">
            <p class="text-sm text-gray-600 mb-0">
              <strong>Last updated:</strong> January 1, 2025
            </p>
          </div>

          <h1>Privacy Policy</h1>
          
          <p>
            This Privacy Policy describes how Hyperlinks Management Platform ("we," "us," or "our") collects, uses, and protects your personal information when you use our website, services, and applications (collectively, the "Service").
          </p>

          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Information You Provide</h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Username, email address, password, and organization details</li>
            <li><strong>Profile Information:</strong> Display name, profile picture, and preferences</li>
            <li><strong>Content:</strong> Links, bookmarks, tags, notes, and other content you create</li>
            <li><strong>Communications:</strong> Messages you send to us or other users</li>
          </ul>

          <h3>1.2 Information We Collect Automatically</h3>
          <p>When you use our Service, we automatically collect certain information:</p>
          <ul>
            <li><strong>Usage Data:</strong> How you interact with our Service, features used, and time spent</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
            <li><strong>Log Data:</strong> Server logs, error reports, and performance data</li>
            <li><strong>Cookies:</strong> Small data files stored on your device to improve functionality</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and manage your account</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Protect against fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          
          <h3>3.1 With Your Consent</h3>
          <p>
            We may share your information when you explicitly consent to such sharing, such as when you choose to make your bookmarks public or share them with specific users.
          </p>

          <h3>3.2 Service Providers</h3>
          <p>
            We work with third-party service providers who assist us in operating our Service. These providers have access to your information only to perform specific tasks and are obligated to protect your information.
          </p>

          <h3>3.3 Legal Requirements</h3>
          <p>We may disclose your information if required by law or to:</p>
          <ul>
            <li>Comply with legal processes</li>
            <li>Protect our rights and property</li>
            <li>Ensure user safety</li>
            <li>Investigate potential violations</li>
          </ul>

          <h3>3.4 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication requirements</li>
            <li>Employee training on data protection</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal purposes.
          </p>

          <h2>6. Your Rights and Choices</h2>
          
          <h3>6.1 Access and Portability</h3>
          <p>
            You can access and download your personal information through your account settings. We provide tools to export your data in common formats.
          </p>

          <h3>6.2 Correction and Updates</h3>
          <p>
            You can update your account information and preferences at any time through your account settings.
          </p>

          <h3>6.3 Deletion</h3>
          <p>
            You can delete your account and associated data at any time. Some information may be retained for legal or legitimate business purposes.
          </p>

          <h3>6.4 Cookie Preferences</h3>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may affect your ability to use certain features.
          </p>

          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete it promptly.
          </p>

          <h2>9. Third-Party Services</h2>
          <p>
            Our Service may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to those external services, and we encourage you to review their privacy policies.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@hyperlinks-platform.com</li>
            <li><strong>Address:</strong> [Your Company Address]</li>
            <li><strong>Phone:</strong> [Your Company Phone]</li>
          </ul>

          <h2>12. Regional Privacy Rights</h2>
          
          <h3>12.1 European Union (GDPR)</h3>
          <p>
            If you are in the EU, you have additional rights under the General Data Protection Regulation, including the right to object to processing and the right to lodge a complaint with supervisory authorities.
          </p>

          <h3>12.2 California (CCPA)</h3>
          <p>
            California residents have specific rights regarding their personal information, including the right to know what information we collect and the right to delete personal information.
          </p>

          <hr style="margin: 3rem 0; border: none; border-top: 1px solid #E5E7EB;" />
          
          <p class="text-sm text-gray-500">
            By using Hyperlinks Management Platform, you acknowledge that you have read and understood this Privacy Policy and agree to our collection and use of your information as described herein.
          </p>
        </div>
      </main>
      
      <!-- Footer -->
      <app-footer></app-footer>
    `;
  }
}