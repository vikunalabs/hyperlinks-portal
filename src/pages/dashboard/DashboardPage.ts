// src/pages/dashboard/DashboardPage.ts
// Dashboard page for authenticated users
import { authStore } from '../../stores/auth.store';
import { appStore } from '../../stores/app.store';
import { appRouter, ROUTES } from '../../router';

export class DashboardPage {
  private container: HTMLElement | null = null;
  private unsubscribeAuth: (() => void) | null = null;

  public render(target: HTMLElement): void {
    this.container = target;
    
    // Subscribe to auth state changes
    this.unsubscribeAuth = authStore.subscribe((state) => {
      if (!state.isAuthenticated) {
        appRouter.navigate(ROUTES.LOGIN);
      }
    });

    this.renderContent();
  }

  private renderContent(): void {
    if (!this.container) return;

    const { user } = authStore.getState();
    
    this.container.innerHTML = `
      <app-shell
        header-fixed="true"
        sidebar-open="false"
        header-classes="bg-white shadow border-b border-gray-200"
        main-classes="bg-gray-50 min-h-screen"
      >
        <!-- Header Content -->
        <div slot="header" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">
                Hyperlinks Management Platform
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                Welcome, ${user?.name || user?.username || 'User'}
              </span>
              <button
                id="logout-button"
                class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div slot="main" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <!-- Welcome Section -->
            <ui-card
              title="Welcome to Your Dashboard"
              classes="mb-6 bg-white shadow rounded-lg"
              header-classes="px-4 py-5 sm:p-6 border-b border-gray-200"
              body-classes="px-4 py-5 sm:p-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- User Info Card -->
                <ui-card
                  title="Account Information"
                  classes="bg-indigo-50 rounded-lg"
                  header-classes="px-4 pt-4 pb-2"
                  body-classes="px-4 pb-4"
                  title-classes="text-sm font-medium text-indigo-800"
                >
                  <div class="text-sm text-indigo-600 space-y-1">
                    <p><span class="font-medium">Email:</span> ${user?.email || 'N/A'}</p>
                    <p><span class="font-medium">Username:</span> ${user?.username || 'N/A'}</p>
                    ${user?.organization ? `<p><span class="font-medium">Organization:</span> ${user.organization}</p>` : ''}
                    <p><span class="font-medium">Email Verified:</span> 
                      <span class="${user?.emailVerified ? 'text-green-600' : 'text-red-600'}">
                        ${user?.emailVerified ? 'Yes' : 'No'}
                      </span>
                    </p>
                  </div>
                </ui-card>

                <!-- Roles Card -->
                <ui-card
                  title="Your Roles"
                  classes="bg-green-50 rounded-lg"
                  header-classes="px-4 pt-4 pb-2"
                  body-classes="px-4 pb-4"
                  title-classes="text-sm font-medium text-green-800"
                >
                  <div class="mt-1">
                    ${user?.roles && user.roles.length > 0 
                      ? user.roles.map(role => `
                          <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1">
                            ${role}
                          </span>
                        `).join('')
                      : '<span class="text-sm text-green-600">No roles assigned</span>'
                    }
                  </div>
                </ui-card>

                <!-- Status Card -->
                <ui-card
                  title="Account Status"
                  classes="bg-blue-50 rounded-lg"
                  header-classes="px-4 pt-4 pb-2"
                  body-classes="px-4 pb-4"
                  title-classes="text-sm font-medium text-blue-800"
                >
                  <div class="text-sm text-blue-600 space-y-1">
                    <p>✅ Successfully authenticated</p>
                    <p>🔒 Secure session active</p>
                    ${!user?.emailVerified ? '<p>⚠️ Please verify your email</p>' : ''}
                  </div>
                </ui-card>
              </div>
            </ui-card>

            <!-- Coming Soon Section -->
            <ui-card
              title="Coming Soon"
              classes="bg-white shadow rounded-lg"
              header-classes="px-4 py-5 sm:p-6 border-b border-gray-200"
              body-classes="px-4 py-5 sm:p-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- URL Shortening -->
                <ui-card classes="text-center p-6 bg-gray-50 rounded-lg">
                  <div class="text-3xl mb-2">🔗</div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">URL Shortening</h3>
                  <p class="text-gray-600 text-sm">Create and manage short links for your URLs</p>
                </ui-card>

                <!-- QR Code Generation -->
                <ui-card classes="text-center p-6 bg-gray-50 rounded-lg">
                  <div class="text-3xl mb-2">📱</div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">QR Code Generation</h3>
                  <p class="text-gray-600 text-sm">Generate QR codes for your links and content</p>
                </ui-card>

                <!-- Analytics -->
                <ui-card classes="text-center p-6 bg-gray-50 rounded-lg">
                  <div class="text-3xl mb-2">📊</div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
                  <p class="text-gray-600 text-sm">Track performance and engagement metrics</p>
                </ui-card>
              </div>

              <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">
                  These features will be available in upcoming releases as we complete Phase B and beyond.
                </p>
              </div>
            </ui-card>
          </div>
        </div>
      </app-shell>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.container) return;

    // Handle logout button
    const logoutButton = this.container.querySelector('#logout-button');
    logoutButton?.addEventListener('click', this.handleLogout.bind(this));
  }

  private async handleLogout(): Promise<void> {
    try {
      await authStore.getState().logout();
      
      appStore.getState().showNotification({
        type: 'success',
        message: 'Successfully signed out',
        duration: 3000
      });

      appRouter.navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      
      appStore.getState().showNotification({
        type: 'error',
        message: 'Error signing out',
        duration: 3000
      });

      // Force navigation to login even if logout failed
      appRouter.navigate(ROUTES.LOGIN);
    }
  }

  public destroy(): void {
    // Clean up subscriptions
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
    
    this.container = null;
  }
}