import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('profile-page')
export class ProfilePage extends LitElement {
  static styles = css`
    .page-header {
      margin-bottom: var(--space-2xl);
    }

    .page-title-main {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-md) 0;
    }

    .page-subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin: 0;
    }

    .profile-content {
      display: grid;
      gap: var(--space-xl);
    }

    .profile-card {
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
    }

    .card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-lg) 0;
    }

    .placeholder-text {
      color: var(--text-secondary);
      font-style: italic;
      text-align: center;
      padding: var(--space-2xl);
    }
  `;

  render() {
    return html`
      <protected-page-layout activeRoute="/profile">
        <div class="page-header">
          <h1 class="page-title-main">Profile</h1>
          <p class="page-subtitle">Manage your account settings and preferences</p>
        </div>

        <div class="profile-content">
          <div class="profile-card">
            <h2 class="card-title">Personal Information</h2>
            <div class="placeholder-text">
              Profile settings will be implemented here
            </div>
          </div>

          <div class="profile-card">
            <h2 class="card-title">Account Settings</h2>
            <div class="placeholder-text">
              Account configuration options will be added here
            </div>
          </div>

          <div class="profile-card">
            <h2 class="card-title">Security</h2>
            <div class="placeholder-text">
              Security settings and options will be available here
            </div>
          </div>
        </div>
      </protected-page-layout>
    `;
  }
}