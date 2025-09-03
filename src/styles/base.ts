import { css } from 'lit';

// Shared base styles for all components
export const baseStyles = css`
  :host {
    display: block;
  }
`;

// Common utility classes as CSS
export const utilityStyles = css`
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
  }
  
  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #2563eb;
  }
  
  .btn-secondary {
    background-color: transparent;
    color: #3b82f6;
    border: 1px solid #3b82f6;
  }
  
  .btn-secondary:hover {
    background-color: #eff6ff;
  }
  
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
  }
  
  .icon-lg {
    width: 3rem;
    height: 3rem;
  }
`;