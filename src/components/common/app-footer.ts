import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '../../style/main.css?inline';

@customElement('app-footer')
export class AppFooter extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
      }
    `
  ];

  render() {
    return html`
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Company Info -->
            <div class="md:col-span-2">
              <h3 class="text-2xl font-bold mb-4">Hyperlinks Management Platform</h3>
              <div class="text-gray-400 mb-6">
                <p class="mb-2">The most intuitive way to organize, track, and share your important links.</p>
                <p>Built for individuals and teams who value efficiency and security.</p>
              </div>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                  <span class="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                  <span class="sr-only">GitHub</span>
                  🐙
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                  <span class="sr-only">LinkedIn</span>
                  💼
                </a>
              </div>
            </div>
            
            <!-- Product Links -->
            <div>
              <h4 class="text-lg font-semibold mb-4">Product</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <!-- Support Links -->
            <div>
              <h4 class="text-lg font-semibold mb-4">Support</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <!-- Bottom Bar -->
          <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
              &copy; 2025 Hyperlinks Management Platform. All rights reserved.
            </p>
            <div class="flex space-x-6 mt-4 sm:mt-0">
              <a href="/privacy.html" target="_blank" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="/terms.html" target="_blank" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}