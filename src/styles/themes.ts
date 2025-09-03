import { css } from 'lit';

// Color palette and theme variables
export const themeStyles = css`
  :host,
  :host * {
    --color-primary: #3b82f6;
    --color-primary-dark: #2563eb;
    --color-primary-light: #eff6ff;
    
    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-400: #9ca3af;
    --color-gray-600: #4b5563;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 0.75rem;
    
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
    
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;
    
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
  }
`;