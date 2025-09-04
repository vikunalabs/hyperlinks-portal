import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '../style/main.css?inline';
import './common/app-navbar';
import './common/app-footer';

@customElement('terms-page')
export class TermsPage extends LitElement {
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
              Terms of Service
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

          <h1>Terms of Service</h1>
          
          <p>
            Welcome to Hyperlinks Management Platform. These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Service") operated by Hyperlinks Management Platform ("we," "us," or "our").
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Hyperlinks Management Platform is a web-based service that allows users to organize, manage, and share their bookmarks and hyperlinks. Our Service includes:
          </p>
          <ul>
            <li>Link organization and categorization tools</li>
            <li>Sharing and collaboration features</li>
            <li>Analytics and usage tracking</li>
            <li>Team management capabilities</li>
            <li>API access for developers</li>
          </ul>

          <h2>3. User Accounts</h2>
          <h3>3.1 Account Creation</h3>
          <p>
            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
          </p>
          
          <h3>3.2 Account Security</h3>
          <p>
            You are responsible for maintaining the security of your account and password. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code or harmful content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Spam or harass other users</li>
            <li>Use the Service for any commercial purposes without permission</li>
          </ul>

          <h2>5. Content and Data</h2>
          <h3>5.1 Your Content</h3>
          <p>
            You retain ownership of all content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute it in any media.
          </p>
          
          <h3>5.2 Data Privacy</h3>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </p>

          <h2>6. Subscription and Payment</h2>
          <h3>6.1 Free and Paid Services</h3>
          <p>
            We offer both free and paid subscription plans. Paid subscriptions provide additional features and capabilities.
          </p>
          
          <h3>6.2 Billing</h3>
          <p>
            For paid subscriptions, you agree to pay all fees associated with your account. Fees are charged in advance on a recurring basis and are non-refundable except as required by law.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties.
          </p>

          <h2>8. Disclaimers</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall Hyperlinks Management Platform be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Hyperlinks Management Platform from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is incorporated, without regard to conflict of law provisions.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> legal@hyperlinks-platform.com</li>
            <li><strong>Address:</strong> [Your Company Address]</li>
            <li><strong>Phone:</strong> [Your Company Phone]</li>
          </ul>

          <hr style="margin: 3rem 0; border: none; border-top: 1px solid #E5E7EB;" />
          
          <p class="text-sm text-gray-500">
            By using Hyperlinks Management Platform, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
          </p>
        </div>
      </main>
      
      <!-- Footer -->
      <app-footer></app-footer>
    `;
  }
}