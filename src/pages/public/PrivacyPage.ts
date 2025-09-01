import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('privacy-page')
export class PrivacyPage extends LitElement {
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

        <h2>1. Information We Collect</h2>
        <h3>1.1 Personal Information</h3>
        <p>
          When you create an account with the Hyperlinks Management Platform, we collect information such as:
        </p>
        <ul>
          <li>Username and email address</li>
          <li>Organization name (if provided)</li>
          <li>Password (encrypted and stored securely)</li>
          <li>Profile information you choose to provide</li>
        </ul>

        <h3>1.2 Usage Data</h3>
        <p>
          We automatically collect certain information when you use our Service, including:
        </p>
        <ul>
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on our Service</li>
          <li>Links created, organized, and accessed</li>
          <li>Usage patterns and preferences</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To authenticate users and prevent unauthorized access</li>
          <li>To personalize your experience and improve our Service</li>
          <li>To communicate with you about updates, security alerts, and support</li>
          <li>To analyze usage patterns and optimize performance</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Information Sharing and Disclosure</h2>
        <h3>3.1 We Do Not Sell Personal Information</h3>
        <p>
          We do not sell, trade, or rent your personal information to third parties for marketing purposes.
        </p>

        <h3>3.2 When We May Share Information</h3>
        <p>We may share your information in the following situations:</p>
        <ul>
          <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
          <li><strong>Service providers:</strong> With trusted third parties who assist in operating our Service</li>
          <li><strong>Legal requirements:</strong> To comply with applicable laws, regulations, or court orders</li>
          <li><strong>Safety and security:</strong> To protect the rights and safety of our users and the public</li>
        </ul>

        <h2>4. Data Storage and Security</h2>
        <h3>4.1 Security Measures</h3>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information, including:
        </p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security audits and monitoring</li>
          <li>Access controls and authentication requirements</li>
          <li>Secure data centers with physical security measures</li>
        </ul>

        <h3>4.2 Data Retention</h3>
        <p>
          We retain your personal information only as long as necessary to provide our Service and comply with legal obligations. You may request deletion of your account and associated data at any time.
        </p>

        <h2>5. Your Privacy Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> Request access to your personal information</li>
          <li><strong>Correction:</strong> Request correction of inaccurate data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
          <li><strong>Objection:</strong> Object to certain processing of your information</li>
        </ul>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your experience on our Service. These technologies help us:
        </p>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Analyze how our Service is used</li>
          <li>Provide personalized content and features</li>
          <li>Ensure security and prevent fraud</li>
        </ul>
        <p>
          You can control cookie settings through your browser preferences, though disabling cookies may affect some functionality.
        </p>

        <h2>7. Third-Party Services</h2>
        <p>
          Our Service may integrate with third-party services (such as Google OAuth for authentication). These services have their own privacy policies, and we encourage you to review them.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          <br><strong>Email:</strong> privacy@hyperlinksplatform.com
          <br><strong>Address:</strong> 123 Platform Street, Tech City, TC 12345
          <br><strong>Data Protection Officer:</strong> dpo@hyperlinksplatform.com
        </p>
      </div>
    `;
  }
}