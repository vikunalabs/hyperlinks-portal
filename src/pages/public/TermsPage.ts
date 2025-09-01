import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('terms-page')
export class TermsPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-sticky);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-xl);
      background-color: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-md);
    }

    .navbar-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
      text-decoration: none;
    }

    .navbar-title:hover {
      color: var(--color-primary);
      transition: color var(--transition-base);
    }

    .back-btn {
      background: none;
      border: none;
      color: var(--color-primary);
      font-size: var(--font-size-md);
      cursor: pointer;
      text-decoration: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
      transition: background-color var(--transition-base);
    }

    .back-btn:hover {
      background-color: var(--bg-secondary);
    }

    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-xl);
      padding-top: 6rem;
      line-height: var(--line-height-relaxed);
    }

    h2 {
      color: var(--text-primary);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      margin: var(--space-xl) 0 var(--space-md) 0;
      border-bottom: 2px solid var(--color-primary);
      padding-bottom: var(--space-sm);
    }

    h3 {
      color: var(--text-secondary);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      margin: var(--space-lg) 0 var(--space-sm) 0;
    }

    p {
      margin-bottom: var(--space-md);
      color: var(--text-secondary);
    }

    ul {
      margin: var(--space-md) 0;
      padding-left: var(--space-xl);
    }

    li {
      margin-bottom: var(--space-sm);
      color: var(--text-secondary);
    }

    strong {
      color: var(--text-primary);
    }

    .last-updated {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      font-style: italic;
      margin-bottom: var(--space-xl);
      text-align: center;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: var(--space-md);
        padding: var(--space-md);
      }
      
      .navbar-title {
        font-size: var(--font-size-xl);
      }
      
      .content {
        padding: var(--space-md);
        padding-top: 7rem;
      }
      
      h2 {
        font-size: var(--font-size-xl);
      }
      
      h3 {
        font-size: var(--font-size-lg);
      }
    }
  `;

  render() {
    return html`
      <nav class="navbar">
        <a href="/" class="navbar-title">Hyperlinks Management Platform</a>
        <a href="/" class="back-btn">← Back to Home</a>
      </nav>
      
      <div class="content">
        <p class="last-updated">Last updated: January 1, 2024</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing and using the Hyperlinks Management Platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          The Hyperlinks Management Platform is a web-based application that allows users to organize, manage, and share hyperlinks efficiently. Our Service provides tools for:
        </p>
        <ul>
          <li>Creating and organizing collections of hyperlinks</li>
          <li>Sharing link collections with other users</li>
          <li>Searching and filtering saved links</li>
          <li>Collaborative link management</li>
        </ul>

        <h2>3. User Accounts</h2>
        <h3>3.1 Registration</h3>
        <p>
          To access certain features of our Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>
        
        <h3>3.2 Account Security</h3>
        <p>
          You are responsible for safeguarding the password and all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Upload, post, or share content that is illegal, harmful, or offensive</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the intellectual property rights of others</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Distribute spam, viruses, or other malicious content</li>
        </ul>

        <h2>5. Content and Intellectual Property</h2>
        <h3>5.1 Your Content</h3>
        <p>
          You retain ownership of any content you submit to the Service. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with the Service.
        </p>
        
        <h3>5.2 Our Content</h3>
        <p>
          The Service and its original content, features, and functionality are owned by Hyperlinks Management Platform and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>

        <h2>6. Privacy</h2>
        <p>
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
        </p>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>8. Disclaimers</h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Service or the information included on this website.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          In no event shall the Hyperlinks Management Platform, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.
        </p>

        <h2>11. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
          <br><strong>Email:</strong> legal@hyperlinksplatform.com
          <br><strong>Address:</strong> 123 Platform Street, Tech City, TC 12345
        </p>
      </div>
    `;
  }
}