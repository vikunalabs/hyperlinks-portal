// src/services/modal.service.ts
// Global modal service to manage auth modals across the app
import { AuthModalManager } from '../components/auth';

class ModalService {
  private authModalManager: AuthModalManager | null = null;

  public initializeAuthModals(container: HTMLElement): void {
    if (!this.authModalManager) {
      this.authModalManager = new AuthModalManager(container);
    }
  }

  public showLogin(): void {
    if (this.authModalManager) {
      this.authModalManager.showLogin();
    } else {
      console.warn('[ModalService] Auth modals not initialized, falling back to page navigation');
      // Fallback to page navigation if modals not available
      import('../router').then(({ appRouter, ROUTES }) => {
        appRouter.navigate(ROUTES.LOGIN);
      });
    }
  }

  public showRegister(): void {
    if (this.authModalManager) {
      this.authModalManager.showRegister();
    } else {
      console.warn('[ModalService] Auth modals not initialized, falling back to page navigation');
      // Fallback to page navigation if modals not available
      import('../router').then(({ appRouter, ROUTES }) => {
        appRouter.navigate(ROUTES.REGISTER);
      });
    }
  }

  public closeAuthModals(): void {
    this.authModalManager?.closeAll();
  }

  public destroy(): void {
    this.authModalManager?.destroy();
    this.authModalManager = null;
  }
}

// Singleton instance
export const modalService = new ModalService();