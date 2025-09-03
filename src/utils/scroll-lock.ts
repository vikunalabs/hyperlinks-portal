/**
 * Utility to lock/unlock body scroll while preventing layout shift
 * Uses a reliable method that works across all browsers and CSS frameworks
 */

class ScrollLock {
  private lockCount: number = 0;
  private scrollbarWidth: number = 0;
  private initialBodyStyle: {
    overflow: string;
    paddingRight: string;
    position: string;
    top: string;
    width: string;
  } = {
    overflow: '',
    paddingRight: '',
    position: '',
    top: '',
    width: ''
  };
  private scrollPosition: number = 0;

  constructor() {
    this.calculateScrollbarWidth();
  }

  /**
   * Calculate scrollbar width using the most reliable method
   */
  private calculateScrollbarWidth(): void {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      top: -9999px;
      width: 100px;
      height: 100px;
      overflow: scroll;
      -ms-overflow-style: scrollbar;
    `;
    
    document.body.appendChild(container);
    
    // Calculate scrollbar width
    this.scrollbarWidth = container.offsetWidth - container.clientWidth;
    
    // Clean up
    document.body.removeChild(container);
    
    // Fallback for cases where scrollbar width is 0
    if (this.scrollbarWidth === 0) {
      this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    }
  }

  /**
   * Lock body scroll with layout shift prevention
   */
  lock(): void {
    if (this.lockCount === 0) {
      // Store current scroll position
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Store original body styles
      const computedStyle = window.getComputedStyle(document.body);
      this.initialBodyStyle.overflow = document.body.style.overflow;
      this.initialBodyStyle.paddingRight = document.body.style.paddingRight;
      this.initialBodyStyle.position = document.body.style.position;
      this.initialBodyStyle.top = document.body.style.top;
      this.initialBodyStyle.width = document.body.style.width;

      // Apply styles to prevent scroll and layout shift
      const currentPaddingRight = parseInt(computedStyle.paddingRight, 10) || 0;
      
      // Only add scrollbar compensation if there's a vertical scrollbar
      const hasVerticalScrollbar = document.documentElement.scrollHeight > window.innerHeight;
      const scrollbarCompensation = hasVerticalScrollbar ? this.scrollbarWidth : 0;

      // Apply the lock styles
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarCompensation}px`;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
    }
    
    this.lockCount++;
  }

  /**
   * Unlock body scroll and restore original styles
   */
  unlock(): void {
    if (this.lockCount > 0) {
      this.lockCount--;
      
      if (this.lockCount === 0) {
        // Restore original styles
        document.body.style.overflow = this.initialBodyStyle.overflow;
        document.body.style.paddingRight = this.initialBodyStyle.paddingRight;
        document.body.style.position = this.initialBodyStyle.position;
        document.body.style.top = this.initialBodyStyle.top;
        document.body.style.width = this.initialBodyStyle.width;
        
        // Restore scroll position
        window.scrollTo(0, this.scrollPosition);
      }
    }
  }

  /**
   * Get current lock count
   */
  getLockCount(): number {
    return this.lockCount;
  }

  /**
   * Force unlock (useful for cleanup)
   */
  forceUnlock(): void {
    this.lockCount = 0;
    document.body.style.overflow = this.initialBodyStyle.overflow;
    document.body.style.paddingRight = this.initialBodyStyle.paddingRight;
    document.body.style.position = this.initialBodyStyle.position;
    document.body.style.top = this.initialBodyStyle.top;
    document.body.style.width = this.initialBodyStyle.width;
    window.scrollTo(0, this.scrollPosition);
  }
}

// Create singleton instance
export const scrollLock = new ScrollLock();