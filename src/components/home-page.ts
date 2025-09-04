import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import tailwindStyles from '../style/main.css?inline';
import './common/app-navbar';
import './common/app-footer';
import './modals/login-modal';
import './modals/register-modal';
import './modals/forgot-password-modal';
import './modals/password-reset-confirmation-modal';
import type { NavbarButton } from './common/app-navbar';

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

  private loginModalRef = createRef<any>();
  private registerModalRef = createRef<any>();
  private forgotPasswordModalRef = createRef<any>();
  private passwordResetConfirmationModalRef = createRef<any>();

  private handleLoginClick = () => {
    console.log('Login button clicked');
    console.log('Modal ref:', this.loginModalRef.value);
    if (this.loginModalRef.value) {
      console.log('Opening modal...');
      this.loginModalRef.value.open();
    } else {
      console.log('Modal ref is null');
    }
  };

  private handleRegisterClick = () => {
    console.log('Register button clicked');
    if (this.registerModalRef.value) {
      this.registerModalRef.value.open();
    }
  };

  private handleLoginSubmit = (e: CustomEvent) => {
    const { usernameOrEmail, password, rememberMe } = e.detail;
    console.log('Login attempt:', { usernameOrEmail, password, rememberMe });
    
    // Here you would typically call your authentication service
    // For now, just close the modal after a delay
    setTimeout(() => {
      this.loginModalRef.value?.close();
    }, 1000);
  };

  private handleRegisterSubmit = (e: CustomEvent) => {
    const { username, email, password, organization, acceptTerms } = e.detail;
    console.log('Register attempt:', { username, email, password, organization, acceptTerms });
    
    // Here you would typically call your authentication service
    // For now, just close the modal after a delay
    setTimeout(() => {
      this.registerModalRef.value?.close();
    }, 1000);
  };

  // Handle cross-modal navigation
  private handleNavigateToSignup = () => {
    this.loginModalRef.value?.close();
    setTimeout(() => {
      this.registerModalRef.value?.open();
    }, 100);
  };

  private handleNavigateToSignin = () => {
    this.registerModalRef.value?.close();
    setTimeout(() => {
      this.loginModalRef.value?.open();
    }, 100);
  };

  // Handle forgot password flow
  private handleForgotPasswordClick = () => {
    this.loginModalRef.value?.close();
    setTimeout(() => {
      this.forgotPasswordModalRef.value?.open();
    }, 100);
  };

  private handleForgotPasswordSubmit = (e: CustomEvent) => {
    const { email } = e.detail;
    console.log('Password reset requested for:', email);
    
    // Close forgot password modal and show confirmation
    this.forgotPasswordModalRef.value?.close();
    
    // Set email in confirmation modal and open it
    setTimeout(() => {
      if (this.passwordResetConfirmationModalRef.value) {
        this.passwordResetConfirmationModalRef.value.email = email;
        this.passwordResetConfirmationModalRef.value.open();
      }
    }, 100);
  };

  private handleBackToLogin = () => {
    // Close any open modals and return to login
    this.forgotPasswordModalRef.value?.close();
    this.passwordResetConfirmationModalRef.value?.close();
    setTimeout(() => {
      this.loginModalRef.value?.open();
    }, 100);
  };

  private handleResendResetEmail = (e: CustomEvent) => {
    const { email } = e.detail;
    console.log('Resending password reset email to:', email);
    
    // In a real app, you would make an API call here
    // For now, just show the confirmation modal again
    setTimeout(() => {
      if (this.passwordResetConfirmationModalRef.value) {
        this.passwordResetConfirmationModalRef.value.email = email;
        this.passwordResetConfirmationModalRef.value.open();
      }
    }, 100);
  };

  render() {
    const navbarButtons: NavbarButton[] = [
      {
        label: 'Login',
        type: 'secondary',
        handler: this.handleLoginClick
      },
      {
        label: 'Register', 
        type: 'primary',
        handler: this.handleRegisterClick
      }
    ];

    return html`
      <!-- Navbar -->
      <app-navbar .buttons=${navbarButtons}></app-navbar>

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
      <app-footer></app-footer>

      <!-- Login Modal -->
      <login-modal 
        ${ref(this.loginModalRef)}
        @modal-submit=${this.handleLoginSubmit}
        @navigate-to-signup=${this.handleNavigateToSignup}
        @forgot-password-clicked=${this.handleForgotPasswordClick}
      ></login-modal>

      <!-- Register Modal -->
      <register-modal 
        ${ref(this.registerModalRef)}
        @modal-submit=${this.handleRegisterSubmit}
        @navigate-to-signin=${this.handleNavigateToSignin}
      ></register-modal>

      <!-- Forgot Password Modal -->
      <forgot-password-modal 
        ${ref(this.forgotPasswordModalRef)}
        @modal-submit=${this.handleForgotPasswordSubmit}
        @back-to-login=${this.handleBackToLogin}
      ></forgot-password-modal>

      <!-- Password Reset Confirmation Modal -->
      <password-reset-confirmation-modal 
        ${ref(this.passwordResetConfirmationModalRef)}
        @back-to-login=${this.handleBackToLogin}
        @resend-reset-email=${this.handleResendResetEmail}
      ></password-reset-confirmation-modal>
    `;
  }
}