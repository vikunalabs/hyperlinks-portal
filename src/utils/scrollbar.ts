/**
 * Calculates the width of the browser's scrollbar
 * This is used to prevent layout shift when modals open and hide the scrollbar
 */
export function getScrollbarWidth(): number {
  // Create a temporary element to measure scrollbar width
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.msOverflowStyle = 'scrollbar'; // Needed for IE
  document.body.appendChild(outer);

  // Create inner element
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculate the difference
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Clean up
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

/**
 * Sets the scrollbar width as a CSS custom property
 * This should be called once when the app initializes
 */
export function setScrollbarWidthProperty(): void {
  const scrollbarWidth = getScrollbarWidth();
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

/**
 * Manages body classes and scrollbar compensation for modals
 */
export class ModalScrollManager {
  private static openModalCount = 0;

  /**
   * Call this when a modal opens
   */
  static openModal(): void {
    if (this.openModalCount === 0) {
      // Only apply changes when the first modal opens
      document.body.classList.add('modal-open');
    }
    this.openModalCount++;
  }

  /**
   * Call this when a modal closes
   */
  static closeModal(): void {
    this.openModalCount--;
    if (this.openModalCount <= 0) {
      // Remove changes when all modals are closed
      this.openModalCount = 0;
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * Get the current number of open modals
   */
  static getOpenModalCount(): number {
    return this.openModalCount;
  }

  /**
   * Force close all modals (useful for cleanup)
   */
  static reset(): void {
    this.openModalCount = 0;
    document.body.classList.remove('modal-open');
  }
}