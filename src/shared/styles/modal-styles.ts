import { css } from 'lit';

// Shared modal styles that can be imported into Lit components
// These styles work with Shadow DOM encapsulation

export const modalBackdropStyles = css`
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal-backdrop);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-slow);
  }

  .modal-backdrop.open {
    opacity: 1;
    visibility: visible;
  }

  .modal-backdrop.open .modal {
    transform: scale(1);
  }
`;

export const modalContainerStyles = css`
  .modal {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
    transform: scale(0.9);
    transition: transform var(--transition-slow);
    z-index: var(--z-modal);
    position: relative;
  }

  /* Modal size variants */
  .modal-sm {
    max-width: 400px;
  }

  .modal-md {
    max-width: 450px;
  }

  .modal-lg {
    max-width: 750px;
  }

  @media (max-width: 768px) {
    .modal {
      margin: var(--space-md);
      max-height: 95vh;
      padding: var(--space-lg);
    }
  }
`;

export const modalHeaderStyles = css`
  .modal-header {
    text-align: center;
    margin-bottom: var(--space-lg);
    padding-right: var(--space-2xl);
  }

  .modal-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-sm) 0;
  }

  .modal-subtitle {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .close-btn {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    background: none;
    border: none;
    font-size: var(--font-size-2xl);
    cursor: pointer;
    color: var(--text-secondary);
    width: var(--space-xl);
    height: var(--space-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
  }

  .close-btn:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }
`;

export const modalButtonStyles = css`
  .btn {
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    text-decoration: none;
    display: inline-block;
    text-align: center;
    line-height: var(--line-height-base);
    min-width: 120px;
    box-sizing: border-box;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: var(--text-inverse);
    border-color: var(--color-primary);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--text-secondary);
    border-color: var(--border-color);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .btn-google {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    width: 100%;
  }

  .btn-google:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
`;

export const modalFormStyles = css`
  .form-group {
    margin-bottom: var(--space-lg);
  }

  .form-label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }

  .form-label.required::after {
    content: ' *';
    color: var(--color-danger);
  }

  .form-input {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    transition: border-color var(--transition-base), box-shadow var(--transition-base);
    box-sizing: border-box;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    height: 44px;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .form-input:disabled {
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: not-allowed;
  }

  .form-error {
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    margin-top: var(--space-xs);
    display: block;
  }

  .password-input-container {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: var(--space-sm);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: var(--space-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
    width: 32px;
    height: 32px;
  }

  .password-toggle:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }

  .password-toggle svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

export const modalFooterStyles = css`
  .modal-footer {
    display: flex;
    gap: var(--space-md);
    justify-content: flex-end;
    margin-top: var(--space-xl);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border-color);
  }

  .links {
    text-align: center;
    margin-top: var(--space-lg);
  }

  .link {
    color: var(--color-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: color var(--transition-base);
  }

  .link:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }
`;

// Combined styles for easy importing
export const allModalStyles = [
  modalBackdropStyles,
  modalContainerStyles,
  modalHeaderStyles,
  modalButtonStyles,
  modalFormStyles,
  modalFooterStyles
];