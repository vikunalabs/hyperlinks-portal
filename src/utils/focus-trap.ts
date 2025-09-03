/**
 * Focus trap utility for modals and other focus-containing components
 * Ensures keyboard users cannot tab outside of the modal content
 */
export class FocusTrap {
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private previousActiveElement: Element | null = null;
  private isActive = false;

  private containerElement: Element | ShadowRoot;

  constructor(containerElement: Element | ShadowRoot) {
    this.containerElement = containerElement;
  }

  /**
   * Activates the focus trap
   * @param restoreFocus Element to restore focus to when trap is deactivated
   */
  activate(restoreFocus?: Element): void {
    if (this.isActive) return;

    this.previousActiveElement = restoreFocus || document.activeElement;
    this.updateFocusableElements();
    
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    document.addEventListener('keydown', this.handleKeyDown);
    this.isActive = true;
  }

  /**
   * Deactivates the focus trap and optionally restores focus
   */
  deactivate(): void {
    if (!this.isActive) return;

    document.removeEventListener('keydown', this.handleKeyDown);
    this.isActive = false;

    // Restore focus to the previously active element
    if (this.previousActiveElement) {
      try {
        if ('focus' in this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
          (this.previousActiveElement as HTMLElement).focus();
        }
      } catch (error) {
        // Silently handle focus restoration errors
        console.debug('Focus restoration failed:', error);
      }
    }

    this.previousActiveElement = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
  }

  /**
   * Updates the list of focusable elements within the container
   */
  private updateFocusableElements(): void {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const focusableElements = Array.from(
      this.containerElement.querySelectorAll(focusableSelectors)
    ).filter((element) => {
      // Additional check to ensure element is actually focusable
      const htmlElement = element as HTMLElement;
      return htmlElement.offsetParent !== null && 
             !htmlElement.hidden && 
             htmlElement.style.display !== 'none';
    }) as HTMLElement[];

    this.firstFocusableElement = focusableElements[0] || null;
    this.lastFocusableElement = focusableElements[focusableElements.length - 1] || null;
  }

  /**
   * Handles keyboard navigation within the focus trap
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isActive || event.key !== 'Tab') return;

    this.updateFocusableElements();

    if (!this.firstFocusableElement || !this.lastFocusableElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab: moving backwards
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  };
}

/**
 * Higher-order function to create focus trap functionality for Lit components
 * Usage: Mix this into your component class to get focus trap capabilities
 */
export function withFocusTrap<T extends new (...args: any[]) => any>(Base: T) {
  return class FocusTrapMixin extends Base {
    public focusTrap?: FocusTrap;

    public createFocusTrap(): void {
      if (!this.shadowRoot) {
        console.warn('Focus trap requires shadowRoot to be available');
        return;
      }
      this.focusTrap = new FocusTrap(this.shadowRoot);
    }

    public activateFocusTrap(restoreFocus?: Element): void {
      if (!this.focusTrap) {
        this.createFocusTrap();
      }
      this.focusTrap?.activate(restoreFocus);
    }

    public deactivateFocusTrap(): void {
      this.focusTrap?.deactivate();
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.deactivateFocusTrap();
    }
  };
}