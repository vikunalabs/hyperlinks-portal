// src/components/auth/AuthModalManager.ts
// Manages login and registration modals
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export class AuthModalManager {
  private loginModal: LoginModal | null = null;
  private registerModal: RegisterModal | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.initializeModals();
    this.bindEvents();
  }

  private initializeModals(): void {
    // Create containers for modals
    const loginContainer = document.createElement('div');
    loginContainer.id = 'login-modal-container';
    this.container.appendChild(loginContainer);

    const registerContainer = document.createElement('div');
    registerContainer.id = 'register-modal-container';
    this.container.appendChild(registerContainer);

    // Initialize modal components
    this.loginModal = new LoginModal();
    this.loginModal.render(loginContainer);

    this.registerModal = new RegisterModal();
    this.registerModal.render(registerContainer);
  }

  private bindEvents(): void {
    // Listen for custom events to switch between modals
    window.addEventListener('show-login-modal', this.handleShowLogin.bind(this));
    window.addEventListener('show-register-modal', this.handleShowRegister.bind(this));
  }

  private handleShowLogin(): void {
    this.showLogin();
  }

  private handleShowRegister(): void {
    this.showRegister();
  }

  public showLogin(): void {
    this.registerModal?.close();
    this.loginModal?.open();
  }

  public showRegister(): void {
    this.loginModal?.close();
    this.registerModal?.open();
  }

  public closeAll(): void {
    this.loginModal?.close();
    this.registerModal?.close();
  }

  public destroy(): void {
    this.loginModal?.destroy();
    this.registerModal?.destroy();
    this.loginModal = null;
    this.registerModal = null;
    
    // Clean up event listeners
    window.removeEventListener('show-login-modal', this.handleShowLogin.bind(this));
    window.removeEventListener('show-register-modal', this.handleShowRegister.bind(this));
  }
}