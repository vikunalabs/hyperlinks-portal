import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '@/style/main.css?inline';
import '@components/layouts/protected-layout';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }

      .card {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        padding: 1.5rem;
        transition: all 0.3s;
      }

      .card:hover {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        transform: translateY(-2px);
      }

      .cta-card {
        background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
      }

      .btn-primary {
        background-color: var(--color-primary);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-primary:hover {
        background-color: var(--color-primary-dark);
        transform: translateY(-1px);
      }

      .btn-primary:active {
        transform: translateY(0);
      }

      .touch-target {
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
      }

      .touch-target:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      @media (max-width: 640px) {
        .section-padding-mobile {
          padding: 2rem 1rem;
        }
      }

      @media (max-width: 480px) {
        .section-padding-mobile {
          padding: 1.5rem 0.75rem;
        }
      }

      .chart-container {
        position: relative;
        height: 300px;
        width: 100%;
        background: #f9fafb;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .input-base {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: var(--color-text);
        background-color: white;
        transition: all 0.2s;
      }

      .input-base:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 1px var(--color-primary);
      }

      .copy-btn:hover {
        color: var(--color-primary) !important;
      }

      .table-actions button:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
      }
    `
  ];

  private getActionButtons() {
    return [
      {
        id: 'create-new',
        label: 'Create New',
        icon: 'fas fa-plus',
        primary: true,
        handler: () => console.log('Create New clicked')
      }
    ];
  }

  private renderIcon(iconClass: string) {
    const iconMap: { [key: string]: any } = {
      'fas fa-mouse-pointer': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd"/></svg>`,
      'fas fa-link': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>`,
      'fas fa-chart-line': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
      'fas fa-qrcode': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM9 4a1 1 0 000 2v5a1 1 0 001 1h5a1 1 0 100-2h-5V6a1 1 0 00-1-2zM9 13a1 1 0 100 2h2a1 1 0 100-2H9zM16 13a1 1 0 100 2h1a1 1 0 100-2h-1zM16 16a1 1 0 100 2h1a1 1 0 100-2h-1zM13 13a1 1 0 100 2h1a1 1 0 100-2h-1z" clip-rule="evenodd"/></svg>`,
      'fas fa-arrow-up': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`,
      'fas fa-arrow-down': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
      'fas fa-file-alt': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>`,
      'fas fa-download': html`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`,
      'fas fa-copy': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"/><path d="M3 5a2 2 0 012-2 3 3 0 003 3h6a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L12.414 15H17v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/></svg>`,
      'fas fa-chart-bar': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>`,
      'fas fa-edit': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>`,
      'fas fa-trash': html`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`
    };
    return iconMap[iconClass] || html`<div class="w-5 h-5 bg-gray-300 rounded"></div>`;
  }

  render() {
    return html`
      <protected-layout 
        activePage="dashboard"
        pageTitle="Dashboard Overview"
        pageDescription="Welcome back! Here's your link performance summary"
        .actionButtons=${this.getActionButtons()}
      >
        <!-- Stats Section -->
        <div class="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 section-padding-mobile">
          <!-- Total Clicks Card -->
          <div class="bg-white rounded-xl shadow p-4 md:p-6 card">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm md:text-base" style="color: var(--color-secondary);">Total Clicks</p>
                <h3 class="text-2xl md:text-3xl font-bold mt-1 md:mt-2" style="color: var(--color-text);">12,458</h3>
                <p class="text-green-500 text-xs md:text-sm mt-1" style="color: var(--color-success);">
                  ${this.renderIcon('fas fa-arrow-up')} 12.3%
                </p>
              </div>
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-primary) 20%, white);">
                <div style="color: var(--color-primary);">
                  ${this.renderIcon('fas fa-mouse-pointer')}
                </div>
              </div>
            </div>
          </div>

          <!-- Shortened URLs Card -->
          <div class="bg-white rounded-xl shadow p-4 md:p-6 card">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm md:text-base" style="color: var(--color-secondary);">Shortened URLs</p>
                <h3 class="text-2xl md:text-3xl font-bold mt-1 md:mt-2" style="color: var(--color-text);">247</h3>
                <p class="text-green-500 text-xs md:text-sm mt-1" style="color: var(--color-success);">
                  ${this.renderIcon('fas fa-arrow-up')} 8.2%
                </p>
              </div>
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-success) 20%, white);">
                <div style="color: var(--color-success);">
                  ${this.renderIcon('fas fa-link')}
                </div>
              </div>
            </div>
          </div>

          <!-- Active URLs Card -->
          <div class="bg-white rounded-xl shadow p-4 md:p-6 card">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm md:text-base" style="color: var(--color-secondary);">Active URLs</p>
                <h3 class="text-2xl md:text-3xl font-bold mt-1 md:mt-2" style="color: var(--color-text);">183</h3>
                <p class="text-red-500 text-xs md:text-sm mt-1" style="color: var(--color-error);">
                  ${this.renderIcon('fas fa-arrow-down')} 3.1%
                </p>
              </div>
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-warning) 20%, white);">
                <div style="color: var(--color-warning);">
                  ${this.renderIcon('fas fa-chart-line')}
                </div>
              </div>
            </div>
          </div>

          <!-- QR Scans Card -->
          <div class="bg-white rounded-xl shadow p-4 md:p-6 card">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm md:text-base" style="color: var(--color-secondary);">QR Scans</p>
                <h3 class="text-2xl md:text-3xl font-bold mt-1 md:mt-2" style="color: var(--color-text);">3,215</h3>
                <p class="text-green-500 text-xs md:text-sm mt-1" style="color: var(--color-success);">
                  ${this.renderIcon('fas fa-arrow-up')} 22.4%
                </p>
              </div>
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-accent) 20%, white);">
                <div style="color: var(--color-accent);">
                  ${this.renderIcon('fas fa-qrcode')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Card -->
        <div class="mx-4 md:mx-6 mb-8 rounded-xl shadow-lg overflow-hidden cta-card">
          <div class="p-6 md:p-8 text-white">
            <div class="flex flex-col md:flex-row justify-between items-center">
              <div class="mb-4 md:mb-0 md:mr-6">
                <h3 class="text-xl md:text-2xl font-bold mb-2">Upgrade to Enterprise</h3>
                <p class="opacity-90 text-sm md:text-base">Get unlimited links, advanced security, and priority support.</p>
              </div>
              <button class="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 whitespace-nowrap" style="color: var(--color-primary);">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="bg-white rounded-xl shadow p-6 mb-8 mx-4 md:mx-6">
          <h3 class="text-lg font-semibold mb-6" style="color: var(--color-text);">Quick Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button class="w-full flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-target">
              <div class="p-2 rounded-lg mb-2" style="background-color: color-mix(in srgb, var(--color-success) 20%, white); color: var(--color-success);">
                ${this.renderIcon('fas fa-link')}
              </div>
              <span class="text-xs md:text-sm text-center" style="color: var(--color-text);">Create New Link</span>
            </button>

            <button class="w-full flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-target">
              <div class="p-2 rounded-lg mb-2" style="background-color: color-mix(in srgb, var(--color-primary) 20%, white); color: var(--color-primary);">
                ${this.renderIcon('fas fa-qrcode')}
              </div>
              <span class="text-xs md:text-sm text-center" style="color: var(--color-text);">Generate QR Code</span>
            </button>

            <button class="w-full flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-target">
              <div class="p-2 rounded-lg mb-2" style="background-color: color-mix(in srgb, var(--color-accent) 20%, white); color: var(--color-accent);">
                ${this.renderIcon('fas fa-file-alt')}
              </div>
              <span class="text-xs md:text-sm text-center" style="color: var(--color-text);">Create Landing Page</span>
            </button>

            <button class="w-full flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-target">
              <div class="p-2 rounded-lg mb-2" style="background-color: color-mix(in srgb, var(--color-warning) 20%, white); color: var(--color-warning);">
                ${this.renderIcon('fas fa-download')}
              </div>
              <span class="text-xs md:text-sm text-center" style="color: var(--color-text);">Export Data</span>
            </button>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mx-4 md:mx-6">
          <!-- Clicks Chart -->
          <div class="bg-white rounded-xl shadow-sm p-6 card">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h3 class="text-lg font-semibold" style="color: var(--color-text);">Clicks Overview</h3>
              <select class="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 input-base" style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div class="chart-container">
              Chart placeholder - Clicks data visualization
            </div>
          </div>

          <!-- Top Locations -->
          <div class="bg-white rounded-xl shadow-sm p-6 card">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h3 class="text-lg font-semibold" style="color: var(--color-text);">Top Locations</h3>
              <select class="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 input-base" style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div class="chart-container">
              Chart placeholder - Location data visualization
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 section-padding-mobile">
          <!-- Recent URLs -->
          <div class="bg-white rounded-xl shadow lg:col-span-2 card">
            <div class="px-4 md:px-6 py-4 border-b flex justify-between items-center" style="border-color: var(--color-border);">
              <h3 class="text-lg md:text-xl font-bold" style="color: var(--color-text);">Recent URLs</h3>
              <button class="text-sm font-medium" style="color: var(--color-primary);">
                View All
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--color-secondary);">
                      Short URL</th>
                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--color-secondary);">
                      Clicks</th>
                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--color-secondary);">
                      Created</th>
                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--color-secondary);">
                      Status</th>
                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--color-secondary);">
                      Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y" style="divide-color: var(--color-border);">
                  <tr>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="font-medium text-sm md:text-base" style="color: var(--color-primary);">shortlypro.com/abc123</span>
                        <button class="ml-2 hover:text-primary copy-btn touch-target" style="color: var(--color-secondary);">
                          ${this.renderIcon('fas fa-copy')}
                        </button>
                      </div>
                      <div class="text-xs md:text-sm truncate max-w-xs" style="color: var(--color-secondary);">
                        https://www.example.com/very/long/url</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span class="font-medium" style="color: var(--color-text);">1,243</span>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm" style="color: var(--color-secondary);">
                      Jun 15, 2023
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-green-800" style="background-color: color-mix(in srgb, var(--color-success) 20%, white); color: var(--color-success);">
                        Active
                      </span>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex items-center table-actions">
                        <button class="touch-target p-2" style="color: var(--color-primary);">${this.renderIcon('fas fa-chart-bar')}</button>
                        <button class="touch-target p-2" style="color: var(--color-secondary);">${this.renderIcon('fas fa-edit')}</button>
                        <button class="touch-target p-2" style="color: var(--color-error);">${this.renderIcon('fas fa-trash')}</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="font-medium text-sm md:text-base" style="color: var(--color-primary);">shortlypro.com/x7f9g2</span>
                        <button class="ml-2 hover:text-primary copy-btn touch-target" style="color: var(--color-secondary);">
                          ${this.renderIcon('fas fa-copy')}
                        </button>
                      </div>
                      <div class="text-xs md:text-sm truncate max-w-xs" style="color: var(--color-secondary);">
                        https://www.another-example.com/blog</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span class="font-medium" style="color: var(--color-text);">856</span>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm" style="color: var(--color-secondary);">
                      Jun 10, 2023
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" style="background-color: color-mix(in srgb, var(--color-success) 20%, white); color: var(--color-success);">
                        Active
                      </span>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex items-center table-actions">
                        <button class="touch-target p-2" style="color: var(--color-primary);">${this.renderIcon('fas fa-chart-bar')}</button>
                        <button class="touch-target p-2" style="color: var(--color-secondary);">${this.renderIcon('fas fa-edit')}</button>
                        <button class="touch-target p-2" style="color: var(--color-error);">${this.renderIcon('fas fa-trash')}</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="font-medium text-sm md:text-base" style="color: var(--color-primary);">shortlypro.com/9k8j7h</span>
                        <button class="ml-2 hover:text-primary copy-btn touch-target" style="color: var(--color-secondary);">
                          ${this.renderIcon('fas fa-copy')}
                        </button>
                      </div>
                      <div class="text-xs md:text-sm truncate max-w-xs" style="color: var(--color-secondary);">
                        https://www.promotional-site.com/summer-sale</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span class="font-medium" style="color: var(--color-text);">2,415</span>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm" style="color: var(--color-secondary);">
                      May 28, 2023
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" style="background-color: color-mix(in srgb, var(--color-warning) 20%, white); color: var(--color-warning);">
                        Paused
                      </span>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex items-center table-actions">
                        <button class="touch-target p-2" style="color: var(--color-primary);">${this.renderIcon('fas fa-chart-bar')}</button>
                        <button class="touch-target p-2" style="color: var(--color-secondary);">${this.renderIcon('fas fa-edit')}</button>
                        <button class="touch-target p-2" style="color: var(--color-error);">${this.renderIcon('fas fa-trash')}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Performing Links -->
          <div class="bg-white rounded-xl shadow card">
            <div class="px-4 md:px-6 py-4 border-b" style="border-color: var(--color-border);">
              <h3 class="text-lg md:text-xl font-bold" style="color: var(--color-text);">Top Performing Links</h3>
            </div>
            <div class="p-4 md:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-sm md:text-base" style="color: var(--color-text);">shortlypro.com/abc123</p>
                  <p class="text-xs md:text-sm" style="color: var(--color-secondary);">1,243 clicks</p>
                </div>
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-success) 20%, white);">
                  <div style="color: var(--color-success);">
                    ${this.renderIcon('fas fa-chart-line')}
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-sm md:text-base" style="color: var(--color-text);">shortlypro.com/9k8j7h</p>
                  <p class="text-xs md:text-sm" style="color: var(--color-secondary);">2,415 clicks</p>
                </div>
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-primary) 20%, white);">
                  <div style="color: var(--color-primary);">
                    ${this.renderIcon('fas fa-chart-line')}
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-sm md:text-base" style="color: var(--color-text);">shortlypro.com/x7f9g2</p>
                  <p class="text-xs md:text-sm" style="color: var(--color-secondary);">856 clicks</p>
                </div>
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-accent) 20%, white);">
                  <div style="color: var(--color-accent);">
                    ${this.renderIcon('fas fa-chart-line')}
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-sm md:text-base" style="color: var(--color-text);">shortlypro.com/m3n4b5</p>
                  <p class="text-xs md:text-sm" style="color: var(--color-secondary);">721 clicks</p>
                </div>
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-warning) 20%, white);">
                  <div style="color: var(--color-warning);">
                    ${this.renderIcon('fas fa-chart-line')}
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-sm md:text-base" style="color: var(--color-text);">shortlypro.com/p0o9i8</p>
                  <p class="text-xs md:text-sm" style="color: var(--color-secondary);">689 clicks</p>
                </div>
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-error) 20%, white);">
                  <div style="color: var(--color-error);">
                    ${this.renderIcon('fas fa-chart-line')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </protected-layout>
    `;
  }
}