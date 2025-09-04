import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import tailwindStyles from '../style/main.css?inline';

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = [
    css`${unsafeCSS(tailwindStyles)}`,
    css`
      :host {
        display: block;
        min-height: 100vh;
      }
    `
  ];

  render() {
    return html`
      <!-- Navbar -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="container">
          <div class="flex justify-between items-center h-16">
            <!-- Logo/Title -->
            <div class="flex-shrink-0">
              <h1 class="text-xl font-semibold text-gray-900">
                Hyperlinks Management Platform
              </h1>
            </div>
            
            <!-- Auth Buttons -->
            <div class="flex space-x-4">
              <button class="btn-secondary text-sm">
                Login
              </button>
              <button class="btn-primary text-sm">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h2 class="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Welcome to<br>
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Hyperlinks Management
              </span><br>
              <span class="text-gray-700">Platform</span>
            </h2>
            <p class="text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Organize, manage, and share your important links with ease.
            </p>
            <p class="text-xl text-gray-500 max-w-5xl mx-auto mb-12">
              Get started today and take control of your digital bookmarks.
            </p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                Get Started Free
              </button>
              <button class="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-10 py-4 rounded-xl text-lg border-2 border-blue-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                Learn More
              </button>
            </div>
            <!-- Feature highlights -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div class="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg">
                <div class="text-4xl mb-4">🔗</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Organization</h3>
                <p class="text-gray-600">Organize links with tags, folders, and smart categorization</p>
              </div>
              <div class="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg">
                <div class="text-4xl mb-4">📊</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
                <p class="text-gray-600">Track usage patterns with detailed insights</p>
              </div>
              <div class="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg">
                <div class="text-4xl mb-4">🔒</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
                <p class="text-gray-600">Enterprise-level security and team permissions</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
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
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}